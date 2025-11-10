import React, { useEffect, useState } from 'react';
import { View, Text, Image, navigateTo, usePageEvent, showToast, getDevInfo } from '@ray-js/ray';
import RayCircleProgress from '@ray-js/circle-progress';
import { useActions, useDevice, useProps } from '@ray-js/panel-sdk';
import { Dialog, DialogInstance } from '@ray-js/smart-ui';
import Res from '@/res';
import Strings from '@/i18n';
import dpCodes from '@/config/dpCodes';
// import { useSystemInfo } from '@/hooks/useSystemInfo';
import { selectSystemInfoByKey } from '@/redux/modules/systemInfoSlice';
import { useSelector } from 'react-redux';
import { ModePopup, TopBar } from '@/components';
import { getFaultStrings, schema2Dpcodes } from '@/utils';
import styles from './index.module.less';

const { switchCode, modeCode, tempCurrentCode, tempSetCode, faultCode, disinfectStateCode } =
  dpCodes;

export function Home() {
  // const systemInfo = useSystemInfo();
  const devInfo = useDevice(d => d.devInfo);
  const actions = useActions();
  const statusBarHeight = useSelector(selectSystemInfoByKey('statusBarHeight'));
  // Air heater DP values
  const powerSwitch = useProps(props => props[switchCode]) as boolean;
  const disinfectState = useProps(props => props[disinfectStateCode]) as boolean;
  const mode = useProps(props => props[modeCode]) as string;
  const currentTemp = useProps(props => props[tempCurrentCode]) as number;
  const targetTemp = useProps(props => props[tempSetCode]) as number;
  const faultValue = useProps(props => props[faultCode]) as number;

  // Local state
  const [tempValue, setTempValue] = React.useState(targetTemp || 50);
  const [showFaultAlert, setShowFaultAlert] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);
  const fault = useProps(props => props[faultCode]);
  const faultSchema = devInfo?.schema.find(data => data?.code === faultCode);
  const tabHeight = 184; // Fixed height, removed isIphoneX check

  usePageEvent('onShow', () => faultValue > 0 && setShowFaultAlert(true));

  React.useEffect(() => {
    setTempValue(targetTemp);
  }, [targetTemp]);

  React.useEffect(() => {
    // Show fault alert if there's a fault
    if (faultValue && faultValue > 0) {
      setShowFaultAlert(true);
    }
  }, [faultValue]);

  // UI值 -> 业务值 (RayCircleProgress 原始值 → 温度)
  const mapRange = (x: number) => {
    const a = 1;
    const b = 100;
    const c = 38;
    const d = 75;
    const y = c + ((x - a) * (d - c)) / (b - a);
    return Math.round(y); // 保证业务值整数
  };

  // 业务值 -> UI值 (温度 → RayCircleProgress 的1~100)
  const mapToRange = (x: number) => {
    const minX = 38;
    const maxX = 75;
    const minY = 1;
    const maxY = 100;
    const y = ((x - minX) * (maxY - minY)) / (maxX - minX) + minY;
    return Math.round(y); // ✅ 这里必须 round，避免 UI ↔ 业务不对称
  };

  const handlePowerToggle = () => {
    actions[switchCode].set(!powerSwitch);
  };

  const handleHotToggle = () => {
    if (!powerSwitch) return;
    actions[disinfectStateCode].set(!disinfectState);
  };

  const handleTempIncrease = () => {
    if (!powerSwitch) return;
    const newValue = Math.min(targetTemp + 1, 75);
    actions[tempSetCode].set(newValue);
  };

  const handleTempDecrease = () => {
    if (!powerSwitch) return;
    const newValue = Math.max(targetTemp - 1, 38);
    actions[tempSetCode].set(newValue);
  };

  const [showModePopup, setShowModePopup] = React.useState(false);
  const [selectedMode, setSelectedMode] = React.useState(mode || 'RAPID');

  React.useEffect(() => {
    if (mode) {
      setSelectedMode(mode);
    }
  }, [mode]);

  const handleModeSelection = () => {
    setShowModePopup(true);
  };

  const handleModeSelect = (val: string) => {
    if (!powerSwitch) return;
    setSelectedMode(val);
    actions[modeCode].set(val);
    setShowModePopup(false);
  };

  const handleFaultAlertClose = () => {
    setShowFaultAlert(false);
  };

  const handleSetting = index => {
    if (index === 0) handleModeSelection();
    if (index === 1) handlePowerToggle();
    if (index === 2) handleHotToggle();
    if (index === 3) navigateTo({ url: '/pages/setting/index' });
  };

  const tabs = [
    {
      key: 0,
      img: Res.modeIcon,
    },
    {
      key: 1,
      img: Res.swIcon,
    },
    {
      key: 2,
      img: Res.hotIcon,
    },
    {
      key: 3,
      img: Res.settingIcon,
    },
  ];

  // 打印dp
  useEffect(() => {
    setTimeout(() => {
      const devInfo = getDevInfo();
      console.log(schema2Dpcodes(devInfo?.schema));
    }, 1500);
  }, []);

  const handleMove = (v: number) => {
    // console.warn('handleMove', v);
    setTempValue(mapRange(v));
  };

  const handleEnd = (v: number) => {
    // actions[tempSetCode].set(v);
    const temp = mapRange(v);
    actions[tempSetCode].set(temp);
  };

  const handleTempValueClick = () => {
    const dialogValue = targetTemp ?? tempValue ?? 50;
    DialogInstance.input({
      selector: '#temp-setting-dialog',
      title: Strings.getLang('set_temp_title'),
      placeholder: Strings.getLang('set_temp_placeholder'),
      cancelButtonText: Strings.getLang('cancel'),
      confirmButtonText: Strings.getLang('dsc_ok'),
      value: String(dialogValue),
      type: 'digit',
      beforeClose: (action, value) =>
        new Promise<boolean>(resolve => {
          if (action === 'confirm') {
            const parsedValue = Number(value);
            if (Number.isNaN(parsedValue)) {
              showToast({
                title: Strings.getLang('set_temp_invalid'),
                icon: 'none',
              });
              resolve(false);
              return;
            }

            if (parsedValue < 38 || parsedValue > 75) {
              showToast({
                title: Strings.getLang('set_temp_range'),
                icon: 'none',
              });
              resolve(false);
              return;
            }

            const finalValue = Math.round(parsedValue);
            setTempValue(finalValue);
            actions[tempSetCode].set(finalValue);
          }

          resolve(true);
        }),
    }).catch(() => undefined);
  };

  return (
    <View className={styles.page} style={{ paddingBottom: `${tabHeight}rpx` }}>
      <TopBar title={(devInfo as any)?.name || (devInfo as any)?.productName || ''} />

      {/* Fault Alert Popup */}
      {showFaultAlert && fault !== 0 && (
        <View className={styles.faultAlert}>
          <View className={styles.faultAlertContent}>
            <Image src={Res.faultIcon} className={styles.faultIcon2} />
            <Text className={styles.faultText}>
              {getFaultStrings(faultSchema?.property?.label, faultCode, fault)}
            </Text>
            <Image
              src={Res.closeFault}
              onClick={handleFaultAlertClose}
              className={styles.faultIcon}
            />
          </View>
        </View>
      )}

      <ModePopup
        visible={showModePopup}
        selectedMode={selectedMode}
        statusBarHeight={statusBarHeight}
        onClose={() => setShowModePopup(false)}
        onSelect={handleModeSelect}
      />

      {/* Temperature Control Arc */}
      <View className={styles.tempControlContainer}>
        <View className={styles.tempCircle}>
          {/* <svg
            width="300"
            height="300"
            viewBox="0 0 300 300"
            className={styles.tempSvg}
            onTouchStart={e => {
              setIsDragging(true);
              handleArcTouch(e);
            }}
            onTouchMove={e => {
              if (isDragging) {
                handleArcTouch(e);
              }
            }}
            onTouchEnd={handleArcTouchEnd}
          >
            {/* Background arc */}
          {/* <path
              d="M 43.4 256.6 A 120 120 0 1 1 256.6 256.6"
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Progress arc */}
          {/* <path
              d={`M 43.4 256.6 A 120 120 0 ${
                temperaturePercent > 50 ? 1 : 0
              } 1 ${thumbX} ${thumbY}`}
              fill="none"
              stroke="#00C9FF"
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Thumb circle */}
          {/* <circle
              cx={thumbX}
              cy={thumbY}
              r="12"
              fill="#fff"
              stroke="#00C9FF"
              strokeWidth="3"
              className={styles.tempThumb}
            />
          </svg> */}
          <View className={styles.tempCircleContent}>
            <RayCircleProgress
              value={mapToRange(targetTemp)}
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
              colorList={[
                { offset: 0, color: 'rgba(209, 212, 240, 0.56)' },
                { offset: 0.25, color: 'rgba(209, 212, 240, 0.56)' },
                { offset: 0.5, color: 'rgba(209, 212, 240, 0.56)' },
                { offset: 1, color: 'rgba(209, 212, 240, 0.56)' },
              ]}
            />
            <View className={styles.textBox}>
              <View
                className={`${styles.tempTopBox} ${styles.tempValueClickArea}`}
                onClick={e => {
                  e?.stopPropagation?.();
                  handleTempValueClick();
                }}
              >
                <Text className={styles.targetTempValue}>{tempValue}</Text>
                <Text className={styles.targetTempTips}>℃</Text>
              </View>
              {/* <Image src={Res.driver} className={styles.driverIcon} /> */}
              <Text className={styles.targetTempLabel}>{Strings.getLang('tank_temp')}</Text>
              <Text className={styles.currentTempValue}>{currentTemp}℃</Text>
            </View>
          </View>
          <View className={styles.tempControls}>
            <View className={styles.tempBtn} onClick={handleTempDecrease}>
              <Image src={Res.minus} className={styles.addIcon} />
            </View>
            <View className={styles.tempBtn} onClick={handleTempIncrease}>
              <Image src={Res.add} className={styles.addIcon} />
            </View>
          </View>
        </View>
      </View>

      {/* Mode Display */}
      <View className={styles.modeDisplay}>
        <Text className={styles.modeText}>{Strings.getDpLang(modeCode, mode)}</Text>
      </View>

      {/* Bottom Navigation */}
      <View className={styles.tabWrap} style={{ height: `${tabHeight}rpx` }}>
        <Image src={Res.bottomBg} className={styles.bottomBg} />
        <View className={styles.tabBox}>
          {tabs.map((item, index) => (
            <View key={item.key} onClick={() => handleSetting(index)}>
              <Image
                src={
                  powerSwitch && index === 1
                    ? Res.swActive
                    : index === 2 && disinfectState
                    ? Res.hotIconAct
                    : item.img
                }
                className={`${styles.tabItem} ${index === 1 ? styles.tabCenter : ''}`}
              />
            </View>
          ))}
        </View>
        <View className={styles.statusBar} style={{ height: `${statusBarHeight}px` }} />
      </View>

      <Dialog id="temp-setting-dialog" />
    </View>
  );
}

export default Home;
