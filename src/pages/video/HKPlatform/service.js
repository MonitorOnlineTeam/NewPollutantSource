import { post, get, getNew } from '@/utils/request';

// 获取所有企业及排口信息
export async function getPreviewURLs(params) {
  const result = await post('/api/video/v2/cameras/previewURLs', params, null);
  return result;
}