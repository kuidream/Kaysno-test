import React from 'react';
import { View, Text } from '@ray-js/ray';
import { useSelector } from 'react-redux';
import { selectSystemInfoByKey } from '@/redux/modules/systemInfoSlice';
import styles from './index.module.less';

interface TopBarProps {
  title: string;
  onEdit?: () => void;
}

export function TopBar({ title, onEdit }: TopBarProps) {
  const statusBarHeight = useSelector(selectSystemInfoByKey('statusBarHeight'));
  return (
    <View className={styles.topBar} style={{ paddingTop: `${statusBarHeight}px` }}>
      <Text className={styles.title}>{title}</Text>
      <Text className={styles.editIcon} onClick={onEdit}>✎</Text>
    </View>
  );
}

export default TopBar;
