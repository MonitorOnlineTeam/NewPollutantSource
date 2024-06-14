import { post, get, getNew } from '@/utils/request';

import { API } from '@config/API'


//获取新老协议转换列表
export async function getAgreementTransferList(params) {
  const result = post(API.AssetManagementApi.GetAgreementTransferList, params);
  return result;
}  
// 添加新老协议转换
export async function addAgreementTransfer(params) {
  const result = await post(API.AssetManagementApi.AddAgreementTransfer,params, null);
  return result;
}

// 删除单挑新老协议转换
export async function deleteAgreementTransfer(params) {
  const result = await post(API.AssetManagementApi.DeleteAgreementTransfer,params, null);
  return result;
}
