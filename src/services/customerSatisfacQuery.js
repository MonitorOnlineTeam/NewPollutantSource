import { post } from '@/utils/request';
import { API } from '@config/API';

// 获取客户满意度调查信息
export async function GetSatisfactionSurveyList(params) {
    const result = await post(API.CustomerSatisfactionApi.GetSatisfactionSurveyList, params, null);
    return result;
}
// 客户满意度调查信息 导出
export async function ExportSatisfactionSurvey(params) {
    const result = await post(API.CustomerSatisfactionApi.ExportSatisfactionSurvey, params, null);
    return result;
}
// 客户满意度调查提交
export async function SubmitSurvey(params) {
    const result = await post(API.CustomerSatisfactionApi.SubmitSurvey, params, null);
    return result;
}
//客户满意度调查处理
export async function SubmitProcessed(params) {
    const result = await post(API.CustomerSatisfactionApi.SubmitProcessed, params, null);
    return result;
}
// 客户满意度终止调查
export async function SubmitRermination(params) {
    const result = await post(API.CustomerSatisfactionApi.SubmitRermination, params, null);
    return result;
}
// 客户满意度转发
export async function TransmitSurvey(params) {
    const result = await post(API.CustomerSatisfactionApi.SubmitRermination, params, null);
    return result;
}