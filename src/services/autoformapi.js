
/**
 * 功  能：AutoForm基本服务
 * 创建人：吴建伟
 * 创建时间：2019.04.29
 */

import Cookie from 'js-cookie';
import { post, get } from '@/utils/request';
import { async } from 'q';
import configToken from '@/config';
import { JSEncrypt } from 'encryptlong';
import Base64 from 'crypto-js/enc-base64';
import Utf8 from 'crypto-js/enc-utf8';
import { encryptKey } from '@/utils/utils';
import ContentList from '@/pages/platformManager/manualupload/components/ContentList';

const configinfopage = '/api/rest/PollutantSourceApi/SystemSettingApi/GetSystemConfigInfo';

/**
 * 【AutoForm】获取页面配置信息
 * @params {"configId": "TestCommonPoint"}
 */
export async function getPageConfigInfo(payload) {
  const param = {
    configId: 'TestCommonPoint',
    ...payload.params,
  };
  const defaults = {
    PageIndex: 1,
    PageSize: 200,
  };
  const body = Object.assign(defaults, param);
  //判断配置是否开启明文传输0开启 1关闭
  if (payload.sysConfig.ClearTransmission == 0) {
    var encrypt = new window.JSEncrypt();
    encrypt.setPublicKey(encryptKey);
    body.configId = encrypt.encrypt(body.configId);
  }
  const result = await get(
    '/api/rest/PollutantSourceApi/AutoFormDataApi/GetPageConfigInfo',
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
  let params = payload.params;
  //判断配置是否开启明文传输0开启 1关闭
  if (payload.sysConfig.ClearTransmission == 0) {
    params.configId = Base64.stringify(Utf8.parse(params.configId));
    if (params.ConditionWhere == undefined) {
      params.ConditionWhere = null;
    } else {
      params.ConditionWhere = Base64.stringify(Utf8.parse(params.ConditionWhere));
    }
  }
  const result = await post(
    '/api/rest/PollutantSourceApi/AutoFormDataApi/GetListPager',
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
  let params = payload.params;
  const defaults = {
    configId: 'TestCommonPoint',
  };
  const body = {
    ...params,
    ...defaults,
  };
  //判断配置是否开启明文传输0开启 1关闭
  if (payload.sysConfig.ClearTransmission == 0) {
    var encrypt = new window.JSEncrypt();
    encrypt.setPublicKey(encryptKey);
    params.configId = encrypt.encrypt(params.configId);
    // var aa=params.configId
    // console.log(params.configId)
    // params.configId= aa.Replace("+", "%2B");
  }
  const result = await get(
    '/api/rest/PollutantSourceApi/AutoFormDataApi/GetFormData',
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
  let params = payload.params;
  const postData = {
    configId: 'TestCommonPoint',
    ...params,
  };
  // const defaults = {};
  // const body=Object.assign(defaults,params);
  //判断配置是否开启明文传输0开启 1关闭
  if (payload.sysConfig.ClearTransmission == 0) {
    var encrypt = new window.JSEncrypt();
    encrypt.setPublicKey(encryptKey);
    body.configId = encrypt.encrypt(params.configId);
    body.FormData = encrypt.encrypt(params.FormData);
  }
  const result = await post(
    '/api/rest/PollutantSourceApi/AutoFormDataApi/PostAutoFromDataDelete',
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
  let params = payload.params;
  //判断配置是否开启明文传输0开启 1关闭
  if (payload.sysConfig.ClearTransmission == 0) {
    var encrypt = new window.JSEncrypt();
    encrypt.setPublicKey(encryptKey);
    params.configId = encrypt.encrypt(params.configId);
    params.FormData = encrypt.encrypt(params.FormData);
  }
  const result = await post(
    '/api/rest/PollutantSourceApi/AutoFormDataApi/PostAutoFromDataAdd',
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
  let params = payload.params;
  //判断配置是否开启明文传输0开启 1关闭
  if (payload.sysConfig.ClearTransmission == 0) {
    var encrypt = new window.JSEncrypt();
    encrypt.setPublicKey(encryptKey);
    params.configId = encrypt.encrypt(params.configId);
    params.FormData = encrypt.encrypt(params.FormData);
  }
  const result = await post(
    '/api/rest/PollutantSourceApi/AutoFormDataApi/PostAutoFromDataUpdate',
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
  const result = await get('/api/rest/PollutantSourceApi/AuthorApi/GetRegions', params, null);
  return result;
}

/**
 * 【AutoForm】获取附件列表
 * @params {"FileUuid": "String"}
 */
export async function getAttachmentList(params) {
  const result = await post(
    '/api/rest/PollutantSourceApi/UploadApi/GetAttachmentList',
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
  let params = payload.params;
  //判断配置是否开启明文传输0开启 1关闭
  if (payload.sysConfig.ClearTransmission == 0) {
    var encrypt = new window.JSEncrypt();
    encrypt.setPublicKey(encryptKey);
    params.configId = encrypt.encrypt(params.configId);
  }
  const result = await post(
    '/api/rest/PollutantSourceApi/AutoFormDataApi/ExportDataExcel',
    params,
    null,
  );
  return result;
}

/**
 * 【AutoForm】下载导入模板
 * @params {"configId": "String"}
 */
export async function exportTemplet(payload) {
  let params = payload.params;
  const results = await get(configinfopage);
  //判断配置是否开启明文传输0开启 1关闭
  if (payload.sysConfig.ClearTransmission == 0) {
    var encrypt = new window.JSEncrypt();
    encrypt.setPublicKey(encryptKey);
    params.configId = encrypt.encrypt(params.configId);
  }
  const result = await post(
    '/api/rest/PollutantSourceApi/AutoFormDataApi/ExportTemplet',
    params,
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
  const result = await post('/api/rest/PollutantSourceApi/UploadApi/DeleteAttach', params, null);
  return result;
}
// rest/PollutantSourceApi/AutoFormDataApi/VerificationData
// 校验重复
export async function checkRepeat(payload) {
  let params = payload.params;
  //判断配置是否开启明文传输0开启 1关闭
  if (payload.sysConfig.ClearTransmission == 0) {
    var encrypt = new window.JSEncrypt();
    encrypt.setPublicKey(encryptKey);
    params.DT_Name = encrypt.encrypt(params.DT_Name);
    params.DF_Name = encrypt.encrypt(params.DF_Name);
    params.DF_Value = encrypt.encrypt(params.DF_Value);
    params.DT_ConfigID = encrypt.encrypt(params.DT_ConfigID);
  }
  const result = await post(
    '/api/rest/PollutantSourceApi/AutoFormDataApi/VerificationData',
    params,
    null,
  );
  return result;
}
