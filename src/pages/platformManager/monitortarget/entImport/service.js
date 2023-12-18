import { post } from '@/utils/request';
import { API} from '@config/API';

/**
 * 
 * 保存入库
 */
export async function InsertImportEnt(params) {
  const result = post(
    API.AssetManagementApi.ImportEntInfo,
    params,
    null,
  );

  return result;
}
