import { post, get, getNew } from '@/utils/request';

// CEMS型号清单 列表
export async function GetSystemModelList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/TestGetSystemModelList',params, null);
  return result;
}
//CEMS型号清单 添加
export async function AddSystemModel(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/TestAddSystemModel ',params, null);
  return result;
}

// CEMS型号清单 修改
export async function EditSystemModel(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/TestEditSystemModel',params, null);
  return result;
}
 
// CEMS型号清单  删除
export async function DelSystemModel(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/TestDelSystemModel ',params, null);
  return result;
}


// CEMS型号清单 获取系统名称列表
export async function GetSystemModelNameList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/TestGetSystemModelList',params, null);
  return result;
}