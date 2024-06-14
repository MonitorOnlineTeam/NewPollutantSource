import { post, get, getNew } from '@/utils/request';

import { API } from '@config/API'


//获取客户订单列表
export async function GetCustomerOrderList(params) {
  const result = await post(API.AssetManagementApi.GetCustomerRenewList,params, null);
  return result;
}
//获取客户订单用户列表
export async function GetCustomerOrderUserList(params) {
  const result = await post(API.AssetManagementApi.GetCustomerList,params, null);
  return result;
}

// 获取客户订单企业与排口列表
export async function GetCustomerOrderPointEntList(params) {
  const result = await post(`${API.AssetManagementApi.GetCustomerPointAuthorityList}?UserId=${params.userId}`,null, null);
  return result;
}
 
// 添加客户订单
export async function AddCustomerOrder(params) {
  const result = await post(API.AssetManagementApi.AddCustomerRenewInfo,params, null);
  return result;
}

// 删除客户订单
export async function DeleteCustomerOrder(params){
  const result = await post(`${API.AssetManagementApi.DeleteCustomerRenewInfo}?ID=${params.ID}`,null, null);
  return result;
}

// 客户订单续费
export async function RenewOrder(params){
  const result = await post(API.AssetManagementApi.UpdateCustomerRenewInfo,params, null);
  return result;
}

//客户订单明细
export async function GetCustomerOrderInfoList(params){
  const result = await post(API.AssetManagementApi.GetCustomerRenewDetail,params, null);
  return result;
}
// 删除客户订单详情
export async function DeleteCustomerOrderInfo(params){
  const result = await post(`${API.AssetManagementApi.DeleteCustomerRenewDetail}?ID=${params.ID}`,null, null);
  return result;
}