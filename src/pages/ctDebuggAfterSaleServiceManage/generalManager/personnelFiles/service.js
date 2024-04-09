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
