import moment from 'moment';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config';
import { downloadFile, requestPost } from '@/utils/utils';
import { API } from '@config/API';

export default Model.extend({
  namespace: 'timeoutServices',
  state: {
    // 超时服务页面数据
    timeoutServicesData: {
      ColumnList: [],
      LargeRegionAnalysis: [],
      TableList: [],
      TimeoutReasonAnalysis: [],
    },
    largeRegionList: [], // 所属大区
    RepeatServiceReason: [], // 复服务原因
    TimeoutServiceReason: [], // 超时服务原因
  },
  effects: {
    // 获取超时服务统计
    *GetTimeoutServiceAnalysis({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.TimeoutServices.GetTimeoutServiceAnalysis,
        payload,
      );
      if (result.IsSuccess) {
        yield update({
          timeoutServicesData: result.Datas,
        });
        callback && callback(result);
      }
    },
    // 获取超时服务基础数据
    *GetTimeoutServiceInfo({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.TimeoutServices.GetTimeoutServiceInfo,
        payload,
      );
      if (result.IsSuccess) {
        callback && callback(result);
      }
    },
    // 导出
    *ExportTimeoutServiceAnalysis({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.TimeoutServices.ExportTimeoutServiceAnalysis,
        payload,
      );
      if (result.IsSuccess) {
        message.success('导出成功！');
        downloadFile(result.Datas);
      }
    },
    // 基础数据 - 导出
    *ExportTimeoutServiceInfo({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.TimeoutServices.ExportTimeoutServiceInfo,
        payload,
      );
      if (result.IsSuccess) {
        message.success('导出成功！');
        downloadFile(result.Datas);
      }
    },
    // 获取所属大区
    *getLargeRegion({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.CtCommonApi.GetLargeRegionList, payload);
      if (result.IsSuccess) {
        yield update({
          largeRegionList: result.Datas,
        });
      }
    },
    // 获取超时服务原因与重复服务原因
    *GetReasonList({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.CtAPI_WJQ.CTBaseDataApi.GetReasonList, payload);
      if (result.IsSuccess) {
        yield update({
          RepeatServiceReason: result.Datas.RepeatServiceReason,
          TimeoutServiceReason: result.Datas.TimeoutServiceReason,
        });
      }
    },
  },
});
