import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'custopmRenew',
  state: {
    tableDatas: [],
    tableLoading: false,
    tableTotal: 0,
    customerOrderUserList:[],
    tableDetailDatas: [],
    tableDetailTotal: 0,
    customerOrderPointEntList:[],
  },
  effects: {
    *getCustomerOrderList({ payload, callback }, { call, put, update }) { //客户订单列表
      yield update({ tableLoading: true })
      const result = yield call(services.GetCustomerOrderList, payload);
      if (result.IsSuccess) {
        yield update({
          tableTotal: result.Total,
          tableDatas:result.Datas? result.Datas.mlist:[],
          maxNum:result.Datas?result.Datas.MaxNum:null,
          tableLoading: false
        })
      } else {
        message.error(result.Message)
        yield update({ tableLoading: false })
      }
    },
    *getCustomerOrderUserList({ payload, callback }, { call, put, update }) { //客户订单用户列表
      yield update({ tableLoading: true })
      const result = yield call(services.GetCustomerOrderUserList, payload);
      if (result.IsSuccess) {
        yield update({
          customerOrderUserList:result.Datas,
        })
      } else {
        message.error(result.Message)
      }
    },
    *getCustomerOrderPointEntList({ payload, callback }, { call, put, update }) { //获取客户订单企业与排口列表
      const result = yield call(services.GetCustomerOrderPointEntList, payload);
        if (result.IsSuccess) {
          yield update({
            customerOrderPointEntList:result.Datas,
          })
        } else {
          message.error(result.Message)
        }
    
    },
    *addCustomerOrder({ payload, callback }, { call, put, update }) { //添加客户订单
      const result = yield call(services.AddCustomerOrder, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      } else {
        message.error(result.Message)
      }
    },


  },
})