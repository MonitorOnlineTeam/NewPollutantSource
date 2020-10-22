/**
 * 功  能：超标数据报警处置记录查询
 * 创建人：胡孟弟
 * 创建时间：2020.10.21
 */
import { post } from '@/utils/request';
import { async } from 'q';
//企业
export async function GetEntByRegion(params)
{
    const result = post('/api/rest/PollutantSourceApi/TransmissionEfficiencyApi/GetEntByRegion?RegionCode='+params.RegionCode,null)
    return result 
}
//超标报警处置
export async function GetAlarmManagementRate(params)
{
    const result = post('/api/rest/PollutantSourceApi/BaseDataApi/GetAlarmManagementRate',params,null)
    return result 
}
//超标报警处置详情
export async function GetAlarmManagementRateDetail(params)
{
    const result = post('/api/rest/PollutantSourceApi/BaseDataApi/GetAlarmManagementRateDetail',params,null)
    return result 
}
//超标报警处置详细
export async function GetAlarmManagementDetail(params)
{
    const result = post('/api/rest/PollutantSourceApi/BaseDataApi/GetAlarmManagementDetail',params,null)
    return result 
}
//监测因子列表
export async function GetPollutantCodeList(params)
{
    const result = post('/api/rest/PollutantSourceApi/BaseDataApi/GetPollutantCodeList',params,null)
    return result 
}
//处置结果
export async function GetAlarmDealType(params)
{
    const result = post('/api/rest/PollutantSourceApi/BaseDataApi/GetAlarmDealType',params,null)
    return result 
}

