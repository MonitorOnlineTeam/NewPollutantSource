import { post, get, getNew } from '@/utils/request';

/****颗粒物参比****/

//导入
export async function ImportData(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/ImportData',params, null);
  return result;
}

//企业树
export async function GetTestEntTree(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/GetTestEntTree',params, null);
  return result;
}
