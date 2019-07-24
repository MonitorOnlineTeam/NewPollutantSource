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
