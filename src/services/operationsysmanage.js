import { post } from '@/utils/request';

/** 删除车辆信息 */
export async function DeleteOperationSys(params) {
  const result = await post('/api/rest/PollutantSourceApi/OperationSysApi/DeleteOperationSysTable', params, null);
  return result;
}
