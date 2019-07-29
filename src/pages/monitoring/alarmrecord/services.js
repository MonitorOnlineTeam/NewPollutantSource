import { post } from '@/utils/request';

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
/** 获取单排口报警数据
 * {
        DGIMN: "51052216080301",
        pollutantCode: "zs01",
        beginTime: "2019-3-1",
        endTime: "2019-3-2",
        pageIndex: 1,
        pageSize: 10
    }
 *  */
export async function queryoverdatalist(params) {
    const result = await post('/api/rest/PollutantSourceApi/MonDataApi/GetExceptionProcessingList', params, null);
    return result === null ? {
      data: null,
    } : result.Datas;
}
