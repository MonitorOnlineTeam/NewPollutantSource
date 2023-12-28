/**
 * 功  能：停运记录
 * 创建人：胡孟弟
 * 创建时间：2020.10.22
 */
import { post } from '@/utils/request';
import { async } from 'q';
import { API } from '@config/API';

//根据 企业 获取 监测点
export async function GetPointByEntCode(params)
{
    const result = post(API.CommonApi.GetPointByEntCode,params,null)
    return result 
}

//获取数据列表
export async function GetStopList(params){
    const result = post(API.IntelligentDiagnosisApi.GetStopList,params,null)
    return result 
}
//导出数据列表
export async function ExportStopList(params){
    const result = post(API.IntelligentDiagnosisApi.ExportStopList,params,null)
    return result 
}



