import { post } from '@/utils/request';

/** 获取运维周期 */
export async function GetMaintenanceReminder(params) {
  const result = post(`/api/rest/PollutantSourceApi/MaintenanceReminderApi/GetMaintenanceReminder?PointCode=${params.PointCode}&Type=${params.Type}`, null);
  return result === null ? {
    data: null,
  } : result;
}
/** 添加或更新运维周期 */
export async function AddOrUpdateMaintenanceReminder(params) {
  const result = post('/api/rest/PollutantSourceApi/MaintenanceReminderApi/AddOrUpdateMaintenanceReminder', params, null);
  return result === null ? {
    data: null,
  } : result;
}
/** 删除运维周期 */
export async function DeleteMaintenanceReminder(params) {
  const result = post(`/api/rest/PollutantSourceApi/MaintenanceReminderApi/DeleteMaintenanceReminder?ID=${params.ID}`, null);
  return result === null ? {
    data: null,
  } : result;
}
