/**
 * 功  能：传输有效率
 * 创建人：吴建伟
 * 创建时间：2018.12.07
 */

import Model from '@/utils/model';
import {
  GetTransmissionEfficiencyForRegion,
  GetTransmissionEfficiencyForPoints,
  GetTransmissionEfficiencyForEnt,
  GetEntByRegion,
} from './service';
import moment from 'moment';

export default Model.extend({
  namespace: 'newtransmissionefficiency',
  state: {
    pageSize: 20,
    pageIndex: 1,
    beginTime: moment()
      .subtract(1, 'months')
      .format('YYYY-MM-DD 00:00:00'),
    endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
    transmissionEffectiveRate: 'ascend',
    entTableDatas: [],
    entCode: null,
    total: 0,
    entTotal: 0,
    RegionCode: '',
    EnterpriseName: '',
    pollutantType: '',

    qutletQueryPar: {
      beginTime: moment()
        .subtract(1, 'months')
        .format('YYYY-MM-DD 00:00:00'),
      endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      PageIndex: 1,
      PageSize: 20,
      EntCode: '',
      PollutantType: '',
      RegionCode: '',
    },
    qutleTableDatas: [],
    qutleTotal: '',

    priseTableDatas: [],
    priseTotal: '',
    entName: '',

    priseList: [],
  },
  subscriptions: {},
  effects: {
    *getTransmissionEfficiencyForRegion({ payload }, { call, put, update, select }) {
      const {
        beginTime,
        endTime,
        pageSize,
        transmissionEffectiveRate,
        RegionCode,
        pageIndex,
        pollutantType,
        entCode,
      } = yield select(state => state.newtransmissionefficiency);
      let body = {
        RegionCode: RegionCode,
        beginTime: beginTime,
        endTime: endTime,
        PollutantType: pollutantType,
        EntCode: entCode,
        // PageSize: pageSize,
        // PageIndex: pageIndex,
      };
      const response = yield call(GetTransmissionEfficiencyForRegion, { ...body });
      if (response.IsSuccess) {
        yield update({
          entTableDatas: response.Datas,
          entTotal: response.Total,
        });
      }
    },
    *getQutletData({ payload }, { call, put, update, select }) {
      const response = yield call(GetTransmissionEfficiencyForPoints, { ...payload });
      if (response.IsSuccess) {
        yield update({
          qutleTableDatas: response.Datas,
          qutleTotal: response.Total,
        });
      }
    },
    *getTransmissionEfficiencyForEnt({ payload }, { call, put, update, select }) {
      const response = yield call(GetTransmissionEfficiencyForEnt, { ...payload });
      if (response.IsSuccess) {
        yield update({
          priseTableDatas: response.Datas,
          priseTotal: response.Total,
        });
      }
    },

    *getEntByRegion({ payload }, { call, put, update, select }) {
      //获取企业列表
      const response = yield call(GetEntByRegion, { ...payload });
      if (response.IsSuccess) {
        yield update({
          priseList: response.Datas,
        });
      }
    },
    *ExportData({ payload }, { call, put, update, select }) {
      const {
        beginTime,
        endTime,
        pageSize,
        pageIndex,
        transmissionEffectiveRate,
        RegionCode,
        EnterpriseName,
      } = yield select(state => state.transmissionefficiency);
      let body = {
        BeginTime: beginTime,
        EndTime: endTime,
        PageSize: pageSize,
        PageIndex: pageIndex,
        RegionCode: RegionCode,
        EnterpriseName: EnterpriseName,
        ...payload,
      };
      const response = yield call(ExportData, { ...body });
      if (response.IsSuccess) {
        payload.callback(response.Datas);
      }
    },
    *RecalculateTransmissionEfficiency({ payload }, { call, put, update, select }) {
      let body = {
        beginTime: payload.beginTime,
        endTime: payload.endTime,
        DGIMN: payload.DGIMN,
        ...payload,
      };
      const response = yield call(RecalculateTransmissionEfficiency, { ...body });
      payload.callback(response.IsSuccess);
    },
  },
});
