import { parse, stringify } from 'qs';
import { routerRedux } from 'dva/router';
import {

  getSystemLoginConfigInfo,
} from '@/services/login';
export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}
const LoginModel = {
  namespace: 'login',
  state: {
    status: undefined,
    configInfo: null
  },
  effects: {
    *logout(_, { put }) {
      // debugger;
      const { redirect } = getPageQuery(); // redirect
      // debugger;
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
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      return { ...state, status: payload.status, type: payload.type };
    },
    setConfigInfo(state, { payload }) {
      return { ...state, configInfo: { ...payload } };
    },
  },
};
export default LoginModel;
