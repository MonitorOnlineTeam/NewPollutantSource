import { post } from '@/utils/request';
import { API } from '@config/API'

/** 删除车辆信息 */
export async function DeleteOperationSys(params) {
  const result = await post('/api/rest/PollutantSourceApi/OperationSysApi/DeleteOperationSysTable', params, null);
  return result;
}
/** 添加停产 */
export async function addoutputstop(params) {
  const result = post(API.BaseDataApi.AddOutputStop, params);
  return result;
}
/** 删除停产 */
export async function deleteoutputstop(params) {
  const result = post(`${API.BaseDataApi.DeleteOutputStopById}?ID=${params.ID}`, '', null);
  return result;
}
/** 编辑停产 */
export async function editoutputstop(params) {
  const result = post(API.BaseDataApi.UpdateOutputStop, params);
  return result;
}
