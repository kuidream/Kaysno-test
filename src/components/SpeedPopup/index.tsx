import React from 'react';
import { View, Text } from '@ray-js/ray';
import { Popup } from '@ray-js/smart-ui';
import styles from './index.module.less';

interface SpeedPopupProps {
  visible: boolean;
  selected: number;
  statusBarHeight: number;
  onClose: () => void;
  onSelect: (val: number) => void;
}

const options = [
  { value: 2, label: 'Low' },
  { value: 3, label: 'High' },
];

export default function SpeedPopup({ visible, selected, statusBarHeight, onClose, onSelect }: SpeedPopupProps) {
  return (
    <Popup
      show={visible}
      position="bottom"
      overlayStyle={{ background: 'rgba(0, 0, 0, 0.4)' }}
      customStyle={{ background: 'transparent' }}
      onClose={onClose}
    >
      <View className={styles.popup} style={{ marginBottom: `${statusBarHeight / 2}rpx` }}>
        {options.map((opt, index) => (
          <React.Fragment key={opt.value}>
            <View className={`${styles.item} ${selected === (opt as any).value ? styles.active : ''}`} onClick={() => onSelect((opt as any).value)}>
              <Text>{opt.label}</Text>
            </View>
            {index !== options.length - 1 && <View className={styles.divider} />}
          </React.Fragment>
        ))}
      </View>
    </Popup>
  );
}


