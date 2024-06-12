import { post, get, getNew } from '@/utils/request';
import { API } from '@config/API'

//设备信息 列表
export async function GetEquipmentInfoList(params) {
  const result = await post(API.AssetManagementApi.GetEquipmentList,params, null);
  return result;
}
