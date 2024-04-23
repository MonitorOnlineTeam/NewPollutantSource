import { post, get, getNew } from '@/utils/request';

import { API } from '@config/API'

//大区档案
export async function GetProvinceList(params) {
  const result = post(API.GeneralManagerApi.GetProvinceList, params);
  return result;
}

//大区档案 导出
export async function ExportProvinceList(params) {
  const result = post(API.GeneralManagerApi.ExportProvinceList, params);
  return result;
}

//获取大区系统类型、档案执行大区、项目所在地、大区经理、省区经理信息
export async function GetManagerSelect(params) {
  const result = post(API.GeneralManagerApi.GetManagerSelect, params);
  return result;
}
