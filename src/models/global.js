import { queryNotices } from '@/services/user';
import { getBtnAuthority } from '../services/baseapi';
const GlobalModel = {
  namespace: 'global',
  state: {
    collapsed: false,
    notices: [],
    btnsAuthority: [],
    changePwdVisible: false,
  },
  effects: {
    *fetchNotices(_, { call, put, select }) {
      const data = yield call(queryNotices);
      yield put({
        type: 'saveNotices',
        payload: data,
      });
      const unreadCount = yield select(
        state => state.global.notices.filter(item => !item.read).length,
      );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: data.length,
          unreadCount,
        },
      });
    },

    *clearNotices({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count = yield select(state => state.global.notices.length);
      const unreadCount = yield select(
        state => state.global.notices.filter(item => !item.read).length,
      );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: count,
          unreadCount,
        },
      });
    },

    *changeNoticeReadState({ payload }, { put, select }) {
      const notices = yield select(state =>
        state.global.notices.map(item => {
          const notice = { ...item };

          if (notice.id === payload) {
            notice.read = true;
          }

          return notice;
        }),
      );
      yield put({
        type: 'saveNotices',
        payload: notices,
      });
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: notices.length,
          unreadCount: notices.filter(item => !item.read).length,
        },
      });
    },
    // 获取按钮权限
    *getBtnAuthority({ payload }, { call, put, select }) {
      // const menuCode = yield select(state => state.menu.menuCode);
      const result = yield call(getBtnAuthority, payload);
      if (result.IsSuccess) {
        const btnsAuthority = result.Datas.map(item => item.Code);
        console.log('btnsAuthority=', btnsAuthority);
        yield put({
          type: 'updateState',
          payload: {
            btnsAuthority,
          },
        });
        // yield update({
        //   btnsAuthority
        // })
      }
    },
    // 获取按钮权限
    *changePwdModal({ payload }, { call, put, select }) {
      // const menuCode = yield select(state => state.menu.menuCode);
      yield put({
        type: 'updateState',
        payload: {
          changePwdVisible: true,
        },
      });
    },
  },
  reducers: {
    changeLayoutCollapsed(
      state = {
        notices: [],
        collapsed: true,
      },
      { payload },
    ) {
      return { ...state, collapsed: payload };
    },

    saveNotices(state, { payload }) {
      return {
        collapsed: false,
        ...state,
        notices: payload,
      };
    },

    saveClearedNotices(
      state = {
        notices: [],
        collapsed: true,
      },
      { payload },
    ) {
      return {
        collapsed: false,
        ...state,
        notices: state.notices.filter(item => item.type !== payload),
      };
    },

    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
export default GlobalModel;
