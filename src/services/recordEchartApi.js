import { post } from '@/utils/request';
/**
 * 【智能监控】获取异常信息汇总
 * @params {
    }
 */
export async function getexmodellist(params) {
    const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetExceptionModel', params, null);
    return result 
}
/**
 * 【智能监控】获取异常信息明细
 * @params {
    }
 */
export async function getexceptiondata(params) {
    const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetExceptionData', params, null);
    return result 
}
