/**
 * 功  能：故障率 运转率 超标率
 * 创建人：贾安波
 * 创建时间：2020.10.30
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
  namespace: 'home',
  state: {
    exloading: false,
    loading: true,
    queryPar: {
      BeginTime: moment().subtract(1, 'month') .format('YYYY-MM-DD 00:00:00'),
      EndTime: moment().format('YYYY-MM-DD HH:59:59'),
      EntCode: "",
      RegionCode: "",
      PollutantTypeCode: [],
      ModelType: ""
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
    pollutantList:[{name:'COD',unit:'kg',value:'011'},{name:'氨氮',unit:'kg',value:'060'},{name:'总磷',unit:'kg',value:'101'},{name:'总氮',unit:'kg',value:'065'},{name:'流量',unit:'t',value:'007'}],
    isWorkRate:false,
    isFaultRate:false,
    isOverRate:false,
    Atmosphere:false

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
      //获取所有污水处理厂
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
