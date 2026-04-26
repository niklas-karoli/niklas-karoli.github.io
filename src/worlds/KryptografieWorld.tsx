import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Unlock, HelpCircle, Info } from 'lucide-react';

const CAESAR_SHIFT = 3;

export function KryptografieWorld({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [caesarInput, setCaesarInput] = useState('');
  const [caesarGuess, setCaesarGuess] = useState('');
  const [vigenereGuess, setVigenereGuess] = useState('');
  const [vigenereKey] = useState('AGENT');
  const [vigenereInput] = useState('GEHEIMNIS');

  // Caesar encryption: shift 3
  const caesarEncrypt = (text: string) => {
    return text.toUpperCase().replace(/[A-Z]/g, (char) => {
      return String.fromCharCode(((char.charCodeAt(0) - 65 + CAESAR_SHIFT) % 26) + 65);
    });
  };

  const vigenereEncrypt = (text: string, key: string) => {
    const t = text.toUpperCase();
    const k = key.toUpperCase();
    let result = '';
    for (let i = 0, j = 0; i < t.length; i++) {
      const char = t[i];
      if (char.match(/[A-Z]/)) {
        result += String.fromCharCode(((char.charCodeAt(0) - 65 + (k[j % k.length].charCodeAt(0) - 65)) % 26) + 65);
        j++;
      } else {
        result += char;
      }
    }
    return result;
  };

  const vigenereTarget = vigenereEncrypt(vigenereInput, vigenereKey);

  return (
    <div className="p-6 md:p-12 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center text-cyan-400">
          <Shield size={28} />
        </div>
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tight">Kryptografie</h2>
          <p className="text-slate-500 font-mono text-sm">LEVEL_01: DIE_KUNST_DER_VERSCHLÜSSELUNG</p>
        </div>
      </div>

      {step === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
          <section className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-2xl">
             <h3 className="text-blue-400 font-bold mb-2 flex items-center gap-2 text-sm uppercase tracking-widest">
                <Info size={16} /> Einführung
             </h3>
             <p className="text-slate-300 text-sm leading-relaxed">
                Kryptografie ist die Wissenschaft der Verschlüsselung von Informationen. Seit Jahrtausenden versuchen Menschen, Nachrichten so zu verbergen, dass nur der rechtmäßige Empfänger sie lesen kann. Wir beginnen mit der einfachsten Methode: Der Substitution.
             </p>
          </section>

          <section className="bg-slate-900/50 border border-white/5 p-8 rounded-2xl">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                1. Die Cäsar-Verschlüsselung
                <span className="group relative">
                    <HelpCircle size={16} className="text-slate-600 cursor-help" />
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 bg-slate-800 text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 border border-white/10">
                        Benannt nach Julius Cäsar. Jeder Buchstabe wird um eine feste Anzahl im Alphabet verschoben.
                    </span>
                </span>
            </h3>
            <p className="text-slate-400 mb-6 leading-relaxed">
              In dieser Welt nutzen wir eine Verschiebung von <span className="text-cyan-400 font-bold">3</span>.
              Das bedeutet: A wird zu D, B wird zu E, und so weiter.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Klartext eingeben</label>
                <input
                  type="text"
                  value={caesarInput}
                  onChange={(e) => setCaesarInput(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500/50 outline-none transition-colors"
                  placeholder="HALLO"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Verschlüsselter Text</label>
                <div className="w-full bg-cyan-500/5 border border-cyan-500/20 rounded-xl px-4 py-3 text-cyan-400 font-mono h-[50px] flex items-center">
                  {caesarEncrypt(caesarInput)}
                </div>
              </div>
            </div>
          </section>

          <section className="bg-slate-900/50 border border-white/5 p-8 rounded-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Das Schloss knacken</h3>
            <p className="text-slate-400 mb-6">
              Ein feindlicher Agent hat eine Nachricht hinterlassen: <span className="text-cyan-400 font-mono font-bold tracking-widest bg-cyan-500/10 px-2 py-1 rounded">ZROI</span>.
              Entschlüssele sie (Verschiebung 3), um fortzufahren.
            </p>

            <div className="flex gap-4">
              <input
                type="text"
                value={caesarGuess}
                onChange={(e) => setCaesarGuess(e.target.value.toUpperCase())}
                className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500/50 outline-none transition-colors w-full"
                placeholder="Lösung..."
              />
              <button
                onClick={() => {
                  if (caesarGuess === 'WOLF') setStep(1);
                  else alert('Falscher Code! Versuche es erneut.');
                }}
                className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-8 rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                <Unlock size={18} /> PRÜFEN
              </button>
            </div>
          </section>
        </motion.div>
      )}

      {step === 1 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
          <section className="bg-slate-900/50 border border-white/5 p-8 rounded-2xl">
             <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-white">2. Vigenère-Verschlüsselung</h3>
                <span className="text-[10px] bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded border border-yellow-500/20">FORTGESCHRITTEN</span>
             </div>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Die Cäsar-Verschlüsselung ist leicht zu knacken. Die <span className="text-white font-bold italic">Vigenère-Verschlüsselung</span> nutzt ein <span className="text-cyan-400 underline decoration-cyan-500/30 underline-offset-4">Schlüsselwort</span>.
              Jeder Buchstabe der Nachricht wird mit einem anderen Buchstaben des Schlüssels verschoben.
            </p>

            <div className="bg-black/40 border border-white/5 rounded-xl p-6 mb-8 font-mono text-sm space-y-4">
                <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-slate-500">Nachricht:</span>
                    <span className="text-white">{vigenereInput}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-slate-500">Schlüssel:</span>
                    <span className="text-cyan-400 font-bold">{vigenereKey}</span>
                </div>
                <div className="flex justify-between pt-2">
                    <span className="text-slate-500">Ergebnis:</span>
                    <span className="text-green-400">{vigenereTarget}</span>
                </div>
            </div>

            <div className="space-y-6">
                <p className="text-slate-400">
                    Knacke das System: Wie lautet das verschlüsselte Wort für <span className="text-white font-bold">CYBER</span> mit dem Schlüssel <span className="text-cyan-400 font-bold">KEY</span>?
                </p>
                {/* C(2)+K(10)=M(12), Y(24)+E(4)=C(28->2), B(1)+Y(24)=Z(25), E(4)+K(10)=O(14), R(17)+E(4)=V(21) => MCZOV */}
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={vigenereGuess}
                        onChange={(e) => setVigenereGuess(e.target.value.toUpperCase())}
                        className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500/50 outline-none transition-colors w-full"
                        placeholder="Dein Ergebnis..."
                    />
                    <button
                        onClick={() => {
                        if (vigenereGuess === 'MCZOV') onComplete();
                        else alert('Leider falsch. Tipp: C(2)+K(10) im Alphabet... (A=0)');
                        }}
                        className="bg-green-500 hover:bg-green-400 text-black font-bold px-8 rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap"
                    >
                        <Lock size={18} /> ABSCHLIESSEN
                    </button>
                </div>
            </div>
          </section>
        </motion.div>
      )}
    </div>
  );
}
