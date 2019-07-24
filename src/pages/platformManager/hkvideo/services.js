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
// 删除视频信息
export async function deleteVideoInfo(params) {
  const body = {
    VedioCamera_ID: params.VedioCamera_ID,
    VedioDevice_ID: params.VedioDevice_ID,
    CameraMonitorID: params.CameraMonitorID,
  };
  const result = post('/api/rest/PollutantSourceApi/Video/DeleteVideoInfo', body, null);
  return result === null ? {
    data: null,
  } : result;
}
// 根据排口增加视频信息
export async function addVideoInfo(params) {
  const body = {
    VedioDevice_Name: params.VedioDevice_Name,
    VedioDevice_No: params.VedioDevice_No,
    VedioDevice_Position: params.VedioDevice_Position,
    IP: params.IP,
    User_Name: params.User_Name,
    User_Pwd: params.User_Pwd,
    Device_Port: params.Device_Port,
    VedioCamera_Name: params.VedioCamera_Name,
    VedioCamera_No: params.VedioCamera_No,
    VedioCamera_Position: params.VedioCamera_Position,
    ProduceDate: params.ProduceDate,
    VedioCamera_Version: params.VedioCamera_Version,
    Longitude: params.Longitude,
    Latitude: params.Latitude,
    DGIMN: params.DGIMN,
  };
  const result = post('/api/rest/PollutantSourceApi/Video/AddVideoInfo', body, null);
  return result === null ? {
    data: null,
  } : result;
}
// 编辑视频信息
export async function updateVideoInfos(params) {
  const body = {
    VedioDevice_Name: params.VedioDevice_Name,
    VedioDevice_No: params.VedioDevice_No,
    VedioDevice_Position: params.VedioDevice_Position,
    IP: params.IP,
    User_Name: params.User_Name,
    User_Pwd: params.User_Pwd,
    Device_Port: params.Device_Port,
    VedioCamera_Name: params.VedioCamera_Name,
    VedioCamera_No: params.VedioCamera_No,
    VedioCamera_Position: params.VedioCamera_Position,
    ProduceDate: params.ProduceDate,
    VedioCamera_Version: params.VedioCamera_Version,
    Longitude: params.Longitude,
    Latitude: params.Latitude,
    VedioDevice_ID: params.VedioDevice_ID,
    CameraMonitorID: params.CameraMonitorID,
    VedioCamera_ID: params.VedioCamera_ID,
  };
  const result = post('/api/rest/PollutantSourceApi/Video/UpdateVideoInfo', body, null);
  return result === null ? {
    data: null,
  } : result;
}
