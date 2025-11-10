import _ from 'lodash';
import dpCodes from './dpCodes';
export * from './curve';

const TimerSetLength = 8;

const MaxTimer = 10;

export interface TimerProps {
  loops: string;
  hour: number;
  minute: number;
  status: boolean;
}

const AllTimerIds = _.range(1, MaxTimer + 1).map(item => item.toString(16)); // 16进制

export interface SleepTimerProps {
  loops: number[];
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
}

const CatWeightFlow = 0;

const CancelColor = '#A2A9B4';
const ConfirmColor = '#007DFF';

const MaxCat = 10;

type Timer = {
  hour: number; // 小时 0-23
  minute: number; // 分钟 0-59
  loops: string; // "0000000" (one-time), "1111111" (every day), "1000000" (Monday), etc.
  status: boolean; // 开关状态，true 表示开启，false 表示关闭
};

enum DialogShowType {
  Hide,
  Prompt,
  Weight,
}

export type { Timer };

export {
  dpCodes,
  TimerSetLength,
  MaxTimer,
  AllTimerIds,
  CatWeightFlow,
  CancelColor,
  ConfirmColor,
  MaxCat,
  DialogShowType,
};
