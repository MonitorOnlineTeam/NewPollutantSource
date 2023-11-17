import Model from '@/utils/model';
import {
  getdepartinfobytree,
  getdepartinfobyid,
  insertdepartinfo,
  deldepartinfo,
  upddepartinfo,
  getdeparttreeandobj,
  getalluser,
  getuserbydepid,
  insertdepartbyuser,
  insertregionbyuser,
  getregionbydepid,
  getregioninfobytree,
  getentandpoint,
  getpointbydepid,
  insertpointfilterbydepid,
  getGroupRegionFilter,
  GetAlarmPushDepOrRole,
  InsertAlarmDepOrRole,
  UpdateOperationArea,
  GetUserDepApproveInfo,
  AddOrUpdateUserDepApprove,
  GetUserList,
  DeleteUserDepApprove,
  GetAllProvince,
  InsOrUpdProvinceOrRegional,
  GetProvinceOrRegionalList,
  DeleteProvinceOrRegionalOne,
  getTestRegionByDepID,
  insertTestRegionByUser,
  addSetOperationGroup,
  getSetOperationGroup,
  groupSort,
} from './service';
import { message } from 'antd';
/*
用户管理相关接口
add by lzp
modify by
*/
export default Model.extend({
  namespace: 'departinfo',
  state: {
    DepartInfoTree: [],
    DepartInfoOne: [],
    DepartTree: [],
    AllUser: [],
    UserByDepID: [],
    RegionByDepID: [],
    RegionInfoTree: [],
    EntAndPoint: [],
    CheckPoint: [],
    alarmPushLoading: true,
    alarmPushParLoading: true,
    alarmPushFlag: true,
    alarmPushParam: {
      Type: '',
      RegionCode: '',
      ID: '',
      AlarmType: '',
    },
    alarmPushDepOrRoleList: [],
    alarmPushSelect: [],
    userDepApproveInfoList: [],
    userList: [],
    AllProvince: [],
    provinceList: [],
    regionalList: [],
    setOperationGroupId:[],
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => { });
    },
  },
  effects: {
    // *getFirstAlarmpar({callback, payload }, { call, put, update, select }) {
    //     //获取报警关联报警列表 参数
    //     yield update({ alarmPushParLoading: true});

    //     const response = yield call(GetAlarmPushDepOrRole, { ...payload });
    //     if (response.IsSuccess) {
    //       yield update({
    //         alarmPushParLoading:false,
    //         alarmPushFlag:response.Datas.IsFlag,
    //       });
    //       callback(response.Datas.IsFlag);
    //     }
    //   },
    // *getAlarmPushDepOrRole({callback, payload }, { call, put, update, select }) {
    //     //报警关联 列表
    //     yield update({ alarmPushLoading: true});

    //     const response = yield call(GetAlarmPushDepOrRole, { ...payload });
    //     if (response.IsSuccess) {
    //         let totalData = response.Datas.queryAll;
    //         let selectData = response.Datas.query.map(item=>{
    //             return item.DGIMN
    //         });
    //       yield update({
    //         alarmPushDepOrRoleList: totalData,
    //         alarmPushLoading:false,
    //         alarmPushSelect:selectData
    //       });
    //       callback(selectData);
    //     }
    //   },
    *insertAlarmDepOrRole({ callback, payload }, { call, put, update, select }) {
      //报警关联 选择
      const response = yield call(InsertAlarmDepOrRole, { ...payload });
      if (response.IsSuccess) {
        message.success(response.Message);
        callback();
      } else {
        message.error(response.Message);
      }
    },
    /*获取部门详细信息及层级关系**/
    *getdepartinfobytree({ payload, callback }, { call, update }) {
      const result = yield call(getdepartinfobytree, { ...payload });
      if (result.IsSuccess) {
        yield update({
          DepartInfoTree: result.Datas,
        });
        callback && callback(result.Datas);
      }
    },
    /*获取单个部门信息**/
    *getdepartinfobyid({ payload }, { call, put, update }) {
      const result = yield call(getdepartinfobyid, {
        ...payload,
      });
      if (result.IsSuccess) {
        yield update({
          DepartInfoOne: result.Datas,
        });
      }
    },
    /*新增部门信息**/
    *insertdepartinfo({ payload }, { call, put, update }) {
      const result = yield call(insertdepartinfo, {
        ...payload,
      });
      payload.callback(result);
    },
    /*删除部门信息**/
    *deldepartinfo({ payload }, { call, update }) {
      const result = yield call(deldepartinfo, {
        UserGroup_ID: payload.UserGroup_ID,
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
    /*修改部门信息**/
    *upddepartinfo({ payload }, { call, update }) {
      const result = yield call(upddepartinfo, {
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
    /*获取部门树(带根结点)**/
    *getdeparttreeandobj({ payload }, { call, update }) {
      const result = yield call(getdeparttreeandobj, {
        ...payload,
      });
      if (result.IsSuccess) {
        yield update({
          DepartTree: result.Datas,
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
    /*获取当前部门的用户**/
    *getuserbydepid({ payload }, { call, update }) {
      const result = yield call(getuserbydepid, {
        ...payload,
      });
      if (result.IsSuccess) {
        yield update({
          UserByDepID: result.Datas,
        });
      }
    },
    /*给部门添加用户（可批量）**/
    *insertdepartbyuser({ payload, callback }, { call, update }) {
      const result = yield call(insertdepartbyuser, {
        ...payload,
      });
      if (result.IsSuccess) {
        message.success(result.Message);
      } else {
        message.error(result.Message);
      }
      callback && callback(result.IsSuccess);
    },
    /*获取行政区详细信息及层级关系**/
    *getregioninfobytree({ payload }, { call, update }) {
      const result = yield call(getregioninfobytree, { ...payload });
      if (result.IsSuccess) {
        yield update({
          RegionInfoTree: result.Datas.list,
        });
      }
    },
    /*给部门添加行政区（可批量）**/
    *insertregionbyuser({ payload }, { call, update }) {
      const result = yield call(insertregionbyuser, {
        ...payload,
      });
      payload.callback(result);
    },
    /*获取当前部门的行政区**/
    *getregionbydepid({ payload, callback }, { call, update }) {
      const result = yield call(getregionbydepid, {
        ...payload,
      });
      if (result.IsSuccess) {
        callback(result.Datas);
        yield update({
          RegionByDepID: result.Datas,
        });
      }
    },
    /*获取企业+排口**/
    *getentandpoint({ payload }, { call, update, select, take }) {
      // if(!payload.PollutantType)
      // {
      //     yield take('common/getPollutantTypeList/@@end');
      //     const dd = yield select(state => state.common);
      //     payload={
      //         ...payload,
      //         PollutantTypes:dd.defaultPollutantCode
      //     }
      // }
      if (!payload.PollutantType) {
        let global = yield select(state => state.common);
        if (!global.defaultPollutantCode) {
          yield take('common/getPollutantTypeList/@@end');
          global = yield select(state => state.common);
          payload = {
            ...payload,
            PollutantType: global.defaultPollutantCode,
          };
        } else {
          payload = {
            ...payload,
            PollutantType: global.defaultPollutantCode,
          };
        }
      }
      const result = yield call(getentandpoint, {
        ...payload,
      });
      if (result.IsSuccess) {
        // 过滤掉没有子节点的数据
        let EntAndPoint = result.Datas.filter(item => item.children.length);
        yield update({
          EntAndPoint: EntAndPoint,
        });
      }
    },
    /*获取当前部门的排口**/
    *getpointbydepid({ payload }, { call, update, select, take }) {
      if (!payload.PollutantType) {
        let global = yield select(state => state.common);
        if (!global.defaultPollutantCode) {
          yield take('common/getPollutantTypeList/@@end');
          global = yield select(state => state.common);
          payload = {
            ...payload,
            PollutantType: global.defaultPollutantCode,
          };
        } else {
          payload = {
            ...payload,
            PollutantType: global.defaultPollutantCode,
          };
        }
      }
      const result = yield call(getpointbydepid, {
        ...payload,
      });
      if (result.IsSuccess) {
        yield update({
          CheckPoint: result.Datas,
        });
      }
    },
    /*给当前部门添加排口权限(可批量)**/
    *insertpointfilterbydepid({ payload }, { call, update, select, take }) {
      if (!payload.Type) {
        let global = yield select(state => state.common);
        if (!global.defaultPollutantCode) {
          yield take('common/getPollutantTypeList/@@end');
          global = yield select(state => state.common);
          payload.Type = global.defaultPollutantCode;
        } else {
          payload.Type = global.defaultPollutantCode;
        }
      }
      const result = yield call(insertpointfilterbydepid, {
        ...payload,
      });
      payload.callback(result);
    },
    // 是否显示区域过滤
    *getGroupRegionFilter({ payload }, { call, update }) {
      const result = yield call(getGroupRegionFilter, payload);
      if (result.IsSuccess) {
        yield update({
          showGroupRegionFilter: result.Datas,
        });
      } else {
        message.error(result.Message);
      }
    },
    // 更新运维区域
    *updateOperationArea({ payload, callback }, { call, update }) {
      const result = yield call(UpdateOperationArea, payload);
      if (result.IsSuccess) {
        message.success(result.Message);
        callback();
      } else {
        message.error(result.Message);
      }
    },
    // 审核流程 列表
    *getUserDepApproveInfo({ payload, callback }, { call, update }) {
      const result = yield call(GetUserDepApproveInfo, payload);
      if (result.IsSuccess) {
        yield update({
          userDepApproveInfoList: result.Datas,
        });
      } else {
        message.error(result.Message);
      }
    },
    // 审核流程 添加or修改
    *addOrUpdateUserDepApprove({ payload, callback }, { call, update }) {
      const result = yield call(AddOrUpdateUserDepApprove, payload);
      if (result.IsSuccess) {
        message.success(result.Message);
        callback();
      } else {
        message.error(result.Message);
      }
    },
    *getUserList({ payload }, { call, put, update, select }) {
      //用户列表
      const response = yield call(GetUserList, { ...payload });
      if (response.IsSuccess) {
        yield update({
          userList: response.Datas,
        });
      }
    },
    // 审核流程 删除
    *deleteUserDepApprove({ payload, callback }, { call, update }) {
      const result = yield call(DeleteUserDepApprove, payload);
      if (result.IsSuccess) {
        message.success(result.Message);
      } else {
        message.error(result.Message);
      }
    },
    // 获取省区
    *GetAllProvince({ payload, callback }, { call, update }) {
      const result = yield call(GetAllProvince, payload);
      if (result.IsSuccess) {
        yield update({
          AllProvince: result.Datas,
        });
      } else {
        message.error(result.Message);
      }
    },
    // 添加/编辑大区经理或省区经理
    *InsOrUpdProvinceOrRegional({ payload, callback }, { call, update }) {
      const result = yield call(InsOrUpdProvinceOrRegional, payload);
      if (result.IsSuccess) {
        message.success('操作成功！');
        callback && callback();
      } else {
        message.error(result.Message);
      }
    },
    // 获取大区下的所有经理详情
    *GetProvinceOrRegionalList({ payload, callback }, { call, update }) {
      const result = yield call(GetProvinceOrRegionalList, payload);
      if (result.IsSuccess) {
        yield update({
          provinceList: result.Datas.province,
          regionalList: result.Datas.regional,
        });
      } else {
        message.error(result.Message);
      }
    },
    // 删除大区或省区经理
    *DeleteProvinceOrRegionalOne({ payload, callback }, { call, update }) {
      const result = yield call(DeleteProvinceOrRegionalOne, payload);
      if (result.IsSuccess) {
        message.success('删除成功！');
        callback && callback();
      } else {
        message.error(result.Message);
      }
    },
    //调试检测区域过滤 获取选中
    *getTestRegionByDepID({ payload, callback }, { call, update }) {
      const result = yield call(getTestRegionByDepID, payload);
      if (result.IsSuccess) {
        callback(result.Datas)
      } else {
        message.error(result.Message);
      }
    },
    // 调试检测区域过滤 提交
    *insertTestRegionByUser({ payload, callback }, { call, update }) {
      const result = yield call(insertTestRegionByUser, payload);
      if (result.IsSuccess) {
        message.success(result.Message);
        callback && callback(result);
      } else {
        message.error(result.Message);
      }
    },
    //部门管理 设置运维小组
    *addSetOperationGroup({ payload, callback }, { call, update }) {
      const result = yield call(addSetOperationGroup, payload);
      if (result.IsSuccess) {
        message.success(result.Message);
        callback && callback(result);
      } else {
        message.error(result.Message);
      }
    },
    //部门管理 获取设置运维小组
    *getSetOperationGroup({ payload, callback }, { call, update }) {
      const result = yield call(getSetOperationGroup, payload);
      if (result.IsSuccess) {
        yield update({
          setOperationGroupId: result.Datas,
        });
        callback && callback(result);
      } else {
        message.error(result.Message);
      }
    },
     //部门管理 部门排序
    *groupSort({ payload, callback }, { call, update }) {
      const result = yield call(groupSort, payload);
      if (result.IsSuccess) {
        message.success(result.Message);
        callback && callback();
      } else {
        message.error(result.Message);
      }
    },
  },

  reducers: {},
});
