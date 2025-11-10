import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  navigateBack,
  navigateTo,
  showToast,
  onDpDataChange,
  offDpDataChange,
} from '@ray-js/ray';
import Strings from '@/i18n';
import Res from '@/res';
import { selectSystemInfoByKey } from '@/redux/modules/systemInfoSlice';
import { useSelector } from 'react-redux';
import { useActions, useProps } from '@ray-js/panel-sdk';
import dpCodes from '@/config/dpCodes';
import { FactorySettingPopup } from '@/components';
import styles from './index.module.less';

export function Setting() {
  const handleBack = () => navigateBack({ delta: 1 });
  const statusBarHeight = useSelector(selectSystemInfoByKey('statusBarHeight'));
  const handleItemClick = (item: { id: string; url: string }) => {
    if (item.id === 'factorySettings') {
      setFactoryVisible(true);
    } else {
      navigateTo({ url: item.url });
    }
  };

  const actions = useActions();
  const { userSettingCode } = dpCodes;
  const [factoryVisible, setFactoryVisible] = React.useState(false);
  const [factoryLoading, setFactoryLoading] = React.useState(false);
  const [errorVisible, setErrorVisible] = React.useState(false);
  // 待校验的密码
  const [pendingPwd, setPendingPwd] = React.useState<string | null>(null);
  const penRef = useRef(pendingPwd);
  // 是否跳过下发后的首次上报
  const skipFirstReportRef = useRef(false);
  // 设备上报的 dp120 数据
  const userSettingData = useProps(props => props[userSettingCode]) as string | undefined;

  // 将字符串转换为十六进制形式
  const strToHex = (str: string) =>
    Array.from(str)
      .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
      .join('');

  // 将十六进制字符串还原成普通字符串
  const hexToStr = (hex: string) =>
    hex
      .match(/.{1,2}/g)
      ?.map(b => String.fromCharCode(parseInt(b, 16)))
      .join('') || '';

  useEffect(() => {
    onDpDataChange(dpDataChangeHandle);
    return () => {
      offDpDataChange(dpDataChangeHandle);
    };
  }, []);

  const dpDataChangeHandle = data => {
    // data.dps 为当次上报的dp点
    console.log(data.dps[120]);
    if (!data.dps[120]) return;
    console.log('??????????', penRef.current);
    console.log('??????????skipFirstReport', skipFirstReportRef.current);
    if (skipFirstReportRef.current) {
      skipFirstReportRef.current = false;
      return;
    }
    if (penRef.current) {
      const reported = hexToStr(data.dps[120]);
      console.log('///', reported);

      if (reported === penRef.current) {
        navigateTo({ url: '/pages/userParams/index' });
      } else {
        setErrorVisible(true);
        setTimeout(() => setErrorVisible(false), 2000);
      }
      setFactoryVisible(false);
      setFactoryLoading(false);
      setPendingPwd(null);
    }
  };

  const handleFactoryConfirm = (value: string) => {
    // navigateTo({ url: '/pages/userParams/index' });
    if (!value) {
      showToast({
        title: Strings.getLang('password_required'),
        icon: 'none',
      });
      return;
    }
    // 下发十六进制密码到 dp120
    const hexVal = strToHex(value);
    actions[userSettingCode].set(hexVal);
    // 保存待校验的密码
    setPendingPwd(value);
    penRef.current = value;
    skipFirstReportRef.current = true;
    setFactoryLoading(true);
  };

  const handleFactoryCancel = () => {
    // if (factoryLoading) return;
    setFactoryVisible(false);
    setFactoryLoading(false);
    setPendingPwd(null);
    penRef.current = null;
    skipFirstReportRef.current = false;
  };

  const settingsItems = [
    {
      id: 'statusParams',
      title: Strings.getLang('status_params'),
      icon: Res.documentIcon,
      url: '/pages/statusParams/index',
    },
    {
      id: 'factorySettings',
      title: Strings.getLang('factory_settings'),
      icon: Res.setIcon,
      url: '/pages/factorySettings/index',
    },
    {
      id: 'timer',
      title: Strings.getLang('timing'),
      icon: Res.clockIcon,
      url: '/pages/timer/index',
    },
    {
      id: 'faultRecords',
      title: Strings.getLang('fault_records'),
      icon: Res.warningIcon,
      url: '/pages/faultRecords/index',
    },
  ];

  return (
    <View
      className={styles.page}
      style={{ paddingBottom: `${statusBarHeight}px`, paddingTop: `${statusBarHeight}px` }}
    >
      <View className={styles.topbar}>
        <Image src={Res.goBack} className={styles.backIcon} onClick={handleBack} />
        <Text className={styles.topbarTitle}>{Strings.getLang('panel_settings')}</Text>
      </View>
      <View className={styles.list}>
        {settingsItems.map(item => (
          <View key={item.id} className={styles.item} onClick={() => handleItemClick(item)}>
            <View className={styles.left}>
              <Image src={item.icon} className={styles.leftIcon} />
              <Text className={styles.title}>{item.title}</Text>
            </View>
            <Image src={Res.setRight} className={styles.rightIcon} />
          </View>
        ))}
      </View>
      <FactorySettingPopup
        visible={factoryVisible}
        loading={factoryLoading}
        onCancel={handleFactoryCancel}
        onConfirm={handleFactoryConfirm}
      />
      {errorVisible && (
        <View className={styles.toast}>
          <Image src={Res.infoError} className={styles.toastIcon} />
          <Text className={styles.toastText}>{Strings.getLang('password_incorrect')}</Text>
        </View>
      )}
    </View>
  );
}

export default Setting;
