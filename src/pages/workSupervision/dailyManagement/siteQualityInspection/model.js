import moment from 'moment';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config';
import { downloadFile, requestPost } from '@/utils/utils';
import { API } from '@config/API';

export default Model.extend({
  namespace: 'siteQualityInspection',
  state: {},
  effects: {
    // 现场质量检查 - 省区
    *GetOnsiteInspectionRecordForRegion({ payload, callback }, { call, put }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.SiteQualityInspection.GetOnsiteInspectionRecordForRegion,
        payload,
      );
      result.IsSuccess && callback(result);
    },
    // 现场质量检查 - 导出
    *ExportOnsiteInspectionRecordForRegion({ payload }, { call, update, select, put }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.SiteQualityInspection.ExportOnsiteInspectionRecordForRegion,
        payload,
      );
      if (result.IsSuccess) {
        message.success('导出成功');
        downloadFile(result.Datas);
      }
    },
    // 现场质量检查 - 省区详情
    *GetOnsiteInspectionRecordForRegionInfo({ payload, callback }, { call, put }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.SiteQualityInspection.GetOnsiteInspectionRecordForRegionInfo,
        payload,
      );
      result.IsSuccess && callback(result);
    },
    // 现场质量检查 - 省区详情 - 导出
    *ExportOnsiteInspectionRecordForRegionInfo({ payload }, { call, update, select, put }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.SiteQualityInspection.ExportOnsiteInspectionRecordForRegionInfo,
        payload,
      );
      if (result.IsSuccess) {
        message.success('导出成功');
        downloadFile(result.Datas);
      }
    },

  },
});
