import moment from 'moment';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config';
import { downloadFile, requestPost } from '@/utils/utils';
import { API } from '@config/API';

export default Model.extend({
  namespace: 'reportAudit',
  state: {},
  effects: {
    // 获取服务报告审核列表
    *GetStayCheckServices({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.ReportAuditApi.GetStayCheckServices,
        payload,
      );
      if (result.IsSuccess) {
        callback && callback(result);
      }
    },
    // 获取未被抽查服务列表
    *GetDealOpinions({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        `${API.CtAPI_WJQ.ReportAuditApi.GetDealOpinions}?ID=${payload.id}`,
        {},
      );
      if (result.IsSuccess) {
        callback && callback(result);
      }
    },
    // 提交审核
    *AuditService({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.CtAPI_WJQ.ReportAuditApi.AuditService, payload);
      if (result.IsSuccess) {
        callback && callback(result);
      }
    },
  },
});
