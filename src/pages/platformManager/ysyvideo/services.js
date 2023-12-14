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
    API.CommonApi.GetPollutantListByDgimn,
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
    API.WholeProcessMonitorApi.GetAllTypeDataList,
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
  const result = post(API.videoManagementApi.AddCameraMonitor, body, null);
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
  const result = await post(API.videoManagementApi.IsTrueSerialNumber, body, null);
  return result === null
    ? {
        data: null,
      }
    : result;
}
/** 删除摄像头 */
export async function DeleteCamera(params) {
  const body = {
    CameraMonitorID: params.CameraMonitorID,
  };
  const result = await post(API.videoManagementApi.DeleteCamera, body, null);
  return result === null ?
    {
      data: null,
    } :
    result;
}
// 删除视频信息
export async function deleteVideoInfo(params) {
  const body = {
    VedioCamera_ID: params.VedioCamera_ID,
    VedioDevice_ID: params.VedioDevice_ID,
    CameraMonitorID: params.CameraMonitorID,
  };
  const result = post(API.videoManagementApi.DeleteVideoInfo, body, null);
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
  const result = post(API.videoManagementApi.AddVideoInfo, body, null);
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
  const result = post(API.videoManagementApi.UpdateVideoInfo, body, null);
  return result === null ? {
    data: null,
  } : result;
}
