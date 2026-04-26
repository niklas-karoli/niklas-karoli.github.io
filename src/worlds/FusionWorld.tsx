import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, MessageSquare, ShieldCheck, ArrowRight, Lock } from 'lucide-react';
import { cn } from '../utils/cn';

export function FusionWorld({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [xorA, setXorA] = useState(0);
  const [xorB, setXorB] = useState(0);
  const [chatMessage, setChatMessage] = useState('');
  const [chatKey, setChatKey] = useState('1010');

  const xorResult = xorA ^ xorB;

  const toBinary = (text: string) => {
    return text.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
  };

  const xorCipher = (text: string, key: string) => {
    if (!key) return text;
    let result = '';
    for (let i = 0; i < text.length; i++) {
        result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
  };

  return (
    <div className="p-6 md:p-12 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center text-yellow-400">
          <Zap size={28} />
        </div>
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tight">Die Fusion</h2>
          <p className="text-slate-500 font-mono text-sm">LEVEL_03: XOR_UND_E2E_PROTOKOLLE</p>
        </div>
      </div>

      {step === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <section className="bg-slate-900/50 border border-white/5 p-8 rounded-2xl">
                <h3 className="text-xl font-bold text-white mb-4">1. Das XOR-Gatter</h3>
                <p className="text-slate-400 mb-8">
                    XOR (Exclusive OR) ist die Basis moderner Verschlüsselung. Die Regel ist einfach:
                    Das Ergebnis ist nur <span className="text-yellow-400 font-bold">1</span>, wenn die Eingaben <span className="text-white underline italic">unterschiedlich</span> sind.
                </p>

                <div className="flex flex-col items-center gap-8 py-8 bg-black/40 rounded-xl border border-white/5">
                    <div className="flex items-center gap-8">
                        <button
                            onClick={() => setXorA(xorA === 0 ? 1 : 0)}
                            className={cn("w-16 h-16 rounded-xl border-2 text-2xl font-black transition-all", xorA ? "bg-yellow-500/20 border-yellow-500 text-yellow-400" : "bg-slate-900 border-slate-700 text-slate-500")}
                        >
                            {xorA}
                        </button>
                        <span className="text-2xl font-bold text-slate-600">XOR</span>
                        <button
                            onClick={() => setXorB(xorB === 0 ? 1 : 0)}
                            className={cn("w-16 h-16 rounded-xl border-2 text-2xl font-black transition-all", xorB ? "bg-yellow-500/20 border-yellow-500 text-yellow-400" : "bg-slate-900 border-slate-700 text-slate-500")}
                        >
                            {xorB}
                        </button>
                        <span className="text-2xl font-bold text-slate-600">=</span>
                        <div className={cn("w-20 h-20 rounded-2xl border-4 flex items-center justify-center text-4xl font-black shadow-2xl transition-all", xorResult ? "bg-yellow-500 border-yellow-400 text-black" : "bg-slate-950 border-slate-800 text-slate-800")}>
                            {xorResult}
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                        <div className={cn("p-2 rounded border", xorA === 0 && xorB === 0 && "bg-white/5 text-white")}>0 0 -&gt; 0</div>
                        <div className={cn("p-2 rounded border", xorA === 0 && xorB === 1 && "bg-white/5 text-white")}>0 1 -&gt; 1</div>
                        <div className={cn("p-2 rounded border", xorA === 1 && xorB === 0 && "bg-white/5 text-white")}>1 0 -&gt; 1</div>
                        <div className={cn("p-2 rounded border", xorA === 1 && xorB === 1 && "bg-white/5 text-white")}>1 1 -&gt; 0</div>
                    </div>
                </div>

                <div className="mt-8">
                    <p className="text-slate-400 text-sm italic mb-4">
                        Warum ist das genial? Wenn du eine Nachricht mit XOR und einem Schlüssel verschlüsselst,
                        erhältst du durch ein zweites XOR mit demselben Schlüssel die Originalnachricht zurück!
                    </p>
                    <button
                        onClick={() => setStep(1)}
                        className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-xl transition-colors"
                    >
                        DAS VERSTEHE ICH – WEITER ZUM CHAT
                    </button>
                </div>
            </section>
        </motion.div>
      )}

      {step === 1 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <section className="bg-slate-900/50 border border-white/5 p-8 rounded-2xl">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    2. E2E-Chat Simulation
                    <ShieldCheck className="text-green-500" size={20} />
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Sender side */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                            <div className="w-2 h-2 rounded-full bg-cyan-500" />
                            Sender (Agent Alice)
                        </div>
                        <div className="bg-black/40 border border-white/10 rounded-xl p-4 space-y-4">
                            <input
                                type="text"
                                value={chatMessage}
                                onChange={(e) => setChatMessage(e.target.value)}
                                placeholder="Nachricht schreiben..."
                                className="w-full bg-slate-900 border border-white/5 rounded-lg p-2 text-sm text-white outline-none"
                            />
                            <div className="space-y-1">
                                <label className="text-[10px] text-slate-600 font-bold uppercase">Binär-Vorschau:</label>
                                <div className="text-[10px] font-mono text-slate-500 break-all bg-black/20 p-2 rounded">
                                    {toBinary(chatMessage) || 'Warte auf Eingabe...'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Network / Middleman */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-red-500 uppercase tracking-widest">
                            <div className="w-2 h-2 rounded-full bg-red-500" />
                            Abgefangene Daten (Internet)
                        </div>
                        <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-4 flex flex-col items-center justify-center min-h-[140px] text-center">
                            {chatMessage ? (
                                <>
                                    <div className="text-red-400 font-mono text-lg mb-2 break-all">
                                        {xorCipher(chatMessage, chatKey)}
                                    </div>
                                    <p className="text-[9px] text-red-700 uppercase font-black">Unleserlicher Datenmüll</p>
                                </>
                            ) : (
                                <p className="text-slate-700 text-xs italic">Kein Traffic erkannt</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-8 bg-black/60 border border-yellow-500/20 p-6 rounded-xl">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-2 bg-yellow-500/10 rounded text-yellow-500">
                            <Lock size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white">Gemeinsamer Schlüssel (Pre-shared Key)</p>
                            <p className="text-[10px] text-slate-500 uppercase">Nur Alice und Bob kennen diesen Key</p>
                        </div>
                        <input
                            type="text"
                            value={chatKey}
                            onChange={(e) => setChatKey(e.target.value)}
                            className="ml-auto bg-slate-900 border border-yellow-500/30 rounded px-3 py-1 text-yellow-400 font-mono text-sm outline-none w-32"
                        />
                    </div>

                    <div className="flex items-center justify-center py-4">
                        <ArrowRight className="text-slate-700 animate-pulse" />
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                            <MessageSquare size={20} />
                        </div>
                        <div className="flex-1 bg-slate-900 border border-white/5 rounded-lg p-3">
                            <p className="text-[10px] text-slate-500 mb-1 uppercase font-bold">Empfänger (Agent Bob)</p>
                            <p className="text-white text-sm">
                                {chatMessage ? xorCipher(xorCipher(chatMessage, chatKey), chatKey) : '...'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-center">
                    <button
                        onClick={onComplete}
                        className="bg-green-500 hover:bg-green-400 text-black font-black px-12 py-4 rounded-2xl transition-all shadow-xl shadow-green-500/20"
                    >
                        MISSION ABGESCHLOSSEN: BEREIT FÜR PYTHON
                    </button>
                </div>
            </section>
        </motion.div>
      )}
    </div>
  );
}
