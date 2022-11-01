/**
 * 功  能：autoFrom - 数据源配置
 * 创建人：白金索
 * 创建时间：2020.11.11
 */

import { post, get } from '@/utils/request';
import { API } from '@config/API'

/**
 * 获取数据源树形导航
 */
export async function GetDBSourceTree(params) {
    const body = {
        id:params.Id,
    };
    const result = await post(API.autoFormApi.GetDBSourceTree, body,null);
    return result === null ?null: result;
}

/**
 * 获取数据源树节点
 */
export async function DeleteTreeConfig(params) {
    const body = {
        id:params.Id,
    };
    const result = await post(API.autoFormApi.DeleteTreeConfig, body,null);
    return result === null ?null: result;
}