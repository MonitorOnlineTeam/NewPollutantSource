import { post, get, getNew } from '@/utils/request';
import { API } from '@config/API'

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

// 获取设备管理类型
export async function getEquipmentCategoryPage(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetEquipmentCategoryPage', params, null);
  return result;
}