import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'cruxParSupervisionAnalysis',
  state: {
    tableDatas: [],
    tableLoading:false,
    tableTotal: 0,
    tableDatas2: [],
    tableTotal2: 0,
    tableLoading2:false,
    exportLoading:false,
    exportLoading2:false,
    regQueryPar:{},
    regDetailQueryPar:{},
  },
  effects: {
    *getKeyParameterAnalyseList({ payload, callback }, { call, put, update }) { //关键参数核查分析 列表
      payload.staticType==1 ? yield update({  tableLoading:true }) : yield update({  tableLoading2:true })
      const result = yield call(services.GetKeyParameterAnalyseList, payload);  
      if (result.IsSuccess) {
        if(payload.staticType==1){
          yield update({
            tableTotal: result.Total,
            tableDatas: result.Datas ? result.Datas : [],
            tableLoading:false,
            regQueryPar:payload,
          }) 
        }else{
          yield update({
           tableTotal2: result.Total,
           tableDatas2: result.Datas ? result.Datas : [],
           tableLoading2:false,
           regDetailQueryPar:payload,
        })
      }
        callback(payload)
      } else {
        message.error(result.Message)
        yield update({tableLoading: false,tableLoading2:false, })
      }
    },
    *exportKeyParameterAnalyseList({ payload, callback }, { call, put, update }) { // 关键参数核查分析 导出
      payload.staticType==1? yield update({  exportLoading:true }) : yield update({  exportLoading2:true })
      const result = yield call(services.ExportKeyParameterAnalyseList, payload);
      if (result.IsSuccess) {
        payload.staticType==1? yield update({  exportLoading:false }) : yield update({  exportLoading2:false })
        message.success(result.Message)
        downloadFile(`/upload${result.Datas}`)
      } else {
        yield update({  exportLoading:false, exportLoading2:false  })
        message.error(result.Message)
      }
    },
  },
})