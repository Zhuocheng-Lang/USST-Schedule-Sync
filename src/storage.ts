// ════════════════════════════════════════════════════════════════════════════
//  storage.ts - 负责与 Tampermonkey 的存储 API 交互，提供类型安全的 get/set 方法
// ════════════════════════════════════════════════════════════════════════════

import { DEFAULT_ALARMS, DEFAULT_DURATION, NS, defaultConfig } from "./constants";
import type { Config } from "./types";

function storageGet<T>(key: string, fallback: T): T {
  try {
    const raw = GM_getValue(NS + key, null);
    return raw !== null ? (JSON.parse(raw as string) as T) : fallback;
  } catch {
    return fallback;
  }
}

function storageSet(key: string, value: unknown): void {
  try {
    GM_setValue(NS + key, JSON.stringify(value));
  } catch (error) {
    console.warn("[ICS] storage write failed:", error);
  }
}

export function getConfig(): Config {
  const saved = storageGet<Config | null>("config", null);
  if (saved && Array.isArray(saved.periods) && saved.periods.length) {
    if (!Array.isArray(saved.alarms)) {
      saved.alarms = DEFAULT_ALARMS.map((alarm) => ({ ...alarm }));
    }
    if (typeof saved.duration !== "number") {
      saved.duration = DEFAULT_DURATION;
    }
    return saved;
  }
  return defaultConfig();
}

export const saveConfig = (cfg: Config): void => storageSet("config", cfg);

export const getSemStart = (key: string): string | null =>
  storageGet<string | null>("semstart_" + key, null);

export const saveSemStart = (key: string, value: string): void =>
  storageSet("semstart_" + key, value);