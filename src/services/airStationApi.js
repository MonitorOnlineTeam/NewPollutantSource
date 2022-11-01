/**
 * 功  能：空气站查询
 * 创建人：胡孟弟
 * 创建时间：2020.10.14
 */
import { post } from '@/utils/request';
import { API } from '@config/API'
import { async } from 'q';
//获取空气站信息
export async function GetPointSummary(params) {
    const result = post(API.PointApi.GetPointSummary, params)
    return result
}
//导出企业详细信息
export async function ExportPointSummary(params) {
    const result = post(API.ExportApi.ExportPointSummary, params)
    return result
}
