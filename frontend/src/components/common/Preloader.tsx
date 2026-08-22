import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export const Preloader: React.FC = () => {
  const [isVisible, setIsVisible] = useState(() => {
    const hasLoaded = sessionStorage.getItem('dayflow_preloader_shown');
    return !hasLoaded;
  });

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        sessionStorage.setItem('dayflow_preloader_shown', 'true');
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[999999] bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex flex-col items-center justify-center text-white p-6"
        >
          {/* Animated Halo background */}
          <motion.div
            animate={{
              scale: [1, 1.25, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute w-72 h-72 rounded-full bg-brand-500/20 blur-3xl pointer-events-none"
          />

          <div className="relative z-10 flex flex-col items-center text-center space-y-5">
            {/* Animated Logo Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-emerald-400 flex items-center justify-center text-white shadow-2xl shadow-brand-500/40"
            >
              <Sparkles className="w-8 h-8 animate-pulse" />
            </motion.div>

            {/* Brand Title */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-1"
            >
              <h1 className="text-2xl md:text-3xl font-black tracking-wider bg-gradient-to-r from-white via-indigo-200 to-slate-300 bg-clip-text text-transparent">
                DAYFLOW
              </h1>
              <p className="text-xs uppercase font-bold tracking-widest text-indigo-300">
                Unified HRMS Portal
              </p>
            </motion.div>

            {/* Loading Bar */}
            <div className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden relative mt-4">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{
                  repeat: Infinity,
                  duration: 1,
                  ease: 'easeInOut',
                }}
                className="h-full w-24 bg-gradient-to-r from-transparent via-brand-400 to-transparent rounded-full"
              />
            </div>

            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-[11px] font-mono text-slate-400 tracking-wider"
            >
              Initializing workspace...
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
