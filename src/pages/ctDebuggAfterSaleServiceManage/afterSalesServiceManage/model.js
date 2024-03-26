import Model from '@/utils/model';
import * as services from './service';
import moment from 'moment';
import { message } from 'antd';
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'ctAfterSalesServiceManagement',
  state: {
    serviceDispatchForAnalysisList: [],//服务详情
    serviceDispatchForAnalysisTotal: 0,
    serviceDispatchForAnalysisQueryPar: {},
  },
  effects: {
    // 收费服务
    *GetChargeServiceAnalysis({ payload, callback }, { call, put, update, select }) {
      const result = yield call(services.GetChargeServiceAnalysis, { ...payload });
      if (result.IsSuccess) {
        callback && callback(result.Datas)
      } else {
        message.error(result.Message)
      }
    },
    //收费服务 导出
    *ExportChargeServiceAnalysis({ payload, callback }, { call, put, update, select }) {
      const result = yield call(services.ExportChargeServiceAnalysis, { ...payload });
      if (result.IsSuccess) {
        message.success('下载成功');
        downloadFile(`${result.Datas}`);
      } else {
        message.error(result.Message)
      }
    },
    // 成套节点服务
    *GetCompleteNodeServerAnalysis({ payload, callback }, { call, put, update, select }) {
      const result = yield call(services.GetCompleteNodeServerAnalysis, { ...payload });
      if (result.IsSuccess) {
        callback && callback(result.Datas)
      } else {
        message.error(result.Message)
      }
    },
    //成套节点服务 导出
    *ExportCompleteNodeServerAnalysis({ payload, callback }, { call, put, update, select }) {
      const result = yield call(services.ExportCompleteNodeServerAnalysis, { ...payload });
      if (result.IsSuccess) {
        message.success('下载成功');
        downloadFile(`${result.Datas}`);
      } else {
        message.error(result.Message)
      }
    },
    // 赠送服务
    *GetGiveServerAnalysis({ payload, callback }, { call, put, update, select }) {
      const result = yield call(services.GetGiveServerAnalysis, { ...payload });
      if (result.IsSuccess) {
        callback && callback(result.Datas)
      } else {
        message.error(result.Message)
      }
    },
    //赠送服务 导出
    *ExportGiveServerAnalysis({ payload, callback }, { call, put, update, select }) {
      const result = yield call(services.ExportGiveServerAnalysis, { ...payload });
      if (result.IsSuccess) {
        message.success('下载成功');
        downloadFile(`${result.Datas}`);
      } else {
        message.error(result.Message)
      }
    },
    // 配合检查
    *GetCooperateInspectionAnalysis({ payload, callback }, { call, put, update, select }) {
      const result = yield call(services.GetCooperateInspectionAnalysis, { ...payload });
      if (result.IsSuccess) {
        callback && callback(result.Datas)
      } else {
        message.error(result.Message)
      }
    },
    //配合检查 导出
    *ExportCooperateInspectionAnalysis({ payload, callback }, { call, put, update, select }) {
      const result = yield call(services.ExportCooperateInspectionAnalysis, { ...payload });
      if (result.IsSuccess) {
        message.success('下载成功');
        downloadFile(`${result.Datas}`);
      } else {
        message.error(result.Message)
      }
    },
    // 配合其它工作
    *GetCooperateOtherWorkAnalysis({ payload, callback }, { call, put, update, select }) {
      const result = yield call(services.GetCooperateOtherWorkAnalysis, { ...payload });
      if (result.IsSuccess) {
        callback && callback(result.Datas)
      } else {
        message.error(result.Message)
      }
    },
    //配合其它工作 导出
    *ExportCooperateOtherWorkAnalysis({ payload, callback }, { call, put, update, select }) {
      const result = yield call(services.ExportCooperateOtherWorkAnalysis, { ...payload });
      if (result.IsSuccess) {
        message.success('下载成功');
        downloadFile(`${result.Datas}`);
      } else {
        message.error(result.Message)
      }
    },
    //服务明细
    *GetServiceDispatchForAnalysis({ payload, callback }, { call, put, update, select }) {
      const result = yield call(services.GetServiceDispatchForAnalysis, { ...payload });
      if (result.IsSuccess) {
        yield update({
          serviceDispatchForAnalysisList: result.Datas ? result.Datas : [],
          serviceDispatchForAnalysisTotal: result.Total,
          serviceDispatchForAnalysisQueryPar: payload
        });
      } else {
        message.error(result.Message)
      }
    },
    //服务明细 导出
    *ExportServiceDispatchForAnalysis({ payload, callback }, { call, put, update, select }) {
      const result = yield call(services.ExportServiceDispatchForAnalysis, { ...payload });
      if (result.IsSuccess) {
        message.success('下载成功');
        downloadFile(`${result.Datas}`);
      } else {
        message.error(result.Message)
      }
    },
    //服务大区
    *GetLargeRegionList({ payload, callback }, { call, put, update, select }) {
      const result = yield call(services.GetLargeRegionList, { ...payload });
      if (result.IsSuccess) {
        callback && callback(result.Datas)
      } else {
        message.error(result.Message)
      }
    },





  }
});
