import { post, get } from '@/utils/request';
import { API } from '@config/API'

// 获取企业列表
export async function getEntByRegionAndAtt(params) {
  const result = post(API.RegionApi.GetEntByRegionAndAtt, params, null)
  return result
}

// 获取日报表数据
export async function getDayReportTableData(params) {
  const result = post('/api/rest/PollutantSourceApi/MonDataApi/GetCO2Params', params, null)
  return result
}

