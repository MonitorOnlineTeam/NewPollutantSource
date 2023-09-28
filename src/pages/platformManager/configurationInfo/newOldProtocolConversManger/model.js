import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'newOldProtocolConvers',
  state: {
    tableDatas: [],
    tableTotal: 0,
    queryPar: {},
  },
  effects: {
    *getAgreementTransferList({ payload, callback }, { call, put, update }) { //列表
      const result = yield call(services.getAgreementTransferList, payload);
      if (result.IsSuccess) {
        yield update({
          tableDatas:result.Datas?result.Datas : [],
        })
        callback && callback(result)
      } else {
        callback && callback(result)
        message.error(result.Message)
      }
    },
    *addAgreementTransfer({ payload, callback }, { call, put, update }) { //添加
      const result = yield call(services.addAgreementTransfer, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      } else {
        message.error(result.Message)
      }
    },
    *deleteAgreementTransfer({ callback, payload }, { call, put, update, select }) { //删除
      const result = yield call(services.deleteAgreementTransfer, { ...payload });
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      } else {
        message.error(result.Message)
      }
    },
  },
})