import router from 'umi/router';
import {
  queryCurrent,
  query as queryUsers,
  getMenuData,
  getUserInfo,
  editpersonaluser,
  getSystemConfigInfo,
  vertifyOldPwd,
  changePwd,
  getAlarmPushAuthor, insertAlarmPushAuthor, getAlarmState,
} from '@/services/user';
import { postAutoFromDataUpdate } from '@/services/autoformapi'
import Cookie from 'js-cookie';
import { message } from 'antd';
import { isUrl , sdlMessage } from '@/utils/utils';
import Model from '@/utils/model';


function formatter(data, parentPath = '') {
  if (data && data.length > 0) {
    return data.map(item => {
      let { path } = item;
      if (!isUrl(path)) {
        path = item.path;
      }
      const result = {
        ...item,
        path,
      };
      if (item.children) {
        result.children = formatter(item.children, `${item.path}/`);
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
    alarmPushParam: {
      pageIndex: 1,
      pageSize: 12,
      total: 0,
      authorId: '',
      flagType: '',
      searchContent: '',
    },
    alarmPushData: [],
    showAlarmState: true,
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
      const currentUser = Cookie.get('currentUser');
      if (currentUser) {
        const currentUser = JSON.parse(Cookie.get('currentUser'));

        const response = yield call(getMenuData);
        // ;
        if (response.IsSuccess) {
          const cMenu = yield call(formatter, response.Datas);
          if (window.location.pathname === '/') {
            router.push(Cookie.get('defaultNavigateUrl'))
          }
          yield put({
            type: 'saveCurrentUser',
            payload: {
              currentUser,
              currentMenu: cMenu,
            },
          });
        } else {
          // message.info('菜单获取失败，请联系系统管理员！');
        }
      }
    },
    * editUserInfo({ payload }, { call, update, put }) {
      console.log(payload);
      const payloaduser = {
        configId: payload.configId,
        FormData: JSON.stringify(payload.FormData),
      };
      const result = yield call(postAutoFromDataUpdate, { ...payloaduser });
      if (result.IsSuccess) {
        sdlMessage(result.Message, 'success');
      } else {
        sdlMessage(result.Message, 'error');
      }
    },
    /*获取单个用户实体* */
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
    /*个人设置编辑信息* */
    *editpersonaluser({ payload }, { call, update }) {
      const result = yield call(editpersonaluser, {
        ...payload,
      });
      yield update({
        requstresult: result.requstresult,
        reason: result.reason,
      });
      payload.callback(result.requstresult === '1');
    },
    // 获取登陆信息配置
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
    *vertifyOldPwd({ payload }, { put, call, update }) {
      const result = yield call(vertifyOldPwd, { pwd: payload.pwd });
      if (result.IsSuccess) {
        // sdlMessage(result.Message, "success");
      } else {
        sdlMessage(result.Message, 'error');
      }
      payload.callback(result);
    },
    *changePwd({ payload }, { put, call, update }) {
      const result = yield call(changePwd, { pwd: payload.pwd });
      if (result.IsSuccess) {
        sdlMessage(result.Message, 'success');
      } else {
        sdlMessage(result.Message, 'error');
      }
    },
    *getAlarmPushAuthor({ payload }, { put, call, update, select }) {
      const { alarmPushParam } = yield select(state => state.user);
      // let body = {
      //   pageIndex: alarmPushParam.pageIndex,
      //   pageSize: alarmPushParam.pageSize,
      //   authorId: alarmPushParam.authorId,
      //   flagType: alarmPushParam.flagType,
      //   searchContent: alarmPushParam.searchContent
      // };

      const result = yield call(getAlarmPushAuthor, alarmPushParam);
      console.log('getAlarmPushAuthor=', result);
      if (result.IsSuccess) {
        yield update({
          alarmPushData: result.Datas,
          alarmPushParam: {
            ...alarmPushParam,
            total: result.Total,
          },
        });
      } else {
        yield update({
          alarmPushData: [],
          alarmPushParam: {
            ...alarmPushParam,
            total: 0,
          },
        });
      }
    },
    *insertAlarmPushAuthor({ payload }, { put, call, update, select }) {
      // let body = {
      //   pageIndex: alarmPushParam.pageIndex,
      //   pageSize: alarmPushParam.pageSize,
      //   authorId: alarmPushParam.authorId,
      //   flagType: alarmPushParam.flagType,
      //   searchContent: alarmPushParam.searchContent
      // };
      const body = {
        Datas: payload,
      };
      const result = yield call(insertAlarmPushAuthor, body);
      console.log('insertAlarmPushAuthor=', result);
      if (result.IsSuccess) {
        sdlMessage('操作成功', 'success');
      } else {
        sdlMessage('操作失败', 'error');
      }
    },
    // 是否显示预警多选框
    *getAlarmState({ payload }, { put, call, update, select }) {
      console.log('123123123')
      const result = yield call(getAlarmState, payload);
      if (result.IsSuccess) {
        yield update({
          showAlarmState: result.Datas,
        })
      } else {
        message.error(result.Message)
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
