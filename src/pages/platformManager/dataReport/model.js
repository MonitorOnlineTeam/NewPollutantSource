/**
 * 功  能：数据上报
 * 创建人：贾安波
 * 创建时间：2021.01
 */

import Model from '@/utils/model';
import {
  GetDataReportList,

} from './service';
import moment from 'moment';
import { message } from 'antd';
import { result } from 'lodash';


export default Model.extend({
  namespace: 'newDatareport',
  state: {
    exloading: false,
    loading: true,
    queryPar: {
      BeginTime: moment().subtract(7, 'day').format('YYYY-MM-DD 00:00:00'),
    },
    selectmonth:moment(),
    tableDatas: [],



  },
  subscriptions: {},
  effects: {




    *getDataReportList({ payload }, { call, put, update, select }) {


      //数据上报列表
       yield update({   loading: true}) 
      const response = yield call(GetDataReportList, { ...payload });
      if (response.IsSuccess) {
          yield update({
            tableDatas: response.Datas,
            loading: false,
          })
      }
    },
    


  },
});
