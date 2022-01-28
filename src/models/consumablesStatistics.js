import moment from 'moment';
import * as services from '../services/consumablesStatistics';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'consumablesStatistics',
  state: {
    regTableDatas:[],
    regDetailTableDatas:[],
    pointTableDatas:[],
    queryPar:{}
  },
  effects: {
    *regGetConsumablesRIHList({ payload,callback }, { call, put, update }) { //耗材统计 行政区
      const result = yield call(services.regGetConsumablesRIHList, payload);
      if (result.IsSuccess) {
        yield update({
          regTableDatas:result.Datas,
        })
      }else{
        message.error(result.Message)
        yield update({ tableLoading:false})
      }
    },
    *regDetailGetConsumablesRIHList({ payload,callback }, { call, put, update }) { //耗材统计 行政区详情
      const result = yield call(services.regDetailGetConsumablesRIHList, payload);
      if (result.IsSuccess) {
        yield update({
          regDetailTableDatas:result.Datas,
        })
      }else{
        message.error(result.Message)
        yield update({ tableLoading:false})
      }
    },
    *pointGetConsumablesRIHList({ payload,callback }, { call, put, update }) { //耗材统计 监测点
      const result = yield call(services.pointGetConsumablesRIHList, payload);
      if (result.IsSuccess) {
        yield update({
          pointTableDatas:result.Datas,
        })
      }else{
        message.error(result.Message)
        yield update({ tableLoading:false})
      }
    },  
    
    // *workEntExportTaskWorkList({ payload,callback }, { call, put, update }) { //企业工单数 导出
    //   const result = yield call(services.workEntExportTaskWorkList, payload);
    //   if (result.IsSuccess) {
    //     message.success('下载成功');
    //       downloadFile(`/upload${result.Datas}`);
    //      } else {
    //     message.warning(result.Message);
    //   }
    // }, 
  },
})