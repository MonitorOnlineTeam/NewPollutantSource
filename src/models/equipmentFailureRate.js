/**
 * 功  能：设备故障率
 * 创建人：jab
 * 创建时间：2021.2.25
 */
import moment from 'moment';
import * as services from '../services/equipmentFailureRate';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message,Progress } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';


export default Model.extend({
  namespace: 'equipmentFailureRate',
  state: {
    regTableDatas:[],
    regDetailTableDatas:[],
    pointTableDatas:[],
    queryPar:{},
  },
  effects: {
    *regGetFailureRateList({ payload,callback }, { call, put, update }) { //行政区
      const result = yield call(services.regGetFailureRateList, payload);
      if (result.IsSuccess) {
        yield update({
          regTableDatas:result.Datas,
        })
      }else{
        message.error(result.Message)
      }
    },
    *regDetailGetFailureRateList({ payload,callback }, { call, put, update }) { // 行政区详情
      const result = yield call(services.regDetailGetFailureRateList, payload);
      if (result.IsSuccess) {
        yield update({
          regDetailTableDatas:result.Datas,
        })
      }else{
        message.error(result.Message)
      }
    },
    *pointGetFailureRateList({ payload,callback }, { call, put, update }) { // 监测点
      const result = yield call(services.pointGetFailureRateList, payload);
      if (result.IsSuccess) {
        yield update({
          pointTableDatas:result.Datas,
        })
      }else{
        message.error(result.Message)
      }
    }, 

  },
})