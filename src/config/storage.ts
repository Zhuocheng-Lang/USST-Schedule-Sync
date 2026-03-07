// ════════════════════════════════════════════════════════════════════════════
//  config/storage.ts - Tampermonkey 存储读写与配置缓存
// ════════════════════════════════════════════════════════════════════════════

import {
  DEFAULT_ALARMS,
  DEFAULT_DURATION,
  STORAGE_NAMESPACE,
  defaultConfig,
} from "./defaults";
import type { Alarm, Config } from "../types";

function normalizeAlarm(alarm: Partial<Alarm> | null | undefined): Alarm {
  return {
    enabled: alarm?.enabled ?? true,
    minutes: Math.max(1, Number.parseInt(String(alarm?.minutes ?? 15), 10) || 15),
    action: alarm?.action === "AUDIO" ? "AUDIO" : "DISPLAY",
  };
}

function storageGet<T>(key: string, fallback: T): T {
  try {
    const raw = GM_getValue(STORAGE_NAMESPACE + key, null);
    return raw !== null ? (JSON.parse(raw as string) as T) : fallback;
  } catch {
    return fallback;
  }
}

function storageSet(key: string, value: unknown): void {
  try {
    GM_setValue(STORAGE_NAMESPACE + key, JSON.stringify(value));
  } catch (error) {
    console.warn("[ICS] storage write failed:", error);
  }
}

export function getConfig(): Config {
  const saved = storageGet<Config | null>("config", null);
  if (saved && Array.isArray(saved.periods) && saved.periods.length) {
    saved.alarms = Array.isArray(saved.alarms) && saved.alarms.length
      ? saved.alarms.map((alarm) => normalizeAlarm(alarm))
      : DEFAULT_ALARMS.map((alarm) => ({ ...alarm }));
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
