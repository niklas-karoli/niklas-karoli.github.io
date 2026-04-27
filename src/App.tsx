import { useState, useEffect } from 'react';
import { Terminal, Shield, Cpu, Zap, Code, ChevronRight, Lock, Trophy, Target, Clock, Eye, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from './utils/cn';
import { useProgress } from './hooks/useProgress';
import type { WorldId } from './types';
import { KryptografieWorld } from './worlds/KryptografieWorld';
import { BinarWorld } from './worlds/BinarWorld';
import { FusionWorld } from './worlds/FusionWorld';
import { PythonWorld } from './worlds/PythonWorld';

// Placeholder worlds components

const WORLDS_CONFIG: { id: WorldId; title: string; description: string; icon: any }[] = [
  { id: 'kryptografie', title: 'Kryptografie', description: 'Von Cäsar bis Vigenère – lerne die Kunst der Geheimschriften.', icon: Shield },
  { id: 'binar', title: 'Binärzahlen', description: 'Die Welt von 0 und 1. Lerne wie Computer denken.', icon: Cpu },
  { id: 'fusion', title: 'Die Fusion', description: 'Kombiniere Logik und Verschlüsselung mit XOR.', icon: Zap },
  { id: 'python', title: 'Python Workshop', description: 'Werde zum Hacker und knacke Codes mit Python.', icon: Code },
];

function App() {
  const { progress, setCurrentWorld, unlockAll, resetProgress, completeWorld, unlockWorld, manualUnlock } = useProgress();
  const [showDashboard, setShowDashboard] = useState(true);
  const [backdoorCount, setBackdoorCount] = useState(0);
  const [showSolutions, setShowSolutions] = useState(false);
  const [showRecoveryBackdoor, setShowRecoveryBackdoor] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'X') {
            setShowSolutions(prev => !prev);
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleBackdoor = () => {
    setBackdoorCount(prev => prev + 1);
    if (backdoorCount + 1 >= 5) {
      unlockAll();
      setBackdoorCount(0);
    }
  };

  const handleRecoveryTrigger = (e: React.MouseEvent) => {
      // Must hold Alt + Shift
      if (e.altKey && e.shiftKey) {
          setShowRecoveryBackdoor(true);
      }
  }

  const renderWorld = () => {
    const isKryptoCompleted = progress.completedWorlds.includes('kryptografie');
    const isBinarCompleted = progress.completedWorlds.includes('binar');
    const isFusionCompleted = progress.completedWorlds.includes('fusion');

    switch (progress.currentWorld) {
      case 'kryptografie': return (
        <KryptografieWorld
            showSolutions={showSolutions}
            initialPhase={isKryptoCompleted ? 'bonus' : 'learn'}
            onComplete={() => {
                completeWorld('kryptografie');
                unlockWorld('binar');
                setShowDashboard(true);
            }}
        />
      );
      case 'binar': return (
        <BinarWorld
            showSolutions={showSolutions}
            initialPhase={isBinarCompleted ? 'bonus' : 'learn'}
            onComplete={() => {
                completeWorld('binar');
                unlockWorld('fusion');
                setShowDashboard(true);
            }}
        />
      );
      case 'fusion': return (
        <FusionWorld
            showSolutions={showSolutions}
            initialPhase={isFusionCompleted ? 'bonus' : 'learn'}
            onComplete={() => {
                completeWorld('fusion');
                unlockWorld('python');
                setShowDashboard(true);
            }}
        />
      );
      case 'python': return (
        <PythonWorld
            showSolutions={showSolutions}
            onComplete={() => {
                completeWorld('python');
                setShowDashboard(true);
            }}
        />
      );
      default: return (
        <KryptografieWorld
            showSolutions={showSolutions}
            onComplete={() => {
                completeWorld('kryptografie');
                unlockWorld('binar');
                setShowDashboard(true);
            }}
        />
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#05070a] text-slate-300 font-sans selection:bg-cyan-500/30">
      {/* Header */}
      <header className="border-b border-white/5 bg-black/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => setShowDashboard(true)}
          >
            <div className="w-8 h-8 bg-cyan-500/10 rounded border border-cyan-500/20 flex items-center justify-center group-hover:border-cyan-500/50 transition-colors">
              <Terminal size={18} className="text-cyan-400" />
            </div>
            <span className="font-bold tracking-tighter text-xl text-white" onClick={handleBackdoor}>
                CYBER <span className="text-cyan-400">ACADEMY</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            {showSolutions && (
                <div className="bg-yellow-500/10 text-yellow-500 text-[10px] font-black px-2 py-1 rounded border border-yellow-500/20 animate-pulse uppercase tracking-tighter flex items-center gap-2">
                   <Eye size={12} /> Solution Mode Active
                </div>
            )}
            <div className="hidden md:flex items-center gap-1 text-xs font-mono uppercase tracking-widest text-slate-500">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Agent Online
            </div>
            <button
                onClick={resetProgress}
                className="text-[10px] uppercase tracking-widest text-slate-600 hover:text-red-400 transition-colors"
            >
                Reset Data
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        <AnimatePresence>
            {showRecoveryBackdoor && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-slate-900 border-2 border-cyan-500/50 rounded-3xl p-10 max-w-lg w-full shadow-[0_0_100px_rgba(6,182,212,0.3)] relative">
                         <button onClick={() => setShowRecoveryBackdoor(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X size={24} /></button>
                         <h3 className="text-2xl font-black text-white uppercase mb-2">Recovery Backdoor</h3>
                         <p className="text-slate-400 text-sm mb-8 italic">Wähle eine Welt aus, um den Zugriff und alle vorherigen Welten wiederherzustellen. Nützlich nach Datenverlust.</p>

                         <div className="grid grid-cols-1 gap-3">
                             {WORLDS_CONFIG.map(w => (
                                 <button
                                    key={w.id}
                                    onClick={() => { manualUnlock(w.id); setShowRecoveryBackdoor(false); }}
                                    className="w-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 p-4 rounded-xl text-cyan-400 font-black uppercase text-xs tracking-widest text-left flex items-center justify-between group"
                                 >
                                    <span>{w.title} wiederherstellen</span>
                                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                 </button>
                             ))}
                         </div>

                         <div className="mt-8 pt-6 border-t border-white/5 text-[10px] text-slate-500 uppercase font-bold text-center">
                            Anleitung: Klicke auf eine Welt. Alle Welten DAVOR werden als erledigt markiert.
                         </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {showDashboard ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-6 md:p-12"
            >
              <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                  <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
                    MISSION <span className="text-cyan-400">DASHBOARD</span>
                  </h1>
                  <p className="text-slate-400 max-w-2xl text-lg">
                    Willkommen Rekrut. Deine Ausbildung besteht aus vier spezialisierten Modulen.
                    Schließe eine Welt ab, um die nächste Mission freizuschalten.
                  </p>
                </div>

                <div className="flex gap-4">
                  <div className="bg-slate-900/50 border border-white/5 p-4 rounded-2xl flex items-center gap-4">
                    <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-500">
                      <Trophy size={20} />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Score</div>
                      <div className="text-xl font-black text-white font-mono">{progress.completedWorlds.length * 250}</div>
                    </div>
                  </div>
                  <div className="bg-slate-900/50 border border-white/5 p-4 rounded-2xl flex items-center gap-4">
                    <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-500">
                      <Target size={20} />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Progress</div>
                      <div className="text-xl font-black text-white font-mono">{Math.round((progress.completedWorlds.length / WORLDS_CONFIG.length) * 100)}%</div>
                    </div>
                  </div>
                  <div className="hidden lg:flex bg-slate-900/50 border border-white/5 p-4 rounded-2xl items-center gap-4">
                    <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-500">
                      <Clock size={20} />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Est. Time</div>
                      <div className="text-xl font-black text-white font-mono">6h</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {WORLDS_CONFIG.map((world, index) => {
                  const isUnlocked = progress.unlockedWorlds.includes(world.id);
                  const isCompleted = progress.completedWorlds.includes(world.id);
                  const Icon = world.icon;

                  return (
                    <motion.div
                      key={world.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={cn(
                        "relative group overflow-hidden rounded-2xl border transition-all duration-500",
                        isUnlocked
                          ? "bg-slate-900/40 border-white/10 hover:border-cyan-500/40 cursor-pointer"
                          : "bg-black/20 border-white/5 grayscale opacity-60"
                      )}
                      onClick={() => {
                        if (isUnlocked) {
                          setCurrentWorld(world.id);
                          setShowDashboard(false);
                        }
                      }}
                    >
                      {/* Card Content */}
                      <div className="p-8 flex flex-col h-full">
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-colors duration-500",
                          isUnlocked ? "bg-cyan-500/10 text-cyan-400" : "bg-slate-800 text-slate-600"
                        )}>
                          <Icon size={24} />
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                          {world.title}
                        </h3>
                        <p className="text-slate-500 text-sm leading-relaxed mb-8">
                          {world.description}
                        </p>

                        <div className="mt-auto space-y-4">
                          <div className="flex items-center justify-between">
                            <span className={cn(
                              "text-[10px] uppercase font-bold tracking-[0.2em]",
                              isCompleted ? "text-green-400" : (isUnlocked ? "text-cyan-500" : "text-slate-600")
                            )}>
                              {isCompleted ? 'Mission Abgeschlossen' : (isUnlocked ? 'Zugriff gewährt' : 'Gesperrt')}
                            </span>
                            {isUnlocked ? (
                              <ChevronRight size={18} className="text-cyan-500 group-hover:translate-x-1 transition-transform" />
                            ) : (
                              <Lock size={16} className="text-slate-600" />
                            )}
                          </div>

                          {isCompleted && world.id !== 'python' && (
                             <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // Custom way to jump to bonus
                                    // For now, we'll just set the world and the world component should handle initial state if it's already completed
                                    setCurrentWorld(world.id);
                                    setShowDashboard(false);
                                }}
                                className="w-full py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-[9px] uppercase font-black text-yellow-500 hover:bg-yellow-500/20 transition-colors flex items-center justify-center gap-2"
                             >
                                <Trophy size={12} /> Bonus Aufgaben
                             </button>
                          )}
                        </div>
                      </div>

                      {/* Decoration */}
                      {isUnlocked && (
                        <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-20 h-20 bg-cyan-500/10 blur-2xl rounded-full" />
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="world-content"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
            >
               <div className="flex items-center gap-4 p-4 border-b border-white/5 bg-slate-900/20">
                  <button
                    onClick={() => setShowDashboard(true)}
                    className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-slate-500 hover:text-white transition-colors"
                  >
                    <ChevronRight className="rotate-180" size={16} />
                    Zurück zum Dashboard
                  </button>
                  <div className="h-4 w-[1px] bg-white/10" />
                  <span className="text-xs uppercase tracking-widest font-bold text-cyan-500">
                    Mission: {WORLDS_CONFIG.find(w => w.id === progress.currentWorld)?.title}
                  </span>
               </div>
               {renderWorld()}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer / Status Bar */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 pointer-events-none">
          <div className="max-w-7xl mx-auto flex justify-between items-end">
              <div
                id="agent-status-footer"
                className="bg-black/60 backdrop-blur-md border border-white/5 p-3 rounded-lg flex gap-6 pointer-events-auto cursor-help"
                onClick={handleRecoveryTrigger}
              >
                  <div className="flex flex-col">
                      <span className="text-[8px] uppercase tracking-tighter text-slate-500">Agent Status</span>
                      <span className="text-[10px] font-mono text-cyan-400">ACTIVE_RECRUIT_ID: 1402</span>
                  </div>
                  <div className="flex flex-col">
                      <span className="text-[8px] uppercase tracking-tighter text-slate-500">Progress</span>
                      <span className="text-[10px] font-mono text-white">
                        {progress.completedWorlds.length} / {WORLDS_CONFIG.length} MODULES
                      </span>
                  </div>
              </div>
          </div>
      </footer>
    </div>
  );
}

export default App;
