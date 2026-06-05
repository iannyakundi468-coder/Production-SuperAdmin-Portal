import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import SomoBloomLogo from './SomoBloomLogo';

export default function AnimatedIntro({ onComplete }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    // Phase 0: Show Solian Wolves Logo
    const timer1 = setTimeout(() => {
      setPhase(1); // Transition out Solian, Transition in SomoBloom
    }, 2000);

    const timer2 = setTimeout(() => {
      setPhase(2); // Fade out whole intro
    }, 4500);

    const timer3 = setTimeout(() => {
      onComplete();
    }, 5000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase < 2 && (
        <motion.div
          key="intro-container"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0a] overflow-hidden"
        >
          {/* Solian Wolves Phase */}
          <AnimatePresence>
            {phase === 0 && (
              <motion.div
                key="solian-wolves"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, x: -100, filter: 'blur(10px)' }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute flex flex-col items-center"
              >
                <div className="w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-white flex items-center justify-center mb-6 overflow-hidden bg-black p-4">
                  {/* Since I can't download the chat image directly, assuming the user places it as solian-wolves-logo.png in public folder, or falling back to text if not found. We will use an img tag. */}
                  <img src="/solian-wolves-logo.png" alt="The Solian Wolves" className="w-full h-full object-contain" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                  <div className="hidden flex-col items-center text-white text-center">
                    <span className="text-4xl">🐺</span>
                  </div>
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-white tracking-widest uppercase text-center font-sans">
                  The Solian Wolves
                </h1>
                <p className="text-white/70 text-sm md:text-base tracking-[0.2em] mt-2 uppercase">
                  Software Company Limited
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SomoBloom Phase */}
          <AnimatePresence>
            {phase === 1 && (
              <motion.div
                key="somobloom"
                initial={{ opacity: 0, x: 100, filter: 'blur(10px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="absolute flex flex-col items-center"
              >
                <div className="inline-flex items-center justify-center p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-[3rem] shadow-2xl mb-8">
                  <SomoBloomLogo size={100} showText={false} />
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight flex items-center gap-2 justify-center">
                  Somo<span className="text-indigo-400">Bloom</span>
                </h1>
                <p className="text-slate-300 text-lg md:text-xl mt-4 font-medium tracking-wide">
                  Empowering Education
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
