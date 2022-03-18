import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'remoteSupervision',
  state: {
    tableTotal:1,
    entList:[],
    addDataConsistencyData:[
      {par:'so2',}, {par:'so3',}, {par:'so4',}, {par:'so5',}, {par:'NOx',}, {par:'so7',}, {par:'so8',}, {par:'so9',},
      {par:'so9',}, {par:'so10',}, {par:'颗粒物',isDisplay:1}, {par:'颗粒物',isDisplay:2}, {par:'so13',}, {par:'so14',}, {par:'so15',}, {par:'流速',isDisplay:3},
      {par:'流速',isDisplay:4}, {par:'标杆流量',}, {par:'so19',},
    ],
    addRealTimeConsistencyData:[
      {par:'so2',}, {par:'NO',}, {par:'NO2',}, {par:'NOx',}, {par:'so6',}, {par:'so7',}, {par:'so8',}, {par:'so9',},
      {par:'so9',}, {par:'so10',}, {par:'颗粒物',type:'原始浓度'}, {par:'颗粒物',type:'标杆浓度'}, {par:'so13',}, {par:'so14',}, {par:'so15',}, {par:'流速'},
      {par:'标杆流量'}, {par:'so18',}, {par:'so19',},
    ],
    addParconsistencyData:[
      {par:'so2',}, {par:'so3',}, {par:'so4',}, {par:'so5',}, {par:'so6',}, {par:'so7',}, {par:'so8',}, {par:'so9',},
      {par:'so9',}, {par:'so10',}, {par:'so11',isDisplay:1}, {par:'so11',isDisplay:2}, {par:'so13',}, {par:'so14',}, {par:'so15',}, {par:'so16',isDisplay:3},
      {par:'so16',isDisplay:4}, {par:'so18',}, {par:'so19',},
    ],
  },
  effects: {
   //列表
    *getFaultFeedbackList({   payload, }, { call, update, select, put }) {
      const result = yield call(services.GetFaultFeedbackList, { ... payload });
      if (result.IsSuccess) {
        yield update({faultFeedbackList: result.Datas,tableTotal:result.Total });
      } else {
        message.error(result.Message)
      }
    },
   //编辑
   *updateFaultFeedbackIsSolve({   payload,callback }, { call, update, select, put }) {
    const result = yield call(services.UpdateFaultFeedbackIsSolve, { ... payload });
    if (result.IsSuccess) {
      message.success(result.Message)
      callback()
    } else {
      message.error(result.Message)
    }
  },

    // 根据企业获取排口
    *getPointByEntCode({ payload,callback}, { call, update }) {
      const result = yield call(services.getPointByEntCode, payload);
      if (result.IsSuccess) {
         callback(result.Datas)
      }
    },

  }
  
})