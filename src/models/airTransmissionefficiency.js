/**
 * 功  能：传输有效率 空气站
 * 创建人：贾安波
 * 创建时间：2021.05.19
 */

import Model from '@/utils/model';
import {
  GetAirTransmissionEfficiencyForEnt,
  GetAirTransmissionEfficiencyForPoint,
  ExportAirTransmissionEfficiencyForEnt,
  ExportAirTransmissionEfficiencyForPoint,
} from '../services/airTransmissionefficiency';
import moment from 'moment';
import { message } from 'antd';
export default Model.extend({
  namespace: 'airTransmissionefficiency',
  state: {
    exRegionloading: false,
    exEntloading: false,
    pageSize: 20,
    pageIndex: 1,
    beginTime: moment().subtract(1, 'days').format('YYYY-MM-DD 00:00:00'),
    endTime: moment().subtract(1, 'days').format('YYYY-MM-DD 23:59:59'),
    transmissionEffectiveRate: 'ascend',
    entTableDatas: [],
    entCode: null,
    total: 0,
    entTotal: 0,
    RegionCode: '',
    EnterpriseName: '',
    pollutantType: '',
    operationpersonnel:'',
    assessment:'1',
    priseQueryPar: {
      beginTime: moment().subtract(1, 'days').format('YYYY-MM-DD 00:00:00'),
      endTime: moment().subtract(1, 'days').format('YYYY-MM-DD 23:59:59'),
      EntCode: '',
      // PageIndex: 1,
      // PageSize: 20,
      // PollutantType: '',
      // RegionCode: '',
      // Assessment:'1',
      // OperationPersonnel:'',
    },
    priseTableDatas: [],
    priseTotal: '',
    entName: '',

    priseList: [],
    cityName:''
  },
  subscriptions: {},
  effects: {
    *getAirTransmissionEfficiencyForEnt({ payload }, { call, put, update, select }) {
      //行政区 企业级别
      const {
        beginTime,
        endTime,
        pageSize,
        RegionCode,
        pageIndex,
        pollutantType,
        assessment,
        entCode,
        operationpersonnel,
      } = yield select(state => state.airTransmissionefficiency);
      let body = {
        beginTime,
        endTime,
        ...payload
      };
      const response = yield call(GetAirTransmissionEfficiencyForEnt, { ...body });
      if (response.IsSuccess) {
        yield update({
          entTableDatas: response.Datas,
          entTotal: response.Total,
        });
      }
    },

    *getAirTransmissionEfficiencyForPoint({ payload }, { call, put, update, select }) {
      const {
        operationpersonnel,
      } = yield select(state => state.newtransmissionefficiency);
      let body = {
        ...payload,
      };
      //排口
      const response = yield call(GetAirTransmissionEfficiencyForPoint, { ...body });
      if (response.IsSuccess) {
        yield update({
          priseTableDatas: response.Datas,
          priseTotal: response.Total,
        });
      }
    },


    *exportAirTransmissionEfficiencyForEnt({ payload }, { call, put, update, select }) {
      // 企业级别导出
      const {
        beginTime,
        endTime,
      } = yield select(state => state.airTransmissionefficiency);
      let body = {
        beginTime,
        endTime,
        ...payload
      };
      const response = yield call(ExportAirTransmissionEfficiencyForEnt, { ...body });
      if (response.IsSuccess) {
        message.success('下载成功');
        payload.callback(response.Datas);
        yield update({ exRegionloading: false });
      } else {
        message.warning(response.Message);
        yield update({ exRegionloading: false });
      }
    },

    *exportAirTransmissionEfficiencyForPoint({ callback,payload }, { call, put, update, select }) {
      let body = {
        ...payload
      };
      //排口级别导出
      const response = yield call(ExportAirTransmissionEfficiencyForPoint, { ...body });
      if (response.IsSuccess) {
        message.success('下载成功');
        callback(response.Datas);
        yield update({ exEntloading: false });
      } else {
        message.warning(response.Message);
        yield update({ exEntloading: false });
      }
    },
  },
});
