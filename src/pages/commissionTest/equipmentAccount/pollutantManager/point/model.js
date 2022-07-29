import Model from '@/utils/model';
import * as services from './service';
import moment from 'moment';
import { message } from 'antd';
export default Model.extend({
  namespace: 'commissionTestPoint',
  state: {
    pointDataWhere: null,
    commissionTestPointTime: [moment().subtract(1, "days").startOf("day"), moment().endOf("day")],
    systemModelList: [],
    systemModelListTotal: null,
    equipmentInfoList: [],
    equipmentInfoListTotal:null,
    paramInfoList:[],
    paramInfoListTotal: null,
  },
  effects: {
    // cems 系统信息 - CEMS生产厂家(弹框) 
    *testGetSystemModelList({ payload }, { call, put, update, select }) {
      const result = yield call(services.TestGetSystemModelList, { ...payload });
      if (result.IsSuccess) {
        yield update({
          systemModelList: result.Datas ? result.Datas.rtnlist : [],
          systemModelListTotal: result.Total,
        });
      } else {
        message.error(result.Message)
      }
    },
    //cems 监测设备 - 生产厂家(弹框) 
    *getTestEquipmentInfoList({ payload }, { call, put, update, select }) {
      const result = yield call(services.GetTestEquipmentInfoList, { ...payload });
      if (result.IsSuccess) {
        yield update({
          equipmentInfoList: result.Datas ? result.Datas.mlist : [],
          equipmentInfoListTotal:result.Total,
        });
      } else {
        message.error(result.Message)
      }
    },
    //参比仪器 - 生产厂家(弹框) 
    *getTestParamInfoList({ payload, callback }, { call, put, update }) { 
      yield update({ tableLoading: true })
      const result = yield call(services.GetTestParamInfoList, payload);
      if (result.IsSuccess) {
        yield update({
          paramInfoListTotal: result.Total,
          paramInfoList:result.Datas? result.Datas.mlist:[],
        })
      } else {
        message.error(result.Message)
        yield update({ tableLoading: false })
      }
    },
    //获取站点CEMS参数信息
    *getCEMSSystemList({ payload,callback }, { call, put, update, select }) {
      const result = yield call(services.GetCEMSSystemList, { ...payload });
      if (result.IsSuccess) {
          callback(result.Datas)
      } else {
        message.error(result.Message)
      }
    },
    //操作站点CEMS参数信息 
    *operationCEMSSystem({ payload,callback }, { call, put, update, select }) {
      const result = yield call(services.OperationCEMSSystem, { ...payload });
      if (result.IsSuccess) {
        callback()
      } else {
        message.error(result.Message)
      }
    },
    //获取参比仪器信息
    *getParamList({ payload,callback }, { call, put, update, select }) {
      const result = yield call(services.GetParamList, { ...payload });
      if (result.IsSuccess) {
        callback(result.Datas)
      } else {
        message.error(result.Message)
      }
    },
    //操作站点参比仪器信息 
    *operationParam({ payload,callback }, { call, put, update, select }) {
      const result = yield call(services.OperationParam, { ...payload });
      if (result.IsSuccess) {
        callback()
      } else {
        message.error(result.Message)
      }
    },


  },
});
