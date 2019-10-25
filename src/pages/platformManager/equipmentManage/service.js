import { post, get, getNew } from '@/utils/request';

// 获取级联下拉数据
export async function getEquipmentWhere(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetEquipmentWhere', params, null);
  return result;
}

// 获取编辑数据
export async function getEquipmentByID(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetEquipmentByID', params, null);
  return result;
}
