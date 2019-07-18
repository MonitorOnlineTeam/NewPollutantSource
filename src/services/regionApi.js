import { post } from '@/utils/request';

// 行政区划
export async function getEnterpriseAndPoint(params) {
    const result =await post('/api/rest/PollutantSourceApi/BaseDataApi/GetXuRegions', params, null);
    return result === null ? { data: null } : result;
}
