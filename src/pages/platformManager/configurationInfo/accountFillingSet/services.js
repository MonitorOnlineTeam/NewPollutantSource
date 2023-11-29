import { post, get, getNew } from '@/utils/request';
import { API } from '@config/API'

/**
 * 
 * 点位匹配
 */

//列表
export async function GetEntAccountTypeList(params) {
  const result = await post(API.AssetManagementApi.GetCalibrationAccountFillingTypeList,params, null);
  return result;
}

 
// 添加修改 填报方式
export async function AddOrUpaAccountType(params) {
  const result = await post(API.AssetManagementApi.UpdateCalibrationAccountFillingTypeInfo,params, null);
  return result;
}




// 导出
export async function ExportEntAccountTypeList(params) {
  const result = await post(API.AssetManagementApi.ExportCalibrationAccountFillingTypeList,params, null);
  return result;
}
