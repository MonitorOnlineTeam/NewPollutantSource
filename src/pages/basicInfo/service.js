/**
 * 功  能：基础配置services
 * 创建人：dongxiaoyun
 * 创建时间：2020.8.26
 */
import { post, get } from '@/utils/request';

/**
 * 天添加水质点位
 */
export async function AddPoint(params) {
  const result = post('/api/rest/PollutantSourceApi/BasicInfoApi/AddPoint', params, null);
  return result;
}
/**
 * 修改水质点位
 */
export async function UpdatePoint(params) {
  const result = post('/api/rest/PollutantSourceApi/BasicInfoApi/UpdatePoint', params, null);
  return result;
}
/**
 * 删除水质点位
 */
export async function DeletePoint(params) {
  const result = post('/api/rest/PollutantSourceApi/BasicInfoApi/DeletePoint', params, null);
  return result;
}

