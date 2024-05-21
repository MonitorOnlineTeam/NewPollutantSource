import { post } from '@/utils/request';
import { API } from '@config/API'

/**
 * 区域浓度对比 
 *
 */
export async function GetAreaDensityRanking(params) {
  const result = post(
    API.StatisticAnalysisApi.GetAreaDensityRanking,
    params,
    null,
  );

  return result;
}


//导出
export async function ExportSewageHistoryList(params) {
  const result = post(
    API.StatisticAnalysisApi.ExportAreaDensityRanking,
    params,
    null,
  );

  return result;
}


