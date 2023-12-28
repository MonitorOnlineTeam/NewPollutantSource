/**
 * 功  能：超标数据报警核实记录查询
 * 创建人：胡孟弟
 * 创建时间：2020.10.20
 */
import { post } from '@/utils/request';
import { async } from 'q';
import { API } from '@config/API'

//企业
export async function GetEntByRegion(params)
{
    const result = post(API.CommonApi.GetEntByRegion,{regionCode:params.RegionCode},  null)
    return result;
}
//超标报警审核
export async function GetAlarmVerifyRate(params)
{
    const result = post(API.IntelligentDiagnosisApi.GetAlarmVerifyRate,params,null)
    return result 
}
//超标报警审核详情
export async function GetAlarmVerifyRateDetail(params)
{
    const result = post(API.IntelligentDiagnosisApi.GetAlarmVerifyRateDetail,params,null)
    return result 
}
//超标报警审核详细
export async function GetAlarmVerifyDetail(params)
{
    const result = post(API.IntelligentDiagnosisApi.GetAlarmVerifyDetail,params,null)
    return result 
}
//导出超标报警审核
export async function ExportAlarmVerifyRate(params)
{
    const result = post(API.IntelligentDiagnosisApi.ExportAlarmVerifyRate,params,null)
    return result 
}
//导出超标报警审核详情
export async function ExportAlarmVerifyRateDetail(params)
{
    const result = post(API.IntelligentDiagnosisApi.ExportAlarmVerifyRateDetail,params,null)
    return result 
}
//导出超标报警审核详细
export async function ExportAlarmVerifyDetail(params)
{
    const result = post(API.IntelligentDiagnosisApi.ExportAlarmVerifyDetail,params,null)
    return result 
}
//监测因子列表
export async function GetPollutantCodeList(params)
{
    const result = post(API.CommonApi.GetPollutantCodeList,params,null)
    return result 
}
//核实结果
export async function GetOverToExamineOperation(params)
{
    const result = post(API.IntelligentDiagnosisApi.GetOverToExamineOperation,null,null)
    return result 
}
