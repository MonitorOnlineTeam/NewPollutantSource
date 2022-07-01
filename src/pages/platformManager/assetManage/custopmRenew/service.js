import { post, get, getNew } from '@/utils/request';




//获取客户订单列表
export async function GetCustomerOrderList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/GetCustomerOrderList',params, null);
  return result;
}
//获取客户订单用户列表
export async function GetCustomerOrderUserList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/GetCustomerOrderUserList',params, null);
  return result;
}

// 获取客户订单企业与排口列表
export async function GetCustomerOrderPointEntList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/GetCustomerOrderPointEntList?UserId='+ params.userId,null, null);
  return result;
}
 
// 添加客户订单
export async function AddCustomerOrder(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/AddCustomerOrder',params, null);
  return result;
}
