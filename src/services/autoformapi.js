/**
 * 功  能：AutoForm基本服务
 * 创建人：吴建伟
 * 创建时间：2019.04.29
 */

import { post, get } from '@/utils/request';
import { API } from '@config/API';

/**
 * 【AutoForm】获取页面配置信息
 * @params {"configId": "TestCommonPoint"}
 */
export async function getPageConfigInfo(payload) {
  const param = {
    configId: 'TestCommonPoint',
    ...payload,
  };
  const defaults = {
    // PageIndex: 1,
    // PageSize: 200,
  };
  const body = Object.assign(defaults, param);
  const result = await get(API.AutoFormApi.GetPageConfigInfo, body, null);
  return result;
}

/**
 * 【AutoForm】获取页面高级查询表单
 * @params {"configId": "TestCommonPoint"}
 */
export async function getListPager(payload) {
  const result = await post(API.AutoFormApi.GetListPager, payload, null);
  return result;
}

/**
 * 【AutoForm】获取编辑或添加页面表单元素的值
 * @params {"configId": "TestCommonPoint"}
 */
export async function getFormData(payload) {
  const result = await get(API.AutoFormApi.GetFormData, payload, null);
  return result;
}

/**
 * 【AutoForm】数据删除（支持批量）
 * @params {"configId": "TestCommonPoint"}
 */
export async function postAutoFromDataDelete(payload) {
  let params = payload;
  const result = await post(API.AutoFormApi.PostAutoFromDataDelete, params, null);
  return result;
}
/**
 * 【AutoForm】数据添加
 * @params {"configId": "TestCommonPoint",FormData:'{name:1,code:"123"}'}
 */
export async function postAutoFromDataAdd(payload) {
  const result = await post(API.AutoFormApi.PostAutoFromDataAdd, payload, null);
  return result;
}

/**
 * 【AutoForm】修改
 * @params {"configId": "TestCommonPoint",FormData:'{name:1,code:"123"}'}
 */
export async function postAutoFromDataUpdate(payload) {
  const result = await post(API.AutoFormApi.PostAutoFromDataUpdate, payload, null);
  return result;
}

/**
 * 【AutoForm】修改
 * @params {"configId": "TestCommonPoint",FormData:'{name:1,code:"123"}'}
 */
export async function getRegions(params) {
  const result = await get(API.RegionApi.GetRegions, params, null);
  return result;
}

/**
 * 【AutoForm】获取附件列表
 * @params {"FileUuid": "String"}
 */
export async function getAttachmentList(params) {
  const result = await post(API.UploadApi.GetAttachmentList, params, null);
  return result;
}

/**
 * 【AutoForm】导出
 * @params {"configId": "String"}
 */
export async function exportDataExcel(payload) {
  const result = await post(API.AutoFormApi.ExportDataExcel, payload, null);
  return result;
}

/**
 * 【AutoForm】下载导入模板
 * @params {"configId": "String"}
 */
export async function exportTemplet(payload) {
  const result = await post(API.AutoFormApi.ExportTemplet, payload, null);
  return result;
}

/**
 * 【AutoForm】下载导入模板
 * @params {"configId": "String"}
 */
export async function fileUpload(params) {
  const result = await post(API.UploadApi.UploadFiles, params, null);
  return result;
}

// 删除文件
export async function deleteAttach(params) {
  const result = await post(API.UploadApi.DeleteAttach, params, null);
  return result;
}
// 校验重复
export async function checkRepeat(payload) {
  const result = await post(API.AutoFormApi.VerificationData, payload, null);
  return result;
}

//企业设置电子围栏半径 运维
export async function addOrUpdOperationSignRadiusInfo(params) {
  const result = await post(API.EntAndPointApi.AddOrUpdOperationSignRadiusInfo, params, null);
  return result;
}

//企业获取电子围栏半径 运维
export async function getOperationSignRadiusInfo(params) {
  const result = await post(API.EntAndPointApi.GetOperationSignRadiusInfo, params, null);
  return result;
}
