import { post, get, getNew } from '@/utils/request';
import { API } from '@config/API'


// 获取表格数据
export async function getTableData(params) {
  const result = await post(API.IntelligentDiagnosis.GetExceptionReportList, params);
  return result;
}

// 删除项
export async function deleteExceptionItem(params) {
  const result = await post(API.IntelligentDiagnosis.DeleteExceptionReportInfo, {ID:params.ID});
  return result;
}

// 添加、保存
export async function saveAndUpdateException(params) {
  const result = await post(API.IntelligentDiagnosis.AddOrUpdateExceptionReportInfo, params);
  return result;
}

// 获取编辑数据
export async function getExceptionReportedById(params) {
  const result = await post(`/api/rest/PollutantSourceApi/ExceptionApi/GetExceptionReportedById/${params.ID}`, {});
  return result;
}
