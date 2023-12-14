/**
 * 功  能：超标数据报警核实记录查询
 * 创建人：胡孟弟
 * 创建时间：2020.10.20
 */
import { post } from '@/utils/request';
import { async } from 'q';
import { API } from '@config/API'
//根据 行政区和关注度 获取企业列表
export async function GetEntByRegionAndAtt(params)
{
    const result = post(API.CommonApi.GetEntByRegionAndAtt,params,null)
    return result 
}
//根据 企业 获取 监测点
export async function GetPointByEntCode(params)
{
    const result = post(API.CommonApi.GetPointByEntCode,params,null)
    return result 
}
//数据列表
export async function GetAllTypeDataListWater(params)
{
    const result = post(API.WholeProcessMonitorApi.GetAllTypeDataListWater,params,null)
    return result 
}

//导出 数据列表
export async function ExportAllTypeDataListWater(params)
{
    const result = post(API.WholeProcessMonitorApi.ExportAllTypeDataListWater,params,null)
    return result 
}


