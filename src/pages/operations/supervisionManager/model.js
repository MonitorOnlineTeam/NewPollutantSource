import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'supervisionManager',
  state: {
    tableDatas: [],
    parametersList: [],
    tableLoading: false,
    tableTotal: 0,
    operationInfoList:[],
  },
  effects: {
    *getInspectorOperationManageList({ payload, callback }, { call, put, update }) { //列表
      yield update({ tableLoading: true })
      const result = yield call(services.GetInspectorOperationManageList, payload);
      if (result.IsSuccess) {
        yield update({
          tableTotal: result.Total,
          tableDatas: result.Datas,
          tableLoading: false
        })
      } else {
        message.error(result.Message)
        yield update({ tableLoading: false })
      }
    },
    *getInspectorOperationInfoList({ payload, callback }, { call, put, update }) { //获取单个督查表实体
      const result = yield call(services.GetInspectorOperationInfoList, payload);
      if (result.IsSuccess) {
        yield update({  operationInfoList: result.Datas, })
        callback(result.Datas)
      } else {
        message.error(result.Message)
      }
    },
    *getPointParames({ payload, callback }, { call, put, update }) { //获取单个排口默认值
      const result = yield call(services.GetPointParames, payload);
      if (result.IsSuccess) {
        callback(result.Datas)
      } else {
        message.error(result.Message)
      }
    },

  },
})