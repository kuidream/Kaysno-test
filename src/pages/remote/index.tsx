import React, { useEffect, useState } from 'react';
// 遥控器列表页面，包含新增、删除和控制逻辑
import { hideMenuButton, Text, View, Image, router, navigateBack } from '@ray-js/ray';
import {
  ConfigProvider,
  Dialog,
  Popup,
  ToastInstance,
  Toast,
  DialogInstance,
  NavBar,
} from '@ray-js/smart-ui';
import NormalAPI from '@/api/normal';
import { useSelector } from 'react-redux';
import Res from '@/res';
import Strings from '@/i18n';
import { dpCodes } from '@/config';
import {
  decodeRemoteList,
  encodeRemoteList,
  valueToAction,
  actionToValue,
  encodeAddRemoteCmd,
  encodeRemoteFunc,
  RemoteAction,
} from '@/utils/remote';
import { useActions, useDevice, useProps } from '@ray-js/panel-sdk';
import { RemoteItem } from '@/components';
import classNames from 'classnames';
import { ReduxState, useAppDispatch } from '@/redux';
import { refreshAdd, selectShouldAddSuccess } from '@/redux/modules/uiStateSlice';
import DialogName from '@/components/DialogName';
import styles from './index.module.less';

const { remoteListCode, remoteAddCode, remoteFuncCode } = dpCodes;
// 遥控器列表页主体
export function Remote() {
  const actions = useActions();
  const remoteListHex = (useProps(props => props[remoteListCode]) as string) || '';
  const [names, setNames] = React.useState<string[]>([]);
  const MAX_REMOTES = 10;
  const defaultKeyNames = Array(MAX_REMOTES).fill(Strings.getLang('remote_default_title'));
  const [show, setShow] = React.useState(false);
  const [showPop, setShowPop] = React.useState(false);
  const [showDel, setShowDel] = React.useState(false);
  const [funcVal, setFuncVal] = React.useState<RemoteAction>('open');
  const [textInput, setText] = useState('');
  const [textSel, setTextSel] = useState(0); // 选中项索引
  const [arrRemotes, setArrRemotes] = React.useState<any[]>([]);
  const devInfo = useDevice(d => d.devInfo);
  const dispatch = useAppDispatch();
  const shouldRefreshAddSuccess = useSelector((state: ReduxState) => selectShouldAddSuccess(state));

  useEffect(() => {
    hideMenuButton();
  }, []);

  useEffect(() => {
    if (!devInfo?.devId) return;
    NormalAPI.getDeviceCloudData(devInfo.devId, 'remote_names')
      .then(data => {
        try {
          const arr = typeof data === 'string' ? JSON.parse(data) : data;
          if (Array.isArray(arr)) setNames(arr);
        } catch {
          /* empty */
        }
      })
      .catch(() => {
        /* empty */
      });
  }, [devInfo?.devId]);

  useEffect(() => {
    if (shouldRefreshAddSuccess) {
      ToastInstance({
        type: 'success',
        selector: '#add-remote-success',
        message: Strings.getLang('add_remote_success'),
        // onClose: () => {
        //   console.log('执行OnClose函数');
        // },
      });
      // ToastInstance.success(Strings.getLang('add_remote_success'));
      dispatch(refreshAdd(false));
    }
  }, [shouldRefreshAddSuccess]);

  useEffect(() => {
    handleAddRemote();
  }, [remoteListHex, names]);

  const goBack = () => {
    router.back();
  };
  const onClose = () => {
    setShow(false);
  };

  // 修改名称
  const handleConfirm = text => {
    const idx = arrRemotes[textSel]?.index;
    if (idx === undefined) {
      setShow(false);
      return;
    }
    const newNames = [...names];
    newNames[idx] = text;
    setNames(newNames);
    if (devInfo?.devId) {
      NormalAPI.saveDeviceCloudData(devInfo.devId, 'remote_names', JSON.stringify(newNames));
    }
    setShow(false);
  };

  // 输入
  const handleInput = e => {
    setText(e.value);
  };

  // 打开名称弹窗
  const handleShowChange = index => {
    const { name } = arrRemotes[index];
    setTextSel(index);
    setText(name);
    setShow(true);
  };

  // 打开功能弹窗
  const handleShowFunc = index => {
    setTextSel(index);
    setFuncVal(arrRemotes[index].value);
    setShowPop(true);
  };

  // 打开删除弹窗
  const handleDel = index => {
    setTextSel(index);
    setShowDel(true);
  };

  const handleControl = () => {
    const idx = arrRemotes[textSel]?.index;
    if (idx === undefined) {
      setShowPop(false);
      return;
    }
    const list = decodeRemoteList(remoteListHex);
    const item = list[idx];
    const val = actionToValue(funcVal);
    if (item) {
      item.action = val;
      actions[remoteListCode].set(encodeRemoteList(list));
      actions[remoteFuncCode].set(encodeRemoteFunc(item.address, val));
    }
    setShowPop(false);
  };

  const handleDelConfirm = () => {
    const idx = arrRemotes[textSel]?.index;
    if (idx === undefined) {
      setShowDel(false);
      return;
    }
    const list = decodeRemoteList(remoteListHex);
    list.splice(idx, 1);
    actions[remoteListCode].set(encodeRemoteList(list));
    const newNames = [...names];
    newNames.splice(idx, 1);
    setNames(newNames);
    if (devInfo?.devId) {
      NormalAPI.saveDeviceCloudData(devInfo.devId, 'remote_names', JSON.stringify(newNames));
    }
    setShowDel(false);
  };

  const handleAddKey = () => {
    if (arrRemotes.length >= MAX_REMOTES) return;
    actions[remoteAddCode].set(encodeAddRemoteCmd(1));
    router.push(`/remoteAdd?v=${Date.now()}`);
  };

  // 删除全部遥控器
  const handleRemoteDelAll = () => {
    // 删除所有已添加的遥控器
    DialogInstance.confirm({
      message: Strings.getLang('del_all_remote_title'),
    })
      .then(() => {
        actions[remoteListCode].set(encodeRemoteList([]));
        setArrRemotes([]);
        setNames([]);
        if (devInfo?.devId) {
          NormalAPI.saveDeviceCloudData(devInfo.devId, 'remote_names', JSON.stringify([]));
        }
      })
      .catch(() => {
        // 取消
      });
  };

  const handleAddRemote = () => {
    const list = decodeRemoteList(remoteListHex);
    const arr = list.map((item, idx) => ({
      key: idx + 1,
      value: valueToAction(item.action),
      index: idx,
      address: item.address,
      name: names[idx] || defaultKeyNames[idx],
    }));
    setArrRemotes(arr);
  };
  const handleBack = () => navigateBack({ delta: 1 });
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
        onClickLeft={handleBack}
      />
      {/* <ScrollView
        scrollY
        refresherTriggered
        style={{
          height: `calc(100vh)`,
          backgroundColor: '#f3f3f3',
        }}
      > */}
      <View className={styles.content}>
        <View className={styles.listBox}>
          <View className={styles.remoteList}>
            {arrRemotes.map((item, index) => (
              <RemoteItem
                key={item.key}
                item={item}
                index={index}
                onItemClick={() => handleShowChange(index)}
                onSelect={() => handleShowFunc(index)}
                onDelete={handleDel}
              />
            ))}
          </View>
        </View>
      </View>
      {/* </ScrollView> */}
      <Toast id="add-remote-success" />
      <Toast id="smart-toast" />
      <View className={styles.bottomWrap}>
        <View className={styles.addBtns} onClick={handleAddKey}>
          <Image
            src={arrRemotes.length >= MAX_REMOTES ? Res.add_disable : Res.add_timer}
            className={styles.addIcon}
          />
          <Text
            className={classNames(
              styles.addText,
              arrRemotes.length >= MAX_REMOTES && styles.addDisable
            )}
          >
            {Strings.getLang('remote_add_title')}
          </Text>
        </View>
        <View className={styles.addBtns} onClick={handleRemoteDelAll}>
          <Image src={Res.del} className={styles.delIcon} />
          <Text className={styles.delText}>{Strings.getLang('del_remote_all')}</Text>
        </View>
      </View>
      {/* <ConfigProvider
        themeVars={{
          dialogBorderRadius: '16rpx',
        }}
      >
        <Dialog
          useSlot
          show={show}
          showCancelButton
          cancelButtonText={Strings.getLang('cancel')}
          confirmButtonText={Strings.getLang('dsc_ok')}
          onClose={onClose}
          onConfirm={handleConfirm}
        >
          <View className={styles.box}>
            <Text className={styles.textDot16}>{Strings.getLang('remote_change_title')}</Text>
            <View className={styles.dialogContent}>
              <Input
                className={styles.input}
                value={textInput}
                onInput={handleInput}
                type="text"
                placeholder={`${Strings.getLang('remote_default_title')}`}
              />
            </View>
          </View>
        </Dialog>
      </ConfigProvider> */}
      <Popup
        show={showPop}
        round
        position="bottom"
        customStyle={{ height: '858rpx' }}
        onClose={() => setShowPop(false)}
      >
        <View className={styles.popBox}>
          <View className={styles.titlePopBox}>
            <Text className={styles.textDot16}>{Strings.getLang('remote_default_title')}</Text>
          </View>
          <View
            className={styles.popItem}
            style={{
              backgroundColor: funcVal === 'open' && '#f3f3f3',
              opacity: funcVal !== 'open' && 0.32,
            }}
            onClick={() => setFuncVal('open')}
          >
            <Text className={styles.textDot18}>{Strings.getLang('remote_status_open')}</Text>
          </View>
          <View
            className={styles.popItem}
            style={{
              backgroundColor: funcVal === 'close' && '#f3f3f3',
              opacity: funcVal !== 'close' && 0.32,
            }}
            onClick={() => setFuncVal('close')}
          >
            <Text className={styles.textDot18}>{Strings.getLang('remote_status_close')}</Text>
          </View>
          <View
            className={styles.popItem}
            style={{
              backgroundColor: funcVal === 'stop' && '#f3f3f3',
              opacity: funcVal !== 'stop' && 0.32,
            }}
            onClick={() => setFuncVal('stop')}
          >
            <Text className={styles.textDot18}>{Strings.getLang('remote_status_stop')}</Text>
          </View>
          <View
            className={styles.popItem}
            style={{
              backgroundColor: funcVal === 'child_lock' && '#f3f3f3',
              opacity: funcVal !== 'child_lock' && 0.32,
            }}
            onClick={() => setFuncVal('child_lock')}
          >
            <Text className={styles.textDot18}>{Strings.getLang('remote_status_child_lock')}</Text>
          </View>
          <View
            className={styles.popItem}
            style={{
              backgroundColor: funcVal === 'backlight' && '#f3f3f3',
              opacity: funcVal !== 'backlight' && 0.32,
            }}
            onClick={() => setFuncVal('backlight')}
          >
            <Text className={styles.textDot18}>{Strings.getLang('remote_status_backlight')}</Text>
          </View>
          <View className={styles.popBtns}>
            <View
              className={styles.popBtn}
              style={{ opacity: 0.86 }}
              onClick={() => setShowPop(false)}
            >
              <Text className={styles.textDot19}>{Strings.getLang('cancel')}</Text>
            </View>
            <View className={styles.popBtn} onClick={handleControl}>
              <Text className={styles.textDot18}>{Strings.getLang('dsc_ok')}</Text>
            </View>
          </View>
        </View>
      </Popup>
      <ConfigProvider
        themeVars={{
          dialogBorderRadius: '16rpx',
        }}
      >
        <Dialog
          useSlot
          show={showDel}
          showCancelButton
          cancelButtonText={Strings.getLang('cancel')}
          confirmButtonText={Strings.getLang('dsc_ok')}
          onClose={() => setShowDel(false)}
          onConfirm={handleDelConfirm}
        >
          <View className={styles.box}>
            <View className={styles.dialogDContent}>
              <Text className={styles.textDot14}>{Strings.getLang('del_remote')}</Text>
            </View>
          </View>
        </Dialog>
      </ConfigProvider>
      <DialogName
        show={show}
        onCancel={onClose}
        onConfirm={handleConfirm}
        defaultValue={textInput}
        placeholder={`${Strings.getLang('remote_default_title')}`}
        inputType="text"
      />
      <Dialog id="smart-dialog" />
    </View>
  );
}

export default Remote;
