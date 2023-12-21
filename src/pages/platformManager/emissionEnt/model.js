/**
 * 功  能：传输有效率
 * 创建人：jab
 * 创建时间：2020.09.27
 */

import Model from '@/utils/model';
import {
  GetTransmissionEfficiencyForRegion,
  GetTransmissionEfficiencyForPoint,
  GetTransmissionEfficiencyForEnt,
  GetEntByRegion,
  ExportTransmissionEfficiencyForRegion,
  ExportTransmissionEfficiencyForEnt,
  GetEmissionEntList,
  AddEmissionEnt,
  DeleteEmissionEntByID,
  ExportEmissionEnt,
  GetEmissionEntAndPoint,
  updateEntFlag
} from './service';
import moment from 'moment';
import { message } from 'antd';
export default Model.extend({
  namespace: 'emissionEnt',
  state: {
    entData: [],
    entDataTotal: 0,
    entFlag:'',
    noSelectEnt: [],
    AssessYear:moment(),
    AssessYearStr:moment().format('YYYY'),
    selectEnt: [],
    exRegionloading: false,
    exEntloading: false,
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
      //行政区
      const {
        beginTime,
        endTime,
        pageSize,
        RegionCode,
        pageIndex,
        pollutantType,
        entCode,
      } = yield select(state => state.emissionEnt);
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
    *getTransmissionEfficiencyForEnt({ payload }, { call, put, update, select }) {
      //企业
      const response = yield call(GetTransmissionEfficiencyForEnt, { ...payload });
      if (response.IsSuccess) {
        yield update({
          qutleTableDatas: response.Datas,
          qutleTotal: response.Total,
        });
      }
    },
    *getTransmissionEfficiencyForPoint({ payload }, { call, put, update, select }) {
      //排口
      const response = yield call(GetTransmissionEfficiencyForPoint, { ...payload });
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
    *exportTransmissionEfficiencyForRegion({ payload }, { call, put, update, select }) {
      //行政区导出
      const {
        beginTime,
        endTime,
        pageSize,
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
      };
      const response = yield call(ExportTransmissionEfficiencyForRegion, { ...body });
      if (response.IsSuccess) {
        message.success('下载成功');
        payload.callback(response.Datas);
        yield update({ exRegionloading: false });
      } else {
        message.warning(response.Message);
        yield update({ exRegionloading: false });
      }
    },

    *exportTransmissionEfficiencyForEnt({ callback, payload }, { call, put, update, select }) {
      //企业级导出
      const response = yield call(ExportTransmissionEfficiencyForEnt, { ...payload });
      if (response.IsSuccess) {
        message.success('下载成功');
        callback(response.Datas);
        yield update({ exEntloading: false });
      } else {
        message.warning(response.Message);
        yield update({ exEntloading: false });
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

    *GetEmissionEntList({ payload }, { call, put, update, select }) {
      //企业
      const {
        pageSize,
        RegionCode,
        pageIndex,
        pollutantType,
        entCode,
        qutletQueryPar,
        entFlag,
      } = yield select(state => state.emissionEnt);
      let body = {
        RegionCode: RegionCode,
        PollutantType: pollutantType,
        EntCode: qutletQueryPar.EntCode,
        PageSize: pageSize,
        PageIndex: pageIndex,
        EntFlag:entFlag
      };
      const response = yield call(GetEmissionEntList, { ...body });
      if (response.IsSuccess) {
        yield update({
          entData: response.Datas,
          entDataTotal: response.Total,
        });
      }
    },

    *ExportEmissionEnt({ payload }, { call, put, update, select }) {
      //企业
      const response = yield call(ExportEmissionEnt, { ...payload });
      if (response.IsSuccess) {
        message.success("导出成功")
        window.open(response.Datas)
      } else {
        message.error(response.Datas)
      }
    },

    *DeleteEmissionEntByID({ payload }, { call, put, update, select }) {
      //企业
      const response = yield call(DeleteEmissionEntByID, { ...payload });
      if (response.IsSuccess) {
        message.success("删除成功");
        yield put({
          type:'GetEmissionEntList',
          payload:{
          }
        })
      } else {
        message.error(response.Datas);
      }
    },

    *AddEmissionEnt({ payload }, { call, put, update, select }) {
      //企业
      const response = yield call(AddEmissionEnt, { ...payload });
      if (response.IsSuccess) {
        message.success("添加成功");
        yield put({
          type:'GetEmissionEntList',
          payload:{
          }
        })
      } else {
        message.error(response.Datas);
      }
    },

    *GetEmissionEntAndPoint({ payload }, { call, put, update, select }) {
      const response = yield call(GetEmissionEntAndPoint, { ...payload });
      if (response.IsSuccess) {
        // console.log('code=',response.Datas.AnnualAssessmentEntAndPoint.map(item => item.DGIMN))
        yield update({
          noSelectEnt: response.Datas.AllEntAndPoint,
          selectEnt: response.Datas.EmissionEntAndPoint.map(item => item.DGIMN),
        });
      } else {
        message.error(response.Datas);
      }
    },
    *updateEntFlag({ payload }, { call, put, update, select }) {
      //企业
      const response = yield call(updateEntFlag, { ...payload });
      if (response.IsSuccess) {
        message.success("设置成功");
        yield put({
          type:'GetEmissionEntList',
          payload:{
          }
        })
      } else {
        message.error(response.Datas);
      }
    },
  },
});
