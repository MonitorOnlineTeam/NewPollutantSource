import Model from '@/utils/model';
import {
    getList, deleteuser, enableduser, isexistenceuser, adduser, getuser, edituser, editpersonaluser, getmypielist, mymessagelist,
    setEnterpriseDataRole, getEnterpriseDataRoles, getdeparttree, getrolestree, insertroledep, getrolebyuserid, getdepbyuserid,deluserandroledep
    ,resetpwd
} from './service';
import { postAutoFromDataAdd, postAutoFromDataUpdate } from '@/services/autoformapi'
import { message } from 'antd';
/*
用户管理相关接口
add by xpy
modify by
*/
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
        DepartTree: [],
        RolesTree: [],
        UserRoles: [],
        UserDep: [],
        UserRolesName:'',
        UserDepName:''
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
        /*获取用户列表**/
        * fetchuserlist({
            payload
        }, {
            call,
            update,
        }) {
            const result = yield call(getList, { ...payload });
            if (result.requstresult === '1') {
                yield update({
                    requstresult: result.requstresult,
                    list: result.data,
                    total: result.total,
                    pageIndex: payload.pageIndex,
                    pageSize: payload.pageSize
                });
            } else {
                yield update({
                    requstresult: result.requstresult,
                    list: [],
                    total: 0,
                    pageIndex: null,
                    pageSize: null
                });
            }
        },
        /*删除用户**/
        * deleteuser({
            payload
        }, {
            call,
            put,
            update,
        }) {
            const result = yield call(deleteuser, {
                UserId: payload.UserId,
            });
            yield update({
                requstresult: result.requstresult,
            });
            yield put({
                type: 'fetchuserlist',
                payload: {
                    pageIndex: payload.pageIndex,
                    pageSize: payload.pageSize,
                    UserAccount: payload.UserAccount,
                    DeleteMark: payload.DeleteMark,
                }
            });
            payload.callback();
        },
        /*开启或禁用用户**/
        * enableduser({
            payload
        }, {
            call,
            put,
            update,
        }) {
            const result = yield call(enableduser, {
                UserId: payload.UserId,
                Enalbe: payload.Enalbe,
            });
            yield update({
                requstresult: result.requstresult,
            });
            yield put({
                type: 'fetchuserlist',
                payload: {
                    pageIndex: payload.pageIndex,
                    pageSize: payload.pageSize,
                    UserAccount: payload.UserAccount,
                    DeleteMark: payload.DeleteMark
                },
            });
        },
        /*验证用户名是否存在**/
        * isexistenceuser({
            payload
        }, {
            call,
            update,
        }) {
            const result = yield call(isexistenceuser, {
                UserAccount: payload.UserAccount,
            });
            yield update({
                requstresult: result.requstresult,
                reason: result.reason
            });
            payload.callback();
        },
        /*添加用户**/
        * adduser({
            payload
        }, {
            call,
            update,
        }) {
            const result = yield call(adduser, {
                ...payload
            });
            yield update({
                requstresult: result.requstresult,
                reason: result.reason
            });
            payload.callback();
        },
        /*获取单个用户实体**/
        * getuser({
            payload
        }, {
            call,
            update,
        }) {
            const result = yield call(getuser, {
                ...payload
            });
            yield update({
                requstresult: result.requstresult,
                editUser: result.data[0]
            });
            payload.callback();
        },
        /*获取部门树**/
        * getdepartmenttree({
            payload
        }, {
            call,
            update,
        }) {
            const result = yield call(getdeparttree, {
                ...payload
            });
            if (result.IsSuccess) {
                yield update({
                    DepartTree: result.Datas
                });
            }


        },
        /*获取角色树**/
        * getrolestree({
            payload
        }, {
            call,
            update,
        }) {
            const result = yield call(getrolestree, {
                ...payload
            });
            if (result.IsSuccess) {
                yield update({
                    RolesTree: result.Datas
                });
            }

        },
        /*获取当前用户的角色**/
        * getrolebyuserid({
            payload
        }, {
            call,
            update,
        }) {
            const result = yield call(getrolebyuserid, {
                ...payload
            });
            console.log("666=", result.Datas.map(item => item.ID))
            if (result.IsSuccess) {
                yield update({
                    UserRoles: result.Datas.map(item => item.ID),
                    UserRolesName:result.Datas.map(item => item.Name).toString()
                });
            }

        },
        /*获取当前用户的部门**/
        * getdepbyuserid({
            payload
        }, {
            call,
            update,
        }) {
            const result = yield call(getdepbyuserid, {
                ...payload
            });
            if (result.IsSuccess) {
                yield update({
                    UserDep: result.Datas.map(item => item.ID),
                    UserDepName: result.Datas.map(item => item.Name).toString()
                });
            }

        },
        * add({ payload }, { call, update, put }) {
            console.log(payload);
            const payloaduser = {
                configId: payload.configId,
                FormData: JSON.stringify(payload.FormData)
            };
            const result = yield call(postAutoFromDataAdd, { ...payloaduser });
            if (result.IsSuccess) {
                console.log("payload=", payload)
                yield put({
                    type: "insertroledep",
                    payload: {
                        User_ID: result.Datas,
                        Roles_ID: payload.roleID,
                        UserGroup_ID: payload.departID
                    }
                })
            } else {
                // message.error(result.Message);
            }
        },
        * edit({ payload }, { call, update, put }) {
            console.log(payload);
            const payloaduser = {
                configId: payload.configId,
                FormData: JSON.stringify(payload.FormData)
            };
            const result = yield call(postAutoFromDataUpdate, { ...payloaduser });
            if (result.IsSuccess) {
                console.log("payload=", payload)
                yield put({
                    type: "insertroledep",
                    payload: {
                        User_ID: payload.User_ID,
                        Roles_ID: payload.roleID,
                        UserGroup_ID: payload.departID
                    }
                })
            } else {
                // message.error(result.Message);
            }
        },
         /*重置密码**/
         * resetpwd({
            payload
        }, {
            call,
            update,
        }) {
            const result = yield call(resetpwd, {
                ...payload
            });
            if (result.IsSuccess == true) {
                message.success("重置成功");
            }
            // yield update({
            //     requstresult: result.requstresult,
            //     reason: result.reason
            // });
        },
        /*删除角色和部门**/
        * deluserandroledep({
            payload
        }, {
            call,
            update,
            put 
        }) {
            console.log("payload=",payload)
            const result = yield call(deluserandroledep, {
                ...payload
            });
            if (result.IsSuccess == true) {
                message.success("删除成功");
                yield put({
                    type:"autoForm/getAutoFormData",
                    payload:{
                        configId:"UserInfo"
                    }
                })
            }
            // yield update({
            //     requstresult: result.requstresult,
            //     reason: result.reason
            // });
        },
        /*编辑用户**/
        * edituser({
            payload
        }, {
            call,
            update,
        }) {
            const result = yield call(edituser, {
                ...payload
            });
            yield update({
                requstresult: result.requstresult,
                reason: result.reason
            });
            payload.callback();
        }
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
                ...action.payload
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
