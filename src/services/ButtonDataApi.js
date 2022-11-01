/**
 * 功  能：AutoForm数据源配置-其他配置
 * 创建人：李静
 * 创建时间：2020.11.16
 */

import { post, get } from '@/utils/request';
import { API } from '@config/API'


// 查询列表按钮配置
export async function GetButtonsByConfigID(params) {
    let body = {
        ConfigId: params.ConfigID
    }

    const result = post(API.autoFormApi.GetButtonsByConfigID, body, null);
    return result === null ? {
        data: null
    } : result;
}

// 查询脚本配置
export async function GetTableExtend(params) {
    let body = {
        ConfigId: params.ConfigID,
        PageFlag: params.PageFlag
    }

    const result = post(API.autoFormApi.GetTableExtend, body, null);
    return result === null ? {
        data: null
    } : result;
}

// 列表按钮配置添加
export async function SaveCfgButtons(params) {
    const body = {
        "ConfigId": params.ConfigId,
        "ButtonList": params.ButtonList
    };
    const result = await post(API.autoFormApi.SaveCfgButtons, body, null);
    return result === null ? null : result;
}

// 添加
export async function SaveTableExtend(params) {
    const body = {
        "GUID": params.GUID,
        "DT_CONFIG_ID": params.DT_CONFIG_ID,
        "DT_CUSTOMJS": params.DT_CUSTOMJS,
        "DT_CUSTOMCSS": params.DT_CUSTOMCSS,
        "DT_PAGEFLAG": params.DT_PAGEFLAG
    };
    const result = await post(API.autoFormApi.SaveTableExtend, body, null);
    return result === null ? null : result;
}



