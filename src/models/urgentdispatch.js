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
        existTask:false,
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
                yield update({
                    operationUserInfo: result,
                    dgimn:payload.dgimn
                });
        },
        
        * queryoperationTaskInfo({
            payload     
        }, {
            call,
            update,
        }) {
            const result = yield call(queryoperationTaskInfo, payload);
            if (result) {
                yield update({
                    existTask: true
                });
            } else {
                yield update({
                    existTask: false,
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
            if (res) {
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
            if (res) {
                message.success('派单成功!');
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
