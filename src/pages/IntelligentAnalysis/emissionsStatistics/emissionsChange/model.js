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
      EntCode:'',
      DGIMN:'',
      PollutantList:[],
      PollutantType: "1",
      AttentionCode: "",
      beginTime: moment().subtract(1, 'day') .format('YYYY-MM-DD HH:00:00'),
      endTime: moment().format('YYYY-MM-DD HH:59:59'),
      DataType: "HourData",
      
    },
    conditionQueryPar:{

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
    parmarType:'RegionCode',
    column:[],
    timeList:[],
    pointLoading:''
  },
  subscriptions: {},
  effects: {
    *getEmissionsTrendList({ payload }, { call, put, update, select }) {
      //列表
      yield update({ loading:true }); 
      const response = yield call(GetEmissionsTrendList, { ...payload });
      if (response.IsSuccess) {
        yield update({
          tableDatas: response.Datas.data,
          column:response.Datas.chart,
          timeList:response.Datas.times,
          loading:false
        });
      }else{
        message.warning(response.Message);
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
      yield update({ pointLoading: true });
      
      const response = yield call(GetEmissionsEntPointPollutant, { ...payload });
      if (response.IsSuccess) {
        if(parmarType==='RegionCode'){
          yield update({ pointLoading: false,EntList: response.Datas.EntList, queryPar:{...queryPar,EntCode:response.Datas.EntList.length>0?response.Datas.EntList[0][0].EntCode:"",DGIMN:'',PollutantList:[]} });
          callback(response.Datas.EntList.length>0? response.Datas.EntList[0][0].EntCode :'')
        }
        if(parmarType==='EntCode'){
          yield update({pointLoading: false, PointList: response.Datas.PointList,PollutantList:[],queryPar:{...queryPar,DGIMN:response.Datas.PointList.length>0?response.Datas.PointList[0][0].DGIMN:"",PollutantList:[]}});
           callback(response.Datas.PointList.length>0?response.Datas.PointList[0][0].DGIMN :'')

        }
        if( parmarType==='DGIMN'){
          if (response.Datas.PollutantList.length > 0) {
            const selecePoll =  response.Datas.PollutantList.map(item=>{
              return item.PollutantCode
            })
            yield update({pointLoading: false, PollutantList: response.Datas.PollutantList,queryPar:{...queryPar,PollutantList:selecePoll}});
            callback(response.Datas.PollutantList)

          }
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
