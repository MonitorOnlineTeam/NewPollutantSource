import { post } from '@/utils/request';
import { API } from '@config/API'
import { async } from 'q';
/**
 * 【智能监控】获取历史数据
 * @params {
        "datatype": "realtime",
        "DGIMNs": "31011500000002",
        "isAsc": true,
        "pageIndex":1,
        "pageSize":10,
        "beginTime":"2019-3-8 00:00:00",
        "endTime":"2019-3-9 00:00:00"
    }
 */
export async function queryhistorydatalist(params) {
    const result = await post(API.MonitorDataApi.GetAllTypeDataList, params);
    return result === null ? { data: null } : result;
}

export async function GetMonitorPointList(params) {
    const result = await post(API.PointApi.GetMonitorPointList, params);
    return result;
}

