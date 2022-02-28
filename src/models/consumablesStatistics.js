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
    summaryTableDatas:[],
    detailedTableDatas:[],
    summaryTableTotal:null,
    detailedTableTotal:null,
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
      }
    }, 
    *summaryGetConsumablesRIHList({ payload,callback }, { call, put, update }) { //耗材统计 备品备件 汇总
      const result = yield call(services.summaryGetConsumablesRIHList, payload);
      if (result.IsSuccess) {
        yield update({
          summaryTableDatas:result.Datas,
          summaryTableTotal:result.Total,
        })
      }else{
        message.error(result.Message)
      }
    },   
    *detailedGetConsumablesRIHList({ payload,callback }, { call, put, update }) { //耗材统计 备品备件 明细
      const result = yield call(services.detailedGetConsumablesRIHList, payload);
      if (result.IsSuccess) {
        yield update({
          detailedTableDatas:result.Datas,
          detailedTableTotal:result.Total,
        })
      }else{
        message.error(result.Message)
      }
    },   
    *exportConsumablesRIHList({ payload,callback }, { call, put, update }) { //行政区 导出
      // yield update(payload.pointType==1?{exportloading: true}:{exportloading: true} )
      const result = yield call(services.exportConsumablesRIHList, payload);
       if (result.IsSuccess) {
           message.success('下载成功');
           downloadFile(`/upload${result.Datas}`);
          } else {
         message.warning(result.Message);
       }
    },
  },
})