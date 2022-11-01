import { post, get, getNew } from '@/utils/request';
import { API } from '@config/API'





// 质控核查 质控核查设置 列表
export async function GetCycleQualityControlList(params) {
  const result = await post(API.QualityControlApi.GetCycleQualityControlList, params, null);
  return result.Datas === null ? {
    ...result,
    Datas: [],
  } : result;
}


// 质控核查 质控核查设置 保存
export async function AddOrUpdCycleQualityControl(params) {
  const result = await post(API.QualityControlApi.AddOrUpdCycleQualityControl, params, null);
  return result.Datas === null ? {
    ...result,
    Datas: [],
  } : result;
}

// 质控核查 质控核查设置 删除
export async function DeleteCycleQualityControl(params) {
  const result = await post(API.QualityControlApi.DeleteCycleQualityControl, params, null);
  return result.Datas === null ? {
    ...result,
    Datas: [],
  } : result;
}

// 质控核查 质控核查设置 下发
export async function IssueMessage(params) {
  const result = await post(API.QualityControlApi.SendQCCycleCmd, params, null);
  return result.Datas === null ? {
    ...result,
    Datas: [],
  } : result;
}

//盲样核查设置 提示语

export async function GetSampleRangeFlow(params) {
  const result = await post(API.QualityControlApi.GetSampleRangeFlow, params, null);
  return result.Datas === null ? {
    ...result,
    Datas: [],
  } : result;
}
