/**
 * 功  能：超标数据查询
 * 创建人：胡孟弟
 * 创建时间：2020.10.14
 */
import Model from '@/utils/model';
import { GetPollutantByType, GetExceedDataList,GetEntByRegion,GetExceedNum,ExportExceedDataList,ExportExceedNum } from '../services/exceedDataApi'
import moment from 'moment';
import { message } from 'antd';
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'exceedDataModel',
  state: {
    PollutantByType: [],
    EntCode: '',
    DataType: '',
    BeginTime: moment().add(-24, 'hour'),
    EndTime: moment(),
    PageSize: 10,
    PageIndex: 1,
    total: 0,
    ModalPageSize:10,
    ModalPageIndex: 1,
    Modaltotal: 0,
    ExceedDataList: [],
    RegionDataList: [],
    EntCountList: [],
    priseList: [],
    ExceedNumList:[]
    
  },
  subscriptions: {},
  effects: {
    *GetPollutantByType({ payload }, { call, put, update, select }) {
      const body = {
        type: payload.type
      }
      const result = yield call(GetPollutantByType, body, null)
      if (result.IsSuccess) {
        yield update({
          PollutantByType: result.Datas
        })
      }
      else {
        yield update({
          PollutantByType: []
        })
      }
    },
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
    *GetExceedNum({ payload }, { call, put, update, select }) {
      const body = {
        RegionCode: payload.RegionCode,
        AttentionCode: payload.AttentionCode,
        PollutantTypeCode: payload.PollutantTypeCode,
        DataType: payload.DataType,
        BeginTime: payload.BeginTime,
        EndTime: payload.EndTime,
        TabType: payload.TabType,
        PollutantList: payload.PollutantList,
        PageIndex: payload.PageIndex,
        PageSize: payload.PageSize,
        EntCode:payload.EntCode
      }
      const result = yield call(GetExceedNum, body, null)
      if (result.IsSuccess) {
        yield update({
          ExceedNumList: result.Datas,
          Modaltotal: result.Total,
          ModalPageIndex: payload.PageIndex || 1
        })
      }
      else {
        yield update({
          ExceedNumList: [],
          Modaltotal: 0,
          ModalPageIndex: payload.PageIndex || 1
        })
      }
    },//超标数据列表
    *GetExceedDataList({ payload }, { call, put, update, select }) {

      const body = {
        RegionCode: payload.RegionCode,
        AttentionCode: payload.AttentionCode,
        PollutantTypeCode: payload.PollutantTypeCode,
        DataType: payload.DataType,
        BeginTime: payload.BeginTime,
        EndTime: payload.EndTime,
        TabType: payload.TabType,
        PollutantList: payload.PollutantList,
        PageIndex: payload.PageIndex,
        PageSize: payload.PageSize
      }
      const result = yield call(GetExceedDataList, body, null)
      if (result.IsSuccess) {
        if (payload.TabType == '1' || payload.TabType == '2') {

          yield update({
            ExceedDataList: result.Datas,
            total: result.Total,
            PageIndex: payload.PageIndex || 1
          })
        }
        else {
          yield update({
            RegionDataList: result.Datas,
            total: result.Total,
            PageIndex: payload.PageIndex || 1
          })
        }

      }
      else {
        yield update({
          ExceedDataList: [],
          total: 0,
          PageIndex: payload.PageIndex || 1
        })
      }
    },//弹框企业超标数据
    *GetMoalExceedDataList({ payload }, { call, put, update, select }) {

      const body = {
        RegionCode: payload.RegionCode,
        AttentionCode: payload.AttentionCode,
        PollutantTypeCode: payload.PollutantTypeCode,
        DataType: payload.DataType,
        BeginTime: payload.BeginTime,
        EndTime: payload.EndTime,
        TabType: payload.TabType,
        PollutantList: payload.PollutantList,
        PageIndex: payload.PageIndex,
        PageSize: payload.PageSize,
        EntCode:payload.EntCode
      }
      const result = yield call(GetExceedDataList, body, null)
      if (result.IsSuccess) {
        yield update({
          EntCountList: result.Datas,
          Modaltotal: result.Total,
          ModalPageIndex: payload.PageIndex || 1
        })
      }
      else {
        yield update({
          EntCountList: [],
          Modaltotal: 0,
          ModalPageIndex: payload.PageIndex || 1
        })
      }
    },//导出超标数据列表
    *ExportExceedDataList({ payload }, { call, put, update, select }) {

      const body = {
        RegionCode: payload.RegionCode,
        AttentionCode: payload.AttentionCode,
        PollutantTypeCode: payload.PollutantTypeCode,
        DataType: payload.DataType,
        BeginTime: payload.BeginTime,
        EndTime: payload.EndTime,
        TabType: payload.TabType,
        PollutantList: payload.PollutantList,
      }
      const result = yield call(ExportExceedDataList, body, null)
      if (result.IsSuccess) {
        if (payload.TabType == '1' || payload.TabType == '2') {

          downloadFile(`/upload${result.Datas}`)
        }
        else {
          downloadFile(`/upload${result.Datas}`)
        }

      }
    },//导出超标次数
    *ExportExceedNum({ payload }, { call, put, update, select }) {
      const body = {
        RegionCode: payload.RegionCode,
        AttentionCode: payload.AttentionCode,
        PollutantTypeCode: payload.PollutantTypeCode,
        DataType: payload.DataType,
        BeginTime: payload.BeginTime,
        EndTime: payload.EndTime,
        TabType: payload.TabType,
        PollutantList: payload.PollutantList,
        EntCode:payload.EntCode
      }
      const result = yield call(ExportExceedNum, body, null)
      if (result.IsSuccess) {
        downloadFile(`/upload${result.Datas}`)
      }
    }

  },
});
