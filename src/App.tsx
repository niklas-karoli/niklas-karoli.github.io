import { useState } from 'react';
import { Terminal, Shield, Cpu, Zap, Code, ChevronRight, Lock } from 'lucide-react';
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
  const { progress, setCurrentWorld, unlockAll, resetProgress, completeWorld, unlockWorld } = useProgress();
  const [showDashboard, setShowDashboard] = useState(true);
  const [backdoorCount, setBackdoorCount] = useState(0);

  const handleBackdoor = () => {
    setBackdoorCount(prev => prev + 1);
    if (backdoorCount + 1 >= 5) {
      unlockAll();
      alert('Backdoor aktiviert: Alle Welten freigeschaltet.');
      setBackdoorCount(0);
    }
  };

  const renderWorld = () => {
    switch (progress.currentWorld) {
      case 'kryptografie': return (
        <KryptografieWorld
            onComplete={() => {
                completeWorld('kryptografie');
                unlockWorld('binar');
                setShowDashboard(true);
            }}
        />
      );
      case 'binar': return (
        <BinarWorld
            onComplete={() => {
                completeWorld('binar');
                unlockWorld('fusion');
                setShowDashboard(true);
            }}
        />
      );
      case 'fusion': return (
        <FusionWorld
            onComplete={() => {
                completeWorld('fusion');
                unlockWorld('python');
                setShowDashboard(true);
            }}
        />
      );
      case 'python': return (
        <PythonWorld
            onComplete={() => {
                completeWorld('python');
                setShowDashboard(true);
            }}
        />
      );
      default: return (
        <KryptografieWorld
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
        <AnimatePresence mode="wait">
          {showDashboard ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-6 md:p-12"
            >
              <div className="mb-12">
                <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
                  MISSION <span className="text-cyan-400">DASHBOARD</span>
                </h1>
                <p className="text-slate-400 max-w-2xl text-lg">
                  Willkommen Rekrut. Deine Ausbildung besteht aus vier spezialisierten Modulen.
                  Schließe eine Welt ab, um die nächste Mission freizuschalten.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {WORLDS_CONFIG.map((world, index) => {
                  const isUnlocked = progress.unlockedWorlds.includes(world.id);
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

                        <div className="mt-auto flex items-center justify-between">
                          <span className={cn(
                            "text-[10px] uppercase font-bold tracking-[0.2em]",
                            isUnlocked ? "text-cyan-500" : "text-slate-600"
                          )}>
                            {isUnlocked ? 'Zugriff gewährt' : 'Gesperrt'}
                          </span>
                          {isUnlocked ? (
                            <ChevronRight size={18} className="text-cyan-500 group-hover:translate-x-1 transition-transform" />
                          ) : (
                            <Lock size={16} className="text-slate-600" />
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
              <div className="bg-black/60 backdrop-blur-md border border-white/5 p-3 rounded-lg flex gap-6 pointer-events-auto">
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
