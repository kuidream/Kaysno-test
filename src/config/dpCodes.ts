export default {
  // 基础控制功能 DP
  switchCode: 'switch', // 开关 id:1 rw bool
  modeCode: 'mode', // 模式 id:2 rw enum [RPAID,ECO]
  tempCurrentCode: 'temp_current', // 当前温度 id:3 ro value 0-100 scale: 0 step: 1
  tempSetCode: 'temp_set', // 温度设置 id:5 rw value 38-75 scale: 0 step: 1
  workStateCode: 'work_state', // 工作状态 id:8 ro enum [standby,heating,warm]
  timerCode: 'timer', // 定时 id:15 rw raw
  faultCode: 'fault', // 故障告警 id:18 ro bitmap

  // 状态参数 DP
  tankLowTempCode: 'tank_low_temp', // 水箱下部温度 id:101 ro value 0-100 scale: 0 step: 1
  tankUpTempCode: 'tank_up_temp', // 水箱顶部温度 id:102 ro value 0-100 scale: 0 step: 1
  evaporatorTempCode: 'evaporator_temp', // 盘管温度 id:103 ro value -30-120 scale: 0 step: 1
  suctionSempCode: 'suction_semp', // 回气温度 id:104 ro value -30-120 scale: 0 step: 1
  eevCode: 'eev', // 电子膨胀阀步数 id:105 ro value 0-500 scale: 0 step: 1
  fanSpeedCode: 'fan_speed', // 直流风机当前转速 id:106 ro value 0-3000 scale: 0 step: 1
  dischargeTempCode: 'discharge_temp', // 排气温度 id:107 ro value -30-150 scale: 0 step: 1

  // 工厂设置 DP
  electricalHeatingTempCode: 'electrical_heating_temp', // 电辅热启动环温 id:108 rw value -7-15 scale: 0 step: 1
  disinfectionEnableCode: 'disinfection_enable', // 定时高温杀菌功能使能 id:109 rw bool
  electricalHeatingDelayCode: 'electrical_heating_delay', // 电辅热启动延时 id:110 rw value 0-90 scale: 0 step: 1
  disinfectionTempCode: 'disinfection_temp', // 高温杀菌功能设定温度 id:111 rw value 60-80 scale: 0 step: 1
  disinfectionTimeCode: 'disinfection_time', // 高温杀菌功能持续时间 id:112 rw value 30-90 scale: 0 step: 1
  defrostDelayTimeCode: 'defrost_delay_time', // 除霜间隔时间 id:113 rw value 30-90 scale: 0 step: 1
  defrostStartTempCode: 'defrost_start_temp', // 进入除霜温度 id:114 rw value -30-0 scale: 0 step: 1
  defrostStopTempCode: 'defrost_stop_temp', // 退出除霜温度 id:115 rw value 2-30 scale: 0 step: 1
  defrostRunTimeCode: 'defrost_run_time', // 除霜运行时间 id:116 rw value 1-12 scale: 0 step: 1
  eevStateCode: 'eev_state', // 电子膨胀阀调节选择 id:117 rw bool
  superheatCode: 'superheat', // 目标过热度 id:118 rw value -9-9 scale: 0 step: 1
  ambientTempCode: 'ambient_temp', // 环境温度 id:119 ro value -30-120 scale: 0 step: 1
  userSettingCode: 'user_setting', // 工厂设置 id:120 rw raw
  eevManualStepCode: 'eev_manual_step', // 电子膨胀阀手动步数 id:121 rw value 0-500 scale: 0 step: 1
  disinfectStateCode: 'disinfect_state', // 手动高温杀菌开关 id:122 rw bool
};
