import { post, get, getNew } from '@/utils/request';
import { API } from '@config/API'


// 获取气瓶数据
export async function getBottleDataList(params) {
  const result = await post(API.QualityControlApi.GetQCStandard, params, null);
  return result;
}


// 发送核查命令
export async function sendQCACheckCMD(params) {
  const result = await post(API.QualityControlApi.SendQCACheckCMD, params, null);
  return result;
}

// 获取质控记录信息
export async function getQCDetailRecord(params) {
  const result = await post(API.QualityControlApi.GetQCDetailRecord, params, null);
  return result;
}

// sendDataExtract
export async function sendDataExtract(params) {
  const result = await post(API.DymaicControlApi.SendGetDataCMD, params, null);
  return result;
}

// 获取盲样核查浓度范围
export async function getSampleRangeFlow(params) {
  const result = await post(API.QualityControlApi.GetSampleRangeFlow, params, null);
  return result;
}


// 提取分钟、小时、日数据
export async function SendSupplementMsg(params) {
  const result = await post(API.MonitorDataApi.SendSupplementMsg, params, null);
  return result;
}

// 获取质控仪状态
export async function getQCAStatus(params) {
  const result = await post(API.QualityControlApi.GetQCAStatus, params, null);
  return result;
}








