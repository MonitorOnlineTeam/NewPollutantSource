import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'faultUnitManager',
  state: {
    tableDatas:[],
    parametersList:[],
    tableLoading:false,
    tableTotal:0,
    manufacturerList:[],
    equipmentTypeList:[],
    maxNum:null,
  },
  effects: {
    *getFaultUnitList({ payload,callback }, { call, put, update }) { //列表
      yield update({ tableLoading:true})
      const result = yield call(services.GetFaultUnitList, payload);
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
    *addFaultUnit({ payload,callback }, { call, put, update }) { //添加
      const result = yield call(services.AddFaultUnit, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      }else{
        message.error(result.Message)
      }
    }, 
    *editFaultUnit({ payload,callback }, { call, put, update }) { //修改
      const result = yield call(services.EditFaultUnit, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      }else{
        message.error(result.Message)
      }
    }, 
    *delFaultUnit({ payload,callback }, { call, put, update }) { //删除
      const result = yield call(services.DelFaultUnit, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      }else{
        message.error(result.Message)
      }
    },
    *getTestingEquipmentList({ payload,callback }, { call, put, update }) { //获取监测类别
      const result = yield call(services.GetTestingEquipmentList, payload);
      if (result.IsSuccess) {
        yield update({ equipmentTypeList:result.Datas})
      }else{
        message.error(result.Message)
      }
    },
  },
})