/**
 * 功  能：备品备件上传自动services
 * 创建人：dongxiaoyun
 * 创建时间：2020.05.21
 */
import { post, get } from '@/utils/request';


/**
 * 获取列表数据
 * @params {"DGIMN":"","pollutantCode":"","beginTime":"","endTime":"","pageIndex":"","pageSize":""}
 */
export async function GetSparepartManageList(params) {
  const result = await get('/api/rest/PollutantSourceApi/SparepartManageApi/GetSparepartManageList', params, null);
  return result;
}
/**
 * 获取服务站数据
 * @params {"DGIMN":"","pollutantCode":"","beginTime":"","endTime":"","pageIndex":"","pageSize":""}
 */
export async function GetSparePartsStation(params) {
  debugger
  const result = await get('/api/rest/PollutantSourceApi/SparepartManageApi/GetSparePartsStation', params, null);
  return result;
}
/**
 * 获取模板地址
 * @params {"PollutantType":""}
 */
export async function getUploadTemplate(params) {
  const result = get('/api/rest/PollutantSourceApi/SparepartManageApi/UploadTemplateSpareParts', params, null);
  return result;
}
/**
 * 删除数据
 * @params {"DGIMN":"","pollutantCode":"","monitorTime":""}
 */
export async function DeleteSpareParts(params) {
  const result = post('/api/rest/PollutantSourceApi/SparepartManageApi/DeleteSpareParts', params, null);
  return result;
}
/**
 * 修改数据
 * @params {"DGIMN":"","pollutantCode":"","monitorTime":"","avgValue":""}
 */
export async function UpdateSpareParts(params) {
  const result = post('/api/rest/PollutantSourceApi/SparepartManageApi/UpdateSpareParts', params, null);
  return result;
}



