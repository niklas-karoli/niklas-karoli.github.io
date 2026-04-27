import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, ChevronRight, Search, Terminal as TerminalIcon, FileCode, AlertTriangle, X } from 'lucide-react';
import { cn } from '../utils/cn';

const CHALLENGES = [
  {
    title: "1. Hallo Computer",
    desc: "In Python ist 'print' der Befehl, um etwas auf dem Bildschirm anzuzeigen. Lass den Computer 'Hallo' sagen.",
    hint: "print(\"Hallo\")",
    validate: (code: string) => code.includes('print(') && (code.includes('"Hallo"') || code.includes("'Hallo'")),
    successMsg: "Perfekt! Dein erster Befehl läuft.",
    sol: "print(\"Hallo\")"
  },
  {
    title: "2. Dein Agenten-Name",
    desc: "Wir speichern Text in 'Variablen'. Erstelle eine Variable namens 'name' und gib ihr einen Wert (z.B. \"Bond\").",
    hint: "name = \"Bond\"",
    validate: (code: string) => code.includes('name =') && (code.includes('"') || code.includes("'")),
    successMsg: "Agent erkannt. Die Variable wurde gespeichert.",
    sol: "name = \"Agent\""
  },
  {
    title: "3. Variablen anzeigen",
    desc: "Du kannst Variablen auch mit print anzeigen lassen. Gib deine Variable 'name' aus.",
    hint: "print(name)",
    validate: (code: string) => code.includes('print(name)'),
    successMsg: "Da ist dein Name wieder!",
    sol: "print(name)"
  },
  {
    title: "4. Suchen in Text",
    desc: "Ein 'Loop' (Schleife) geht einen Text Buchstabe für Buchstabe durch. Probiere diesen Befehl aus.",
    hint: "for buchstabe in \"ABC\": print(buchstabe)",
    validate: (code: string) => code.includes('for') && code.includes('in') && code.includes('print'),
    successMsg: "Der Computer hat nacheinander A, B und C ausgegeben.",
    sol: "for x in \"ABC\": print(x)"
  },
  {
    title: "5. Der Bruteforce-Check",
    desc: "Wir können prüfen, ob ein Buchstabe ein Treffer ist. Schreibe: if buchstabe == \"B\":",
    hint: "if buchstabe == \"B\":",
    validate: (code: string) => code.includes('if') && code.includes('==') && code.includes(':'),
    successMsg: "Logik verstanden! Das ist das Herzstück von Bruteforce.",
    sol: "if buchstabe == \"B\":"
  },
  {
    title: "6. Finale: Brute-Force",
    desc: "Kombiniere alles! Wir durchsuchen das Alphabet nach dem geheimen Passwort 'C'.",
    hint: "alphabet = \"ABC\"\nfor b in alphabet:\n    if b == \"C\":\n        print(\"Gefunden!\")",
    validate: (code: string) => code.includes('for') && code.includes('if') && code.includes('==') && code.includes('print'),
    successMsg: "MISSION ERFÜLLT! Du hast ein Programm geschrieben, das Passwörter knackt.",
    sol: "alphabet = \"ABC\"\nfor b in alphabet:\n    if b == \"C\":\n        print(\"Gefunden!\")"
  },
  {
    title: "7. Rechnen mit Python",
    desc: "Python kann wie ein Taschenrechner genutzt werden. Berechne 5 + 5 und speichere es in 'ergebnis'.",
    hint: "ergebnis = 5 + 5",
    validate: (code: string) => code.includes('ergebnis =') && code.includes('5') && code.includes('+'),
    successMsg: "Korrekt! Python beherrscht alle Grundrechenarten.",
    sol: "ergebnis = 5 + 5"
  },
  {
    title: "8. Benutzereingabe",
    desc: "Mit 'input()' kann der User dem Programm etwas mitteilen. Frage nach dem Alter: alter = input(\"Wie alt?\")",
    hint: "alter = input(\"Wie alt?\")",
    validate: (code: string) => code.includes('input('),
    successMsg: "Eingabe registriert. So werden Programme interaktiv.",
    sol: "alter = input(\"Wie alt?\")"
  },
  {
    title: "9. Datentypen: Integer",
    desc: "input() gibt immer Text zurück. Um damit zu rechnen, brauchen wir Zahlen (int). Wandle alter um: alter = int(alter)",
    hint: "alter = int(alter)",
    validate: (code: string) => code.includes('int('),
    successMsg: "Jetzt ist 'alter' eine echte Zahl!",
    sol: "alter = int(alter)"
  },
  {
    title: "10. Logische Verknüpfung",
    desc: "Wir können Bedingungen kombinieren. Prüfe ob 'alter' > 12 UND < 100: if alter > 12 and alter < 100:",
    hint: "if alter > 12 and alter < 100:",
    validate: (code: string) => code.includes('if') && code.includes('and') && code.includes('>'),
    successMsg: "Logik-Check bestanden. Du verstehst 'and'!",
    sol: "if alter > 12 and alter < 100:"
  },
  {
    title: "11. Listen erstellen",
    desc: "Agenten-Listen werden in Eckigen Klammern gespeichert. Erstelle eine Liste: agents = [\"Alice\", \"Bob\"]",
    hint: "agents = [\"Alice\", \"Bob\"]",
    validate: (code: string) => code.includes('[') && code.includes(']') && code.includes(','),
    successMsg: "Liste angelegt. Listen sind extrem wichtig für Datenmengen.",
    sol: "agents = [\"Alice\", \"Bob\"]"
  },
  {
    title: "12. Das große Finale",
    desc: "Schreibe ein Programm, das prüft ob 'Eve' in der Liste 'agents' ist: if \"Eve\" in agents: print(\"Gefahr!\")",
    hint: "if \"Eve\" in agents:\n    print(\"Gefahr!\")",
    validate: (code: string) => code.includes('if') && code.includes('in') && code.includes('print'),
    successMsg: "GLÜCKWUNSCH! Du hast den Python Masterclass abgeschlossen.",
    sol: "if \"Eve\" in agents: print(\"Gefahr!\")"
  }
];

const SUGGESTED_BLOCKS = [
  { code: 'print(', desc: 'Gibt Text aus' },
  { code: 'alphabet = ', desc: 'Variable für Text' },
  { code: 'for b in ', desc: 'Schleife' },
  { code: 'if b == ', desc: 'Vergleich' },
  { code: 'break', desc: 'Stoppt Schleife' },
  { code: 'name = ', desc: 'Agenten Name' },
  { code: 'input(', desc: 'Abfrage' },
  { code: 'int(', desc: 'Zu Zahl' },
  { code: ' and ', desc: 'Und' },
  { code: ' in ', desc: 'In Liste' }
];

import { useProgress } from '../hooks/useProgress';

export function PythonWorld({ onComplete, showSolutions }: { onComplete: () => void, showSolutions: boolean }) {
  const { progress, saveStage } = useProgress();
  const [code, setCode] = useState('');
  const [stage, setStage] = useState(progress.stages.python || 0);
  const [showIntro, setShowIntro] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [autocomplete, setAutocomplete] = useState<{ matches: string[], index: number } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const runCode = () => {
    setIsRunning(true);
    setOutput(['> Python VM 3.12...', '> Checking Script...']);

    setTimeout(() => {
      if (CHALLENGES[stage].validate(code)) {
          setOutput(prev => [...prev, '✓ VALIDATION SUCCESS', CHALLENGES[stage].successMsg]);
          if (stage < CHALLENGES.length - 1) {
              setTimeout(() => {
                  const nextStage = stage + 1;
                  setStage(nextStage);
                  saveStage('python', nextStage);
                  setCode('');
                  setOutput([]);
              }, 2000);
          } else {
              onComplete();
          }
      } else {
          setOutput(prev => [...prev, '✖ VALIDATION FAILED', 'Schau dir den Tipp an!']);
          setError('SYNTAX-FEHLER: Der eingegebene Python-Code entspricht nicht der Missionsvorgabe. Überprüfe die Syntax!');
      }
      setIsRunning(false);
    }, 1500);
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setCode(val);

    const lines = val.split('\n');
    const lastLine = lines[lines.length - 1];
    const lastWord = lastLine.split(/[\s(]+/).pop() || '';

    if (lastWord.length >= 2) {
        const matches = SUGGESTED_BLOCKS.filter(b => b.code.startsWith(lastWord)).map(b => b.code);
        if (matches.length > 0) {
            setAutocomplete({ matches, index: 0 });
        } else {
            setAutocomplete(null);
        }
    } else {
        setAutocomplete(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab' && autocomplete) {
        e.preventDefault();
        const lines = code.split('\n');
        const lastLine = lines[lines.length - 1];
        const words = lastLine.split(/([\s(]+)/);
        words[words.length - 1] = autocomplete.matches[autocomplete.index];
        lines[lines.length - 1] = words.join('');
        setCode(lines.join('\n'));
        setAutocomplete(null);
    } else if (e.key === 'ArrowDown' && autocomplete) {
        e.preventDefault();
        setAutocomplete(prev => prev ? { ...prev, index: (prev.index + 1) % prev.matches.length } : null);
    } else if (e.key === 'Tab') {
        e.preventDefault();
        const start = textareaRef.current!.selectionStart;
        const end = textareaRef.current!.selectionEnd;
        setCode(code.substring(0, start) + "    " + code.substring(end));
    }
  };

  if (showIntro) {
    return (
        <div className="max-w-4xl mx-auto p-12 text-center space-y-8">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-24 h-24 bg-blue-500/20 rounded-3xl flex items-center justify-center text-blue-400 mx-auto mb-8 shadow-2xl">
                <FileCode size={48} />
            </motion.div>
            <h2 className="text-5xl font-black text-white tracking-tighter uppercase">Der Python Masterclass</h2>
            <p className="text-slate-400 text-xl leading-relaxed max-w-2xl mx-auto">
                Willkommen zur letzten Stufe. Hier lernst du, wie man die Kraft von Code nutzt, um Aufgaben zu automatisieren
                und Verschlüsselungen in Millisekunden zu knacken.
            </p>
            <button onClick={() => setShowIntro(false)} className="mt-12 bg-blue-600 hover:bg-blue-500 text-white font-black px-12 py-5 rounded-2xl text-lg uppercase tracking-widest transition-all shadow-2xl">TERMINAL STARTEN</button>
        </div>
    );
  }

  return (
    <div className="p-6 md:p-12 max-w-[1400px] mx-auto flex flex-col h-[calc(100vh-120px)] space-y-6 overflow-hidden relative">
        <AnimatePresence>
            {error && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-slate-900 border-2 border-red-500/50 rounded-3xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(239,68,68,0.2)] relative">
                        <button onClick={() => setError(null)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X size={20} /></button>
                        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 mx-auto mb-6"><AlertTriangle size={32} /></div>
                        <h3 className="text-xl font-black text-white text-center uppercase mb-4">Compiler Fehler</h3>
                        <p className="text-slate-400 text-center text-sm mb-8">{error}</p>
                        <button onClick={() => setError(null)} className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-4 rounded-xl text-xs uppercase">Code korrigieren</button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>

        <div className="flex items-center justify-between shrink-0">
            <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400"><Code size={24} /></div>
                <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Python IDE</h2>
                    <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest mt-1">Stage {stage + 1} / {CHALLENGES.length}</p>
                </div>
            </div>
            <div className="flex gap-2">
                {[...Array(CHALLENGES.length)].map((_, i) => (
                    <div key={i} className={cn("h-1.5 w-6 rounded-full", i < stage ? "bg-green-500" : (i === stage ? "bg-blue-500" : "bg-slate-800"))} />
                ))}
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 overflow-hidden">
            <div className="lg:col-span-4 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
                <section className="bg-slate-900/50 border border-white/5 p-6 rounded-3xl space-y-4">
                    <h3 className="text-blue-400 font-black text-xs uppercase tracking-widest flex items-center gap-2"><Search size={14} /> Mission: {CHALLENGES[stage].title}</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">{CHALLENGES[stage].desc}</p>
                    <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl">
                        <span className="text-[10px] font-black text-blue-400 block mb-1 uppercase tracking-tighter">Tipp</span>
                        <code className="text-xs text-blue-200 whitespace-pre-wrap">{CHALLENGES[stage].hint}</code>
                    </div>
                </section>

                <section className="bg-slate-900/50 border border-white/5 p-6 rounded-3xl">
                     <h3 className="text-slate-500 font-black text-xs uppercase tracking-widest mb-4">Bibliothek</h3>
                     <div className="space-y-2">
                        {SUGGESTED_BLOCKS.map(b => (
                            <button key={b.code} onClick={() => setCode(prev => prev + b.code)} className="w-full flex justify-between items-center bg-black/40 p-2 rounded-lg border border-white/5 group hover:border-blue-500/30 transition-colors text-left">
                                <code className="text-[10px] text-blue-300">{b.code}</code>
                                <span className="text-[9px] text-slate-600 uppercase font-bold">{b.desc}</span>
                            </button>
                        ))}
                     </div>
                </section>
            </div>

            <div className="lg:col-span-8 flex flex-col gap-4 overflow-hidden relative">
                <div className="flex-1 bg-[#0d1117] rounded-3xl border border-white/10 flex flex-col overflow-hidden shadow-2xl relative">
                    <div className="bg-slate-900/80 px-6 py-3 border-b border-white/5 flex items-center justify-between shrink-0">
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">agent_main.py</span>
                        {showSolutions && (
                            <div className="bg-yellow-500 text-black text-[10px] px-3 py-1 rounded font-black animate-pulse flex items-center gap-2 max-w-[200px] overflow-hidden">
                                <TerminalIcon size={12} /> DEV_SOL: {CHALLENGES[stage].sol.split('\n')[0]}...
                            </div>
                        )}
                        <button onClick={runCode} disabled={isRunning} className="bg-blue-600 hover:bg-blue-500 text-white font-black px-6 py-2 rounded-xl text-[10px] uppercase tracking-widest shadow-lg transition-all">
                            {isRunning ? 'RUNNING...' : 'START SCRIPT'}
                        </button>
                    </div>

                    <div className="flex-1 flex overflow-hidden relative">
                        <div className="w-10 bg-black/20 border-r border-white/5 pt-6 text-center text-[10px] text-slate-800 font-mono select-none">
                            {Array.from({length: 15}).map((_, i) => <div key={i} className="h-6 leading-6">{i+1}</div>)}
                        </div>
                        <textarea ref={textareaRef} value={code} onChange={handleInput} onKeyDown={handleKeyDown} spellCheck={false} className="flex-1 bg-transparent p-6 outline-none text-blue-100 font-mono text-sm resize-none" placeholder="# Code hier eingeben..." />

                        <AnimatePresence>
                            {autocomplete && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute left-16 bottom-16 bg-slate-900 border border-blue-500/50 rounded-xl shadow-2xl p-2 z-50 min-w-[200px]"
                                >
                                    {autocomplete.matches.map((m, i) => (
                                        <div key={m} className={cn("px-4 py-2 text-xs font-mono rounded-lg cursor-pointer transition-colors", i === autocomplete.index ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-white/5")}>
                                            {m}
                                        </div>
                                    ))}
                                    <div className="text-[9px] text-slate-500 px-4 pt-2 border-t border-white/10 mt-2 font-black uppercase tracking-widest">TAB zum Einfügen</div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="h-32 bg-[#05070a] rounded-3xl border border-white/10 p-4 font-mono text-xs overflow-y-auto flex flex-col gap-1 shadow-2xl custom-scrollbar">
                    <div className="text-slate-600 border-b border-white/5 pb-1 mb-2 uppercase tracking-widest text-[9px] font-black flex items-center gap-2"><TerminalIcon size={10} /> Agent Output</div>
                    {output.map((line, i) => (
                        <div key={i} className={cn("flex gap-2", line.includes('✓') ? "text-green-400" : line.includes('✖') ? "text-red-400" : "text-blue-300")}>
                            <ChevronRight size={14} className="opacity-20 shrink-0" />
                            {line}
                        </div>
                    ))}
                    {isRunning && <div className="animate-pulse text-blue-500">_</div>}
                </div>
            </div>
        </div>
    </div>
  );
}
