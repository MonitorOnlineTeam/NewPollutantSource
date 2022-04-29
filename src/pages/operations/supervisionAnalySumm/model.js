import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'supervisionAnalySumm',
  state: {
    inspectorSummaryList: [],
    parametersList: [],
    tableLoading: false,
    tableTotal: 0,
    inspectorCodeList:[],
    remoteSummaryList:[],
    remoteSummaryTotal:0,
    operationManageSummaryList:[],
    operationManageSummaryTotal:0,
  },
  effects: {
    *getInspectorCodeList({ payload, callback }, { call, put, update }) { //督查类别
      const result = yield call(services.GetInspectorCodeList, payload);
      if (result.IsSuccess) {
        yield update({ inspectorCodeList: result.Datas, })
      } else {
        message.error(result.Message)
      }  
    },
    *getInspectorSummaryList({ payload, callback }, { call, put, update }) { //列表 督查总结
      const result = yield call(services.GetInspectorSummaryList, payload);
      if (result.IsSuccess) {
        yield update({ inspectorSummaryList: result.Datas, })
        callback();
      } else {
        message.error(result.Message)
      }
    },
    *exportInspectorSummaryList({ payload, callback }, { call, put, update }) { //导出 督查总结
      const result = yield call(services.ExportInspectorSummaryList , payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        downloadFile(`/upload${result.Datas}`)
      } else {
        message.error(result.Message)
      }
    },
    *getRemoteSummaryList({ payload, callback }, { call, put, update }) { //列表 关键参数
      const result = yield call(services.GetRemoteSummaryList, payload);
      if (result.IsSuccess) {
        yield update({ remoteSummaryList: result.Datas,remoteSummaryTotal:result.Total })
      } else {
        message.error(result.Message)
      }
    },
    *exportRemoteSummaryList({ payload, callback }, { call, put, update }) { //导出 关键参数
      const result = yield call(services.ExportRemoteSummaryList, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        downloadFile(`/upload${result.Datas}`)
      } else {
        message.error(result.Message)
      }
    },
    *getOperationManageSummaryList({ payload, callback }, { call, put, update }) { //列表 全系统督查汇总
      const result = yield call(services.GetOperationManageSummaryList, payload);
      if (result.IsSuccess) {
        yield update({ operationManageSummaryList: result.Datas,operationManageSummaryTotal:result.Total })
      } else {
        message.error(result.Message)
      }
    },
    *exportOperationManageSummaryList({ payload, callback }, { call, put, update }) { //导出 全系统督查汇总
      const result = yield call(services.ExportOperationManageSummaryList, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        downloadFile(`/upload${result.Datas}`)
      } else {
        message.error(result.Message)
      }
    },
  },
})