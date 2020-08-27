import { post, get, getNew } from '@/utils/request';





// 动态管控 参数备案 列表
export async function GetParameterFilingList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetParameterFilingList', params, null);
  return result.Datas === null ? {
    Message: result.Message,
    Datas: [],
  } : result;
}


// 编辑 添加
export async function AddOrUpdParameterFiling(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/AddOrUpdParameterFiling', params, null);
  return result.Datas === null ? {
    Message: result.Message,
    Datas: [],
  } : result;
}

//  删除
export async function DeleteParameterFiling(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/DeleteParameterFiling', params, null);
  return result.Datas === null ? {
    Message: result.Message,
    Datas: [],
  } : result;
}

//  参数码表
export async function GetParaCodeList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetParaCodeList', params, null);
  return result.Datas === null ? {
    Message: result.Message,
    Datas: [],
  } : result;
}

// 备案
export async function IssueMessage(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/IssueMessage', params, null);
  return result.Datas === null ? {
    Message: result.Message,
    Datas: [],
  } : result;
}
