import { post, get, getNew } from '@/utils/request';
import { API } from '@config/API'





// 动态管控 参数备案 列表
export async function GetParameterFilingList(params) {
  const result = await post(API.DymaicControlApi.GetParameterFilingList, params, null);
  return result.Datas === null ? {
    ...result,
    Datas: [],
  } : result;
}


// 编辑 添加
export async function AddOrUpdParameterFiling(params) {
  const result = await post(API.DymaicControlApi.AddOrUpdParameterFiling, {
    "id@odata.type": "#Guid",
    "instrumentID@odata.type": "#Guid",
    ...params,
  }, null);
  return result.Datas === null ? {
    ...result,
    Datas: [],
  } : result;
}

//  删除
export async function DeleteParameterFiling(params) {
  const result = await post(API.DymaicControlApi.DeleteParameterFiling, params, null);
  return result.Datas === null ? {
    ...result,
    Datas: [],
  } : result;
}

//  参数码表
export async function GetParaCodeList(params) {
  const result = await post(API.DymaicControlApi.GetParaCodeList, params, null);
  return result.Datas === null ? {
    ...result,
    Datas: [],
  } : result;
}

// 备案
export async function UpdateApproveState(params) {
  const result = await post(API.DymaicControlApi.UpdateApproveState, params, null);
  return result.Datas === null ? {
    ...result,
    Datas: [],
  } : result;
}

//仪器列表 
export async function GetParaPollutantCodeList(params) {
  const result = await post(API.DymaicControlApi.GetParaPollutantCodeList, params, null);
  return result.Datas === null ? {
    ...result,
    Datas: [],
  } : result;
}