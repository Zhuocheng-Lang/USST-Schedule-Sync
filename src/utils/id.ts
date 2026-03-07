// ════════════════════════════════════════════════════════════════════════════
//  utils/id.ts - 标识符生成
// ════════════════════════════════════════════════════════════════════════════

function fnv1a64(text: string, seed: bigint): string {
  let hash = seed;
  const prime = 0x100000001b3n;

  for (const char of text) {
    hash ^= BigInt(char.codePointAt(0) ?? 0);
    hash = BigInt.asUintN(64, hash * prime);
  }

  return hash.toString(16).padStart(16, "0");
}

export function stableUid(text: string, domain = "usst.timetable"): string {
  const left = fnv1a64(text, 0xcbf29ce484222325n);
  const right = fnv1a64(text, 0x84222325cbf29cen);
  const hex = `${left}${right}`;

  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}@${domain}`;
}
