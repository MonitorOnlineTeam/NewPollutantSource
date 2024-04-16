import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config';
import { downloadFile, requestPost } from '@/utils/utils';
import { API } from '@config/API';
export default Model.extend({
  namespace: 'instStdAndCompReso',
  state: {
    installPageData: {
      ColumnList: [],
      TableList: [],
      LargeRegionAnalysis: [],
      CategoryAnalysis: [],
    },
    compPageData: {
      ColumnList: [],
      TableList: [],
      LargeRegionAnalysis: [],
    },
  },
  effects: {
    // 获取安装调试达标率及投诉解决率
    *GetInstallationDebugRate({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.InstStdAndCompReso.GetInstallationDebugRate,
        payload,
      );
      if (result.IsSuccess) {
        yield update({
          installPageData: result.Datas,
        });
        callback && callback(result);
      }
    },
    // 导出
    *ExportInstallationDebugRate({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.InstStdAndCompReso.ExportInstallationDebugRate,
        payload,
      );
      if (result.IsSuccess) {
        message.success('导出成功！');
        downloadFile(result.Datas);
      }
    },

    // 获取投诉解决率
    *GetComplaintResolutionRate({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.InstStdAndCompReso.GetComplaintResolutionRate,
        payload,
      );
      if (result.IsSuccess) {
        yield update({
          compPageData: {
            ...result.Datas,
            ColumnList: result.Datas.columnList,
          },
        });
        callback && callback(result);
      }
    },
    // 投诉解决率 - 导出
    *ExportComplaintResolutionRate({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.InstStdAndCompReso.ExportComplaintResolutionRate,
        payload,
      );
      if (result.IsSuccess) {
        message.success('导出成功！');
        downloadFile(result.Datas);
      }
    },
  },
});
