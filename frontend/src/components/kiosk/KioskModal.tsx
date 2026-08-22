import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, KeyRound, Clock } from 'lucide-react';
import { useHRMS } from '../../context/HRMSContext';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../common/Modal';

interface KioskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KioskModal: React.FC<KioskModalProps> = ({ isOpen, onClose }) => {
  const { employees, togglePunch } = useHRMS();
  const { user } = useAuth();
  const isManager = user?.role === 'admin' || user?.role === 'hr_officer';

  const [pin, setPin] = useState('');
  const [selectedEmpId, setSelectedEmpId] = useState('');
  const [punchResult, setPunchResult] = useState<{ success: boolean; msg: string; name?: string } | null>(null);

  const handleKeyClick = (val: string) => {
    if (pin.length < 4) {
      setPin((prev) => prev + val);
    }
  };

  const handleClear = () => {
    setPin('');
    setPunchResult(null);
  };

  const handlePunchSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    let targetEmp = employees.find((emp) => emp.hrSettings.pinCode === pin || emp.employeeId === selectedEmpId);

    if (!targetEmp) {
      setPunchResult({ success: false, msg: 'Invalid PIN or Employee selection. Please retry.' });
      return;
    }

    await togglePunch(pin || targetEmp.hrSettings.badgeId);
    setPunchResult({
      success: true,
      name: targetEmp.name,
      msg: `Attendance recorded successfully for ${targetEmp.name} at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    });

    setTimeout(() => {
      setPin('');
      setSelectedEmpId('');
      setPunchResult(null);
      onClose();
    }, 2200);
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Office Attendance Kiosk"
      subtitle="Enter your 4-digit PIN or select profile to Check-In / Out"
      maxWidth="md"
    >
      <div className="space-y-5">
        {punchResult ? (
          <div
            className={`p-6 rounded-2xl text-center space-y-2 ${
              punchResult.success
                ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-200 border border-rose-200'
            }`}
          >
            {punchResult.success ? (
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            ) : (
              <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
            )}
            <h3 className="text-base font-bold">{punchResult.name || 'Notice'}</h3>
            <p className="text-xs">{punchResult.msg}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Quick Employee Select */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Select Team Member
              </label>
              <select
                value={selectedEmpId}
                onChange={(e) => setSelectedEmpId(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
              >
                <option value="">-- Choose Employee --</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.employeeId}>
                    {emp.name} ({emp.employeeId}) • {emp.workInfo.department} {isManager ? `(PIN: ${emp.hrSettings.pinCode})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* PIN Code Display */}
            <div className="text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                4-Digit Security PIN
              </span>
              <div className="flex justify-center gap-3 my-2">
                {[0, 1, 2, 3].map((idx) => (
                  <div
                    key={idx}
                    className={`w-10 h-12 rounded-xl border-2 flex items-center justify-center text-lg font-bold font-mono transition ${
                      pin[idx]
                        ? 'border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-300'
                    }`}
                  >
                    {pin[idx] ? '•' : ''}
                  </div>
                ))}
              </div>
            </div>

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'OK'].map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    if (key === 'C') handleClear();
                    else if (key === 'OK') handlePunchSubmit();
                    else handleKeyClick(key);
                  }}
                  className={`py-3 rounded-xl font-bold text-sm transition shadow-xs ${
                    key === 'OK'
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : key === 'C'
                      ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300'
                      : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-white'
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
