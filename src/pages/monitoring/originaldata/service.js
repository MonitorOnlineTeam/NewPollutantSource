import { get } from '@/utils/request';
import { API } from '@config/API'
/**
 * 【智能监控】获取原始数据包
 * @params {
        "dgimn": "51052216080301",
        "packageType": "OriginalPackage",
        "pageIndex":1,
        "pageSize":10,
        "beginTime":"2019-3-8 00:00:00",
        "endTime":"2019-3-9 00:00:00"
    }
 */
export async function getOriginalData(params) {
    const result = await get(API.AssetManagementApi.GetOriginalData, params,0);
    return result;
}

