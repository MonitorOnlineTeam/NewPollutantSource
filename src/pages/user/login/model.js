/**
 * 
 * 废弃model
 */
// import { routerRedux } from 'dva/router';
import router from 'umi/router';
import Cookie from 'js-cookie';
import { message } from 'antd';
import { systemLogin, getFakeCaptcha, getSystemLoginConfigInfo, PostMessageCode, getToken, } from './service';
import { getPageQuery, setAuthority } from './utils/utils';
import configToken from '@/config';
const Model = {
  namespace: 'userLogin',
  state: {
    status: undefined,
    configInfo: null,
    isAgree: true,
    loginLoading: false
  },
  effects: {
    *login({ payload, callback }, { call, put, update, select }) {
      yield put({ type: 'changeLoginLoading', payload: { loginLoading: true }, });
      const response = yield call(systemLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: response.IsSuccess ? 'ok' : 'error',
          type: 'account',
          message: response.Message,
        },
      });
      if (response.IsSuccess) {
        // 后台新框架获取token 正常登录
        const tokenResponse = yield call(getToken, {
          username: payload.userName,
          password: payload.password,
        });
        if (tokenResponse.access_token) {
          yield put({ type: 'changeLoginLoading', payload: { loginLoading: false }, });
          Cookie.set(configToken.cookieName, tokenResponse.access_token);
          //大屏
          if (payload.redirctUrl) {
            router.push(payload.redirctUrl);
            return;
          }
          if (!(response.Datas && response.Datas.Complexity)) {
            //判断密码复杂程度
            yield put({
              type: 'changeLoginStatus',
              payload: { status: 'error', type: 'account', message: '密码过于简单，请修改密码！' },
            });
            setTimeout(() => {
              router.push('/user/changePassword');
            }, 1500);
            return;
          }
          response.Datas.User_ID = response.Datas.UserId;
          let defaultNavigateUrl = '/user/login';
          let systemNavigateUrl = '/'; //之前首页需要用到的首页默认路径
          if (response.Datas.MenuDatas?.[0]) {
            const sysList = response.Datas.MenuDatas[0]; //默认展示和选中第一个系统
            // sessionStorage.setItem('sysMenuId', sysList.id);
            Cookie.set('sysMenuId', sysList.id);
            const meunList = sysList.children;
            defaultNavigateUrl = meunList?.[0]?.NavigateUrl
            if (meunList?.[0]?.children?.[0]?.children?.[0]) { //三级菜单
              defaultNavigateUrl = meunList[0].children[0].children[0].NavigateUrl
            } else if (meunList?.[0]?.children?.[0]) {//二级菜单
              defaultNavigateUrl = meunList[0].children[0].NavigateUrl
            } else if (meunList?.[0]) {//一级菜单
              defaultNavigateUrl = meunList[0].NavigateUrl
            }
            //右上角系统列表
            const systemList = response.Datas.MenuDatas.map(item => ({ ...item, ID: item.id, Name: item.name, id: undefined, name: undefined, children: undefined }));
            // sessionStorage.setItem('sysList', systemList?.length > 0 ? JSON.stringify(systemList) : []);
            Cookie.set('sysList', systemList?.length > 0 ? JSON.stringify(systemList) : []);
            callback && callback(response.IsSuccess);
            //进入系统
            router.push(defaultNavigateUrl);
            //生成菜单数组保存 清空路由和路由权限使用
            function getMeun(meun) {
              const meunArr = [];
              const meunData = data => {
                if (data?.length > 0) { data.map(item => { meunArr.push(item.path); meunData(item.children); }); }
                return meunArr;
              };
              const meunList = meunData(meun);
              sessionStorage.setItem('menuDatas', meunList?.length > 0 ? JSON.stringify(meunList) : '');
            }
            getMeun(meunList)
            delete response.Datas.MenuDatas;
            delete response.Datas.DepIds;
            Cookie.set('currentUser', JSON.stringify(response.Datas));
            Cookie.set('defaultNavigateUrl', defaultNavigateUrl);
            Cookie.set('systemNavigateUrl', systemNavigateUrl);

          }
        } else {  //token获取失败
          Cookie.set(configToken.cookieName, '');
          yield put({ type: 'changeLoginLoading', payload: { loginLoading: false }, });
        }
      } else {  //登录获取失败
        callback && callback(response.IsSuccess);
        yield put({ type: 'changeLoginLoading', payload: { loginLoading: false }, });
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
    *postMessageCode({ payload, callback }, { call, put }) {
      const response = yield call(PostMessageCode, payload);

      if (response.IsSuccess) {
        message.success('发送成功');
      } else {
        message.error(response.Message);
      }
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
    },
    changeLoginLoading(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
export default Model;
