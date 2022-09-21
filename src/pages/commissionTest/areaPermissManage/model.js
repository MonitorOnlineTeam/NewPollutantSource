import Model from '@/utils/model';
import {
    getTestGroupList, addOrUpdTestGroup, deleteTestGroup, getTestMonitorUserList,addTestMonitorUser, getdeparttreeandobj, getalluser, getuserbydepid, insertdepartbyuser,
    insertregionbyuser, getregionbydepid, getregioninfobytree, getentandpoint, getpointbydepid, insertpointfilterbydepid, getGroupRegionFilter,
} from './service';
import { message } from 'antd';
/*
   检测调试 区域权限管理
*/
export default Model.extend({
    namespace: 'areaPermissManage',
    state: {
        allUser:[],
        regionInfoTree:[],
    },
    effects: {

        /*获取部门详细信息及层级关系**/
        *getTestGroupList({payload, callback}, { call,  update,}) {
            const result = yield call(getTestGroupList, { ...payload });
            if (result.IsSuccess) {
                yield update({ DepartInfoTree: result.Datas });
                callback && callback(result.Datas)
            }
        },
        /*新增部门信息**/
        *addOrUpdTestGroup({ payload,callback  }, {  call, put,update, }) {
            const result = yield call(addOrUpdTestGroup, { ...payload  });
            callback(result);
        },
        /*删除部门信息**/
        *deleteTestGroup({ payload,callback  }, {   call,    update,  }) {
            const result = yield call(deleteTestGroup, {...payload  });
            callback(result);
        },

        /*获取所有用户**/
        *getTestMonitorUserList({  payload }, {  call, update,  }) {
            const result = yield call(getTestMonitorUserList, {  ...payload   });
            if (result.IsSuccess) {
                yield update({ allUser: result.Datas  });
            }else{
                message.error(result.Message)
            }

        },

        /*给部门添加用户（可批量）**/
        *addTestMonitorUser({   payload,    callback, }, {  call,   update,  }) {
            const result = yield call(addTestMonitorUser, { ...payload    });
            if (result.IsSuccess) {
                message.success(result.Message)
            } else {
                message.error(result.Message)
            }
            callback && callback(result.IsSuccess)
        },
       
        /*获取当前部门的用户**/
        * getuserbydepid({
            payload
        }, {
            call,
            update,
        }) {
            const result = yield call(getuserbydepid, {
                ...payload
            });
            if (result.IsSuccess) {
                yield update({
                    UserByDepID: result.Datas
                });
            }

        },
        /*获取行政区详细信息及层级关系**/
        * getregioninfobytree({
            payload
        }, {
            call,
            update,
        }) {
            const result = yield call(getregioninfobytree, { ...payload });
            if (result.IsSuccess) {
                yield update({
                    RegionInfoTree: result.Datas.list
                });
            }
        },
        /*给部门添加行政区（可批量）**/
        * insertregionbyuser({
            payload
        }, {
            call,
            update,
        }) {
            const result = yield call(insertregionbyuser, {
                ...payload
            });
            payload.callback(result)
        },
        /*获取当前部门的行政区**/
        * getregionbydepid({
            payload,
            callback
        }, {
            call,
            update,
        }) {
            const result = yield call(getregionbydepid, {
                ...payload
            });
            if (result.IsSuccess) {
                callback(result.Datas)
                yield update({
                    RegionByDepID: result.Datas
                });
            }

        },
        /*获取企业+排口**/
        * getentandpoint({
            payload
        }, {
            call,
            update,
            select,
            take
        }) {
            if (!payload.PollutantType) {
                let global = yield select(state => state.common);
                if (!global.defaultPollutantCode) {
                    yield take('common/getPollutantTypeList/@@end');
                    global = yield select(state => state.common);
                    payload = {
                        ...payload,
                        PollutantType: global.defaultPollutantCode
                    }
                } else {
                    payload = {
                        ...payload,
                        PollutantType: global.defaultPollutantCode
                    }
                }

            }
            const result = yield call(getentandpoint, {
                ...payload
            });
            if (result.IsSuccess) {
                // 过滤掉没有子节点的数据
                let EntAndPoint = result.Datas.filter(item => item.children.length);
                yield update({
                    EntAndPoint: EntAndPoint
                });
            }

        },
        /*获取当前部门的排口**/
        * getpointbydepid({
            payload
        }, {
            call,
            update,
            select,
            take
        }) {
            if (!payload.PollutantType) {
                let global = yield select(state => state.common);
                if (!global.defaultPollutantCode) {
                    yield take('common/getPollutantTypeList/@@end');
                    global = yield select(state => state.common);
                    payload = {
                        ...payload,
                        PollutantType: global.defaultPollutantCode
                    }
                } else {
                    payload = {
                        ...payload,
                        PollutantType: global.defaultPollutantCode
                    }
                }

            }
            const result = yield call(getpointbydepid, {
                ...payload
            });
            if (result.IsSuccess) {
                yield update({
                    CheckPoint: result.Datas
                });
            }
        },

        // 是否显示区域过滤
        * getGroupRegionFilter({ payload }, { call, update }) {
            const result = yield call(getGroupRegionFilter, payload);
            if (result.IsSuccess) {
                yield update({    showGroupRegionFilter: result.Datas  })
            } else {
                message.error(result.Message)
            }
        },
    },


    reducers: {
    },
});
