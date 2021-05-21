/**
 * 功  能：空气质量状况统计
 * 创建人：贾安波
 * 创建时间：2021.01.07
 */

import Model from '@/utils/model';
import {
  GetEmissionsEntPointPollutant,
  GetRecalculateEffectiveTransmissionEnt
} from './service';
import moment from 'moment';
import { message } from 'antd';

export default Model.extend({
  namespace: 'manualStatistics',
  state: {
    EntList:[],
    PointList:[],
    queryPar:{
    },
    parmarType:'RegionCode'
  },
  subscriptions: {},
  effects: {

    *getEmissionsEntPointPollutant({ callback,payload }, { call, put, update, select }) {
      //获取参数列表

      const  parmarType = yield select(_ =>_.manualStatistics.parmarType)
      const  queryPar = yield select(_ =>_.manualStatistics.queryPar)
      yield update({ pointLoading: true });
      
      const response = yield call(GetEmissionsEntPointPollutant, { ...payload });
      if (response.IsSuccess) {
      
        if(parmarType==='RegionCode'){
          yield update({ EntList: response.Datas.EntList });
          callback(response.Datas.EntList.length>0? response.Datas.EntList[0][0].EntCode :'')
        }
        if(parmarType==='EntCode'){
          yield update({ PointList: response.Datas.PointList});
          // callback(response.Datas.PointList.length>0? response.Datas.PointList[0][0].EntCode :'')
        }
      }
    },

    *getRecalculateEffectiveTransmissionEnt({ callback,payload }, { call, put, update, select }) {
      //手工计算  企业
      yield update({ pointLoading: true });
      
      const response = yield call(GetRecalculateEffectiveTransmissionEnt, { ...payload });
      if (response.IsSuccess) {
         message.success(response.Message)
      }else{
        message.error(response.Message)
      }
    },

  },
});
