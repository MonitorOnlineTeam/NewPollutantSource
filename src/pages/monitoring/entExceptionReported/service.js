import { post, get, getNew } from '@/utils/request';

// 获取表格数据
export async function getTableData(params) {
  const result = await post('/api/rest/PollutantSourceApi/ExceptionApi/GetExceptionReportedList', params);
  return result;
}

// 删除项
export async function deleteExceptionItem(params) {
  const result = await post(`/api/rest/PollutantSourceApi/ExceptionApi/DeleteExceptionReported/${params.ID}`, {});
  return result;
}

// 添加、保存
export async function saveAndUpdateException(params) {
  const result = await post('/api/rest/PollutantSourceApi/ExceptionApi/AddOrEdtExceptionReported', params);
  return result;
}

// 获取编辑数据
export async function getExceptionReportedById(params) {
  const result = await post(`/api/rest/PollutantSourceApi/ExceptionApi/GetExceptionReportedById/${params.ID}`, {});
  return result;
}
