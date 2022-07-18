import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'cemsEquipmentList',
  state: {
    tableDatas: [],
    parametersList: [],
    tableLoading: false,
    tableTotal: 0,
    monitoringTypeList: [],
    manufacturerList: [],
    pollutantTypeList: [],
    addEditPollutantTypeList: [],
    maxNum:null,
    equipmentNameList:[],
    addEditEquipmentNameList:[],
  },
  effects: {
    *getEquipmentInfoList({ payload, callback }, { call, put, update }) { //列表
      yield update({ tableLoading: true })
      const result = yield call(services.GetEquipmentInfoList, payload);
      if (result.IsSuccess) {
        yield update({
          tableTotal: result.Total,
          tableDatas:result.Datas? result.Datas.mlist:[],
          maxNum:result.Datas?result.Datas.MaxNum:null,
          tableLoading: false
        })
      } else {
        message.error(result.Message)
        yield update({ tableLoading: false })
      }
    },
    *addEquipmentInfo({ payload, callback }, { call, put, update }) { //添加
      const result = yield call(services.AddEquipmentInfo, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      } else {
        message.error(result.Message)
      }
    },
    *editEquipmentInfo({ payload, callback }, { call, put, update }) { //修改
      const result = yield call(services.EditEquipmentInfo, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      } else {
        message.error(result.Message)
      }
    },
    *delEquipmentInfo({ payload, callback }, { call, put, update }) { //删除
      const result = yield call(services.DelEquipmentInfo, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      } else {
        message.error(result.Message)
      }
    },
    *getMonitoringTypeList({ payload, callback }, { call, put, update }) { //获取监测类别
      const result = yield call(services.GetMonitoringTypeList, payload);
      if (result.IsSuccess) {
        yield update({ monitoringTypeList: result.Datas? result.Datas.mlist : []})
      } else {
        message.error(result.Message)
      }
    },
    *getPollutantById({ payload, callback }, { call, put, update }) { //获取监测类型 查询时

      if (payload.id) {
        const result = yield call(services.GetPollutantById, payload);
        if (result.IsSuccess) {
          yield update({ pollutantTypeList: result.Datas? result.Datas.plist : []})
        } else {
          message.error(result.Message)
        }
      } else {
        yield update({ pollutantTypeList: [] })
      }
      
    },

    *addEditPollutantById({ payload, callback }, { call, put, update }) { //获取监测类型 添加编辑时
      if (payload.id) {
       const result = yield call(services.GetPollutantById, payload);
        if (result.IsSuccess) {
          yield update({ addEditPollutantTypeList: result.Datas? result.Datas.plist : []})
        } else {
          message.error(result.Message)
        }
      } else {
        yield update({ addEditPollutantTypeList: [] })
      }
    },
    // *getEquipmentName({ payload, callback }, { call, put, update }) { //获取设备名称 查询时

    //   if (payload.id) {
    //     const result = yield call(services.GetEquipmentName, payload);
    //     if (result.IsSuccess) {
    //       yield update({ equipmentNameList: result.Datas? result.Datas.plist : []})
    //     } else {
    //       message.error(result.Message)
    //     }
    //   } else {
    //     yield update({ pollutantTypeList: [] })
    //   }
    // },
    *addEditGetEquipmentName({ payload, callback }, { call, put, update }) { //获取设备名称 添加编辑
      if (payload.id) {
       const result = yield call(services.GetEquipmentName, payload);
        if (result.IsSuccess) {
          yield update({ addEditEquipmentNameList: result.Datas? result.Datas.plist : []})
        } else {
          message.error(result.Message)
        }
      } else {
        yield update({ addEditPollutantTypeList: [] })
      }
    },
    *getManufacturerList({ payload, callback }, { call, put, update }) { //获取厂商列表
      const result = yield call(services.GetManufacturerList, payload);
      if (result.IsSuccess) {
        yield update({ manufacturerList: result.Datas? result.Datas.mlist:[] })
        callback(result.Datas? result.Datas.mlist:[])
      } else {
        message.error(result.Message)
      }
    },

  },
})