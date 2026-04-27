import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, BookOpen, AlertTriangle, X, GraduationCap, ChevronLeft, Target, Table, Trophy, SkipForward } from 'lucide-react';
import { cn } from '../utils/cn';
import { getRandomQuestions, BONUS_CHALLENGES } from '../utils/pool';
import { useProgress } from '../hooks/useProgress';

type BinarQuestion =
  | { q: string; target: number; type: 'manual'; a?: never; options?: never }
  | { q: string; a: string; type: 'manual'; target?: never; options?: never }
  | { q: string; a: string; type: 'mc'; options: string[]; target?: never };

const BASICS_POOL: BinarQuestion[] = [
    { q: "Stelle die Zahl 1 ein", target: 1, type: 'manual' },
    { q: "Stelle die Zahl 8 ein", target: 8, type: 'manual' },
    { q: "Stelle die Zahl 15 ein", target: 15, type: 'manual' },
    { q: "Stelle die Zahl 64 ein", target: 64, type: 'manual' },
    { q: "Stelle die Zahl 255 ein", target: 255, type: 'manual' },
    { q: "Stelle die Zahl 42 ein", target: 42, type: 'manual' },
    { q: "Stelle die Zahl 128 ein", target: 128, type: 'manual' },
    { q: "Stelle die Zahl 100 ein", target: 100, type: 'manual' }
];

const CONV_POOL: BinarQuestion[] = [
    { q: "Was ist 10 Dezimal in Binär?", a: "1010", type: 'manual' },
    { q: "Was ist 1101 Binär in Dezimal?", a: "13", type: 'manual' },
    { q: "Was ist 32 Dezimal in Binär?", a: "100000", type: 'manual' },
    { q: "Was ist 11111 Binär in Dezimal?", a: "31", type: 'manual' },
    { q: "Was ist 100 Dezimal in Binär?", a: "1100100", type: 'manual' },
    { q: "Was ist 10101 Binär in Dezimal?", a: "21", type: 'manual' },
    { q: "Was ist 7 Dezimal in Binär?", a: "111", type: 'manual' }
];

const MATH_ADD_POOL: BinarQuestion[] = [
    { q: "Was ist 01 + 01?", a: "10", type: 'manual' },
    { q: "Was ist 101 + 010?", a: "111", type: 'manual' },
    { q: "Was ist 111 + 001?", a: "1000", type: 'manual' },
    { q: "Was ist 1010 + 0101?", a: "1111", type: 'manual' },
    { q: "Übertrag: Was passiert bei 1 + 1?", a: "0 UND 1 ÜBERTRAG", type: 'mc', options: ["0 UND 1 ÜBERTRAG", "ES WIRD ZU 2", "NICHTS"] }
];

const MATH_SUB_POOL: BinarQuestion[] = [
    { q: "Was ist 11 - 01?", a: "10", type: 'manual' },
    { q: "Was ist 110 - 10?", a: "100", type: 'manual' },
    { q: "Was ist 100 - 01?", a: "11", type: 'manual' },
    { q: "Was ist 1010 - 0010?", a: "1000", type: 'manual' },
    { q: "Wie nennt man es, wenn man eine '1' von der linken Stelle leiht?", a: "BORGEN / BORROW", type: 'mc', options: ["BORGEN / BORROW", "STEHLEN", "ÜBERTRAG"] }
];

const MATH_MIXED_POOL: BinarQuestion[] = [
    { q: "Mix: 101 + 011?", a: "1000", type: 'manual' },
    { q: "Mix: 111 - 010?", a: "101", type: 'manual' },
    { q: "Mix: 1000 - 0001?", a: "111", type: 'manual' },
    { q: "Mix: 11 + 11?", a: "110", type: 'manual' },
    { q: "Mix: 1010 - 101?", a: "101", type: 'manual' }
];

const ASCII_POOL: BinarQuestion[] = [
    { q: "Dezimal-Code für 'A'?", a: "65", type: 'manual' },
    { q: "Dezimal-Code für 'a'?", a: "97", type: 'manual' },
    { q: "Binärcode für 'B' (66)? (8-Bit)", a: "01000010", type: 'manual' },
    { q: "Übersetze die Zahl 33 in das ASCII Zeichen", a: "!", type: 'manual' },
    { q: "Übersetze: 01000011-01000001-01000010", a: "CAB", type: 'manual' },
    { q: "Übersetze: 01100001-01100010-01100011", a: "abc", type: 'manual' },
    { q: "Warum füllen wir ASCII mit Nullen auf?", a: "UM IMMER 8 BITS ZU HABEN", type: 'mc', options: ["UM IMMER 8 BITS ZU HABEN", "FÜR MEHR SPEED", "WEIL ES COOL AUSSIEHT"] }
];

type SubTopic = 'basics' | 'conversion' | 'math_add' | 'math_sub' | 'math_mixed' | 'ascii';

export function BinarWorld({ onComplete, showSolutions, initialPhase }: { onComplete: () => void, showSolutions: boolean, initialPhase?: 'learn' | 'bonus' }) {
  const { progress, saveStage } = useProgress();
  const [phase, setPhase] = useState<'learn' | 'quiz' | 'bonus' | 'bonus_quiz'>(() => {
      if (initialPhase === 'bonus') return 'bonus';
      return 'learn';
  });
  const [subTopic, setSubTopic] = useState<SubTopic>(() => {
      if (initialPhase === 'bonus') return 'ascii';
      return 'basics';
  });
  const [learnPage, setLearnPage] = useState(0);
  const [stage, setStage] = useState(progress.stages.binar || 0);
  const [showAsciiTable, setShowAsciiTable] = useState(false);
  const [bits, setBits] = useState([0, 0, 0, 0, 0, 0, 0, 0]);
  const [userInput, setUserInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const quizQuestions = useMemo(() => ({
    basics: getRandomQuestions(BASICS_POOL, 5),
    conversion: getRandomQuestions(CONV_POOL, 5),
    math_add: getRandomQuestions(MATH_ADD_POOL, 5),
    math_sub: getRandomQuestions(MATH_SUB_POOL, 5),
    math_mixed: getRandomQuestions(MATH_MIXED_POOL, 5),
    ascii: getRandomQuestions(ASCII_POOL, 5)
  }), [subTopic, phase === 'learn']);

  const currentQuestions: BinarQuestion[] = (quizQuestions as any)[subTopic];
  const currentValue = bits.reduce((acc, bit, idx) => acc + bit * Math.pow(2, 7 - idx), 0);

  const toggleBit = (index: number) => {
    const newBits = [...bits];
    newBits[index] = newBits[index] === 0 ? 1 : 0;
    setBits(newBits);
  };

  const handleCheck = (choice?: string) => {
    let success = false;
    const answer = choice || userInput;
    const questionsToUse = phase === 'bonus_quiz' ? BONUS_CHALLENGES.binar : currentQuestions;
    const currentQ = questionsToUse[stage];

    if (currentQ.type === 'manual' && 'target' in currentQ && typeof currentQ.target === 'number') {
        if (currentValue === currentQ.target) success = true;
    } else if (currentQ.a) {
        if (subTopic === 'ascii' && !phase.includes('bonus')) {
            if (answer.trim() === currentQ.a) success = true;
        } else {
            if (answer.toUpperCase().trim() === currentQ.a.toUpperCase()) success = true;
        }
    }

    if (success) {
        if (stage < questionsToUse.length - 1) {
            const nextStage = stage + 1;
            setStage(nextStage);
            saveStage('binar', nextStage);
            setUserInput('');
        } else if (phase === 'bonus_quiz') {
            onComplete();
        } else {
            // Next SubTopic
            const flow: SubTopic[] = ['basics', 'conversion', 'math_add', 'math_sub', 'math_mixed', 'ascii'];
            const currentIndex = flow.indexOf(subTopic);
            if (currentIndex < flow.length - 1) {
                setSubTopic(flow[currentIndex + 1]);
                setPhase('learn');
                setLearnPage(0);
                setStage(0);
                saveStage('binar', 0);
            } else {
                setPhase('bonus');
                setStage(0);
            }
            setUserInput('');
        }
    } else {
        let msg = 'DATEN-FEHLER: Die Eingabe ist nicht korrekt.';
        if (subTopic === 'ascii' && answer.toUpperCase().trim() === currentQ.a?.toUpperCase()) {
            msg = 'FEHLER: Achte genau auf Groß- und Kleinschreibung! Im ASCII Code ist das ein großer Unterschied.';
        }
        setError(msg);
    }
  };

  const renderLearn = () => {
    if (phase === 'bonus') {
        return (
            <div className="space-y-6 text-center">
                <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center text-yellow-500 mx-auto mb-6">
                    <Trophy size={40} />
                </div>
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Bit-Master Bonus</h3>
                <p className="text-slate-400">Du beherrschst die Grundlagen der Binärwelt. Traust du dich an die Experten-Herausforderung?</p>
            </div>
        )
    }
    switch (subTopic) {
        case 'basics':
            return [
                (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-black text-white uppercase tracking-tight">Wie Computer denken</h3>
                        <p className="text-slate-300 leading-relaxed">
                            Ein Computer kennt nur zwei Zustände: <b>Strom an (1)</b> oder <b>Strom aus (0)</b>.
                            Das nennt man das Binärsystem. Jede dieser 0en oder 1en ist ein <b>Bit</b>.
                        </p>
                        <div className="bg-purple-500/10 border border-purple-500/20 p-6 rounded-2xl flex justify-center gap-4">
                            <div className="text-center"><div className="w-12 h-12 bg-purple-500 rounded flex items-center justify-center font-bold text-white mb-2 shadow-lg">1</div><span className="text-[10px] text-purple-400 uppercase font-black">ON</span></div>
                            <div className="text-center"><div className="w-12 h-12 bg-slate-800 rounded flex items-center justify-center font-bold text-slate-500 mb-2">0</div><span className="text-[10px] text-slate-500 uppercase font-black">OFF</span></div>
                        </div>
                    </div>
                ),
                (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-black text-white uppercase tracking-tight">Stellenwerte</h3>
                        <p className="text-slate-300 leading-relaxed">
                            Genau wie in unserem 10er-System (Einer, Zehner, Hunderter) haben auch Binärstellen feste Werte.
                            Sie verdoppeln sich von rechts nach links: 1, 2, 4, 8, 16, 32, 64, 128.
                        </p>
                        <div className="flex flex-wrap justify-center gap-2 py-4">
                            {bits.map((bit, idx) => (
                                <div key={idx} className="flex flex-col items-center gap-2">
                                    <span className="text-[10px] font-mono text-slate-600">{Math.pow(2, 7 - idx)}</span>
                                    <button onClick={() => toggleBit(idx)} className={cn("w-10 h-14 rounded-lg border-2 flex items-center justify-center font-black transition-all", bit ? "bg-purple-500 border-purple-400 text-white" : "bg-black border-slate-800 text-slate-800")}>{bit}</button>
                                </div>
                            ))}
                        </div>
                        <div className="bg-black/40 p-3 rounded-xl text-center border border-white/5"><span className="text-2xl font-black text-white font-mono">{currentValue}</span></div>
                    </div>
                )
            ][learnPage] || null;

        case 'conversion':
            return (
                <div className="space-y-6">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">Dezimal → Binär</h3>
                    <p className="text-slate-300 leading-relaxed">
                        Um eine Zahl umzuwandeln, suchen wir die größten "Pakete" (Zweierpotenzen), die hineinpassen.
                    </p>
                    <div className="bg-purple-500/5 border border-purple-500/20 p-6 rounded-2xl">
                        <h4 className="text-purple-400 font-bold text-xs mb-3 uppercase">Beispiel: 13</h4>
                        <ul className="text-xs text-slate-400 space-y-2 font-mono">
                            <li>Passt 8? Ja (1). Rest 5</li>
                            <li>Passt 4? Ja (1). Rest 1</li>
                            <li>Passt 2? Nein (0). Rest 1</li>
                            <li>Passt 1? Ja (1). Rest 0</li>
                            <li className="text-white font-black mt-2">→ 1101</li>
                        </ul>
                    </div>
                </div>
            );

        case 'math_add':
            return (
                <div className="space-y-6">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">Binäre Addition</h3>
                    <p className="text-slate-300 leading-relaxed">
                        Addition funktioniert wie gewohnt, aber: <b>1 + 1 = 10</b> (0 hinschreiben, 1 Übertrag).
                        Das ist der Moment, in dem die Stelle "voll" ist.
                    </p>
                    <div className="bg-purple-500/10 border border-purple-500/20 p-6 rounded-2xl font-mono">
                        <div className="grid grid-cols-1 gap-1 text-right max-w-[100px] mx-auto">
                            <div className="tracking-widest">  0 1</div>
                            <div className="border-b border-white/20 pb-1 tracking-widest">+ 0 1</div>
                            <div className="text-purple-400 font-black tracking-widest">1 0</div>
                        </div>
                    </div>
                </div>
            );

        case 'math_sub':
            return (
                <div className="space-y-6">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">Binäre Subtraktion</h3>
                    <p className="text-slate-300 leading-relaxed">
                        Wenn du 0 - 1 rechnen musst, musst du dir von der linken Stelle eine 1 "borgen".
                        Die 0 wird dann zur 10 (binär für 2), und 2 - 1 = 1.
                    </p>
                    <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl font-mono">
                        <div className="grid grid-cols-1 gap-1 text-right max-w-[100px] mx-auto">
                            <div className="tracking-widest text-slate-500">1 0</div>
                            <div className="border-b border-white/20 pb-1 tracking-widest">- 0 1</div>
                            <div className="text-red-400 font-black tracking-widest">0 1</div>
                        </div>
                    </div>
                </div>
            );

        case 'math_mixed':
            return (
                <div className="space-y-6 text-center">
                    <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center text-orange-400 mx-auto mb-6">
                        <Target size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">Mixed Challenge</h3>
                    <p className="text-slate-300 leading-relaxed">
                        Jetzt wird es ernst. Wir mischen Plus und Minus. Konzentriere dich auf die Überträge und das Borgen!
                    </p>
                </div>
            );

        case 'ascii':
            return [
                (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-black text-white uppercase tracking-tight">ASCII Tabelle</h3>
                        <p className="text-slate-300 leading-relaxed text-xs">
                            Hier ist ein Ausschnitt der ASCII Tabelle. Beachte: Groß- und Kleinbuchstaben haben unterschiedliche Codes!
                        </p>
                        <div className="grid grid-cols-5 gap-2 font-mono text-[8px] bg-black/40 p-4 rounded-xl border border-white/10 max-h-[200px] overflow-y-auto">
                            <div className="text-purple-400">33 !</div><div className="text-purple-400">34 "</div><div className="text-purple-400">35 #</div><div className="text-purple-400">36 $</div><div className="text-purple-400">37 %</div>
                            <div className="text-white">65 A</div><div className="text-white">66 B</div><div className="text-white">67 C</div><div className="text-white">68 D</div><div className="text-white">69 E</div>
                            <div className="text-white">70 F</div><div className="text-white">71 G</div><div className="text-white">72 H</div><div className="text-white">73 I</div><div className="text-white">74 J</div>
                            <div className="text-white">75 K</div><div className="text-white">76 L</div><div className="text-white">77 M</div><div className="text-white">78 N</div><div className="text-white">79 O</div>
                            <div className="text-white">80 P</div><div className="text-white">81 Q</div><div className="text-white">82 R</div><div className="text-white">83 S</div><div className="text-white">84 T</div>
                            <div className="text-slate-400">97 a</div><div className="text-slate-400">98 b</div><div className="text-slate-400">99 c</div><div className="text-slate-400">100 d</div><div className="text-slate-400">101 e</div>
                            <div className="text-slate-400">102 f</div><div className="text-slate-400">103 g</div><div className="text-slate-400">104 h</div><div className="text-slate-400">105 i</div><div className="text-slate-400">106 j</div>
                            <div className="text-slate-400">107 k</div><div className="text-slate-400">108 l</div><div className="text-slate-400">109 m</div><div className="text-slate-400">110 n</div><div className="text-slate-400">111 o</div>
                        </div>
                    </div>
                ),
                (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-black text-white uppercase tracking-tight">Die 8-Bit Regel</h3>
                        <p className="text-slate-300 leading-relaxed">
                            Ein ASCII-Zeichen belegt immer ein volles Byte (8 Bits). Wenn eine Zahl binär kürzer ist, füllen wir vorne mit <b>Nullen</b> auf!
                        </p>
                        <div className="bg-black/40 p-6 rounded-2xl border border-purple-500/30">
                            <div className="flex flex-col items-center space-y-2 font-mono">
                                <div className="text-slate-600 text-xs">Zahl 65 ist 1000001 (7 Bits)</div>
                                <div className="text-purple-400 text-xl font-black">01000001</div>
                                <div className="text-xs text-slate-500 uppercase tracking-widest">(8 Bits mit führender Null)</div>
                            </div>
                        </div>
                    </div>
                )
            ][learnPage] || null;

        default:
            return null;
    }
  };

  const isQuizVisible = phase === 'quiz' || phase === 'bonus_quiz';
  const questionsToUse = phase === 'bonus_quiz' ? BONUS_CHALLENGES.binar : currentQuestions;

  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto space-y-8 pb-32 relative">
        <AnimatePresence>
            {showAsciiTable && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-slate-900 border border-white/10 rounded-3xl p-8 max-w-2xl w-full shadow-2xl relative">
                        <button onClick={() => setShowAsciiTable(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X size={24} /></button>
                        <h3 className="text-xl font-black text-white uppercase mb-6 flex items-center gap-3">
                            <Table className="text-purple-400" /> ASCII Referenztabelle
                        </h3>
                        <div className="grid grid-cols-6 gap-2 font-mono text-[10px] bg-black/40 p-6 rounded-xl border border-white/10 max-h-[400px] overflow-y-auto">
                            <div className="text-purple-400">33 !</div><div className="text-purple-400">34 "</div><div className="text-purple-400">35 #</div><div className="text-purple-400">36 $</div><div className="text-purple-400">37 %</div><div className="text-purple-400">38 &</div>
                            <div className="text-white">65 A</div><div className="text-white">66 B</div><div className="text-white">67 C</div><div className="text-white">68 D</div><div className="text-white">69 E</div><div className="text-white">70 F</div>
                            <div className="text-white">71 G</div><div className="text-white">72 H</div><div className="text-white">73 I</div><div className="text-white">74 J</div><div className="text-white">75 K</div><div className="text-white">76 L</div>
                            <div className="text-white">77 M</div><div className="text-white">78 N</div><div className="text-white">79 O</div><div className="text-white">80 P</div><div className="text-white">81 Q</div><div className="text-white">82 R</div>
                            <div className="text-white">83 S</div><div className="text-white">84 T</div><div className="text-white">85 U</div><div className="text-white">86 V</div><div className="text-white">87 W</div><div className="text-white">88 X</div>
                            <div className="text-slate-400">97 a</div><div className="text-slate-400">98 b</div><div className="text-slate-400">99 c</div><div className="text-slate-400">100 d</div><div className="text-slate-400">101 e</div><div className="text-slate-400">102 f</div>
                            <div className="text-slate-400">103 g</div><div className="text-slate-400">104 h</div><div className="text-slate-400">105 i</div><div className="text-slate-400">106 j</div><div className="text-slate-400">107 k</div><div className="text-slate-400">108 l</div>
                            <div className="text-slate-400">109 m</div><div className="text-slate-400">110 n</div><div className="text-slate-400">111 o</div><div className="text-slate-400">112 p</div><div className="text-slate-400">113 q</div><div className="text-slate-400">114 r</div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
        <AnimatePresence>
            {error && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-slate-900 border-2 border-red-500/50 rounded-3xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(239,68,68,0.2)] relative">
                        <button onClick={() => setError(null)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X size={20} /></button>
                        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 mx-auto mb-6"><AlertTriangle size={32} /></div>
                        <h3 className="text-xl font-black text-white text-center uppercase mb-4">Berechnungsfehler</h3>
                        <p className="text-slate-400 text-center text-sm mb-8">{error}</p>
                        <button onClick={() => setError(null)} className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-4 rounded-xl text-xs uppercase">Check wiederholen</button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
            <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center text-purple-400"><Cpu size={32} /></div>
                <div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Welt 2: Binärzahlen</h2>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-purple-400 font-mono text-xs uppercase tracking-widest">{phase.includes('bonus') ? 'bonus' : subTopic}</span>
                        <span className="text-slate-600 font-mono text-xs uppercase">{phase === 'learn' ? 'Lernphase' : 'Prüfungsphase'}</span>
                    </div>
                </div>
            </div>
            <div className="flex gap-1">
                {['basics', 'conversion', 'math_add', 'math_sub', 'math_mixed', 'ascii'].map((t, i) => (
                    <div key={i} className={cn("h-1 w-8 rounded-full", subTopic === t ? "bg-purple-500" : (['basics', 'conversion', 'math_add', 'math_sub', 'math_mixed', 'ascii'].indexOf(subTopic) > i ? "bg-purple-900" : "bg-slate-800"))} />
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

                            {(subTopic === 'basics' && learnPage < 1) || (subTopic === 'ascii' && learnPage < 1) ? (
                                <button onClick={() => setLearnPage(p => p + 1)} className="bg-white text-black px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest">Weiter</button>
                            ) : (
                                <button onClick={() => setPhase('quiz')} className="bg-purple-500 text-black px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest animate-pulse">Zum Quiz</button>
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
                        <motion.div key="quiz" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-slate-900 border-2 border-purple-500/30 p-8 rounded-3xl shadow-2xl h-full flex flex-col relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 flex flex-col items-end gap-2">
                                <GraduationCap className="text-purple-500 opacity-20" size={40} />
                                {subTopic === 'ascii' && (
                                    <button
                                        onClick={() => setShowAsciiTable(true)}
                                        className="bg-purple-500/10 border border-purple-500/20 text-purple-400 p-2 rounded-lg hover:bg-purple-500/20 transition-colors flex items-center gap-2 text-[10px] font-black uppercase"
                                    >
                                        <Table size={14} /> Tabelle öffnen
                                    </button>
                                )}
                            </div>
                            <h4 className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-8">Mission Task {stage+1}/{questionsToUse.length}</h4>

                            <div className="flex-1 flex flex-col justify-center space-y-8">
                                <div className="text-center">
                                    <p className="text-white text-xl font-bold mb-2">{questionsToUse[stage].q}</p>
                                </div>

                                <div className="grid grid-cols-1 gap-3">
                                    {subTopic === 'basics' && !phase.includes('bonus') && (
                                        <div className={cn("text-center py-4 bg-black/40 rounded-xl border mb-4 font-mono text-3xl font-black", currentValue === (questionsToUse[stage] as any).target ? "text-green-400 border-green-500/50" : "text-white border-white/10")}>
                                            {currentValue}
                                        </div>
                                    )}

                                    {questionsToUse[stage].type === 'mc' ? (
                                        (questionsToUse[stage].options || []).map((opt, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleCheck(opt)}
                                                className={cn(
                                                    "w-full bg-black/40 hover:bg-purple-500/10 border border-white/10 hover:border-purple-500/50 p-4 rounded-xl text-white font-mono text-left transition-all relative group",
                                                    showSolutions && opt === questionsToUse[stage].a && "border-yellow-500/50 bg-yellow-500/5"
                                                )}
                                            >
                                                <span className="text-[10px] text-slate-500 mr-4 group-hover:text-purple-500">{i + 1}.</span>
                                                {opt}
                                                {showSolutions && opt === questionsToUse[stage].a && (
                                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-yellow-500 text-[8px] font-black uppercase">Solution</span>
                                                )}
                                            </button>
                                        ))
                                    ) : (
                                        <div className="space-y-4">
                                            {(!phase.includes('bonus') ? subTopic !== 'basics' : true) && (
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        value={userInput}
                                                        onChange={e => setUserInput(e.target.value)}
                                                        onKeyDown={e => e.key === 'Enter' && handleCheck()}
                                                        className="w-full bg-black border border-white/10 rounded-2xl px-6 py-5 text-white text-3xl font-mono text-center outline-none focus:border-purple-500"
                                                        placeholder="..."
                                                    />
                                                </div>
                                            )}
                                            {showSolutions && (
                                                <div className="bg-yellow-500 text-black text-[10px] px-3 py-1 rounded font-black shadow-lg mx-auto w-fit mb-2">
                                                    {(questionsToUse[stage] as any).target ? `TARGET: ${(questionsToUse[stage] as any).target}` : `LÖSUNG: ${questionsToUse[stage].a}`}
                                                </div>
                                            )}
                                            <button onClick={() => handleCheck()} className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black py-5 rounded-2xl transition-all uppercase tracking-widest text-xs">Bestätigen</button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-center gap-2 mt-8">
                                {[...Array(questionsToUse.length)].map((_, i) => (
                                    <div key={i} className={cn("w-1.5 h-1.5 rounded-full transition-all", stage > i ? "bg-green-500" : (stage === i ? "bg-purple-400 w-4 shadow-[0_0_10px_purple]" : "bg-slate-800"))} />
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <div className="bg-slate-900/30 border border-white/5 p-8 rounded-3xl flex flex-col items-center justify-center text-center space-y-4 h-full">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-slate-600"><BookOpen size={32} /></div>
                            <h4 className="text-white font-bold uppercase tracking-tight">Prüfungs-Sektor</h4>
                            <p className="text-slate-500 text-xs">Schließe erst die Lernphase ab. Berechnungen müssen per Hand eingegeben werden!</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    </div>
  );
}
