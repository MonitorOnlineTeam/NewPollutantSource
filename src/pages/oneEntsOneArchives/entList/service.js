import { post, get, getNew } from '@/utils/request';



// 质控核查 标气管理
export async function GetEntsList(params) {
  const result = await post('/api/rest/PollutantSourceApi/EntRecord/GetEntRecordData?indexStr=' + params.indexStr, {}, null);
  return result;
}