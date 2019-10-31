// import { routerRedux } from 'dva/router';
import router from 'umi/router';
import Cookie from 'js-cookie';
import { message } from 'antd';
import { systemLogin, getFakeCaptcha, getSystemLoginConfigInfo } from './service';
import { getPageQuery, setAuthority } from './utils/utils';
const Model = {
  namespace: 'userLogin',
  state: {
    status: undefined,
    configInfo: null
  },
  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(systemLogin, payload);

      yield put({
        type: 'changeLoginStatus',
        payload: { status: response.IsSuccess ? 'ok' : 'error', type: 'account' },
      });

      if (response.IsSuccess) {
        response.Datas.User_ID = response.Datas.UserId;
        delete response.Datas.MenuDatas;
        Cookie.set('currentUser', JSON.stringify(response.Datas));
        try {
          const { ws } = window;
          ws.send(response.Datas.UserAccount);
        } catch (error) {

        }
        router.push('/');
      }
    },

    *getSystemLoginConfigInfo({ payload }, { call, put }) {

      const response = yield call(getSystemLoginConfigInfo);
     
      if (response.IsSuccess) {
        yield put({
          type: 'setConfigInfo',
          payload: response.Datas,
        });
      }
    },
    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      //setAuthority(payload.currentAuthority);
      //;
      return { ...state, status: payload.status, type: payload.type };
    },
    setConfigInfo(state, { payload }) {
      return { ...state, configInfo: { ...payload } };
    }
  },
};
export default Model;
