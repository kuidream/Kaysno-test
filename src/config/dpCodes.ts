export default {
  powerCode: 'Power', // 开关 id:1 rw bool
  modeCode: 'mode', // 除湿模式 id:2 rw enum [4,5,6,7,2]
  humidityCode: 'humidity', // 除湿设置 id:4 rw value 30-80 scale: 0 step: 5
  windspeedCode: 'windspeed', // 风速 id:6 rw enum [2,3,1]
  swingCode: 'swing', // 摆风 id:8 rw bool
  defrostCode: 'defrost', // 除霜 id:9 rw bool
  faultCode: 'fault', // 故障告警 id:11 ro bitmap
  getTempCode: 'get_temp', // 室内摄氏温度 id:103 ro value 0-99 scale: 0 step: 1
  getHumCode: 'get_hum', // 环境湿度 id:104 ro value 0-99 scale: 0 step: 1
  funcTagCode: 'funcTag', // 机型位 id:105 ro bitmap
  lockButtonCode: 'lock_button', // 锁键 id:106 rw bool
  hideButtonCode: 'hide_button', // hide id:107 rw bool
  cleanButtonCode: 'clean_button', // 清洗键 id:108 rw bool
  pumpButtonCode: 'pump_button', // 泵浦键 id:109 rw bool
  getTempFCode: 'get_temp_F', // 室内华氏温度 id:112 rw value 0-99 scale: 0 step: 1
};
