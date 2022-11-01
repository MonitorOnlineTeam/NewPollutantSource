
import {
  post,
} from '@/utils/request';
import { API } from '@config/API'
/** 萤石云视频列表 */
export async function getysyList(params) {
  const body = {
    VedioCameraID: params.VedioCameraID,
  };
  const result = post(API.VideoApi.GetCameraMonitorUrl, body);
  return result;
}
/** 质控仪萤石云视频列表 */
export async function getqcaysyList(params) {
  const body = {
    VedioCameraID: params.VedioCameraID,
  };
  const result = post(API.VideoApi.GetCameraMonitorUrl, body);
  return result;
}
/** 获取摄像头列表 */
export async function getvideolist(params) {
  const body = {
    DGIMN: params.DGIMN,
  };
  const result = post(API.VideoApi.GetVideoList, body, null);
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
