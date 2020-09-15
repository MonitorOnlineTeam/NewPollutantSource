import { post, get, getNew } from '@/utils/request';

// 添加排口
export async function addPoint(params) {
  const result = await post('/api/rest/PollutantSourceApi/MonitorPointApi/AddPoint', params);
  return result;
}

// 更新排口
export async function updatePoint(params) {
  const result = await post('/api/rest/PollutantSourceApi/MonitorPointApi/UpdatePoint', params);
  return result;
}

// 获取仪器信息table
export async function getPointInstrument(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetPointInstrument', params);
  return result;
}

// 获取仪器信息列表
export async function getInstrumentSelectList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetInstrumentNameList', params);
  return result;
}

// 获取仪器厂商列表
export async function getFactorySelectList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetInstrumentFactoryList', params);
  return result;
}

// 获取仪器分析方法
export async function getMethodSelectList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetInstrumentFactoryMethod', params);
  return result;
}

// 获取监测项目
export async function getMonitorItem(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetInstrumentMonitorItem', params);
  return result;
}

// 保存监测项目
export async function saveInstrument(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/AddInstrumentPointRelation', params);
  return result;
}

// 删除仪器信息
export async function deleteInstrument(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/DeleteInstrumentPointRelation', params);
  return result;
}


