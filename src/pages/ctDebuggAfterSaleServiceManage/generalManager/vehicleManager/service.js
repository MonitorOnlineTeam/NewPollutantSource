import { post, get, getNew } from '@/utils/request';

import { API } from '@config/API'


//车辆信息
export async function GetCarList(params) {
  const result = post(API.GeneralManagerApi.GetCarList, params);
  return result;
}

//车辆信息 导出
export async function ExportCarList(params) {
  const result = post(API.GeneralManagerApi.ExportCarList, params);
  return result;
}
