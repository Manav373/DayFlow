import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Layers
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  monthlyAttendanceTrends,
  departmentDistributionData,
  payrollExpenditureData
} from '../data/mockData';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';

export const Reports: React.FC = () => {
  const [dateRange, setDateRange] = useState('Last 6 Months');
  const COLORS = ['#4f46e5', '#818cf8', '#10b981', '#f59e0b', '#06b6d4', '#8b5cf6'];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Workforce Analytics & Reports
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Key telemetry across attendance, departmental headcount, and payroll allocation
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold"
          >
            <option>Last 30 Days</option>
            <option>Last 6 Months</option>
            <option>Year to Date (2026)</option>
          </select>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Retention Rate"
          value="97.4%"
          change="+1.2%"
          trend="up"
          subtitle="Annual average"
          icon={TrendingUp}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50 dark:bg-emerald-950/50"
        />
        <StatCard
          title="Average Tenure"
          value="2.8 yrs"
          change="Consistent growth"
          trend="up"
          icon={Users}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50 dark:bg-indigo-950/50"
        />
        <StatCard
          title="Avg Monthly Payroll"
          value="$567,500"
          subtitle="Across 80+ employees"
          icon={BarChart3}
          iconColor="text-blue-600"
          iconBg="bg-blue-50 dark:bg-blue-950/50"
        />
        <StatCard
          title="Attendance Stability"
          value="95.2%"
          change="Above 95% SLA"
          trend="up"
          icon={Layers}
          iconColor="text-purple-600"
          iconBg="bg-purple-50 dark:bg-purple-950/50"
        />
      </div>

      {/* Chart Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-soft">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Attendance & Punctuality Trend (%)
              </h2>
              <p className="text-xs text-slate-500">Monthly percentage of on-time check-ins</p>
            </div>
            <Badge variant="success" size="sm">96% Target</Badge>
          </div>

          <div className="h-72 mt-4 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyAttendanceTrends}>
                <defs>
                  <linearGradient id="presentGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                <YAxis domain={[85, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="present"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#presentGrad2)"
                  name="Present %"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Headcount Pie */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-soft">
          <div className="pb-4 border-b border-slate-100 dark:border-slate-700">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Headcount Distribution
            </h2>
            <p className="text-xs text-slate-500">Staff ratio across departments</p>
          </div>

          <div className="h-56 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {departmentDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs mt-2">
            {departmentDistributionData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="text-slate-600 dark:text-slate-300 font-medium truncate">{d.name}</span>
                <span className="text-slate-400 font-mono">({d.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Row 2 */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-soft">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Payroll Expenditure Evolution ($ USD)
            </h2>
            <p className="text-xs text-slate-500">Monthly gross compensation, tax reserves, and bonuses</p>
          </div>
          <Badge variant="primary" size="sm">H1 + Q3 2026</Badge>
        </div>

        <div className="h-80 mt-6 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={payrollExpenditureData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
                tickFormatter={(val) => `$${val / 1000}k`}
              />
              <Tooltip
                formatter={(value: any) => [`$${Number(value).toLocaleString()}`, '']}
                contentStyle={{
                  backgroundColor: '#1e293b',
                  borderRadius: '12px',
                  border: 'none',
                  color: '#fff',
                  fontSize: '12px'
                }}
              />
              <Legend />
              <Bar dataKey="total" name="Gross Salary" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              <Bar dataKey="taxes" name="Tax Withholdings" fill="#06b6d4" radius={[6, 6, 0, 0]} />
              <Bar dataKey="bonus" name="Performance Bonus" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
