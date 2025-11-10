import React from 'react';
import { View, Text, Image, navigateBack, showModal, navigateTo, showToast } from '@ray-js/ray';
import { NavBar, Dialog, DialogInstance } from '@ray-js/smart-ui';
import { useActions, useProps } from '@ray-js/panel-sdk';
import dpCodes from '@/config/dpCodes';
import Strings from '@/i18n';
import Res from '@/res';
import styles from './index.module.less';

const { userSettingCode } = dpCodes;

export function FactorySettings() {
  const actions = useActions();
  const userSettingData = useProps(props => props[userSettingCode]) as string;
  const [inputPassword, setInputPassword] = React.useState('');
  const [showErrorDialog, setShowErrorDialog] = React.useState(false);

  const handleBack = () => navigateBack({ delta: 1 });

  // Monitor device response for password verification
  React.useEffect(() => {
    if (userSettingData && inputPassword) {
      if (userSettingData === inputPassword) {
        // Password correct, navigate to user params
        navigateTo({ url: '/pages/userParams/index' });
      } else {
        // Password incorrect, show error
        setShowErrorDialog(true);
        setTimeout(() => {
          setShowErrorDialog(false);
        }, 3000);
      }
    }
  }, [userSettingData, inputPassword]);

  const handlePasswordConfirm = (password: string) => {
    if (!password) {
      showToast({
        title: '请输入密码',
        icon: 'none',
      });
      return;
    }

    setInputPassword(password);
    // Send password to device for verification
    actions[userSettingCode].set(password);
  };

  const beforeClose = (action: 'confirm' | 'cancel' | 'overlay', value?: string) =>
    new Promise<boolean>(resolve => {
      if (action === 'confirm') {
        if (!value || value.trim() === '') {
          showToast({
            title: '请输入密码',
            icon: 'none',
          });
          resolve(false);
        } else {
          handlePasswordConfirm(value);
          resolve(true);
        }
      } else {
        navigateBack({ delta: 1 });
        resolve(true);
      }
    });

  React.useEffect(() => {
    // Show password input dialog on mount
    DialogInstance.input({
      selector: '#password-dialog',
      title: '工厂设置',
      placeholder: '请输入设备密码',
      cancelButtonText: '取消',
      confirmButtonText: '确定',
      beforeClose,
    }).catch(() => {
      navigateBack({ delta: 1 });
    });
  }, []);

  return (
    <View className={styles.page}>
      <NavBar
        title="工厂设置"
        customStyle={
          { backgroundColor: '#f5f5f5', '--nav-bar-title-text-color': '#333' } as any
        }
        slot={{
          left: (
            <View className={styles.iconWrap} onClick={handleBack}>
              <Image src={Res.arrow_left} className={styles.navBarIcon} />
            </View>
          ),
        }}
      />
      
      <View className={styles.content}>
        <Text className={styles.message}>
          请输入设备密码以访问工厂设置
        </Text>
      </View>

      {/* Error Dialog */}
      {showErrorDialog && (
        <View className={styles.errorOverlay}>
          <View className={styles.errorDialog}>
            <View className={styles.errorIcon}>
              <Text className={styles.errorIconText}>!</Text>
            </View>
            <Text className={styles.errorTitle}>密码错误!</Text>
          </View>
        </View>
      )}
      
      <Dialog id="password-dialog" />
    </View>
  );
}

export default FactorySettings;
