import { post, get, getNew } from '@/utils/request';





// 质控核查 质控核查设置 列表
export async function GetCycleQualityControlList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetCycleQualityControlList', params, null);
  return result.Datas === null ? {
    ...result,
    Datas: [],
  } : result;
}


// 质控核查 质控核查设置 保存
export async function AddOrUpdCycleQualityControl(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/AddOrUpdCycleQualityControl', params, null);
  return result.Datas === null ? {
    ...result,
    Datas: [],
  } : result;
}

// 质控核查 质控核查设置 删除
export async function DeleteCycleQualityControl(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/DeleteCycleQualityControl', params, null);
  return result.Datas === null ? {
    ...result,
    Datas: [],
  } : result;
}

// 质控核查 质控核查设置 下发
export async function IssueMessage(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/IssueMessage', params, null);
  return result.Datas === null ? {
    ...result,
    Datas: [],
  } : result;
}

//盲样核查设置 提示语

export async function GetSampleRangeFlow(params) {
  const result = await post('/api/rest/PollutantSourceApi/QualityControlApi/GetSampleRangeFlow', params, null);
  return result.Datas === null ? {
    ...result,
    Datas: [],
  } : result;
}
