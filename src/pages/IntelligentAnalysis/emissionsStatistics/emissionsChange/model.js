/**
 * 功  能：排放量
 * 创建人：贾安波
 * 创建时间：2020.10.28
 */

import Model from '@/utils/model';
import {
  GetEmissionsTrendList,
  GetEntByRegion,
  GetAttentionDegreeList,
  ExportSewageHistoryList,
  GetEmissionsEntPointPollutant
} from './service';
import moment from 'moment';
import { message } from 'antd';
export default Model.extend({
  namespace: 'emissionsChange',
  state: {
    exloading: false,
    loading: true,
    queryPar: {
      DGIMN:'',
      RegionCode: "",
      EntCode: "",
      ImportantType: "",
      PollutantType: "",
      AttentionCode: "",
      beginTime: moment()
      .subtract(1, 'day')
      .format('YYYY-MM-DD 00:00:00'),
      endTime: moment().format('YYYY-MM-DD 23:59:59'),
      DataType: "",
      DGIMN:'',
      PollutantList:[]
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
    EntList:[],
    PointList:[],
    PollutantList:[],
    parmarType:'RegionCode'
  },
  subscriptions: {},
  effects: {
    *getEmissionsTrendList({ payload }, { call, put, update, select }) {
      //列表

      yield update({ loading:true }); 
      const response = yield call(GetEmissionsTrendList, { ...payload });
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
    *getEmissionsEntPointPollutant({ callback,payload }, { call, put, update, select }) {
      //获取参数列表

      const  parmarType = yield select(_ =>_.emissionsChange.parmarType)
      const  queryPar = yield select(_ =>_.emissionsChange.queryPar)

      const response = yield call(GetEmissionsEntPointPollutant, { ...payload });
      if (response.IsSuccess) {
        if(parmarType==='RegionCode'){
          yield update({ EntList: response.Datas.EntList,PointList:[],PollutantList:[], queryPar:{...queryPar,EntCode:'',DGIMN:'',PollutantCode:''} });
        }
        if(parmarType==='EntCode'){
          yield update({ PointList: response.Datas.PointList,PollutantList:[],queryPar:{...queryPar,DGIMN:'',PollutantCode:''}});
        }
        if( parmarType==='DGIMN'){
          yield update({ PollutantList: response.Datas.PollutantList,queryPar:{...queryPar,PollutantCode:''}});
        }
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
