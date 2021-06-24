/**
 * 功  能：用户访问率统计
 * 创建人：贾安波
 * 创建时间：2021.06.17
 */
// POST rest/PollutantSourceApi/MonitorPointApi/GetHomePageNetworkingRate	
// 首页联网率

import Model from '@/utils/model';
import {
  GetNetworkingRateForProvice,
  GetNetworkingRateForCity,
  GetNetworkingRateForPoint,
  ExportNetworkingRateForProvice,
  ExportNetworkingRateForCity,
  ExportNetworkingRateForPoint,
  GetHomePageNetworkingRate
} from '../services/networkRateStatistics';
import moment from 'moment';
import { message } from 'antd';
export default Model.extend({
  namespace: 'networkRateStatistics',
  state: {
    exloading: false,
    loading: false,
    tableDatas: [],
    tableDatil:[],
    pointList:[],
    ProviceArr:[],
    ProviceNetArr:[],
    ProviceNoNetArr:[],
    ProviceRate:[],
    CityArr:[],
    CityNetArr:[],
    CityNoNetArr:[],
    CityRate:[]
  },
  subscriptions: {},
  effects: {
    *getHomePageNetworkingRate({callback, payload }, { call, put, update, select }) {
      //首页 联网率
      const response = yield call(GetHomePageNetworkingRate, { ...payload });
      if (response.IsSuccess) {
        callback(response.Datas);
      } else {
        message.warning(response.Message);
      }
    },
    *getNetworkingRateForProvice({ payload }, { call, put, update, select }) {
      //省级 联网率
      const response = yield call(GetNetworkingRateForProvice, { ...payload });
      if (response.IsSuccess&&response.Datas.length>0) {
        let chartData = response.Datas.filter(item=>{
          return item.ProviceName !=='全部合计'
        })
        let proviceArr = chartData.map(item=>{
          return item.ProviceName
        })
        let proviceNetArr = chartData.map(item=>{
          return item.NetworkingCount
        })
        let proviceNoNetArr = chartData.map(item=>{
          return item.OffLineCount
        })
        let proviceRate = chartData.map(item=>{
          return item.NetworkingRate.replace('%','')
        })
        yield update({
          tableDatas:response.Datas,
          ProviceArr:proviceArr,
          ProviceNetArr:proviceNetArr,
          ProviceNoNetArr:proviceNoNetArr,
          ProviceRate:proviceRate
        });
      } 
    },
    *getNetworkingRateForCity({ payload }, { call, put, update, select }) {
      //市级 联网率
      const response = yield call(GetNetworkingRateForCity, { ...payload });
      if (response.IsSuccess&&response.Datas.length>0) {
        let chartData = response.Datas.filter(item=>{
          return item.ProviceName !=='全部合计'
        })
        let cityArr = chartData.map(item=>{
          return item.CityName
        })
        let cityNetArr = chartData.map(item=>{
          return item.NetworkingCount
        })
        let cityNoNetArr = chartData.map(item=>{
          return item.OffLineCount
        })
        let cityRate = chartData.map(item=>{
          return item.NetworkingRate.replace('%','')
        })
        yield update({
          tableDatil:response.Datas,
          CityArr:cityArr,
          CityNetArr:cityNetArr,
          CityNoNetArr:cityNoNetArr,
          CityRate:cityRate
        });
      }
    },
    *getNetworkingRateForPoint({ payload }, { call, put, update, select }) {
      //监测点 列表
      const response = yield call(GetNetworkingRateForPoint, { ...payload });
      if (response.IsSuccess) {
        yield update({
        pointList: response.Datas,
        });
      }
    },
    *exportNetworkingRateForProvice({callback, payload }, { call, put, update, select }) {
      //导出  省
      const response = yield call(ExportNetworkingRateForProvice, { ...payload });
      if (response.IsSuccess) {
        message.success('下载成功');
        callback(response.Datas);
      } else {
        message.warning(response.Message);
      }
    },
    *exportNetworkingRateForCity({callback, payload }, { call, put, update, select }) {
      //导出 市
      const response = yield call(ExportNetworkingRateForCity, { ...payload });
      if (response.IsSuccess) {
        message.success('下载成功');
        callback(response.Datas);
      } else {
        message.warning(response.Message);
      }
    },
    *exportNetworkingRateForPoint({callback, payload }, { call, put, update, select }) {
      //导出 监测点
      const response = yield call(ExportNetworkingRateForPoint, { ...payload });
      if (response.IsSuccess) {
        message.success('下载成功');
        callback(response.Datas);
      } else {
        message.warning(response.Message);
      }
    },
    
  },
});
