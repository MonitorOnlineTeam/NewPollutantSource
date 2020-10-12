/**
 * 功  能：污染物流量分析
 * 创建人：胡孟弟
 * 创建时间：2020.10.10
 */
import Model from '@/utils/model';
import {
  GetEntByRegion,
} from '../pages/IntelligentAnalysis/newTransmissionefficiency/service';
import {GetSewageFlowList ,ExportSewageFlowList} from '../services/FlowAnalysisApi'
import moment from 'moment';
import { message } from 'antd';

export default Model.extend({
  namespace: 'flowanalysisModel',
  state: {
    priseList: [],
    columns:[],
    FlowList:[],
    EntCode:'',
    DataType:'',
    BeginTime:moment().add(-24,'hour'),
    EndTime:moment()
  },
  subscriptions: {},
  effects: {
    *GetSewageFlowList({payload},{call, put, update, select}){

        const body ={
            EntCode: payload.EntCode,
            //EntCode: '00557cc5-53d5-4bd2-81d5-1b81deba7018',
            DataType: payload.DataType,
            BeginTime: payload.BeginTime,
            EndTime: payload.EndTime,
        }
        console.log(body)
        const result = yield call(GetSewageFlowList,body,null)
        console.log(result)
        if(result.IsSuccess)
        {
            yield update({
                FlowList:result.Datas
            })
        }

    },
    *ExportSewageFlowList({payload},{call, put, update, select}){
        const body ={
            //EntCode: payload.EntCode,
            EntCode: '00557cc5-53d5-4bd2-81d5-1b81deba7018',
            DataType: payload.DataType,
            BeginTime: payload.BeginTime,
            EndTime: payload.EndTime,
        }
        console.log(body)
        const result = yield call(ExportSewageFlowList,body,null)
        console.log(result)
        if(result.IsSuccess)
        {
            window.open('/upload/'+result.Datas);
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
