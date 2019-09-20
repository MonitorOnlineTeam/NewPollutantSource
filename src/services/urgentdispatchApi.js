import moment from 'moment';
import { post, get } from '@/utils/request';

/**督办
 * params{
 *     "NoticeTitle":1,
 *      "ToUserId": "766f911d-5e41-4bbf-b705-add427a16e77",
        "NoticeType": 1,
         "DGIMN": "62030231jnsp03"
 * }
 */
export async function queryurge(params) {
    const result = await post('/api/rest/PollutantSourceApi/PTaskProcessing/PostTaskSupervise', params, null);
    return result === null ? { data: null } : result.requstresult;
}

/**专工派单
 * 
 *      "DGIMNs": "62030231jnsp03",
        taskType: 2,
        taskFrom: 3,
        operationsUserId:""766f911d-5e41-4bbf-b705-add427a16e77"",
        remark:"备注"
 */
export async function addtaskinfo(params) {
   
    const result = await post('/api/rest/PollutantSourceApi/PTaskProcessing/AddTask', params, null);
    return result === null ? { data: null } : result.requstresult;
}


// 获取单排口运维信息
export async function queryoperationInfo(params) {
    const body = {
        DGIMNs: params.dgimn,
    };
    const result = await post('/api/rest/PollutantSourceApi/PPointAndData/GetOperationByDgimn', body, null);
    return result === null ? { data: null } : result;
}

// 获取单排口下是否有任务
export async function queryoperationTaskInfo(params) {
    const body = {
        DGIMNs: params.dgimn,
    };
    const result = await post('/api/rest/PollutantSourceApi/PPointAndData/GetOperationTaskByDgimn', body, null);
    return result === null ? { data: null } : result;
}