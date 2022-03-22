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
