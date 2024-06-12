import { post, get, getNew } from '@/utils/request';

import { API } from '@config/API'

// 获取服务大区
export async function GetLargeRegionList(params) {
    const result = post(API.CtCommonApi.GetLargeRegionList, params);
    return result;
  }
