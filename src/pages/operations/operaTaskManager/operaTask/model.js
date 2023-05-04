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
    tableLoading: false,
    tableTotal: 0,
    tableDatas2: [],
    tableLoading2: false,
    tableTotal2: 0,
  },
  effects: {
    *bWWebService({ payload, callback }, { call, put, update }) {
      switch(payload.functionName){
        case 'M_GetALLOperationTask' :  yield update({ tableLoading: true }); break;
        case 'M_GetOperationTaskDone' : yield update({ tableLoading2: true }); break;
      }
      const result = yield call(services.BWWebService, payload);
       const formatData = (resultData) =>{   
 
        const arrDataFormat = (data) =>{
          let arrData = [];
          if(data instanceof Array){
            arrData = data;
          }else{ // 单条数据为对象的情况
            arrData.push(data)
          }  
          return arrData;
        }
       return  resultData&&resultData['soap:Envelope']&& resultData['soap:Envelope']['soap:Body']&&resultData['soap:Envelope']['soap:Body'][`${payload.functionName}Response`]&&resultData['soap:Envelope']['soap:Body'][`${payload.functionName}Response`][`${payload.functionName}Result`]&&resultData['soap:Envelope']['soap:Body'][`${payload.functionName}Response`][`${payload.functionName}Result`]['Items']&&resultData['soap:Envelope']['soap:Body'][`${payload.functionName}Response`][`${payload.functionName}Result`]['Items']['Item']  ?  arrDataFormat(resultData['soap:Envelope']['soap:Body'][`${payload.functionName}Response`][`${payload.functionName}Result`]['Items']['Item']) : []
      }
      switch(payload.functionName){
        case 'M_GetALLOperationTask' :  //进行中 运维任务列表
         if (result.IsSuccess) {
          yield update({tableTotal: result.Total, tableDatas: formatData(result.Datas), tableLoading: false,  })
        } else {
          message.error(result.Message); yield update({ tableLoading: false })
        }
         break;
         case 'M_GetOperationTaskDone' :  //已完结 运维任务列表
         if (result.IsSuccess) {
          yield update({tableTotal2: result.Total, tableDatas2: formatData(result.Datas), tableLoading2: false,  })
        } else {
          message.error(result.Message); yield update({ tableLoading2: false })
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