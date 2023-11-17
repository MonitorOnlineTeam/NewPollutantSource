/*
 * @Author: lzp
 * @Date: 2019-07-29 03:00:19
 * @LastEditors: lzp
 * @LastEditTime: 2019-09-18 11:08:59
 * @Description: 异常超标记录api
 */
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
/**
 * 【智能监控】获取超标信息汇总
 * @params {
    }
 */
export async function getovermodellist(params) {
    const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetOverModel', params, null);
    return result 
}
/**
 * 【智能监控】获取超标信息明细
 * @params {
    }
 */
export async function getoverdata(params) {
    const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetOverData', params, null);
    return result 
}
