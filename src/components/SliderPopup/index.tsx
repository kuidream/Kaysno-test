import React from 'react';
import { View, Text, Slider } from '@ray-js/ray';
import { Popup } from '@ray-js/smart-ui';
import styles from './index.module.less';

export interface SliderPopupProps {
  visible: boolean;
  value: number;
  min: number;
  max: number;
  unit?: string;
  onChange: (val: number) => void;
  onAfterChange: (val: number) => void;
  onClose: () => void;
}

export function SliderPopup({
  visible,
  value,
  min,
  max,
  unit,
  onChange,
  onAfterChange,
  onClose,
}: SliderPopupProps) {
  const handleChanging = (e: { detail: { value: number } }) => {
    setSliderValue(e.detail.value);
  };

  const [sliderValue, setSliderValue] = React.useState(value);

  React.useEffect(() => {
    if (typeof value === 'number') {
      setSliderValue(value);
    }
  }, [value]);
  const handleChange = e => {
    setSliderValue(e.detail.value);
    onAfterChange(e.detail.value);
  };

  return (
    <Popup
      show={visible}
      position="bottom"
      overlayStyle={{ background: 'rgba(0, 0, 0, 0.4)' }}
      customStyle={{ background: 'transparent' }}
      onClose={onClose}
    >
      <View className={styles.sliderPopup}>
        <Text className={styles.currentValue}>
          {sliderValue}
          {unit || ''}
        </Text>
        <View className={styles.sliderRow}>
          <Text className={styles.minText}>
            {min}
            {unit || ''}
          </Text>
          <Slider
            className={styles.slider}
            style={{ width: '440rpx' }}
            min={min}
            max={max}
            step={1}
            value={value}
            onChanging={e => handleChanging(e)}
            onChange={e => handleChange(e)}
          />
          <Text className={styles.maxText}>
            {max}
            {unit || ''}
          </Text>
        </View>
      </View>
    </Popup>
  );
}

export default SliderPopup;
