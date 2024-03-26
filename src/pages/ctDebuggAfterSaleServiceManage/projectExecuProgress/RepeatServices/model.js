import moment from 'moment';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config';
import { downloadFile, requestPost } from '@/utils/utils';
import { API } from '@config/API';

export default Model.extend({
  namespace: 'repeatServices',
  state: {
    // 重复服务页面数据
    repeatServicesData: {
      ColumnList: [],
      LargeRegionAnalysis: [],
      TableList: [],
      TimeoutReasonAnalysis: [],
    },
    largeRegionList: [], // 所属大区
    RepeatServiceReason: [], // 重复服务原因
  },
  effects: {
    // 获取重复服务统计
    *GetRepeatServiceAnalysis({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.RepeatServices.GetRepeatServiceAnalysis,
        payload,
      );
      if (result.IsSuccess) {
        yield update({
          repeatServicesData: result.Datas,
        });
        callback && callback(result);
      }
    },
    // 获取超时服务基础数据
    *GetRepeatServiceInfo({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.RepeatServices.GetRepeatServiceInfo,
        payload,
      );
      if (result.IsSuccess) {
        callback && callback(result);
      }
    },
    // 导出
    *ExportRepeatServiceAnalysis({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.RepeatServices.ExportRepeatServiceAnalysis,
        payload,
      );
      if (result.IsSuccess) {
        message.success('导出成功！');
        downloadFile(result.Datas);
      }
    },
    // 基础数据 - 导出
    *ExportRepeatServiceInfo({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.RepeatServices.ExportRepeatServiceInfo,
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
        });
      }
    },
  },
});
