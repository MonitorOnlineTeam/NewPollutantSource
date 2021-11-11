import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'deviceInfo',
  state: {
    tableDatas:[],
    parametersList:[],
    tableLoading:false,
    tableTotal:0,
    monitoringTypeList:[],
    manufacturerList:[],
    pollutantTypeList:[]
  },
  effects: {
    *getEquipmentInfoList({ payload,callback }, { call, put, update }) { //列表
      yield update({ tableLoading:true})
      const result = yield call(services.GetEquipmentInfoList, payload);
      if (result.IsSuccess) {
        yield update({
          tableTotal:result.Total,
          tableDatas:result.Datas,
          tableLoading:false
        })
      }else{
        message.error(result.Message)
        yield update({ tableLoading:false})
      }
    },
    *addEquipmentInfo({ payload,callback }, { call, put, update }) { //添加
      const result = yield call(services.AddEquipmentInfo, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      }else{
        message.error(result.Message)
      }
    }, 
    *editEquipmentInfo({ payload,callback }, { call, put, update }) { //修改
      const result = yield call(services.EditEquipmentInfo, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      }else{
        message.error(result.Message)
      }
    }, 
    *delEquipmentInfo({ payload,callback }, { call, put, update }) { //删除
      const result = yield call(services.DelEquipmentInfo, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      }else{
        message.error(result.Message)
      }
    },
    *getMonitoringTypeList({ payload,callback }, { call, put, update }) { //获取监测类别
      const result = yield call(services.GetMonitoringTypeList, payload);
      if (result.IsSuccess) {
        yield update({ monitoringTypeList:result.Datas})
      }else{
        message.error(result.Message)
      }
    },
    *getPollutantById({ payload,callback }, { call, put, update }) { //获取监测类型
      const result = yield call(services.GetPollutantById, payload);
      if (result.IsSuccess) {
        yield update({ pollutantTypeList:result.Datas})
      }else{
        message.error(result.Message)
      }
    },
    *getManufacturerList({ payload,callback }, { call, put, update }) { //获取厂商列表
      const result = yield call(services.GetManufacturerList, payload);
      if (result.IsSuccess) {
        yield update({ manufacturerList:result.Datas})
      }else{
        message.error(result.Message)
      }
    },

  },
})