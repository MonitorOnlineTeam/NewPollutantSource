/**
 * 功  能：企业监测点查询
 * 创建人：胡孟弟
 * 创建时间：2020.10.12
 */
import { post } from '@/utils/request';
import { async } from 'q';
//关注度列表
export async function GetAttentionDegreeList() {

    const result = post(
        '/api/rest/PollutantSourceApi/BaseDataApi/GetAttentionDegreeList',
        null,
        null
    )
    return result
}
//获取企业信息
export async function GetEntSummary(params) {
    const result = post(
        '/api/rest/PollutantSourceApi/BaseDataApi/GetEntSummary',
        params,
        null
    )
    return result
}
//获取企业详细信息
export async function GetPointSummary(params) {
    const result = post(
        '/api/rest/PollutantSourceApi/BaseDataApi/GetPointSummary',
        params,
        null
    )
    return result
}
//行政区企业下钻
export async function GetEntOrPointDetail(params)
{
    const result = post(
        '/api/rest/PollutantSourceApi/BaseDataApi/GetEntOrPointDetail',
        params,
        null
    )
    return result
}
//导出企业信息
export async function ExportEntSummary(params) {
    const result = post(
        '/api/rest/PollutantSourceApi/BaseDataApi/ExportEntSummary',
        params,
        null
    )
    return result
}
//导出企业详细信息
export async function ExportPointSummary(params) {
    const result = post(
        '/api/rest/PollutantSourceApi/BaseDataApi/ExportPointSummary',
        params,
        null
    )
    return result
}
//导出行政区企业下钻
export async function ExportEntOrPointDetail(params)
{
    const result = post(
        '/api/rest/PollutantSourceApi/BaseDataApi/ExportEntOrPointDetail',
        params,
        null
    )
    return result
}
//根据行政区获取 企业列表

export async function GetEntByRegion(params) {
    const result = post(
      '/api/rest/PollutantSourceApi/TransmissionEfficiencyApi/GetEntByRegion?RegionCode=' +
        params.RegionCode,
      null,
      null,
    );
  
    return result;
  }
