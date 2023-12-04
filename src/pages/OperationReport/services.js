import { post } from '@/utils/request';
import { API } from '@config/API';

// 设备异常统计
export async function GetOpertionExceptionList(params) {
  const result = await post(
    '/api/rest/PollutantSourceApi/OperationHomeApi/GetOpertionExceptionList',
    params,
  );
  return result;
}

// 根据企业获取排口
export async function getPointByEntCode(params) {
  const result = await post(
    '/api/rest/PollutantSourceApi/BaseDataApi/GetNoFilterPointByEntCode',
    params,
  );
  return result;
}

// 超标报警审核率
export async function GetAlarmVerifyRateDetail(params) {
  const result = await post(
    API.IntelligentDiagnosis.GetAlarmVerifyRateDetail,
    params,
  );
  return result;
}

// 获取核实结果数量
export async function GetAlarmReport(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetAlarmReport', params);
  return result;
}

// 异常报警响应统计
export async function GetExceptionReportDataList(params) {
  const result = await post(
    '/api/rest/PollutantSourceApi/BaseDataApi/GetExceptionReportDataList',
    params,
  );
  return result;
}

// 缺失报警统计
export async function GetMissReportDataList(params) {
  const result = await post(
    '/api/rest/PollutantSourceApi/BaseDataApi/GetMissReportDataList',
    params,
  );
  return result;
}

// 有效传输率统计
export async function GetEfficiencyReportDataList(params) {
  const result = await post(
    '/api/rest/PollutantSourceApi/TransmissionEfficiencyApi/GetEfficiencyReportDataList',
    params,
  );
  return result;
}

// 运维情况统计
export async function GetOperationPlanTaskRate(params) {
  const result = await post(
    '/api/rest/PollutantSourceApi/OperationHomeApi/GetOperationPlanTaskRate',
    params,
  );
  return result;
}

// 运维派单统计
export async function GetOperationTaskList(params) {
  const result = await post(
    API.VisualKanbanApi.GetOperationTaskStatisticsInfo,
    params,
  );
  return result;
}

// 耗材更换统计
export async function GetConsumablesList(params) {
  const result = await post(
    API.VisualKanbanApi.GetVisualDashBoardConsumablesStatisticsInfo,
    params,
  );
  return result;
}

// 运维台账填报数量统计
export async function GetOperationRecordAnalyList(params) {
  const result = await post(
    '/api/rest/PollutantSourceApi/TaskProcessingApi/GetOperationRecordAnalyList',
    params,
  );
  return result;
}

// 运维报告表格数据
export async function GetOperationEvaReportList(params) {
  const result = await post(
    '/api/rest/PollutantSourceApi/OperationHomeApi/GetOperationEvaReportList',
    params,
  );
  return result;
}
