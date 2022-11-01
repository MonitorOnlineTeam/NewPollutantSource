/**
 * 功  能：手工数据上传自动services
 * 创建人：dongxiaoyun
 * 创建时间：2019.08.9
 */
import { post, get } from '@/utils/request';
import { API } from '@config/API'

/**
 * 上传附件
 * @params {"file":"","fileName":"","DGIMN":""}
 */
export async function uploadfiles(params) {
  const result = post('/api/rest/PollutantSourceApi/ManualSupplementApi/UploadFilesAuto', params, null);
  return result;
}

/**
 * 获取下拉列表
 * @params {"DGIMN":""}
 */
export async function GetPollutantByPoint(params) {
  const result = get(API.PollutantApi.GetMonitorRelationPollutantByDGIMN, params, null);
  return result;
}
/**
 * 获取下拉列表(添加页面，不用同一个方法，否则会导致数据为空的问题)
 * @params {"DGIMN":""}
 */
export async function addGetPollutantByPoint(params) {
  const result = get(API.PollutantApi.GetPollutantByDGIMN, params, null);
  return result;
}

/**
 * 获取列表数据
 * @params {"DGIMN":"","pollutantCode":"","beginTime":"","endTime":"","pageIndex":"","pageSize":""}
 */
export async function GetManualSupplementList(params) {
  const result = await post(API.MonitorDataApi.GetDataOrReferenceData, params, null);
  return result;
}

/**
 * 获取列表数据 - 碳中和
 * @params {"DGIMN":"","pollutantCode":"","beginTime":"","endTime":"","pageIndex":"","pageSize":""}
 */
export async function GetManualSupplementListAutoReference(params) {
  const result = await post(API.MonitorDataApi.GetDataOrReferenceData, {
    ...params,
    ReferenceOrData: 'reference'
  }, null);
  return result;
}

/**
 * 获取模板地址
 * @params {"PollutantType":""}
 */
export async function getUploadTemplate(params) {
  const result = get('/api/rest/PollutantSourceApi/ManualSupplementApi/UploadTemplateAuto', params, null);
  return result;
}

/**
 * 获取模板地址 - 碳排放
 * @params {"PollutantType":""}
 */
export async function getUploadTemplateAutoReference(params) {
  const result = get(API.MonitorDataApi.UploadTemplateAutoReference, params, null);
  return result;
}


/**
 * 删除数据
 * @params {"DGIMN":"","pollutantCode":"","monitorTime":""}
 */
export async function DeleteUploadFiles(params) {
  const result = post('/api/rest/PollutantSourceApi/ManualSupplementApi/DeleteUploadFilesAuto', params, null);
  return result;
}
/**
 * 修改数据
 * @params {"DGIMN":"","pollutantCode":"","monitorTime":"","avgValue":""}
 */
export async function UpdateManualSupplementData(params) {
  const result = post('/api/rest/PollutantSourceApi/ManualSupplementApi/UpdateManualSupplementAuto', params, null);
  return result;
}

/**
 * 补发数据
 * @params {"DGIMN":"","pollutantCode":"","monitorTime":"","avgValue":""}
 */
export async function CounterSendCMDMsg(params) {
  const result = post(API.MonitorDataApi.SendSupplementMsg, params, null);
  return result;
}

/**
 * 统计AQI
 * @params {"DGIMN":"","pollutantCode":"","monitorTime":"","avgValue":""}
 */
export async function CalculationAQIData(params) {
  const result = post(API.AirDataApi.CalculationAQIData, params, null);
  return result;
}
