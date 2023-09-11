/**
 * 功  能：视频监控 
 * 创建人：jab
 * 创建时间：2020.10
 */

import Model from '@/utils/model';
import {
  GetCameraListEnt,
  GetCameraListStation,
  GetEntByRegion,
  GetAttentionDegreeList,
  ExportSewageHistoryList,
  
} from './service';
import moment from 'moment';
import { message } from 'antd';
export default Model.extend({
  namespace: 'videoMonitor',
  state: {
    exloading: false,
    loading: true,
    queryPar: {
      RegionCode: "",
      EntCode: "",
      AttentionCode: ""
    },
    pointName:'COD',
    tableDatas: [],
    total: '',
    attentionList:[],
    priseList: [],
    chartExport:[],
    chartImport:[],
    chartTime:[],
    entName:'',
    stationTableDatas:[]
  },
  subscriptions: {},
  effects: {
    *getCameraListEnt({ payload }, { call, put, update, select }) {
      //列表 视频 企业

      yield update({ loading:true }); 
      const response = yield call(GetCameraListEnt, { ...payload });
      if (response.IsSuccess) {
        yield update({
          tableDatas: response.Datas,
          total: response.Total,
          loading:false
        });
      }else{
        yield update({ loading:false }); 
      }
    },

    *getCameraListStation({ payload }, { call, put, update, select }) {
      //列表 视频 大气站

      yield update({ loading:true }); 
      const response = yield call(GetCameraListStation, { ...payload });
      if (response.IsSuccess) {
        yield update({
          stationTableDatas: response.Datas,
          loading:false
        });
      }else{
        yield update({ loading:false }); 
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
    *exportSewageHistoryList({callback, payload }, { call, put, update, select }) {
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


  },
});
