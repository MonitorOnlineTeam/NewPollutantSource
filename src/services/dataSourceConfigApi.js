/**
 * 功  能：数据源基础
 * 创建人：胡孟弟
 * 创建时间：2020.11.11
 */
import { async } from 'q';
import { post, get } from '@/utils/request';
import { API } from '@config/API'

/**
 * 数据源基础信息添加
 */
export async function TableConfigAdd(params) {
    const body = {
        DT_NAME: params.DT_NAME,
        DT_CONFIG_ID: params.DT_CONFIG_ID,
        DT_NAME_CN: params.DT_NAME_CN,
        DT_ORDER: params.DT_ORDER,
        DT_CONN: params.DT_CONN,
        DT_PRIMARYKEY: params.DT_PRIMARYKEY,
        Tree_ParentCode: params.Tree_ParentCode,
        StaticQuery: params.StaticQuery,
        DT_REMARK: params.DT_REMARK,
        EnableDataPermission: params.EnableDataPermission,
        MulType: params.MulType
    }
    const result = post(API.autoFormApi.TableConfigAdd, body, null)
    return result === null ? {
        data: null
    } : result;
}
/**
 * 数据源基础信息修改
 */
export async function TableConfigUpdate(params) {
    const body = {
        GUID: params.GUID,
        DT_NAME: params.DT_NAME,
        DT_CONFIG_ID: params.DT_CONFIG_ID,
        DT_NAME_CN: params.DT_NAME_CN,
        DT_ORDER: params.DT_ORDER,
        DT_CONN: params.DT_CONN,
        DT_PRIMARYKEY: params.DT_PRIMARYKEY,
        Tree_ParentCode: params.Tree_ParentCode,
        StaticQuery: params.StaticQuery,
        DT_REMARK: params.DT_REMARK,
        EnableDataPermission: params.EnableDataPermission,
        MulType: params.MulType
    }
    const result = post(API.autoFormApi.TableConfigUpdate, body, null)
    return result === null ? {
        data: null
    } : result;
}
/** AutoForm 根据表名返回该表的主键 */
export async function GetPkByTableName(params) {
    const body = {
        dbkey: params.dbkey,
        tableName: params.tableName,
    }
    const result = post(API.autoFormApi.GetPkByTableName, body, null)
    return result === null ? {
        data: null
    } : result;
}
/** AutoForm 获取数据源树 */
export async function GetTables(params) {
    const result = post(API.autoFormApi.GetTables, params, null)
    return result === null ? {
        data: null
    } : result;
}

/** AutoForm 根据表Id获取数据源基础信息 */
export async function TableConfig(params) {
    const result = post(API.autoFormApi.TableConfig, params, null)
    return result === null ? {
        data: null
    } : result;
}

/** AutoForm 验证数据源ID是否存在 */
export async function ConfigIDisExisti(params) {
    const result = post(API.autoFormApi.ConfigIDisExisti, params, null)
    return result === null ? {
        data: null
    } : result;
}