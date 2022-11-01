/**
 * 功  能：停运记录
 * 创建人：胡孟弟
 * 创建时间：2020.10.22
 */
import { post } from '@/utils/request';
import { API } from '@config/API'
import { async } from 'q';
//根据 企业 获取 监测点
export async function GetPointByEntCode(params) {
    const result = await post(API.BaseDataApi.GetPointByEntCode, params);
    return result
}

//获取数据列表
export async function GetStopList(params) {
    const result = post(API.BaseDataApi.GetStopList, params, null)
    return result
}
//导出数据列表
export async function ExportStopList(params) {
    // const result = post('/api/rest/PollutantSourceApi/BaseDataApi/ExportStopList', params, null)
    const result = post(API.ExportApi.ExportStopList, params)
    return result
}



