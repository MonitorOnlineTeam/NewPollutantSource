import { post, get, getNew } from '@/utils/request';

// 获取运维人table数据
export async function getQualityUserList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetOperatorList', params, null);
  return result;
}

// 删除运维人
export async function delOperatorUser(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/DelOperator', params, null);
  return result;
}

// 添加运维人
export async function addOperator(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/AddOperator', params, null);
  return result;
}

// 获取查看运维人信息
export async function getViewUser(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetOperatorOne', params, null);
  return result;
}

// 更新运维人信息
export async function updateOperatorUser(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/UpdOperator', params, null);
  return result;
}

// 删除运维人照片
export async function deletePhoto(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/DelOperatorPhoto', params, null);
  return result;
}

// 导出运维人
export async function exportOperaPerson(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/ExportOperaPerson', params, null);
  return result;
}

