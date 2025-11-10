import React from 'react';
import { View, Text, PickerView, PickerViewColumn } from '@ray-js/ray';
import { Popup } from '@ray-js/smart-ui';
import Strings from '@/i18n';
import { selectSystemInfoByKey } from '@/redux/modules/systemInfoSlice';
import { useSelector } from 'react-redux';
import styles from './index.module.less';

interface TimePickerPopupProps {
  visible: boolean;
  value: [number, number];
  onClose: () => void;
  onConfirm: (val: [number, number]) => void;
}

const hours = Array.from({ length: 24 }, (_, i) => i);
const minutes = Array.from({ length: 60 }, (_, i) => i);

export function TimePickerPopup({ visible, value, onClose, onConfirm }: TimePickerPopupProps) {
  const [innerValue, setInnerValue] = React.useState(value);
  const statusBarHeight = useSelector(selectSystemInfoByKey('statusBarHeight'));
  React.useEffect(() => {
    if (visible) {
      setInnerValue(value);
    }
  }, [visible, value]);

  const handleChange = e => {
    setInnerValue(e.detail.value);
  };

  return (
    <Popup
      show={visible}
      position="bottom"
      overlayStyle={{ background: 'rgba(0, 0, 0, 0.4)' }}
      customStyle={{ background: 'transparent' }}
      onClose={onClose}
    >
      <View className={styles.popup} style={{ marginBottom: `${statusBarHeight}px` }}>
        <View className={styles.pickerBox}>
          <PickerView className={styles.picker} value={innerValue} onChange={handleChange}>
            <PickerViewColumn>
              {hours.map(h => (
                <View key={h} className={styles.pickerItem}>
                  <Text>{String(h).padStart(2, '0')}</Text>
                </View>
              ))}
            </PickerViewColumn>
            <PickerViewColumn>
              {minutes.map(m => (
                <View key={m} className={styles.pickerItem}>
                  <Text>{String(m).padStart(2, '0')}</Text>
                </View>
              ))}
            </PickerViewColumn>
          </PickerView>
          <View className={styles.unitBox}>
            <Text className={styles.hourUnit}>{Strings.getLang('hour_unit')}</Text>
            <Text className={styles.minuteUnit}>{Strings.getLang('minute_unit')}</Text>
          </View>
        </View>
        <View
          className={styles.confirmBtn}
          onClick={() => onConfirm(innerValue as [number, number])}
        >
          <Text>{Strings.getLang('dsc_ok')}</Text>
        </View>
      </View>
    </Popup>
  );
}

export default TimePickerPopup;
