import React from 'react';
import { View, Text, Image, navigateBack } from '@ray-js/ray';
import Strings from '@/i18n';
import Res from '@/res';
import { selectSystemInfoByKey } from '@/redux/modules/systemInfoSlice';
import { useSelector } from 'react-redux';
import { useProps } from '@ray-js/panel-sdk';
import dpCodes from '@/config/dpCodes';
import styles from './index.module.less';

export function StatusParams() {
  const handleBack = () => navigateBack({ delta: 1 });
  const statusBarHeight = useSelector(selectSystemInfoByKey('statusBarHeight'));
  const {
    tankLowTempCode,
    tankUpTempCode,
    evaporatorTempCode,
    suctionSempCode,
    ambientTempCode,
    eevCode,
    fanSpeedCode,
    dischargeTempCode,
  } = dpCodes;

  const tankLowTemp = useProps(props => props[tankLowTempCode]) as number;
  const tankUpTemp = useProps(props => props[tankUpTempCode]) as number;
  const evaporatorTemp = useProps(props => props[evaporatorTempCode]) as number;
  const suctionTemp = useProps(props => props[suctionSempCode]) as number;
  const ambientTemp = useProps(props => props[ambientTempCode]) as number;
  const eevSteps = useProps(props => props[eevCode]) as number;
  const fanSpeed = useProps(props => props[fanSpeedCode]) as number;
  const dischargeTemp = useProps(props => props[dischargeTempCode]) as number;

  const statusItems = [
    {
      id: tankLowTempCode,
      title: Strings.getLang('water_tank_low_temp'),
      value: tankLowTemp,
      unit: '℃',
    },
    {
      id: tankUpTempCode,
      title: Strings.getLang('water_tank_up_temp'),
      value: tankUpTemp,
      unit: '℃',
    },
    {
      id: evaporatorTempCode,
      title: Strings.getLang('evaporator_temp'),
      value: evaporatorTemp,
      unit: '℃',
    },
    {
      id: suctionSempCode,
      title: Strings.getLang('suction_temp'),
      value: suctionTemp,
      unit: '℃',
    },
    {
      id: ambientTempCode,
      title: Strings.getLang('ambient_temp'),
      value: ambientTemp,
      unit: '℃',
    },
    {
      id: eevCode,
      title: Strings.getLang('eev_steps'),
      value: eevSteps,
    },
    {
      id: fanSpeedCode,
      title: Strings.getLang('fan_speed'),
      value: fanSpeed,
    },
    {
      id: dischargeTempCode,
      title: Strings.getLang('discharge_temp'),
      value: dischargeTemp,
      unit: '℃',
    },
  ];

  return (
    <View
      className={styles.page}
      style={{ paddingBottom: `${statusBarHeight}px`, paddingTop: `${statusBarHeight}px` }}
    >
      <View className={styles.topbar}>
        <Image src={Res.goBack} className={styles.backIcon} onClick={handleBack} />
        <Text className={styles.topbarTitle}>{Strings.getLang('status_params')}</Text>
      </View>
      <View className={styles.list}>
        {statusItems.map(item => (
          <View key={item.id} className={styles.item}>
            <View className={styles.left}>
              <Image src={Res.notisIcon} className={styles.leftIcon} />
              <Text className={styles.title}>{item.title}</Text>
            </View>
            <Text className={styles.rightText}>
              {item.value !== undefined && item.value !== null
                ? `${item.value}${item.unit || ''}`
                : '--'}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default StatusParams;
