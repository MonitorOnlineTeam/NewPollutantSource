import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config';
import { downloadFile, requestPost } from '@/utils/utils';
import { API } from '@config/API';
export default Model.extend({
  namespace: 'oneResolutRate',
  state: {
    disposableRateList: {},
    disposableDate: [],
  },
  effects: {
    // 获取一次解决率
    *GetDisposableRateList({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.ReportsViewsApi.GetDisposableRateList,
        payload,
      );

      if (result.IsSuccess) {
        yield update({
          disposableRateList: result.Datas,
          disposableDate: payload.analysisDate
        });
        callback && callback(result);
      }
    },
    // 导出
    *ExportDisposableRateList({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.ReportsViewsApi.ExportDisposableRateList,
        payload,
      );
      if (result.IsSuccess) {
        message.success('导出成功！');
        downloadFile(result.Datas);
      }
    },
    // 获取一次解决率基础数据
    *GetDisposableServiceInfo({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.ReportsViewsApi.GetDisposableServiceInfo,
        payload,
      );
      if (result.IsSuccess) {
        callback && callback(result);
      }
    },
    // 基础数据 - 导出
    *ExportDisposableServiceInfo({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.ReportsViewsApi.ExportDisposableServiceInfo,
        payload,
      );
      if (result.IsSuccess) {
        message.success('导出成功！');
        downloadFile(result.Datas);
      }
    },
  },
});
