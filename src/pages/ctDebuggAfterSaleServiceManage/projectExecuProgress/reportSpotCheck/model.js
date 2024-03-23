import moment from 'moment';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config';
import { downloadFile, requestPost } from '@/utils/utils';
import { API } from '@config/API';

export default Model.extend({
  namespace: 'reportSpotCheck',
  state: {},
  effects: {
    // 获取已抽查服务列表
    *GetCheckServiceList({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.ReportSpotCheckApi.GetCheckServiceList,
        payload,
      );
      if (result.IsSuccess) {
        callback && callback(result);
      }
    },
    // 获取未被抽查服务列表
    *GetServiceReportList({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.ReportSpotCheckApi.GetServiceReportList,
        payload,
      );
      if (result.IsSuccess) {
        callback && callback(result);
      }
    },
    // 获取单个服务详情
    *GetSingleServiceReport({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.ReportSpotCheckApi.GetSingleServiceReport,
        payload,
      );
      if (result.IsSuccess) {
        callback && callback(result);
      }
    },
    // 添加服务抽查报告
    *AddCheckServiceReport({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.ReportSpotCheckApi.AddCheckServiceReport,
        payload,
      );
      if (result.IsSuccess) {
        callback && callback(result);
      }
    },
    // 删除
    *DelteCheckServiceReport({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.ReportSpotCheckApi.DelteCheckServiceReport,
        payload,
      );
      if (result.IsSuccess) {
        message.success('删除成功！');
        callback && callback(result);
      }
    },
    // 导出
    *ExportCheckServiceList({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.ReportSpotCheckApi.ExportCheckServiceList,
        payload,
      );
      if (result.IsSuccess) {
        message.success('导出成功！');
        downloadFile(result.Datas);
      }
    },
  },
});
