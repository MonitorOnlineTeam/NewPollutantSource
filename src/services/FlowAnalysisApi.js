/**
 * 功  能：污染物流量分析
 * 创建人：胡孟弟
 * 创建时间：2020.10.12
 */
import { post } from '@/utils/request';
import { async } from 'q';
import { API } from '@config/API'

//获取流量数据
export async function GetSewageFlowList(params){

    const result = post(
        '/api/rest/PollutantSourceApi/MonDataApi/GetSewageFlowList',
        params,
        null
    )
    return result 
}

export async function ExportSewageFlowList(params)
{
    const result = post(
        '/api/rest/PollutantSourceApi/MonDataApi/ExportSewageFlowList',
        params,
        null
    )
    return result 
}

//根据行政区获取 企业列表

export async function GetEntByRegion(params) {
    const result = post(API.CommonApi.GetEntByRegion,{regionCode:params.RegionCode,isSewage:params.IsSewage},  null)
    return result;
  }
