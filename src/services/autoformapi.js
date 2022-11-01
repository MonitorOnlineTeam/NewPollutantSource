
/**
 * 功  能：AutoForm基本服务
 * 创建人：吴建伟
 * 创建时间：2019.04.29
 */

import { post, get } from '@/utils/request';
import { API } from '@config/API'

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
  const result = await get(
    API.autoFormApi.GetPageConfigInfo,
    body,
    null,
  );
  return result;
}

/**
 * 【AutoForm】获取页面高级查询表单
 * @params {"configId": "TestCommonPoint"}
 */
export async function getListPager(payload) {
  let params = payload;
  const result = await post(
    API.autoFormApi.GetListPager,
    params,
    null,
  );
  return result;
}


/**
 * 【AutoForm】获取编辑或添加页面表单元素的值
 * @params {"configId": "TestCommonPoint"}
 */
export async function getFormData(payload) {
  let params = payload;

  const defaults = {
    configId: 'TestCommonPoint',
  };
  const result = await get(
    API.autoFormApi.GetFormData,
    params,
    null,
  );
  return result;
}

/**
 * 【AutoForm】数据删除（支持批量）
 * @params {"configId": "TestCommonPoint"}
 */
export async function postAutoFromDataDelete(payload) {
  let params = payload;
  const result = await post(
    API.autoFormApi.PostAutoFromDataDelete,
    params,
    null,
  );
  return result;
}
/**
 * 【AutoForm】数据添加
 * @params {"configId": "TestCommonPoint",FormData:'{name:1,code:"123"}'}
 */
export async function postAutoFromDataAdd(payload) {
  let params = payload;
  const result = await post(
    API.autoFormApi.PostAutoFromDataAdd,
    params,
    null,
  );
  return result;
}

/**
 * 【AutoForm】修改
 * @params {"configId": "TestCommonPoint",FormData:'{name:1,code:"123"}'}
 */
export async function postAutoFromDataUpdate(payload) {
  let params = payload;
  const result = await post(
    API.autoFormApi.PostAutoFromDataUpdate,
    params,
    null,
  );
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
  const result = await post(
    API.commonApi.GetAttachmentList,
    params,
    null,
  );
  return result;
}

/**
 * 【AutoForm】导出
 * @params {"configId": "String"}
 */
export async function exportDataExcel(payload) {
  const result = await post(
    API.autoFormApi.ExportDataExcel,
    payload,
    null,
  );
  return result;
}

/**
 * 【AutoForm】下载导入模板
 * @params {"configId": "String"}
 */
export async function exportTemplet(payload) {
  const result = await post(
    API.autoFormApi.ExportTemplet,
    payload,
    null,
  );
  return result;
}

/**
 * 【AutoForm】下载导入模板
 * @params {"configId": "String"}
 */
export async function fileUpload(params) {
  const result = await post('/upload/rest/PollutantSourceApi/UploadApi/PostFiles', params, null);
  return result;
}

// 删除文件
export async function deleteAttach(params) {
  const result = await post(API.UploadApi.DeleteAttach, params, null);
  return result;
}
// 校验重复
export async function checkRepeat(payload) {
  const result = await post(
    API.autoFormApi.VerificationData,
    payload,
    null,
  );
  return result;
}
