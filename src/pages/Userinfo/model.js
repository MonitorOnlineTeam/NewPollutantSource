import Model from '@/utils/model';
import {
  getList,
  deleteuser,
  enableduser,
  isexistenceuser,
  adduser,
  getuser,
  edituser,
  userDgimnDataFilter,
  editpersonaluser,
  getmypielist,
  mymessagelist,
  setEnterpriseDataRole,
  getEnterpriseDataRoles,
  GetUserInfoListByGroupId,
  GetUserRoleList,
  GetUserRegionList,
  resetPwd,
  CreatUserFiles,
  UploadUserfiles,
  AddUserInfoToLoan,
  GetUserInfoToLoanByUserId,
  GetDepartmentTree,
  GetAllDepartmentTree,
} from './service';
import { message } from 'antd';

export default Model.extend({
  namespace: 'userinfo',

  state: {
    editUser: null,
    requstresult: null,
    list: [],
    edituser: null,
    total: 0,
    loading: false,
    pageSize: 10,
    pageIndex: 1,
    reason: null,
    mypielist: [],
    mymessagelist: [],
    UserAccount: '',
    DeleteMark: '',
    EnterpriseDataRoles: [],
    groupList: [], //部门下人员信息
    userRoleList: [], // 角色信息
    userRegionList: [], //人员行政区
    userWhere: {
      DeleteMark: undefined,
      UserAccount: undefined,
      GroupID: undefined,
      RoleID: undefined,
    },
    dptList: [], //部门
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        // if (location.pathname === '/monitor/sysmanage/userinfo') {
        //     // 初始化testId的值为10
        //     dispatch({
        //         type: 'fetchuserlist',
        //         payload: {
        //         },
        //     });
        // }
      });
    },
  },
  effects: {
    *fetchuserlist({ payload }, { call, put, update, select }) {
      const { userWhere } = yield select(a => a.userinfo);
      const result = yield call(getList, { ...payload, ...userWhere });

      if (result.requstresult === '1') {
        yield update({
          requstresult: result.requstresult,
          list: result.data,
          total: result.total,
          pageIndex: payload.pageIndex,
          pageSize: payload.pageSize,
        });
      } else {
        yield update({
          requstresult: result.requstresult,
          list: [],
          // total: 0,
          // pageIndex: 1,
          // pageSize: 10
        });
      }
    },
    *deleteuser(
      {
        payload: { UserId, pageIndex, pageSize, UserAccount, DeleteMark, callback },
      },
      { call, put, update },
    ) {
      const result = yield call(deleteuser, {
        UserId: UserId,
      });
      yield update({
        requstresult: result.requstresult,
      });

      yield put({
        type: 'fetchuserlist',
        payload: {
          pageIndex,
          pageSize,
          UserAccount,
          DeleteMark,
        },
      });
      callback(result.requstresult);
    },
    *enableduser(
      {
        payload: { UserId, Enalbe, pageIndex, pageSize, UserAccount, DeleteMark, GroupID, RoleID },
      },
      { call, put, update, select },
    ) {
      const result = yield call(enableduser, {
        UserId: UserId,
        Enalbe: Enalbe,
      });
      yield update({
        requstresult: result.requstresult,
      });

      yield put({
        type: 'fetchuserlist',
        payload: {
          pageIndex,
          pageSize,
          UserAccount,
          DeleteMark,
          GroupID,
          RoleID,
        },
      });
    },
    *isexistenceuser(
      {
        payload: { UserAccount, callback },
      },
      { call, put, update, select },
    ) {
      const result = yield call(isexistenceuser, {
        UserAccount: UserAccount,
      });
      yield update({
        requstresult: result.requstresult,
        reason: result.reason,
      });
      callback();
    },
    *adduser(
      {
        payload: {
          UserAccount,
          UserName,
          UserSex,
          Email,
          Phone,
          Title,
          UserOrderby,
          SendPush,
          AlarmType,
          AlarmTime,
          UserRemark,
          DeleteMark,
          RolesId,
          Group_Id,
          PinYin,
          User_Number,
          RegionId,
          RegionName,
          callback,
        },
      },
      { call, put, update, select },
    ) {
      const result = yield call(adduser, {
        UserAccount: UserAccount,
        UserName: UserName,
        UserSex: UserSex,
        Email: Email,
        Phone: Phone,
        Title: Title,
        UserOrderby: UserOrderby,
        SendPush: SendPush,
        AlarmType: AlarmType,
        AlarmTime: AlarmTime,
        UserRemark: UserRemark,
        DeleteMark: DeleteMark,
        RolesId: RolesId,
        Group_Id: Group_Id,
        PinYin: PinYin,
        User_Number: User_Number,
        RegionName: RegionName,
        RegionId: RegionId,
      });
      yield update({
        requstresult: result.requstresult,
        reason: result.reason,
      });
      callback(result.requstresult);
    },
    *getuser(
      {
        payload: { UserId, callback },
      },
      { call, put, update, select },
    ) {
      const result = yield call(getuser, {
        UserId: UserId,
      });
      yield update({
        requstresult: result.requstresult,
        editUser: result.data[0],
      });
      callback();
    },
    *edituser(
      {
        payload: {
          UserId,
          UserAccount,
          UserName,
          UserSex,
          // Email,
          // Phone,
          // Title,
          // UserOrderby,
          // SendPush,
          // AlarmType,
          // AlarmTime,
          UserRemark,
          DeleteMark,
          RolesId,
          Group_Id,
          PinYin,
          User_Number,
          RegionId,
          RegionName,
          callback,
        },
      },
      { call, put, update, select },
    ) {
      const result = yield call(edituser, {
        UserId: UserId,
        UserAccount: UserAccount,
        UserName: UserName,
        UserSex: UserSex,
        // Email: Email,
        // Phone: Phone,
        // Title: Title,
        // UserOrderby: UserOrderby,
        // SendPush: SendPush,
        // AlarmType: AlarmType,
        // AlarmTime: AlarmTime,
        UserRemark: UserRemark,
        DeleteMark: DeleteMark,
        RolesId: RolesId,
        Group_Id: Group_Id,
        PinYin: PinYin,
        User_Number: User_Number,
        RegionId: RegionId,
        RegionName: RegionName,
      });
      yield update({
        requstresult: result.requstresult,
        reason: result.reason,
      });
      callback(result.requstresult);
    },
    *editpersonaluser(
      {
        payload: {
          UserId,
          UserName,
          UserSex,
          Email,
          Phone,
          SendPush,
          AlarmType,
          AlarmTime,
          RegionId,
          RegionName,
          callback,
        },
      },
      { call, put, update, select },
    ) {
      const result = yield call(editpersonaluser, {
        UserId: UserId,
        UserName: UserName,
        UserSex: UserSex,
        Email: Email,
        Phone: Phone,
        SendPush: SendPush,
        AlarmType: AlarmType,
        AlarmTime: AlarmTime,
        RegionId: RegionId,
        RegionName: RegionName,
      });
      yield update({
        requstresult: result.requstresult,
        reason: result.reason,
      });
      callback();
    },
    *userDgimnDataFilter(
      {
        payload: { UserId, TestKey, pageIndex, pageSize },
      },
      { call, put, update, select },
    ) {
      const result = yield call(userDgimnDataFilter, {
        UserId: UserId,
        TestKey: TestKey,
        pageIndex: pageIndex,
        pageSize: pageSize,
      });

      if (result.requstresult === '1') {
        yield update({
          requstresult: result.requstresult,
          list: result.data,
          total: result.total,
          pageIndex: pageIndex,
          pageSize: pageSize,
        });
      } else {
        yield update({
          requstresult: result.requstresult,
          list: [],
          total: 0,
          pageIndex: null,
          pageSize: null,
        });
      }
    },
    *getmypielist(
      {
        payload: { pageIndex, pageSize, beginTime, endTime },
      },
      { call, put, update, select },
    ) {
      const result = yield call(getmypielist, {
        pageIndex: pageIndex,
        pageSize: pageSize,
        beginTime: beginTime,
        endTime: endTime,
      });

      if (result.requstresult === '1') {
        yield update({
          requstresult: result.requstresult,
          mypielist: result.data,
          total: result.total,
          pageIndex: pageIndex,
          pageSize: pageSize,
        });
      } else {
        yield update({
          requstresult: result.requstresult,
          mypielist: [],
          total: 0,
          pageIndex: null,
          pageSize: null,
        });
      }
    },
    *mymessagelist(
      {
        payload: { pageIndex, pageSize, beginTime, endTime },
      },
      { call, put, update, select },
    ) {
      const result = yield call(mymessagelist, {
        pageIndex: pageIndex,
        pageSize: pageSize,
        beginTime: beginTime,
        endTime: endTime,
      });

      if (result.requstresult === '1') {
        yield update({
          requstresult: result.requstresult,
          mymessagelist: result.data,
          total: result.total,
          pageIndex: pageIndex,
          pageSize: pageSize,
        });
      } else {
        yield update({
          requstresult: result.requstresult,
          mymessagelist: [],
          total: 0,
          pageIndex: null,
          pageSize: null,
        });
      }
    },
    /**
     * 获取已授权的企业
     * @param {传递参数} 传递参数
     * @param {操作} 操作项
     */
    *getEnterpriseDataRoles({ payload }, { call, put, update, select }) {
      const response = yield call(getEnterpriseDataRoles, { ...payload });
      yield update({
        isSuccess: response.IsSuccess,
        EnterpriseDataRoles: response.Data,
      });
      //payload.callback(response);
    },
    /**
     * 设置授权企业
     * @param {传递参数} 传递参数
     * @param {操作} 操作项
     */
    *setEnterpriseDataRole({ payload }, { call, put, update, select }) {
      const response = yield call(setEnterpriseDataRole, { ...payload });
      yield update({
        isSuccess: response.IsSuccess,
      });
      payload.callback(response);
    },
    *GetUserInfoListByGroupId({ payload }, { call, put, update, select }) {
      const DataInfo = yield call(GetUserInfoListByGroupId, { ...payload });
      if (DataInfo !== null && DataInfo.requstresult == 1) {
        yield update({
          groupList: DataInfo.data,
        });
        payload.callback && payload.callback(DataInfo.data);
      } else {
        yield update({
          groupList: [],
        });
      }
    },
    // 获取角色信息
    *GetUserRoleList({}, { call, update }) {
      const result = yield call(GetUserRoleList, {});
      if (result.requstresult == 1) {
        yield update({
          userRoleList: result.data,
        });
      }
    },
    // 获取人员行政区
    *GetUserRegionList({}, { call, update }) {
      const result = yield call(GetUserRegionList, {});
      if (result.requstresult == 1) {
        yield update({
          userRegionList: result.data,
        });
      }
    },
    // 重置密码
    *resetPwd({ payload }, { call }) {
      const result = yield call(resetPwd, { ...payload });
      if (result.requstresult == 1) {
        message.success('重置密码成功！');
      } else {
        message.error(result.reason || '重置密码失败');
      }
    },
    /**
     * 基本用户信息-生成模版
     * @param {传递参数} 传递参数
     * @param {操作} 操作项
     */
    *CreatUserFiles({ payload }, { call }) {
      const result = yield call(CreatUserFiles, {});
      debugger;
      payload.callback(result);
    },
    /**
     * 基本信息-上传附件
     * @param {传递参数} 传递参数
     * @param {操作} 操作项
     */
    *UploadUserfiles({ payload }, { call }) {
      const result = yield call(UploadUserfiles, {
        ...payload,
      });
      payload.callback(result);
    },
    /**
     * 基本信息-保存借调人员和部门关系
     * @param {传递参数} 传递参数
     * @param {操作} 操作项
     */
    *AddUserInfoToLoan({ payload }, { call }) {
      const result = yield call(AddUserInfoToLoan, {
        ...payload,
      });
      payload.callback(result);
    },

    /**
     * 基本信息-根据用户获取关联的部门id集合
     * @param {传递参数} 传递参数
     * @param {操作} 操作项
     */
    *GetUserInfoToLoanByUserId({ payload }, { call }) {
      const result = yield call(GetUserInfoToLoanByUserId, {
        ...payload,
      });
      payload.callback(result.data);
    },
    // 部门
    *GetDepartmentTree({ payload }, { call, update, select }) {
      const DataInfo = yield call(GetDepartmentTree, payload);
      if (DataInfo !== null && DataInfo.IsSuccess) {
        yield update({ dptList: DataInfo.Datas });
      }
    },

    // 所有部门
    *GetAllDepartmentTree({ payload }, { call, update, select }) {
      const DataInfo = yield call(GetAllDepartmentTree, payload);
      if (DataInfo !== null && DataInfo.IsSuccess) {
        yield update({ ALLdptList: DataInfo.Datas });
      }
    },
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        ...action.payload,
        // currentUser: action.payload,
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
    saveChangePwdRes(state, action) {
      return {
        ...state,
        changepwdRes: action.payload,
      };
    },
    setCurrentMenu(state, action) {
      // ;
      return {
        ...state,
        currentMenu: action.payload,
      };
    },
  },
});
