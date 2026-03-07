// ════════════════════════════════════════════════════════════════════════════
//  types.ts - 定义整个项目使用的 TypeScript 类型
// ════════════════════════════════════════════════════════════════════════════

export interface Period {
  start: string;
}

export type AlarmAction = "DISPLAY" | "AUDIO";

export interface Alarm {
  enabled: boolean;
  minutes: number;
  action: AlarmAction;
}

export interface Config {
  duration: number;
  periods: Period[];
  alarms: Alarm[];
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