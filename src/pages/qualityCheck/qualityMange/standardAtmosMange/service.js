import { post, get, getNew } from '@/utils/request';
import { API } from '@config/API'



// 质控核查 标气管理
export async function getQCAStandardManagement(params) {
  const result = await post(API.QualityControlApi.GetQCStandard, params, null);
  return result;
}

// 导出数据
export async function exportDatas(params) {
  const result = await post(API.QualityControlApi.ExportQCStandard, params, null);
  return result;
}