/**
 * 功  能：空气质量状况统计
 * 创建人：贾安波
 * 创建时间：2021.01.07
 */

import Model from '@/utils/model';
import {
  GetEmissionsEntPointPollutant,
  GetRecalculateEffectiveTransmissionEnt,
  // GetAirPoint,
  GetRecalculateEffectiveTransmissionAir,
  GetPointByEntCode
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
    parmarType:'RegionCode',
    airPoint: [],
    airEffectiveVal:'',
    entEffectiveVal:'',
    pointLoading:false,
    entLoading:false,
  },
  subscriptions: {},
  effects: {

    *getEmissionsEntPointPollutant({ callback,payload }, { call, put, update, select }) {
      //获取参数列表

      const  parmarType = yield select(_ =>_.manualStatistics.parmarType)
      const  queryPar = yield select(_ =>_.manualStatistics.queryPar)
      parmarType==='EntCode'? yield update({ pointLoading: true }):yield update({ entLoading: true })
      
      const response = yield call(GetEmissionsEntPointPollutant, { ...payload });
      if (response.IsSuccess) {
      
        if(parmarType==='RegionCode'){
          yield update({ EntList: response.Datas.EntList,PointList:[] });
          yield update({ entLoading: false });
          callback(response.Datas.EntList.length>0? response.Datas.EntList[0][0].EntCode :'')
        }
        if(parmarType==='EntCode'){
          yield update({ pointLoading: false });
          yield update({ PointList: response.Datas.PointList});
          // callback(response.Datas.PointList.length>0? response.Datas.PointList[0][0].EntCode :'')
        }
      }
    },
    *getPointByEntCode({ callback,payload }, { call, put, update, select }) {
      //获取监测点列表

       yield update({ pointLoading: true })
      
      const response = yield call(GetPointByEntCode, { ...payload });
      if (response.IsSuccess) {
          yield update({ pointLoading: false });
          yield update({ PointList: response.Datas});
      }
    },
    
    // *getAirPoint({ payload,callback }, { call, put, update, select }) {
    //   //列表  空气站监测点
    //   const response = yield call(GetAirPoint, { ...payload });
    //   if (response.IsSuccess) {
    //     yield update({
    //       airPoint: response.Datas,
    //     });
    //   }
    // },
    *getRecalculateEffectiveTransmissionEnt({ callback,payload }, { call, put, update, select }) {
      //手工计算  企业
      
      const response = yield call(GetRecalculateEffectiveTransmissionEnt, { ...payload });
      if (response.IsSuccess) {
         message.success(response.Message)
         yield update({ entEffectiveVal:response.Datas});

      }else{
        message.error(response.Message)
        yield update({ entEffectiveVal:''});

      }
    },
    *getRecalculateEffectiveTransmissionAir({ callback,payload }, { call, put, update, select }) {
      //手工计算 空气站
      
      const response = yield call(GetRecalculateEffectiveTransmissionAir, { ...payload });
      if (response.IsSuccess) {
         message.success(response.Message)
        yield update({ airEffectiveVal:response.Datas});
      }else{
        message.error(response.Message)
        yield update({ airEffectiveVal:''});

      }
    },
  },
});
