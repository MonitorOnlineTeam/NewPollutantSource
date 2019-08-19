import { post, get, getNew } from '@/utils/request';

// 获取日历信息
export async function getCalendarInfo(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskProcessingApi/GetCalendarInfo', params, null);
  return result.Datas === null ? {
    Datas: []
  } : result;
}

// 获取异常详细信息
export async function getAbnormalDetailList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskProcessingApi/GetOperationHistoryRecordPageList', params, null);
  return result === null ? {
    data: null
  } : result;
}

// 获取运维日志信息
export async function getOperationLogList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskProcessingApi/GetOperationPageList', params, null);
  return result === null ? {
    data: null
  } : result;
}

// 获取所有污染物
export async function getPollutantList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetPollutantTypeCode', params, null);
  return result === null ? {
    data: null
  } : result;
}

// 获取气泡表格数据
export async function getPointTableData(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/AllTypeSummaryList', params, null);
  return result === null ? {
    data: null
  } : result;
}

// 获取气泡图表数据
export async function getPointChartData(params) {
  const result = await post('/api/rest/PollutantSourceApi/MonDataApi/GetAllTypeDataList', params, null);
  return result === null ? {
    data: null
  } : result;
}
