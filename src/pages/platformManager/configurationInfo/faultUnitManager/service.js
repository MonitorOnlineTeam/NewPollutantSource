import { post, get, getNew } from '@/utils/request';

// 列表
export async function GetFaultUnitList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetFaultUnitList',params, null);
  return result;
}
// 添加
export async function AddFaultUnit(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/AddFaultUnit',params, null);
  return result;
}

//  修改
export async function EditFaultUnit(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/EditFaultUnit',params, null);
  return result;
}
 
//  删除
export async function DelFaultUnit(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/delFaultUnit',params, null);
  return result;
}

// 监测设备类别
export async function GetTestingEquipmentList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetTestingEquipmentList',params, null);
  return result;
}