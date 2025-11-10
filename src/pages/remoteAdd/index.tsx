import React, { useEffect, useState } from 'react';
import { View, Text, router, Image } from '@ray-js/ray';
import { Dialog, ConfigProvider, Circle, DialogInstance, NavBar } from '@ray-js/smart-ui';
import { useActions, useProps } from '@ray-js/panel-sdk';
import { dpCodes } from '@/config';
import {
  decodeAddRemoteCmd,
  decodeRemoteList,
  encodeAddRemoteCmd,
  encodeRemoteList,
} from '@/utils/remote';
import { refreshAdd } from '@/redux/modules/uiStateSlice';
import { useAppDispatch } from '@/redux';
import Strings from '@/i18n';
import Res from '@/res';
import styles from './index.module.less';

const { remoteAddCode, remoteListCode } = dpCodes;

export function RemoteAdd() {
  const actions = useActions();
  const addRemote = (useProps(props => props[remoteAddCode]) as string) || '';
  const remoteListHex = (useProps(props => props[remoteListCode]) as string) || '';
  const dispatch = useAppDispatch();
  const [seconds, setSeconds] = useState(10);

  const goBack = () => {
    actions[remoteAddCode].set(encodeAddRemoteCmd(0));
    router.back();
  };

  useEffect(() => {
    actions[remoteAddCode].set(encodeAddRemoteCmd(1));
    const interval = setInterval(() => setSeconds(s => s - 1), 1000);
    const timeout = setTimeout(() => {
      actions[remoteAddCode].set(encodeAddRemoteCmd(0));
      clearInterval(interval);
      DialogInstance.alert({
        selector: '#smart-dialog-remote',
        message: Strings.getLang('add_remote_timeout'),
      }).then(goBack);
    }, 10000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
      actions[remoteAddCode].set(encodeAddRemoteCmd(0));
    };
  }, []);

  useEffect(() => {
    if (!addRemote) return;
    const data = decodeAddRemoteCmd(addRemote);
    if (!data || data.command !== 2) return;
    const list = decodeRemoteList(remoteListHex || '');
    const exists = list.some(item => item.address === data.address);
    if (exists) {
      actions[remoteAddCode].set(encodeAddRemoteCmd(0));
      DialogInstance.alert({
        selector: '#smart-dialog-remote',
        message: Strings.getLang('add_remote_repeat'),
      }).then(goBack);
      return;
    }
    const newItem = { address: data.address, action: 1 };
    actions[remoteListCode].set(encodeRemoteList([...list, newItem]));
    dispatch(refreshAdd(true));
    goBack();
  }, [addRemote, remoteListHex]);

  return (
    <View className={styles.view}>
      <NavBar
        title={Strings.getLang('dsc_remote')}
        slot={{
          left: (
            <View className={styles.iconWrap}>
              <Image src={Res.arrow_left} className={styles.navBarIcon} />
            </View>
          ),
        }}
        onClickLeft={goBack}
      />
      <View className={styles.content}>
        <View className={styles.countdownBox}>
          <Circle
            size="140rpx"
            percent={100 - seconds * 10}
            trackColor="rgba(255, 255, 255, 1)"
            fillColor="rgba(60, 114, 232, 1)"
            round="transparent"
            maskColor="transparent"
          >
            <View className={styles.numberBox}>
              <View className={styles.numberText}>{`${seconds}`}</View>
              <View className={styles.numberTips}>s</View>
            </View>
          </Circle>
        </View>
        <View className={styles.tips}>{Strings.getLang('remote_status_add')}</View>
      </View>
      <View className={styles.addBtns} onClick={goBack}>
        <Text className={styles.addText}>{Strings.getLang('cancel')}</Text>
      </View>
      <ConfigProvider themeVars={{ dialogMessageTextColor: 'red' }}>
        <Dialog id="smart-dialog-remote" />
      </ConfigProvider>
    </View>
  );
}

export default RemoteAdd;
