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
      const response = yield call(services.GetTestEquipmentInfoList, { ...payload });
      if (response.IsSuccess) {
        yield update({
          equipmentInfoList: result.Datas ? result.Datas.mlist : [],
          equipmentInfoListTotal:result.Total,
        });
      } else {
        message.error(response.Message)
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
