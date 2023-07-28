import { parse, stringify } from 'qs';
import { routerRedux } from 'dva/router';
import { getSystemLoginConfigInfo, IfSpecial, newLogin, getToken } from '@/services/login';
export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}
const LoginModel = {
  namespace: 'login',
  state: {
    status: undefined,
    configInfo: null,
    appFlag: '',
  },
  effects: {
    // 后台新框架登录
    *newLogin({ payload, callback }, { call, put }) {
      const response = yield call(newLogin, {
        LoginFlag: 'true',
        MenuId: '',
        RememberMe: true,
        UserAccount: payload.userName,
        UserPwd: payload.password,
      });
      if (response.IsSuccess) {
        // 后台新框架获取token
        yield call(getToken, {
          username: payload.userName,
          password: payload.password,
          callback: callback,
        });
      }
    },
    *logout(_, { put }) {
      const { redirect } = getPageQuery(); // redirect
      if (window.location.pathname !== '/user/login' && !redirect) {
        yield put(
          routerRedux.replace({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          }),
        );
      }
    },
    *getSystemLoginConfigInfo({ payload }, { call, put, select }) {
      const response = yield call(getSystemLoginConfigInfo);
      if (response.IsSuccess) {
        yield put({
          type: 'setConfigInfo',
          payload: response.Datas,
        });
      }
      // const { configInfo } = yield select(m => m.login);
      // console.log("setConfigInfo=", configInfo);
    },
    *IfSpecial({ payload }, { call, put, select }) {
      const response = yield call(IfSpecial);
      yield put({
        type: 'setAppFlagInfo',
        payload: response.Datas,
      });
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      return { ...state, status: payload.status, type: payload.type };
    },
    setConfigInfo(state, { payload }) {
      return { ...state, configInfo: { ...payload } };
    },
    setAppFlagInfo(state, { payload }) {
      return { ...state, appFlag: payload };
    },
  },
};
export default LoginModel;
