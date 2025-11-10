import React from 'react';
import { View, Text, Image, navigateBack } from '@ray-js/ray';
import { useSelector } from 'react-redux';
import { useActions, useProps } from '@ray-js/panel-sdk';
import { selectSystemInfoByKey } from '@/redux/modules/systemInfoSlice';
import Strings from '@/i18n';
import Res from '@/res';
import { SwitchPopup, TimePickerPopup } from '@/components';
import dpCodes from '@/config/dpCodes';
import { putDpData } from '@/api';
import styles from './index.module.less';

const { timerCode } = dpCodes;

export function Timer() {
  const handleBack = () => navigateBack({ delta: 1 });
  const statusBarHeight = useSelector(selectSystemInfoByKey('statusBarHeight'));
  const actions = useActions();
  const timerRaw = useProps(props => props[timerCode]) as string;
  const items = [
    { id: 1, title: Strings.getLang('timer1_switch') },
    { id: 2, title: Strings.getLang('timer1_on') },
    { id: 3, title: Strings.getLang('timer1_off') },
    { id: 4, title: Strings.getLang('timer2_switch') },
    { id: 5, title: Strings.getLang('timer2_on') },
    { id: 6, title: Strings.getLang('timer2_off') },
  ];

  const [timer1Switch, setTimer1Switch] = React.useState(false);
  const [timer2Switch, setTimer2Switch] = React.useState(false);
  const [timer1On, setTimer1On] = React.useState<[number, number]>([0, 0]);
  const [timer1Off, setTimer1Off] = React.useState<[number, number]>([0, 0]);
  const [timer2On, setTimer2On] = React.useState<[number, number]>([0, 0]);
  const [timer2Off, setTimer2Off] = React.useState<[number, number]>([0, 0]);

  const [switchPopup, setSwitchPopup] = React.useState<1 | 2 | null>(null);
  const [pickerPopup, setPickerPopup] = React.useState<{ timer: 1 | 2; type: 'on' | 'off' } | null>(
    null
  );

  React.useEffect(() => {
    if (!timerRaw) return;
    const bytes: number[] = [];
    for (let i = 0; i < timerRaw.length; i += 2) {
      bytes.push(parseInt(timerRaw.slice(i, i + 2), 16));
    }
    if (bytes.length >= 11 && bytes[0] === 0x02) {
      setTimer1Switch(bytes[1] === 1);
      setTimer1On([bytes[2], bytes[3]]);
      setTimer1Off([bytes[4], bytes[5]]);
      setTimer2Switch(bytes[6] === 1);
      setTimer2On([bytes[7], bytes[8]]);
      setTimer2Off([bytes[9], bytes[10]]);
    }
  }, [timerRaw]);

  const sendTimerDp = (
    t1SwitchVal: boolean = timer1Switch,
    t2SwitchVal: boolean = timer2Switch,
    t1OnVal: [number, number] = timer1On,
    t1OffVal: [number, number] = timer1Off,
    t2OnVal: [number, number] = timer2On,
    t2OffVal: [number, number] = timer2Off
  ) => {
    const toHex = (num: number) => num.toString(16).padStart(2, '0');
    const bytes = [
      0x02,
      t1SwitchVal ? 0x01 : 0x00,
      t1OnVal[0],
      t1OnVal[1],
      t1OffVal[0],
      t1OffVal[1],
      t2SwitchVal ? 0x01 : 0x00,
      t2OnVal[0],
      t2OnVal[1],
      t2OffVal[0],
      t2OffVal[1],
    ];
    const raw = bytes.map(toHex).join('');
    console.log('????raw', raw);
    actions[timerCode].set(raw);
    // putDpData({ [timerCode]: raw });
  };

  const formatTime = (val: [number, number]) =>
    `${String(val[0]).padStart(2, '0')}:${String(val[1]).padStart(2, '0')}`;

  const handleItemClick = (id: number) => {
    switch (id) {
      case 1:
        setSwitchPopup(1);
        break;
      case 4:
        setSwitchPopup(2);
        break;
      case 2:
        setPickerPopup({ timer: 1, type: 'on' });
        break;
      case 3:
        setPickerPopup({ timer: 1, type: 'off' });
        break;
      case 5:
        setPickerPopup({ timer: 2, type: 'on' });
        break;
      case 6:
        setPickerPopup({ timer: 2, type: 'off' });
        break;
      default:
        break;
    }
  };

  const renderValue = (id: number) => {
    switch (id) {
      case 1:
        return Strings.getLang(timer1Switch ? 'dsc_on' : 'dsc_off');
      case 4:
        return Strings.getLang(timer2Switch ? 'dsc_on' : 'dsc_off');
      case 2:
        return formatTime(timer1On);
      case 3:
        return formatTime(timer1Off);
      case 5:
        return formatTime(timer2On);
      case 6:
        return formatTime(timer2Off);
      default:
        return '';
    }
  };

  return (
    <View
      className={styles.page}
      style={{ paddingBottom: `${statusBarHeight}px`, paddingTop: `${statusBarHeight}px` }}
    >
      <View className={styles.topbar}>
        <Image src={Res.goBack} className={styles.backIcon} onClick={handleBack} />
        <Text className={styles.topbarTitle}>{Strings.getLang('timing')}</Text>
      </View>
      <View className={styles.list}>
        {items.map(item => (
          <View key={item.id} className={styles.item} onClick={() => handleItemClick(item.id)}>
            <View className={styles.left}>
              <Image src={Res.userSet} className={styles.leftIcon} />
              <Text className={styles.title}>{item.title}</Text>
            </View>
            <View className={styles.right}>
              <Text className={styles.value}>{renderValue(item.id)}</Text>
              <Image src={Res.setRight} className={styles.rightIcon} />
            </View>
          </View>
        ))}
      </View>

      <SwitchPopup
        visible={switchPopup !== null}
        value={switchPopup === 1 ? timer1Switch : timer2Switch}
        statusBarHeight={statusBarHeight}
        onClose={() => setSwitchPopup(null)}
        onSelect={val => {
          let t1 = timer1Switch;
          let t2 = timer2Switch;
          if (switchPopup === 1) {
            setTimer1Switch(val);
            t1 = val;
          } else if (switchPopup === 2) {
            setTimer2Switch(val);
            t2 = val;
          }
          sendTimerDp(t1, t2);
          setSwitchPopup(null);
        }}
      />

      <TimePickerPopup
        visible={pickerPopup !== null}
        value={
          pickerPopup
            ? pickerPopup.timer === 1
              ? pickerPopup.type === 'on'
                ? timer1On
                : timer1Off
              : pickerPopup.type === 'on'
              ? timer2On
              : timer2Off
            : [0, 0]
        }
        onClose={() => setPickerPopup(null)}
        onConfirm={val => {
          if (!pickerPopup) return;
          const { timer, type } = pickerPopup;
          let t1OnVal = timer1On;
          let t1OffVal = timer1Off;
          let t2OnVal = timer2On;
          let t2OffVal = timer2Off;
          if (timer === 1) {
            if (type === 'on') {
              setTimer1On(val);
              t1OnVal = val;
            } else {
              setTimer1Off(val);
              t1OffVal = val;
            }
          } else if (type === 'on') {
            setTimer2On(val);
            t2OnVal = val;
          } else {
            setTimer2Off(val);
            t2OffVal = val;
          }
          sendTimerDp(timer1Switch, timer2Switch, t1OnVal, t1OffVal, t2OnVal, t2OffVal);
          setPickerPopup(null);
        }}
      />
    </View>
  );
}

export default Timer;
