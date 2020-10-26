/**
 * 功  能：废水报表
 * 创建人：胡孟弟
 * 创建时间：2020.10.21
 */
import Model from '@/utils/model';
import {GetEntByRegionAndAtt,GetPointByEntCode,GetAllTypeDataListWater,ExportAllTypeDataListWater} from '../services/wasteWaterReportApi'
import moment from 'moment';
import { message } from 'antd';
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'wasteWaterReportModel',
  state: {
    BeginTime: moment().add(-24, 'hour'),
    EndTime: moment(),
    PageSize: 10,
    PageIndex: 1,
    total: 0,
    EntByRegionAndAttList:[],
    PointByEntCodeList:[],
    AllTypeDataListWaterList:[]
  },
  subscriptions: {},
  effects: {
      *GetEntByRegionAndAtt({ payload }, { call, put, update, select }) {

        const body = {
          RegionCode:payload.RegionCode,
          Attention:payload.Attention,
        }
      
        const result = yield call(GetEntByRegionAndAtt, body, null)
        if (result.IsSuccess) {
          yield update({
            EntByRegionAndAttList: result.Datas
          })
        }
        else {
          yield update({
            EntByRegionAndAttList: []
          })
        }
      },
      *GetPointByEntCode({ payload }, { call, put, update, select }) {

        console.log(payload)
        const result = yield call(GetPointByEntCode, payload, null)
        console.log(result)
        if (result.IsSuccess) {
          yield update({
            PointByEntCodeList: result.Datas
          })
        }
        else {
          yield update({
            PointByEntCodeList: []
          })
        }
      },
      *GetAllTypeDataListWater({ payload }, { call, put, update, select }) {
        const body ={
          BeginTime:payload.BeginTime,
          EndTime:payload.EndTime,
          DGIMN:payload.DGIMN,
          dataType:payload.dataType,
          time:payload.time
        }
        const result = yield call(GetAllTypeDataListWater, body, null)
        if (result.IsSuccess) {
          yield update({
            AllTypeDataListWaterList: result.Datas
          })
        }
        else {
          yield update({
            AllTypeDataListWaterList: []
          })
        }
      },
      *ExportAllTypeDataListWater({ payload }, { call, put, update, select }) {
        const body ={
          BeginTime:payload.BeginTime,
          EndTime:payload.EndTime,
          DGIMN:payload.DGIMN,
          dataType:payload.dataType,
          time:payload.time
        }
        const result = yield call(ExportAllTypeDataListWater, body, null)
        if (result.IsSuccess) {
          downloadFile(`/upload${result.Datas}`)
        }
      },
  },
});
