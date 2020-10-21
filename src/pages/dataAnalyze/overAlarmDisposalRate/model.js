/*
 * @Description:超标报警处置率
 * @LastEditors: hxf
 * @Date: 2020-10-16 16:57:56
 * @LastEditTime: 2020-10-21 14:21:30
 * @FilePath: /NewPollutantSource/src/pages/dataAnalyze/overAlarmDisposalRate/model.js
 */
import Model from '@/utils/model';
import * as services from './service';
import moment from 'moment';
import { message } from 'antd';
export default Model.extend({
  namespace: 'overAlarmDisposalRate',
  state: {
    column: [],
    attentionList: [],
    divisorList: [],
    exceptionDataSource: [],
    exceptionPointList: [],
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
        message.error(response.Message);
      }
    },
    // xinjiang根据企业类型查询监测因子
    *getPollutantCodeList({ payload, callback }, { call, put, update, select }) {
      const response = yield call(services.getPollutantCodeList, { ...payload });
      if (response.IsSuccess) {
        yield update({
          divisorList: response.Datas,
        });
        callback && callback(response.Datas);
      } else {
        message.error(response.Message);
      }
    },
    // 根据企业类型查询监测因子
    *getPollutantByType({ payload, callback }, { call, put, update, select }) {
      const response = yield call(services.getPollutantByType, { ...payload });
      if (response.IsSuccess) {
        yield update({
          divisorList: response.Datas,
        });
        callback && callback(response.Datas);
      } else {
        message.error(response.Message);
      }
    },
    // 超标报警处置率-师一级
    *getAlarmManagementRate({ payload }, { call, put, update, select }) {
      console.log('getAlarmManagementRate payload = ', payload);
      const result = yield call(services.getAlarmManagementRate, { ...payload });
      console.log('getExceptionList result = ', result);
      if (result.IsSuccess) {
        yield update({
          exceptionDataSource: result.Datas.data,
          column: result.Datas.column,
        });
      } else {
        message.error(result.Message);
      }
    },
    // 异常数据查询-师一级
    *getExceptionList({ payload }, { call, put, update, select }) {
      const result = yield call(services.getExceptionList, { ...payload });
      console.log('getExceptionList result = ', result);
      if (result.IsSuccess) {
        yield update({
          exceptionDataSource: result.Datas,
        });
      } else {
        message.error(result.Message);
      }
    },
    // 异常数据导出-师一级
    *exportExceptionList({ payload }, { call, put, update, select }) {
      const result = yield call(services.exportExceptionList, { ...payload });
      if (result.IsSuccess) {
        window.open(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 异常数据查询-二级页面
    *getExceptionPointList({ payload }, { call, put, update, select }) {
      const result = yield call(services.getExceptionPointList, { ...payload });
      if (result.IsSuccess) {
        yield update({
          exceptionPointList: result.Datas,
        });
      } else {
        message.error(result.Message);
      }
    },
    // 异常数据导出-师二级
    *exportExceptionPointList({ payload }, { call, put, update, select }) {
      const result = yield call(services.exportExceptionPointList, { ...payload });
      if (result.IsSuccess) {
        window.open(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
  },
});
