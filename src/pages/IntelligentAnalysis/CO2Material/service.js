
import { post, get } from '@/utils/request';

// 获取所有企业
export async function getAllEnterprise(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetEntList', params, null);
  return result;
}
// 

// 
export async function getGHGEchartsData(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetCO2QuotaAlarm', params, null);
  return result;
}

// 获取柱状体详细数据
export async function getEchartsItemTableDataSource(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetCO2QuotaList', params, null);
  return result;
}


// 月度排放量比较数据
export async function getCO2MonthDischarge(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetCO2MonthDischarge', params, null);
  return result;
}

// 温室气体线性回归分析
export async function getCO2LinearAnalysis(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/getCO2LinearAnalysis', params, null);
  return result;
}