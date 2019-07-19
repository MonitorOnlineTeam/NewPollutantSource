import { post, get } from '@/utils/request';

/** 萤石云视频列表 */
export async function getysyList(params) {
  const body = {
    VedioCameraID: params.VedioCameraID,
  };
  const result = post('/api/rest/PollutantSourceApi/Video/GetCameraMonitorUrl', body, null);
  return result === null
    ? {
        data: null,
      }
    : result;
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
/** 添加摄像头与排口关系表 */
export async function AddCameraMonitor(params) {
  const body = {
    PointCode: params.PointCode,
    VedioCameraID: params.VedioCameraID,
  };
  const result = post('/api/rest/PollutantSourceApi/VideoApi/AddCameraMonitor', body, null);
  return result === null
    ? {
        data: null,
      }
    : result;
}
/** 判断序列号是否有效 */
export async function IsTrueSerialNumber(params) {
  const body = {
    SerialNumber: params.SerialNumber,
  };
  const result = await post('/api/rest/PollutantSourceApi/VideoApi/IsTrueSerialNumber', body, null);
  return result === null
    ? {
        data: null,
      }
    : result;
}
