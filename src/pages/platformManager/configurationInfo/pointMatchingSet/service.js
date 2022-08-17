import { post, get, getNew } from '@/utils/request';




//列表
export async function GetPointStateRelationList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetPointStateRelationList',params, null);
  return result;
}
//弹框
export async function GetStatePointList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetStatePointList',params, null);
  return result;
}

 
// 操作
export async function OperationStatePoint(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/OperationStatePoint',params, null);
  return result;
}

// 删除
export async function DeleteStatePoint(params){
  const result = await post(`/api/rest/PollutantSourceApi/BaseDataApi/DeleteStatePoint`,params, null);
  return result;
}

// 导出
export async function ExportPointStateRelationList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/ExportPointStateRelationList',params, null);
  return result;
}