/**
 * 功  能：超标数据报警处置记录查询
 * 创建人：胡孟弟
 * 创建时间：2020.10.20
 */
import Model from '@/utils/model';
import {GetEntByRegion,GetAlarmManagementRate,GetAlarmManagementRateDetail,GetAlarmManagementDetail,GetPollutantCodeList,GetAlarmDealType,
  ExportAlarmManagementRate,
  ExportAlarmManagementRateDetail,
  ExportAlarmManagementDetail
} from '../services/exceedDataDispositionRecordApi'
import moment from 'moment';
import { message } from 'antd';
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'exceedDataDispositionModel',
  state: {
    priseList: [],
    BeginTime: moment().add(-24, 'hour'),
    EndTime: moment(),
    PageSize: 10,
    PageIndex: 1,
    total: 0,
    AlarmList:[],
    column:[],
    AlarmDetailList:[],
    ManagementDetail:[],
    pollutantCodeList:[],
    AlarmDealTypeList:[]
  },
  subscriptions: {},
  effects: {
    *GetEntByRegion({ payload }, { call, put, update, select }) {
      
        const result = yield call(GetEntByRegion, payload, null)
        if (result.IsSuccess) {
          yield update({
            priseList: result.Datas
          })
        }
        else {
          yield update({
            priseList: []
          })
        }
      },//超标报警处置
    *GetAlarmManagementRate({ payload }, { call, put, update, select }){

        const body = {
            RegionCode: payload.RegionCode,
            attentionCode: payload.attentionCode,
            PollutantType: payload.PollutantType,
            DataType: payload.DataType,
            BeginTime: payload.BeginTime,
            EndTime: payload.EndTime,
            PageSize: payload.PageSize,
            PageIndex: payload.PageIndex,
            PollutantCodeList: payload.PollutantCodeList,
        }
      const result = yield call(GetAlarmManagementRate,body,null)
      if(result.IsSuccess)
      {
          yield update({
            AlarmList:result.Datas.data,
            column:result.Datas.column,
          })
      }
      else{
        yield update({
            AlarmList:[],
            column:[],
          })
      }
    },//超标报警处置详情
      *GetAlarmManagementRateDetail({ payload }, { call, put, update, select }) {

          const body = {
              RegionCode: payload.RegionCode,
              attentionCode: payload.attentionCode,
              PollutantType: payload.PollutantType,
              DataType: payload.DataType,
              BeginTime: payload.BeginTime,
              EndTime: payload.EndTime,
              PageSize: payload.PageSize,
              PageIndex: payload.PageIndex,
              PollutantCodeList: payload.PollutantCodeList,
          }
          const result = yield call(GetAlarmManagementRateDetail, body, null)
          if (result.IsSuccess) {
              yield update({
                  AlarmDetailList: result.Datas.data,
                  column: result.Datas.column,
                  total:result.Total,
                  PageIndex:payload.PageIndex || 1
              })
          }
          else {
              yield update({
                  AlarmDetailList: [],
                  column: [],
                  total:0,
                  PageIndex:payload.PageIndex || 1
              })
          }
      },//超标报警处置详细
    *GetAlarmManagementDetail({ payload }, { call, put, update, select }){
        const body = {
            RegionCode: payload.RegionCode,
            attentionCode: payload.attentionCode,
            PollutantType: payload.PollutantType,
            DataType: payload.DataType,
            BeginTime: payload.BeginTime,
            EndTime: payload.EndTime,
            //PageSize: payload.PageSize,
            //PageIndex: payload.PageIndex,
            PollutantCode: payload.PollutantCode,
            Status:payload.Status,
            EntCode:payload.EntCode,
            PollutantCodeList:payload.PollutantCodeList,
        }
        const result = yield call(GetAlarmManagementDetail, body, null)
        if (result.IsSuccess) {
            yield update({
                ManagementDetail: result.Datas,
                //column: result.Datas.column,
            })
        }
        else {
            yield update({
                ManagementDetail: [],
                //column: [],
            })
        }
      },
      //监测因子列表
    *GetPollutantCodeList({ payload }, { call, put, update, select }){
        const body = {
            PollutantType: payload.PollutantType,
        }
        const result = yield call(GetPollutantCodeList, body, null)
        if (result.IsSuccess) {
            yield update({
                pollutantCodeList: result.Datas,
            })
        }
        else {
            yield update({
                pollutantCodeList: [],
            })
        }
      },
       //处置结果
    *GetAlarmDealType({ payload }, { call, put, update, select }){
        const body = {
            PollutantType: payload.PollutantType,
        }
        const result = yield call(GetAlarmDealType, body, null)
        if (result.IsSuccess) {
            yield update({
                AlarmDealTypeList: result.Datas,
            })
        }
        else {
            yield update({
                AlarmDealTypeList: [],
            })
        }
      },
    //导出超标报警处置
    *ExportAlarmManagementRate({ payload }, { call, put, update, select }){

      const body = {
          RegionCode: payload.RegionCode,
          attentionCode: payload.attentionCode,
          PollutantType: payload.PollutantType,
          DataType: payload.DataType,
          BeginTime: payload.BeginTime,
          EndTime: payload.EndTime,
          PollutantCodeList: payload.PollutantCodeList,
      }
    const result = yield call(ExportAlarmManagementRate,body,null)
    if(result.IsSuccess)
    {
      downloadFile(result.Datas)
    }
  },//导出超标报警处置详情
    *ExportAlarmManagementRateDetail({ payload }, { call, put, update, select }) {

        const body = {
            RegionCode: payload.RegionCode,
            attentionCode: payload.attentionCode,
            PollutantType: payload.PollutantType,
            DataType: payload.DataType,
            BeginTime: payload.BeginTime,
            EndTime: payload.EndTime,
            PollutantCodeList: payload.PollutantCodeList,
        }
        const result = yield call(ExportAlarmManagementRateDetail, body, null)
        if (result.IsSuccess) {
          downloadFile(result.Datas)
        }
    },//导出超标报警处置详细
  *ExportAlarmManagementDetail({ payload }, { call, put, update, select }){
      const body = {
          RegionCode: payload.RegionCode,
          attentionCode: payload.attentionCode,
          PollutantType: payload.PollutantType,
          DataType: payload.DataType,
          BeginTime: payload.BeginTime,
          EndTime: payload.EndTime,
          PollutantCode: payload.PollutantCode,
          Status:payload.Status,
          EntCode:payload.EntCode,
          PollutantCodeList:payload.PollutantCodeList,
      }
      const result = yield call(ExportAlarmManagementDetail, body, null)
      if (result.IsSuccess) {
        downloadFile(result.Datas)
      }
    },
  },
});
