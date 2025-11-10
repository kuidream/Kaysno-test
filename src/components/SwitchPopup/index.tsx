import React from 'react';
import { View, Text, Image } from '@ray-js/ray';
import { Popup } from '@ray-js/smart-ui';
import Res from '@/res';
import Strings from '@/i18n';
import styles from './index.module.less';

interface SwitchPopupProps {
  visible: boolean;
  value: boolean;
  statusBarHeight: number;
  onClose: () => void;
  onSelect: (val: boolean) => void;
}

const options = [
  { value: true, label: Strings.getLang('dsc_on') },
  { value: false, label: Strings.getLang('dsc_off') },
];

export function SwitchPopup({
  visible,
  value,
  statusBarHeight,
  onClose,
  onSelect,
}: SwitchPopupProps) {
  return (
    <Popup
      show={visible}
      position="bottom"
      overlayStyle={{ background: 'rgba(0, 0, 0, 0.4)' }}
      customStyle={{ background: 'transparent' }}
      onClose={onClose}
    >
      <View className={styles.popup} style={{ marginBottom: `${statusBarHeight}px` }}>
        {options.map((opt, index) => (
          <React.Fragment key={String(opt.value)}>
            <View className={styles.item} onClick={() => onSelect(opt.value)}>
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

export default SwitchPopup;
