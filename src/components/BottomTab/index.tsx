import React from 'react';
import { View, Text, navigateTo } from '@ray-js/ray';
import Res from '@/res';
import Strings from '@/i18n';
import { isIphoneX } from '@/utils';
import { useSystemInfo } from '@/hooks/useSystemInfo';
import AutoSizeImageComponent from '@/components/AutoSizeImage';
import styles from './index.module.less';

interface BottomTabProps {
  activeTab: number; // 当前激活的tab索引 (0: record, 1: timer, 2: remote, 3: setting)
}

export function BottomTab({ activeTab }: BottomTabProps) {
  const systemInfo = useSystemInfo();
  const tabHeight = isIphoneX(systemInfo) ? 212 : 184;
  const [pressedTabIndex, setPressedTabIndex] = React.useState<number | null>(null);

  const tabs = [
    {
      key: 0,
      imgOff: Res.bot_icon_record,
      imgOn: Res.bot_icon_record,
      text: Strings.getLang('tab_record'),
      url: '/pages/record/index',
    },
    {
      key: 1,
      imgOff: Res.bot_icon_schedule,
      imgOn: Res.bot_icon_schedule,
      text: Strings.getLang('tab_timer'),
      url: '/pages/timer/index',
    },
    {
      key: 2,
      imgOff: Res.bot_icon_remote,
      imgOn: Res.bot_icon_remote,
      text: Strings.getLang('tab_remote'),
      url: '/pages/remote/index',
    },
    {
      key: 3,
      imgOff: Res.bot_icon_setting,
      imgOn: Res.bot_icon_setting,
      text: Strings.getLang('tab_set'),
      url: '/pages/setting/index',
    },
  ];

  const handleTabChange = (index: number) => {
    if (index === activeTab) {
      return; // 如果点击的是当前页面，不进行跳转
    }

    const tab = tabs[index];
    if (tab?.url) {
      navigateTo({ url: tab.url });
    }
  };

  return (
    <View className={styles.tabWrap} style={{ height: `${tabHeight}rpx` }}>
      {tabs.map((item, index) => {
        const isPressed = pressedTabIndex === item.key;
        const isActive = item.key === activeTab || isPressed;
        return (
          <View
            key={item.key}
            className={styles.tabItem}
            onTouchStart={() => setPressedTabIndex(item.key)}
            onTouchEnd={() => {
              setPressedTabIndex(null);
              handleTabChange(index);
            }}
          >
            <AutoSizeImageComponent src={isActive ? item.imgOn : item.imgOff} />
            <Text className={styles.tabText}>{item.text}</Text>
          </View>
        );
      })}
    </View>
  );
}

export default BottomTab;
