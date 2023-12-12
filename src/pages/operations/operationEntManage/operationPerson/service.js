import { post } from '@/utils/request';
import { API } from '@config/API';

/**
 * 运维人员列表
 *
 */
export async function SelectOperationMaintenancePersonnel(params) {
  const result = post(
    API.AssetManagementApi.GetMaintainersWorkLicenseList,
    params,
    null,
  );

  return result;
}

//删除
export async function DeleteOperationMaintenancePersonnel(params) {
  const result = post(
    API.AssetManagementApi.DeleteMaintainersWorkLicenseInfo,
    params,
    null,
  );

  return result;
}

// //运维单位列表
// export async function ListOperationMaintenanceEnterprise(params) {
//   const result = post(
//     '/api/rest/PollutantSourceApi/BaseDataApi/ListOperationMaintenanceEnterprise',
//     params,
//     null,
//   );

//   return result;
// }

