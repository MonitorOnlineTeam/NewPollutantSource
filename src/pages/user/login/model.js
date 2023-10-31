// import { routerRedux } from 'dva/router';
import router from 'umi/router';
import Cookie from 'js-cookie';
import { message } from 'antd';
import { systemLogin, getFakeCaptcha, getSystemLoginConfigInfo, PostMessageCode } from './service';
import { getPageQuery, setAuthority } from './utils/utils';
const Model = {
  namespace: 'userLogin',
  state: {
    status: undefined,
    configInfo: null,
    isAgree: true,
  },
  effects: {
    *login({ payload, callback }, { call, put, update, select }) {
      const response = yield call(systemLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: response.IsSuccess ? 'ok' : 'error',
          type: 'account',
          message: response.Message,
        },
      });
      callback && callback(response.IsSuccess);
      if (response.IsSuccess) {
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
        let systemNavigateUrl = ''; //之前首页需要用到的默认路径
        // if (response.Datas.MenuDatas && response.Datas.MenuDatas.length > 1) {
        //   if (response.Datas.MenuDatas[0].name === '首页') {
        //     systemNavigateUrl = response.Datas.MenuDatas[1].NavigateUrl;
        //   } else {
        //     if (response.Datas.MenuDatas[0].children.length) {
        //       systemNavigateUrl = response.Datas.MenuDatas[0].children[0].NavigateUrl;
        //     } else {
        //       systemNavigateUrl = response.Datas.MenuDatas[1].NavigateUrl;
        //     }
        //   }
        // }
        // // defaultNavigateUrl = response.Datas.MenuDatas[0].children && response.Datas.MenuDatas[0].children.length ?  response.Datas.MenuDatas[0].children[0].NavigateUrl :response.Datas.MenuDatas[0].NavigateUrl;
        // if (
        //   response.Datas.MenuDatas[0].children &&
        //   response.Datas.MenuDatas[0].children.length &&
        //   response.Datas.MenuDatas[0].children[0].children.length
        // ) {
        //   //三级菜单
        //   defaultNavigateUrl = response.Datas.MenuDatas[0].children[0].children[0].NavigateUrl;
        // } else if (
        //   response.Datas.MenuDatas[0].children &&
        //   response.Datas.MenuDatas[0].children.length
        // ) {
        //   //二级菜单
        //   defaultNavigateUrl = response.Datas.MenuDatas[0].children[0].NavigateUrl;
        // } else {
        //   defaultNavigateUrl = response.Datas.MenuDatas[0].NavigateUrl;
        // }
        if(response.Datas.MenuDatas?.[0]?.parentId=='0'){
          const sysList =  response.Datas.MenuDatas[0]; //默认展示和选中第一个系统
          sessionStorage.setItem('sysMenuId',sysList.id)
          const meunList = sysList.children;
          defaultNavigateUrl = meunList?.[0]?.NavigateUrl
          if(meunList?.[0]?.children?.[0]?.children?.[0]){ //三级菜单
            defaultNavigateUrl = meunList[0].children[0].children[0].NavigateUrl
          }else if(meunList?.[0]?.children?.[0]){//二级菜单
            defaultNavigateUrl = meunList[0].children[0].NavigateUrl
          }else if(meunList?.[0]){//一级菜单
            defaultNavigateUrl = meunList[0].NavigateUrl
          }
          const systemList = response.Datas.MenuDatas.map(item=>({...item,ID:item.id,Name:item.name,id:undefined,name:undefined,children:undefined})); //右上角系统列表
          sessionStorage.setItem('sysList', systemList?.length > 0 ? JSON.stringify(systemList) : []);

          getMeun(meunList)

        }
  
        function getMeun (meun){ //清空路由和路由权限使用
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
          sessionStorage.setItem('menuDatas', meunList?.length > 0 ? JSON.stringify(meunList) : '');
        }
  
        delete response.Datas.MenuDatas;
        delete response.Datas.Ticket;
        delete response.Datas.DepIds;
        Cookie.set('currentUser', JSON.stringify(response.Datas));
        Cookie.set('defaultNavigateUrl', defaultNavigateUrl);
        Cookie.set('systemNavigateUrl', systemNavigateUrl);
        try {
          const { ws } = window;
          ws.send(response.Datas.UserAccount);
        } catch (error) {}
        //大屏
        if (payload.redirctUrl) {
          router.push('/newestHome');
          return;
        }
        if (!payload.butRedirct) router.push(defaultNavigateUrl);
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
  },
};
export default Model;
