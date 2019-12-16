/*
 * @Author: lzp
 * @Date: 2019-07-16 09:59:32
 * @LastEditors: lzp
 * @LastEditTime: 2019-09-18 11:34:33
 * @Description:数据一览
 */
import moment from 'moment';
import { post, get } from '@/utils/request';

/**
 * 【智能监控】获取污染物系统污染物
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

/**
 * 【智能监控】获取数据一览表头
 * @params {"pollutantTypes":2}
 */
export async function querypollutanttypecode(params) {
  const result = await post(
    '/api/rest/PollutantSourceApi/BaseDataApi/GetPollutantTypeCode',
    params,
    null
  );
  return result === null ? { data: null } : result.Datas;
}
/**
 * 【智能监控】获取数据一览数据
 * @params {
        "time": "2019-3-1 00:00:00",
        "pointType": 2,
        "pollutantTypes": "2",
        "pointName": "1号脱硫出口",
        "status": 1,
        "terate": 1,
   
    }
 */
export async function querydatalist(params) {
  if (params.dgimn) params.DGIMNs = params.dgimn;
  const result = await post(
    '/api/rest/PollutantSourceApi/BaseDataApi/AllTypeSummaryList',
    params,
    null,
  );
  return result === null ? { data: null } : result.Datas;
}

/**
 * 【智能监控】获取最新一条数据
 * @params {
        "dataType": "HourData",
        "DGIMNs": "31011500000002",
        "isLastest": true
    }
 */
export async function querylastestdatalist(params) {
  const result = await post(
    '/api/rest/PollutantSourceApi/DataList/AllTypeSummaryList',
    params,
    null,
  );
  return result === null ? { data: null } : result;
}
/**
 * 【智能监控】获取历史数据
 * @params {
        "datatype": "hour",
        "DGIMNs": "31011500000002",
        "isAsc": true,
        "pageIndex":1,
        "pageSize":10,
        "beginTime":"2019-3-8 00:00:00",
        "endTime":"2019-3-9 00:00:00"
    }
 */
export async function queryhistorydatalist(params) {
  const result = await post(
    '/api/rest/PollutantSourceApi/DataList/GetAllTypeDataList',
    params,
    null,
  );
  return result === null ? { data: null } : result;
}

/**
 * 【智能监控】获取排口下的污染物
 * @params {
          "DGIMNs": "31011500000002"
    }
 */
export async function querypollutantlist(params) {
  const result = await post(
    '/api/rest/PollutantSourceApi/PPointAndData/GetPollutantListByDgimn',
    params,
    null,
  );
  return result === null ? { data: null } : result.data;
}

/**
 * 【智能监控】获取排口下的污染物
 * @params {
          "entName": "首钢京唐钢铁联合有限责任公司"
    }
 */
export async function querygetentdatalist(params) {
  const result = await post('/api/rest/PollutantSourceApi/DataList/GetEntDataList', params, null);
  return result === null ? { data: null } : result.data;
}

// 获取实时数据一览表头
export async function getRealTimeColumn(params) {
  const result = await post(
    '/api/rest/PollutantSourceApi/BaseDataApi/GetPollutantTypeCode',
    params,
    null
  );
  return result;
}

// 获取实时数据一览
export async function getRealTimeDataView(params) {
  const result = await post(
    '/api/rest/PollutantSourceApi/BaseDataApi/AllTypeSummaryList',
    params,
    null,
  );
  return result;
}