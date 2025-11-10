const fakeToiletData = {
  data: [
    {
      devId: '6cbb1e04a6d132fc97cmp6',
      dpCode: 'toilet_usage_data',
      id: '6756b0ce4ba1a96d2d0b6906',
      logType: 'excretionDurationReport',
      matchRspVO: {
        id: -1,
        matchOnPetInfoChange: true,
      },
      ownerId: '174643402',
      time: 1733734603766,
      value: 'AQ/SADI=',
    },
    {
      devId: '6cbb1e04a6d132fc97cmp6',
      dpCode: 'toilet_usage_data',
      id: '6756b0594ba1a96d2d0b6905',
      logType: 'excretionDurationReport',
      matchRspVO: {
        id: -1,
        matchOnPetInfoChange: true,
      },
      ownerId: '174643402',
      time: 1733734488365,
      value: 'AQ/SADI=',
    },
    {
      devId: '6cbb1e04a6d132fc97cmp6',
      dpCode: 'toilet_usage_data',
      id: '6756b04e4ba1a96d2d0b6904',
      logType: 'excretionDurationReport',
      matchRspVO: {
        id: -1,
        matchOnPetInfoChange: true,
      },
      ownerId: '174643402',
      time: 1733734477072,
      value: 'AQ/SADI=',
    },
    {
      devId: '6cbb1e04a6d132fc97cmp6',
      dpCode: 'toilet_usage_data',
      id: '6756ad034ba1a96d2d0b6903',
      logType: 'excretionDurationReport',
      matchRspVO: {
        id: -1,
        matchOnPetInfoChange: true,
      },
      ownerId: '174643402',
      time: 1733733632812,
      value: 'AQ/SADI=',
    },
  ],
  hasNext: false,
  pageNo: 1,
  pageSize: 20,
  totalCount: 4,
};

const fakeToiletDataEmpty = {
  data: [],
  hasNext: false,
  pageNo: 1,
  pageSize: 20,
  totalCount: 0,
};

// {
//   data: [
//     {
//       devId: '6c5b27fc1d05a52d3asptt',
//       extInfo: '{"dpInfo":"0"}',
//       id: '6659a3477eb09d366eb123dc3abf2',
//       logType: 1,
//       time: Date.now() - 3 * 60 * 60 * 1000, // 3 小时前
//       weight: 2800,
//       stayTime: 300,
//       countInOneDay: 23,
//       catId: 200,
//     },
//     {
//       devId: '6c5b27fc1d05a52d3as2ptt',
//       extInfo: '{"dpInfo":"0"}',
//       id: '6659a3477eb09d366e3b123dc3abf2',
//       logType: 1,
//       time: Date.now() - 6 * 60 * 60 * 1000, // 6 小时前
//       weight: 2800,
//       stayTime: 64 * 60,
//       countInOneDay: 1,
//       catId: 200,
//     },
//     {
//       devId: '6c5b27fc1d05a52d3asptt',
//       extInfo: '{"dpInfo":"0"}',
//       id: '6659a3477eb09d366ebc113abf2',
//       logType: 2,
//       time: Date.now() - 12 * 60 * 60 * 1000, // 12 小时前
//     },
//     {
//       devId: '6c5b27fc1d05a52d3asptt',
//       extInfo: '{"dpInfo":"0"}',
//       id: '665999807eb09d366ebc1233abd2',
//       logType: 2,
//       time: Date.now() - 18 * 60 * 60 * 1000, // 18 小时前
//     },
//     {
//       devId: '6c5b27fc1d05a52d3asptt',
//       extInfo: '{"dpInfo":"0"}',
//       id: '6659a3477eb09d366ebc3aadfbf2',
//       logType: 2,
//       time: Date.now() - 22 * 60 * 60 * 1000, // 22 小时前
//     },
//     // 其他数据依次修改，时间戳保持在 24 小时以内
//   ],
//   hasNext: true,
//   totalCount: 0,
// };

export { fakeToiletData, fakeToiletDataEmpty };
