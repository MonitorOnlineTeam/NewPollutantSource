/**
 * 功  能：污染物流量分析
 * 创建人：胡孟弟
 * 创建时间：2020.10.10
 */
import Model from '@/utils/model';
// import {
//   GetEntByRegion,
// } from '../pages/IntelligentAnalysis/newTransmissionefficiency/service';
// import { GetSewageFlowList, ExportSewageFlowList } from '../services/FlowAnalysisApi'
import {GetSewageFlowList ,ExportSewageFlowList,GetEntByRegion} from '../services/FlowAnalysisApi'
import moment from 'moment';
import { message } from 'antd';
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'flowanalysisModel',
  state: {
    priseList: [],
    columns: [],
    FlowList: [],
    FlowListArr:[],
    EntCode: '',
    DataType: '',
    BeginTime: moment().add(-24, 'hour'),
    EndTime: moment(),
    PageSize: 10,
    PageIndex: 1,
    total: 0,
  },
  subscriptions: {},
  effects: {
    *GetSewageFlowList({ payload }, { call, put, update, select }) {

      const body = {
        EntCode: payload.EntCode,
        DataType: payload.DataType,
        BeginTime: payload.BeginTime,
        EndTime: payload.EndTime,
        PageSize: payload.PageSize,
        PageIndex: payload.PageIndex,
      }
      const result = yield call(GetSewageFlowList, body, null)

      const body2 = {
        EntCode: payload.EntCode,
        DataType: payload.DataType,
        BeginTime: payload.BeginTime,
        EndTime: payload.EndTime,
      }
      const result2 = yield call(GetSewageFlowList, body2, null)

      if(result2.IsSuccess)
      {
        yield update({
          FlowListArr:result2.Datas
        })
      }
      else{
        yield update({
          FlowListArr:[]
        })
      }


      if (result.IsSuccess) {
        yield update({
          FlowList: result.Datas,
          total: result.Total,
          PageIndex: payload.PageIndex || 1,
        })
      }
      else {
        yield update({
          FlowList: [],
          total: 0,
          PageIndex: payload.PageIndex || 1,
        })
      }
    },
    *ExportSewageFlowList({ payload }, { call, put, update, select }) {
      const body = {
        EntCode: payload.EntCode,
        DataType: payload.DataType,
        BeginTime: payload.BeginTime,
        EndTime: payload.EndTime,
      }
      const result = yield call(ExportSewageFlowList, body, null)
      if (result.IsSuccess) {
        downloadFile(`/upload${result.Datas}`)
      }
    },
    *getEntByRegion({ payload }, { call, put, update, select }) {
      //获取企业列表
      const response = yield call(GetEntByRegion, { ...payload });

      if (response.IsSuccess) {
        yield update({
          priseList: response.Datas,
        });
      }
    },


  },
});
