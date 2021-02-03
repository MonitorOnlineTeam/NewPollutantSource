/**
 * 功  能：超标数据报警核实记录查询
 * 创建人：胡孟弟
 * 创建时间：2020.10.20
 */
import Model from '@/utils/model';
import {GetEntByRegion,GetAlarmVerifyRate,GetAlarmVerifyRateDetail,GetAlarmVerifyDetail,GetOverToExamineOperation,GetPollutantCodeList,
  ExportAlarmVerifyRate,
  ExportAlarmVerifyRateDetail,
  ExportAlarmVerifyDetail
} from '../services/exceedDataAlarmApi'
import moment from 'moment';
import { message } from 'antd';
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'exceedDataAlarmModel',
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
      },
    //超标报警核实
    *GetAlarmVerifyRate({ payload }, { call, put, update, select }){

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
    const result = yield call(GetAlarmVerifyRate,body,null)
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
  },//超标报警核实详情
    *GetAlarmVerifyRateDetail({ payload }, { call, put, update, select }) {

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
        const result = yield call(GetAlarmVerifyRateDetail, body, null)
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
    },//超标报警核实详细
  *GetAlarmVerifyDetail({ payload }, { call, put, update, select }){
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
          VerifyStatus:payload.VerifyStatus,
          DGIMN:payload.DGIMN
      }
      const result = yield call(GetAlarmVerifyDetail, body, null)
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
     //核实结果
  *GetOverToExamineOperation({ payload }, { call, put, update, select }){
      const body = {
          PollutantType: payload.PollutantType,
      }
      const result = yield call(GetOverToExamineOperation, null, null)
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
    //超标报警核实
    *ExportAlarmVerifyRate({ payload }, { call, put, update, select }){

      const body = {
          RegionCode: payload.RegionCode,
          attentionCode: payload.attentionCode,
          PollutantType: payload.PollutantType,
          DataType: payload.DataType,
          BeginTime: payload.BeginTime,
          EndTime: payload.EndTime,
          PollutantCodeList: payload.PollutantCodeList,
      }
    const result = yield call(ExportAlarmVerifyRate,body,null)
    if(result.IsSuccess)
    {
      downloadFile(`/upload${result.Datas}`)
    }
  },//超标报警核实详情
    *ExportAlarmVerifyRateDetail({ payload }, { call, put, update, select }) {

        const body = {
            RegionCode: payload.RegionCode,
            attentionCode: payload.attentionCode,
            PollutantType: payload.PollutantType,
            DataType: payload.DataType,
            BeginTime: payload.BeginTime,
            EndTime: payload.EndTime,
            PollutantCodeList: payload.PollutantCodeList,
        }
        const result = yield call(ExportAlarmVerifyRateDetail, body, null)
        if (result.IsSuccess) {
          downloadFile(`/upload${result.Datas}`)
        }
    },//超标报警核实详细
  *ExportAlarmVerifyDetail({ payload }, { call, put, update, select }){
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
          VerifyStatus:payload.VerifyStatus,
      }
      const result = yield call(ExportAlarmVerifyDetail, body, null)
      if (result.IsSuccess) {
        downloadFile(`/upload${result.Datas}`)
      }
    },
  },
});
