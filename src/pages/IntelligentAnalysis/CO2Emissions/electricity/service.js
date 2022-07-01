
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

// 获取温室气体排放报告
export async function getCO2ReportList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/getCO2ReportList', params, null);
  return result;
}

// 生成温室气体排放报告
export async function createReportCO2(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/DoReportCO2', params, null);
  return result;
}


// 获取缺省值码表
export async function getCO2EnergyType(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetCO2EnergyType', params, null);
  return result;
}

// 判断是否重复 - 是否可添加
export async function JudgeIsRepeat(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/JudgeIsRepeat', params, null);
  return result;
}

//  获取模板下载地址
export async function GetGHGUploadTempletUrl(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetGHGUploadTempletUrl?IndustryCode='+ params.IndustryCode, {});
  return result;
}

