/**
 * 
 * 调试检测公共接口
 */
import { post, get } from '@/utils/request';
import { API } from '@config/API'

//  获取设备厂家列表
export async function GetManufacturerList(params) {
    const result = await post(API.CtAssetManagementApi.GetEquipmentManufacturerInventory, params, null);
    return result;
}

//  获取监测类型
export async function GetPollutantById(params) {
    const result = await post(`/api/rest/PollutantSourceApi/BaseDataApi/GetTestPollutantList?type=${params.type? params.type : ' '}`, null);
    return result;
}
//  获取系统名称列表
export async function GetSystemModelNameList(params) {
    const result = await post(API.AssetManagementApi.GetSystemModelNameList, null);
    return result;
}