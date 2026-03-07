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

export function uuidV4(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6]! & 0x0f) | 0x40;
  bytes[8] = (bytes[8]! & 0x3f) | 0x80;
  const hex = [...bytes].map((value) => value.toString(16).padStart(2, "0"));
  return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex.slice(6, 8).join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10).join("")}`;
}

export function stableUid(text: string, domain = "usst.timetable"): string {
  const left = fnv1a64(text, 0xcbf29ce484222325n);
  const right = fnv1a64(text, 0x84222325cbf29cen);
  const hex = `${left}${right}`;

  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}@${domain}`;
}
