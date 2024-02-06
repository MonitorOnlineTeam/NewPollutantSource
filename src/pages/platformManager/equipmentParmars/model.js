import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'

export default Model.extend({
  namespace: 'equipmentParmars',
  state: {
    tableDatas:[],
    parametersList:[],
  },
  effects: {
    *getEquipmentParametersInfo({ payload,callback }, { call, put, update }) { //参数列表
      const result = yield call(services.GetEquipmentParametersInfo, payload);
      if (result.IsSuccess) {
        yield update({
          tableDatas:result.Datas
        })
        console.log(result.Datas,11111)
        callback(result.Datas)
      }

    },
    *getParametersInfo({ payload,callback }, { call, put, update }) { //下拉列表的 测量参数
      const result = yield call(services.GetParametersInfo, payload);
      if (result.IsSuccess) {
        yield update({
          parametersList:result.Datas
        })
      }

    },
    *addOrUpdateEquipmentParametersInfo({ payload,callback}, { call, put, update }) { //添加 or 修改
      const result = yield call(services.AddOrUpdateEquipmentParametersInfo, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      }

    },
    *deleteEquipmentParametersInfo({ payload,callback}, { call, put, update }) { //删除
      const result = yield call(services.DeleteEquipmentParametersInfo, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      }

    },
    *addOrUpdateEquipmentParameters({ payload,callback}, { call, put, update }) { //添加 or 修改
      const result = yield call(services.AddOrUpdateEquipmentParameters, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
      }

    },
    *getEquipmentParameters({ payload,callback }, { call, put, update }) { //设定 参数列表
      const result = yield call(services.GetEquipmentParameters, payload);
      if (result.IsSuccess) {
        callback(result.Datas[0])
      }

    },
  },
})