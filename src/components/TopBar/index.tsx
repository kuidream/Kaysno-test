import React from 'react';
import { View, Text, Image, navigateBack } from '@ray-js/ray';
import { useSelector } from 'react-redux';
import { selectSystemInfoByKey } from '@/redux/modules/systemInfoSlice';
import styles from './index.module.less';
import Res from '@/res';

interface TopBarProps {
  title: string;
  onEdit?: () => void;
  onPower?: () => void;
  powerOn?: boolean;
  onBack?: () => void;
}

export function TopBar({ title, onEdit, onPower, powerOn, onBack }: TopBarProps) {
  const statusBarHeight = useSelector(selectSystemInfoByKey('statusBarHeight'));
  return (
    <View className={styles.topBar} style={{ paddingTop: `${statusBarHeight}px` }}>
      <View className={styles.left} onClick={onBack || (() => navigateBack({ delta: 1 }))}>
        <Image src={Res.goBack} className={styles.navIcon} />
      </View>
      <Text className={styles.title}>{title}</Text>
      <View className={styles.right}>
        <Text className={styles.editIcon} onClick={onEdit}>✎</Text>
        <View className={`${styles.powerBtn} ${powerOn ? styles.powerBtnOn : ''}`} onClick={onPower}>
          <Text className={styles.powerIcon}>⏻</Text>
        </View>
      </View>
    </View>
  );
}

export default TopBar;
