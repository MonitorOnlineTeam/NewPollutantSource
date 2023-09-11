/**
 * 功  能：首页
 * 创建人：jab
 * 创建时间：2020.11
 */

import Model from '@/utils/model';
import {
  GetOverDataRate,
  GetDeviceDataRate,
  GetExceptionDataRate,
  GetEntByRegion,
  GetAttentionDegreeList,
  ExportSewageHistoryList,
  GetPointStatusList,
  GetOverList,
  GetAQIList,
  GetAlarmResponse,
  GetSewageFlowList,
  ExportOverDataRate,//超标率导出
  ExportDeviceDataRate,//运转率导出
  ExportExceptionDataRate,//故障率导出
  GetOperationWorkOrderList,
  getAirDayReportData,
  getAlarmDataList,
  getGZRateList,
  getCBRateList,
  getYZRateList,
  getCSYXRateList,
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
      BeginTime: moment().subtract(7, 'day').format('YYYY-MM-DD 00:00:00'),
      EndTime: moment().format('YYYY-MM-DD 23:59:59'),
      EntCode: "",
      RegionCode: "",
      PollutantTypeCode: [],
      ModelType: "",
      OperationPersonnel:''
    },
    pointName: 'COD',
    tableDatas: [],
    entTableDatas: [],
    pointTableDatas: [],
    regionLoading:true,
    pointLoading:true,
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
    wasteWaterTable:[],
    pointStatusList: {},
    wasteGasStatusList: {},
    wasteGasStatusLoading: true,
    pointStatusLoading: true,
    dataQueryPar: {
      BeginTime: "",
      EndTime: "",
      DataType: "",
      PollutantType: "",
      MonitorTime: "",
      pollutantCode: ""
    },
    gasOverListPar: {
      PollutantType: 2,
      BeginTime: moment().add('day', -7).format('YYYY-MM-DD 00:00:00'),
      EndTime: moment().format('YYYY-MM-DD 23:59:59'),
      pollutantCode: '01',
      DataType: 'HourData'
    },
    overWasteWaterLoading: true,
    overWasteWaterList: [],
    overWasteGasLoading: true,
    overWasteGasList: [],
    workOrderLoading: true,
    workOrderList: {},
    alarmResponseLoading: [],
    alarmResponseList: {},
    getAQIList:[],
    getAQILoading: true,
    airDayReportloading:true,
    priseList:[],
    getSewageFlowList: [],
    getSewageFlowLoading: true,
    waterType:[],
    hover1:false,
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
    },
    alarmDataList: [],
    // 故障率
    GZRateDataList: [],
    GZRateX: [],
    // 超标率
    CBRateDataList: [],
    CBRateX: [],
    // 运转率
    YZRateDataList: [],
    YZRateX: [],
    // 传输有效率
    CSYXRateDataList: [],
    CSYXRateX: [],
    // 详情弹窗
    detailsModalVisible_WJQ: false,
    // ---------wjq-----------
  },
  subscriptions: {},
  effects: {
    *getPointStatusList({ payload }, { call, put, update, select }) {


      //监测点状态
      yield update({
        pointStatusLoading: true,
        wasteGasStatusLoading: true,
      });
      const response = yield call(GetPointStatusList, { ...payload });
      if (response.IsSuccess) {
        if (payload.PollutantType == 1) {
          yield update({
            pointStatusList: response.Datas,
            pointStatusLoading: false,
          });
        } else {
          yield update({
            wasteGasStatusList: response.Datas,
            wasteGasStatusLoading: false,
          });
        }

      }
    },
    *getOverList({ payload }, { call, put, update, select }) {


      //超标监测点
      payload.PollutantType == 1?  yield update({ overWasteWaterLoading: true}) :   yield update({   overWasteGasLoading: true}) ;
      const response = yield call(GetOverList, { ...payload });
      if (response.IsSuccess) {
        if (payload.PollutantType == 1) {
          yield update({
            overWasteWaterList: response.Datas,
            overWasteWaterLoading: false,
          });
        } else {
          yield update({
            overWasteGasList: response.Datas,
            overWasteGasLoading: false,
          });
        }

      }
    },
    *getOperationWorkOrderList({ payload }, { call, put, update, select }) {
      //运维工单统计
      yield update({ workOrderLoading: true });
      const response = yield call(GetOperationWorkOrderList, { ...payload });
      if (response.IsSuccess) {
        yield update({
          workOrderList: response.Datas,
          workOrderLoading: false,
        });
      } else {


      }
    },
    *getAlarmResponse({ payload }, { call, put, update, select }) {
      //数据报警响应统计
      yield update({ alarmResponseLoading: true});
      const response = yield call(GetAlarmResponse, { ...payload });
      if (response.IsSuccess) {
          yield update({
            alarmResponseList: response.Datas,
            alarmResponseLoading: false,
          });
        }else{


      }
    },
    *getAQIList({ payload }, { call, put, update, select }) {
      //空气实时数据
      yield update({ getAQILoading: true});
      const response = yield call(GetAQIList, { ...payload });
      if (response.IsSuccess) {
          yield update({
            getAQIList: response.Datas,
            getAQILoading: false,
          });
        }else{


      }
    },
    *getSewageFlowList({ payload }, { call, put, update, select }) {
      //污水处理厂流量分析
      yield update({ getSewageFlowLoading: true});
      const response = yield call(GetSewageFlowList, { ...payload });
      if (response.IsSuccess) {
          yield update({
            getSewageFlowList: response.Datas.data,
            getSewageFlowLoading: false,
            waterType:response.Datas.waterType
          });
        }else{


      }
    },

    *getOverDataRate({ payload }, { call, put, update, select }) {
      //列表  超标率
      let { ModelType } = yield select(_ => _.home);
      ModelType == 'All'?  yield update({ loading: true  }):
       ModelType == 'Region'? yield update({ regionLoading: true  })
       :yield update({ pointLoading: true  })
      const response = yield call(GetOverDataRate, { ...payload });
     

      if (response.IsSuccess) {

        if (ModelType == 'All') {
          yield update({ tableDatas: response.Datas, loading: false });
        } else if (ModelType == 'Region') {
          yield update({ entTableDatas: response.Datas, regionLoading: false });
        } else {
          yield update({ pointTableDatas: response.Datas, pointLoading: false });
        }

      } else {
        yield update({ loading: false, regionLoading: false, pointLoading: false });
      }
    },
    *getDeviceDataRate({ payload }, { call, put, update, select }) {
      //列表  运转率
      let { ModelType } = yield select(_ => _.home);
      ModelType == 'All'?  yield update({ loading: true  }):
      ModelType == 'Region'? yield update({ regionLoading: true  })
      :yield update({ pointLoading: true  });
      const response = yield call(GetDeviceDataRate, { ...payload });

      if (response.IsSuccess) {

        if (ModelType == 'All') {
          yield update({ tableDatas: response.Datas, loading: false });
        } else if (ModelType == 'Region') {
          yield update({ entTableDatas: response.Datas, regionLoading: false });
        } else {
          yield update({ pointTableDatas: response.Datas, pointLoading: false });
        }

      } else {
        yield update({ loading: false, regionLoading: false, pointLoading: false });
      }
    },
    *getExceptionDataRate({ payload }, { call, put, update, select }) {
      //列表  异常率

      let { ModelType } = yield select(_ => _.home);
      ModelType == 'All'?  yield update({ loading: true  }):
      ModelType == 'Region'? yield update({ regionLoading: true  })
      :yield update({ pointLoading: true  });
      const response = yield call(GetExceptionDataRate, { ...payload });

      if (response.IsSuccess) {

        if (ModelType == 'All') {
          yield update({ tableDatas: response.Datas, loading: false });
        } else if (ModelType == 'Region') {
          yield update({ entTableDatas: response.Datas, regionLoading: false });
        } else {
          yield update({ pointTableDatas: response.Datas, pointLoading: false });
        }

      } else {
        yield update({ loading: false, regionLoading: false, pointLoading: false });
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
      //获取所有污水处理厂
      const response = yield call(GetEntByRegion, { ...payload });
      if (response.IsSuccess) {
        yield update({
          priseList: response.Datas,
        });
        response.Datas.length>0? callback(response.Datas[0].EntCode) :  callback('')
      }
    },
    *exportOverDataRate({ callback, payload }, { call, put, update, select }) {
      yield update({ exloading: true });
      //超标率导出
      const response = yield call(ExportOverDataRate, { ...payload });
      if (response.IsSuccess) {
        message.success('下载成功');
        callback(response.Datas);
        yield update({ exloading: false });
      } else {
        message.warning(response.Message);
        yield update({ exloading: false });
      }
    },
    *exportExceptionDataRate({ callback, payload }, { call, put, update, select }) {
      yield update({ exloading: true });
      //故障率导出
      const response = yield call(ExportExceptionDataRate, { ...payload });
      if (response.IsSuccess) {
        message.success('下载成功');
        callback(response.Datas);
        yield update({ exloading: false });
      } else {
        message.warning(response.Message);
        yield update({ exloading: false });
      }
    },
    *exportDeviceDataRate({ callback, payload }, { call, put, update, select }) {
      yield update({ exloading: true });
      //运转率导出
      const response = yield call(ExportDeviceDataRate, { ...payload });
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
      yield update({airDayReportloading: true });
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
        yield update({ airDayReportData,airDayReportloading: false })
      } else {
        message.error(result.Message);
      }
    },
    // 获取实时报警数据 - wjq
    *getAlarmDataList({ payload }, { call, put, update, select }) {
      const result = yield call(getAlarmDataList, { ...payload });
      if (result.IsSuccess) {
        let alarmDataList = result.Datas.map(item => {
          return { content: item.AlarmMsg, verify: !!item.OperationVerifyID }
        })
        yield update({ alarmDataList })
      } else {
        message.error(result.Message);
      }
    },
    // 获取故障率 - wjq
    *getGZRateList({ payload }, { call, put, update, select }) {
      const result = yield call(getGZRateList, { ...payload });
      if (result.IsSuccess) {
        let GZRateDataList = result.Datas.map(item => {
          return {
            name: item.pollutantTypeName,
            type: 'line',
            data: item.dataList.map(itm => itm.failureRate),
            showSymbol: false,//隐藏所有数据点
            smooth: true,
          }
        })
        let GZRateX = result.Datas[0].dataList.map(item => moment(item.monitorTime).format("MM.DD"))
        yield update({ GZRateDataList: GZRateDataList, GZRateX })
      } else {
        message.error(result.Message);
      }
    },
    // 获取超标率 - wjq
    *getCBRateList({ payload }, { call, put, update, select }) {
      const result = yield call(getCBRateList, { ...payload });
      if (result.IsSuccess) {
        let CBRateDataList = result.Datas.map(item => {
          if (item.pollutantTypeCode != 5) {
            return {
              name: item.pollutantTypeName,
              type: 'line',
              data: item.dataList.map(itm => itm.overStandardRate),
              showSymbol: false,//隐藏所有数据点
              smooth: true,
            }
          }
        })
        let CBRateX = result.Datas[0].dataList.map(item => moment(item.monitorTime).format("MM.DD"))
        yield update({ CBRateDataList, CBRateX })
      } else {
        message.error(result.Message);
      }
    },
    // 获取超标率 - wjq
    *getYZRateList({ payload }, { call, put, update, select }) {
      const result = yield call(getYZRateList, { ...payload });
      if (result.IsSuccess) {
        let YZRateDataList = result.Datas.map(item => {
          return {
            name: item.pollutantTypeName,
            type: 'line',
            data: item.dataList.map(itm => itm.deviceOperationRate),
            showSymbol: false,//隐藏所有数据点
            smooth: true,
          }
        })
        let YZRateX = result.Datas[0].dataList.map(item => moment(item.monitorTime).format("MM.DD"))
        yield update({ YZRateDataList, YZRateX })
      } else {
        message.error(result.Message);
      }
    },
    // 传输有效率 - wjq
    *getCSYXRateList({ payload }, { call, put, update, select }) {
      const result = yield call(getCSYXRateList, { ...payload });
      if (result.IsSuccess) {
        let CSYXRateDataList = result.Datas.map(item => {
          if (item.pollutantTypeCode != 5) {
            return {
              name: item.pollutantTypeName,
              type: 'line',
              data: item.dataList.map(itm => itm.effectiveTransmissionRate),
              showSymbol: false,//隐藏所有数据点
              smooth: true,
            }
          }
        })
        let CSYXRateX = result.Datas[0].dataList.map(item => moment(item.monitorTime).format("MM.DD"))
        yield update({ CSYXRateDataList, CSYXRateX })
      } else {
        message.error(result.Message);
      }
    },

  },
});
