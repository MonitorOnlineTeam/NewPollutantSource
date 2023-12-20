import { post, get, getNew } from '@/utils/request';
import { API} from '@config/API';

// 列表
export async function GetFaultUnitList(params) {
  const result = await post(API.AssetManagementApi.GetFaultUnitList,params, null);
  return result;
}
// 添加
export async function AddFaultUnit(params) {
  const result = await post(API.AssetManagementApi.AddFaultUnitInfo,params, null);
  return result;
}

//  修改
export async function EditFaultUnit(params) {
  const result = await post(API.AssetManagementApi.UpdateFaultUnitInfo,params, null);
  return result;
}
 
//  删除
export async function DelFaultUnit(params) {
  const result = await post(`${API.AssetManagementApi.DeleteFaultUnitInfo}?ID=${params.ID}`,null, null);
  return result;
}

// 监测设备类别
export async function GetTestingEquipmentList(params) {
  const result = await post(API.AssetManagementApi.GetTestingEquipmentList,params, null);
  return result;
}