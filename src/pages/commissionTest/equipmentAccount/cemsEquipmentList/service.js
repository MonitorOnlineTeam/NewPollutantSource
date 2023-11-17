import { post, get, getNew } from '@/utils/request';

//cems设备清单

//设备信息 列表
export async function GetEquipmentInfoList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetTestEquipmentInfoList',params, null);
  return result;
}
//设备信息 添加
export async function AddEquipmentInfo(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/TestAddEquipmentInfo',params, null);
  return result;
}

// 设备信息 修改
export async function EditEquipmentInfo(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/TestEditEquipmentInfo',params, null);
  return result;
}
 
// 设备信息  删除
export async function DelEquipmentInfo(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/TestDelEquipmentInfo',params, null);
  return result;
}



