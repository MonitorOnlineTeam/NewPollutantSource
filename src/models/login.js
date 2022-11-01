import { parse, stringify } from 'qs';
import { routerRedux } from 'dva/router';
import {

  getSystemLoginConfigInfo,
  IfSpecial,
} from '@/services/login';
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
      console.log('response=', response)
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
