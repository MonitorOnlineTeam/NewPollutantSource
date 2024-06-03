/**
 * 功  能：AutoForm数据库链接配置
 * 创建人：李静
 * 创建时间：2020.11.12
 */

import { post, get } from '@/utils/request';
import { API } from '@config/API'

// 查询
export async function GetDatabaseData(params) {
    const result = await post(API.AutoFormApi.GetDBSourceList, params, null);
    return result;
}

// 获取增加编辑数据
export async function AddingdatabaseConnection(params) {
    const result = await post(API.AutoFormApi.SaveDbSource, params, null);
    return result;
}

// 删除
export async function DeleteDatabase(params) {
    const result = await post(API.AutoFormApi.DelDbSource, params, null);
    return result;
}

