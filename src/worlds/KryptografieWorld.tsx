import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertTriangle, X, BookOpen, GraduationCap, ChevronLeft, Trophy, SkipForward } from 'lucide-react';
import { cn } from '../utils/cn';
import { getRandomQuestions, BONUS_CHALLENGES } from '../utils/pool';

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const CAESAR_POOL = [
    { q: "Verschlüssele HALLO mit Shift 3", a: "KDOOR", type: 'manual' },
    { q: "Entschlüssele ZROI mit Shift 3", a: "WOLF", type: 'manual' },
    { q: "Verschlüssele AGENT mit Shift 5", a: "FLJSY", type: 'manual' },
    { q: "Entschlüssele KRYPTO mit Shift 1", a: "JQXOSN", type: 'manual' },
    { q: "Verschlüssele HACK mit Shift 7", a: "OHJR", type: 'manual' },
    { q: "Verschlüssele BRAVO mit Shift 2", a: "DTCXQ", type: 'manual' },
    { q: "Entschlüssele JHW mit Shift 3", a: "GET", type: 'manual' },
    { q: "Verschlüssele CYBER mit Shift 10", a: "MILOB", type: 'manual' },
    { q: "Was passiert, wenn du beim Verschieben am Ende des Alphabets (Z) ankommst?", a: "MAN FÄNGT BEI A AN", type: 'mc', options: ["MAN FÄNGT BEI A AN", "ES GIBT EINEN FEHLER", "DAS ALPHABET STOPPT"] }
];

const VIGENERE_POOL = [
    { q: "Verschlüssele AB mit Key 'B'", a: "BC", type: 'manual' },
    { q: "Verschlüssele CYBER mit Key 'KEY'", a: "MCZOV", type: 'manual' },
    { q: "Verschlüssele GEHEIM mit Key 'AGENT'", a: "GKLRBM", type: 'manual' },
    { q: "Verschlüssele CODE mit Key 'ABC'", a: "CPFE", type: 'manual' },
    { q: "Entschlüssele 'CUHRV' mit Key 'CODE'", a: "AGENT", type: 'manual' },
    { q: "Wie nennt man ein Verschlüsselungsverfahren, das mehrere Alphabete nutzt?", a: "POLYALPHABETISCH", type: 'mc', options: ["POLYALPHABETISCH", "MONOALPHABETISCH", "BINÄR"] }
];

import { useProgress } from '../hooks/useProgress';

export function KryptografieWorld({ onComplete, showSolutions, initialPhase }: { onComplete: () => void, showSolutions: boolean, initialPhase?: 'learn' | 'bonus' }) {
  const { progress, saveStage } = useProgress();
  const [phase, setPhase] = useState<'learn' | 'quiz' | 'bonus' | 'bonus_quiz'>(initialPhase || 'learn');
  const [subTopic, setSubTopic] = useState<'caesar' | 'vigenere'>(() => {
      if (initialPhase === 'bonus') return 'vigenere';
      return 'caesar';
  });
  const [learnPage, setLearnPage] = useState(0);
  const [stage, setStage] = useState(progress.stages.kryptografie || 0);
  const [userInput, setUserInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [caesarShift, setCaesarShift] = useState(3);

  const quizQuestions = useMemo(() => ({
    caesar: getRandomQuestions(CAESAR_POOL, 5),
    vigenere: getRandomQuestions(VIGENERE_POOL, 5)
  }), [subTopic, phase === 'learn']);

  const currentQuestions = quizQuestions[subTopic];

  const handleCheck = (choice?: string) => {
    const answer = choice || userInput;
    const questionsToUse = phase === 'bonus_quiz' ? BONUS_CHALLENGES.kryptografie : currentQuestions;
    const targetA = questionsToUse[stage].a;

    if (answer.toUpperCase().trim() === targetA.toUpperCase()) {
        const maxStage = questionsToUse.length - 1;

        if (stage < maxStage) {
            const nextStage = stage + 1;
            setStage(nextStage);
            saveStage('kryptografie', nextStage);
            setUserInput('');
        } else if (phase === 'bonus_quiz') {
            onComplete();
        } else if (subTopic === 'caesar') {
            setSubTopic('vigenere');
            setPhase('learn');
            setLearnPage(0);
            setStage(0);
            saveStage('kryptografie', 0);
            setUserInput('');
        } else {
            setPhase('bonus');
            setStage(0);
            setUserInput('');
        }
    } else {
        setError('ZUGRIFF VERWEIGERT: Die Eingabe ist nicht korrekt.');
    }
  };

  const renderLearn = () => {
    if (phase === 'bonus') {
        return (
            <div className="space-y-6 text-center">
                <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center text-yellow-500 mx-auto mb-6">
                    <Trophy size={40} />
                </div>
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Bonus Sektor</h3>
                <p className="text-slate-400">Du hast den Hauptkurs abgeschlossen! Zeige dein Können in den Experten-Aufgaben.</p>
            </div>
        )
    }

    if (subTopic === 'caesar') {
        const pages = [
            (
                <div className="space-y-6">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">Die Cäsar-Verschlüsselung</h3>
                    <p className="text-slate-300 leading-relaxed">
                        Stell dir vor, du bist Julius Cäsar und willst eine Nachricht an deine Generäle schicken,
                        die niemand anderes lesen kann. Seine Lösung war genial einfach: Jeder Buchstabe im Alphabet
                        wird um eine feste Anzahl von Stellen verschoben.
                    </p>
                    <div className="bg-cyan-500/10 border border-cyan-500/20 p-6 rounded-2xl">
                         <div className="flex justify-between items-center mb-4">
                            <span className="text-xs font-bold text-cyan-400 uppercase">Beispiel: Shift 3</span>
                         </div>
                         <div className="grid grid-cols-2 gap-4 font-mono text-sm">
                            <div className="text-slate-500">A B C D E</div>
                            <div className="text-cyan-400">D E F G H</div>
                         </div>
                    </div>
                </div>
            ),
            (
                <div className="space-y-6">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">Interaktives Werkzeug</h3>
                    <p className="text-slate-300 leading-relaxed">
                        Nutze das Cäsar-Rad, um zu verstehen, wie die Verschiebung funktioniert.
                        Der äußere Ring ist der Klartext, der innere der Geheimtext.
                    </p>
                    <div className="flex justify-center py-4">
                        <div className="relative w-48 h-48 flex items-center justify-center">
                            {ALPHABET.map((char, i) => (
                                <div key={i} className="absolute font-mono text-[8px] text-slate-500" style={{ transform: `rotate(${i * (360/26)}deg) translateY(-85px)` }}>{char}</div>
                            ))}
                            <motion.div animate={{ rotate: -(caesarShift * (360/26)) }} className="relative w-36 h-36 rounded-full border-2 border-cyan-500/30 bg-cyan-500/5 flex items-center justify-center">
                                {ALPHABET.map((char, i) => (
                                    <div key={i} className="absolute font-mono text-[10px] text-cyan-400 font-bold" style={{ transform: `rotate(${i * (360/26)}deg) translateY(-60px)` }}>{char}</div>
                                ))}
                                <span className="text-2xl font-black text-white">{caesarShift}</span>
                            </motion.div>
                        </div>
                    </div>
                    <input type="range" min="0" max="25" value={caesarShift} onChange={e => setCaesarShift(parseInt(e.target.value))} className="w-full accent-cyan-500" />
                </div>
            )
        ];
        return pages[learnPage] || pages[0];
    } else {
        const pages = [
            (
                <div className="space-y-6">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">Das Vigenère-Verfahren</h3>
                    <p className="text-slate-300 leading-relaxed">
                        Cäsar war leicht zu knacken, weil jeder Buchstabe immer gleich verschoben wurde.
                        Vigenère nutzt ein <b>Schlüsselwort</b>. Jeder Buchstabe des Wortes bestimmt den Shift!
                    </p>
                    <div className="bg-black/60 p-6 rounded-2xl border border-white/5 font-mono text-xs space-y-4">
                        <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-slate-500">KLARTEXT</span><span className="text-white">G E H E I M</span></div>
                        <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-cyan-500">KEY (KEY)</span><span className="text-cyan-500">K E Y K E Y</span></div>
                        <div className="flex justify-between font-black"><span className="text-green-500">RESULT</span><span className="text-green-500">Q I F O M K</span></div>
                    </div>
                </div>
            ),
            (
                <div className="space-y-6">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">Die Berechnung</h3>
                    <div className="grid grid-cols-1 gap-3">
                        <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
                            <h4 className="text-cyan-400 font-bold text-xs mb-1 uppercase">Schritt 1: Buchstaben zu Zahlen</h4>
                            <p className="text-slate-400 text-[10px]">A=0, B=1, C=2 ... Z=25</p>
                        </div>
                        <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
                            <h4 className="text-cyan-400 font-bold text-xs mb-1 uppercase">Schritt 2: Addition</h4>
                            <p className="text-slate-400 text-[10px]">Rechne: (Klartext + Key) und nimm den Rest bei 26</p>
                        </div>
                        <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
                            <h4 className="text-cyan-400 font-bold text-xs mb-1 uppercase">Beispiel</h4>
                            <p className="text-slate-400 text-[10px]">I(8) + Y(24) = 32. Da 32 &gt; 25: 32 - 26 = 6 (G)</p>
                        </div>
                    </div>
                </div>
            )
        ];
        return pages[learnPage] || pages[0];
    }
  };

  const isQuizVisible = phase === 'quiz' || phase === 'bonus_quiz';
  const questionsToUse = phase === 'bonus_quiz' ? BONUS_CHALLENGES.kryptografie : currentQuestions;

  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto space-y-8 pb-32 relative">
        <AnimatePresence>
            {error && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-slate-900 border-2 border-red-500/50 rounded-3xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(239,68,68,0.2)] relative">
                        <button onClick={() => setError(null)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X size={20} /></button>
                        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 mx-auto mb-6"><AlertTriangle size={32} /></div>
                        <h3 className="text-xl font-black text-white text-center uppercase mb-4">Fehler</h3>
                        <p className="text-slate-400 text-center text-sm mb-8">{error}</p>
                        <button onClick={() => setError(null)} className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-4 rounded-xl text-xs uppercase">Korrigieren</button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
            <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-cyan-500/20 rounded-2xl flex items-center justify-center text-cyan-400"><Shield size={32} /></div>
                <div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Welt 1: Kryptografie</h2>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-cyan-500 font-mono text-xs uppercase tracking-widest">{phase.includes('bonus') ? 'bonus' : subTopic}</span>
                        <span className="text-slate-600 font-mono text-xs uppercase">{phase === 'learn' ? 'Lernphase' : 'Prüfungsphase'}</span>
                    </div>
                </div>
            </div>
            <div className="flex gap-2">
                {[0,1].map(i => (
                    <div key={i} className={cn("h-1 w-12 rounded-full", phase === 'learn' ? (learnPage >= i ? "bg-cyan-500" : "bg-slate-800") : "bg-cyan-900")} />
                ))}
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7">
                <div className="bg-slate-900/50 border border-white/5 p-8 rounded-3xl min-h-[450px] flex flex-col">
                    <div className="flex-1">
                        {renderLearn()}
                    </div>
                    {phase === 'learn' && (
                        <div className="flex justify-between items-center mt-8">
                            <button
                                onClick={() => setLearnPage(p => Math.max(0, p-1))}
                                disabled={learnPage === 0}
                                className="flex items-center gap-2 text-xs font-black uppercase text-slate-500 hover:text-white disabled:opacity-30"
                            >
                                <ChevronLeft size={16} /> Zurück
                            </button>
                            {learnPage < 1 ? (
                                <button onClick={() => setLearnPage(p => p + 1)} className="bg-white text-black px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest">Weiter</button>
                            ) : (
                                <button onClick={() => setPhase('quiz')} className="bg-cyan-500 text-black px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest animate-pulse">Zum Quiz</button>
                            )}
                        </div>
                    )}
                    {phase === 'bonus' && (
                        <div className="mt-8 flex flex-col gap-4">
                            <button onClick={() => { setPhase('bonus_quiz'); setStage(0); }} className="w-full bg-yellow-500 text-black py-4 rounded-2xl text-xs font-black uppercase tracking-widest animate-bounce">Aufgaben starten</button>
                            <button onClick={() => onComplete()} className="w-full flex items-center justify-center gap-2 text-[10px] uppercase font-black text-slate-500 hover:text-white transition-colors">
                                <SkipForward size={14} /> Bonus überspringen
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="lg:col-span-5">
                <AnimatePresence mode="wait">
                    {isQuizVisible ? (
                        <motion.div key="quiz" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-slate-900 border-2 border-cyan-500/30 p-8 rounded-3xl shadow-2xl relative overflow-hidden h-full flex flex-col">
                            <div className="absolute top-0 right-0 p-4"><GraduationCap className="text-cyan-500 opacity-20" size={40} /></div>
                            <h4 className="text-[10px] font-black text-cyan-500 uppercase tracking-widest mb-8">Mission Task {stage+1}/{questionsToUse.length}</h4>
                            <div className="space-y-6 flex-1 flex flex-col justify-center">
                                <p className="text-white text-xl font-bold">{questionsToUse[stage].q}</p>

                                {questionsToUse[stage].type === 'mc' ? (
                                    <div className="grid grid-cols-1 gap-3">
                                        {(questionsToUse[stage].options || []).map((opt, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleCheck(opt)}
                                                className={cn(
                                                    "w-full bg-black/40 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/50 p-4 rounded-xl text-white font-mono text-left transition-all relative group",
                                                    showSolutions && opt === questionsToUse[stage].a && "border-yellow-500/50 bg-yellow-500/5"
                                                )}
                                            >
                                                <span className="text-[10px] text-slate-500 mr-4 group-hover:text-cyan-500">{i + 1}.</span>
                                                {opt}
                                                {showSolutions && opt === questionsToUse[stage].a && (
                                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-yellow-500 text-[8px] font-black uppercase">Solution</span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={userInput}
                                                onChange={e => setUserInput(e.target.value.toUpperCase())}
                                                onKeyDown={e => e.key === 'Enter' && handleCheck()}
                                                className="w-full bg-black border border-white/10 rounded-2xl px-6 py-5 text-white text-2xl font-mono text-center outline-none focus:border-cyan-500"
                                                placeholder="..."
                                            />
                                            {showSolutions && (
                                                <div className="absolute -top-3 -right-3 bg-yellow-500 text-black text-[10px] px-2 py-1 rounded font-black shadow-lg z-10">
                                                    KEY: {questionsToUse[stage].a}
                                                </div>
                                            )}
                                        </div>
                                        <button onClick={() => handleCheck()} className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black py-5 rounded-2xl transition-all uppercase tracking-widest text-xs">Bestätigen</button>
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-center gap-2 mt-8">
                                {[...Array(questionsToUse.length)].map((_, i) => (
                                    <div key={i} className={cn("w-1.5 h-1.5 rounded-full", stage > i ? "bg-green-500" : (stage === i ? "bg-cyan-400 w-4" : "bg-slate-800"))} />
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <div className="bg-slate-900/30 border border-white/5 p-8 rounded-3xl flex flex-col items-center justify-center text-center space-y-4 h-full">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-slate-600"><BookOpen size={32} /></div>
                            <h4 className="text-white font-bold uppercase tracking-tight">Prüfungs-Sektor</h4>
                            <p className="text-slate-500 text-xs">Schließe erst die Lernphase ab. Dekodiere die Nachrichten im Quiz per Hand!</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    </div>
  );
}
