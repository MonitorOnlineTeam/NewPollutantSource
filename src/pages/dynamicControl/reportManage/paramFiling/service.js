import { post, get, getNew } from '@/utils/request';





// 动态管控 参数备案 列表
export async function GetParameterFilingList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetParameterFilingList', params, null);
  return result.Datas === null ? {
    ...result,
    Datas: [],
  } : result;
}


// 编辑 添加
export async function AddOrUpdParameterFiling(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/AddOrUpdParameterFiling', params, null);
  return result.Datas === null ? {
    ...result,
    Datas: [],
  } : result;
}

//  删除
export async function DeleteParameterFiling(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/DeleteParameterFiling', params, null);
  return result.Datas === null ? {
    ...result,
    Datas: [],
  } : result;
}

//  参数码表
export async function GetParaCodeList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetParaCodeList', params, null);
  return result.Datas === null ? {
    ...result,
    Datas: [],
  } : result;
}

// 备案
export async function UpdateApproveState(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/UpdateApproveState', params, null);
  return result.Datas === null ? {
    ...result,
    Datas: [],
  } : result;
}

//仪器列表 

export async function GetParaPollutantCodeList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetParaPollutantCodeList', params, null);
  return result.Datas === null ? {
    ...result,
    Datas: [],
  } : result;
}