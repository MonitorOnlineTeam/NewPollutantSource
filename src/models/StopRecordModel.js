/**
 * 功  能：停运记录
 * 创建人：胡孟弟
 * 创建时间：2020.10.22
 */
import Model from '@/utils/model';
import {GetPointByEntCode,GetStopList,ExportStopList} from '../services/StopRecordApi'
import moment from 'moment';
import { message } from 'antd';
import { downloadFile } from '@/utils/utils';
import { fileUpload } from '@/services/autoformapi';

export default Model.extend({
  namespace: 'StopRecordModel',
  state: {
    PointByEntList: [],
    BeginTime: moment().add(-24, 'hour'),
    EndTime: moment(),
    PageSize: 10,
    PageIndex: 1,
    total: 0,
    StopList:[]
  },
  subscriptions: {},
  effects: {
    *GetPointByEntCode({ payload }, { call, put, update, select }) {
      
        const result = yield call(GetPointByEntCode, payload, null)
        if (result.IsSuccess) {
          yield update({
            PointByEntList: result.Datas
          })
        }
        else {
          yield update({
            PointByEntList: []
          })
        }
      },
    *GetStopList({ payload }, { call, put, update, select }) {

        const body = {
          BeginTime: payload.BeginTime,
          BeginTimeEnd: payload.BeginTimeEnd,
          EndTime: payload.EndTime,
          EndTimeEnd: payload.EndTimeEnd,
          RegionCode: payload.RegionCode,
          EntCode: payload.EntCode,
          DGIMN: payload.DGIMN,
          Status: payload.Status,
          PageSize: payload.PageSize,
          PageIndex: payload.PageIndex,
        }
        console.log(body)
        const result = yield call(GetStopList, body, null)
        console.log(result)
        if (result.IsSuccess) {
          yield update({
            StopList: result.Datas,
            total:result.Total,
            PageIndex:payload.PageIndex || 1
          })
        }
        else {
          yield update({
            StopList: [],
            total:0,
            PageIndex:payload.PageIndex || 1
          })
        }
      },
    *ExportStopList({ payload }, { call, put, update, select }) {

      const body = {
        BeginTime: payload.BeginTime,
        BeginTimeEnd: payload.BeginTimeEnd,
        EndTime: payload.EndTime,
        EndTimeEnd: payload.EndTimeEnd,
        RegionCode: payload.RegionCode,
        EntCode: payload.EntCode,
        DGIMN: payload.DGIMN,
        Status: payload.Status,
      }
      const result = yield call(ExportStopList, body, null)
      if (result.IsSuccess) {
        downloadFile(`/upload${result.Datas}`)
      }
    },
  },
});
