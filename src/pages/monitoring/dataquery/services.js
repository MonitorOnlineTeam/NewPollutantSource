import { post } from '@/utils/request';
/**
 * 【智能监控】获取排口下的污染物
 * @params {
          "DGIMNs": "31011500000002"
    }
 */
export async function querypollutantlist(params) {
    const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetPollutantListByDgimn', params, null);
    return result === null ? { data: null } : result.Datas;
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
    const result = await post('/api/rest/PollutantSourceApi/MonDataApi/GetAllTypeDataList', params, null);
    return result === null ? { data: null } : result;
}
