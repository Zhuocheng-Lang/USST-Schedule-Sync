// ════════════════════════════════════════════════════════════════════════════
//  config/storage.ts - Tampermonkey 存储读写与配置缓存
// ════════════════════════════════════════════════════════════════════════════

import {
  DEFAULT_ALARMS,
  DEFAULT_DURATION,
  DEFAULT_PERIODS,
  STORAGE_NAMESPACE,
  defaultConfig,
} from "./defaults";
import { cloneConfig, normalizeAlarms, normalizeDuration, normalizePeriods } from "./model";
import type { Config } from "../types";

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
  if (saved) {
    return {
      duration: normalizeDuration(saved.duration, DEFAULT_DURATION),
      periods: normalizePeriods(saved.periods, DEFAULT_PERIODS),
      alarms: normalizeAlarms(saved.alarms, DEFAULT_ALARMS),
    };
  }

  return defaultConfig();
}

export const saveConfig = (cfg: Config): void =>
  storageSet("config", cloneConfig(cfg));

export const getSemStart = (key: string): string | null =>
  storageGet<string | null>("semstart_" + key, null);

export const saveSemStart = (key: string, value: string): void =>
  storageSet("semstart_" + key, value);
