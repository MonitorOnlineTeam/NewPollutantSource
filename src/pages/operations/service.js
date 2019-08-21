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

// 获取运维日志详情图片
export async function getOperationImageList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskProcessingApi/GetRecordPhotoName', params, null);
  return result;
}
