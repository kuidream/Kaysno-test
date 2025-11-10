import React, { useEffect, useRef, useState } from 'react';
import { View, Image } from '@ray-js/components';
import Strings from '@/i18n';
import { Input } from '@ray-js/ray';
import { useDevice } from '@ray-js/panel-sdk';
import { DialogShowType } from '@/config';
import _ from 'lodash';
import { ConfigProvider, Dialog } from '@ray-js/smart-ui';
import Res from '@/res';
import styles from './index.module.less';

export interface Props {
  show: boolean;
  defaultValue: string;
  onConfirm: (text: string) => void;
  onCancel: () => void;
  maxLength?: number;
  placeholder?: string;
  inputType?: 'digit' | 'number' | 'text';
}

const DialogName: React.FC<Props> = ({
  show = false,
  defaultValue = '',
  onCancel,
  onConfirm,
  inputType = 'text',
  placeholder = '',
  maxLength = 35,
}) => {
  /* 通用部分 */
  const devInfo = useDevice(device => device.devInfo);
  const [isChanged, setIsChanged] = useState(false);

  /* name部分 */

  const [text, setText] = useState(defaultValue);
  const textRef = useRef(text);
  useEffect(() => {
    textRef.current = text; // 同步更新textRef的数据。
  }, [text]);

  useEffect(() => {
    setText(defaultValue);
  }, [defaultValue]);

  const handleInput = e => {
    setIsChanged(true);
    setText(e.value);
  };

  return (
    <ConfigProvider
      themeVars={{
        dialogHeaderFontWeight: '400',
        dialogBorderRadius: '16rpx',
        dialogHeaderPaddingTop: '32rpx',
      }}
    >
      <Dialog
        useSlot
        title={Strings.getLang('remote_change_title')}
        show={show}
        showCancelButton
        confirmButtonClass={styles.btnsText}
        cancelButtonClass={styles.btnsText}
        confirmButtonColor="#2B2B2B"
        cancelButtonText={Strings.getLang('cancel')}
        confirmButtonText={Strings.getLang('dsc_ok')}
        onCancel={onCancel}
        onConfirm={() => {
          onConfirm(textRef.current);
        }}
      >
        <View className={styles.inputBox}>
          <Input
            className={styles.input}
            value={`${isChanged ? text : defaultValue}`}
            onInput={handleInput}
            type={inputType}
            placeholder={placeholder}
            maxLength={maxLength}
          />
        </View>
      </Dialog>
    </ConfigProvider>
  );
};

export default DialogName;
