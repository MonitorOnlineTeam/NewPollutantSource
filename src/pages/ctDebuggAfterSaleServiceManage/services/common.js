import { post, get, getNew } from '@/utils/request';

import { API } from '@config/API'

// 获取服务大区
export async function GetLargeRegionList(params) {
    const result = post(API.CtCommonApi.GetLargeRegionList, params);
    return result;
  }

//岗位类别、行业属性、问题类别
export async function GetCodList(params) {
  const result = post(`${API.CtCommonApi.GetCodList}?CodID=${params.CodID}`, null);
  return result;
}