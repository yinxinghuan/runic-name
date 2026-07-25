const LATIN_TO_RUNE: Record<string, number> = {
  F: 0,
  U: 1,
  V: 1,
  TH: 2,
  A: 3,
  R: 4,
  C: 5,
  K: 5,
  Q: 5,
  G: 6,
  W: 7,
  H: 8,
  N: 9,
  I: 10,
  Y: 10,
  J: 11,
  P: 13,
  X: 14,
  Z: 14,
  S: 15,
  T: 16,
  B: 17,
  E: 18,
  M: 19,
  L: 20,
  NG: 21,
  D: 22,
  O: 23,
};

function fallbackIndex(value: string) {
  const hash = Array.from(value).reduce(
    (current, char) =>
      Math.imul(current + (char.codePointAt(0) ?? 0), 16777619),
    2166136261,
  );

  return Math.abs(hash) % 24;
}

export function nameToGlyphs(name: string) {
  const source = Array.from(name.normalize('NFKC').toUpperCase());
  const indices = source.reduce<number[]>((result, char, index) => {
    const previousPair = `${source[index - 1] ?? ''}${char}`;
    if (previousPair === 'TH' || previousPair === 'NG') return result;
    const pair = `${source[index]}${source[index + 1] ?? ''}`;
    if (pair === 'TH' || pair === 'NG') {
      return [...result, LATIN_TO_RUNE[pair]];
    }

    if (LATIN_TO_RUNE[char] !== undefined) {
      return [...result, LATIN_TO_RUNE[char]];
    }

    return char.trim() ? [...result, fallbackIndex(char)] : result;
  }, []);
  const sourceIndices = indices.length ? indices : [3, 19, 16, 17];
  const length = Math.min(24, Math.max(12, sourceIndices.length));

  return Array.from(
    { length },
    (...args) => sourceIndices[args[1] % sourceIndices.length],
  );
}
