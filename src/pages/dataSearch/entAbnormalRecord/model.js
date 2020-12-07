/**
 * 功  能：企业异常记录
 * 创建人：贾安波
 * 创建时间：2020.10.29
 */

import Model from '@/utils/model';
import {
  GetExceptionReportedList,
  GetExceptionReportedView,
  GetEntByRegion,
  GetAttentionDegreeList,
  ExportExceptionReported,
  GetEmissionsEntPointPollutant
} from './service';


import moment from 'moment';
import { message } from 'antd';
export default Model.extend({
  namespace: 'entAbnormalRecord',
  state: {
    exloading: false,
    loading: true,
    Entloading:false,
    queryPar: {
      ExceptionBBtime: moment() .subtract(1, 'month') .format('YYYY-MM-DD 00:00:00'),
      ExceptionBEtime: moment().format('YYYY-MM-DD 23:59:59'),
      ExceptionEBtime:'',
      ExceptionEEtime: '',
      DGIMN: "",
      RegionCode: "",
      EntCode: "",
      Status: ""
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
    EntList:[],
    PointList:[],
    parmarType:'RegionCode',
    entTableDatas:[],
    nextData:{}
  },
  subscriptions: {},
  effects: {
    
    *getExceptionReportedList({callback, payload }, { call, put, update, select }) {
      //企业异常记录查询 列表
      yield update({
          loading:true  
      });
       const response = yield call(GetExceptionReportedList, { ...payload });
      if (response.IsSuccess) {
          yield update({
            tableDatas:response.Datas,
            loading:false  
          });
        callback(response.Datas)
      }else{
      
        yield update({ loading:false }); 
      }
    },
    *getExceptionReportedView({callback, payload }, { call, put, update, select }) {
      //企业异常记录查询 详情

       const response = yield call(GetExceptionReportedView, { ...payload });
       yield update({
        Entloading:true  
      });
      if (response.IsSuccess) {
          yield update({
            entTableDatas:response.Datas,
            Entloading:false  
          });
        callback(response.Datas)
      }else{
      
        yield update({ Entloading:false }); 
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
    *exportExceptionReported({callback, payload }, { call, put, update, select }) {
      yield update({ exloading: true });
      //导出
      const response = yield call(ExportExceptionReported, { ...payload });
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
