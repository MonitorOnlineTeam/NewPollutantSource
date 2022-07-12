import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'renewalLog',
  state: {
    tableDatas: [],
    tableLoading: false,
    tableTotal: 0,
    customerOrderUserList:[],
    tableDetailDatas: [],
    tableDetailTotal: 0,
  },
  effects: {
    *getCustomerOrderLogs({ payload, callback }, { call, put, update }) { //客户订单日志  客户订单详细日志
      const result = yield call(services.GetCustomerOrderLogs, payload);
      if (result.IsSuccess) { 
        yield update({
          tableDatas:result.Datas,
          tableTotal: result.Total,
        })
      } else {
        message.error(result.Message)
      }
    },
    *getCustomerOrderLogsDetail({ payload, callback }, { call, put, update }) { //客户订单日志  客户订单详细日志  详情
      yield update({ tableLoading: true })
      const result = yield call(services.GetCustomerOrderLogsDetail, payload);
      if (result.IsSuccess) {
        yield update({
          tableDetailDatas:result.Datas,
          tableDetailTotal:result.Total,
        })
      } else {
        message.error(result.Message)
      }
    },
  
  },
})