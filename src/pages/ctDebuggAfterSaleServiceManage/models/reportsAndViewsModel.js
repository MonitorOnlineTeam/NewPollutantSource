import Model from '@/utils/model';
import { message } from 'antd';
import { downloadFile, requestPost } from '@/utils/utils';
import { API } from '@config/API';
export default Model.extend({
  namespace: 'reportsAndViews',
  state: {
    timelyRateList: {
      columnList: [],
      tableList: [],
      largeRegionAnalysis: [],
    },
    // 质保内服务
    underWarrantyServicesData: {
      ColumnList: [],
      LargeRegionAnalysis: [],
      TableList: [],
      WarrantyAnalysis: [],
    },
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
    // 及时合格率 - 按大区统计
    *GetTimelyPassRateListByArea({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.TimelinessQualityReport.GetTimelyPassRateListByArea,
        payload,
      );
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

    // 获取质保内服务页面数据
    *GetWarrantyServiceAnalysis({ payload, callback }, { call, put, update, select }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.UnderWarrantyServices.GetWarrantyServiceAnalysis,
        payload,
      );
      if (result.IsSuccess) {
        yield update({
          underWarrantyServicesData: result.Datas,
        });
      }
    },
    // 导出 - 质保内服务页面数据
    *ExportWarrantyServiceAnalysis({ payload, callback }, { call, put, update, select }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.UnderWarrantyServices.ExportWarrantyServiceAnalysis,
        payload,
      );
      if (result.IsSuccess) {
        message.success('下载成功');
        downloadFile(`${result.Datas}`);
      }
    },
    // 获取质保内服务基础数据
    *GetWarrantyServiceInfo({ payload, callback }, { call, put, update, select }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.UnderWarrantyServices.GetWarrantyServiceInfo,
        payload,
      );
      if (result.IsSuccess) {
        callback && callback(result);
      }
    },
    // 导出 - 获取质保内服务基础数据
    *ExportWarrantyServiceInfo({ payload, callback }, { call, put, update, select }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.UnderWarrantyServices.ExportWarrantyServiceInfo,
        payload,
      );
      if (result.IsSuccess) {
        message.success('下载成功');
        downloadFile(`${result.Datas}`);
      }
    },

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
