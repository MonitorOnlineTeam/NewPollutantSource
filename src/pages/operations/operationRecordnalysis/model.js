import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'operationRecordnalysis',
  state: {
    taskTypeList:[],
    tableDatas: [],
    tableLoading:false,
    tableTotal: 0,
    tableDatas2: [],
    tableTotal2: 0,
    tableLoading2:false,
    exportLoading:false,
    exportLoading2:false,
    recordAnalyListQueryPar:{},
    accountTableDatas:[],
    accountTableTotal:0,
    accountDetailQueryPar:{},
    accountDetailCol:[],
  },
  effects: {
    *getTaskTypeList({ payload, callback }, { call, put, update }) { //获取工单类型
      const result = yield call(services.GetTaskTypeList, payload);
      if (result.IsSuccess) {
        yield update({taskTypeList: result.Datas,})
      } else {
        message.error(result.Message)
      }
    },
    *getOperationRecordAnalyList({ payload, callback }, { call, put, update }) { //列表
      payload.RegionCode? yield update({  tableLoading2:true }) : yield update({  tableLoading:true })
      const result = yield call(services.GetOperationRecordAnalyList, payload);  
      if (result.IsSuccess) {
        if(payload.RegionCode){
          yield update({
            tableTotal2: result.Total,
            tableDatas2: result.Datas&&result.Datas.DataList ? result.Datas.DataList : [],
            tableLoading2:false,
          }) 
        }else{
          yield update({
           tableTotal: result.Total,
           tableDatas: result.Datas&&result.Datas.DataList ? result.Datas.DataList : [],
           tableLoading:false,
        })
      }
        callback(result.Datas&&result.Datas.ColumnList&&result.Datas.ColumnList[0] ? result.Datas.ColumnList[0] : [],payload)
      } else {
        message.error(result.Message)
        yield update({
          tableLoading2: false,
          tableLoading:false,
       })
      }
    },
    *getOperationRecordAnalyInfoList({ payload, callback }, { call, put, update }) { //列表 台账详情
      const result = yield call(services.GetOperationRecordAnalyInfoList, payload);
      if (result.IsSuccess) {
        yield update({
          accountTableTotal: result.Total,
          accountTableDatas: result.Datas ? result.Datas : [],
          accountDetailQueryPar:payload,
          accountDetailCol:result.Datas[0]&&result.Datas[0].datePick
        })
      } else {
        message.error(result.Message)
      }
    },
    *exportOperationRecordAnalyList({ payload, callback }, { call, put, update }) { // 运维分析列表 导出
      payload.RegionCode? yield update({  exportLoading2:true }) : yield update({  exportLoading:true })
      const result = yield call(services.ExportOperationRecordAnalyList, payload);
      if (result.IsSuccess) {
        payload.RegionCode? yield update({  exportLoading2:false }) : yield update({  exportLoading:false })
        message.success(result.Message)
        downloadFile(`${result.Datas}`)
      } else {
        yield update({  exportLoading2:false, exportLoading:false  })
        message.error(result.Message)
      }
    },
    *exportOperationRecordAnalyInfoList({ payload, callback }, { call, put, update }) { //运维分析详情列表 导出
      const result = yield call(services.ExportOperationRecordAnalyInfoList, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        downloadFile(`${result.Datas}`)
      } else {
        message.error(result.Message)
      }
    },
  },
})