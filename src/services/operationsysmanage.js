import { post } from '@/utils/request';
import { API } from '@config/API'

/** 删除运维技术资料库信息 */
export async function DeleteOperationSys(params) {
  const result = await post(API.AssetManagementApi.DeleteOperationSysTable, params, null);
  return result;
}
/** 添加停产 */
export async function addoutputstop(params) {
  const result = post(API.IntelligentDiagnosisApi.AddOutputStop, params.FormData, null);
  return result;
}
/** 删除停产 */
export async function deleteoutputstop(params) {
  debugger;
  const result = post(`${API.IntelligentDiagnosisApi.DeleteOutputStopById}?ID=${params.ID}`, '', null);
  return result;
}
/** 编辑停产 */
export async function editoutputstop(params) {
  debugger;
  const result = post(API.IntelligentDiagnosisApi.UpdateOutputStop, params.FormData, null);
  return result;
}