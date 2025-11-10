import React from 'react';
import { View, Text, Input } from '@ray-js/ray';
import { Popup } from '@ray-js/smart-ui';
import clsx from 'clsx';
import Strings from '@/i18n';
import styles from './index.module.less';

interface Props {
  visible: boolean;
  onConfirm: (value: string) => void;
  onCancel: () => void;
  loading?: boolean;
}

const FactorySettingPopup: React.FC<Props> = ({
  visible,
  onConfirm,
  onCancel,
  loading = false,
}) => {
  const [value, setValue] = React.useState('');

  React.useEffect(() => {
    if (!visible) {
      setValue('');
    }
  }, [visible]);

  return (
    <Popup
      show={visible}
      position="center"
      overlayStyle={{ background: 'rgba(0, 0, 0, 0.5)' }}
      customStyle={{ background: 'transparent' }}
      onClose={() => !loading && onCancel()}
    >
      <View className={styles.popup} onClick={e => e?.stopPropagation?.()}>
        <Text className={styles.title}>{Strings.getLang('factory_settings')}</Text>
        <Input
          className={styles.input}
          value={value}
          onInput={e => setValue(e.value)}
          onClick={e => e?.stopPropagation?.()}
          placeholder={Strings.getLang('password_required')}
          placeholderStyle="color: rgba(153, 153, 153, 0.38)"
        />
        <View className={styles.btnRow}>
          <View className={styles.btn} onClick={() => onCancel()}>
            <Text className={styles.cancelText}>{Strings.getLang('cancel')}</Text>
          </View>
          <View
            className={clsx(styles.btn, { [styles.disabled]: loading })}
            onClick={() => !loading && onConfirm(value)}
          >
            {loading ? (
              <View className={styles.loading} />
            ) : (
              <Text className={styles.confirmText}>{Strings.getLang('dsc_ok')}</Text>
            )}
          </View>
        </View>
      </View>
    </Popup>
  );
};

export default FactorySettingPopup;
