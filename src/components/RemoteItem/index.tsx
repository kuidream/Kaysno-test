import React from 'react';
// 遥控器列表项，支持编辑、选择和删除等操作
import { View, Image, Text } from '@ray-js/components';
import { SwipeCell } from '@ray-js/smart-ui';
import Res from '@/res';
import styles from './index.module.less';

export interface RemoteItemData {
  key: number;
  value: string;
  code: string;
  nameCode?: string;
  name?: string;
}

interface Props {
  item: RemoteItemData;
  index: number;
  onItemClick: () => void;
  onSelect: (index: number) => void;
  onDelete: (index: number) => void;
}

const RemoteItem: React.FC<Props> = ({ item, index, onItemClick, onSelect, onDelete }) => {
  // 触发点击区域的逻辑，如果未拦截会进入遥控器绑定
  return (
    <SwipeCell
      rightWidth={130}
      leftWidth={0}
      slot={{
        right: (
          <View className={styles.swpCell} onClick={() => onDelete(index)}>
            <Image src={Res.remote_del} className={styles.delIcon} />
          </View>
        ),
      }}
    >
      <View className={styles.remoteItem}>
        <View className={styles.itemLeftWrap}>
          {/* 点击名称区域修改名称 */}
          <View className={styles.remoteInfo} onClick={onItemClick}>
            <View className={styles.overText}>
              <Text className={styles.remoteTitle}>{item.name}</Text>
            </View>
          </View>
        </View>
        {/* 右侧箭头，修改开关状态 */}
        <View
          className={styles.remoteCtrl}
          onClick={e => {
            e?.stopPropagation?.();
            e?.preventDefault?.();
            onSelect(index);
          }}
        >
          <Image src={Res.rightTimer} className={styles.rightArrow} />
        </View>
      </View>
    </SwipeCell>
  );
};

export default RemoteItem;
