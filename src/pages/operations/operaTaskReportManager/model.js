import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'operaTaskReportManager',
  state: {
    tableDatas: [],
    tableTotal: 0,
    queryPar: {},
  },
  effects: {
    //运维任务报告 列表
    *getOperationReportList({ payload, }, { call, update, select, put }) {
      const result = yield call(services.GetOperationReportList, { ...payload });
      if (result.IsSuccess) {
        yield update({
          tableDatas: result.Datas,
          tableTotal: result.Total,
          queryPar: payload,
        });
      } else {
        message.error(result.Message)
      }
    },
    // 生成报告
    *exportOperationReport({ payload }, { call, put, update, select }) {
      const result = yield call(services.ExportOperationReport, { ...payload });
      if (result.IsSuccess) {
        message.success('下载成功');
        downloadFile(`${result.Datas}`);
      } else {
        message.error(result.Message)
      }
    },
  }

})