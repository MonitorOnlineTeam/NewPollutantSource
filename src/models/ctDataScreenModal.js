import moment from 'moment';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config';
import { downloadFile, requestPost } from '@/utils/utils';
import { API } from '@config/API';

export default Model.extend({
  namespace: 'ctDataScreen',
  state: {},
  effects: {
    // 获取地图数据
    *GetDeviceInformationMap({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.CTDataScreenApi.GetDeviceInformationMap,
        payload,
      );
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      }
    },
    // 设备信息总览
    *GetDeviceInformationAnalysis({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.CTDataScreenApi.GetDeviceInformationAnalysis,
        payload,
      );
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      }
    },
    // 项目执行情况统计
    *GetProjectExecutionAnalysis({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.CTDataScreenApi.GetProjectExecutionAnalysis,
        payload,
      );
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      }
    },
    // 服务响应及时率与 服务报告及时合格率
    *GetTimelyRateAnalysis({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.CTDataScreenApi.GetTimelyRateAnalysis,
        payload,
      );
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      }
    },
    //安装调试达标率 客户满意度
    *GetInstallationDebuggingAnalysis({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.CTDataScreenApi.GetInstallationDebuggingAnalysis,
        payload,
      );
      callback && callback(result);
    },
    // 售后服务统计
    *GetAfterSalesServiceAnalysis({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.CTDataScreenApi.GetAfterSalesServiceAnalysis,
        payload,
      );
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      }
    },
    // 设备信息 - 弹窗
    *GetDeviceInformationList({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.CTDataScreenApi.GetDeviceInformationList,
        payload,
      );
      if (result.IsSuccess) {
        callback && callback(result);
      }
    },
    // 设备信息 - 弹窗 - 导出
    *ExportDeviceInformationList({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.CTDataScreenApi.ExportDeviceInformationList,
        payload,
      );
      if (result.IsSuccess) {
        message.success('导出成功！');
        downloadFile(result.Datas);
      }
    },
    // 项目执行情况统计 - 弹窗
    *GetProjectExecutionStatus({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.CTDataScreenApi.GetProjectExecutionStatus,
        payload,
      );
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      }
    },
    // 项目执行情况统计 - 弹窗 - 导出
    *ExportProjectExecutionStatus({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.CTDataScreenApi.ExportProjectExecutionStatus,
        payload,
      );
      if (result.IsSuccess) {
        message.success('导出成功！');
        downloadFile(result.Datas);
      }
    },
  },
});
