import { stableUid } from "../utils";
import {
  cloneLoggingConfig as cloneLoggingConfigValue,
  createDefaultLoggingConfig,
  normalizeLoggingConfig as normalizeLoggingConfigValue,
} from "../logging";
import type {
  Config,
  LoggingConfig,
  Period,
  ReminderDeliveryKind,
  ReminderPresetId,
  ReminderProgram,
  ReminderRule,
} from "../types";

export const DEFAULT_PERIOD_START = "08:00";
export const DEFAULT_REMINDER_LEAD_MINUTES = 15;
export const DEFAULT_REMINDER_DELIVERY_KIND: ReminderDeliveryKind = "DISPLAY";
export const DEFAULT_REMINDER_PRESET_ID: Exclude<ReminderPresetId, "custom"> =
  "standard";

export const REMINDER_DELIVERY_LABELS: Record<ReminderDeliveryKind, string> = {
  DISPLAY: "静默通知",
  AUDIO: "响铃提醒",
};

export interface ReminderPresetDefinition {
  id: Exclude<ReminderPresetId, "custom">;
  label: string;
  description: string;
  rules: ReminderRuleDraft[];
}

export const REMINDER_PRESET_DEFINITIONS: readonly ReminderPresetDefinition[] =
  [
    {
      id: "disabled",
      label: "关闭提醒",
      description: "不导出任何 VALARM 节点。",
      rules: [],
    },
    {
      id: "standard",
      label: "标准方案",
      description: "开课前 15 分钟发一条静默通知。",
      rules: [
        {
          isEnabled: true,
          offset: { minutesBeforeStart: 15 },
          delivery: { kind: "DISPLAY" },
        },
      ],
    },
    {
      id: "focus",
      label: "双提醒方案",
      description: "开课前 30 分钟和 10 分钟各提醒一次。",
      rules: [
        {
          isEnabled: true,
          offset: { minutesBeforeStart: 30 },
          delivery: { kind: "DISPLAY" },
        },
        {
          isEnabled: true,
          offset: { minutesBeforeStart: 10 },
          delivery: { kind: "DISPLAY" },
        },
      ],
    },
    {
      id: "urgent",
      label: "临近上课",
      description: "先静默提醒，再在上课前 5 分钟响铃。",
      rules: [
        {
          isEnabled: true,
          offset: { minutesBeforeStart: 15 },
          delivery: { kind: "DISPLAY" },
        },
        {
          isEnabled: true,
          offset: { minutesBeforeStart: 5 },
          delivery: { kind: "AUDIO" },
        },
      ],
    },
  ];

const REMINDER_PRESET_MAP = new Map(
  REMINDER_PRESET_DEFINITIONS.map((preset) => [preset.id, preset]),
);

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

interface ReminderProgramDraft {
  version?: unknown;
  presetId?: unknown;
  rules?: unknown;
}

function isReminderPresetId(value: unknown): value is ReminderPresetId {
  return (
    value === "disabled" ||
    value === "standard" ||
    value === "focus" ||
    value === "urgent" ||
    value === "custom"
  );
}

function ruleSignature(rule: ReminderRule): string {
  return [
    String(rule.isEnabled),
    String(rule.offset.minutesBeforeStart),
    rule.delivery.kind,
    rule.template.kind,
  ].join("|");
}

function findReminderPresetDefinition(
  presetId: Exclude<ReminderPresetId, "custom">,
): ReminderPresetDefinition {
  return (
    REMINDER_PRESET_MAP.get(presetId) ??
    REMINDER_PRESET_MAP.get(DEFAULT_REMINDER_PRESET_ID)!
  );
}

export function clonePeriod(period: Period): Period {
  return { ...period };
}

export function createReminderRuleId(
  seed = `${Date.now()}-${Math.random()}`,
): string {
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

export function cloneReminderProgram(
  program: ReminderProgram,
): ReminderProgram {
  return {
    version: 3,
    presetId: program.presetId,
    rules: program.rules.map(cloneReminderRule),
  };
}

export function cloneConfig(config: Config): Config {
  return {
    duration: config.duration,
    periods: config.periods.map(clonePeriod),
    reminderProgram: cloneReminderProgram(config.reminderProgram),
    logging: cloneLoggingConfig(config.logging ?? createDefaultLoggingConfig()),
  };
}

export function cloneLoggingConfig(config: LoggingConfig): LoggingConfig {
  return cloneLoggingConfigValue(config);
}

export function normalizeLoggingConfig(
  value: unknown,
  fallback = createDefaultLoggingConfig(),
): LoggingConfig {
  return normalizeLoggingConfigValue(value, fallback);
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
    normalizePeriod(
      period,
      fallbackPeriods[index]?.start ?? DEFAULT_PERIOD_START,
    ),
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
    template: { kind: "course-start-countdown" },
  };
}

export function formatReminderLeadTime(minutesBeforeStart: number): string {
  let remainingMinutes = Math.max(1, Math.floor(minutesBeforeStart));
  const days = Math.floor(remainingMinutes / (24 * 60));
  remainingMinutes -= days * 24 * 60;
  const hours = Math.floor(remainingMinutes / 60);
  remainingMinutes -= hours * 60;

  const parts: string[] = [];
  if (days) {
    parts.push(`${days} 天`);
  }
  if (hours) {
    parts.push(`${hours} 小时`);
  }
  if (remainingMinutes || !parts.length) {
    parts.push(`${remainingMinutes} 分钟`);
  }

  return `${parts.join(" ")}前`;
}

export function describeReminderRule(rule: ReminderRule): string {
  return `${formatReminderLeadTime(rule.offset.minutesBeforeStart)} · ${REMINDER_DELIVERY_LABELS[rule.delivery.kind]}`;
}

export function createReminderProgramFromPreset(
  presetId: Exclude<ReminderPresetId, "custom">,
): ReminderProgram {
  const preset = findReminderPresetDefinition(presetId);

  return {
    version: 3,
    presetId,
    rules: preset.rules.map((rule) => createReminderRule(rule)),
  };
}

export function detectReminderPresetId(
  rules: ReminderRule[],
): Exclude<ReminderPresetId, "custom"> | "custom" {
  const target = rules.map(ruleSignature);

  for (const preset of REMINDER_PRESET_DEFINITIONS) {
    const source = preset.rules.map((rule) =>
      ruleSignature(createReminderRule(rule)),
    );
    if (
      source.length === target.length &&
      source.every((signature, index) => signature === target[index])
    ) {
      return preset.id;
    }
  }

  return "custom";
}

export function createReminderProgram(
  draft: ReminderProgramDraft = {},
): ReminderProgram {
  const normalizedRules = Array.isArray(draft.rules)
    ? draft.rules.map((rule) => createReminderRule(rule as ReminderRuleDraft))
    : undefined;
  const preferredPresetId = isReminderPresetId(draft.presetId)
    ? draft.presetId
    : undefined;
  const preferredConcretePresetId =
    preferredPresetId && preferredPresetId !== "custom"
      ? preferredPresetId
      : undefined;

  if (preferredConcretePresetId && !normalizedRules) {
    return createReminderProgramFromPreset(preferredConcretePresetId);
  }

  const rules =
    normalizedRules ??
    cloneReminderProgram(
      createReminderProgramFromPreset(DEFAULT_REMINDER_PRESET_ID),
    ).rules;
  const detectedPresetId = detectReminderPresetId(rules);
  const presetId =
    preferredPresetId === "custom"
      ? "custom"
      : preferredConcretePresetId &&
          detectedPresetId === preferredConcretePresetId
        ? preferredConcretePresetId
        : detectedPresetId;

  return {
    version: 3,
    presetId,
    rules,
  };
}

export function normalizeReminderProgram(
  program: Partial<ReminderProgram> | null | undefined,
  fallbackProgram: ReminderProgram,
): ReminderProgram {
  if (!program) {
    return cloneReminderProgram(fallbackProgram);
  }

  const draft = program as ReminderProgramDraft;
  if (!Array.isArray(draft.rules)) {
    return cloneReminderProgram(fallbackProgram);
  }

  return createReminderProgram({
    version: draft.version,
    presetId: draft.presetId,
    rules: draft.rules,
  });
}

export function summarizeReminderProgram(program: ReminderProgram): {
  presetId: ReminderPresetId;
  presetLabel: string;
  totalRuleCount: number;
  activeRuleCount: number;
  activeRuleDescriptions: string[];
} {
  const totalRuleCount = program.rules.length;
  const activeRules = program.rules.filter((rule) => rule.isEnabled);
  const presetLabel =
    program.presetId === "custom"
      ? "自定义方案"
      : findReminderPresetDefinition(program.presetId).label;

  return {
    presetId: program.presetId,
    presetLabel,
    totalRuleCount,
    activeRuleCount: activeRules.length,
    activeRuleDescriptions: activeRules.map(describeReminderRule),
  };
}

export function createCustomReminderRule(): ReminderRule {
  return createReminderRule({
    isEnabled: true,
    offset: { minutesBeforeStart: 10 },
    delivery: { kind: "DISPLAY" },
  });
}

export function setReminderProgramPreset(
  program: ReminderProgram,
  presetId: ReminderPresetId,
): ReminderProgram {
  if (presetId === "custom") {
    return createReminderProgram({
      presetId,
      rules: program.rules,
    });
  }

  return createReminderProgramFromPreset(presetId);
}

export function setReminderProgramRules(
  rules: ReminderRule[],
  presetId: ReminderPresetId = "custom",
): ReminderProgram {
  return createReminderProgram({
    presetId,
    rules,
  });
}
