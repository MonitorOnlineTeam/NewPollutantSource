/**
 * 功  能：autoFrom - 字段配置
 * 创建人：武慧泽
 * 创建时间：2020.11.11
 */
import { post, get } from '@/utils/request';
import { API } from '@config/API'


export async function GetCfgFiledsData(params) {
    let body = {
        dbkey: params.dbKey,
        configId: params.configId
    };
    const result = post(API.autoFormApi.GetCfgFiledsDataFromDbByTableName, body,null);
    return result === null ? {
        data: null
    } : result;
}

/**
 * 编辑数据源配置
 */
export async function SaveFieldsConfig(params) {
    const body = {
        Fileid:params.Fileid,
        configId:params.configId,
        tabAllName:params.tabAllName
    };
    const result = await post(API.autoFormApi.SaveFieldsConfig, body,null);
    return result === null ?null: result;
}

/**
 * 获取字段配置信息从数据库的表结构，依据表名查询
 */
export async function GetCfgFiledsDataFromDbByTableName(params) {
    const body = {
        configId:params.configId,
    };
    const result = await post(API.autoFormApi.GetCfgFiledsDataFromDbByTableName, body,null);
    return result === null ?null: result;
}
 //获取添加字段数据信息
export async function GetAddfieldData(params) {
    const body = {
        configId: params.id,
        dbKey: params.dbKey,
        tableName:params.tableName
    };
    const result = await post(API.autoFormApi.GetNotinCfgField, body,null);
    return result === null ?null: result;
}
//获取保存字段数据信息
export async function SavefieldData(params) {
    const body = {
        configId: params.id,
        //dbKey: params.dbKey,
        tableName:params.tableName,
        Cfg_Fields:params.Cfg_Field
    };
    const result = await post(API.autoFormApi.SaveField, body,null);
    return result === null ?null: result;
}

/**
 * 获取枚举值
 */
export async function GetEnumDictionary(params) {
    const body = {
        // configId:params.configId,
    };
    const result = await post(pageUrl.AutoForm.GetEnumDictionary, body,null);
    return result === null ?null: result;
}

/**
 * 添加枚举值
 */
export async function AddEnum(params) {
    const body = {
        key:params.key,
        value:params.value
    }
    const result = await post(pageUrl.AutoForm.AddEnum, body,null);
    return result === null ?null: result;
}

/**
 * 编辑枚举值
 */
export async function UpdateEnum(params) {
    const body = {
        key:params.key,
        value: params.value
    };
    const result = await post(pageUrl.AutoForm.UpdateEnum, body,null);
    return result === null ?null: result;
}

/**
 * 删除枚举值
 */
export async function DelEnum(params) {
    const body = {
        key:params.key,
    };
    const result = await post(pageUrl.AutoForm.DelEnum, body,null);
    return result === null ?null: result;
}