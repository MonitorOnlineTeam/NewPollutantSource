/**
 * 功  能：废水报表
 * 创建人：胡孟弟
 * 创建时间：2020.10.21
 */
import Model from '@/utils/model';
import {GetEntByRegionAndAtt,GetPointByEntCode} from '../services/wasteWaterReportApi'
import moment from 'moment';
import { message } from 'antd';
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'wasteWaterReportModel',
  state: {
    priseList: [],
    BeginTime: moment().add(-24, 'hour'),
    EndTime: moment(),
    PageSize: 10,
    PageIndex: 1,
    total: 0,
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
  },
});
