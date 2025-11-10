import React from 'react';
import { View, Text, Image } from '@ray-js/ray';
import { Popup } from '@ray-js/smart-ui';
import Res from '@/res';
import styles from './index.module.less';

export interface OptionPopupProps {
  visible: boolean;
  value: any;
  options: { value: any; label: string }[];
  onClose: () => void;
  onSelect: (val: any) => void;
}

export function OptionPopup({ visible, value, options, onClose, onSelect }: OptionPopupProps) {
  return (
    <Popup
      show={visible}
      position="bottom"
      overlayStyle={{ background: 'rgba(0, 0, 0, 0.4)' }}
      customStyle={{ background: 'transparent' }}
      onClose={onClose}
    >
      <View className={styles.optionPopup}>
        {options.map((opt, index) => (
          <React.Fragment key={String(opt.value)}>
            <View className={styles.optionItem} onClick={() => onSelect(opt.value)}>
              <Text>{opt.label}</Text>
              {value === opt.value && <Image src={Res.fiCheck} className={styles.checkIcon} />}
            </View>
            {index !== options.length - 1 && (
              <Image src={Res.driver} className={styles.driverIcon} />
            )}
          </React.Fragment>
        ))}
      </View>
    </Popup>
  );
}

export default OptionPopup;
