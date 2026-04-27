export function shuffleArray<T>(array: T[]): T[] {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

export function getRandomQuestions<T>(pool: T[], count: number): T[] {
  const selected = shuffleArray(pool).slice(0, count);
  return selected.map(q => {
    if (typeof q === 'object' && q !== null && 'options' in q && Array.isArray(q.options)) {
      return { ...q, options: shuffleArray(q.options) };
    }
    return q;
  });
}

export interface GenericQuestion {
    q: string;
    a: string;
    type: 'manual' | 'mc';
    options?: string[];
}

// Global Challenge Pools
export const BONUS_CHALLENGES: Record<string, GenericQuestion[]> = {
    kryptografie: [
        { q: "Verschlüssele 'SECRET' mit Shift 13", a: "FRPERG", type: 'manual' },
        { q: "Verschlüssele 'HACKER' mit Key 'ACE'", a: "HCGKGV", type: 'manual' }, // Fixed: H(7)+A(0)=H(7), A(0)+C(2)=C(2), C(2)+E(4)=G(6)...
        { q: "Was ist ein Brute-Force Angriff?", a: "ALLE KOMBINATIONEN DURCHPROBIEREN", type: 'mc', options: ["ALLE KOMBINATIONEN DURCHPROBIEREN", "EIN VIRUS", "EIN PASSWORT-MANAGER"] },
    ],
    binar: [
        { q: "Was ist 256 in Binär?", a: "100000000", type: 'manual' },
        { q: "Addiere: 1111 + 1", a: "10000", type: 'manual' },
        { q: "Berechne: 1010 - 0101 (Dezimal Ergebnis)?", a: "5", type: 'manual' },
        { q: "Was bedeutet MSB?", a: "MOST SIGNIFICANT BIT", type: 'mc', options: ["MOST SIGNIFICANT BIT", "MEMORY STORAGE BYTE", "MAIN SYSTEM BOARD"] }
    ],
    fusion: [
        { q: "Berechne: (101 XOR 110) XOR 101", a: "110", type: 'manual' },
        { q: "Werden bei E2E die Daten auf dem Server entschlüsselt?", a: "NEIN", type: 'mc', options: ["NEIN", "JA", "NUR BEIM ADMIN"] },
        { q: "Diffie-Hellman: Was ist (2^3) mod 7?", a: "1", type: 'manual' }
    ]
}
