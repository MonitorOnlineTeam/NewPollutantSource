/**
 * 功  能：缺失台账
 * 创建人：张赟
 * 创建时间：2020.09.27
 */

import Model from '@/utils/model';
import {
  GetDefectModel,
  GetEntByRegion,
  GetAttentionDegreeList,
  ExportDefectDataSummary,
  ExportDefectPointDetail,
  GetDefectPointDetail,
  GetPollutantByType,
  GetDefectModelCity,
  ExportDefectDataSummaryCity
} from './service';
import moment from 'moment';
import { message } from 'antd';
export default Model.extend({
  namespace: 'noAccountAirStatistics',
  state: {
    exloading: false,
    loading: false,

    noAccountAirStatisticsForm: {
      BeginTime: moment()
        .subtract(1, 'months')
        .format('YYYY-MM-DD 00:00:00'),
        EndTime: moment().format('YYYY-MM-DD 23:59:59'),
      RegionCode: undefined,
      ModelType:'All',
    },
    divisorList: [],
    tableDatas: [],
    total: '',
    attentionList: [],
    priseList: [],
    airList: [],
    tableDatil: [],
    tableDatilTotal: '',
    tablePhoto:[],
    tablePhotoTotal:''
  },
  subscriptions: {},
  effects: {
    *getDefectModel({ payload }, { call, put, update, select }) {
      //列表
      const response = yield call(GetDefectModel, { ...payload });
      if (response.IsSuccess) {
        yield update({
          tableDatas: response.Datas,
          total: response.Total,
        });
      }
    },
    *getDefectModelCity({ payload }, { call, put, update, select }) {
      //列表
      const response = yield call(GetDefectModelCity, { ...payload });
      if (response.IsSuccess) {
        yield update({
          tableDatas: response.Datas,
          total: response.Total,
        });
      }
    },
    *getDefectPointDetail({ payload }, { call, put, update, select }) {
      //详情
      const response = yield call(GetDefectModel, { ...payload });
      if (response.IsSuccess) {
        yield update({
          tableDatil: response.Datas,
          tableDatilTotal:response.Total
        });
      }
    },
    *getDefectPointPhoto({ payload }, { call, put, update, select }) {
      //缺失照片
      const response = yield call(GetDefectModel, { ...payload });
      if (response.IsSuccess) {
        yield update({
          tablePhoto: response.Datas,
          tablePhotoTotal:response.Total
        });
      }
    },
    *getEntByRegion({ payload }, { call, put, update, select }) {
      //获取所有企业列表
      const response = yield call(GetEntByRegion, { ...payload });
      if (response.IsSuccess) {
        yield update({
          priseList: response.Datas,
        });
      }
    },
    *exportDefectDataSummary({ callback, payload }, { call, put, update, select }) {
      yield update({ exloading: true });
      //导出  
      const response = yield call(ExportDefectDataSummary, { ...payload });
      if (response.IsSuccess) {
        message.success('下载成功');
        callback(response.Datas);
        yield update({ exloading: false });
      } else {
        message.warning(response.Message);
        yield update({ exloading: false });
      }
    },
    *exportDefectDataSummaryCity({ callback, payload }, { call, put, update, select }) {
      yield update({ exloading: true });
      //导出   城市级别
      const response = yield call(ExportDefectDataSummaryCity, { ...payload });
      if (response.IsSuccess) {
        message.success('下载成功');
        callback(response.Datas);
        yield update({ exloading: false });
      } else {
        message.warning(response.Message);
        yield update({ exloading: false });
      }
    },
    // 根据企业类型查询监测因子
    *getPollutantByType({ payload, callback }, { call, put, update, select }) {
      const response = yield call(GetPollutantByType, { ...payload });
      if (response.IsSuccess) {
        yield update({
          divisorList: response.Datas,
        });
        callback && callback(response.Datas);
      } else {
        message.error(response.Message);
      }
    },
  },
});
