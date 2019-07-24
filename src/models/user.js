import router from 'umi/router';
import {
  queryCurrent,
  query as queryUsers,
  getMenuData,
  getUserInfo,
  editpersonaluser,
  getSystemConfigInfo,
} from '@/services/user';
import Cookie from 'js-cookie';
import { message } from 'antd';
import { isUrl } from '@/utils/utils';
import Model from '@/utils/model';

function formatter(data, parentPath = '') {
  if (data && data.length > 0) {
    return data.map(item => {
      let { path } = item;
      if (!isUrl(path)) {
        path = parentPath + item.path;
      }
      const result = {
        ...item,
        path,
      };
      if (item.children) {
        result.children = formatter(item.children, `${parentPath}${item.path}/`);
      }
      return result;
    });
  }
  return [];
}

export default Model.extend({
  namespace: 'user',

  state: {
    list: [],
    loading: false,
    currentUser: {},
    changepwdRes: '',
    currentMenu: [],
    editUser: null,
  },

  effects: {
    *fetch(_, { call, put }) {
      // const response = yield call(queryUsers);
      // yield put({
      //     type: 'save',
      //     payload: response,
      // });
    },
    *fetchCurrent(_, { call, put }) {
      let currentUser = Cookie.get('currentUser');
      if (currentUser) {
        const currentUser = JSON.parse(Cookie.get('currentUser'));

        const response = yield call(getMenuData);
        // ;
        if (response.IsSuccess) {
          const cMenu = yield call(formatter, response.Datas);
          yield put({
            type: 'saveCurrentUser',
            payload: {
              currentUser: currentUser,
              currentMenu: cMenu,
            },
          });
        } else {
          message.info('菜单获取失败，请联系系统管理员！');
        }
        // if (responseMenu.requstresult === '1') {
        //     const cMenu = yield call(formatter, responseMenu.data);
        //     yield put({
        //         type: 'saveCurrentUser',
        //         payload: {
        //             currentUser: currentUser,
        //             currentMenu: cMenu
        //         },
        //     });
        // } else {
        //     message.info('菜单获取失败，请联系系统管理员！');
        //     yield put({
        //         type: 'login/logout',
        //     });
        // }
      }
    },
    /*获取单个用户实体**/
    *getUserInfo({ payload }, { call, update }) {
      const result = yield call(getUserInfo, {
        ...payload,
      });
      yield update({
        requstresult: result.requstresult,
        editUser: result.data[0],
      });
      payload.callback();
    },
    /*个人设置编辑信息**/
    *editpersonaluser({ payload }, { call, update }) {
      //debugger
      const result = yield call(editpersonaluser, {
        ...payload,
      });
      debugger;
      yield update({
        requstresult: result.requstresult,
        reason: result.reason,
      });
      payload.callback(result.requstresult === '1');
    },
    //获取登陆信息配置
    *getSystemConfigInfo({ payload }, { put, call, update }) {
      const loginData = yield call(getSystemConfigInfo, { ...payload });
      if (loginData !== null) {
        if (loginData.requstresult === '1') {
          yield update({
            getLoginInfoList: loginData.data,
          });
        }
      }
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
});
