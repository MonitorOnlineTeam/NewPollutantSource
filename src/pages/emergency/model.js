// 运维任务列表
import moment from 'moment';
import { message } from 'antd';
import * as services from './services';
import Model from '@/utils/model';

export default Model.extend({
  namespace: 'emergency',
  state: {
    dutyPersonInfo: {},
    dutyTableList: [],
    dictionaryList: {
      InfoSource: [],  //信息来源
      InfoType: [], //事件类型
      ReportMethod: [], // 举报方式
      MonitorType: [], // 监测类型
      ExpertType: [], // 专家类型
      MaterialType: [], // 物资类型
      EquipmentType: [], // 装备类型
      VehicleType: [], // 车辆类型
    },
    dutyOneData: {},
    saveEntList: [],
    saveMinganList: [],
    stepBarData: [],
  },
  effects: {
    // 获取值班人员和值班领导信息
    *getDutyPerson({ payload }, { call, update, put, take, select }) {
      const result = yield call(services.getDutyPerson, payload);
      if (result.IsSuccess) {
        yield update({
          dutyPersonInfo: result.Datas
        })
      } else {
        message.error(result.Message)
      }
    },
    *getDutyTableList({ payload, callback }, { call, update, put, take, select }) {
      const result = yield call(services.getDutyTableList, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas)
        yield update({
          dutyTableList: result.Datas
        })
      } else {
        message.error(result.Message)
      }
    },
    *setCurrent({ payload }, { call, update, put, take, select }) {
      const result = yield call(services.setCurrent, payload);
      if (result.IsSuccess) {
        message.success("操作成功")
      } else {
        message.error(result.Message)
      }
    },
    // 获取甄别数据
    *getDutyOne({ payload, callback }, { call, update, put, take, select }) {
      const result = yield call(services.getDutyOne, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas)
        yield update({
          dutyOneData: result.Datas
        })
      } else {
        message.error(result.Message)
      }
    },
    // 获取下拉数据 - 获取码表
    *getDictionaryList({ payload }, { call, update, put, take, select }) {
      const result = yield call(services.getDictionaryList, payload);
      if (result.IsSuccess) {
        yield update({
          dictionaryList: result.Datas
        })
      } else {
        message.error(result.Message)
      }
    },
    // 保存甄别数据
    *saveIdentifyInfo({ payload }, { call, update, put, take, select }) {
      const result = yield call(services.saveIdentifyInfo, payload);
      if (result.IsSuccess) {
        message.success('操作成功')
      } else {
        message.error(result.Message)
      }
    },
    // 获取涉事企业
    *getNarrationEntList({ payload, callback }, { call, update, put, take, select }) {
      const result = yield call(services.getNarrationEntList, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas)
      } else {
        message.error(result.Message)
      }
    },
    // 获取敏感目标
    *getSensitiveList({ payload, callback }, { call, update, put, take, select }) {
      const result = yield call(services.getSensitiveList, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas)
      } else {
        message.error(result.Message)
      }
    },
    // 保存涉事企业和敏感点
    *saveEntAndMingan({ payload, callback }, { call, update, put, take, select }) {
      const result = yield call(services.saveEntAndMingan, payload);
      if (result.IsSuccess) {
        message.success('操作成功');
        callback && callback(result.Datas)
        yield put({
          type: "getSaveEntAndMingan",
          payload: {
            AlarmInfoCode: payload.AlarmInfoCode,
            Type: payload.Type,
          }
        })
      } else {
        message.error(result.Message)
      }
    },
    // 获取保存的涉事企业及敏感
    *getSaveEntAndMingan({ payload, callback }, { call, update, put, take, select }) {
      const result = yield call(services.getSaveEntAndMingan, payload);
      if (result.IsSuccess) {
        if (payload.Type === 1) {
          // 敏感点
          yield update({
            saveMinganList: result.Datas
          })
        } else {
          yield update({
            saveEntList: result.Datas
          })
        }
        callback && callback(result.Datas)
      } else {
        message.error(result.Message)
      }
    },
    // 删除涉事企业及敏感点
    *delSensitiveOrEnt({ payload, callback }, { call, update, put, take, select }) {
      const result = yield call(services.delSensitiveOrEnt, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas)
        message.success("删除成功！");
        yield put({
          type: "getSaveEntAndMingan",
          payload: {
            AlarmInfoCode: payload.AlarmInfoCode,
            Type: payload.Type,
          }
        })
      } else {
        message.error(result.Message)
      }
    },
    // 获取步骤条
    *getStepBar({ payload }, { call, update, put, take, select }) {
      const result = yield call(services.getStepBar, payload);
      if (result.IsSuccess) {
        yield update({
          stepBarData: result.Datas
        })
      } else {
        message.error(result.Message)
      }
    },
    // 获取数据
    *getListTable({ payload, callback }, { call, update, put, take, select }) {
      const result = yield call(services.getListTable, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas)
      } else {
        message.error(result.Message)
      }
    },
    // 获取保存后的数据
    *getRelationTable({ payload, callback }, { call, update, put, take, select }) {
      const result = yield call(services.getRelationTable, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas)
      } else {
        message.error(result.Message)
      }
    },
    // 获取保存后的数据
    *saveDispatch({ payload, callback }, { call, update, put, take, select }) {
      const result = yield call(services.saveDispatch, payload);
      if (result.IsSuccess) {
        // yield put({
        //   type: 'getRelationTable',
        //   payload: payload
        // })
        message.success("操作成功")
        callback && callback(result.Datas)
      } else {
        message.error(result.Message)
      }
    },
    // 获取保存后的数据
    *deleteDispatch({ payload, callback }, { call, update, put, take, select }) {
      const result = yield call(services.deleteDispatch, payload);
      if (result.IsSuccess) {
        message.success("删除成功")
        callback && callback(result.Datas)
      } else {
        message.error(result.Message)
      }
    },
    // 启动预案
    *startPlan({ payload, callback }, { call, update, put, take, select }) {
      const result = yield call(services.startPlan, payload);
      if (result.IsSuccess) {
        message.success("预案启动成功！")
      } else {
        message.error(result.Message)
      }
    },
    // 采样保存
    *saveSamplingData({ payload, callback }, { call, update, put, take, select }) {
      const result = yield call(services.saveSamplingData, payload);
      if (result.IsSuccess) {
        message.success("保存成功！")
      } else {
        message.error(result.Message)
      }
    },
    // 获取保存后的table数据
    *getTableList({ payload, callback }, { call, update, put, take, select }) {
      const result = yield call(services.getRelationTable, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        message.error(result.Message)
      }
    },
    // 删除table行
    *delRecord({ payload, callback }, { call, update, put, take, select }) {
      const result = yield call(services.delRecord, payload);
      if (result.IsSuccess) {
        message.success('删除成功');
      } else {
        message.error(result.Message)
      }
    },
    // 结束
    *endRecord({ payload }, { call, update, put, take, select }) {
      const result = yield call(services.endRecord, payload);
      if (result.IsSuccess) {
        message.success('操作成功');
      } else {
        message.error(result.Message)
      }
    },

  }
});
