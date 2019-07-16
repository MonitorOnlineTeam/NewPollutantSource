import router from 'umi/router';
import { queryCurrent, query as queryUsers, getMenuData,getUserInfo } from '@/services/user';
import Cookie from 'js-cookie';
import { message } from 'antd';
import { isUrl } from '@/utils/utils';

// const UserModel = {
//   namespace: 'user',
//   state: {
//     currentUser: {},
//   },
//   effects: {
//     *fetch(_, { call, put }) {
//       const response = yield call(queryUsers);
//       yield put({
//         type: 'save',
//         payload: response,
//       });
//     },

//     *fetchCurrent(_, { call, put }) {
//       // const response = yield call(queryCurrent);
//       // yield put({
//       //   type: 'saveCurrentUser',
//       //   payload: response,
//       // });
//       debugger;
//       let currentUser = Cookie.get('token');
//       if (currentUser) {
//         const user = JSON.parse(currentUser);
//         const response = yield call(getMenuData);
//         debugger;
//         // if (responseMenu.requstresult === '1') {
//         //   const cMenu = yield call(formatter, responseMenu.data);
//         //   yield put({
//         //     type: 'saveCurrentUser',
//         //     payload: {
//         //       currentUser: user,
//         //       currentMenu: cMenu
//         //     },
//         //   });
//         // } else {
//         //   message.info('菜单获取失败，请联系系统管理员！');
//         //   yield put({
//         //     type: 'login/logout',
//         //   });
//         // }
//       }
//     },
//   },
//   reducers: {
//     saveCurrentUser(state, action) {
//       return { ...state, currentUser: action.payload || {} };
//     },

//     changeNotifyCount(
//       state = {
//         currentUser: {},
//       },
//       action,
//     ) {
//       return {
//         ...state,
//         currentUser: {
//           ...state.currentUser,
//           notifyCount: action.payload.totalCount,
//           unreadCount: action.payload.unreadCount,
//         },
//       };
//     },
//   },
// };
// export default UserModel;



function formatter(data, parentPath = '') {
  if (data && data.length > 0) {
    return data.map((item) => {
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

export default {
  namespace: 'user',

  state: {
    list: [],
    loading: false,
    currentUser: {},
    changepwdRes: '',
    currentMenu: []
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
        // debugger;
        if (response.IsSuccess) {
          const cMenu = yield call(formatter, response.Datas);
          yield put({
            type: 'saveCurrentUser',
            payload: {
              currentUser: currentUser,
              currentMenu: cMenu
            },
          });
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
    * getUserInfo({
        payload
    }, {
        call,
        update,
    }) {
        const result = yield call(getUserInfo, {
            ...payload
        });
        yield update({
            requstresult: result.requstresult,
            editUser: result.data[0]
        });
        payload.callback();
    }

  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        ...action.payload
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
    }
  },
};
