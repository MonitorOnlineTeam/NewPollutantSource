import { post, get } from '@/utils/request';

// 获取值班人员和值班领导信息
export async function getDutyPerson(params) {
  const result = await post('/api/rest/PollutantSourceApi/Emergency/GetDutyPerson', params);
  return result;
}


// 获取
export async function getDutyTableList(params) {
  const result = await post('/api/rest/PollutantSourceApi/Emergency/GetDutyList', params);
  return result;
}

// 获取一条
export async function getDutyOne(params) {
  const result = await post('/api/rest/PollutantSourceApi/Emergency/GetDutyOne', params);
  return result;
}

// 获取码表
export async function getDictionaryList(params) {
  const result = await post('/api/rest/PollutantSourceApi/Emergency/GetInfoSources', params);
  return result;
}

// 保存甄别数据
export async function saveIdentifyInfo(params) {
  const result = post('/api/rest/PollutantSourceApi/Emergency/Screening', params);
  return result;
}

// 获取涉事企业
export async function getNarrationEntList(params) {
  const result = post('/api/rest/PollutantSourceApi/Emergency/GetListTable', params);
  return result;
}

// 保存涉事企业
export async function saveEntAndMingan(params) {
  const result = post('/api/rest/PollutantSourceApi/Emergency/SetSensitiveOrEnt', params);
  return result;
}

// 获取保存的涉事企业
export async function getSaveEntAndMingan(params) {
  const result = post('/api/rest/PollutantSourceApi/Emergency/GetRelationTable', params);
  return result;
}

// 获取敏感目标
export async function getSensitiveList(params) {
  const result = post('/api/rest/PollutantSourceApi/Emergency/GetListTable', params);
  return result;
}

// 设置当前选中数据
export async function setCurrent(params) {
  const result = post('/api/rest/PollutantSourceApi/Emergency/SetIsCurrent', params);
  return result;
}

// 删除涉事企业及敏感点
export async function delSensitiveOrEnt(params) {
  const result = post('/api/rest/PollutantSourceApi/Emergency/DelSensitiveOrEnt', params);
  return result;
}

// 获取步骤条
export async function getStepBar(params) {
  const result = post('/api/rest/PollutantSourceApi/Emergency/GetStepBar', params);
  return result;
}

// 获取数据接口（1敏感目标，2涉事企业，3音视频材料，4应急预案，5救援队，6专家，7物资，8装备，9车辆，10现场调查，11处置，12快报）
export async function getListTable(params) {
  const result = post('/api/rest/PollutantSourceApi/Emergency/GetListTable', params);
  return result;
}

// 获取保存后数据接口（1敏感目标，2涉事企业，3音视频材料，4应急预案，5救援队，6专家，7物资，8装备，9车辆，10现场调查，11处置，12快报）
export async function getRelationTable(params) {
  const result = post('/api/rest/PollutantSourceApi/Emergency/GetRelationTable', params);
  return result;
}

// 保存关联数据（1敏感目标，2涉事企业，3音视频材料，4应急预案，5救援队，6专家，7物资，8装备，9车辆，10现场调查，11处置，12快报）
export async function saveDispatch(params) {
  const result = post('/api/rest/PollutantSourceApi/Emergency/SetSensitiveOrEnt', params);
  return result;
}

// 删除关联数据 {RelationCode: xxx}
export async function deleteDispatch(params) {
  const result = post('/api/rest/PollutantSourceApi/Emergency/DelSensitiveOrEnt', params);
  return result;
}


// 启动预案
export async function startPlan(params) {
  const result = post('/api/rest/PollutantSourceApi/Emergency/StartPlan', params);
  return result;
}


// 采样保存
export async function saveSamplingData(params) {
  const result = post('/api/rest/PollutantSourceApi/Emergency/AddOrUpdSampling', params);
  return result;
}

// 删除
export async function delRecord(params) {
  const result = post('/api/rest/PollutantSourceApi/Emergency/DelRecord', params);
  return result;
}

// 结束
export async function endRecord(params) {
  const result = post('/api/rest/PollutantSourceApi/Emergency/EndRecord', params);
  return result;
}





