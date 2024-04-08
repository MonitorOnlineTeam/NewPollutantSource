import { post, get, getNew } from '@/utils/request';

import { API } from '@config/API'


//人员档案
export async function GetUserList(params) {
  const result = post(API.GeneralManagerApi.GetUserList, params);
  return result;
}

//人员档案 导出
export async function ExportUserList(params) {
  const result = post(API.GeneralManagerApi.ExportUserList, params);
  return result;
}

//岗位类别和行业属性
export async function GetCodList(params) {
  const result = post(`${API.GeneralManagerApi.GetCodList}?CodID=${params.CodID}`, null);
  return result;
}
