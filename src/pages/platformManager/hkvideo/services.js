import { post, get } from '@/utils/request';

/** 获取视频连接 */
export async function hkvideourl(params) {
  const body = {
    DGIMN: params.DGIMN,
  };
  const result = post('/api/rest/PollutantSourceApi/VideoApi/GetVideoInfoByDgimn', body, null);
  return result === null ? {
    data: null,
  } : result;
}
/**
 * 获取排口下的污染物
 * @params {
          "DGIMNs": "31011500000002"
    }
 */
export async function querypollutantlist(params) {
  const result = await post(
    '/api/rest/PollutantSourceApi/BaseDataApi/GetPollutantListByDgimn',
    params,
    null,
  );
  return result === null
    ? {
        data: null,
      }
    : result.Datas;
}
/**
 * 获取历史视频的数据
 * @params {
          "DGIMNs": "31011500000002"
    }
 */
export async function queryhistorydatalistbyrealtime(params) {
  const result = await post('/api/rest/PollutantSourceApi/PRealTime/GetRealTimeData', params, null);
  return result === null
    ? {
        data: null,
      }
    : result;
}
/**
 * 获取实时视频的数据
 * @params {
          "DGIMNs": "31011500000002"
    }
 */
export async function queryhistorydatalist(params) {
  const result = await post(
    '/api/rest/PollutantSourceApi/MonDataApi/GetAllTypeDataList',
    params,
    null,
  );
  return result === null
    ? {
        data: null,
      }
    : result;
}
