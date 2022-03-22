import { post, get, getNew } from '@/utils/request';

// 
export async function updViewForKBM(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/UpdViewForKBM', params, null);
  return result;
}

// 获取知识库数据
export async function getKBMList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetKBMList', params, null);
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


