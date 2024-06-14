import * as services from './services';
import Model from '@/utils/model';
import { message } from 'antd';

export default Model.extend({
  namespace: 'OperationReport',
  state: {
    regionalList: [],
    // 设备异常统计
    SBYCData: {
      rate: '-',
      missingDataRate: '-', // 数据缺失率
      dataConstantRate: '-', // 数据恒定值率
      dataZeroRate: '-', // 数据零值率
      faultDataRate: '-', // 设备故障率
      systemMaintenanceRate: '-', // 系统维护率
    },
    // 故障修复
    GZXFData: {
      rate: '-', // 故障修复率
      faultAllNum: '-', // 故障总数
      faultNum: '-', // 故障修复数
    },
  },
  effects: {
    // 获取设备异常统计 故障修复率
    *GetOpertionExceptionList({ payload }, { call, select, update }) {
      const result = yield call(services.GetOpertionExceptionList, payload);
      if (result.IsSuccess) {
        yield update({
          SBYCData: {
            rate: result.Datas.exceptionRate,
            missingDataRate: result.Datas.missingDataRate, // 数据缺失率
            dataConstantRate: result.Datas.dataConstantRate, // 数据恒定值率
            dataZeroRate: result.Datas.dataZeroRate, // 数据零值率
            faultDataRate: result.Datas.faultDataRate, // 设备故障率
            systemMaintenanceRate: result.Datas.systemMaintenanceRate, // 系统维护率
          },
          GZXFData: {
            rate: result.Datas.repairRate, // 故障修复率
            faultAllNum: result.Datas.faultAllNum, // 故障总数
            faultNum: result.Datas.faultNum, // 故障修复数
          },
        });
      } else {
        message.error(result.Message);
      }
    },
    // 根据企业获取排口信息
    *getPointByEntCode({ payload, callback }, { call, select, update }) {
      const result = yield call(services.getPointByEntCode, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 超标报警核实率
    *GetAlarmVerifyRateDetail({ payload, callback }, { call, select, update }) {
      const result = yield call(services.GetAlarmVerifyRateDetail, payload);
      if (result.IsSuccess) {
        // if (result.Datas.ReportDataList.AllRespondedRate) {
        //   callback && callback(result.Datas.ReportDataList);
        // }
        callback && callback(result.Datas.ReportDataList);
      } else {
        message.error(result.Message);
      }
    },
    // 获取核实结果数量
    *GetAlarmReport({ payload, callback }, { call, select, update }) {
      const result = yield call(services.GetAlarmReport, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 异常报警响应统计
    *GetExceptionReportDataList({ payload, callback }, { call, select, update }) {
      const result = yield call(services.GetExceptionReportDataList, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 缺失报警统计
    *GetMissReportDataList({ payload, callback }, { call, select, update }) {
      const result = yield call(services.GetMissReportDataList, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 有效传输率统计
    *GetEfficiencyReportDataList({ payload, callback }, { call, select, update }) {
      const result = yield call(services.GetEfficiencyReportDataList, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 运维情况统计
    *GetOperationPlanTaskRate({ payload, callback }, { call, select, update }) {
      const result = yield call(services.GetOperationPlanTaskRate, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 运维派单统计
    *GetOperationTaskList({ payload, callback }, { call, select, update }) {
      const result = yield call(services.GetOperationTaskList, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 耗材更换统计
    *GetConsumablesList({ payload, callback }, { call, select, update }) {
      const result = yield call(services.GetConsumablesList, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 运维台账填报数量统计
    *GetOperationRecordAnalyList({ payload, callback }, { call, select, update }) {
      const result = yield call(services.GetOperationRecordAnalyList, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas.ReportDataList);
      } else {
        message.error(result.Message);
      }
    },
    // 运维报告表格数据
    *GetOperationEvaReportList({ payload, callback }, { call, select, update }) {
      const result = yield call(services.GetOperationEvaReportList, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
  },
});
