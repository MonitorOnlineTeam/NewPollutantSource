import { post, get, getNew } from '@/utils/request';


// 获取气瓶数据
export async function getBottleDataList(params) {
  const result = await post('/api/rest/PollutantSourceApi/MonDataApi/GetQCAStandardManagement', params, null);
  return result;
}


// 发送核查命令
export async function sendQCACheckCMD(params) {
  const result = await post('/api/rest/PollutantSourceApi/QualityControlApi/SendQCACheckCMD', params, null);
  return result;
}

// 获取状态和质控记录信息
export async function getStateAndRecord(params) {
  const result = await post('/api/rest/PollutantSourceApi/QualityControlApi/GetStateAndRecord', params, null);
  return result;
}









