import React, { Component, useEffect } from 'react';
import { Provider } from 'react-redux';
import { getSystemInfoSync, hideMenuButton } from '@ray-js/ray';
import { devices, dpKit } from './devices';
import { updateThemeType } from './redux/modules/themeSlice';
import { initializeSystemInfo } from './redux/modules/systemInfoSlice';
import store from './redux';
import './styles/index.less';

interface Props {
  devInfo: DevInfo;
  // eslint-disable-next-line react/require-default-props
  extraInfo?: Record<string, any>;
}

interface State {
  devInfo: DevInfo;
}

const composeLayout = (SubComp: React.ComponentType<any>) => {
  const { dispatch } = store;
  return class PanelComponent extends Component<Props, State> {
    async onLaunch(object: any) {
      console.log('=== App onLaunch', object);
      devices.common.init();
      devices.common.onInitialized(device => dpKit.init(device));
      const systemInfo = getSystemInfoSync();
      const { theme } = systemInfo;

      dispatch(initializeSystemInfo(systemInfo));
      dispatch(updateThemeType(theme));

      // 隐藏右上角胶囊按钮（… 和 X），全局生效
      try {
        hideMenuButton();
      } catch (err) {
        console.warn('隐藏菜单按钮失败', err);
      }
    }

    render() {
      const { extraInfo } = this.props;
      return (
        <Provider store={store}>
          {/* @ts-ignore */}
          <SubComp extraInfo={extraInfo} {...this.props} />
        </Provider>
      );
    }
  };
};

export default composeLayout;
