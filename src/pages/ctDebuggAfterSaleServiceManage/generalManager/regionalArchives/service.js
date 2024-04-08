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

//岗位类别和行业属性
export async function GetManagerUserList(params) {
  const result = post(`${API.GeneralManagerApi.GetManagerUserList}?ManagerType=${params.ManagerType}`, null);
  return result;
}
