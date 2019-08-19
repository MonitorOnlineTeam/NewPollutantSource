/* eslint-disable import/prefer-default-export */
/**
 * 功  能：基础数据服务
 * 创建人：吴建伟
 * 创建时间：2019.07.14
 */

import Cookie from 'js-cookie';
import { post, get } from '@/utils/request';
import { async } from 'q';

/**
 * 获取污染物系统污染物
 * @params {}
 */
export async function getPollutantTypeList(params) {
  const result = await post(
    '/api/rest/PollutantSourceApi/BaseDataApi/GetPollutantTypeList',
    params,
    null,
  );
  return result === null ? { data: null } : result.Datas;
}

// 获取用户按钮权限
export async function getBtnAuthority(params) {
  const result = await post(
    '/api/rest/PollutantSourceApi/AuthorApi/GetButtonByUserID',
    params,
    null,
  );
  return result === null ? { data: null } : result;
}


/** 获取企业信息
 *  {
        parentIDs:'51216eae-8f11-4578-ad63-5127f78f6cca',
    }
 */
export async function querypolluntantentinfolist(params) {
  const result = await post(
    '/api/rest/PollutantSourceApi/PPointAndData/GetTargetList',
    params,
    null,
  );
  return result === null ? { data: null } : result.data;
}
/**
 * 【智能监控】获取排口下的污染物
 * @params {
          "DGIMNs": "31011500000002"
    }
 */
export async function querypollutantlist(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetPollutantListByDgimn', params, null);
  return result === null ? {
    data: null,
  } : result.Datas;
}

/**
 * 删除监测点（支持批量）
 * @params {
          "DGIMNs": "31011500000002"
    }
 */
export async function deletePoints(params) {
  debugger
  console.log("params=",params);
  const result = await post('/api/rest/PollutantSourceApi/MonitorPointApi/DeletePoints', params, null);
  return result;
}
