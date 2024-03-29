import { post } from '@/utils/request';

/**
 * 运维人员列表
 *
 */
export async function SelectOperationMaintenancePersonnel(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/BaseDataApi/SelectOperationMaintenancePersonnel',
    params,
    null,
  );

  return result;
}

//删除
export async function DeleteOperationMaintenancePersonnel(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/BaseDataApi/DeleteOperationMaintenancePersonnel',
    params,
    null,
  );

  return result;
}

//运维单位列表
export async function ListOperationMaintenanceEnterprise(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/BaseDataApi/ListOperationMaintenanceEnterprise',
    params,
    null,
  );

  return result;
}

