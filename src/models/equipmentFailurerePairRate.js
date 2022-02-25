/**
 * 功  能：设备故障修复率
 * 创建人：jab
 * 创建时间：2021.2.25
 */
import moment from 'moment';
import * as services from '../services/equipmentFailurerePairRate';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message,Progress } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';


export default Model.extend({
  namespace: 'equipmentFailurerePairRate',
  state: {
    regTableDatas:[],
    regDetailTableDatas:[],
    pointTableDatas:[],
    queryPar:{},
  },
  effects: {
    *regGetRepairRateList({ payload,callback }, { call, put, update }) { //行政区
      const result = yield call(services.regGetRepairRateList, payload);
      if (result.IsSuccess) {
        yield update({
          regTableDatas:result.Datas,
        })
      }else{
        message.error(result.Message)
      }
    },
    *regDetailGetRepairRateList({ payload,callback }, { call, put, update }) { // 行政区详情
      const result = yield call(services.regDetailGetRepairRateList, payload);
      if (result.IsSuccess) {
        yield update({
          regDetailTableDatas:result.Datas,
        })
      }else{
        message.error(result.Message)
      }
    },
    *pointGetRepairRateList({ payload,callback }, { call, put, update }) { // 监测点
      const result = yield call(services.pointGetRepairRateList, payload);
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