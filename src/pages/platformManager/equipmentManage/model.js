import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'

export default Model.extend({
  namespace: 'equipment',
  state: {
    // 设备型号
    EquipmentModel: [],
    // 设备类别
    EquipmentType: [],
    // 设备厂商
    Manufacturer: [],
    // 测量参数
    Measurement: [],
    // 修改数据
    equipmentData: {},
    //设备类型
    equipmentCategoryType:[]
  },
  effects: {
    *getEquipmentCategoryPage({ payload }, { call, put, update }) {
      const result = yield call(services.getEquipmentCategoryPage, payload);
      debugger;
      if (result.IsSuccess) {
        yield update({
          equipmentCategoryType:result.Datas
        })
      }

    },
    // 获取级联数据
    *getEquipmentWhere({ payload }, { call, put, update }) {
      const result = yield call(services.getEquipmentWhere, payload);
      if (result.IsSuccess) {
        yield update({
          EquipmentModel: result.Datas.EquipmentModel ? result.Datas.EquipmentModel : [],
          EquipmentType: result.Datas.EquipmentType ? result.Datas.EquipmentType : [],
          Manufacturer: result.Datas.Manufacturer ? result.Datas.Manufacturer : [],
          Measurement: result.Datas.Measurement ? result.Datas.Measurement[0] : null,
        })
      }
    },
    // 获取级联数据
    *getEquipmentByID({ payload }, { call, put, update }) {
      const result = yield call(services.getEquipmentByID, payload);
      if (result.IsSuccess) {
        yield put({
          type: "getEquipmentWhere",
          payload: {
            EquipmentType: result.Datas.EquipmentType,
            EquipmentModel: result.Datas.EquipmentModel,
            Manufacturer: result.Datas.Manufacturer
          }
        })
        yield update({
          equipmentData: result.Datas
        })
      }
    }
  },
})