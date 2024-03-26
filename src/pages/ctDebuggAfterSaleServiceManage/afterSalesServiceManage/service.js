import { post } from '@/utils/request';
import { API } from '@config/API'



// 获取节点服务
export async function GetCompleteNodeServerAnalysis(params) {
  const result = post(API.AfterSalesServiceManageApi.GetCompleteNodeServerAnalysis, params);
  return result;
}

//节点服务 导出
export async function ExportCompleteNodeServerAnalysis(params) {
  const result = post(API.AfterSalesServiceManageApi.ExportCompleteNodeServerAnalysis, params);
  return result;
}
