/* eslint-disable import/prefer-default-export */
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
 * 【AutoForm】系统登录
 * @params {"UserAccount": "system","UserPwd": "system","RememberMe": true}
 */
export async function systemLogin(params) {
  const defaults = {
    RememberMe: true,
    UserAccount: params.userName,
    UserPwd: params.password,
  };
  const body = Object.assign(defaults);
  const results = await get(configinfopage);
  //判断配置是否开启明文传输0开启 1关闭
  if (results.Datas.ClearTransmission == 0) {
    var encrypt = new window.JSEncrypt();
    encrypt.setPublicKey(encryptKey);
    body.UserAccount = encrypt.encrypt(body.UserAccount);
    body.UserPwd = encrypt.encrypt(body.UserPwd);
  }
  const result = await post('/api/rest/PollutantSourceApi/LoginApi/Login', body);
  if (result.IsSuccess && result.Datas) {
    Cookie.set(configToken.cookieName, result.Datas.Ticket);
  } else {
    Cookie.set(configToken.cookieName, '');
  }
  return result;
}

/**
 * 【AutoForm】获取页面高级查询表单
 * @params {"configId": "TestCommonPoint"}
 */
export async function getConditions() {
  const params = {
    configId: 'TestCommonPoint',
  };
  const defaults = {};
  const body = Object.assign(defaults, params);
  const results = await get(configinfopage);
  //判断配置是否开启明文传输0开启 1关闭
  if (results.Datas.ClearTransmission == 0) {
    var encrypt = new window.JSEncrypt();
    encrypt.setPublicKey(encryptKey);
    body.configId = encrypt.encrypt(params.configId);
  }
  const result = await get('/api/rest/PollutantSourceApi/AutoFormDataApi/GetConditions', body);
  // ;
  return result;
}

/**
 * 【AutoForm】获取页面配置信息
 * @params {"configId": "TestCommonPoint"}
 */
export async function getPageConfigInfo(params) {
  const param = {
    configId: 'TestCommonPoint',
    ...params,
  };
  const defaults = {
    PageIndex: 1,
    PageSize: 200,
  };
  const body = Object.assign(defaults, param);
  const results = await get(configinfopage);
  //判断配置是否开启明文传输0开启 1关闭
  if (results.Datas.ClearTransmission == 0) {
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
export async function getListPager(params) {
  // const defaults = {
  //     configId: params.configId,
  //     ConditionWhere: params.ConditionWhere,
  //   };
  //   const body = Object.assign(defaults);

  //   var encrypt = new window.JSEncrypt();
  //   encrypt.setPublicKey("MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCC0hrRIjb3noDWNtbDpANbjt5Iwu2NFeDwU16Ec87ToqeoIm2KI+cOs81JP9aTDk/jkAlU97mN8wZkEMDr5utAZtMVht7GLX33Wx9XjqxUsDfsGkqNL8dXJklWDu9Zh80Ui2Ug+340d5dZtKtd+nv09QZqGjdnSp9PTfFDBY133QIDAQAB");
  //   params.configId = encrypt.encrypt(params.configId);//加密后的字符串
  //   params.ConditionWhere =encrypt.encryptLong(params.ConditionWhere);//加密后的字符串

  //   encrypt.encrypt()
  // const postData = {
  //     configId: "TestCommonPoint",
  //     ...params,
  //     // ConditionWhere: JSON.stringify(params.ConditionWhere),
  // };
  // const defaults = {
  //     PageIndex:1,
  //     PageSize:200
  // };
  // const body=Object.assign(param,params);
  const results = await get(configinfopage);
  //判断配置是否开启明文传输0开启 1关闭
  if (results.Datas.ClearTransmission == 0) {
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
 * 【AutoForm】获取添加页面表单元素
 * @params {"configId": "TestCommonPoint"}
 */
export async function getAutoFromAddView() {
  const params = {
    configId: 'TestCommonPoint',
  };
  const defaults = {};
  const body = Object.assign(defaults, params);
  const results = await get(configinfopage);
  //判断配置是否开启明文传输0开启 1关闭
  if (results.Datas.ClearTransmission == 0) {
    var encrypt = new window.JSEncrypt();
    encrypt.setPublicKey(encryptKey);
    body.configId = encrypt.encrypt(params.configId);
  }
  const result = await get(
    '/api/rest/PollutantSourceApi/AutoFormDataApi/GetAutoFromAddView',
    body,
    null,
  );
  return result;
}

/**
 * 【AutoForm】获取修改页面表单元素
 * @params {"configId": "TestCommonPoint"}
 */
export async function getAutoFromUpdateView() {
  const params = {
    configId: 'TestCommonPoint',
  };
  const defaults = {};
  const body = Object.assign(defaults, params);
  const results = await get(configinfopage);
  //判断配置是否开启明文传输0开启 1关闭
  if (results.Datas.ClearTransmission == 0) {
    var encrypt = new window.JSEncrypt();
    encrypt.setPublicKey(encryptKey);
    body.configId = encrypt.encrypt(params.configId);
  }
  const result = await get(
    '/api/rest/PollutantSourceApi/AutoFormDataApi/GetAutoFromUpdateView',
    body,
    null,
  );
  return result;
}

/**
 * 【AutoForm】获取编辑或添加页面表单元素的值
 * @params {"configId": "TestCommonPoint"}
 */
export async function getFormData(params) {
  const defaults = {
    configId: 'TestCommonPoint',
  };
  const body = {
    ...params,
    ...defaults,
  };
  const results = await get(configinfopage);
  //判断配置是否开启明文传输0开启 1关闭
  if (results.Datas.ClearTransmission == 0) {
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
export async function postAutoFromDataDelete(params) {
  const postData = {
    configId: 'TestCommonPoint',
    ...params,
  };
  // const defaults = {};
  // const body=Object.assign(defaults,params);
  const results = await get(configinfopage);
  //判断配置是否开启明文传输0开启 1关闭
  if (results.Datas.ClearTransmission == 0) {
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
export async function postAutoFromDataAdd(params) {
  const results = await get(configinfopage);
  //判断配置是否开启明文传输0开启 1关闭
  if (results.Datas.ClearTransmission == 0) {
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
export async function postAutoFromDataUpdate(params) {
  const results = await get(configinfopage);
  //判断配置是否开启明文传输0开启 1关闭
  if (results.Datas.ClearTransmission == 0) {
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
export async function exportDataExcel(params) {
  const results = await get(configinfopage);
  //判断配置是否开启明文传输0开启 1关闭
  if (results.Datas.ClearTransmission == 0) {
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
export async function exportTemplet(params) {
  const results = await get(configinfopage);
  //判断配置是否开启明文传输0开启 1关闭
  if (results.Datas.ClearTransmission == 0) {
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
export async function checkRepeat(params) {
  const results = await get(configinfopage);
  //判断配置是否开启明文传输0开启 1关闭
  if (results.Datas.ClearTransmission == 0) {
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
