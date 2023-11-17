import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'referenceInstruList',
  state: {
    tableDatas: [],
    parametersList: [],
    tableLoading: false,
    tableTotal: 0,
    monitoringTypeList: [],
    manufacturerList: [],
    pollutantTypeList: [],
    addEditPollutantTypeList: [],
    maxNum:null,
    equipmentNameList:[],
    addEditEquipmentNameList:[],
  },
  effects: {
    *getTestParamInfoList({ payload, callback }, { call, put, update }) { //列表
      yield update({ tableLoading: true })
      const result = yield call(services.GetTestParamInfoList, payload);
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
    *testAddParamInfo({ payload, callback }, { call, put, update }) { //添加
      const result = yield call(services.TestAddParamInfo, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      } else {
        message.error(result.Message)
      }
    },
    *testEditParamInfo ({ payload, callback }, { call, put, update }) { //修改
      const result = yield call(services.TestEditParamInfo , payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      } else {
        message.error(result.Message)
      }
    },
    *testDelParamInfo({ payload, callback }, { call, put, update }) { //删除
      const result = yield call(services.TestDelParamInfo, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      } else {
        message.error(result.Message)
      }
    },

  },
})