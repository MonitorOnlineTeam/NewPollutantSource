/* eslint-disable import/prefer-default-export */
/**
 * 功  能：AutoForm基本服务
 * 创建人：吴建伟
 * 创建时间：2019.04.29
 */

import Cookie from 'js-cookie';
import { post, get } from '@/utils/request';
import { async } from 'q';

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
    const result = await post('/api/rest/PollutantSourceApi/LoginApi/Login', body);
    if (result.IsSuccess && result.Datas) {
        Cookie.set('ssoToken', result.Datas.Ticket);
    } else {
        Cookie.set('ssoToken', "");
    }
    return result;
}

/**
 * 【AutoForm】获取页面高级查询表单
 * @params {"configId": "TestCommonPoint"}
 */
export async function getConditions() {
    const params = {
        configId: "TestCommonPoint"
    };
    const defaults = {};
    const body = Object.assign(defaults, params);
    const result = await get('/api/rest/PollutantSourceApi/AutoFormDataApi/GetConditions', body);
    // ;
    return result;
}

/**
 * 【AutoForm】获取页面配置信息
 * @params {"configId": "TestCommonPoint"}
 */
export async function getPageConfigInfo(params) {
    let param = {
        configId: "TestCommonPoint",
        ...params
    };
    const defaults = {
        PageIndex: 1,
        PageSize: 200
    };
    const body = Object.assign(defaults, param);
    const result = await get('/api/rest/PollutantSourceApi/AutoFormDataApi/GetPageConfigInfo', body, null);
    return result;
}

/**
 * 【AutoForm】获取页面高级查询表单
 * @params {"configId": "TestCommonPoint"}
 */
export async function getListPager(params) {
    const postData = {
        configId: "TestCommonPoint",
        ...params,
        // ConditionWhere: JSON.stringify(params.ConditionWhere),
    };
    // const defaults = {
    //     PageIndex:1,
    //     PageSize:200
    // };
    // const body=Object.assign(param,params);
    // console.log('params=',body)
    const result = await get('/api/rest/PollutantSourceApi/AutoFormDataApi/GetListPager', params, null);
    return result;
}

/**
 * 【AutoForm】获取添加页面表单元素
 * @params {"configId": "TestCommonPoint"}
 */
export async function getAutoFromAddView() {
    const params = {
        configId: "TestCommonPoint"
    };
    const defaults = {};
    const body = Object.assign(defaults, params);
    const result = await get('/api/rest/PollutantSourceApi/AutoFormDataApi/GetAutoFromAddView', body, null);
    return result;
}

/**
 * 【AutoForm】获取修改页面表单元素
 * @params {"configId": "TestCommonPoint"}
 */
export async function getAutoFromUpdateView() {
    const params = {
        configId: "TestCommonPoint"
    };
    const defaults = {};
    const body = Object.assign(defaults, params);
    const result = await get('/api/rest/PollutantSourceApi/AutoFormDataApi/GetAutoFromUpdateView', body, null);
    return result;
}

/**
 * 【AutoForm】获取编辑或添加页面表单元素的值
 * @params {"configId": "TestCommonPoint"}
 */
export async function getFormData(params) {
    const defaults = {
        configId: "TestCommonPoint"
    };
    const body = {
        ...params,
        ...defaults
    };
    const result = await get('/api/rest/PollutantSourceApi/AutoFormDataApi/GetFormData', params, null);
    return result;
}

/**
 * 【AutoForm】数据删除（支持批量）
 * @params {"configId": "TestCommonPoint"}
 */
export async function postAutoFromDataDelete(params) {
    const postData = {
        configId: "TestCommonPoint",
        ...params
    };
    // const defaults = {};
    // const body=Object.assign(defaults,params);

    const result = await post('/api/rest/PollutantSourceApi/AutoFormDataApi/PostAutoFromDataDelete', params, null);
    return result;
}
/**
 * 【AutoForm】数据添加
 * @params {"configId": "TestCommonPoint",FormData:'{name:1,code:"123"}'}
 */
export async function postAutoFromDataAdd(params) {
    const result = await post('/api/rest/PollutantSourceApi/AutoFormDataApi/PostAutoFromDataAdd', params, null);
    return result;
}

/**
 * 【AutoForm】修改
 * @params {"configId": "TestCommonPoint",FormData:'{name:1,code:"123"}'}
 */
export async function postAutoFromDataUpdate(params) {
    const result = await post('/api/rest/PollutantSourceApi/AutoFormDataApi/PostAutoFromDataUpdate', params, null);
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
    const result = await post('/api/rest/PollutantSourceApi/UploadApi/GetAttachmentList', params, null);
    return result;
}

/**
 * 【AutoForm】导出
 * @params {"configId": "String"}
 */
export async function exportDataExcel(params) {
    const result = await post('/api/rest/PollutantSourceApi/AutoFormDataApi/ExportDataExcel', params, null);
    return result;
}

/**
 * 【AutoForm】下载导入模板
 * @params {"configId": "String"}
 */
export async function exportTemplet(params) {
    const result = await post('/api/rest/PollutantSourceApi/AutoFormDataApi/ExportTemplet', params, null);
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
// rest/PollutantSourceApi/UploadApi/PostFiles