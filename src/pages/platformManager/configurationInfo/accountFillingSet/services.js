import { post, get, getNew } from '@/utils/request';


/**
 * 
 * 点位匹配
 */

//列表
export async function GetEntAccountTypeList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetEntAccountTypeList',params, null);
  return result;
}

 
// 添加修改 填报方式
export async function AddOrUpaAccountType(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/AddOrUpaAccountType',params, null);
  return result;
}




// 导出
export async function ExportEntAccountTypeList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/ExportEntAccountTypeList',params, null);
  return result;
}
