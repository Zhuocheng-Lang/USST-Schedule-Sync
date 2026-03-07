import { stableUid } from "../utils";
import type {
  Config,
  Period,
  ReminderDeliveryKind,
  ReminderProgram,
  ReminderRule,
} from "../types";

export const DEFAULT_PERIOD_START = "08:00";
export const DEFAULT_REMINDER_LEAD_MINUTES = 15;
export const DEFAULT_REMINDER_DELIVERY_KIND: ReminderDeliveryKind = "DISPLAY";

export const REMINDER_DELIVERY_LABELS: Record<ReminderDeliveryKind, string> = {
  DISPLAY: "静默通知",
  AUDIO: "响铃提醒",
};

interface ReminderRuleDraft {
  id?: unknown;
  isEnabled?: unknown;
  offset?: {
    minutesBeforeStart?: unknown;
  } | null;
  delivery?: {
    kind?: unknown;
  } | null;
  template?: {
    kind?: unknown;
  } | null;
}

export function clonePeriod(period: Period): Period {
  return { ...period };
}

export function createReminderRuleId(seed = `${Date.now()}-${Math.random()}`): string {
  return stableUid(seed, "usst.reminder");
}

export function cloneReminderRule(rule: ReminderRule): ReminderRule {
  return {
    id: rule.id,
    isEnabled: rule.isEnabled,
    offset: { ...rule.offset },
    delivery: { ...rule.delivery },
    template: { ...rule.template },
  };
}

export function cloneReminderProgram(program: ReminderProgram): ReminderProgram {
  return {
    version: 2,
    rules: program.rules.map(cloneReminderRule),
  };
}

export function cloneConfig(config: Config): Config {
  return {
    duration: config.duration,
    periods: config.periods.map(clonePeriod),
    reminderProgram: cloneReminderProgram(config.reminderProgram),
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

export function createReminderRule(
  draft: ReminderRuleDraft = {},
): ReminderRule {
  const deliveryKind =
    draft.delivery?.kind === "AUDIO" ? "AUDIO" : DEFAULT_REMINDER_DELIVERY_KIND;

  return {
    id:
      typeof draft.id === "string" && draft.id.trim()
        ? draft.id.trim()
        : createReminderRuleId(),
    isEnabled: draft.isEnabled !== false,
    offset: {
      minutesBeforeStart: normalizeDuration(
        draft.offset?.minutesBeforeStart as number | string | null | undefined,
        DEFAULT_REMINDER_LEAD_MINUTES,
      ),
    },
    delivery: {
      kind: deliveryKind,
    },
    template: {
      kind:
        draft.template?.kind === "course-start-countdown"
          ? "course-start-countdown"
          : "course-start-countdown",
    },
  };
}

export function normalizeReminderProgram(
  program: Partial<ReminderProgram> | null | undefined,
  fallbackProgram: ReminderProgram,
): ReminderProgram {
  if (!program || !Array.isArray(program.rules)) {
    return cloneReminderProgram(fallbackProgram);
  }

  return {
    version: 2,
    rules: program.rules.map((rule) => createReminderRule(rule as ReminderRuleDraft)),
  };
}

export function summarizeReminderProgram(
  program: ReminderProgram,
): {
  totalRuleCount: number;
  activeRuleCount: number;
} {
  const totalRuleCount = program.rules.length;
  const activeRuleCount = program.rules.filter((rule) => rule.isEnabled).length;

  return {
    totalRuleCount,
    activeRuleCount,
  };
}
