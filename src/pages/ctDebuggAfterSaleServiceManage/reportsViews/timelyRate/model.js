import Model from '@/utils/model';
import { message } from 'antd';
import { downloadFile, requestPost } from '@/utils/utils';
import { API } from '@config/API';
export default Model.extend({
  namespace: 'timelyRate',
  state: {
    timelyRateList: {
      columnList: [],
      tableList: [],
      largeRegionAnalysis: [],
    },
  },
  effects: {
    // 服务响应及时率 - 按大区统计
    *GetTimelyRateList({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.CtAPI_WJQ.TimelyRate.GetTimelyRateList, payload);
      if (result.IsSuccess) {
        yield update({
          timelyRateList: result.Datas,
        });
        callback && callback(result);
      }
    },

    // 服务响应及时率 - 按人员统计
    *GetTimelyRateByUserList({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.TimelyRate.GetTimelyRateByUserList,
        payload,
      );
      if (result.IsSuccess) {
        callback && callback(result);
      }
    },

    // 导出 - 按大区统计
    *ExportTimelyRateList({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.TimelyRate.ExportTimelyRateList,
        payload,
      );
      if (result.IsSuccess) {
        message.success('导出成功！');
        downloadFile(result.Datas);
      }
    },
    // 导出 - 按人员统计
    *ExportTimelyRateByUserList({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.TimelyRate.ExportTimelyRateByUserList,
        payload,
      );
      if (result.IsSuccess) {
        message.success('导出成功！');
        downloadFile(result.Datas);
      }
    },

    // 获取基础数据
    *GetTimelyRateInfoList({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.TimelyRate.GetTimelyRateInfoList,
        payload,
      );
      if (result.IsSuccess) {
        callback && callback(result);
      }
    },
    // 基础数据 - 导出
    *ExportTimelyRateInfoList({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.TimelyRate.ExportTimelyRateInfoList,
        payload,
      );
      if (result.IsSuccess) {
        message.success('导出成功！');
        downloadFile(result.Datas);
      }
    },
  },
});
