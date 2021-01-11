/**
 * 功  能：空气质量状况统计
 * 创建人：贾安波
 * 创建时间：2021.01.07
 */

import Model from '@/utils/model';
import {
  GetCityStationAQI,
  ExportCityStationAQI,
} from './service';
import moment from 'moment';
import { message } from 'antd';
export default Model.extend({
  namespace: 'airQualityStatistics',
  state: {
    exloading: false,
    loading: true,
    queryPar: {
      beginTime: moment().subtract("days", '30').format('YYYY-MM-DD 00:00:00'),
      endTime: moment().subtract("days", '1').format('YYYY-MM-DD 23:59:59'),
    },
    entQueryPar: {  },
    entNumQueryPar: { },
    regQueryPar: { },
    workNumQueryPar: {},
    pointName:'COD',
    tableDatas: [],
    total: '',
    attentionList:[],
    priseList: [],
    chartExport:[],
    chartImport:[],
    chartTime:[],
    entName:'',
    Regionloading:false,
    EntNumloading:false,
    EntNameloading:false,
    TaskNumsloading:false,
    RegionName:'',
    EntName:''
  },
  subscriptions: {},
  effects: {

    *getCityStationAQI({ payload }, { call, put, update, select }) {
      //空气质量状况统计 列表
      yield update({
        loading: true,
      });
      const response = yield call(GetCityStationAQI, { ...payload });
      if (response.IsSuccess) {
        yield update({
          tableDatas: response.Datas,
          loading:false
        });
      }
    },
    *exportCityStationAQI({callback, payload }, { call, put, update, select }) {
      yield update({ exloading: true });
      //导出
      const response = yield call(ExportCityStationAQI, { ...payload });
      if (response.IsSuccess) {
        message.success('下载成功');
        callback(response.Datas);
        yield update({ exloading: false });
      } else {
        message.warning(response.Message);
        yield update({ exloading: false });
      }
    },


  },
});
