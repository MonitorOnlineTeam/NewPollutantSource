import { post, get, getNew } from '@/utils/request';



// 质控核查 质控方案列表
export async function GetQCAProgrammeList(params) {
  const result = await post('/api/rest/PollutantSourceApi/QCAProgrammeApi/GetQCAProgrammeList', params, null);
  return result.Datas === null ? {
    ...result,
    Datas: [],
  } : result;
}
// 添加或修改质控方案

export async function AddOrUpdQCAProgramme(params) {
  const result = await post('/api/rest/PollutantSourceApi/QCAProgrammeApi/AddOrUpdQCAProgramme', params, null);
  return result.Datas === null ? {
    ...result,
    Datas: [],
  } : result;
}

// 应用

export async function ApplicationProgramme(params) {
  const result = await post('/api/rest/PollutantSourceApi/QCAProgrammeApi/ApplicationProgramme', params, null);
  return result.Datas === null ? {
    ...result,
    Datas: [],
  } : result;
}
//获取详情  
export async function GetDetailsFile(params) {
  const result = await post('/api/rest/PollutantSourceApi/QCAProgrammeApi/GetDetailsFile', params, null);
  return result.Datas === null ? {
    ...result,
    Datas: [],
  } : result;
}
// 删除

export async function DelQCAProgramme(params) {
  const result = await post('/api/rest/PollutantSourceApi/QCAProgrammeApi/DelQCAProgramme', params, null);
  return result.Datas === null ? {
    ...result,
    Datas: [],
  } : result;
}
