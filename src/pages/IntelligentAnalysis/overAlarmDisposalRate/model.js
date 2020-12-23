/*
 * @Description:超标报警处置率
 * @LastEditors: hxf
 * @Date: 2020-10-16 16:57:56
 * @LastEditTime: 2020-11-10 18:24:45
 * @FilePath: /NewPollutantSource/src/pages/dataAnalyze/overAlarmDisposalRate/model.js
 */
import Model from '@/utils/model';
import * as services from './service';
import moment from 'moment';
import { message } from 'antd';
export default Model.extend({
  namespace: 'overAlarmDisposalRate',
  state: {
    checkedValues: [],
    dataType: 'HourData',
    PollutantType: '1',
    beginTime: moment()
      .subtract(1, 'days')
      .hour(0)
      .minute(0)
      .second(0),
    endTime: moment()
      .hour(23)
      .minute(59)
      .second(59),
    RegionCode: undefined,
    AttentionCode: '',
    EntCode: undefined,
    priseList: [],
    column: [],
    attentionList: [],
    divisorList: [],
    alarmManagementRateExportLoading: false,
    alarmManagementRateDetailExportLoading: false,
    alarmManagementRateDataSource: [],
    alarmManagementRateDetailSource: [],
    alarmManagementRateDetailcolumn: [],
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
    *getEntByRegion({ payload }, { call, put, update, select }) {
      // 获取所有企业列表
      const response = yield call(services.GetEntByRegion, { ...payload });
      if (response.IsSuccess) {
        yield update({
          priseList: response.Datas,
        });
      }
    },
    // 超标报警处置率-师一级
    *getAlarmManagementRate({ payload }, { call, put, update, select }) {
      const { RegionCode } = yield select(state => state.overAlarmDisposalRate);
      const result = yield call(services.getAlarmManagementRate, { ...payload });
      if (payload.RegionCode != '' && result.Datas.data.length > 0) {
        result.Datas.data[result.Datas.data.length - 1]['regionCode'] = payload.RegionCode;
      }
      if (result.IsSuccess) {
        yield update({
          alarmManagementRateDataSource: result.Datas.data,
          column: result.Datas.column,
        });
      } else {
        message.error(result.Message);
      }
    },
    // 超标报警处置率-二级
    *getAlarmManagementRateDetail({ payload }, { call, put, update, select }) {
      const result = yield call(services.getAlarmManagementRateDetail, { ...payload });
      if (result.IsSuccess) {
        yield update({
          alarmManagementRateDetailSource: result.Datas.data,
          alarmManagementRateDetailcolumn: result.Datas.column,
        });
      } else {
        message.error(result.Message);
      }
    },
    // 超标报警处置率导出-师一级
    *exportAlarmManagementRate({ callback, payload }, { call, put, update, select }) {
      yield update({ alarmManagementRateExportLoading: true });
      const result = yield call(services.exportAlarmManagementRate, { ...payload });
      if (result.IsSuccess) {
        message.success('下载成功');
        callback(result.Datas);
        yield update({ alarmManagementRateExportLoading: false });
      } else {
        message.error(result.Message);
        yield update({ alarmManagementRateExportLoading: false });
      }
    },
    // 超标报警处置率导出-师二级
    *exportAlarmManagementRateDetail({ callback, payload }, { call, put, update, select }) {
      yield update({ alarmManagementRateDetailExportLoading: true });
      const result = yield call(services.exportAlarmManagementRateDetail, { ...payload });
      if (result.IsSuccess) {
        message.success('下载成功');
        callback(result.Datas);
        yield update({ alarmManagementRateDetailExportLoading: false });
      } else {
        message.error(result.Message);
        yield update({ alarmManagementRateDetailExportLoading: false });
      }
    },
  },
});
