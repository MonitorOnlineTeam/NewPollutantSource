/*
 * @Author: outman0611
 * @Date: 2024-06-11 14:29:31
 * @LastEditors: outman0611
 * @LastEditTime: 2024-09-29 10:29:39
 */
import { post } from '@/utils/request';

/**
 * 删除功能
 *
 */
export async function DeleteOperationMaintenanceEnterpriseID(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/BaseDataApi/DeleteOperationMaintenanceEnterpriseID',
    params,
    null,
  );

  return result;
}
