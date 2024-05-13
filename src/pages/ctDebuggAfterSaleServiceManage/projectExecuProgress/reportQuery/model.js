import moment from 'moment';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config';
import { downloadFile, requestPost } from '@/utils/utils';
import { API } from '@config/API';

export default Model.extend({
  namespace: 'reportQuery',
  state: {},
  effects: {
    // 获取列表
    *GetAlreadyCheckServices({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.ReportQueryApi.GetAlreadyCheckServices,
        payload,
      );
      if (result.IsSuccess) {
        callback && callback(result);
      }
    },
    // 列表 - 导出
    *ExportGetAlreadyCheckServices({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.ReportQueryApi.ExportGetAlreadyCheckServices,
        payload,
      );
      if (result.IsSuccess) {
        message.success('导出成功！');
        downloadFile(result.Datas);
      }
    },
    // 获取审核情况统计数据
    *GetStatServiceReport({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.ReportQueryApi.GetStatServiceReport,
        payload,
      );
      if (result.IsSuccess) {
        callback && callback(result);
      }
    },
    // 获取审核情况统计数据 - 导出
    *ExportGetStatServiceReport({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.ReportQueryApi.ExportGetStatServiceReport,
        payload,
      );
      if (result.IsSuccess) {
        message.success('导出成功！');
        downloadFile(result.Datas);
      }
    },
    // 大区明细
    *GetServiceReportDesc({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.ReportQueryApi.GetServiceReportDesc,
        payload,
      );
      if (result.IsSuccess) {
        callback && callback(result);
      }
    },
    // 大区明细 - 导出
    *ExportGetServiceReportDesc({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.ReportQueryApi.ExportGetServiceReportDesc,
        payload,
      );
      if (result.IsSuccess) {
        message.success('导出成功！');
        downloadFile(result.Datas);
      }
    },
  },
});
