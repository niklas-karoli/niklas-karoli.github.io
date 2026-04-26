import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Code, Play, Terminal as TerminalIcon, CheckCircle2, ChevronRight, Info } from 'lucide-react';
import { cn } from '../utils/cn';

const SUGGESTED_BLOCKS = [
  { code: 'alphabet = "ABC"', description: 'Definiert das Alphabet' },
  { code: 'for char in alphabet:', description: 'Schleife durch alle Zeichen' },
  { code: 'if char == target:', description: 'Prüft auf Übereinstimmung' },
  { code: 'print("Found: " + char)', description: 'Gibt das Ergebnis aus' },
];

export function PythonWorld({ onComplete }: { onComplete: () => void }) {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const runCode = () => {
    setIsRunning(true);
    setOutput(['> Starte Python-Interpreter...', '> Initialisiere Bruteforce-Modul...']);

    setTimeout(() => {
      // Very simple "simulated" execution
      const lines = code.split('\n').map(l => l.trim());

      if (lines.some(l => l.includes('for') && l.includes('alphabet')) &&
          lines.some(l => l.includes('if') && l.includes('target'))) {

        setOutput(prev => [...prev,
            'Prüfe A...',
            'Prüfe B...',
            'Prüfe C...',
            '...',
            'Prüfe W...',
            '>>> PASSWORT GEKNACKT: W'
        ]);
        setIsSuccess(true);
      } else {
        setOutput(prev => [...prev,
            'Fehler in Zeile 3: Logik unvollständig.',
            'Hinweis: Nutze eine Schleife, um das Alphabet zu durchsuchen.'
        ]);
      }
      setIsRunning(false);
    }, 1500);
  };

  // Simple Tab handling & Autocomplete
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = textareaRef.current!.selectionStart;
      const end = textareaRef.current!.selectionEnd;

      // Get the current word being typed
      const textBefore = code.substring(0, start);
      const lines = textBefore.split('\n');
      const currentLine = lines[lines.length - 1];
      const words = currentLine.trim().split(' ');
      const lastWord = words[words.length - 1];

      // Find matching block
      const match = SUGGESTED_BLOCKS.find(b => b.code.startsWith(lastWord));

      if (lastWord && match) {
          // Replace last word with the full block
          const linePrefix = currentLine.substring(0, currentLine.lastIndexOf(lastWord));
          const newLines = [...lines];
          newLines[newLines.length - 1] = linePrefix + match.code;
          const newTextBefore = newLines.join('\n');
          const newValue = newTextBefore + code.substring(end);
          setCode(newValue);

          setTimeout(() => {
            textareaRef.current!.selectionStart = textareaRef.current!.selectionEnd = newTextBefore.length;
          }, 0);
      } else {
          // Default tab: 4 spaces
          const newValue = code.substring(0, start) + "    " + code.substring(end);
          setCode(newValue);
          setTimeout(() => {
            textareaRef.current!.selectionStart = textareaRef.current!.selectionEnd = start + 4;
          }, 0);
      }
    }
  };

  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto h-[calc(100vh-120px)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">
            <Code size={28} />
            </div>
            <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">Python Workshop</h2>
            <p className="text-slate-500 font-mono text-sm">LEVEL_04: BRUTEFORCE_AUTOMATISIERUNG</p>
            </div>
        </div>
        {isSuccess && (
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={onComplete}
                className="bg-green-500 hover:bg-green-400 text-black font-black px-6 py-2 rounded-lg flex items-center gap-2"
            >
                WORKSHOP ABSCHLIESSEN <CheckCircle2 size={18} />
            </motion.button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
        {/* Left: Instructions & Blocks */}
        <div className="lg:col-span-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
            <section className="bg-slate-900/50 border border-white/5 p-6 rounded-2xl">
                <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                    <Info size={18} className="text-blue-400" /> Mission
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                    Ein echtes Passwort per Hand zu raten dauert ewig. Wir schreiben ein Python-Skript,
                    das das gesamte Alphabet für uns durchläuft.
                </p>
                <p className="text-blue-400 text-xs font-bold uppercase mb-4">Aufgabe:</p>
                <p className="text-slate-300 text-sm italic">
                    Schreibe einen Code, der das "W" findet, indem er durch das Alphabet loopt.
                </p>
            </section>

            <section className="bg-slate-900/50 border border-white/5 p-6 rounded-2xl">
                <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-widest">Verfügbare Code-Bausteine</h3>
                <div className="space-y-3">
                    {SUGGESTED_BLOCKS.map((block, i) => (
                        <div key={i} className="group cursor-help">
                            <code className="block bg-black/60 p-2 rounded border border-white/5 text-blue-300 text-xs mb-1 group-hover:border-blue-500/50 transition-colors">
                                {block.code}
                            </code>
                            <p className="text-[10px] text-slate-500 ml-1">{block.description}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>

        {/* Center: Editor */}
        <div className="lg:col-span-2 flex flex-col gap-4 overflow-hidden">
            <div className="flex-1 bg-[#0d1117] rounded-2xl border border-white/10 flex flex-col overflow-hidden shadow-2xl">
                <div className="bg-slate-900/80 px-4 py-2 border-b border-white/5 flex items-center justify-between">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">bruteforce.py</span>
                    <button
                        onClick={runCode}
                        disabled={isRunning}
                        className={cn(
                            "flex items-center gap-2 px-4 py-1 rounded-md text-xs font-bold transition-all",
                            isRunning ? "bg-slate-800 text-slate-500" : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20"
                        )}
                    >
                        {isRunning ? 'Wird ausgeführt...' : <><Play size={12} fill="currentColor" /> RUN</>}
                    </button>
                </div>
                <div className="flex-1 relative font-mono text-sm">
                    <div className="absolute left-0 top-0 bottom-0 w-12 bg-black/20 border-r border-white/5 flex flex-col items-center pt-4 text-slate-700 select-none">
                        {[1,2,3,4,5,6,7,8,9,10,11,12].map(n => <div key={n}>{n}</div>)}
                    </div>
                    <textarea
                        ref={textareaRef}
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="# Tippe deinen Python-Code hier..."
                        className="absolute inset-0 left-12 bg-transparent p-4 outline-none resize-none text-blue-100 caret-blue-400 placeholder:text-slate-700"
                        spellCheck={false}
                    />
                </div>
            </div>

            {/* Bottom: Terminal */}
            <div className="h-40 bg-black rounded-2xl border border-white/10 p-4 font-mono text-xs overflow-y-auto flex flex-col gap-1">
                <div className="flex items-center gap-2 text-slate-600 mb-2 border-b border-white/5 pb-1">
                    <TerminalIcon size={14} />
                    <span className="uppercase tracking-widest text-[9px] font-bold">Terminal Output</span>
                </div>
                {output.map((line, i) => (
                    <div key={i} className={cn(
                        "flex gap-2",
                        line.startsWith('>') ? "text-slate-500" :
                        line.includes('Fehler') ? "text-red-400" :
                        line.includes('GEKNACKT') ? "text-green-400 font-bold" : "text-blue-300"
                    )}>
                        <ChevronRight size={14} className="shrink-0 opacity-30" />
                        {line}
                    </div>
                ))}
                {isRunning && <div className="animate-pulse text-blue-400">_</div>}
            </div>
        </div>
      </div>
    </div>
  );
}
