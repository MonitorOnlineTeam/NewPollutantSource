
import {
  post,
} from '@/utils/request';
/** 萤石云视频列表 */
export async function getysyList(params) {
  const body = {
    VedioCameraID: params.VedioCameraID,
  };
  const result = post('/api/rest/PollutantSourceApi/VideoApi/GetCameraMonitorUrl', body, null);
  return result;
}
/** 质控仪萤石云视频列表 */
export async function getqcaysyList(params) {
  const body = {
    VedioCameraID: params.VedioCameraID,
  };
  const result = post('/api/rest/PollutantSourceApi/VideoApi/GetCameraMonitorUrlByQCA', body, null);
  return result;
}
/** 获取摄像头列表 */
export async function getvideolist(params) {
  const body = {
    DGIMN: params.DGIMN,
  };
  const result = post('/api/rest/PollutantSourceApi/VideoApi/GetVideoList', body, null);
  return result;
}
/** 海康获取视频连接 */
export async function hkvideourl(params) {
  const body = {
    DGIMN: params.DGIMN,
  };
  const result = post('/api/rest/PollutantSourceApi/VideoApi/GetVideoInfoByDgimn', body, null);
  return result === null ? {
    data: null,
  } : result;
}

//
export async function GetVideoTypeByDGIMN(params) {
  const result = post('/api/rest/PollutantSourceApi/VideoApi/GetVideoTypeByDGIMN', params, null);
  return result;
}
