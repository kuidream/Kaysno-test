import {
  getStatisticsRangMonth,
  getStatisticsRangHour,
  getStatisticsRangDay,
  publishDps,
  getAnalyticsLogsStatusLog,
} from '@ray-js/ray';
import { kit } from '@ray-js/panel-sdk';
import { api } from './request';

const { getDevInfo } = kit;

// 发送dp
export const putDpData = (dp: any, callback?: any) => {
  const devInfo = getDevInfo();
  const dps = {};
  Object.keys(dp).forEach((dpCode: any) => {
    const schema = devInfo?.schema.find(data => data?.code === dpCode);

    const { id }: any = schema;
    dps[id] = dp[dpCode];
  });

  publishDps({
    deviceId: devInfo.devId,
    dps,
    mode: 2,
    pipelines: [],
    options: {}, // 0，静音； 1，震动；2,声音； 3，震动声音
    success: callback,
    fail: d => {
      console.log('-----返回结果错误?', d);
    },
  });
};

// 获得按DP上报数据
export const getLogsData = (devId: string, dpIds: string): Promise<any> => {
  const postData = {
    devId: devId,
    dpIds: dpIds,
    offset: 0,
    limit: 100,
    sortType: 'DESC',
  };
  // console.log(postData);
  return getAnalyticsLogsStatusLog(postData);
};

//  用这个getAnalyticsLogsStatusLog
