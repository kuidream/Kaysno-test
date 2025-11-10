import React from 'react';
import { View, Text, Image, navigateBack } from '@ray-js/ray';
import { useSelector } from 'react-redux';
import { useActions, useProps } from '@ray-js/panel-sdk';
import { selectSystemInfoByKey } from '@/redux/modules/systemInfoSlice';
import dpCodes from '@/config/dpCodes';
import Strings from '@/i18n';
import Res from '@/res';
import { OptionPopup, SliderPopup } from '@/components';
import styles from './index.module.less';

export function UserParams() {
  const handleBack = () => navigateBack({ delta: 1 });
  const statusBarHeight = useSelector(selectSystemInfoByKey('statusBarHeight'));
  const actions = useActions();
  const {
    electricalHeatingTempCode,
    disinfectStateCode,
    disinfectionEnableCode,
    electricalHeatingDelayCode,
    disinfectionTempCode,
    disinfectionTimeCode,
    defrostDelayTimeCode,
    defrostStartTempCode,
    defrostStopTempCode,
    defrostRunTimeCode,
    eevStateCode,
    superheatCode,
    eevManualStepCode,
  } = dpCodes;

  // DP values
  const electricalHeatingTemp = useProps(p => p[electricalHeatingTempCode]) as number;
  const disinfectionState = useProps(p => p[disinfectStateCode]) as boolean;
  const disinfectionEnable = useProps(p => p[disinfectionEnableCode]) as boolean;
  const electricalHeatingDelay = useProps(p => p[electricalHeatingDelayCode]) as number;
  const disinfectionTemp = useProps(p => p[disinfectionTempCode]) as number;
  const disinfectionTime = useProps(p => p[disinfectionTimeCode]) as number;
  const defrostDelayTime = useProps(p => p[defrostDelayTimeCode]) as number;
  const defrostStartTemp = useProps(p => p[defrostStartTempCode]) as number;
  const defrostStopTemp = useProps(p => p[defrostStopTempCode]) as number;
  const defrostRunTime = useProps(p => p[defrostRunTimeCode]) as number;
  const eevState = useProps(p => p[eevStateCode]) as boolean;
  const superheat = useProps(p => p[superheatCode]) as number;
  const eevManualStep = useProps(p => p[eevManualStepCode]) as number;

  const valueMap = React.useMemo(
    () => ({
      [electricalHeatingTempCode]: electricalHeatingTemp,
      [disinfectStateCode]: disinfectionState,
      [electricalHeatingDelayCode]: electricalHeatingDelay,
      [disinfectionTempCode]: disinfectionTemp,
      [disinfectionTimeCode]: disinfectionTime,
      [defrostDelayTimeCode]: defrostDelayTime,
      [defrostStartTempCode]: defrostStartTemp,
      [defrostStopTempCode]: defrostStopTemp,
      [disinfectionEnableCode]: disinfectionEnable,
      [defrostRunTimeCode]: defrostRunTime,
      [eevStateCode]: eevState,
      [superheatCode]: superheat,
      [eevManualStepCode]: eevManualStep,
    }),
    [
      electricalHeatingTemp,
      disinfectionState,
      electricalHeatingDelay,
      disinfectionTemp,
      disinfectionTime,
      defrostDelayTime,
      defrostStartTemp,
      defrostStopTemp,
      defrostRunTime,
      eevState,
      superheat,
      eevManualStep,
      disinfectionEnable,
    ]
  );

  const paramItems = [
    {
      code: electricalHeatingTempCode,
      value: electricalHeatingTemp,
      title: Strings.getLang('electrical_heating_temp'),
      unit: '℃',
      type: 'value',
      min: -7,
      max: 15,
    },
    {
      code: disinfectStateCode,
      value: disinfectionState,
      title: Strings.getLang('disinfection_state_mal'),
      type: 'bool',
    },
    {
      code: disinfectionEnableCode,
      value: disinfectionEnable,
      title: Strings.getLang('disinfection_state'),
      type: 'bool',
    },
    {
      code: electricalHeatingDelayCode,
      value: electricalHeatingDelay,
      title: Strings.getLang('electrical_heating_delay'),
      unit: 'min',
      type: 'value',
      min: 0,
      max: 90,
    },
    {
      code: disinfectionTempCode,
      value: disinfectionTemp,
      title: Strings.getLang('disinfection_temp'),
      unit: '℃',
      type: 'value',
      min: 60,
      max: 80,
    },
    {
      code: disinfectionTimeCode,
      value: disinfectionTime,
      title: Strings.getLang('disinfection_time'),
      unit: 'min',
      type: 'value',
      min: 30,
      max: 90,
    },
    {
      code: defrostDelayTimeCode,
      value: defrostDelayTime,
      title: Strings.getLang('defrost_delay_time'),
      unit: 'min',
      type: 'value',
      min: 30,
      max: 90,
    },
    {
      code: defrostStartTempCode,
      value: defrostStartTemp,
      title: Strings.getLang('defrost_start_temp'),
      unit: '℃',
      type: 'value',
      min: -30,
      max: 0,
    },
    {
      code: defrostStopTempCode,
      value: defrostStopTemp,
      title: Strings.getLang('defrost_stop_temp'),
      unit: '℃',
      type: 'value',
      min: 2,
      max: 30,
    },
    {
      code: defrostRunTimeCode,
      value: defrostRunTime,
      title: Strings.getLang('defrost_run_time'),
      unit: 'min',
      type: 'value',
      min: 1,
      max: 12,
    },
    {
      code: eevStateCode,
      value: eevState,
      title: Strings.getLang('eev_state'),
      type: 'bool',
    },
    {
      code: superheatCode,
      value: superheat,
      title: Strings.getLang('superheat'),
      unit: '℃',
      type: 'value',
      min: -9,
      max: 9,
    },
    {
      code: eevManualStepCode,
      value: eevManualStep,
      title: Strings.getLang('eev_manual_step'),
      type: 'value',
      min: 0,
      max: 500,
    },
  ];

  const [popupItem, setPopupItem] = React.useState<any>(null);
  const [sliderValue, setSliderValue] = React.useState(0);
  const [pending, setPending] = React.useState<{ code: string; value: any } | null>(null);

  React.useEffect(() => {
    if (pending) {
      const current = valueMap[pending.code];
      if (current === pending.value) {
        setPending(null);
      }
    }
  }, [valueMap, pending]);

  const openPopup = item => {
    if (item.type === 'value') {
      const cur = valueMap[item.code];
      setSliderValue(typeof cur === 'number' ? cur : item.min);
    }
    setPopupItem(item);
  };

  const handleBoolSelect = (val: boolean) => {
    if (!popupItem) return;
    // 直接调用 set 下发 DP
    actions[popupItem.code].set(val);
    setPending({ code: popupItem.code, value: val });
    setPopupItem(null);
  };

  const handleSliderChange = (val: number) => {
    setSliderValue(val);
  };

  const handleSliderAfterChange = (val: number) => {
    if (!popupItem) return;

    setSliderValue(val);
    // 直接调用 set 下发 DP
    actions[popupItem.code].set(val);
    setPending({ code: popupItem.code, value: val });
  };

  const getDisplayValue = item => {
    const val = valueMap[item.code];

    if (val === undefined || val === null) return '--';
    if (item.type === 'bool') {
      if (item.code === eevStateCode) {
        return val ? Strings.getLang('manual_mode') : Strings.getLang('auto_mode');
      }
      return val ? Strings.getLang('dsc_on') : Strings.getLang('dsc_off');
    }
    return `${val}${item.unit || ''}`;
  };

  const boolOptions = React.useMemo(() => {
    if (popupItem?.type !== 'bool') return [];
    if (popupItem.code === eevStateCode) {
      return [
        { value: true, label: Strings.getLang('manual_mode') },
        { value: false, label: Strings.getLang('auto_mode') },
      ];
    }
    return [
      { value: true, label: Strings.getLang('dsc_on') },
      { value: false, label: Strings.getLang('dsc_off') },
    ];
  }, [popupItem, eevStateCode]);

  return (
    <View
      className={styles.page}
      style={{ paddingBottom: `${statusBarHeight}px`, paddingTop: `${statusBarHeight}px` }}
    >
      <View className={styles.topbar}>
        <Image src={Res.goBack} className={styles.backIcon} onClick={handleBack} />
        <Text className={styles.topbarTitle}>{Strings.getLang('user_set_title')}</Text>
      </View>
      <View className={styles.list}>
        {paramItems.map(item => (
          <View key={item.code} className={styles.item} onClick={() => openPopup(item)}>
            <View className={styles.left}>
              <Image src={Res.userSet} className={styles.leftIcon} />
              <Text className={styles.title}>{item.title}</Text>
            </View>
            <View className={styles.right}>
              <Text className={styles.value}>{getDisplayValue(item)}</Text>
              <Image src={Res.setRight} className={styles.rightIcon} />
            </View>
          </View>
        ))}
      </View>

      <OptionPopup
        visible={popupItem?.type === 'bool'}
        options={boolOptions}
        value={popupItem ? valueMap[popupItem.code] : undefined}
        onSelect={handleBoolSelect}
        onClose={() => setPopupItem(null)}
      />

      <SliderPopup
        visible={popupItem?.type === 'value'}
        value={popupItem?.value}
        min={popupItem?.min}
        max={popupItem?.max}
        unit={popupItem?.unit}
        onChange={handleSliderChange}
        onAfterChange={handleSliderAfterChange}
        onClose={() => setPopupItem(null)}
      />
    </View>
  );
}

export default UserParams;
