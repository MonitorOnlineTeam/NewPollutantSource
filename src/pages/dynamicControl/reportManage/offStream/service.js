import { post, get, getNew } from '@/utils/request';

// 保存停运
export async function saveOutputStop(params) {
  const result = await post('/api/rest/PollutantSourceApi/OutputStopApi/AddOutputStop', params, null);
  return result;
}

// 删除
export async function deleteStop(params) {
  const result = await post(`/api/rest/PollutantSourceApi/OutputStopApi/DeleteOutputStopById/${params.id}`, {}, null);
  return result;
}



