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
      const response = yield call(services.TestGetSystemModelList, { ...payload });
      if (response.IsSuccess) {
        yield update({
          systemModelList: response.Datas ? response.Datas.rtnlist : [],
          systemModelListTotal: response.Total,
        });
      } else {
        message.error(response.Message)
      }
    },
    //cems 监测设备 - 生产厂家(弹框) 
    *getTestEquipmentInfoList({ payload }, { call, put, update, select }) {
      const response = yield call(services.GetTestEquipmentInfoList, { ...payload });
      if (response.IsSuccess) {
        yield update({
          equipmentInfoList: response.Datas ? response.Datas.mlist : [],
          equipmentInfoListTotal:response.Total,
        });
      } else {
        message.error(response.Message)
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
    //操作站点CEMS参数信息 
    *operationCEMSSystem({ payload }, { call, put, update, select }) {
      const response = yield call(services.OperationCEMSSystem, { ...payload });
      if (response.IsSuccess) {
        // yield update({
        //   testGetSystemModelList: response.Datas,
        // });
      } else {
        message.error(response.Message)
      }
    },


  },
});
