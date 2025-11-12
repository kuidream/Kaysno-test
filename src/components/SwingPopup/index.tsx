import React from 'react';
import { View, Text } from '@ray-js/ray';
import { Popup } from '@ray-js/smart-ui';
import styles from './index.module.less';

interface SwingPopupProps {
  visible: boolean;
  selected: boolean; // true:on false:off
  statusBarHeight: number;
  onClose: () => void;
  onSelect: (val: boolean) => void;
}

export default function SwingPopup({ visible, selected, statusBarHeight, onClose, onSelect }: SwingPopupProps) {
  return (
    <Popup
      show={visible}
      position="bottom"
      overlayStyle={{ background: 'rgba(0, 0, 0, 0.4)' }}
      customStyle={{ background: 'transparent' }}
      onClose={onClose}
    >
      <View className={styles.popup} style={{ marginBottom: `${statusBarHeight / 2}rpx` }}>
        {[{v:true,l:'ON'},{v:false,l:'OFF'}].map((opt, index) => (
          <React.Fragment key={String(opt.v)}>
            <View className={`${styles.item} ${(selected===opt.v)?styles.active:styles.inactive}`} onClick={() => onSelect(opt.v)}>
              <Text>{opt.l}</Text>
            </View>
            {index !== 1 && <View className={styles.divider} />}
          </React.Fragment>
        ))}
      </View>
    </Popup>
  );
}
