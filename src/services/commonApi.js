import { post, get } from '@/utils/request';

// 行政区划
export async function getEnterpriseAndPoint(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetXuRegions', params, null);
  return result === null ? { data: null } : result;
}

// 获取污染物类型
export async function getPollutantTypeList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetPollutantTypeList', params, null);
  return result === null ? { data: null } : result;
}
let websocket = null;
/**
 * 获取系统配置信息
 * @params {}
 */
export async function getSystemConfigInfo() {
  const result = await get('/api/rest/PollutantSourceApi/SystemSettingApi/GetSystemConfigInfo');
  return result;
}

// 获取运维日志详情图片
export async function getOperationImageList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskProcessingApi/GetRecordPhotoName', params, null);
  return result;
}

// 根据污染物类型获取污染物
export async function getPollutantTypeCode(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetPollutantTypeCode', params, null);
  return result;
}

// 获取行业列表
export async function getIndustryTree(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetIndustryTree', params, null);
  return result;
}

// 获取组件 - 企业及排口
export async function getEntAndPoint(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetEntAndPoint', params, null);
  return result;
}

/**
 * 基本信息-更新监测点的运营开始结束时间
 * @param {传递参数} 传递参数
 * @param {操作} 操作项
 */
export async function CreatQRCode(params) {
  const result = post('/api/rest/PollutantSourceApi/BaseDataApi/CreateQRCode', params, null);
  return result === null ? {
      data: null
  } : result;
}


