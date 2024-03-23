import Model from '@/utils/model';
import * as services from './service';
import moment from 'moment';
import { message } from 'antd';
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'ctAfterSalesServiceManagement',
  state: {
  },
  effects: {
    // 节点服务
    *GetCompleteNodeServerAnalysis({ payload,callback }, { call, put, update, select }) {
      const result = yield call(services.GetCompleteNodeServerAnalysis, { ...payload });
      if (result.IsSuccess) {
        callback && callback(result.Datas)
      } else {
        message.error(result.Message)
      }
    },
    //节点服务 导出
    *ExportCompleteNodeServerAnalysis({ payload, callback }, { call, put, update, select }) {
      const result = yield call(services.ExportCompleteNodeServerAnalysis, { ...payload });
      if (result.IsSuccess) {
        message.success('下载成功');
        downloadFile(`${result.Datas}`);
      } else {
        message.error(result.Message)
      }
    },
  },
});
