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
    configInfo: null,
    isAgree: true,
    loginLoading: false,
  },
  effects: {
    *login({ payload, callback }, { call, put, select, take }) {
      // const configInfo = yield select(state => state.global.configInfo)
      const response = yield call(systemLogin, {
        ...payload,
        MenuId: '0', //子系统ID 固定  污染源在线监控
        // MenuId: configInfo.IsShowSysPage === '1' ? '' : '99dbc722-033f-481a-932a-3c6436e17245', //子系统ID 固定  污染源在线监控
        // MenuId: configInfo.IsShowSysPage === '1' ? '' : '5cd1884a-3f42-426f-8893-5cae720bddf3', //子系统ID 固定  污染源在线监控
      });
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: response.IsSuccess ? 'ok' : 'error',
          type: 'account',
          message: response.Message,
        },
      });
      yield put({ type: 'changeLoginLoading', payload: { loginLoading: true } });
      if (response.IsSuccess) {
        // 后台新框架获取token 正常登录
        const tokenResponse = yield call(getToken, {
          grant_type: 'password',
          username: payload.userName,
          password: payload.password,
        });
        if (tokenResponse.access_token) {
          yield put({ type: 'changeLoginLoading', payload: { loginLoading: false } });
          //大屏
          if (payload.redirctUrl) {
            router.push(payload.redirctUrl);
            return;
          }
          // if (!(response.Datas && response.Datas.Complexity)) {
          //   //判断密码复杂程度
          //   yield put({
          //     type: 'changeLoginStatus',
          //     payload: { status: 'error', type: 'account', message: '密码过于简单，请修改密码！' },
          //   });
          //   setTimeout(() => {
          //     router.push('/user/changePassword');
          //   }, 1500);
          //   return;
          // }
          response.Datas.User_ID = response.Datas.UserId;
          let defaultNavigateUrl = '/user/login';
          let systemNavigateUrl = '/'; //之前首页需要用到的首页默认路径
          if (response.Datas.MenuDatas?.[0]) {
            const sysList = response.Datas.MenuDatas[0]; //默认展示和选中第一个系统
            const meunList = sysList.children;
            defaultNavigateUrl = meunList?.[0]?.NavigateUrl;
            if (meunList?.[0]?.children?.[0]?.children?.[0]) {
              //三级菜单
              defaultNavigateUrl = meunList[0].children[0].children[0].NavigateUrl;
            } else if (meunList?.[0]?.children?.[0]) {
              //二级菜单
              defaultNavigateUrl = meunList[0].children[0].NavigateUrl;
            } else if (meunList?.[0]) {
              //一级菜单
              defaultNavigateUrl = meunList[0].NavigateUrl;
            }
            //右上角系统列表
            const systemList = response.Datas.MenuDatas.map(item => ({
              ...item,
              ID: item.id,
              Name: item.name,
              id: undefined,
              name: undefined,
              children: undefined,
            }));
            Cookie.set('sysList', systemList?.length > 0 ? JSON.stringify(systemList) : []);

            callback && callback(response.IsSuccess);
            //生成菜单数组保存 清空路由和路由权限使用
            function getMeun(meun) {
              const meunArr = [];
              const meunData = data => {
                if (data?.length > 0) {
                  data.map(item => {
                    meunArr.push(item.path);
                    meunData(item.children);
                  });
                }
                return meunArr;
              };
              const meunList = meunData(meun);
              sessionStorage.setItem(
                'menuDatas',
                meunList?.length > 0 ? JSON.stringify(meunList) : '',
              );
            }
            getMeun(meunList);
            let desc = response.Datas.MenuDatas[0].desc;
            delete response.Datas.MenuDatas;
            delete response.Datas.DepIds;
            Cookie.set('currentUser', JSON.stringify(response.Datas));
            sessionStorage.setItem('defaultNavigateUrl', defaultNavigateUrl);
            // Cookie.set('defaultNavigateUrl', defaultNavigateUrl);
            Cookie.set('systemNavigateUrl', systemNavigateUrl);
            //进入系统，运维系统不跳转中间页
            if (configInfo.IsShowSysPage === '1') {
              router.push('/sysTypeMiddlePage');
            } else {
              sessionStorage.setItem('sysMenuId', sysList.id);
              // 找到系统默认污染物
              let matches = desc.match(/\(([^)]+)\)/);
              if (matches) {
                let contentInParentheses = matches[1];
                sessionStorage.setItem('sysPollutantCodes', contentInParentheses);
              }

              // Cookie.set('sysMenuId', sysList.id);
              router.push(defaultNavigateUrl);
            }
          }
        } else {
          //token获取失败
          yield put({ type: 'changeLoginLoading', payload: { loginLoading: false } });
        }
      } else {
        //登录获取失败
        yield put({ type: 'changeLoginLoading', payload: { loginLoading: false } });
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
        payload: {
          status: response.IsSuccess ? 'ok' : 'error',
          type: 'account',
          mobileMessage: response.Message,
        },
      });
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      //setAuthority(payload.currentAuthority);
      //;
      return { ...state, ...payload };
    },
    changeLoginLoading(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
export default Model;
