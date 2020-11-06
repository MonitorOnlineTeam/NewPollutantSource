/*
 * @Description:运维工单统计 sercive
 * @LastEditors: hxf
 * @Date: 2020-10-27 16:33:44
 * @LastEditTime: 2020-11-06 18:39:45
 * @FilePath: /NewPollutantSource/src/services/airWorkOrderApi.js
 */
import { post, get } from '@/utils/request';

// 运维工单统计 表头    运维工单统计标题栏  PollutantTypeCode
export async function GetTaskStaticTitle(params) {
    const result = get('/api/rest/PollutantSourceApi/TaskFormApi/GetTaskStaticTitle', params, null);
    return result;
}

// 运维工单统计 数据    运维工单统计
/**
    {
        PollutantTypeCode: '5',
        AttentionCode: 1,
        RegionCode: '',
        EntCode: '',
        BeginTime: '2020-01-01 00:00:00',
        EndTime: '2020-09-30 23:59:59',
    }
 */
export async function GetTaskStatic(params) {
    const result = post('/api/rest/PollutantSourceApi/TaskFormApi/GetTaskStatic', params, null);
    return result;
}

// 区域 运维工单统计 表头    行政区运维工单统计标题栏  PollutantTypeCode
export async function GetTaskStatic4RegionTitle(params) {
    const result = get(
        '/api/rest/PollutantSourceApi/TaskFormApi/GetTaskStatic4RegionTitle',
        params,
        null,
    );
    return result;
}

// 区域 运维工单统计 数据    运维行政区工单统计
/**
    {
        PollutantTypeCode: '5',
        AttentionCode: 1,
        RegionCode: '',
        EntCode: '',
        BeginTime: '2020-01-01 00:00:00',
        EndTime: '2020-09-30 23:59:59',
    }
 */
export async function GetTaskStatic4Region(params) {
    const result = post(
        '/api/rest/PollutantSourceApi/TaskFormApi/GetTaskStatic4Region',
        params,
        null,
    );
    return result;
}

// 企业 运维工单统计 表头    运维企业工单统计标题栏  PollutantTypeCode
export async function GetTaskStatic4EnterpriseTitle(params) {
    const result = get(
        '/api/rest/PollutantSourceApi/TaskFormApi/GetTaskStatic4EnterpriseTitle',
        params,
        null,
    );
    return result;
}

// 企业 运维工单统计 数据    运维企业工单统计
/**
    {
        PollutantTypeCode: '5',
        AttentionCode: 1,
        RegionCode: '',
        EntCode: '',
        BeginTime: '2020-01-01 00:00:00',
        EndTime: '2020-09-30 23:59:59',
    }
 */
export async function GetTaskStatic4Enterprise(params) {
    const result = post(
        '/api/rest/PollutantSourceApi/TaskFormApi/GetTaskStatic4Enterprise',
        params,
        null,
    );
    return result;
}

// 排口（企业） 运维工单统计 表头    运维排口工单统计标题栏  PollutantTypeCode
export async function GetTaskStatic4PointTitle(params) {
    const result = get(
        '/api/rest/PollutantSourceApi/TaskFormApi/GetTaskStatic4PointTitle',
        params,
        null,
    );
    return result;
}

// 排口（企业） 运维工单统计 数据    运维企业工单统计
/**
    {
        PollutantTypeCode: '5',
        AttentionCode: 1,
        RegionCode: '',
        EntCode: '',
        BeginTime: '2020-01-01 00:00:00',
        EndTime: '2020-09-30 23:59:59',
    }
 */
export async function GetTaskStatic4Point(params) {
    const result = post('/api/rest/PollutantSourceApi/TaskFormApi/GetTaskStatic4Point', params, null);
    return result;
}
