import React, { useEffect } from 'react';
import { View, Text, Image, navigateBack } from '@ray-js/ray';
import { useSelector } from 'react-redux';
import { useDevice, useProps } from '@ray-js/panel-sdk';
import Strings from '@/i18n';
import Res from '@/res';
import dpCodes from '@/config/dpCodes';
import { selectSystemInfoByKey } from '@/redux/modules/systemInfoSlice';
import { getLogsData } from '@/api';
import { getFaultStrings } from '@/utils';
import styles from './index.module.less';

const { faultCode } = dpCodes;

interface FaultRecord {
  id: number;
  faultCode: number;
  faultText: string;
}

export function FaultRecords() {
  const statusBarHeight = useSelector(selectSystemInfoByKey('statusBarHeight'));
  const handleBack = () => navigateBack({ delta: 1 });
  const devInfo = useDevice(device => device.devInfo);
  const { devId } = devInfo;
  const RecordsDpId = '18';
  const faultValue = useProps(props => props[faultCode]) as number;
  const [faultRecords, setFaultRecords] = React.useState<FaultRecord[]>([]);
  const [list, setList] = React.useState([]);
  const faultSchema = devInfo?.schema.find(data => data?.code === faultCode);
  useEffect(() => {
    getRecords();
  });

  const getFaultText = (code: number): string => {
    if (code === null || code === undefined) {
      return '';
    }

    const labels = faultSchema?.property?.label as string[] | undefined;

    if (!labels || !Array.isArray(labels) || labels.length === 0) {
      return code === 0 ? '' : String(code);
    }

    const faultText = getFaultStrings(labels, faultCode, code);
    if (faultText) {
      return faultText;
    }

    const fallbackTexts: string[] = [];
    labels.forEach((label: string, index: number) => {
      if (code & (1 << index)) {
        const text = Strings.getDpLang(faultCode, label);
        if (text) {
          fallbackTexts.push(text);
        }
      }
    });

    if (fallbackTexts.length > 0) {
      return fallbackTexts.join(',');
    }

    return code === 0 ? '' : String(code);
  };

  // React.useEffect(() => {
  //   const mockRecords: FaultRecord[] = [];
  //   if (faultValue && faultValue > 0) {
  //     mockRecords.push({
  //       id: 1,
  //       faultCode: faultValue,
  //       faultText: getFaultText(faultValue),
  //     });
  //   }
  //   const sampleFaults = [1, 32, 4, 128, 64];
  //   sampleFaults.forEach((code, index) => {
  //     mockRecords.push({
  //       id: index + 2,
  //       faultCode: code,
  //       faultText: getFaultText(code),
  //     });
  //   });
  //   setFaultRecords(mockRecords.slice(0, 8));
  // }, [faultValue]);

  const splitDateTime = dateTimeStr => {
    if (!dateTimeStr) return { date: '', time: '' };

    const [datePart, timePart] = dateTimeStr.split(' ');
    const formattedDate = datePart.replace(/-/g, '/');

    return {
      date: formattedDate || '',
      time: timePart || '',
    };
  };

  const getRecords = async () => {
    const res: any = await Promise.all([getLogsData(devId, RecordsDpId)]);
    console.log('getRecords api响应', res);
    if (res[0] && res[0].dps) {
      // setList(res[0].dps);
      const arr = res[0].dps
        .filter(item => +item.value !== 0)
        .map(item => {
          const { date, time } = splitDateTime(item.timeStr);
          return {
            date,
            time,
            value: getFaultText(+item.value),
          };
        });
      console.log('aaaaa', arr);
      const listA = arr.slice(0, 8);
      console.log('aaaaa', listA);
      setList(listA);
    }
  };

  return (
    <View
      className={styles.page}
      style={{ paddingBottom: `${statusBarHeight}px`, paddingTop: `${statusBarHeight}px` }}
    >
      <View className={styles.topbar}>
        <Image src={Res.goBack} className={styles.backIcon} onClick={handleBack} />
        <Text className={styles.topbarTitle}>{Strings.getLang('fault_records')}</Text>
      </View>
      <View className={styles.list}>
        {list.length > 0 ? (
          list.map((item, index) => (
            <View key={index} className={styles.item}>
              <View className={styles.left}>
                <View className={styles.box}>
                  <Text className={styles.boxText}>{index}</Text>
                </View>
                <View className={styles.valueBox}>
                  <Text className={styles.title}>{item.value}</Text>
                </View>
              </View>
              <View className={styles.right}>
                <Text className={styles.rightText}>{`${item.date}  ${item.time}`}</Text>
                <Image src={Res.setRight} className={styles.rightIcon} />
              </View>
            </View>
          ))
        ) : (
          <View className={styles.empty}>
            <Image src={Res.noDetails} className={styles.emptyImg} />
            <Text className={styles.emptyText}>{Strings.getLang('no_fault_data')}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

export default FaultRecords;
