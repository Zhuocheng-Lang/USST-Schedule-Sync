import type { Alarm, AlarmAction, Config, Period } from "../types";

export const DEFAULT_PERIOD_START = "08:00";
export const DEFAULT_ALARM_MINUTES = 15;
export const DEFAULT_ALARM_ACTION: AlarmAction = "DISPLAY";

export const ALARM_ACTION_LABELS: Record<AlarmAction, string> = {
  DISPLAY: "静默通知",
  AUDIO: "响铃提醒",
};

export function clonePeriod(period: Period): Period {
  return { ...period };
}

export function cloneAlarm(alarm: Alarm): Alarm {
  return { ...alarm };
}

export function cloneConfig(config: Config): Config {
  return {
    duration: config.duration,
    periods: config.periods.map(clonePeriod),
    alarms: config.alarms.map(cloneAlarm),
  };
}

export function normalizeDuration(
  value: number | string | null | undefined,
  fallback: number,
): number {
  const normalized = Number.parseInt(String(value ?? fallback), 10);
  return Math.max(1, normalized || fallback);
}

export function normalizePeriod(
  period: Partial<Period> | null | undefined,
  fallbackStart = DEFAULT_PERIOD_START,
): Period {
  return {
    start:
      typeof period?.start === "string" && period.start.trim()
        ? period.start.trim()
        : fallbackStart,
  };
}

export function normalizePeriods(
  periods: Partial<Period>[] | null | undefined,
  fallbackPeriods: Period[],
): Period[] {
  if (!Array.isArray(periods) || !periods.length) {
    return fallbackPeriods.map(clonePeriod);
  }

  return periods.map((period, index) =>
    normalizePeriod(period, fallbackPeriods[index]?.start ?? DEFAULT_PERIOD_START),
  );
}

export function normalizeAlarm(
  alarm: Partial<Alarm> | null | undefined,
): Alarm {
  return {
    enabled: alarm?.enabled ?? true,
    minutes: normalizeDuration(alarm?.minutes, DEFAULT_ALARM_MINUTES),
    action: alarm?.action === "AUDIO" ? "AUDIO" : DEFAULT_ALARM_ACTION,
  };
}

export function normalizeAlarms(
  alarms: Partial<Alarm>[] | null | undefined,
  fallbackAlarms: Alarm[],
): Alarm[] {
  if (!Array.isArray(alarms)) {
    return fallbackAlarms.map(cloneAlarm);
  }

  return alarms.map((alarm) => normalizeAlarm(alarm));
}
