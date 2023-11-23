/**
 * 功  能：超标数据查询
 * 创建人：胡孟弟
 * 创建时间：2020.10.14
 */
import { post } from '@/utils/request';
import { async } from 'q';
import { API } from '@config/API'

//获取流量数据
export async function GetPollutantByType(params){
    const result = post(`/api/rest/PollutantSourceApi/BaseDataApi/GetExceedPollutantByType?type=${params.type}`,{})
    return result 
}
//查询超标数据
export async function GetExceedDataList(params)
{
    const result = post('/api/rest/PollutantSourceApi/BaseDataApi/GetExceedDataList',params,null)
    return result 
}
//超标次数查询
export async function GetExceedNum(params)
{
    const result = post('/api/rest/PollutantSourceApi/BaseDataApi/GetExceedNum',params,null)
    return result 
}
//企业
export async function GetEntByRegion(params)
{
    const result = post(API.CommonApi.GetEntByRegion,{regionCode:params.RegionCode},  null)
    return result;
}
//导出超标数据
export async function ExportExceedDataList(params)
{
    const result = post('/api/rest/PollutantSourceApi/BaseDataApi/ExportExceedDataList',params,null)
    return result 
}
//导出超标次数数据
export async function ExportExceedNum(params)
{
    const result = post('/api/rest/PollutantSourceApi/BaseDataApi/ExportExceedNum',params,null)
    return result 
}


