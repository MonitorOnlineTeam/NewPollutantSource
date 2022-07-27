import { post, get, getNew } from '@/utils/request';

//参比仪器设备清单 列表
export async function GetTestParamInfoList (params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetTestParamInfoList',params, null);
  return result;
}
//参比仪器设备清单 添加
export async function TestAddParamInfo(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/TestAddParamInfo',params, null);
  return result;
}

// 参比仪器设备清单 修改
export async function TestEditParamInfo (params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/TestEditParamInfo',params, null);
  return result;
}
 
// 参比仪器设备清单  删除
export async function TestDelParamInfo(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/TestDelParamInfo',params, null);
  return result;
}
