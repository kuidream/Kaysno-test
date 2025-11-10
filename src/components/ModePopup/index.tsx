import React from 'react';
import { View, Text, Image } from '@ray-js/ray';
import { Popup } from '@ray-js/smart-ui';
import Res from '@/res';
import Strings from '@/i18n';
import styles from './index.module.less';
import { dpCodes } from '@/config';

interface ModePopupProps {
  visible: boolean;
  selectedMode: string;
  statusBarHeight: number;
  onClose: () => void;
  onSelect: (val: string) => void;
}

const { modeCode } = dpCodes;

const modeOptions = [
  { value: 'ECO', label: Strings.getDpLang(modeCode, 'ECO') },
  { value: 'RPAID', label: Strings.getDpLang(modeCode, 'RPAID') },
];

export function ModePopup({
  visible,
  selectedMode,
  statusBarHeight,
  onClose,
  onSelect,
}: ModePopupProps) {
  return (
    <Popup
      show={visible}
      position="bottom"
      overlayStyle={{ background: 'rgba(0, 0, 0, 0.4)' }}
      customStyle={{ background: 'transparent' }}
      onClose={onClose}
    >
      <View className={styles.modePopup} style={{ marginBottom: `${statusBarHeight / 2}rpx` }}>
        {modeOptions.map((opt, index) => (
          <React.Fragment key={opt.value}>
            <View className={styles.modeItem} onClick={() => onSelect(opt.value)}>
              <Text>{opt.label}</Text>
              {selectedMode === opt.value && (
                <Image src={Res.fiCheck} className={styles.checkIcon} />
              )}
            </View>
            {index !== modeOptions.length - 1 && (
              <Image src={Res.driver} className={styles.driverIcon} />
            )}
          </React.Fragment>
        ))}
      </View>
    </Popup>
  );
}

export default ModePopup;
