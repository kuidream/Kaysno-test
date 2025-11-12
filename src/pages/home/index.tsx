import React from 'react';
import { View, Text, Image, navigateTo, usePageEvent, showToast, getDevInfo, hideMenuButton } from '@ray-js/ray';
import RayCircleProgress from '@ray-js/circle-progress';
import { useActions, useDevice, useProps } from '@ray-js/panel-sdk';
import { Dialog, DialogInstance } from '@ray-js/smart-ui';
import Res from '@/res';
import Strings from '@/i18n';
import dpCodes from '@/config/dpCodes';
import { selectSystemInfoByKey } from '@/redux/modules/systemInfoSlice';
import { useSelector } from 'react-redux';
import { TopBar } from '@/components';
import SpeedPopup from '@/components/SpeedPopup';
import SwingPopup from '@/components/SwingPopup';
import DialogName from '@/components/DialogName';
import { getFaultStrings, schema2Dpcodes } from '@/utils';
import styles from './index.module.less';
import * as ty from '@ray-js/api';

const { powerCode, humidityCode, getHumCode, windspeedCode, swingCode, faultCode } = dpCodes as any;

export function Home() {
  const devInfo = useDevice(d => d.devInfo);
  const actions = useActions();
  const statusBarHeight = useSelector(selectSystemInfoByKey('statusBarHeight'));

  // DP values
  const powerSwitch = useProps(props => props[powerCode]) as boolean;
  const roomHum = useProps(props => props[getHumCode]) as number; // 0-99
  const targetHum = useProps(props => props[humidityCode]) as number; // 30-80
  const windspeed = useProps(props => props[windspeedCode]) as number;
  const swing = useProps(props => props[swingCode]) as boolean;
  const faultValue = useProps(props => props[faultCode]) as number;

  // Local state
  const [humValue, setHumValue] = React.useState(targetHum ?? 50);
  const [showFaultAlert, setShowFaultAlert] = React.useState(false);
  const faultSchema = devInfo?.schema.find(data => data?.code === faultCode);
  const tabHeight = 184;

  const [showSpeedPopup, setShowSpeedPopup] = React.useState(false);
  const [showSwingPopup, setShowSwingPopup] = React.useState(false);
  const [showNameDialog, setShowNameDialog] = React.useState(false);

  usePageEvent('onShow', () => faultValue > 0 && setShowFaultAlert(true));

  React.useEffect(() => setHumValue(targetHum), [targetHum]);
  React.useEffect(() => {
    if (faultValue && faultValue > 0) setShowFaultAlert(true);
  }, [faultValue]);
  React.useEffect(() => {
    // 隐藏右上角胶囊按钮（... 与 X）
    hideMenuButton();
  }, []);

  // UI<->Business mapping (humidity 30~80)
  const mapRange = (ui: number) => {
    const y = 30 + ((ui - 1) * (80 - 30)) / (100 - 1);
    // step 5
    const stepped = Math.round(y / 5) * 5;
    return Math.max(30, Math.min(80, stepped));
  };
  const mapToRange = (biz: number) => {
    const b = Math.max(30, Math.min(80, biz));
    const y = ((b - 30) * (100 - 1)) / (80 - 30) + 1;
    return Math.round(y);
  };

  // 固定主题为白底+橙色，匹配设计图
  const getTheme = () => {
    if (!powerSwitch) {
      return {
        pageBg: '#ffffff',
        ringBg: [
          { offset: 0, color: 'rgba(220,220,220,0.6)' },
          { offset: 1, color: 'rgba(220,220,220,0.6)' },
        ],
        main: '#C1C5CB',
      };
    }
    return {
      pageBg: '#ffffff',
      ringBg: [
        { offset: 0, color: 'rgba(243, 124, 28, 0.56)' },
        { offset: 1, color: 'rgba(217, 217, 217, 0.56)' },
      ],
      main: '#F37C1C',
    };
  };
  const theme = getTheme();

  const handlePowerToggle = () => actions[powerCode].set(!powerSwitch);
  const handleHumIncrease = () => {
    if (!powerSwitch) return;
    const newValue = Math.min((targetHum || 30) + 5, 80);
    actions[humidityCode].set(newValue);
  };
  const handleHumDecrease = () => {
    if (!powerSwitch) return;
    const newValue = Math.max((targetHum || 30) - 5, 30);
    actions[humidityCode].set(newValue);
  };

  // Circle interactions
  const handleMove = (v: number) => setHumValue(mapRange(v));
  const handleEnd = (v: number) => actions[humidityCode].set(mapRange(v));

  const handleSetting = (index: number) => {
    if (index === 0) return setShowSpeedPopup(true);
    if (index === 1) return setShowSwingPopup(true);
    if (index === 2) return navigateTo({ url: '/pages/timer/index' });
    if (index === 3) return navigateTo({ url: '/pages/setting/index' });
  };

  const tabs = [
    { key: 0, img: Res.modeIcon }, // SPEED
    { key: 1, img: Res.swIcon },   // SWING
    { key: 2, img: Res.tab_timer },
    { key: 3, img: Res.settingIcon },
  ];

  // Edit device name
  const handleRename = async (name: string) => {
    try {
      await ty.device.renameDeviceName({ deviceId: (devInfo as any)?.devId, name });
    } catch (e) {
      showToast({ title: 'Rename failed', icon: 'none' });
    }
    setShowNameDialog(false);
  };

  return (
    <View className={styles.page} style={{ paddingBottom: `${tabHeight}rpx`, background: theme.pageBg }}>
      <TopBar
        title={(devInfo as any)?.name || 'Dehumidifier'}
        onEdit={() => setShowNameDialog(true)}
        onPower={handlePowerToggle}
        powerOn={powerSwitch}
      />

      {/* Fault Alert */}
      {showFaultAlert && faultValue !== 0 && (
        <View className={styles.faultAlert}>
          <View className={styles.faultAlertContent}>
            <Image src={Res.faultIcon} className={styles.faultIcon2} />
            <Text className={styles.faultText}>
              {getFaultStrings(faultSchema?.property?.label, faultCode, faultValue)}
            </Text>
            <Image src={Res.closeFault} onClick={() => setShowFaultAlert(false)} className={styles.faultIcon} />
          </View>
        </View>
      )}

      {/* Popups */}
      <SpeedPopup
        visible={showSpeedPopup}
        selected={(windspeed as any) || ''}
        statusBarHeight={statusBarHeight}
        onClose={() => setShowSpeedPopup(false)}
        onSelect={val => { if (!powerSwitch) return; actions[windspeedCode].set(val);
          setShowSpeedPopup(false);
        }}
      />
      <SwingPopup
        visible={showSwingPopup}
        selected={!!swing}
        statusBarHeight={statusBarHeight}
        onClose={() => setShowSwingPopup(false)}
        onSelect={val => {
          if (!powerSwitch) return;
          actions[swingCode].set(val);
          setShowSwingPopup(false);
        }}
      />

      {/* Name dialog */}
      {showNameDialog && (
        <DialogName
          show={showNameDialog}
          defaultValue={(devInfo as any)?.name || ''}
          onCancel={() => setShowNameDialog(false)}
          onConfirm={handleRename}
          maxLength={30}
          placeholder={'Name Your Unit'}
        />
      )}

      {/* Humidity Control */}
      <View className={styles.tempControlContainer}>
        <View className={styles.tempCircle}>
          <View className={styles.tempCircleContent}>
            <RayCircleProgress
              value={mapToRange(targetHum || 50)}
              startDegree={140}
              ringRadius={130}
              innerRingRadius={100}
              offsetDegree={260}
              onTouchMove={handleMove}
              onTouchEnd={handleEnd}
              thumbColor="#ffffff"
              thumbRadius={40}
              thumbBorderWidth={0}
              disable={!powerSwitch}
              colorList={theme.ringBg}
            />
            <View className={styles.textBox}>
              <View className={`${styles.tempTopBox} ${styles.tempValueClickArea}`}>
                <Text className={styles.targetTempValue}>{humValue}</Text>
                <Text className={styles.targetTempTips}>%</Text>
              </View>
              <Text className={styles.targetTempLabel}>Humidity {humValue}%</Text>
              <View className={styles.dropIcon}>
                <Text style={{ fontSize: 40, color: '#F37C1C' }}>💧</Text>
              </View>
            </View>
          </View>
          <View className={styles.tempControls}>
            <View className={styles.tempBtn} onClick={handleHumDecrease}>
              <Image src={Res.minus} className={styles.addIcon} />
            </View>
            <View className={styles.tempBtn} onClick={handleHumIncrease}>
              <Image src={Res.add} className={styles.addIcon} />
            </View>
          </View>
        </View>
      </View>

      {/* Mode/Status line - show power */}
      <View className={styles.modeDisplay}>
        <Text className={styles.modeText}>
          {powerSwitch ? 'On' : 'Off'}
        </Text>
      </View>

      {/* SPEED Bar */}
      <View className={styles.speedBar}>
        <View className={styles.speedHeader}><Text>SPEED</Text></View>
        <View className={styles.speedOptions}>
          <View className={`${styles.speedOpt} ${windspeed === 2 ? styles.speedOptActive : ''}`} onClick={() => powerSwitch && actions[windspeedCode].set(2)}>
            <Text>Low</Text>
          </View>
          <View className={styles.speedDivider} />
          <View className={`${styles.speedOpt} ${windspeed === 3 ? styles.speedOptActive : ''}`} onClick={() => powerSwitch && actions[windspeedCode].set(3)}>
            <Text>High</Text>
          </View>
        </View>
      </View>

      {/* Bottom Navigation */}
      <View className={styles.tabWrap} style={{ height: `${tabHeight}rpx` }}>
        <Image src={Res.bottomBg} className={styles.bottomBg} />
        <View className={styles.tabBox}>
          {tabs.map((item, index) => (
            <View
              key={item.key}
              onClick={() => {
                // Timer (index 2) can be used while off; others disabled when off
                if (!powerSwitch && index !== 2) return;
                handleSetting(index);
              }}
            >
              <Image src={item.img} className={`${styles.tabItem} ${((index===0 && showSpeedPopup) || (index===1 && !!swing) || (index===2 && !powerSwitch)) ? styles.tabItemActive : ""} ${(!powerSwitch && index!==2) ? styles.tabItemDisabled : ""} ${index === 1 ? styles.tabCenter : ""}`} />
            </View>
          ))}
          {/* 移除底部浮动电源按钮，电源位于顶部栏 */}
        </View>
        <View className={styles.statusBar} style={{ height: `${statusBarHeight}px` }} />
      </View>

      <Dialog id="temp-setting-dialog" />
    </View>
  );
}

export default Home;



