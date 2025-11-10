import { JsonUtil } from '@/utils/index';
import { DEFAULT_TIMING_CATEGORY } from '@/constant';
import { apiRequestByAtop, getDevInfo } from '@ray-js/ray';

const errStyle = 'background: red; color: #fff;';

export const api = (a, postData, v = '1.0') => {
  return new Promise((resolve, reject) => {
    const params = {
      api: a,
      postData: postData,
      version: v,
    };
    apiRequestByAtop({
      ...params,
      success: d => {
        const data = typeof d === 'string' ? JsonUtil.parseJSON(d) : d;
        resolve(data);
      },
      fail: err => {
        const e = typeof err === 'string' ? JsonUtil.parseJSON(err) : err;
        console.log(`API Failed: %c${a}%o`, errStyle, e.message || e.errorMsg || e);
        reject();
      },
    });
  });
};

// 定时

/**
 * [getCategoryTimerList description]
 * @param  {[type]} category [description]
 * @param {Number | String}} bizId [设备id或群组id]
 * @param {Boolean}} isGroup [是否是群组id]
 * @return {[type]}          [description]
 * 获取某个分类下的定时
 * 支持群组定时
 */

export const fetchTimingsApi = async (category = DEFAULT_TIMING_CATEGORY, isGroup = false) => {
  try {
    const response = await api<IQueryTimerTasksResponse>('tuya.m.clock.dps.list', {
      bizType: isGroup ? '1' : '0',
      bizId: getDevInfo().devId,
      category,
    });
    return response;
  } catch (err) {
    return Promise.reject(err);
  }
};

// 添加定时
export const addTimingApi = async (params: IAndSingleTime) => {
  try {
    const response = await api<number>('tuya.m.clock.dps.add', params);
    return response;
  } catch (err) {
    return Promise.reject(err);
  }
};

// 更新定时
export const updateTimingApi = async (params: IModifySingleTimer) => {
  try {
    const response = await api<boolean>('tuya.m.clock.dps.update', params);
    return response;
  } catch (err) {
    return Promise.reject(err);
  }
};

// 删除定时
export const updateStatusOrDeleteTimingApi = async (param: { ids: string; status: 0 | 1 | 2 }) => {
  const { groupId: devGroupId, devId } = getDevInfo();
  const defaultParams = {
    bizType: devGroupId ? '1' : '0',
    bizId: devId,
  };
  try {
    const response = await api<boolean>('tuya.m.clock.batch.status.update', {
      ...defaultParams,
      ...param,
    });
    return response;
  } catch (err) {
    return Promise.reject(err);
  }
};
