/**
 * 功  能：备品备件上传自动services
 * 创建人：dongxiaoyun
 * 创建时间：2020.05.21
 */
import { post, get } from '@/utils/request';
import { API} from '@config/API';


/**
 * 获取列表数据
 * @params {"DGIMN":"","pollutantCode":"","beginTime":"","endTime":"","pageIndex":"","pageSize":""}
 */
export async function GetSparepartManageList(params) {
  const result = await post(API.AssetManagementApi.GetSparepartList, params, null);
  return result;
}
/**
 * 获取服务站数据
 * @params {"DGIMN":"","pollutantCode":"","beginTime":"","endTime":"","pageIndex":"","pageSize":""}
 */
export async function GetSparePartsStation(params) {
  const result = await get('/api/rest/PollutantSourceApi/SparepartManageApi/GetSparePartsStation', params, null);
  return result;
}
/**
 * 获取模板地址
 * @params {"PollutantType":""}
 */
export async function getUploadTemplate(params) {
  const result =await post(API.AssetManagementApi.DownLoadSparePartsTemplateInfo, params, null);
  return result;
}
/**
 * 删除数据
 * @params {"DGIMN":"","pollutantCode":"","monitorTime":""}
 */
export async function DeleteSpareParts(params) {
  const result =await post(API.AssetManagementApi.DeleteSparePartsInfo, params, null);
  return result;
}
/**
 * 修改数据
 * @params {"DGIMN":"","pollutantCode":"","monitorTime":"","avgValue":""}
 */
export async function UpdateSpareParts(params) {
  const result =await post(API.AssetManagementApi.UpdateSparePartsInfo, params, null);
  return result;
}

/**
 * 仓库管理
 * 
 */
export async function GetStorehouse(params) {
  const result =await post(API.AutoFormApi.GetListPager, {configId:'Storehouse'}, null);
  return result;
}

/**
 * 设备监测类型
 * 
 */
// export async function GetMonitoringTypeList(params) {
//   const result =await post(API.AssetManagementApi.GetMonitoringCategoryList, params, null);
//   return result;
// }

