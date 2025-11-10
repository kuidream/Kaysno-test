import { utils } from '@ray-js/panel-sdk';
import store from '@/redux';
import Strings from '@/i18n';

const { camelize, parseSecond } = utils;
export const JsonUtil = {
  parseJSON(str) {
    let rst;
    if (str && {}.toString.call(str) === '[object String]') {
      try {
        rst = JSON.parse(str);
      } catch (e) {
        try {
          // eslint-disable-next-line
          rst = eval(`(${str})`);
        } catch (e2) {
          rst = str;
        }
      }
    } else {
      rst = typeof str === 'undefined' ? {} : str;
    }

    return rst;
  },
};

export const getFaultStrings = (
  label: any,
  faultCode: string,
  faultValue: number,
  onlyPrior = false
) => {
  if (!label || label.length === 0) {
    return '';
  }
  if (!faultValue) {
    return '';
  }
  if (faultValue === null || faultValue === undefined || label === undefined) return '';
  const labels: string[] = [];
  for (let i = 0; i < label!.length; i++) {
    const value = label![i];
    const isExist = utils.getBitValue(faultValue, i);
    if (isExist) {
      labels.push(Strings.getDpLang(faultCode, value));
      if (onlyPrior) break;
    }
  }
  return onlyPrior ? labels[0] : labels.join('\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0');
};

// 获取设备dpCodes
export const schema2Dpcodes = (schema: any) => {
  if (!schema) {
    return '';
  }
  // const schema = devInfo?.schema.find(data => data?.code === dpCode);
  // const { min, max, step }: any = schema;

  const data: any[] = Object.keys(schema).map(key => {
    const data = schema[key];
    const { code, name, property, id, unit, mode, type } = data;
    let remark = '';
    if (property?.type === 'enum') {
      const { range } = property;
      remark = ` [${range.join(',')}]`;
    } else if (property?.type === 'value') {
      const { min, max, scale, step } = property;
      remark = ` ${min}-${max} scale: ${scale} step: ${step}`;
      if (unit) {
        remark = `${remark} unit: ${unit}`;
      }
    }
    return `${camelize(code)}Code: '${code}', // ${name} id:${id} ${mode} ${
      property?.type || type
    }${remark}`;
  });
  return data.join(`\n`);
};

export const cx = (rpx: number) => {
  try {
    const { systemInfo } = store.getState();
    const rpxToPx = systemInfo.windowWidth / 750; // 计算比例
    return rpx * rpxToPx;
  } catch (error) {
    return rpx / 2;
  }
};

export const isIphoneX = info => {
  // 判断当前机型是否有顶部栏
  if (info.platform === 'ios' && info?.screenHeight >= 812) {
    return true;
  }
  return false;
};

// 最大最小步长倍数
export function getDpValueMeta(
  schema: Record<string, any>,
  code: string
): { min: number; max: number; step: number; scale: number } {
  const defaultMeta = { min: 0, max: 1000, step: 1, scale: 0 };
  if (!schema || !schema[code]) return defaultMeta;

  const { property = {} } = schema[code];
  return {
    min: property.min ?? defaultMeta.min,
    max: property.max ?? defaultMeta.max,
    step: property.step ?? defaultMeta.step,
    scale: property.scale ?? defaultMeta.scale,
  };
}

function pad(num: number) {
  return num.toString().padStart(2, '0');
}

// 格式化倒计时显示时间
export function formatSecondsToHHMMSS(seconds?: number) {
  const total = Number(seconds ?? 0);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

// 将周循环从周一开头转换为周日开头以适配设备
export function uiToDeviceLoops(loops: string) {
  if (loops.length !== 7) return loops;
  return loops.slice(-1) + loops.slice(0, -1);
}

// 将设备上报的周循环从周日开头转换为周一开头供界面展示
export function deviceToUiLoops(loops: string) {
  if (loops.length !== 7) return loops;
  return loops.slice(1) + loops.slice(0, 1);
}
