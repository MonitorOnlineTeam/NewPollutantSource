import Model from '@/utils/model';
import * as services from './service';
import moment from 'moment';
import { message } from 'antd';
export default Model.extend({
  namespace: 'commissionTestPoint',
  state: {
    pointDataWhere:null,
    commissionTestPointTime: [moment().subtract(1, "days").startOf("day"), moment().endOf("day")],
    systemModelList:[],
    systemModelListTotal:null,
    equipmentInfoList:[],
  },
  effects: {
    // 获取站点CEMS参数信息 
    *GetCEMSSystemList({ payload }, { call, put, update, select }) {
      const response = yield call(services.GetCEMSSystemList, { ...payload });
      if (response.IsSuccess) {
        yield update({
          systemModelList: response.Datas,
          systemModelListTotal:result.Total,
        });
      } else {
        message.error(response.Message)
      }
    },
    //操作站点CEMS参数信息 
    *operationCEMSSystem ({ payload }, { call, put, update, select }) {
      const response = yield call(services.OperationCEMSSystem, { ...payload });
      if (response.IsSuccess) {
        // yield update({
        //   testGetSystemModelList: response.Datas,
        // });
      } else {
        message.error(response.Message)
      }
    },
    //获取系统信息列表  cems生产厂家
    *testGetSystemModelList({ payload }, { call, put, update, select }) {
      const response = yield call(services.TestGetSystemModelList, { ...payload });
      if (response.IsSuccess) {
        // yield update({
        //   cemsManufacturerList: response.Datas,
        // });
      } else {
        message.error(response.Message)
      }
    },
    //获取设备信息列表 监测设备生产厂家
    *getTestEquipmentInfoList({ payload }, { call, put, update, select }) {
      const response = yield call(services.GetTestEquipmentInfoList, { ...payload });
      if (response.IsSuccess) {
        yield update({
          equipmentInfoList: response.Datas,
        });
      } else {
        message.error(response.Message)
      }
    },

  },
});
