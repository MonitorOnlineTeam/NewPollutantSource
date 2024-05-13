import Model from '@/utils/model';
import { message } from 'antd';
import { downloadFile, requestPost } from '@/utils/utils';
import { API } from '@config/API';
export default Model.extend({
  namespace: 'timelinessQualityReport',
  state: {
    timelyRateList: {
      columnList: [],
      tableList: [],
      largeRegionAnalysis: [],
    },
  },
  effects: {
    // 及时合格率 - 按大区统计
    *GetTimelyPassRateListByArea({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.CtAPI_WJQ.TimelinessQualityReport.GetTimelyPassRateListByArea, payload);
      callback && callback(result);
    },
    // 服务响应及时率 - 按人员统计
    *GetTimelyPassRateListByUser({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.TimelinessQualityReport.GetTimelyPassRateListByUser,
        payload,
      );
      if (result.IsSuccess) {
        callback && callback(result);
      }
    },
    // 导出 - 按大区统计
    *ExportTimelyPassRateListByArea({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.TimelinessQualityReport.ExportTimelyPassRateListByArea,
        payload,
      );
      if (result.IsSuccess) {
        message.success('导出成功！');
        downloadFile(result.Datas);
      }
    },
    // 导出 - 按人员统计
    *ExportTimelyPassRateListByUser({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.TimelinessQualityReport.ExportTimelyPassRateListByUser,
        payload,
      );
      if (result.IsSuccess) {
        message.success('导出成功！');
        downloadFile(result.Datas);
      }
    },
  },
});
