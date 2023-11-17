import { post } from '@/utils/request';

/** 删除车辆信息 */
export async function DeleteOperationSys(params) {
  const result = await post('/api/rest/PollutantSourceApi/OperationSysApi/DeleteOperationSysTable', params, null);
  return result;
}
/** 添加停产 */
export async function addoutputstop(params) {
  const result = post('/api/rest/PollutantSourceApi/OutputStopApi/AddOutputStop', params.FormData, null);
  return result;
}
/** 删除停产 */
export async function deleteoutputstop(params) {
  debugger;
  const result = post(`/api/rest/PollutantSourceApi/OutputStopApi/DeleteOutputStopById?ID=${params.ID}`, '', null);
  return result;
}
/** 编辑停产 */
export async function editoutputstop(params) {
  debugger;
  const result = post('/api/rest/PollutantSourceApi/OutputStopApi/UpdateOutputStop', params.FormData, null);
  return result;
}