/**
 * 功  能：超标数据报警核实记录查询
 * 创建人：胡孟弟
 * 创建时间：2020.10.20
 */
import { post } from '@/utils/request';
import { API } from '@config/API'
import { async } from 'q';
//根据 行政区和关注度 获取企业列表
export async function GetEntByRegionAndAtt(params) {
    const result = post(API.RegionApi.GetEntByRegionAndAtt, params, null)
    return result
}
//根据 企业 获取 监测点
export async function GetPointByEntCode(params) {
    const result = await post(API.BaseDataApi.GetPointByEntCode, params);
    return result
}
//数据列表
export async function GetAllTypeDataListWater(params) {
    const result = post(API.MonitorDataApi.GetAllTypeDataListWater, params, null)
    return result
}

//导出 数据列表
export async function ExportAllTypeDataListWater(params) {
    const result = post(API.ExportApi.ExportAllTypeDataListWater, params, null)
    return result
}


