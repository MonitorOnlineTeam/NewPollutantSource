import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'handoverReport',
  state: {
    tableDatas: [],
    tableTotal: 0,
    queryPar: {},
  },
  effects: {
    *getProjectReportList({ payload, callback }, { call, put, update }) { //列表
      const result = yield call(services.getProjectReportList, payload);
      if (result.IsSuccess) {
        yield update({
          tableDatas:result.Datas?result.Datas : [],
          tableTotal:result.Total,
          queryPar:payload,
        })
        callback && callback(result)
      } else {
        callback && callback(result)
        message.error(result.Message)
      }
    },
    *addOrUpdProjectReportInfo({ payload, callback }, { call, put, update }) { //编辑
      const result = yield call(services.addOrUpdProjectReportInfo, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      } else {
        message.error(result.Message)
      }
    },
    *exportProjectReportList({ payload, callback }, { call, put, update }) { // 导出
      const result = yield call(services.exportProjectReportList, payload);
      if (result.IsSuccess) {
        message.success('下载成功');
        downloadFile(`${result.Datas}`);
      } else {
        message.error(result.Message)
      }
    },
  },
})