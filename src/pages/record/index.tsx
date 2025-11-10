import React, { useEffect, useState } from 'react';
import { View, Text, Image, navigateBack, getDevInfo } from '@ray-js/ray';
import { NavBar } from '@ray-js/smart-ui';
import { IconFont, BottomTab } from '@/components';
import Strings from '@/i18n';
import Res from '@/res';
import dpCodes from '@/config/dpCodes';
import styles from './index.module.less';

export function Record() {
  const [data, setData] = useState<
    {
      date: string;
      items: { time: string; action: string }[];
    }[]
  >([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const { devId, codeIds } = getDevInfo();
        const dpId = codeIds[dpCodes.controlCode] || 1;
        const startTime = Date.now() - 7 * 24 * 60 * 60 * 1000;
        const endTime = Date.now();
        const res = await (ty as any).getAnalyticsLogsStatusLog({
          devId,
          dpIds: String(dpId),
          offset: 0,
          limit: 100,
          startTime,
          endTime,
          queryType: 1,
          sortType: 'ASC',
        });

        const groups: Record<string, { time: string; action: string }[]> = {};
        const actionMap: Record<string, string> = {
          open: Strings.getLang('remote_status_open'),
          close: Strings.getLang('remote_status_close'),
          stop: Strings.getLang('remote_status_stop'),
        };
        res?.dps?.forEach((item: any) => {
          const [d, t] = (item.timeStr || '').split(' ');
          if (!d || !t) return;
          const date = d.replace(/-/g, '/');
          const action = actionMap[item.value] || String(item.value);
          if (!groups[date]) groups[date] = [];
          groups[date].push({ time: t, action });
        });
        const list = Object.keys(groups)
          .sort((a, b) => (a > b ? -1 : 1))
          .map(date => ({ date, items: groups[date] }));
        setData(list);
      } catch (e: any) {
        console.error(e);
        setError(e?.errorMsg || e?.message || Strings.getLang('record_cloud_error'));
      }
    };
    fetchLogs();
  }, []);

  return (
    <View className={styles.page}>
      <NavBar
        title="历史记录"
        customStyle={
          { backgroundColor: 'transparent', '--nav-bar-title-text-color': '#fff' } as any
        }
        slot={{
          right: (
            <View className={styles.iconWrap}>
              <IconFont icon="more" style={{ fontSize: '48rpx', color: '#fff' }} />
            </View>
          ),
          left: (
            <View className={styles.iconWrap}>
              <Image src={Res.arrow_left} className={styles.navBarIcon} />
            </View>
          ),
        }}
        onClickLeft={() => navigateBack({ delta: 1 })}
      />

      <View className={styles.content}>
        {error ? (
          <View className={styles.errorMessage}>
            <Text>{error}</Text>
          </View>
        ) : (
          data.map(group => (
            <View key={group.date} className={styles.group}>
              <View className={styles.dateWrapper}>
                <Text style={{ color: '#FFFFFF', fontSize: '28rpx', fontWeight: '500' }}>
                  {group.date}
                </Text>
              </View>
              <View className={styles.card}>
                {group.items.map((item, idx) => (
                  <View key={idx} className={styles.recordItem}>
                    <View className={styles.timeWrapper}>
                      <Text style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '32rpx' }}>
                        {item.time}
                      </Text>
                    </View>
                    <View className={styles.actionWrapper}>
                      <Text style={{ color: 'rgba(255, 255, 255, 0.86)', fontSize: '32rpx' }}>
                        {item.action}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ))
        )}
      </View>

      <BottomTab activeTab={0} />
    </View>
  );
}

export default Record;
