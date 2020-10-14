/**
 * 功  能：去除分析率
 * 创建人：贾安波
 * 创建时间：2020.10.09
 */

import Model from '@/utils/model';
import {
  GetSewageHistoryList,
  GetEntByRegion,
  GetAttentionDegreeList,
  ExportSewageHistoryList,
} from './service';
import moment from 'moment';
import { message } from 'antd';
export default Model.extend({
  namespace: 'removalFlowRate',
  state: {
    exloading: false,
    loading: true,
    queryPar: {
      beginTime: moment()
        .subtract(1, 'day')
        .format('YYYY-MM-DD HH:00:00'),
      endTime: moment().format('YYYY-MM-DD HH:59:59'),
      AttentionCode: '',
      EntCode: '',
      RegionCode: '',
      PollutantType:'011',
      dataType:'HourData'
    },
    pointName:'COD',
    tableDatas: [],
    total: '',
    attentionList:[],
    priseList: [],
    chartExport:[],
    chartImport:[],
    chartTime:[],
    entName:''
  },
  subscriptions: {},
  effects: {
    *getSewageHistoryList({ payload }, { call, put, update, select }) {
      //列表

      yield update({ loading:true }); 
      const response = yield call(GetSewageHistoryList, { ...payload });
      if (response.IsSuccess) {
        yield update({
          tableDatas: response.Datas,
          total: response.Total,
        });
        const chartExport = [], chartImport=[], chartTime=[];
        response.Datas.map(item=>{
          chartExport.push(item.exportValue);
          chartImport.push(item.importValue);
          chartTime.push(moment(item.MonitorTime).format('YYYY-MM-DD HH:mm'))
        })
        yield update({
          chartExport:chartExport,
          chartImport:chartImport,
          chartTime:chartTime,
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
    *getEntByRegion({ callback,payload }, { call, put, update, select }) {
      const { queryPar }  = yield select(state => state.removalFlowRate);
      //获取所有企业列表
      const response = yield call(GetEntByRegion, { ...payload });
      if (response.IsSuccess) {
        yield update({
          priseList: response.Datas,
        });
        callback(response.Datas[0].EntCode)
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
