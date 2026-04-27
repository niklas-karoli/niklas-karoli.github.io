import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, AlertTriangle, X, GraduationCap, Lock, User, ChevronLeft, Play, ShieldCheck, Trophy, SkipForward } from 'lucide-react';
import { cn } from '../utils/cn';
import { getRandomQuestions, BONUS_CHALLENGES } from '../utils/pool';
import { useProgress } from '../hooks/useProgress';

const XOR_POOL = [
    { q: "0 XOR 0 = ?", a: "0", type: 'manual' },
    { q: "1 XOR 0 = ?", a: "1", type: 'manual' },
    { q: "1 XOR 1 = ?", a: "0", type: 'manual' },
    { q: "101 XOR 011 = ?", a: "110", type: 'manual' },
    { q: "Wenn A XOR B = C, was ist C XOR B?", a: "A", type: 'mc', options: ["A", "B", "C"] },
    { q: "010 XOR 110 = ?", a: "100", type: 'manual' },
    { q: "XOR ist ...?", a: "SYMMETRISCH", type: 'mc', options: ["SYMMETRISCH", "ASYMMETRISCH", "KOMPLEX"] }
];

const KEY_POOL = [
    { q: "Rechne: 14 mod 4", a: "2", type: 'manual' },
    { q: "Rechne: 22 mod 5", a: "2", type: 'manual' },
    { q: "Alice nutzt Geheimzahl 3. Öffentliche Zahl (3^3 Rest bei 17)?", a: "10", type: 'manual' },
    { q: "Kann Eve den gemeinsamen Schlüssel direkt sehen?", a: "NEIN", type: 'mc', options: ["NEIN", "JA", "VIELLEICHT"] },
    { q: "Gemeinsamer Schlüssel: Public B=13, Secret A=3. (13^3 Rest bei 17)?", a: "4", type: 'manual' },
    { q: "Warum nutzen wir Primzahlen?", a: "SICHERHEIT", type: 'mc', options: ["SICHERHEIT", "SPEED", "STYLE"] },
    { q: "Ist Diffie-Hellman symmetrisch oder asymmetrisch?", a: "ASYMMETRISCH", type: 'mc', options: ["ASYMMETRISCH", "SYMMETRISCH", "BINÄR"] }
];

const E2E_POOL = [
    { q: "Zustand der Nachricht im Internet?", a: "VERSCHLÜSSELT", type: 'mc', options: ["VERSCHLÜSSELT", "LESBAR", "GELÖSCHT"] },
    { q: "Wer besitzt den gemeinsamen Schlüssel?", a: "ALICE & BOB", type: 'mc', options: ["ALICE & BOB", "EVE", "FACEBOOK"] },
    { q: "XOR mit Key 101: Was wird aus 110?", a: "011", type: 'manual' },
    { q: "Name des Angreifers in der Mitte?", a: "MAN-IN-THE-MIDDLE", type: 'mc', options: ["MAN-IN-THE-MIDDLE", "BOT-NETZ", "VIRUS"] },
    { q: "Ist E2E heute Standard?", a: "JA", type: 'mc', options: ["JA", "NEIN", "NUR BEI HACKERN"] }
];

export function FusionWorld({ onComplete, showSolutions, initialPhase }: { onComplete: () => void, showSolutions: boolean, initialPhase?: 'learn' | 'bonus' }) {
  const { progress, saveStage } = useProgress();
  const [phase, setPhase] = useState<'learn' | 'quiz' | 'cutscene' | 'bonus' | 'bonus_quiz'>(() => {
      if (initialPhase === 'bonus') return 'bonus';
      return 'learn';
  });
  const [topic, setTopic] = useState<'xor' | 'key-exchange' | 'e2e'>(() => {
      if (initialPhase === 'bonus') return 'e2e';
      return 'xor';
  });
  const [learnPage, setLearnPage] = useState(0);
  const [stage, setStage] = useState(progress.stages.fusion || 0);
  const [cutsceneStep, setCutsceneStep] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [xorA, setXorA] = useState(0);
  const [xorB, setXorB] = useState(0);
  const [chatMessage, setChatMessage] = useState('');

  const quizQuestions = useMemo(() => ({
    xor: getRandomQuestions(XOR_POOL, 5),
    key: getRandomQuestions(KEY_POOL, 5),
    e2e: getRandomQuestions(E2E_POOL, 5)
  }), [topic, phase === 'learn']);

  const currentQuestions = topic === 'xor' ? quizQuestions.xor : topic === 'key-exchange' ? quizQuestions.key : quizQuestions.e2e;

  const handleCheck = (choice?: string) => {
    const answer = choice || userInput;
    const questionsToUse = phase === 'bonus_quiz' ? BONUS_CHALLENGES.fusion : currentQuestions;
    if (answer.toUpperCase().trim() === questionsToUse[stage].a.toUpperCase()) {
        if (stage < questionsToUse.length - 1) {
            const nextStage = stage + 1;
            setStage(nextStage);
            saveStage('fusion', nextStage);
            setUserInput('');
        } else if (phase === 'bonus_quiz') {
            onComplete();
        } else {
            if (topic === 'xor') {
                setTopic('key-exchange');
                setPhase('learn');
                setLearnPage(0);
                setStage(0);
                saveStage('fusion', 0);
            }
            else if (topic === 'key-exchange') {
                setTopic('e2e');
                setPhase('learn');
                setLearnPage(0);
                setStage(0);
                saveStage('fusion', 0);
            }
            else {
                setPhase('bonus');
                setStage(0);
            }
            setUserInput('');
        }
    } else {
        setError('PROTOKOLL-FEHLER: Die Validierung ist fehlgeschlagen.');
    }
  };

  const renderLearn = () => {
    if (phase === 'bonus') {
        return (
            <div className="space-y-6 text-center">
                <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center text-yellow-500 mx-auto mb-6">
                    <Trophy size={40} />
                </div>
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Verschlüsselungs-Elite</h3>
                <p className="text-slate-400">Du hast die Fusion von Logik und Krypto gemeistert. Zeit für die finalen Bonus-Herausforderungen!</p>
            </div>
        )
    }
    if (topic === 'xor') {
        const pages = [
            (
                <div className="space-y-6">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">Die XOR-Logik</h3>
                    <p className="text-slate-300 leading-relaxed text-sm">
                        XOR ist wie ein magischer Schalter. Er ist nur "AN" (1), wenn <b>genau einer</b> der beiden Knöpfe gedrückt ist.
                        Drückt man beide oder keinen, bleibt er "AUS" (0).
                    </p>
                    <div className="flex items-center justify-center gap-6 bg-black/40 p-10 rounded-2xl border border-white/5">
                        <button onClick={() => setXorA(xorA?0:1)} className={cn("w-14 h-14 rounded-xl border-2 font-black transition-all", xorA?"bg-yellow-500 text-black border-yellow-400":"border-slate-800 text-slate-700")}>{xorA}</button>
                        <span className="text-xl font-bold text-slate-600">⊕</span>
                        <button onClick={() => setXorB(xorB?0:1)} className={cn("w-14 h-14 rounded-xl border-2 font-black transition-all", xorB?"bg-yellow-500 text-black border-yellow-400":"border-slate-800 text-slate-700")}>{xorB}</button>
                        <span className="text-xl font-bold text-slate-600">=</span>
                        <div className={cn("w-16 h-16 rounded-2xl border-4 flex items-center justify-center text-2xl font-black", (xorA^xorB)?"bg-white text-black border-white shadow-lg":"border-slate-900 text-slate-900")}>{xorA^xorB}</div>
                    </div>
                    <p className="text-xs text-slate-500 italic text-center">Tipp: Klicke auf die Tasten zum Ausprobieren!</p>
                </div>
            )
        ];
        return pages[learnPage] || pages[0];
    } else if (topic === 'key-exchange') {
        const pages = [
            (
                <div className="space-y-6">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">E2E Visualisierung</h3>
                    <p className="text-slate-300 leading-relaxed text-sm italic">
                        Bevor wir zur Mathematik kommen, schauen wir uns an, was wir erreichen wollen:
                        Eine sichere Leitung, bei der niemand in der Mitte mitlesen kann.
                    </p>
                    <div className="bg-black/80 rounded-2xl p-6 border border-white/10 space-y-4">
                         <div className="flex items-center gap-3">
                             <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 border border-blue-500/30"><User size={16} /></div>
                             <div className="bg-blue-600 text-white p-2 rounded-xl rounded-tl-none text-[8px] font-bold">Hallo Bob! [GEHEIM]</div>
                         </div>
                         <div className="flex flex-col items-center py-2 border-y border-white/5 relative">
                             <div className="text-[10px] font-mono text-red-500 font-black animate-pulse uppercase">Eve (MITM) sieht: 1011001...</div>
                             <div className="text-[7px] text-slate-600 uppercase font-bold mt-1">Verschlüsselt via XOR & Key-Exchange</div>
                         </div>
                         <div className="flex items-center justify-end gap-3">
                             <div className="bg-slate-800 text-white p-2 rounded-xl rounded-tr-none text-[8px] font-bold">Hallo Bob! [GEHEIM]</div>
                             <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 border border-green-500/30"><User size={16} /></div>
                         </div>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                        Wie tauschen Alice und Bob den Schlüssel aus, ohne dass Eve ihn klaut?
                        Die Antwort liegt im <b>Key-Exchange</b>.
                    </p>
                </div>
            ),
            (
                <div className="space-y-6">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">Das Problem</h3>
                    <p className="text-slate-300 leading-relaxed text-sm">
                        Alice und Bob wollen sich eine geheime Nachricht schicken. Aber sie haben kein Passwort ausgemacht.
                        Wenn Alice ein Passwort schickt, könnte der böse Hacker <b>Eve</b> es mitlesen.
                    </p>
                    <div className="flex justify-around items-center py-6">
                        <div className="text-center"><User className="text-blue-400 mx-auto" /><span className="text-[10px] text-slate-500 uppercase font-black">Alice</span></div>
                        <div className="text-center relative">
                            <Lock className="text-red-500 mx-auto" />
                            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] text-red-500 font-black uppercase whitespace-nowrap">Eve hört zu!</div>
                        </div>
                        <div className="text-center"><User className="text-green-400 mx-auto" /><span className="text-[10px] text-slate-500 uppercase font-black">Bob</span></div>
                    </div>
                </div>
            ),
            (
                <div className="space-y-6">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">Die Lösung: Mischen!</h3>
                    <p className="text-slate-300 leading-relaxed text-sm">
                        Stell dir vor, Alice und Bob nutzen Farben. Sie wählen eine öffentliche Farbe (Gelb).
                        Alice wählt eine geheime Farbe (Rot) und mischt sie mit Gelb zu Orange.
                    </p>
                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
                            <span className="text-xs text-white">+</span>
                            <div className="w-8 h-8 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                            <span className="text-xs text-white">=</span>
                            <div className="w-10 h-10 rounded-full bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.5)]" />
                        </div>
                        <p className="text-[10px] text-slate-500">Eve sieht nur die Mischung (Orange), kann aber die geheime Farbe (Rot) nicht mehr herausfiltern!</p>
                    </div>
                </div>
            ),
            (
                <div className="space-y-6">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">Modulo: Der Rest-Trick</h3>
                    <p className="text-slate-300 leading-relaxed text-sm">
                        Verschlüsselung braucht Einbahnstraßen-Funktionen. Modulo ist perfekt dafür.
                        Modulo (kurz <b>mod</b>) bedeutet einfach: <b>Was bleibt als Rest übrig?</b>
                    </p>
                    <div className="bg-slate-900/80 p-6 rounded-2xl border border-white/10 space-y-4">
                        <div className="flex justify-between items-center bg-black/40 p-4 rounded-xl">
                            <code className="text-yellow-500 text-lg font-black">10 mod 3</code>
                            <span className="text-white text-lg font-black">= 1</span>
                        </div>
                        <p className="text-[10px] text-slate-500 italic">Erklärung: 10 passt 3-mal in 3 (ist 9). Es bleibt 1 Rest.</p>

                        <div className="flex justify-between items-center bg-black/40 p-4 rounded-xl">
                            <code className="text-yellow-500 text-lg font-black">17 mod 5</code>
                            <span className="text-white text-lg font-black">= 2</span>
                        </div>
                    </div>
                </div>
            ),
            (
                <div className="space-y-6">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">Der Key-Exchange</h3>
                    <p className="text-slate-300 leading-relaxed text-sm">
                        Diffie-Hellman nutzt Potenzen und Modulo. Alice rechnet:
                        <br/><br/>
                        <code className="text-cyan-400 font-bold bg-black/40 px-2 py-1 rounded">ÖffentlicheZahl ^ GeheimZahl mod Primzahl</code>
                    </p>
                    <div className="bg-yellow-500/10 border border-yellow-500/20 p-6 rounded-2xl font-mono text-xs text-yellow-500">
                         <b>Beispiel:</b><br/>
                        Geheim: 3, Öffentlich: 2, Prim: 7 <br/>
                        2 ^ 3 = 8 <br/>
                        8 mod 7 = <b>1</b>
                    </div>
                </div>
            ),
            (
                <div className="space-y-6">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">Das Geheimnis</h3>
                    <p className="text-slate-300 leading-relaxed text-sm">
                        Beide schicken sich ihre "Misch-Ergebnisse". Am Ende mischen beide nochmal ihre eigene Geheimzahl dazu.
                        Magisch: <b>Beide erhalten die exakt gleiche Zahl!</b> Das ist ihr neuer geheimer Schlüssel.
                    </p>
                    <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-2xl text-center">
                        <div className="text-3xl mb-2">🔑</div>
                        <div className="text-xs font-black text-white uppercase tracking-widest">Gemeinsamer Schlüssel generiert!</div>
                    </div>
                </div>
            )
        ];
        return pages[learnPage] || pages[0];
    } else {
        const pages = [
            (
                <div className="space-y-6">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">Ende-zu-Ende (E2E)</h3>
                    <p className="text-slate-300 leading-relaxed text-sm">
                        Jetzt haben Alice und Bob einen Schlüssel. Sie nutzen ihn mit <b>XOR</b>, um ihre Nachricht zu verschlüsseln.
                        Nur wer den Schlüssel hat, kann die Nachricht wieder lesen.
                    </p>
                    <div className="grid grid-cols-3 gap-4 h-52 relative mt-4">
                         <div className="flex flex-col items-center gap-4">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 border-2 border-blue-500/30"><User size={24} /></div>
                            <div className="bg-slate-900 p-2 rounded-xl border border-white/10 w-full">
                                <input value={chatMessage} onChange={e=>setChatMessage(e.target.value)} className="w-full bg-transparent border-b border-white/5 outline-none text-[8px] text-white" placeholder="Tippe..." />
                            </div>
                         </div>

                         <div className="flex flex-col items-center justify-center gap-2">
                             <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                                <motion.div animate={{ x: [0, 100] }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="w-10 h-full bg-yellow-500 blur-sm" />
                             </div>
                             <div className="bg-black/60 p-3 rounded-2xl border-2 border-red-500/30 flex flex-col items-center gap-2 shadow-2xl relative">
                                <div className="absolute -top-3 bg-red-500 text-white text-[8px] px-2 py-0.5 rounded font-black uppercase">Eve (Internet)</div>
                                <div className="text-[8px] font-mono text-green-500/50 break-all text-center max-w-[80px]">
                                    {chatMessage ? btoa(chatMessage).substring(0, 15) : "---"}
                                </div>
                             </div>
                             <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                                <motion.div animate={{ x: [0, 100] }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="w-10 h-full bg-yellow-500 blur-sm" />
                             </div>
                         </div>

                         <div className="flex flex-col items-center gap-4">
                            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 border-2 border-green-500/30"><User size={24} /></div>
                            <div className="bg-green-500/5 p-2 rounded-xl border border-green-500/20 w-full min-h-[30px] flex items-center justify-center">
                                <span className="text-[8px] text-white font-bold">{chatMessage}</span>
                            </div>
                         </div>
                    </div>
                </div>
            )
        ];
        return pages[learnPage] || pages[0];
    }
  };

  const isQuizVisible = phase === 'quiz' || phase === 'bonus_quiz';
  const questionsToUse = phase === 'bonus_quiz' ? BONUS_CHALLENGES.fusion : currentQuestions;

  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto space-y-8 pb-32 relative">
        <AnimatePresence>
            {error && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-slate-900 border-2 border-red-500/50 rounded-3xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(239,68,68,0.2)] relative">
                        <button onClick={() => setError(null)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X size={20} /></button>
                        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 mx-auto mb-6"><AlertTriangle size={32} /></div>
                        <h3 className="text-xl font-black text-white text-center uppercase mb-4">Logik-Fehler</h3>
                        <p className="text-slate-400 text-center text-sm mb-8">{error}</p>
                        <button onClick={() => setError(null)} className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-4 rounded-xl text-xs uppercase">Re-Initialisierung</button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
            <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-yellow-500/20 rounded-2xl flex items-center justify-center text-yellow-400 shadow-lg"><Zap size={32} /></div>
                <div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Welt 3: Die Fusion</h2>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-yellow-500 font-mono text-xs uppercase tracking-widest">{topic}</span>
                        <span className="text-slate-600 font-mono text-xs uppercase">{phase === 'learn' ? 'Lernphase' : 'Prüfungsphase'}</span>
                    </div>
                </div>
            </div>
            <div className="h-1 w-24 bg-slate-800 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${(stage/5)*100}%` }} className="h-full bg-yellow-500 shadow-[0_0_10px_#eab308]" />
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7">
                <div className="bg-slate-900/50 border border-white/5 p-8 rounded-3xl min-h-[450px] flex flex-col shadow-2xl">
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
                            {learnPage < (topic === 'key-exchange' ? 4 : 0) ? (
                                <button onClick={() => setLearnPage(p => p + 1)} className="bg-white text-black px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest">Weiter</button>
                            ) : (
                                <button onClick={() => {
                                    if (topic === 'e2e') setPhase('cutscene');
                                    else { setPhase('quiz'); setLearnPage(0); }
                                }} className="bg-yellow-500 text-black px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform animate-pulse">
                                    {topic === 'e2e' ? 'Simulation starten' : 'Start Challenge'}
                                </button>
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
                    {phase === 'cutscene' ? (
                         <motion.div key="cutscene" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-black border-2 border-cyan-500/30 rounded-3xl p-8 h-full flex flex-col overflow-hidden relative">
                             <div className="absolute inset-0 bg-cyan-500/5 pointer-events-none" />
                             <h4 className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Play size={12} /> E2E Live-Simulation
                             </h4>

                             <div className="flex-1 space-y-8 relative z-10">
                                 {/* Alice (Left) */}
                                 <div className={cn("transition-all duration-700", cutsceneStep >= 0 ? "opacity-100" : "opacity-0")}>
                                     <div className="flex items-center gap-3 mb-2">
                                         <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 border border-blue-500/30"><User size={16} /></div>
                                         <span className="text-[10px] font-black text-slate-400 uppercase">Alice</span>
                                     </div>
                                     <div className="bg-blue-600 text-white p-3 rounded-2xl rounded-tl-none text-[10px] font-bold max-w-[80%] shadow-lg">
                                         {cutsceneStep === 0 ? <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ repeat: Infinity, duration: 0.8 }}>Tippt Nachricht...</motion.span> : "Hallo Bob! Dies ist ein geheimer Test."}
                                     </div>
                                 </div>

                                 {/* MITM (Middle) */}
                                 <div className={cn("transition-all duration-700", cutsceneStep >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
                                     <div className="flex items-center justify-center gap-3 mb-2">
                                         <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center text-red-500 border border-red-500/30"><ShieldCheck size={16} /></div>
                                         <span className="text-[10px] font-black text-red-500 uppercase">Eve (Man-in-the-Middle)</span>
                                     </div>
                                     <div className="bg-slate-900 border border-red-500/30 p-4 rounded-xl text-center shadow-inner relative overflow-hidden group">
                                         <div className="absolute inset-0 bg-red-500/5 animate-pulse" />
                                         <div className="text-[9px] font-mono text-red-400 font-black break-all line-clamp-2">
                                             {cutsceneStep >= 1 ? "XOR_ENCRYPTED: 101001110010101110100101..." : "Warten auf Paket..."}
                                         </div>
                                         <div className="mt-2 text-[8px] text-slate-500 uppercase font-bold">Inhalt für Eve unlesbar!</div>
                                     </div>
                                 </div>

                                 {/* Bob (Right) */}
                                 <div className={cn("transition-all duration-700", cutsceneStep >= 2 ? "opacity-100" : "opacity-0")}>
                                     <div className="flex items-center justify-end gap-3 mb-2">
                                         <span className="text-[10px] font-black text-slate-400 uppercase">Bob</span>
                                         <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 border border-green-500/30"><User size={16} /></div>
                                     </div>
                                     <div className="bg-slate-800 text-white p-3 rounded-2xl rounded-tr-none text-[10px] font-bold max-w-[80%] ml-auto shadow-lg border border-green-500/20">
                                         {cutsceneStep === 2 ? "Hallo Bob! Dies ist ein geheimer Test." : "..."}
                                     </div>
                                 </div>
                             </div>

                             <div className="mt-6">
                                {cutsceneStep < 2 ? (
                                    <button onClick={() => setCutsceneStep(s => s + 1)} className="w-full bg-cyan-500 text-black py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-cyan-400 transition-colors">
                                        Nächster Schritt
                                    </button>
                                ) : (
                                    <button onClick={() => setPhase('quiz')} className="w-full bg-green-500 text-black py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-400 transition-colors animate-pulse">
                                        Simulation beenden & Quiz starten
                                    </button>
                                )}
                             </div>
                         </motion.div>
                    ) : isQuizVisible ? (
                        <motion.div key="quiz" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-slate-900 border-2 border-yellow-500/30 p-8 rounded-3xl shadow-2xl h-full flex flex-col relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4"><GraduationCap className="text-yellow-500 opacity-20" size={40} /></div>
                            <h4 className="text-[10px] font-black text-yellow-500 uppercase tracking-widest mb-8">Mission Task {stage+1}/{questionsToUse.length}</h4>
                            <div className="flex-1 flex flex-col justify-center space-y-8">
                                <p className="text-white text-xl font-bold leading-tight text-center">{questionsToUse[stage].q}</p>

                                {questionsToUse[stage].type === 'mc' ? (
                                    <div className="grid grid-cols-1 gap-3">
                                        {(questionsToUse[stage].options || []).map((opt, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleCheck(opt)}
                                                className={cn(
                                                    "w-full bg-black/40 hover:bg-yellow-500/10 border border-white/10 hover:border-yellow-500/50 p-4 rounded-xl text-white font-mono text-left transition-all relative group",
                                                    showSolutions && opt.toUpperCase() === questionsToUse[stage].a.toUpperCase() && "border-yellow-500/50 bg-yellow-500/5"
                                                )}
                                            >
                                                <span className="text-[10px] text-slate-500 mr-4 group-hover:text-yellow-500">{i + 1}.</span>
                                                {opt}
                                                {showSolutions && opt.toUpperCase() === questionsToUse[stage].a.toUpperCase() && (
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
                                                onChange={e => setUserInput(e.target.value)}
                                                onKeyDown={e => e.key === 'Enter' && handleCheck()}
                                                className="w-full bg-black border border-white/10 rounded-2xl px-6 py-5 text-white text-2xl font-mono text-center outline-none focus:border-yellow-500"
                                                placeholder="..."
                                            />
                                            {showSolutions && (
                                                <div className="absolute -top-3 -right-3 bg-yellow-500 text-black text-[10px] px-2 py-1 rounded font-black shadow-lg z-10">
                                                    KEY: {questionsToUse[stage].a}
                                                </div>
                                            )}
                                        </div>
                                        <button onClick={() => handleCheck()} className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black py-5 rounded-2xl transition-all uppercase tracking-widest text-xs">Bestätigen</button>
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-center gap-2 mt-8">
                                {[...Array(questionsToUse.length)].map((_, i) => (
                                    <div key={i} className={cn("w-1.5 h-1.5 rounded-full", stage > i ? "bg-green-500" : (stage === i ? "bg-yellow-400 w-4 shadow-[0_0_10px_yellow]" : "bg-slate-800"))} />
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <div className="bg-slate-900/30 border border-white/5 p-8 rounded-3xl flex flex-col items-center justify-center text-center space-y-4 h-full border-dashed">
                            <div className="w-20 h-20 bg-yellow-500/5 rounded-full flex items-center justify-center text-yellow-500/20 border border-yellow-500/10"><Lock size={40} /></div>
                            <h4 className="text-white font-bold uppercase tracking-widest opacity-50">Prüfungs-Sektor</h4>
                            <p className="text-slate-600 text-xs text-center">Schließe erst die Lernphase ab. Binär-Mathe und Codes musst du im Quiz per Hand tippen!</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    </div>
  );
}
