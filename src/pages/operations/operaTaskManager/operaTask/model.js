import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'operaTask',
  state: {
    tableDatas: [],
    parametersList: [],
    tableLoading: false,
    tableTotal: 0,
    monitoringTypeList: [],
    manufacturerList: [],
    maxNum: null,
    systemModelNameList: [],
  },
  effects: {
    *bWWebService({ payload, callback }, { call, put, update }) {
      payload.functionName=='M_GetALLOperationTask'?  yield update({ tableLoading: true }) : null;
      const result = yield call(services.BWWebService, payload);
      switch(payload.functionName){
        case 'M_GetALLOperationTask' :  //运维任务列表
         if (result.IsSuccess) {
          yield update({ 
             tableTotal: result.Total, 
             tableDatas: result.Datas['soap:Envelope']['soap:Body']['M_GetALLOperationTaskResponse']['M_GetALLOperationTaskResult']['Items']['Item'] ?  result.Datas['soap:Envelope']['soap:Body']['M_GetALLOperationTaskResponse']['M_GetALLOperationTaskResult']['Items']['Item'] : [],
             tableLoading: false,
            })
        } else {
          message.error(result.Message)
          yield update({ tableLoading: false })
        }
         break;
        case 'M_GetALLOperationTask2' :  //
        if (result.IsSuccess) {
          message.success(result.Message)
        } else {
           message.error(result.Message)
       }
       break;
    }
    },
    //导出
    *exportSystemModelList({ payload, }, { call, update, select, put }) {
      const result = yield call(services.ExportSystemModelList, { ...payload });
      if (result.IsSuccess) {
        message.success('下载成功');
        downloadFile(`/upload${result.Datas}`);
      } else {
        message.error(result.Message)
      }
    },
  },
})