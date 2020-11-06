/**
 * 功  能：故障率 运转率 超标率
 * 创建人：贾安波
 * 创建时间：2020.10.30
 */

import Model from '@/utils/model';
import {
  GetOverDataRate,
  GetDeviceDataRate,
  GetExceptionDataRate,
  GetEntByRegion,
  GetAttentionDegreeList,
  ExportSewageHistoryList,
  getAirDayReportData
} from './service';
import moment from 'moment';
import { message } from 'antd';
import { result } from 'lodash';
export default Model.extend({
  namespace: 'home',
  state: {
    exloading: false,
    loading: true,
    queryPar: {
      BeginTime: moment().subtract(1, 'month').format('YYYY-MM-DD 00:00:00'),
      EndTime: moment().format('YYYY-MM-DD HH:59:59'),
      EntCode: "",
      RegionCode: "",
      PollutantTypeCode: [],
      ModelType: ""
    },
    pointName: 'COD',
    tableDatas: [],
    entTableDatas: [],
    pointTableDatas: [],
    total: '',
    attentionList: [],
    priseList: [],
    chartExport: [],
    chartImport: [],
    chartTime: [],
    entName: '',
    pollutantList: [{ name: 'COD', unit: 'kg', value: '011' }, { name: '氨氮', unit: 'kg', value: '060' }, { name: '总磷', unit: 'kg', value: '101' }, { name: '总氮', unit: 'kg', value: '065' }, { name: '流量', unit: 't', value: '007' }],
    isWorkRate: false,
    isFaultRate: false,
    isOverRate: false,
    Atmosphere: false,
    entQuery: {},
    pointQuery: {},
    ModelType: 'All',
    regionName: '',
    regionCode: '',
    entCode: '',
    realTimeAlarmLoading: false,
    wasteWaterTable:
    [{value:'1',name:'哈哈哈',label:'666',title:'有了'},
    {value:'2',name:'呵呵',label:'666',title:'有了'},
    {value:'2',name:'呵呵',label:'666',title:'有了'},
    {value:'2',name:'呵呵',label:'666',title:'有了'},
    {value:'2',name:'呵呵',label:'666',title:'有了'},
  ],
    // ---------wjq-----------
    airDayReportData: {
      datas: [
        { value: 0, rate: 0, name: '优' },
        { value: 0, rate: 0, name: '良' },
        { value: 0, rate: 0, name: '轻度' },
        { value: 0, rate: 0, name: '中度' },
        { value: 0, rate: 0, name: '重度' },
        { value: 0, rate: 0, name: '严重' },
        { value: 0, rate: 0, name: '爆表' },
      ],
      allCount: 0
    }
  },
  subscriptions: {},
  effects: {
    *getOverDataRate({ payload }, { call, put, update, select }) {
      //列表  超标率

      yield update({ loading: true });
      const response = yield call(GetOverDataRate, { ...payload });
      let { ModelType } = yield select(_ => _.home);

      if (response.IsSuccess) {

        if (ModelType == 'All') {
          yield update({ tableDatas: response.Datas, loading: false });
        } else if (ModelType == 'Region') {
          yield update({ entTableDatas: response.Datas, loading: false });
        } else {
          yield update({ pointTableDatas: response.Datas, loading: false });
        }

      } else {
        yield update({ loading: false });
      }
    },
    *getDeviceDataRate({ payload }, { call, put, update, select }) {
      //列表  运转率

      yield update({ loading: true });
      const response = yield call(GetDeviceDataRate, { ...payload });
      let { ModelType } = yield select(_ => _.home);

      if (response.IsSuccess) {

        if (ModelType == 'All') {
          yield update({ tableDatas: response.Datas, loading: false });
        } else if (ModelType == 'Region') {
          yield update({ entTableDatas: response.Datas, loading: false });
        } else {
          yield update({ pointTableDatas: response.Datas, loading: false });
        }

      } else {
        yield update({ loading: false });
      }
    },
    *getExceptionDataRate({ payload }, { call, put, update, select }) {
      //列表  异常率

      yield update({ loading: true });
      const response = yield call(GetExceptionDataRate, { ...payload });
      let { ModelType } = yield select(_ => _.home);

      if (response.IsSuccess) {

        if (ModelType == 'All') {
          yield update({ tableDatas: response.Datas, loading: false });
        } else if (ModelType == 'Region') {
          yield update({ entTableDatas: response.Datas, loading: false });
        } else {
          yield update({ pointTableDatas: response.Datas, loading: false });
        }

      } else {
        yield update({ loading: false });
      }
    },
    *getAttentionDegreeList({ payload }, { call, put, update, select }) {
      //关注列表
      const response = yield call(GetAttentionDegreeList, { ...payload });
      if (response.IsSuccess) {
        yield update({
          attentionList: response.Datas,
        });
      }
    },
    *getEntByRegion({ callback, payload }, { call, put, update, select }) {
      const { queryPar } = yield select(state => state.removalFlowRate);
      //获取所有污水处理厂
      const response = yield call(GetEntByRegion, { ...payload });
      if (response.IsSuccess) {
        yield update({
          priseList: response.Datas,
        });
        callback(response.Datas[0].EntCode)
      }
    },
    *exportSewageHistoryList({ callback, payload }, { call, put, update, select }) {
      yield update({ exloading: true });
      //导出
      const response = yield call(ExportSewageHistoryList, { ...payload });
      if (response.IsSuccess) {
        message.success('下载成功');
        callback(response.Datas);
        yield update({ exloading: false });
      } else {
        message.warning(response.Message);
        yield update({ exloading: false });
      }
    },
    // 获取空气日报统计数据 - wjq
    *getAirDayReportData({ payload }, { call, put, update, select }) {
      const result = yield call(getAirDayReportData, { ...payload });
      if (result.IsSuccess) {
        let data = result.Datas;
        let airDayReportData = {
          datas: [
            { value: data.oneLevel, rate: data.oneLevelRate, name: '优' },
            { value: data.twoLevel, rate: data.twoLevelRate, name: '良' },
            { value: data.threeLevel, rate: data.threeLevelRate, name: '轻度' },
            { value: data.fourLevel, rate: data.fourLevelRate, name: '中度' },
            { value: data.fiveLevel, rate: data.fiveLevelRate, name: '重度' },
            { value: data.sixLevel, rate: data.sixLevelRate, name: '严重' },
            { value: data.sevenLevel, rate: data.sevenLevelRate, name: '爆表' },
          ],
          allCount: data.allCount
        }
        yield update({ airDayReportData })
      } else {
        message.error(result.Message);
      }
    },

  },
});
