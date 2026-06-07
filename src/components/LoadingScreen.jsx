import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 500);
          return 100;
        }
        return prev + Math.random() * 15 + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black"
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          <div className="relative flex flex-col items-center">
            {/* Animated Football */}
            <motion.div
              className="relative w-32 h-32 mb-8"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <defs>
                  <radialGradient id="ballGrad" cx="30%" cy="30%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor="#94a3b8" />
                  </radialGradient>
                </defs>
                <circle cx="50" cy="50" r="48" fill="url(#ballGrad)" stroke="#1e293b" strokeWidth="1" />
                {/* Pentagon pattern */}
                <path d="M50 15 L62 35 L50 55 L38 35 Z" fill="#1e293b" opacity="0.9" />
                <path d="M22 40 L38 35 L35 58 L18 60 Z" fill="#1e293b" opacity="0.9" />
                <path d="M78 40 L62 35 L65 58 L82 60 Z" fill="#1e293b" opacity="0.9" />
                <path d="M35 58 L50 75 L50 55 Z" fill="#1e293b" opacity="0.9" />
                <path d="M65 58 L50 75 L50 55 Z" fill="#1e293b" opacity="0.9" />
                <path d="M18 60 L35 58 L42 85 L25 82 Z" fill="#1e293b" opacity="0.9" />
                <path d="M82 60 L65 58 L58 85 L75 82 Z" fill="#1e293b" opacity="0.9" />
                <path d="M42 85 L50 95 L50 75 Z" fill="#1e293b" opacity="0.9" />
                <path d="M58 85 L50 95 L50 75 Z" fill="#1e293b" opacity="0.9" />
              </svg>
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-xl animate-pulse" />
            </motion.div>

            {/* FIFA 2026 Text */}
            <motion.h1
              className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 tracking-wider"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              FIFA WORLD CUP
            </motion.h1>
            <motion.p
              className="text-2xl md:text-4xl font-bold text-yellow-400 mt-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              2026™
            </motion.p>

            {/* Progress Bar */}
            <div className="w-64 h-1 bg-gray-800 rounded-full mt-8 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <p className="text-gray-500 text-sm mt-4 font-mono">LOADING EXPERIENCE...</p>
          </div>

          {/* Floating particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400/60 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                opacity: 0,
              }}
              animate={{
                y: [null, -Math.random() * 200 - 100],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 2 + 1,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}