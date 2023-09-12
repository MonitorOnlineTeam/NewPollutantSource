import Model from '@/utils/model';
import * as services from './service';
import moment from 'moment';
import { message } from 'antd';
export default Model.extend({
  namespace: 'ctPollutantManger',
  state: {
    pointDataWhere: null,
    commissionTestPointTime: [moment().subtract(1, "days").startOf("day"), moment().endOf("day")],
    systemData:[],
    systemEditingKey:'',
    systemModelList: [],
    systemModelListTotal: null,
    systemChangeData:[],
    systemChangeEditingKey:'',
    projectModelList:[],
    deviceData:[],
    deviceEditingKey:'',
    manufacturerList:[],
    equipmentInfoList: [],
    equipmentInfoListTotal: null,
    deviceChangeData:[],
    deviceChangeEditingKey:'',
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
          equipmentInfoListTotal: result.Total,
        });
      } else {
        message.error(result.Message)
      }
    },
    //添加或修改监测点信息
    *addOrEditCommonPointList({ payload, callback }, { call, put, update, select }) {
      const result = yield call(services.addOrEditCommonPointList, { ...payload });
      if (result.IsSuccess) {
        message.success(result.Message)
        callback(result)
      } else {
        message.error(result.Message)
      }
    },
    //获取行业和监测点类型信息
    *getPointIndustryList({ payload, callback }, { call, put, update, select }) {
      const result = yield call(services.getPointIndustryList, { ...payload });
      if (result.IsSuccess) {
        callback(result.Datas)
      } else {
        message.error(result.Message)
      }
    },
    //获取监测点，系统信息，系统变更信息仪表信息，仪表变更信息
    *getCEMSSystemList({ payload, callback }, { call, put, update, select }) {
      const result = yield call(services.getCEMSSystemList, { ...payload });
      if (result.IsSuccess) {
        yield update({
          cEMSSystemList: result.Datas ? result.Datas : [],
        })
        callback(result.Datas)
      } else {
        message.error(result.Message)
      }
    },
    //添加或修改系统型信息
    *addOrEditCEMSSystem({ payload, callback }, { call, put, update, select }) {
      const result = yield call(services.addOrEditCEMSSystem, { ...payload });
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      } else {
        message.error(result.Message)
      }
    },
    //添加或修改系统更换记录
    *addOrEditCEMSSystemChange({ payload, callback }, { call, put, update, select }) {
      const result = yield call(services.addOrEditCEMSSystemChange, { ...payload });
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      } else {
        message.error(result.Message)
      }
    },
    //添加或修改仪表信息
    *addOrEditEquipment({ payload, callback }, { call, put, update, select }) {
      const result = yield call(services.addOrEditEquipment, { ...payload });
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      } else {
        message.error(result.Message)
      }
    },
     //添加或修改仪表更换记录
    *addOrEditEquipmentChange({ payload, callback }, { call, put, update, select }) {
      const result = yield call(services.addOrEditEquipmentChange, { ...payload });
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      } else {
        message.error(result.Message)
      }
    },
    //监测点排序
    *pointSort({ payload, callback }, { call, put, update, select }) {
      const result = yield call(services.pointSort, { ...payload });
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      } else {
        message.error(result.Message)
      }
    },
  },
});
