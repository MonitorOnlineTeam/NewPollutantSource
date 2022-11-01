// import { routerRedux } from 'dva/router';
import router from 'umi/router';
import Cookie from 'js-cookie';
import { message } from 'antd';
import { systemLogin, getFakeCaptcha, getSystemLoginConfigInfo, getToken } from './service';
import { getPageQuery, setAuthority } from './utils/utils';
import configToken from '@/config';
import moment from 'moment';

const Model = {
  namespace: 'userLogin',
  state: {
    status: undefined,
    configInfo: null
  },
  effects: {
    *login({ payload }, { call, put, select, take }) {
      const configInfo = yield select(state => state.global.configInfo)
      const response = yield call(systemLogin, {
        ...payload,
        MenuId: configInfo.IsShowSysPage === '1' ? '' : '99dbc722-033f-481a-932a-3c6436e17245', //子系统ID 固定  污染源在线监控
      });
      yield put({
        type: 'changeLoginStatus',
        payload: { status: response.IsSuccess ? 'ok' : 'error', type: 'account', message: response.Message },
      });

      if (response.IsSuccess) {
        yield put({
          type: 'getToken',
          payload: {
            grant_type: 'password',
            username: payload.userName,
            password: payload.password
          }
        })
        yield take('userLogin/getToken/@@end');
        response.Datas.User_ID = response.Datas.UserId;
        let defaultNavigateUrl = '/user/login';
        let systemNavigateUrl = '';
        if (response.Datas.MenuDatas && response.Datas.MenuDatas.length > 1) {
          if (response.Datas.MenuDatas[0].name === "首页") {
            systemNavigateUrl = response.Datas.MenuDatas[1].NavigateUrl;
          } else {
            if (response.Datas.MenuDatas[0].children.length) {
              systemNavigateUrl = response.Datas.MenuDatas[0].children[0].NavigateUrl;
            } else {
              systemNavigateUrl = response.Datas.MenuDatas[1].NavigateUrl;
            }
          }
          defaultNavigateUrl = response.Datas.MenuDatas[0].children && response.Datas.MenuDatas[0].children.length ? response.Datas.MenuDatas[0].children[0].NavigateUrl : response.Datas.MenuDatas[0].NavigateUrl;
        }
        delete response.Datas.MenuDatas;
        Cookie.set('currentUser', JSON.stringify(response.Datas));
        sessionStorage.setItem("defaultNavigateUrl", defaultNavigateUrl)
        // Cookie.set('defaultNavigateUrl', defaultNavigateUrl);
        Cookie.set('systemNavigateUrl', systemNavigateUrl);
        try {
          const { ws } = window;
          ws.send(response.Datas.userAccount);
        } catch (error) {

        }
        //大屏
        if (payload.redirctUrl) {
          router.push('/homepage');
          return;
          //defaultNavigateUrl = payload.redirctUrl;
        }
        if (configInfo.IsShowSysPage === '1') {
          // 跳转中间页
          router.push('/sysTypeMiddlePage');
        } else {
          router.push(defaultNavigateUrl);
        }
      }
    },
    *getToken({ payload }, { call, put, select }) {
      const result = yield call(getToken, payload);
      if (result) {
        // Cookie.set(configToken.cookieName, result.access_token);
        // window.localStorage.setItem('tokenTime', JSON.stringify({ expires_in: result.expires_in, time: new Date().getTime() }))
      }
    },
    *getCaptcha({ payload }, { call, put }) {
      console.log('payload=', payload);
      let response = yield call(getFakeCaptcha, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: { status: response.IsSuccess ? 'ok' : 'error', type: 'account', mobileMessage: response.Message },
      });
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      //setAuthority(payload.currentAuthority);
      //;
      return { ...state, ...payload };
    },
  },
};
export default Model;
