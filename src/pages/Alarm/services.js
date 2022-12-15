import { post } from '@/utils/request';
import { API } from '@config/API'

// 获取报警记录
export async function getAlarmRecord(params) {
  const result = await post(API.AlarmApi.GetAlarmAndExDetail, params);
  return result;
}