/*
 * @Author: lzp
 * @Date: 2019-07-18 14:37:18
 * @LastEditors: lzp
 * @LastEditTime: 2019-09-18 11:07:34
 * @Description: 导航树api
 */

import { async } from 'q';
import { post, get } from '@/utils/request';
import { API } from '@config/API'

// 获取企业+排口
export async function getentandpoint(params) {
    const result = post(API.CommonApi.GetEntAndPoint, params);
    return result === null ? {
        data: null
    } : result;
}
/**
 * 【智能监控】获取污染物系统污染物
 * @params {}
 */
export async function getPollutantTypeList(params) {
    const result = await post(
        API.CommonApi.GetPollutantTypeList,
        params,
        null,
    );
    return result 
}

