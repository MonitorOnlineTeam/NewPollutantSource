/**
 * 功  能：AutoForm数据库链接配置
 * 创建人：李静
 * 创建时间：2020.11.12
 */

import { post, get } from '@/utils/request';

// 查询
export async function GetDatabaseData(params) {
    const result = await post('/api/rest/PollutantSourceApi/AutoFormDataApi/GetDBSourceList', params, null);
    return result;
}

// 获取增加编辑数据
export async function AddingdatabaseConnection(params) {
    const result = await post('/api/rest/PollutantSourceApi/AutoFormDataApi/SaveDbSource', params, null);
    return result;
}

// 删除
export async function DeleteDatabase(params) {
    const result = await post('/api/rest/PollutantSourceApi/AutoFormDataApi/DelDbSource', params, null);
    return result;
}

