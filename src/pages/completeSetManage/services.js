import { post, get } from '@/utils/request';

// 获取大区
export async function GetAllRegionalList(params) {
  const result = await post(
    '/newApi/rest/PollutantSourceApi/DailyWorkBaseApi/GetAllRegionalList',
    params,
  );
  return result;
}

// 添加、编辑专家信息
export async function InsOrUpdExpert(params) {
  const result = await post(
    '/newApi/rest/PollutantSourceApi/DailyWorkManagerApi/InsOrUpdExpert',
    params,
  );
  return result;
}

// 查询专家信息
export async function GetExpertList(params) {
  const result = await post(
    '/newApi/rest/PollutantSourceApi/DailyWorkManagerApi/GetExpertList',
    params,
  );
  return result;
}
// 刪除专家信息
export async function DeleteExpert(params) {
  const result = await post(
    '/newApi/rest/PollutantSourceApi/DailyWorkManagerApi/DeleteExpert?ID=' + params.ID,
    {},
  );
  return result;
}
