import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const TopLoadingBar: React.FC = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <AnimatePresence>
      {loading && (
        <div className="fixed top-0 left-0 right-0 z-[99999] h-1 pointer-events-none overflow-hidden bg-transparent">
          <motion.div
            initial={{ x: '-100%', opacity: 1 }}
            animate={{ x: '0%' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.65, 0, 0.35, 1] }}
            className="h-full w-full bg-gradient-to-r from-brand-600 via-indigo-400 to-emerald-400 shadow-md shadow-brand-500/50 relative"
          >
            {/* Glowing lead tip */}
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-white/60 blur-xs" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
