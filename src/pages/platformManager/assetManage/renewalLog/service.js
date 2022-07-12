import { post, get, getNew } from '@/utils/request';




//客户订单日志  客户订单详细日志
export async function GetCustomerOrderLogs(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/GetCustomerOrderLogs',params, null);
  return result;
}
//客户订单日志  客户订单详细日志 详情
export async function GetCustomerOrderLogsDetail(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/GetCustomerOrderLogs',params, null);
  return result;
}
