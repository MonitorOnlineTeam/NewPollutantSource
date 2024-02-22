import * as services from '../services';
import Model from '@/utils/model';
import { message } from 'antd';
import moment from 'moment';
import _ from 'lodash';

function getBodyParams(params) {
  const requestParams = _.cloneDeep(params);
  let btime = requestParams.btime.format('YYYY-MM-DD  00:00:00');
  let etime = requestParams.etime.add(-1, 'day').format('YYYY-MM-DD 23:59:59');

  if (requestParams.isYanShi) {
    btime = requestParams.btime.add(-20, 'month').format('YYYY-MM-DD 00:00:00');
    etime = requestParams.etime.add(-20, 'month').format('YYYY-MM-DD 23:59:59');
  }

  let body = {
    ...requestParams,
    etime: etime,
    btime: btime,
    // etime: '2023-12-08 00:00:00',
    // btime: '2023-12-01 00:00:00',
    // pollutantCode: requestParams.pollutantCode.length
    //   ? requestParams.pollutantCode.toString()
    //   : '01,02,03',
    // entCode: '7aad4f39-a853-4547-a5a6-40839f77ea41',
  };
  return body;
}

export default Model.extend({
  namespace: 'AbnormalIdentifyModelHome',
  state: {
    entHomeIsOpen: false,
    // 首页
    requestParams: {
      regionName: '全国',
      regionCode: '',
      industryCode: '',
      dateRange: 'week',
      btime: moment().add(-6, 'day'),
      // .startOf('day'),
      etime: moment(),
      // .endOf('day'),
      pollutantCode: '01,02,03',
      // pollutantCode: [],
      pLeve: 1,
      entCode: '',
    },
    queryData: {
      RegionName: '全国',
      IndustryName: undefined,
    },
    //
    EntCount: 0,
    PointCount: 0,
    regionList: [],
    PointSumStatus: {
      Normal: 0,
      NormalRate: 0,
      Exception: 0,
      ExceptionRate: 0,
      Over: 0,
      OverRate: 0,
      Stop: 0,
      StopRate: 0,
    },
    mapMarkersList: [],
    // 运行分析
    OverRate: 0,
    RunRate: 0,
    // 异常线索统计
    ClueStatisticsData: {
      CountList: [],
      ModelGroupList: [],
    },
    EmissionStatisticsData: {
      pollutantList: [],
      EntCount: [],
      xData: [],
    },

    // 企业
    currentEntName: '',
    // 请求参数
    entRequestParams: {
      // regionCode: '150000000',
      regionCode: '',
      industryCode: '',
      dateRange: 'week',
      btime: moment().add(-6, 'day'),
      // .startOf('day'),
      etime: moment(),

      pollutantCode: '01,02,03',
      // pollutantCode: [],
      pLeve: 3,
      entCode: '',
    },
    entPointSumStatus: {
      Normal: 0,
      NormalRate: 0,
      Exception: 0,
      ExceptionRate: 0,
      Over: 0,
      OverRate: 0,
      Stop: 0,
      StopRate: 0,
    },
    entMapMarkersList: [],
    // 运行分析
    EntOverRate: 0,
    EntRunRate: 0,
  },
  effects: {
    // 获取首页地图数据
    *GetMapPointList({ payload, callback }, { call, select, update }) {
      const requestParams = yield select(state => state.AbnormalIdentifyModelHome.requestParams);
      let body = getBodyParams(requestParams);
      const result = yield call(services.GetMapPointList, body);
      if (result.IsSuccess) {
        const { EntCount, PointCount, Rlist, PointSumStatus, list } = result.Datas;
        let regionList = [];
        for (const key in Rlist[0]) {
          regionList.push({
            label: key,
            value: Rlist[0][key],
          });
        }

        const markers = list.length
          ? list.map(item => ({
              position: {
                ...item,
              },
            }))
          : [];

        callback && callback(markers);
        yield update({
          EntCount,
          PointCount,
          regionList,
          PointSumStatus,
          mapMarkersList: markers,
        });
      } else {
        message.error(result.Message);
      }
    },
    // 获取首页运行分析
    *GetOperationsAnalysis({ payload, callback }, { call, select, update }) {
      const requestParams = yield select(state => state.AbnormalIdentifyModelHome.requestParams);
      let body = getBodyParams({ ...requestParams, isYanShi: true });
      const result = yield call(services.GetOperationsAnalysis, body);
      if (result.IsSuccess) {
        // callback && callback(result.Datas);
        yield update(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 获取排放量统计
    *GetEmissionStatistics({ payload, callback }, { call, select, update }) {
      const requestParams = yield select(state => state.AbnormalIdentifyModelHome.requestParams);
      let body = getBodyParams({ ...requestParams, isYanShi: true });
      const result = yield call(services.GetEmissionStatistics, body);
      if (result.IsSuccess) {
        // callback && callback(result.Datas);
        let data = {};
        let EntCount = [],
          xData = [];
        let pollutantCode = requestParams.pollutantCode.split(',');
        pollutantCode.map(code => {
          data[code] = [];
          result.Datas.map(item => {
            data[code].push(item[code]);
            if (EntCount.length !== result.Datas.length) {
              EntCount.push(item.EntCont);
              xData.push(item.RegionName || item.IndustryTypeName);
            }
          });
        });
        yield update({
          EmissionStatisticsData: {
            pollutantList: data,
            EntCount,
            xData,
          },
        });
      } else {
        message.error(result.Message);
      }
    },
    // 获取异常线索统计
    *GetAbnormalClueStatistics({ payload, callback }, { call, select, update }) {
      const requestParams = yield select(state => state.AbnormalIdentifyModelHome.requestParams);
      let body = getBodyParams({ ...requestParams, isYanShi: true });
      const result = yield call(services.GetAbnormalClueStatistics, body);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
        yield update({
          ClueStatisticsData: {
            ...result.Datas,
          },
        });
      } else {
        message.error(result.Message);
      }
    },
    // 获取排名
    *GetSuspectedRanking({ payload, callback }, { call, select, update }) {
      const requestParams = yield select(state => state.AbnormalIdentifyModelHome.requestParams);
      let body = getBodyParams({ ...requestParams, isYanShi: true });
      const result = yield call(services.GetSuspectedRanking, {
        ...body,
        modelType: payload.modelType,
        modelBaseType: payload.modelBaseType,
      });
      if (result.IsSuccess) {
        let rankData = _.sortBy([...result.Datas], item => -item.val);
        callback && callback(rankData);
      } else {
        message.error(result.Message);
      }
    },

    // 获取企业级别线索排名
    *GetEntSuspectedRanking({ payload, callback }, { call, select, update }) {
      const entRequestParams = yield select(
        state => state.AbnormalIdentifyModelHome.entRequestParams,
      );
      let body = getBodyParams({ ...entRequestParams, isYanShi: true });
      const result = yield call(services.GetSuspectedRanking, {
        ...body,
        modelType: payload.modelType,
        modelBaseType: payload.modelBaseType,
      });
      if (result.IsSuccess) {
        let rankData = _.sortBy([...result.Datas], item => -item.val);
        callback && callback(rankData);
      } else {
        message.error(result.Message);
      }
    },
    // 获取企业级别 - 数据质量分析
    *GetDataQualityAnalysis({ payload, callback }, { call, select, update }) {
      const entRequestParams = yield select(
        state => state.AbnormalIdentifyModelHome.entRequestParams,
      );
      let body = getBodyParams({ ...entRequestParams, isYanShi: true });
      const result = yield call(services.GetDataQualityAnalysis, body);
      if (result.IsSuccess) {
        callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 获取企业级别 - 排污缺口
    *GetPollutantDischargeGapStatistics({ payload, callback }, { call, select, update }) {
      const entRequestParams = yield select(
        state => state.AbnormalIdentifyModelHome.entRequestParams,
      );
      let body = getBodyParams({ ...entRequestParams, isYanShi: true });
      const result = yield call(services.GetPollutantDischargeGapStatistics, body);
      if (result.IsSuccess) {
        let pollutant01 = result.Datas.find(item => item['01'] != undefined);
        let pollutant02 = result.Datas.find(item => item['02'] != undefined);
        let pollutant03 = result.Datas.find(item => item['03'] != undefined);
        let obj = {
          '01': pollutant01,
          '02': pollutant02,
          '03': pollutant03,
        };
        callback && callback(obj);
      } else {
        message.error(result.Message);
      }
    },
    // 获取企业首页地图数据
    *GetEntMapPointList({ payload, callback }, { call, select, update }) {
      const requestParams = yield select(state => state.AbnormalIdentifyModelHome.entRequestParams);
      let body = getBodyParams(requestParams);
      const result = yield call(services.GetMapPointList, body);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
        const { EntCount, PointCount, Rlist, PointSumStatus, list } = result.Datas;
        let regionList = [];
        for (const key in Rlist[0]) {
          regionList.push({
            label: key,
            value: Rlist[0][key],
          });
        }

        const markers = list.length
          ? list.map(item => ({
              position: {
                ...item,
                latitude: item.Latitude,
                longitude: item.Longitude,
              },
            }))
          : [];

        yield update({
          entPointSumStatus: PointSumStatus,
          entMapMarkersList: markers,
        });
      } else {
        message.error(result.Message);
      }
    },
    // 获取首页企业运行分析
    *GetEntOperationsAnalysis({ payload, callback }, { call, select, update }) {
      const requestParams = yield select(state => state.AbnormalIdentifyModelHome.entRequestParams);
      let body = getBodyParams({ ...requestParams, isYanShi: true });
      const result = yield call(services.GetOperationsAnalysis, body);
      if (result.IsSuccess) {
        // callback && callback(result.Datas);
        yield update({
          EntOverRate: result.Datas.OverRate,
          EntRunRate: result.Datas.RunRate,
        });
      } else {
        message.error(result.Message);
      }
    },

    // 更新首页请求参数
    *updateRequestParams({ payload, callback }, { put, take, update }) {
      yield update(payload);
      // yield take('updateRequestParams/@@end');
      // callback && callback();
      // yield put({
      //   type: 'GetMapPointList',
      // });
    },

    // // 更新企业首页请求参数
    // *updateRequestParams({ payload }, { put, take, update }) {
    //   yield update(payload);
    //   // yield take('updateRequestParams/@@end');
    //   yield put({
    //     type: 'GetMapPointList',
    //   });
    // },
  },
});
