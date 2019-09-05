/**
 * 功  能：报警及时响应统计
 * 创建人：吴建伟
 * 创建时间：2018.12.10
 */

import {post} from '@/utils/request';

/**
 * 【报警及时响应】获取报警及时响应所有月统计数据
 * @params {"beginTime":"2018-11-01 00:00:00","endTime":"2018-11-30 00:00:00"}
 */
export async function getAlarmResponseAllMonthStatistics(params) {
    const body = {
        beginTime: params.beginTime,
        endTime: params.endTime,
        // EORSort: params.EORSort,
        pageIndex: params.pageIndex || 1,
        pageSize: params.pageSize || 20
    };

    const result = post('/api/rest/PollutantSourceApi/DataStatistics/GetAlarmResponseAllMonthStatistics', body, null);

    return result === null ? {
        Datas: null
    } : result;
}

/**
 * 【报警及时响应】根据月份获取所有排口报警及时响应数据
 * @params {"monthTime":"2018-11-01 00:00:00"}
 */
export async function getSingleMonthAllPointAlarmResponseStatistics(params) {
    const body = {
        monthTime: params.monthTime,
        sort2: params.sort2 || '',
        sort8: params.sort8 || '',
        pageIndex: params.pageIndex || 1,
        pageSize: params.pageSize || 20
    };

    const result = post('/api/rest/PollutantSourceApi/DataStatistics/GetSingleMonthAllPointAlarmResponseStatistics', body, null);

    return result === null ? {
        Datas: null
    } : result;
}

/**
 * 【报警及时响应】根据月份、排口获取单个排口每一天所有报警及时响应数据
 * @params {"DGIMNs":"sgjt001003","monthTime":"2018-12-01 00:00:00"}
 */
export async function getSinglePointDaysAlarmResponseStatistics(params) {
    const body = {
        monthTime: params.monthTime,
        DGIMNs: params.DGIMNs,
        sort2: params.sort2 || '',
        sort8: params.sort8 || '',
        pageIndex: params.pageIndex || 1,
        pageSize: params.pageSize || 20
    };

    const result = post('/api/rest/PollutantSourceApi/DataStatistics/GetSinglePointDaysAlarmResponseStatistics', body, null);

    return result === null ? {
        Datas: null
    } : result;
}

/**
 * 异常报警响应列表
 * @params {"DGIMNs":"sgjt001003","TaskId":""}
 */
export async function GetAlarmResponseList(params) {
    const body = {
        DGIMNs: params.DGIMN,
        TaskId: params.TaskID
    };

    const result = post('/api/rest/PollutantSourceApi/PWorkbench/GetAlarmResponseList?authorCode=48f3889c-af8d-401f-ada2-c383031af92d', body, null);

    return result === null ? {
        Datas: null
    } : result;
}
