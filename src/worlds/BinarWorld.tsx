import { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, CheckCircle2, AlertCircle, Lock, Plus, Minus } from 'lucide-react';
import { cn } from '../utils/cn';

export function BinarWorld({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [bits, setBits] = useState([0, 0, 0, 0, 0, 0, 0, 0]);
  const [decimalGuess, setDecimalGuess] = useState('');
  const [binaryGuess, setBinaryGuess] = useState('');

  // Math Challenge
  const [mathInput, setMathInput] = useState('');

  const currentValue = bits.reduce((acc, bit, idx) => acc + bit * Math.pow(2, 7 - idx), 0);

  const toggleBit = (index: number) => {
    const newBits = [...bits];
    newBits[index] = newBits[index] === 0 ? 1 : 0;
    setBits(newBits);
  };

  return (
    <div className="p-6 md:p-12 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400">
          <Cpu size={28} />
        </div>
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tight">Binärzahlen</h2>
          <p className="text-slate-500 font-mono text-sm">LEVEL_02: DIE_SPRACHE_DER_MASCHINEN</p>
        </div>
      </div>

      {step === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
          <section className="bg-slate-900/50 border border-white/5 p-8 rounded-2xl">
            <h3 className="text-xl font-bold text-white mb-4">1. Bits & Bytes verstehen</h3>
            <p className="text-slate-400 mb-8 leading-relaxed">
              Computer kennen nur zwei Zustände: <span className="text-purple-400 font-bold">AN (1)</span> oder <span className="text-slate-600 font-bold">AUS (0)</span>.
              Durch die Kombination dieser Schalter können wir jede beliebige Zahl darstellen.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {bits.map((bit, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-600">{Math.pow(2, 7 - idx)}</span>
                  <button
                    onClick={() => toggleBit(idx)}
                    className={cn(
                      "w-12 h-16 rounded-lg border-2 flex items-center justify-center text-xl font-black transition-all duration-300",
                      bit === 1
                        ? "bg-purple-500/20 border-purple-500 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                        : "bg-slate-950 border-slate-800 text-slate-700"
                    )}
                  >
                    {bit}
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-black/40 rounded-xl p-6 flex items-center justify-between border border-white/5">
                <span className="text-slate-400 font-mono uppercase tracking-widest text-xs">Aktueller Dezimalwert:</span>
                <span className="text-3xl font-black text-white font-mono">{currentValue}</span>
            </div>
          </section>

          <section className="bg-slate-900/50 border border-white/5 p-8 rounded-2xl">
             <h3 className="text-xl font-bold text-white mb-4">Mission: Die magische Zahl</h3>
             <p className="text-slate-400 mb-6">
                Stelle die Zahl <span className="text-purple-400 font-bold text-2xl px-2">42</span> im Binärsystem ein.
             </p>
             <button
                disabled={currentValue !== 42}
                onClick={() => setStep(1)}
                className={cn(
                    "w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2",
                    currentValue === 42
                        ? "bg-purple-500 hover:bg-purple-400 text-black shadow-lg"
                        : "bg-slate-800 text-slate-500 cursor-not-allowed"
                )}
             >
                {currentValue === 42 ? <CheckCircle2 /> : <Lock size={18} />} MISSION ABSCHLIESSEN
             </button>
          </section>
        </motion.div>
      )}

      {step === 1 && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
            <section className="bg-slate-900/50 border border-white/5 p-8 rounded-2xl">
                <h3 className="text-xl font-bold text-white mb-4">2. Umrechnung: Schnellkurs</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="bg-black/40 p-6 rounded-xl border border-white/5">
                        <p className="text-xs font-mono text-purple-400 mb-4 uppercase tracking-tighter">Dezimal zu Binär</p>
                        <p className="text-sm text-slate-400 mb-4">Was ist 25 als Binärzahl?</p>
                        <input
                            type="text"
                            value={binaryGuess}
                            onChange={(e) => setBinaryGuess(e.target.value.replace(/[^01]/g, ''))}
                            className="w-full bg-slate-950 border border-white/10 rounded-lg p-3 text-white font-mono outline-none focus:border-purple-500/50"
                            placeholder="z.B. 10101"
                        />
                    </div>
                    <div className="bg-black/40 p-6 rounded-xl border border-white/5">
                        <p className="text-xs font-mono text-purple-400 mb-4 uppercase tracking-tighter">Binär zu Dezimal</p>
                        <p className="text-sm text-slate-400 mb-4">Was ist 1010 im Dezimalsystem?</p>
                        <input
                            type="number"
                            value={decimalGuess}
                            onChange={(e) => setDecimalGuess(e.target.value)}
                            className="w-full bg-slate-950 border border-white/10 rounded-lg p-3 text-white font-mono outline-none focus:border-purple-500/50"
                            placeholder="z.B. 10"
                        />
                    </div>
                </div>

                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex gap-4 items-start mb-8">
                    <AlertCircle className="text-blue-400 shrink-0" size={20} />
                    <p className="text-xs text-blue-300 leading-relaxed">
                        Tipp: Rechne von rechts nach links. Die Stellen haben die Werte 1, 2, 4, 8, 16, 32...
                        Wenn eine 1 da steht, addiere den Wert. Wenn eine 0 da steht, ignoriere ihn.
                    </p>
                </div>

                <button
                    onClick={() => {
                        if (binaryGuess === '11001' && decimalGuess === '10') {
                            setStep(2);
                        } else {
                            alert('Noch nicht ganz richtig! Überprüfe deine Rechnungen.');
                        }
                    }}
                    className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 rounded-xl transition-all"
                >
                    ZUM MATHE-MODUL
                </button>
            </section>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <section className="bg-slate-900/50 border border-white/5 p-8 rounded-2xl">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    3. Binär-Arithmetik
                </h3>
                <p className="text-slate-400 mb-8">
                    Rechnen im Binärsystem folgt den gleichen Regeln wie im Dezimalsystem, aber man hat nur zwei Ziffern.
                    Besonders wichtig ist der Übertrag: <span className="text-white font-bold">1 + 1 = 10</span> (0 schreiben, 1 Übertrag).
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="space-y-4">
                        <div className="bg-black/60 p-6 rounded-xl border border-white/10 font-mono text-2xl text-right space-y-2">
                            <div className="text-slate-500">0101 (5)</div>
                            <div className="flex items-center justify-between text-purple-400">
                                <Plus size={20} />
                                <span>0011 (3)</span>
                            </div>
                            <div className="border-t-2 border-white/20 pt-2 text-white font-black tracking-widest">
                                1000 (8)
                            </div>
                        </div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest text-center">Beispiel: Addition</p>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-black/60 p-6 rounded-xl border border-white/10 font-mono text-2xl text-right space-y-2">
                            <div className="text-slate-500">1010 (10)</div>
                            <div className="flex items-center justify-between text-red-400">
                                <Minus size={20} />
                                <span>0100 (4)</span>
                            </div>
                            <div className="border-t-2 border-white/20 pt-2 text-white font-black tracking-widest">
                                0110 (6)
                            </div>
                        </div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest text-center">Beispiel: Subtraktion</p>
                    </div>
                </div>

                <div className="bg-purple-500/5 border border-purple-500/20 p-8 rounded-2xl text-center">
                    <h4 className="text-lg font-bold text-white mb-4">Deine Herausforderung</h4>
                    <p className="text-slate-400 mb-6">Was ist das Ergebnis von <span className="text-white font-mono font-bold">1100</span> plus <span className="text-white font-mono font-bold">0011</span>?</p>
                    <div className="max-w-xs mx-auto">
                        <input
                            type="text"
                            value={mathInput}
                            onChange={(e) => setMathInput(e.target.value.replace(/[^01]/g, ''))}
                            className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 text-center text-2xl text-purple-400 font-mono mb-4 outline-none focus:border-purple-500"
                            placeholder="Dein Ergebnis..."
                        />
                        <button
                            onClick={() => {
                                if (mathInput === '1111') onComplete();
                                else alert('Falsch! Tipp: 1100 ist 12, 0011 ist 3. Was ist 15 im Binärsystem?');
                            }}
                            className="w-full bg-green-500 hover:bg-green-400 text-black font-black py-4 rounded-xl transition-all"
                        >
                            MISSION ERFÜLLT
                        </button>
                    </div>
                </div>
            </section>
        </motion.div>
      )}
    </div>
  );
}
