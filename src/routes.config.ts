import { Routes } from '@ray-js/types';

export const routes: Routes = [
  {
    route: '/',
    path: '/pages/home/index',
    name: 'Home',
  },
  {
    route: '/record',
    path: '/pages/record/index',
    name: 'Record',
  },
  {
    route: '/timer',
    path: '/pages/timer/index',
    name: 'Timer',
  },
  {
    route: '/setting',
    path: '/pages/setting/index',
    name: 'Setting',
  },
  {
    route: '/statusParams',
    path: '/pages/statusParams/index',
    name: 'StatusParams',
  },
  {
    route: '/factorySettings',
    path: '/pages/factorySettings/index',
    name: 'FactorySettings',
  },
  {
    route: '/userParams',
    path: '/pages/userParams/index',
    name: 'UserParams',
  },
  {
    route: '/faultRecords',
    path: '/pages/faultRecords/index',
    name: 'FaultRecords',
  },
  {
    route: '/remote',
    path: '/pages/remote/index',
    name: 'Remote',
  },
  {
    route: '/remoteAdd',
    path: '/pages/remoteAdd/index',
    name: 'RemoteAdd',
  },
];
