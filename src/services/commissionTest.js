/**
 * 
 * 调试检测公共接口
 */
import { post, get } from '@/utils/request';

//  获取设备厂家列表
export async function GetManufacturerList(params) {
    const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetTestManufacturerList', params, null);
    return result;
}

//  获取监测类型
export async function GetPollutantById(params) {
    const result = await post(`/api/rest/PollutantSourceApi/BaseDataApi/GetTestPollutantList`, null);
    return result;
}
//  获取系统名称列表
export async function GetSystemModelNameList(params) {
    const result = await post(`/api/rest/PollutantSourceApi/BaseDataApi/GetSystemModelNameList`, null);
    return result;
}