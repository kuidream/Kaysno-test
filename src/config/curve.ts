enum CurveTimeType {
  Day = 'day',
  Week = 'week',
  Month = 'month',
  Year = 'year',
  Loading = 'loading',
}

interface CharData {
  date: string;
  value: number;
}

interface TimerValue {
  time: number; // 时间戳（天的话返回的是具体时间）
  value: number; // 平均如厕时间 | 平均体重
}

interface ToiletData {
  sumNum: number; // 本周总如厕次数
  sumTime: number; // 本周总如厕时间 单位：s
  lastNum: number; // 上周期总如厕次数
  lastTime: number; // 上周期总如厕时间 单位：s
  avgPerTime: TimerValue[]; // 每个时间段内平均如厕时间
}

interface WeightData {
  nowWeight: number; // 当前体重 单位g
  avgWeight: number; // 平均体重 单位g
  lastAvgWeight: number; // 上周期平均体重 单位g
  avgPerTime: TimerValue[]; // 每个时间段内平均如厕体重
}

export type { ToiletData, WeightData, CharData, TimerValue };

export { CurveTimeType };
