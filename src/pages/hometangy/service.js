/*
 * @Author: cg
 * @Date: 2019-10-10 09:39:12
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2022-09-21 10:16:28
 * @desc: 主页接口api
 */
import { post, get, getNew } from '@/utils/request';
import { API } from '@config/API'


// 唐银项目获取地图图例
export async function getlegends(params) {
  const result = post(API.BaseDataApi.Getlegends, params, null);
  return result;
}

// 唐银项目所有点位监控信息 - 单个企业
export async function getDataForSingleEnt(params) {
  const result = post(API.BaseDataApi.GetDataForSingleEnt, params, null);
  return result;
}


// 唐银项目获取监控设备
export async function getMonitordevices(params) {
  const result = await post(API.BaseDataApi.GetTyMonitoringSituation, params, null);
  return result;
}

// 唐银项目获取治理设备
export async function getSolvedevices(params) {
  const result = await post(API.BaseDataApi.GetTyMonitoringSituation, params, null);
  return result;
}

// 唐银项目首页环保点位
export async function getEnvironmentalpoints(params) {
  const result = await post(API.BaseDataApi.GetTyMonitorpollutantValues, params, null);  
  return result;
}