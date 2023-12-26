import Model from '@/utils/model';

import { GetAlarmPushDepOrRole,InsertAlarmDepOrRole } from '@/services/globalApi';
import { message } from 'antd';
/*
报警关联
add by jab
modify by
*/
export default Model.extend({
    namespace: 'alarmPush',
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
        alarmPushLoading:true,
        alarmPushParLoading:true,
        alarmPushFlag:true,
        alarmPushParam:{
            Type: "",
            RegionCode: "",
            ID: "",
            AlarmType: ""
          },
        alarmPushDepOrRoleList:[],
        alarmPushSelect:[],
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
        *getFirstAlarmpar({callback, payload }, { call, put, update, select }) {
            //获取报警关联报警列表 参数
            yield update({ alarmPushParLoading: true});

            const response = yield call(GetAlarmPushDepOrRole, { ...payload });
            if (response.IsSuccess) {
              yield update({
                alarmPushParLoading:false,
                alarmPushFlag:response.Datas.IsFlag,
              });
              callback(response.Datas.IsFlag);
            }
          },
        *getAlarmPushDepOrRole({callback, payload }, { call, put, update, select }) {
            //报警关联 列表
            yield update({ alarmPushLoading: true});

            const response = yield call(GetAlarmPushDepOrRole, { ...payload });
            if (response.IsSuccess) {
                let totalData = response.Datas.queryAll;
                let selectData = response.Datas.query.map(item=>{
                    return item.DGIMN
                });
              yield update({
                alarmPushFlag:response.Datas.IsFlag,
                alarmPushDepOrRoleList: totalData,
                alarmPushLoading:false,
                alarmPushSelect:selectData
              });
              callback(selectData);
            }
          },
          *insertAlarmDepOrRole({ callback,payload }, { call, put, update, select }) {
            //报警关联 选择
            const response = yield call(InsertAlarmDepOrRole, { ...payload });
            if (response.IsSuccess) {
                message.success(response.Message)
                callback()
            }else{
                message.error(response.Message)
                callback()
            }
          },



    },
    reducers: {
    },
});
