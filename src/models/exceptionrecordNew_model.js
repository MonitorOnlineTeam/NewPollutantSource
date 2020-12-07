import Model from '@/utils/model';
import * as services from '@/services/exceptionrecordNew_Api';
import moment from 'moment';
import { message } from 'antd';
export default Model.extend({
  namespace: 'exceptionrecordNew',
  state: {
    attentionList: [],
    divisorList: [],
    exceptionAlarmDataSource: [],
    exceptionPointList: [],
    exceptionAlarmListForEntDataSource: [],
    exceptionrecordForm: {
    },
    exceptionTime: [moment().subtract(1, "days").startOf("day"), moment().endOf("day")]
  },
  effects: {
    // 获取关注列表
    *getAttentionDegreeList({ payload }, { call, put, update, select }) {
      const response = yield call(services.getAttentionDegreeList, { ...payload });
      if (response.IsSuccess) {
        yield update({
          attentionList: response.Datas,
        });
      } else {
        message.error(response.Message)
      }
    },
    // 根据企业类型查询监测因子
    *getPollutantByType({ payload, callback }, { call, put, update, select }) {
      const response = yield call(services.getPollutantByType, { ...payload });
      if (response.IsSuccess) {
        yield update({
          divisorList: response.Datas,
        });
        callback && callback(response.Datas)
      } else {
        message.error(response.Message)
      }
    },
    // 异常数据查询-师一级
    *getExceptionAlarmListForRegion({ payload }, { call, put, update, select }) {
      const result = yield call(services.getExceptionAlarmListForRegion, { ...payload });
      if (result.IsSuccess) {
        yield update({
          exceptionAlarmDataSource: result.Datas
        })
      } else {
        message.error(result.Message)
      }
    },
    // 异常数据导出-师一级
    *exportExceptionAlarm({ payload }, { call, put, update, select }) {
      const result = yield call(services.exportExceptionAlarm, { ...payload });
      if (result.IsSuccess) {
        window.open(result.Datas)
      } else {
        message.error(result.Message)
      }
    },
    // 异常数据报警-二级页面
    *getExceptionAlarmListForEnt({ payload }, { call, put, update, select }) {
      const result = yield call(services.getExceptionAlarmListForEnt, { ...payload });
      if (result.IsSuccess) {
        yield update({
          exceptionAlarmListForEntDataSource: result.Datas
        })
      } else {
        message.error(result.Message)
      }
    },
    // 异常数据报警导出-师二级
    *exportExceptionAlarmListForEnt({ payload }, { call, put, update, select }) {
      const result = yield call(services.exportExceptionAlarmListForEnt, { ...payload });
      if (result.IsSuccess) {
        window.open(result.Datas)
      } else {
        message.error(result.Message)
      }
    },

  },
});
