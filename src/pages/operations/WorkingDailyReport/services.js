/*
 * @Author: Jiaqi
 * @Date: 2019-04-24 17:35:19
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2019-05-23 15:00:14
 */
import { post, get } from '@/utils/request';

// 获取基础报表数据
export async function getBaseReportList(params) {
  const body = {
    ...params,
  };
  const result = post('/api/rest/PollutantSourceApi/DataReport/GetOperationStatistics', body, null);
  return result === null
    ? {
        data: null,
      }
    : result;
}

// 导出基础报表
export async function exportBaseReport(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/DataReport/GetOperationStatisticsExcel',
    params,
    null,
  );
  return result === null
    ? {
        data: null,
      }
    : result;
}

// 获取可导出列
export async function getExcelField(params) {
  const result = post('/api/rest/PollutantSourceApi/DataReport/GetExcelField', params, null);
  return result === null
    ? {
        data: null,
      }
    : result;
}

// 统计
export async function baseReportStatistics(params) {
  const result = posturl(
    '/api/rest/PollutantSourceApi/DataReport/OperationStatistics',
    params,
    null,
  );
  return result === null
    ? {
        data: null,
      }
    : result;
}

// 获取项目省区表
export async function getProjectProvince(params) {
  const result = post('/api/rest/PollutantSourceApi/PProject/GetProjectProvince', params, null);
  return result === null
    ? {
        data: null,
      }
    : result;
}

// 获取分类
export async function getEquipmentTypeList(params) {
  const result = post('/api/rest/PollutantSourceApi/PProject/GetEquipmentTypeList', params, null);
  return result === null
    ? {
        data: null,
      }
    : result;
}

// 获取设备类别系数
export async function getEquipmentCoffList(params) {
  const result = post('/api/rest/PollutantSourceApi/PProject/GetEquipmentCoffList', params, null);
  return result === null
    ? {
        data: null,
      }
    : result;
}

// 获取省区运营数据
export async function getProvinceReportList(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/DataReport/GetOperationStatisticsByDepart',
    params,
    null,
  );
  return result === null
    ? {
        data: null,
      }
    : result;
}

// 导出省区运营数据
export async function exportProvinceReport(params) {
  const result = post('/api/rest/PollutantSourceApi/DataReport/GetDepartReportExcel', params, null);
  return result === null
    ? {
        data: null,
      }
    : result;
}

// 获取运营工时数据
export async function getPersonalHoursList(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/DataReport/GetOperationStatisticsByPerson',
    params,
    null,
  );
  return result === null
    ? {
        data: null,
      }
    : result;
}

// 导出运营工时数据
export async function exportPersonalHoursReport(params) {
  const result = post('/api/rest/PollutantSourceApi/DataReport/GetPersonReportExcel', params, null);
  return result === null
    ? {
        data: null,
      }
    : result;
}

// 获取设备所在单位名称
export async function getEnterpriseList(params) {
  const result = post('/api/rest/PollutantSourceApi/DataReport/GetEntList', params, null);
  return result === null
    ? {
        data: null,
      }
    : result;
}

// 保存用户选择字段
export async function saveFieldForUser(params) {
  const result = post('/api/rest/PollutantSourceApi/DataReport/SaveFieldForUser', params, null);
  return result === null
    ? {
        data: null,
      }
    : result;
}

// 根据省区获取项目列表
export async function getItemsByProvince(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/DataReport/GetOperationStatisticsByDepartProvince',
    params,
    null,
  );
  return result === null
    ? {
        data: null,
      }
    : result;
}

// 根据项目获取企业及监测点
export async function getEnterpriseByProject(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/DataReport/GetOperationStatisticsByDepartItemNumber',
    params,
    null,
  );
  return result === null
    ? {
        data: null,
      }
    : result;
}

// 根据监测点获取设备信息
export async function getEquipmentByPoint(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/DataReport/GetOperationStatisticsByDepartPoint',
    params,
    null,
  );
  return result === null
    ? {
        data: null,
      }
    : result;
}
