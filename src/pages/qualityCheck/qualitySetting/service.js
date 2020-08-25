import { post, get, getNew } from '@/utils/request';





// 质控核查 质控核查设置 列表
export async function getCycleQualityControlList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetCycleQualityControlList', params, null);
  return result.Datas === null ? {
    Datas: [],
  } : result;
}
