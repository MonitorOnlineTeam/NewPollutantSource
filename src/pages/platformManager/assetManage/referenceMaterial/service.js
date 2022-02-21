import { post, get, getNew } from '@/utils/request';

//设备信息 列表
export async function GetEquipmentInfoList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetEquipmentInfoList',params, null);
  return result;
}
//设备信息 添加
export async function AddEquipmentInfo(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/AddEquipmentInfo',params, null);
  return result;
}

// 设备信息 修改
export async function EditEquipmentInfo(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/EditEquipmentInfo',params, null);
  return result;
}
 
// 设备信息  删除
export async function DelEquipmentInfo(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/DelEquipmentInfo',params, null);
  return result;
}
