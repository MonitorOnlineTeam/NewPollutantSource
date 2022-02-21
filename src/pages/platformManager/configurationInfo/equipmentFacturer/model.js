import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'equipmentFacturer',
  state: {
    tableDatas:[],
    parametersList:[],
    tableLoading:false,
    tableTotal:0,
    monitoringTypeList:[],
    manufacturerList:[],
    maxNum:null,
  },
  effects: {
    *getManufacturerList({ payload,callback }, { call, put, update }) { //列表
      yield update({ tableLoading:true})
      const result = yield call(services.GetManufacturerList, payload);
      if (result.IsSuccess) {
        yield update({
          tableTotal:result.Total,
          tableDatas:result.Datas?result.Datas.mlist : [],
          maxNum:result.Datas.MaxNum,
          tableLoading:false,
        })
      }else{
        message.error(result.Message)
        yield update({ tableLoading:false})
      }
    },
    *addManufacturer({ payload,callback }, { call, put, update }) { //添加
      const result = yield call(services.AddManufacturer, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      }else{
        message.error(result.Message)
      }
    }, 
    *editManufacturer({ payload,callback }, { call, put, update }) { //修改
      const result = yield call(services.EditManufacturer, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      }else{
        message.error(result.Message)
      }
    }, 
    *delManufacturer({ payload,callback }, { call, put, update }) { //删除
      const result = yield call(services.DelManufacturer, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      }else{
        message.error(result.Message)
      }
    },

  },
})