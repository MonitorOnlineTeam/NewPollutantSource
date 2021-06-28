// import { routerRedux } from 'dva/router';
import router from 'umi/router';
import Cookie from 'js-cookie';
import { message } from 'antd';
import { systemLogin, getFakeCaptcha, getSystemLoginConfigInfo, getFirstMenu } from './service';
import { getPageQuery, setAuthority, getDefaultNavigateUrl } from './utils/utils';
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
        payload: { status: response.IsSuccess ? 'ok' : 'error', type: 'account', message: response.Message },
      });

      if (response.IsSuccess) {
        response.Datas.User_ID = response.Datas.UserId;
        delete response.Datas.MenuDatas;
        delete response.Datas.Ticket;
        delete response.Datas.RoleIds;
        Cookie.set('currentUser', JSON.stringify(response.Datas));

        try {
          const { ws } = window;
          ws.send(response.Datas.UserAccount);
        } catch (error) {

        }
        //大屏
        if (payload.redirctUrl) {
          router.push('/homepage');
          return;
          //defaultNavigateUrl = payload.redirctUrl;
        }

        yield put({
          type: 'getFirstMenu',
          payload: {},
        });
        // router.push('/');
        // router.push(defaultNavigateUrl);
      }
    },

    *getFirstMenu({ payload }, { call, put }) {
      const response = yield call(getFirstMenu);
      if (response.IsSuccess) {
        let defaultNavigateUrl = getDefaultNavigateUrl([response.Datas[0]])
        console.log('defaultNavigateUrl=', defaultNavigateUrl)
        Cookie.set('defaultNavigateUrl', defaultNavigateUrl);
        Cookie.set('systemNavigateUrl', defaultNavigateUrl);
        router.push(defaultNavigateUrl);
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
      return { ...state, ...payload };
    },
    setConfigInfo(state, { payload }) {
      return { ...state, configInfo: { ...payload } };
    }
  },
};
export default Model;
