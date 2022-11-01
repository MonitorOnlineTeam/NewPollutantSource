/**
 * 功  能：服务站信息services
 * 创建人：dongxiaoyun
 * 创建时间：2020.05.26
 */
import { post, get } from '@/utils/request';
import { API } from '@config/API'


// 获取所有用户
export async function GetAllOperationUsers(params) {
  const result = get('/api/rest/PollutantSourceApi/SparepartManageApi/GetAllOperationUsers', params, null);
  return result === null ? {
    data: null
  } : result;
}

// 获取服务站信息
export async function getSparePartsStationList(params) {
  const result = get('/api/rest/PollutantSourceApi/SparepartManageApi/getSparePartsStationList', params, null);
  return result === null ? {
    data: null
  } : result;
}


// 保存用户信息
export async function saveSparePartsStationUser(params) {
  const result = post('/api/rest/PollutantSourceApi/SparepartManageApi/saveSparePartsStationUser', params, null);
  return result === null ? {
    data: null
  } : result;
}

// 删除服务站信息
export async function delSparePartsStation(params) {
  const result = get('/api/rest/PollutantSourceApi/SparepartManageApi/delSparePartsStation', params, null);
  return result === null ? {
    data: null
  } : result;
}



