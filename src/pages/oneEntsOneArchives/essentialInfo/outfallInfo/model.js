//运维任务列表
import * as services from './service';
import Model from '@/utils/model';
import { message } from 'antd';

export default Model.extend({
  namespace: 'entManages',
  state: {
    pointInstrumentList: [],
    instrumentSelectList: [],
    factorySelectList: [],
    methodSelectList: [],
    monitorItem: "",
  },

  effects: {
    // 添加排口
    *addPoint({ payload, callback }, { call, put, update, select }) {
      const result = yield call(services.addPoint, payload.FormData);
      if (result.IsSuccess) {
        message.success("添加成功");
        callback && callback(result);
      } else {
        message.error(result.Message);
      }
    },
    // 更新排口
    *updatePoint({ payload, callback }, { call, put, update, select }) {
      const result = yield call(services.updatePoint, payload.FormData);
      if (result.IsSuccess) {
        message.success("修改成功");
        callback && callback(result);
      } else {
        message.error(result.Message);
      }
    },
    // 获取仪器信息table数据
    *getPointInstrument({ payload }, { call, put, update, select }) {
      const result = yield call(services.getPointInstrument, payload);
      if (result.IsSuccess) {
        yield update({ pointInstrumentList: result.Datas })
      } else {
        message.error(result.Message);
      }
    },
    // 获取仪器下拉列表
    *getInstrumentSelectList({ payload }, { call, put, update, select }) {
      const result = yield call(services.getInstrumentSelectList, payload);
      if (result.IsSuccess) {
        yield update({ instrumentSelectList: result.Datas })
      } else {
        message.error(result.Message);
      }
    },
    // 获取仪器厂商列表
    *getFactorySelectList({ payload }, { call, put, update, select }) {
      const result = yield call(services.getFactorySelectList, payload);
      if (result.IsSuccess) {
        yield update({ factorySelectList: result.Datas })
      } else {
        message.error(result.Message);
      }
    },
    // 获取仪器分析方法
    *getMethodSelectList({ payload }, { call, put, update, select }) {
      const result = yield call(services.getMethodSelectList, payload);
      if (result.IsSuccess) {
        yield update({ methodSelectList: result.Datas })
      } else {
        message.error(result.Message);
      }
    },
    // 获取监测项目
    *getMonitorItem({ payload }, { call, put, update, select }) {
      const result = yield call(services.getMonitorItem, payload);
      if (result.IsSuccess) {
        yield update({ monitorItem: result.Datas })
      } else {
        message.error(result.Message);
      }
    },
    // 保存监测项目
    *saveInstrument({ payload, callback }, { call, put, update, select }) {
      const result = yield call(services.saveInstrument, payload);
      if (result.IsSuccess) {
        message.success("添加成功")
        callback && callback();
        yield put({
          type: "getPointInstrument",
          payload: {
            DGIMN: payload.DGIMN
          }
        })
      } else {
        message.error(result.Message);
      }
    },
    // 删除监测项目
    *deleteInstrument({ payload }, { call, put, update, select }) {
      const result = yield call(services.deleteInstrument, payload);
      if (result.IsSuccess) {
        message.success("删除成功！")
        yield put({
          type: "getPointInstrument",
          payload: {
            DGIMN: payload.DGIMN
          }
        })
      } else {
        message.error(result.Message);
      }
    },
  }
});
