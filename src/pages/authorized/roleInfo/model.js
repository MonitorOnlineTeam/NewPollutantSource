import Model from '@/utils/model';
import {
  getroleinfobytree,
  getroleinfobyid,
  insertroleinfo,
  delroleinfo,
  updroleinfo,
  getrolestreeandobj,
  getalluser,
  getuserbyroleid,
  insertrolebyuser,
  getparenttree,
  getrolemenutree,
  getmenubyroleid,
  insertmenubyroleid,
  addSetLongInAppRole,
  getSetLongInAppRoleId,
  addSetRole,
  getSetRoleId,
  GetSetExpertRoleId,
  AddSetExpertRole,
  GetSetManagerRole,
  AddSetManagerRole,
  GetViewRoleList,
  AddViewRole,
} from './service';
import { message } from 'antd';
import { downloadFile, requestPost } from '@/utils/utils';
import { API } from '@config/API';
// 递归函数返回一个新的数组，并删除空的 children 属性
function removeEmptyChildren(arr) {
  return arr.map(item => {
    const newItem = { ...item };
    if (newItem.children) {
      newItem.children = removeEmptyChildren(newItem.children);
      if (newItem.children.length === 0) {
        delete newItem.children;
      }
    }
    return newItem;
  });
}
function collectMenuButtons(objArray) {
  const menuButtons = [];

  // 递归函数用来遍历对象数组
  function traverse(data) {
    if (Array.isArray(data)) { // 如果当前项是数组
      data.forEach(item => {
        traverse(item); // 继续递归
      });
    } else if (typeof data === 'object' && data !== null) { // 如果当前项是对象
      if (Array.isArray(data.Menu_Button)) { // 检查是否有Menu_Button数组
        menuButtons.push(...data.Menu_Button); // 合并Menu_Button数组
      }
      if (data.children) { // 如果有children属性，则继续递归
        traverse(data.children);
      }
    }
  }

  traverse(objArray); // 从顶层对象数组开始递归
  return menuButtons; // 返回收集到的所有Menu_Button对象数组
}

/*
用户管理相关接口
add by lzp
modify by
*/
export default Model.extend({
  namespace: 'roleinfo',

  state: {
    RoleInfoTree: [],
    RoleInfoOne: [],
    RolesTree: [],
    AllUser: [],
    UserByRoleID: [],
    SelectMenu: [],
    MenuTree: [],
    CheckMenu: [],
    setRegOrAppRoleId: [],
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => { });
    },
  },

  effects: {
    /*获取角色详细信息及层级关系**/
    *getroleinfobytree({ payload }, { call, update }) {
      const result = yield call(getroleinfobytree, { ...payload });
      if (result.IsSuccess) {
        yield update({
          RoleInfoTree: result.Datas,
        });
      }
    },
    /*获取单个角色信息**/
    *getroleinfobyid({ payload }, { call, put, update }) {
      const result = yield call(getroleinfobyid, {
        ...payload,
      });
      if (result.IsSuccess) {
        yield update({
          RoleInfoOne: result.Datas,
        });
      }
    },
    /*新增角色信息**/
    *insertroleinfo({ payload }, { call, put, update }) {
      const result = yield call(insertroleinfo, {
        ...payload,
      });
      payload.callback(result);
    },
    /*删除角色信息**/
    *delroleinfo({ payload }, { call, update }) {
      const result = yield call(delroleinfo, {
        Roles_ID: payload.Roles_ID,
      });
      // if (result.IsSuccess) {
      //     message.success("删除成功");
      //     yield put({
      //         type: "roleinfo/getroleinfobytree",
      //         payload: {
      //         }
      //     })
      // }
      payload.callback(result);
    },
    /*修改角色信息**/
    *updroleinfo({ payload }, { call, update }) {
      const result = yield call(updroleinfo, {
        ...payload,
      });
      // if (result.IsSuccess) {
      //     message.success("修改成功");
      //     yield put({
      //         type: "roleinfo/getroleinfobytree",
      //         payload: {
      //         }
      //     })
      // }
      payload.callback(result);
    },
    /*获取角色树(带根结点)**/
    *getrolestreeandobj({ payload }, { call, update }) {
      const result = yield call(getrolestreeandobj, {
        ...payload,
      });
      if (result.IsSuccess) {
        yield update({
          RolesTree: result.Datas,
        });
      }
    },
    /*获取所有用户**/
    *getalluser({ payload }, { call, update }) {
      const result = yield call(getalluser, {
        ...payload,
      });
      if (result.IsSuccess) {
        yield update({
          AllUser: result.Datas,
        });
      }
    },
    /*获取当前角色的用户**/
    *getuserbyroleid({ payload }, { call, update }) {
      const result = yield call(getuserbyroleid, {
        ...payload,
      });
      if (result.IsSuccess) {
        yield update({
          UserByRoleID: result.Datas,
        });
      }
    },
    /*给角色添加用户（可批量）**/
    *insertrolebyuser({ payload }, { call, update }) {
      const result = yield call(insertrolebyuser, {
        ...payload,
      });
    },
    /*获取下拉菜单权限**/
    *getparenttree({ payload }, { call, update }) {
      const result = yield call(getparenttree, {
        ...payload,
      });
      if (result.IsSuccess) {
        // let SelectMenu = result.Datas.filter(item => item.TipsName.indexOf('ReactShow') > -1);
        let SelectMenu = result.Datas;
        // SelectMenu.unshift({
        //   ID: '0',
        //   Name: '全部',
        //   TipsName: '全部',
        // });
        yield update({
          SelectMenu: SelectMenu,
        });
      }
    },
    /*获取菜单列表层级关系**/
    *getrolemenutree({ payload, callback }, { call, update }) {
      const result = yield call(getrolemenutree, { ...payload });
      if (result.IsSuccess) {
        let newData = removeEmptyChildren(result.Datas);
        // console.log('newData', newData);
        // console.log(collectMenuButtons(newData))
        yield update({
          MenuTree: removeEmptyChildren(result.Datas),
        });
        callback && callback(collectMenuButtons(newData)) //所有的权限按钮
      }
    },
    /*获取当前角色的菜单**/
    *getmenubyroleid({ payload }, { call, update }) {
      const result = yield call(getmenubyroleid, {
        ...payload,
      });
      if (result.IsSuccess) {
        yield update({
          CheckMenu: result.Datas,
        });
      } else {
        result.Message && message.error(result.Message);
      }
    },
    /*给角色添加菜单权限（可批量）**/
    *insertmenubyroleid({ payload }, { call, update }) {
      const result = yield call(insertmenubyroleid, {
        ...payload,
      });
      payload.callback(result);
    },
    *addSetRegOrAppRole({ payload, callback }, { call, put, update }) {
      //设置角色 1行政区 2运维App
      yield update({ tableLoading: true });

      let serviceApi = '';
      switch (payload.type) {
        case 1: // 1行政区
          serviceApi = addSetRole;
          break;
        case 2: // 2运维App
          serviceApi = addSetLongInAppRole;
          break;
        case 3: // 3业务专家
          serviceApi = AddSetExpertRole;
          break;
       case 4: case 5: case 6: // 管理员角色
          serviceApi = AddSetManagerRole;
          break;
          case 7: // 设置角色可访问角色权限
          serviceApi = AddViewRole;
          break;
      }
      const result = yield call(serviceApi, {
        ...payload,
        type:  payload.mangerType || undefined,
        mangerType:undefined,
      });
      if (result.IsSuccess) {
        message.success(result.Message);
        callback && callback();
      } else {
        result.Message && message.error(result.Message);
      }
    },
    *getSetRegOrAppRoleId({ payload, callback }, { call, put, update }) {
      //获取设置角色 1行政区 2运维App 3业务专家
      yield update({ tableLoading: true });

      let serviceApi = '';
      switch (payload.type) {
        case 1: // 1行政区
          serviceApi = getSetRoleId;
          break;
        case 2: // 2运维App
          serviceApi = getSetLongInAppRoleId;
          break;
        case 3: // 3业务专家
          serviceApi = GetSetExpertRoleId;
          break;
        case 4: case 5: case 6: // 管理员角色
          serviceApi = GetSetManagerRole;
          break;
          case 7 :
          serviceApi = GetViewRoleList;
          break;
      }
      const result = yield call(serviceApi, {
        ...payload,
        type:  payload.mangerType || undefined,
        mangerType:undefined,
      });
      if (result.IsSuccess) {
        yield update({
          setRegOrAppRoleId: result.Datas || [],
        });
        callback && callback(result.Datas || []);
      } else {
        result.Message && message.error(result.Message);
      }
    },
    *GetRolePushInfo({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.AssetManagementApi.GetRolePushInfo, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      }
    },
    *UpdPushInfo({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.AssetManagementApi.UpdPushInfo, payload);
      if (result.IsSuccess) {
        message.success(result.Message);
      }
      callback && callback(result.IsSuccess);
    },









  },
  reducers: {},
});
