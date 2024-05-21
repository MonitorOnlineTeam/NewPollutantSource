import { post } from '@/utils/request';
import { API } from '@config/API'

/**
 * 区域浓度对比 
 *
 */
export async function GetAreaDensityContrast(params) {
  const result = post(
    API.StatisticAnalysisApi.GetAreaDensityContrast,
    params,
    null,
  );

  return result;
}


//导出
export async function ExportSewageHistoryList(params) {
  const result = post(
    API.StatisticAnalysisApi.ExportAreaDensityContrast,
    params,
    null,
  );

  return result;
}