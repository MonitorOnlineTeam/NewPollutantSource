import  Model  from '@/utils/model';
import { queryurge,addtaskinfo,queryoperationInfo,queryoperationTaskInfo
} from '@/services/urgentdispatchApi';
import {
    message
} from 'antd';

export default Model.extend({
    namespace: 'urgentdispatch',
    state: {
        operationUserInfo: null,
        existTask:null,
        dgimn:null,
    },
    effects: {
        * queryoperationInfo({
            payload 
        }, {
            call,
            update,
            put,
            take
        }) {
            yield put({
                type:'queryoperationTaskInfo',
                payload:payload
            });
            yield take('queryoperationTaskInfo/@@end');
            const result = yield call(queryoperationInfo, payload);
            if (result.requstresult === '1') {
                yield update({
                    operationUserInfo: result.data,
                    dgimn:payload.dgimn
                });
            } else {
                yield update({
                    operationUserInfo: null,
                    dgimn:null
                });
            }
           
        },
        
        * queryoperationTaskInfo({
            payload     
        }, {
            call,
            update,
        }) {
            const result = yield call(queryoperationTaskInfo, payload);
            if (result.requstresult === '1') {
                yield update({
                    existTask: result.data
                });
            } else {
                yield update({
                    existTask: null,
                });
            }
        },
          //催办
          * queryurge({
            payload
        }, { call }) {
            const body = {
                NoticeTitle: '督办',
                ToUserId: payload.personId,
                //1是督办
                NoticeType: 1,
                DGIMN: payload.DGIMN
            };
            const res = yield call(queryurge, body);
            if (res == 1) {
                message.success('催办成功!');
            } else {
                message.error('催办失败!');
            }
        },
       //紧急派单
           * addtaskinfo({
            payload,
         }, { call }) {
            const body = {
                DGIMNs: payload.dgimn,
                taskType: 2,
                taskFrom: 3,
                operationsUserId: payload.personId,
                remark: payload.remark
            };
            const res = yield call(addtaskinfo, body);
            if (res == 1) {
                message.success('派单成功!');debugger

                if(payload.reloadData)
                {
                    //刷新方法
                    payload.reloadData();   
                }
            } else {
                message.error('派单失败!');
            }
        },
    }
});
