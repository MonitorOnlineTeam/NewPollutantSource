import { post, get, getNew } from '@/utils/request';
import { API } from '@config/API';


//获取关键参数核查整改信息
export async function GetZGCheckList(params) {
  const result = await post(API.SupervisionVerificaApi.GetZGCheckList, params, null);
  return result;
}
//导出关键参数核查整改信息
export async function ExportZGCheckList(params) {
  const result = await post(API.SupervisionVerificaApi.ExportZGCheckList, params, null);
  return result;
}
//获取关键参数核查整改详情信息
export async function GetZGCheckInfoList(params) {
  const result = await post(API.SupervisionVerificaApi.GetZGCheckInfoList, params, null);
  return result;
}
//数据一致性核查整改
export async function UpdZGCouCheck(params) {
  const result = await post(API.SupervisionVerificaApi.UpdZGCouCheck, params, null);
  return result;
}
//量程一致性核查整改
export async function UpdZGRangeCheck(params) {
  const result = await post(API.SupervisionVerificaApi.UpdZGRangeCheck, params, null);
  return result;
}
//参数一致性核查整改
export async function UpdZGParamCheck(params) {
  const result = await post(API.SupervisionVerificaApi.UpdZGParamCheck, params, null);
  return result;
}

//数据量程一致性核查 单位
export async function GetKeyPollutantList(params) {
  const result = await post(API.SupervisionVerificaApi.GetKeyPollutantList, params, null);
  return result;
}
