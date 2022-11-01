import { post, get, getNew } from '@/utils/request';
import { API } from '@config/API'

// 
export async function updViewForKBM(params) {
  const result = await post(API.BaseDataApi.UpdateKnowledgeBaseViewCount, params, null);
  return result;
}

// 获取知识库数据
export async function getKBMList(params) {
  const result = await post(API.BaseDataApi.GetKnowledgeBaseList, params, null);
  return result;
}

// 添加运维人
export async function addOperator(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/AddOperator', params, null);
  return result;
}

// 获取查看运维人信息
export async function getViewUser(params) {
  const result = await post(API.QualityControlApi.GetOperatorOne, params, null);
  return result;
}

// 更新运维人信息
export async function updateOperatorUser(params) {
  const result = await post(API.QualityControlApi.UpdOperator, params, null);
  return result;
}


