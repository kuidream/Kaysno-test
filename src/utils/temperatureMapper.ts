// utils/temperatureMapper.ts
export const mapToComponentValue = (deviceValue: number, min: number, max: number): number => {
  return Math.round(((deviceValue - min) / (max - min)) * 100);
};

export const mapToDeviceValue = (
  componentValue: number,
  min: number,
  max: number,
  step: number
): number => {
  let value = min + (componentValue / 100) * (max - min);
  value = Math.round(value / step) * step; // 对齐步长
  return Math.max(min, Math.min(max, value));
};
