/**
 * 功  能：超标数据报警核实记录查询
 * 创建人：胡孟弟
 * 创建时间：2020.10.20
 */
import { post } from '@/utils/request';
import { API } from '@config/API'
import { async } from 'q';
//企业
export async function GetEntByRegion(params) {
    const result = post(API.RegionApi.GetEntByRegion, params);
    return result
}
//超标报警审核
export async function GetAlarmVerifyRate(params) {
    const result = post(API.AlarmApi.GetAlarmVerifyRate, params, null)
    return result
}
//超标报警审核详情
export async function GetAlarmVerifyRateDetail(params) {
    const result = post(API.AlarmApi.GetAlarmVerifyRateDetail, params, null)
    return result
}
//超标报警审核详细
export async function GetAlarmVerifyDetail(params) {
    const result = post(API.AlarmApi.GetAlarmVerifyDetail, params, null)
    return result
}
//导出超标报警审核
export async function ExportAlarmVerifyRate(params) {
    const result = post(API.ExportApi.ExportAlarmVerifyRate, params, null)
    return result
}
//导出超标报警审核详情
export async function ExportAlarmVerifyRateDetail(params) {
    const result = post('/api/rest/PollutantSourceApi/BaseDataApi/ExportAlarmDetaiInfolList', params, null)
    return result
}
//导出超标报警审核详细
export async function ExportAlarmVerifyDetail(params) {
    const result = post(API.ExportApi.ExportAlarmVerifyDetail, params, null)
    return result
}
//监测因子列表
export async function GetPollutantCodeList(params) {
    const result = post(API.commonApi.GetPollutantCodeList, params);
    return result
}
//核实结果
export async function GetOverToExamineOperation(params) {
    const result = post(API.AlarmApi.GetOverToExamineOperation, null, null)
    return result
}
