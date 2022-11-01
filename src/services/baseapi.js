/**
 * 功  能：基础数据服务
 * 创建人：吴建伟
 * 创建时间：2019.07.14
 */

import Cookie from 'js-cookie';
import { post, get } from '@/utils/request';
import { API } from '@config/API'
import { async } from 'q';

/**
 * 获取污染物系统污染物
 * @params {}
 */
export async function getPollutantTypeList(params) {
  const result = await post(
    API.commonApi.GetPollutantTypeList,
    {
      ...params,
      pollutantCodes: sessionStorage.getItem('sysPollutantCodes') || params.pollutantCodes
    },
    null,
  );
  return result === null ? { data: null } : result.Datas;
}

// 获取用户按钮权限
export async function getBtnAuthority(params) {
  const result = await post(API.AuthorityApi.GetButtonByUserID, params, null);
  return result === null ? { data: null } : result;
}
/**
 * 【智能监控】获取排口下的污染物
 * @params {
          "DGIMNs": "31011500000002"
    }
 */
export async function querypollutantlist(params) {
  const result = await post(API.commonApi.GetPollutantListByDgimn, params);
  return result === null ? {
    data: null,
  } : result.Datas;
}

/**
 * 删除监测点（支持批量）
 * @params {
          "params": ["31011500000002"]
    }
 */
export async function deletePoints(params) {
  // console.log("params=",params);
  const result = await post(API.PointApi.DeletePoints, params, null);
  return result;
}

/**
 * 根据批量监控目标Id获取监测点
 * @params {
          "params": ["31011500000002"]
    }
 */
export async function queryPointForTarget(params) {
  console.log("params=", params);
  const result = await post(API.PointApi.queryPointForTarget, params, null);
  return result;
}
