import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  badgeText?: string;
  badgeVariant?: 'success' | 'warning' | 'danger' | 'info';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  trend = 'up',
  subtitle,
  icon: Icon,
  iconColor = 'text-indigo-600',
  iconBg = 'bg-indigo-50 dark:bg-indigo-950/50',
  badgeText,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.015, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      className="relative group bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 p-5.5 shadow-soft hover:shadow-elevated transition-all duration-300 overflow-hidden"
    >
      {/* Subtle hover gradient sheen */}
      <div className="absolute inset-0 bg-gradient-to-tr from-brand-500/0 via-brand-500/0 to-brand-500/5 dark:to-brand-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
          {title}
        </span>
        <motion.div
          whileHover={{ rotate: 10, scale: 1.1 }}
          className={`p-2.5 rounded-2xl ${iconBg} ${iconColor} shadow-xs`}
        >
          <Icon className="w-5 h-5" />
        </motion.div>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {value}
        </span>
        {badgeText && (
          <span className="text-xs px-2 py-0.5 font-bold rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800">
            {badgeText}
          </span>
        )}
      </div>

      {(change || subtitle) && (
        <div className="mt-2.5 flex items-center gap-1.5 text-xs">
          {change && (
            <span
              className={`font-bold flex items-center gap-0.5 ${
                trend === 'up'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : trend === 'down'
                  ? 'text-rose-600 dark:text-rose-400'
                  : 'text-slate-500'
              }`}
            >
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '•'} {change}
            </span>
          )}
          {subtitle && <span className="text-slate-400 dark:text-slate-500 font-medium">{subtitle}</span>}
        </div>
      )}
    </motion.div>
  );
};
