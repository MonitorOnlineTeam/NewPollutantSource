/**
 * 功  能：收数据导入请求地址services
 * 创建人：dongxiaoyun
 * 创建时间：2019.08.9
 */
import { post, get } from '@/utils/request';


/**
 * 上传附件
 * @params {"file":"","fileName":"","DGIMN":""}
 */
export async function uploadfiles(params) {
  const result = post('/api/rest/PollutantSourceApi/ManualSupplement/UploadFiles', params, null);
  return result;
}

/**
 * 获取下拉列表
 * @params {"DGIMN":""}
 */
export async function GetPollutantByPoint(params) {
  const result = post('/api/rest/PollutantSourceApi/ManualSupplement/GetPollutantByDGIMN', params, null);
  return result;
}
/**
 * 获取下拉列表(添加页面，不用同一个方法，否则会导致数据为空的问题)
 * @params {"DGIMN":""}
 */
export async function addGetPollutantByPoint(params) {
  const result = post('/api/rest/PollutantSourceApi/ManualSupplement/GetPollutantByDGIMNAdd', params, null);
  return result;
}

/**
 * 获取列表数据
 * @params {"DGIMN":"","pollutantCode":"","beginTime":"","endTime":"","pageIndex":"","pageSize":""}
 */
export async function GetManualSupplementList(params) {
  const result = post('/api/rest/PollutantSourceApi/ManualSupplement/GetManualSupplementList', params, null);
  return result;
}
/**
 * 获取模板地址
 * @params {"PollutantType":""}
 */
export async function getUploadTemplate(params) {
  const body = {
      PollutantType:params.PollutantType
  };
  const result = post('/api/rest/PollutantSourceApi/ManualSupplement/UploadTemplate', params, null);
  return result;
}
/**
 * 获取污染物类型列表
 * @params {"DGIMN":""}
 */
export async function GetAllPollutantTypes(params) {
  const result = post('/api/rest/PollutantSourceApi/ManualSupplement/GetAllPollutantTypes', params, null);
  return result;
}
/**
 * 添加手工数据
 * @params {"pollutantCode":"","monitorTime":"","avgValue":"","DGIMN":""}
 */
export async function AddUploadFiles(params) {
  const result = post('/api/rest/PollutantSourceApi/ManualSupplement/AddUploadFiles', params, null);
  return result;
}

/**
 * 获取污染物单位
 * @params {"pollutantCode":""}
 */
export async function GetUnitByPollutant(params) {
  const result = post('/api/rest/PollutantSourceApi/ManualSupplement/GetUnitByPollutant', params, null);
  return result;
}
/**
 * 删除数据
 * @params {"DGIMN":"","pollutantCode":"","monitorTime":""}
 */
export async function DeleteUploadFiles(params) {
  const result = post('/api/rest/PollutantSourceApi/ManualSupplement/DeleteUploadFiles', params, null);
  return result;
}
/**
 * 修改数据
 * @params {"DGIMN":"","pollutantCode":"","monitorTime":"","avgValue":""}
 */
export async function UpdateManualSupplementData(params) {
  const result = post('/api/rest/PollutantSourceApi/ManualSupplement/UpdateHourData', params, null);
  return result;
}