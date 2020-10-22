/**
 * 功  能：停运记录
 * 创建人：胡孟弟
 * 创建时间：2020.10.22
 */
import Model from '@/utils/model';
import {GetPointByEntCode,GetStopList} from '../services/StopRecordApi'
import moment from 'moment';
import { message } from 'antd';
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'StopRecordModel',
  state: {
    PointByEntList: [],
    BeginTime: moment().add(-24, 'hour'),
    EndTime: moment(),
    PageSize: 10,
    PageIndex: 1,
    total: 0,
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
            
        }
      
        const result = yield call(GetStopList, payload, null)
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
  },
});
