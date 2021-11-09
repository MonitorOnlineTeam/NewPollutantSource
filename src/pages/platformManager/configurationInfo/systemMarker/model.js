import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'systemMarker',
  state: {
    tableDatas:[],
    parametersList:[],
    tableLoading:false,
    tableTotal:0,
    monitoringTypeList:[],
    manufacturerList:[]
  },
  effects: {
    *getSystemModelList({ payload,callback }, { call, put, update }) { //列表
      yield update({ tableLoading:true})
      const result = yield call(services.GetSystemModelList, payload);
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
    *addSystemModel({ payload,callback }, { call, put, update }) { //添加
      const result = yield call(services.AddSystemModel, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      }else{
        message.error(result.Message)
      }
    }, 
    *editSystemModel({ payload,callback }, { call, put, update }) { //修改
      const result = yield call(services.EditSystemModel, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      }else{
        message.error(result.Message)
      }
    }, 
    *delSystemModel({ payload,callback }, { call, put, update }) { //删除
      const result = yield call(services.DelSystemModel, payload);
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