import { post, get } from '@/utils/request';

// 获取导航树
export async function getTreeNodeData(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetTreeNodeData', params, null);
  return result;
}
