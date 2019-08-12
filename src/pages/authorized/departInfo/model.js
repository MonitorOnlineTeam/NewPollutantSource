import Model from '@/utils/model';
import {
    getdepartinfobytree, getdepartinfobyid, insertdepartinfo, deldepartinfo, upddepartinfo, getdeparttreeandobj, getalluser, getuserbydepid, insertdepartbyuser,
    insertregionbyuser,getregionbydepid,getregioninfobytree,getentandpoint,getpointbydepid,insertpointfilterbydepid
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
        RegionByDepID:[],
        RegionInfoTree:[],
        EntAndPoint:[],
        CheckPoint:[],
    },
    subscriptions: {
        setup({
            dispatch,
            history
        }) {
            history.listen((location) => {
            });
        },
    },

    effects: {
        /*获取部门详细信息及层级关系**/
        * getdepartinfobytree({
            payload
        }, {
            call,
            update,
        }) {
            const result = yield call(getdepartinfobytree, { ...payload });
            if (result.IsSuccess) {
                yield update({
                    DepartInfoTree: result.Datas
                });
            }
        },
        /*获取单个部门信息**/
        * getdepartinfobyid({
            payload
        }, {
            call,
            put,
            update,
        }) {
            const result = yield call(getdepartinfobyid, {
                ...payload
            });
            if (result.IsSuccess) {
                yield update({
                    DepartInfoOne: result.Datas
                });
            }
        },
        /*新增部门信息**/
        * insertdepartinfo({
            payload
        }, {
            call,
            put,
            update,
        }) {
            const result = yield call(insertdepartinfo, {
                ...payload
            });
            payload.callback(result);
        },
        /*删除部门信息**/
        * deldepartinfo({
            payload
        }, {
            call,
            update,
        }) {
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
        * upddepartinfo({
            payload
        }, {
            call,
            update,
        }) {
            const result = yield call(upddepartinfo, {
                ...payload
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
        * getdeparttreeandobj({
            payload
        }, {
            call,
            update,
        }) {
            const result = yield call(getdeparttreeandobj, {
                ...payload
            });
            if (result.IsSuccess) {
                yield update({
                    DepartTree: result.Datas
                });
            }

        },
        /*获取所有用户**/
        * getalluser({
            payload
        }, {
            call,
            update,
        }) {
            const result = yield call(getalluser, {
                ...payload
            });
            if (result.IsSuccess) {
                yield update({
                    AllUser: result.Datas
                });
            }

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
        /*给部门添加用户（可批量）**/
        * insertdepartbyuser({
            payload
        }, {
            call,
            update,
        }) {
            const result = yield call(insertdepartbyuser, {
                ...payload
            });
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
                    RegionInfoTree: result.Datas
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
            payload
        }, {
            call,
            update,
        }) {
            const result = yield call(getregionbydepid, {
                ...payload
            });
            if (result.IsSuccess) {
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
            // if(!payload.PollutantType)
            // {
            //     yield take('common/getPollutantTypeList/@@end');
            //     const dd = yield select(state => state.common);
            //     payload={
            //         ...payload,
            //         PollutantTypes:dd.defaultPollutantCode
            //     }
            // }
            if (!payload.PollutantTypes) {
                let global = yield select(state => state.common);
                if (!global.defaultPollutantCode) {
                    yield take('common/getPollutantTypeList/@@end');
                    global = yield select(state => state.common);
                    payload = {
                        ...payload,
                        PollutantTypes: global.defaultPollutantCode
                    }
                }else {
                    payload = {
                        ...payload,
                        PollutantTypes:global.defaultPollutantCode
                    }
                }
                
            }
            const result = yield call(getentandpoint, {
                ...payload
            });
            if (result.IsSuccess) {
                yield update({
                    EntAndPoint: result.Datas
                });
            }

        },
         /*获取当前部门的排口**/
         * getpointbydepid({
            payload
        }, {
            call,
            update,
        }) {
            const result = yield call(getpointbydepid, {
                ...payload
            });
            if (result.IsSuccess) {
                yield update({
                    CheckPoint: result.Datas
                });
            }
        },
         /*给当前部门添加排口权限(可批量)**/
         * insertpointfilterbydepid({
            payload
        }, {
            call,
            update,
            select,
            take
        }) {
            if (!payload.Type) {
                let global = yield select(state => state.common);
                if (!global.defaultPollutantCode) {
                    yield take('common/getPollutantTypeList/@@end');
                    global = yield select(state => state.common);
                    payload.Type=global.defaultPollutantCode
                }else {
                    payload.Type=global.defaultPollutantCode
                }
                
            }
            const result = yield call(insertpointfilterbydepid, {
                ...payload
            });
            payload.callback(result)
        },
    },
    reducers: {
    },
});
