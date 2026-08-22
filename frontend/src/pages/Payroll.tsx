import React, { useState } from 'react';
import {
  CreditCard,
  DollarSign,
  FileText,
  CheckCircle,
  Clock,
  Search,
  Printer
} from 'lucide-react';
import { useHRMS } from '../context/HRMSContext';
import { useAuth } from '../context/AuthContext';
import { PayrollRecord } from '../types';
import { Badge } from '../components/common/Badge';
import { StatCard } from '../components/common/StatCard';
import { Modal } from '../components/common/Modal';

export const Payroll: React.FC = () => {
  const {
    payrollRecords,
    updatePayrollStatus,
    stats,
    employees
  } = useHRMS();

  const { user } = useAuth();
  const isManager = user?.role === 'admin' || user?.role === 'hr_officer';
  const currentEmp = employees.find(e => e.employeeId === user?.employeeId) || employees[0];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedPayslip, setSelectedPayslip] = useState<PayrollRecord | null>(null);

  const recordsToDisplay = isManager
    ? payrollRecords
    : payrollRecords.filter((p) => p.employeeId === user?.employeeId || p.employeeName === user?.name);

  const totalDisbursed = recordsToDisplay.reduce((acc, curr) => acc + curr.netSalary, 0);
  const totalTaxes = recordsToDisplay.reduce((acc, curr) => acc + curr.taxDeduction, 0);
  const totalGross = recordsToDisplay.reduce((acc, curr) => acc + curr.grossSalary, 0);

  const filteredRecords = recordsToDisplay.filter((rec) => {
    const matchesSearch =
      rec.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === 'All' || rec.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const handleRunBatch = () => {
    payrollRecords.forEach((p) => {
      if (p.status === 'Processing' || p.status === 'Pending') {
        updatePayrollStatus(p.id, 'Paid');
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {isManager ? 'Payroll Management' : 'My Payslips & Compensation'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isManager
              ? 'August 2026 disbursement cycle & automated tax deductions'
              : 'View and download your monthly salary statements, taxes, and benefits'}
          </p>
        </div>

        {isManager && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleRunBatch}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition"
            >
              <CheckCircle className="w-4 h-4" />
              Approve & Disburse Batch
            </button>
          </div>
        )}
      </div>

      {/* KPI Stats */}
      {isManager ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Total Net Payout"
            value={`$${totalDisbursed.toLocaleString()}`}
            change="August 2026 cycle"
            trend="up"
            icon={DollarSign}
            iconColor="text-emerald-600"
            iconBg="bg-emerald-50 dark:bg-emerald-950/50"
          />
          <StatCard
            title="Gross Payroll"
            value={`$${totalGross.toLocaleString()}`}
            subtitle="Before deductions"
            icon={CreditCard}
            iconColor="text-indigo-600"
            iconBg="bg-indigo-50 dark:bg-indigo-950/50"
          />
          <StatCard
            title="Taxes & PF Withheld"
            value={`$${totalTaxes.toLocaleString()}`}
            subtitle="Remitted to authorities"
            icon={FileText}
            iconColor="text-blue-600"
            iconBg="bg-blue-50 dark:bg-blue-950/50"
          />
          <StatCard
            title="Pending Approvals"
            value={stats.payrollProcessing}
            change={stats.payrollProcessing > 0 ? "Requires admin signoff" : "All cleared"}
            trend={stats.payrollProcessing > 0 ? "neutral" : "up"}
            icon={Clock}
            iconColor="text-amber-600"
            iconBg="bg-amber-50 dark:bg-amber-950/50"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StatCard
            title="Last Net Salary"
            value={`$${filteredRecords[0]?.netSalary.toLocaleString() || '9,600'}`}
            subtitle="Deposited on 1st of month"
            icon={DollarSign}
            iconColor="text-emerald-600"
            iconBg="bg-emerald-50 dark:bg-emerald-950/50"
          />
          <StatCard
            title="Monthly Basic Pay"
            value={`$${filteredRecords[0]?.basicSalary.toLocaleString() || '8,500'}`}
            subtitle="Base contract rate"
            icon={CreditCard}
            iconColor="text-indigo-600"
            iconBg="bg-indigo-50 dark:bg-indigo-950/50"
          />
          <StatCard
            title="Tax & Benefits Withheld"
            value={`$${((filteredRecords[0]?.taxDeduction || 1400) + (filteredRecords[0]?.providentFund || 650)).toLocaleString()}`}
            subtitle="Provident Fund & Income Tax"
            icon={FileText}
            iconColor="text-blue-600"
            iconBg="bg-blue-50 dark:bg-blue-950/50"
          />
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-4 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isManager ? "Search payroll by employee name or ID..." : "Filter your salary periods..."}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-medium"
          >
            <option value="All">All Payroll Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Processing">Processing</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-6 py-4">{isManager ? 'Employee' : 'Pay Period'}</th>
                <th className="px-6 py-4">Basic Pay</th>
                <th className="px-6 py-4">Allowances & Bonus</th>
                <th className="px-6 py-4">Gross Total</th>
                <th className="px-6 py-4">Deductions</th>
                <th className="px-6 py-4">Net Salary</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {filteredRecords.map((pay) => (
                <tr key={pay.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/40 transition">
                  <td className="px-6 py-4">
                    {isManager ? (
                      <div className="flex items-center gap-3">
                        <img src={pay.employeeAvatar} alt={pay.employeeName} className="w-9 h-9 rounded-full object-cover" />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">{pay.employeeName}</div>
                          <div className="text-[11px] text-slate-400">{pay.designation}</div>
                        </div>
                      </div>
                    ) : (
                      <div className="font-bold text-slate-900 dark:text-white">
                        {pay.payPeriod}
                        <div className="text-[11px] font-normal text-slate-400">Disbursed on {pay.paymentDate}</div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 font-mono font-medium">${pay.basicSalary.toLocaleString()}</td>
                  <td className="px-6 py-4 font-mono font-medium text-emerald-600">
                    +${(pay.hra + pay.allowances + pay.bonus).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                    ${pay.grossSalary.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 font-mono text-rose-500">
                    -${(pay.taxDeduction + pay.providentFund + pay.otherDeductions).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 font-mono font-black text-slate-900 dark:text-white text-sm">
                    ${pay.netSalary.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={pay.status === 'Paid' ? 'success' : pay.status === 'Processing' ? 'warning' : 'neutral'}
                      size="sm"
                      dot
                    >
                      {pay.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedPayslip(pay)}
                      className="px-3 py-1.5 bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/40 text-brand-600 dark:text-brand-300 font-bold rounded-xl transition"
                    >
                      View Payslip
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payslip View Modal */}
      {selectedPayslip && (
        <Modal
          isOpen={!!selectedPayslip}
          onClose={() => setSelectedPayslip(null)}
          title={`Payslip Statement - ${selectedPayslip.payPeriod}`}
          subtitle={`Dayflow Technologies Inc. • ${selectedPayslip.employeeId}`}
          maxWidth="2xl"
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/40 rounded-2xl border border-slate-100 dark:border-slate-700">
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">{selectedPayslip.employeeName}</div>
                <div className="text-xs text-slate-500">{selectedPayslip.designation} • {selectedPayslip.department}</div>
              </div>
              <Badge variant={selectedPayslip.status === 'Paid' ? 'success' : 'warning'} size="md">
                Status: {selectedPayslip.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-6 text-xs">
              <div className="space-y-2 border-r border-slate-100 dark:border-slate-700 pr-4">
                <div className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] text-emerald-600">
                  Earnings Breakdown
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700/50">
                  <span className="text-slate-500">Basic Salary</span>
                  <span className="font-semibold">${selectedPayslip.basicSalary.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700/50">
                  <span className="text-slate-500">House Rent (HRA)</span>
                  <span className="font-semibold">${selectedPayslip.hra.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700/50">
                  <span className="text-slate-500">Special Allowances</span>
                  <span className="font-semibold">${selectedPayslip.allowances.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Performance Bonus</span>
                  <span className="font-semibold">${selectedPayslip.bonus.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700 font-bold">
                  <span>Gross Earnings</span>
                  <span className="text-slate-900 dark:text-white">${selectedPayslip.grossSalary.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] text-rose-600">
                  Deductions Breakdown
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700/50">
                  <span className="text-slate-500">Tax Deducted at Source (TDS)</span>
                  <span className="font-semibold">-${selectedPayslip.taxDeduction.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700/50">
                  <span className="text-slate-500">Provident Fund (PF)</span>
                  <span className="font-semibold">-${selectedPayslip.providentFund.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Other Deductions</span>
                  <span className="font-semibold">-${selectedPayslip.otherDeductions.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700 font-bold">
                  <span>Total Deductions</span>
                  <span className="text-rose-600">
                    -${(selectedPayslip.taxDeduction + selectedPayslip.providentFund + selectedPayslip.otherDeductions).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">NET DISBURSED SALARY</span>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400">Transferred on {selectedPayslip.paymentDate}</p>
              </div>
              <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300">
                ${selectedPayslip.netSalary.toLocaleString()}
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              {isManager && selectedPayslip.status !== 'Paid' && (
                <button
                  onClick={() => {
                    updatePayrollStatus(selectedPayslip.id, 'Paid');
                    setSelectedPayslip(null);
                  }}
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition"
                >
                  Mark as Paid
                </button>
              )}
              <button
                onClick={() => window.print()}
                className="ml-auto flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 rounded-xl transition"
              >
                <Printer className="w-4 h-4" />
                Print / Export Payslip
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
