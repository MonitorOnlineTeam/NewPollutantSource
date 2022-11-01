import { post } from '@/utils/request';
import { API } from '@config/API'

// 添加视频
export async function AddVideoDevice(params) {
  const result = await post(API.VideoApi.AddVideoDevice, params);
  return result;
}

// 添加时判断序列号是否正确
export async function IsTrueSerialNumber(params) {
  const result = await post(API.VideoApi.IsTrueSerialNumber, params);
  return result;
}

// 获取摄像头列表:  视频管理页面的话 Type传 manager  监控页面传monitor
export async function GetVideoList(params) {
  const result = await post(API.VideoApi.GetVideoList, params);
  return result;
}

// 删除
export async function DeleteVideoDeviceOne(params) {
  const result = await post(API.VideoApi.DeleteVideoDeviceOne, params);
  return result;
}

// 获取编辑数据
export async function GetVideoDeviceOne(params) {
  const result = await post(API.VideoApi.GetVideoDeviceOne, params);
  return result;
}

// 更新设备信息
export async function UpdateVideoDeviceOne(params) {
  const result = await post(API.VideoApi.UpdateVideoDeviceOne, params);
  return result;
}

// 获取乐橙云KitToken
export async function GetLeChengKITToken(params) {
  const result = await post(API.VideoApi.GetLeChengKITToken, params);
  return result;
}

// 获取实时视频的数据
export async function queryhistorydatalist(params) {
  const result = await post(API.MonitorDataApi.GetAllTypeDataList, params);
  return result === null ? { data: null } : result;
}