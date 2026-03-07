// ════════════════════════════════════════════════════════════════════════════
//  types/index.ts - 定义整个项目使用的 TypeScript 类型
// ════════════════════════════════════════════════════════════════════════════

export interface Period {
  start: string;
}

export type ReminderDeliveryKind = "DISPLAY" | "AUDIO";

export interface ReminderOffset {
  minutesBeforeStart: number;
}

export interface ReminderDelivery {
  kind: ReminderDeliveryKind;
}

export interface ReminderTemplate {
  kind: "course-start-countdown";
}

export interface ReminderRule {
  id: string;
  isEnabled: boolean;
  offset: ReminderOffset;
  delivery: ReminderDelivery;
  template: ReminderTemplate;
}

export interface ReminderProgram {
  version: 2;
  rules: ReminderRule[];
}

export interface Config {
  duration: number;
  periods: Period[];
  reminderProgram: ReminderProgram;
}

export interface Course {
  name: string;
  location: string;
  teacher: string;
  dow: number;
  pStart: number;
  pEnd: number;
  weeks: number[];
  rawWeeks: string;
}

export interface PeriodTime {
  start: string;
  end: string;
}
