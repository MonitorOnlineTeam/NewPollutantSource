import Model from '@/utils/model';
import * as services from './service';
import moment from 'moment';
import { message } from 'antd';
export default Model.extend({
  namespace: 'ctPollutantManger',
  state: {
    pointDataWhere: null,
    commissionTestPointTime: [moment().subtract(1, "days").startOf("day"), moment().endOf("day")],
    systemModelList: [],
    systemModelListTotal: null,
    systemData:[],
    systemEditingKey:'',
    equipmentInfoList: [],
    equipmentInfoListTotal: null,
    paramInfoList: [],
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
          equipmentInfoListTotal: result.Total,
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
          paramInfoList: result.Datas ? result.Datas.mlist : [],
        })
      } else {
        message.error(result.Message)
        yield update({ tableLoading: false })
      }
    },
    //操作站点CEMS参数信息 
    *operationCEMSSystem({ payload, callback }, { call, put, update, select }) {
      const result = yield call(services.OperationCEMSSystem, { ...payload });
      if (result.IsSuccess) {
        callback()
      } else {
        message.error(result.Message)
      }
    },
    //获取参比仪器信息
    *getParamList({ payload, callback }, { call, put, update, select }) {
      const result = yield call(services.GetParamList, { ...payload });
      if (result.IsSuccess) {
        callback(result.Datas)
      } else {
        message.error(result.Message)
      }
    },
    //操作站点参比仪器信息 
    *operationParam({ payload, callback }, { call, put, update, select }) {
      const result = yield call(services.OperationParam, { ...payload });
      if (result.IsSuccess) {
        callback()
      } else {
        message.error(result.Message)
      }
    },
    //添加或修改监测点信息
    *addOrEditCommonPointList({ payload, callback }, { call, put, update, select }) {
      const result = yield call(services.addOrEditCommonPointList, { ...payload });
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
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
    //添加或修改系统型号
    *addOrEditCEMSSystem({ payload, callback }, { call, put, update, select }) {
      const result = yield call(services.addOrEditCEMSSystem, { ...payload });
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      } else {
        message.error(result.Message)
      }
    },
  },
});
