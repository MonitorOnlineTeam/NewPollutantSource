import { post } from '@/utils/request';

/**
 * 运维人员列表
 *
 */
export async function GetOperationPointList(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/BaseDataApi/GetOperationPointList',
    params,
    null,
  );

  return result;
}
/**
 * 编辑或添加
 *
 */
export async function AddOrUpdateOperationPoint(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/BaseDataApi/AddOrUpdateOperationPoint',
    params,
    null,
  );

  return result;
}


//删除
export async function DeleteOperationPoint(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/BaseDataApi/DeleteOperationPoint',
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

