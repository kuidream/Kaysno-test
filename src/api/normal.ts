import { setDeviceProperty, getDeviceProperty } from '@ray-js/api';

export const saveDeviceCloudData = (devId: string, code: string, data: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      const value = typeof data === 'object' ? JSON.stringify(data) : data;
      setDeviceProperty({
        deviceId: devId,
        code,
        value,
        success: res => {
          resolve(res);
        },
        fail: e => {
          reject(e);
        },
      });
    } catch (e) {
      reject(e);
    }
  });
};

export const getDeviceCloudData = (devId: string, key?: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    getDeviceProperty({
      deviceId: devId,
      success: d => {
        if (typeof d !== 'undefined') {
          let data: any = d;
          try {
            if (typeof data === 'string') data = JSON.parse(data);
          } catch (error) {
            reject(error);
          }
          if (data.properties !== undefined) {
            data = data.properties;
          }
          if (key) {
            data = typeof data[key] !== 'undefined' ? data[key] : {};
          }
          resolve(data);
        } else {
          reject();
        }
      },
      fail: e => {
        reject(e);
      },
    });
  });
};

const NormalAPI = {
  saveDeviceCloudData,
  getDeviceCloudData,
};

export default NormalAPI;
