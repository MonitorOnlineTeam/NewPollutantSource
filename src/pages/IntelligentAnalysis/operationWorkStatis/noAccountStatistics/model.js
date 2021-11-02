/**
 * 功  能：企业异常记录
 * 创建人：贾安波
 * 创建时间：2020.10.29
 */

import Model from '@/utils/model';
import {
  GetTaskFormBookSta,
  // GetEntByRegion,
  GetAttentionDegreeList,
  ExportTaskFormBookSta,
} from './service';
import moment from 'moment';
import { message } from 'antd';
export default Model.extend({
  namespace: 'noAccountStatistics',
  state: {
    exloading: false,
    loading: true,
    queryPar: {
      beginTime: moment() .subtract(1, 'month') .format('YYYY-MM-DD 00:00:00'),
      endTime: moment().format('YYYY-MM-DD 23:59:59'),
      AttentionCode: '',
      EntCode: '',
      RegionCode: '',
      PollutantTypeCode:'1',
      ModelType: "All"
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
    *getTaskFormBookSta({callback, payload }, { call, put, update, select }) {
      //无台账工单统计（企业） 列表


      payload.ModelType==='All'? yield update({ loading:true })   : payload.ModelType==='Region'? yield update({ Regionloading:true }) :  payload.ModelType==='EntNum'?  yield update({ EntNumloading:true }) : payload.ModelType==='EntName'?  yield update({ EntNameloading:true }) :  yield update({ TaskNumsloading:true })

       const response = yield call(GetTaskFormBookSta, { ...payload });
      if (response.IsSuccess) {
        if(payload.ModelType==='All'){
          yield update({
            tableDatas:response.Datas,
            loading:false  
          });
        }else{
          payload.ModelType==='Region'? yield update({ Regionloading:false }) :  payload.ModelType==='EntNum'?  yield update({ EntNumloading:false }) : payload.ModelType==='EntName'?  yield update({ EntNameloading:false }) :  yield update({ TaskNumsloading:false })
        }
        callback(response.Datas)
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
    // *getEntByRegion({ callback,payload }, { call, put, update, select }) {
    //   const { queryPar }  = yield select(state => state.removalFlowRate);
    //   //获取所有污水处理厂
    //   const response = yield call(GetEntByRegion, { ...payload });
    //   if (response.IsSuccess) {
    //     yield update({
    //       priseList: response.Datas,
    //     });
    //     callback(response.Datas[0].EntCode)
    //   }
    // },
    *exportTaskFormBookSta({callback, payload }, { call, put, update, select }) {
      yield update({ exloading: true });
      //导出
      const response = yield call(ExportTaskFormBookSta, { ...payload });
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
