import { post, get, getNew } from '@/utils/request';

/**
 * 污染源模型
 */

 
// 生成模型需要的Excl
export async function AddAnomalyModle(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/AddAnomalyModle',params, null);
  return result;
}
// 生成特征库
export async function CreateFeatureLibrary(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/CreateFeatureLibrary',params, null);
  return result;
}

