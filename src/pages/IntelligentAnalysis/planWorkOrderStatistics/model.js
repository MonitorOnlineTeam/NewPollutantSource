import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'planWorkOrderStatistics',
  state: {
    tableDatas:[],
    parametersList:[],
    tableLoading:false,
    tableTotal:0,
    abnormalTypes:1,
    pointDatas:[],
    entTableDatas:[],
    abnormalList:[],
    queryPar:null,
    dateCol:[],
    cityTableTotal:0,
    cityTableDatas:[],
    cityTableLoading:false,
    cityDateCol:[],
    cityAbnormalList:[],
    cityDetailTableTotal:[],
    cityDetailTableDatas:[],
    entAbnormalList:{},
    taskList:[],
    getPointExceptionLoading:true,
    regPointTableDatas:[],
    insideOrOutsiderWorkTableDatas:[],
    cityDetailTableTotal:[],
    cityDetailTableDatas:[],
    entOutsidePointListTotal:[],
    entOutsidePointListDatas:[],
    regPointTableDatasTotal:[]
  },
  effects: {
    *regEntGetTaskWorkOrderList({ payload,callback }, { call, put, update }) { //行政区省级 企业第一级
      yield update({ tableLoading:true})
      const result = yield call(services.regEntGetTaskWorkOrderList, payload);
      if (result.IsSuccess) {
        yield update({
          tableTotal:result.Total,
          tableDatas:result.Datas,
          tableLoading:false,
          queryPar:{...payload},
        })

        
      }else{
        message.error(result.Message)
        yield update({ tableLoading:false})
      }
    },
    *cityGetTaskWorkOrderList({ payload,callback }, { call, put, update }) { //行政区市 级别 第一级
      const result = yield call(services.cityGetTaskWorkOrderList, payload);
      if (result.IsSuccess) {
        yield update({
          cityTableTotal:result.Total,
          cityTableDatas:result.Datas,
          queryPar:{...payload},
        })  
      }else{
        message.error(result.Message)
      }
    },
    *regPointGetTaskWorkOrderList({ payload,callback }, { call, put, update }) { //行政区 省级 运营监测点
      const result = yield call(services.regPointGetTaskWorkOrderList, payload);
      if (result.IsSuccess) {
        yield update({
          regPointTableDatasTotal:result.Total,
          regPointTableDatas:result.Datas,
        })  
      }else{
        message.error(result.Message)
      }
    },
    
    *insideOrOutsideWorkGetTaskWorkOrderList({ payload,callback }, { call, put, update }) { //行政区  计划内 计划外 工单数弹框
      const result = yield  call(services.insideOrOutsideWorkGetTaskWorkOrderList, payload);
      if (result.IsSuccess) {
        yield update({
          insideOrOutsiderWorkTableDatas:result.Datas,
          insideOrOutsiderWorkTableTotal:result.Total,
          dateCol:result.Datas[0]&&result.Datas[0].datePick,
          queryPar:{...payload},
        })  
      }else{
        message.error(result.Message)
      }
    },
    *cityDetailGetTaskWorkOrderList({ payload,callback }, { call, put, update }) { //行政区市  计划外 市详情
      const result = yield call(services.cityDetailGetTaskWorkOrderList, payload);
      if (result.IsSuccess) {
        yield update({
          cityDetailTableTotal:result.Total,
          cityDetailTableDatas:result.Datas,
        })  
      }else{
        message.error(result.Message)
      }
    },
    *entOutsidePointGetTaskWorkOrderList({ payload,callback }, { call, put, update }) { //企业  计划外 监测点
      const result = yield call(services.entOutsidePointGetTaskWorkOrderList, payload);
      if (result.IsSuccess) {
        yield update({
          entOutsidePointListTotal:result.Total,
          entOutsidePointListDatas:payload.staticType==3? result.Datas[0]&&result.Datas[0].datePick : result.Datas,
        })  
      }else{
        message.error(result.Message)
      }
    },
    *exportTaskWorkOrderList({ payload,callback }, { call, put, update }) { //企业 行政区 导出
      const result = yield call(services.exportTaskWorkOrderList, payload);
      if (result.IsSuccess) {
        message.success('下载成功');
          downloadFile(`/upload${result.Datas}`);
         } else {
        message.warning(result.Message);
      }
    }, 
    *exportCityDetailTaskWorkList({ payload,callback }, { call, put, update }) { //城市详情 导出
      const result = yield call(services.exportCityDetailTaskWorkList, payload);
      if (result.IsSuccess) {
        message.success('下载成功');
          downloadFile(`/upload${result.Datas}`);
         } else {
        message.warning(result.Message);
      }
    }, 
    *workRegExportTaskWorkList({ payload,callback }, { call, put, update }) { //城市详情 导出
      const result = yield call(services.workRegExportTaskWorkList, payload);
      if (result.IsSuccess) {
        message.success('下载成功');
          downloadFile(`/upload${result.Datas}`);
         } else {
        message.warning(result.Message);
      }
    }, 
    *cityRegExportTaskWorkList({ payload,callback }, { call, put, update }) { //市级别 导出
      const result = yield call(services.cityRegExportTaskWorkList, payload);
      if (result.IsSuccess) {
        message.success('下载成功');
          downloadFile(`/upload${result.Datas}`);
         } else {
        message.warning(result.Message);
      }
    }, 
    *operaPointExportTaskWorkList({ payload,callback }, { call, put, update }) { //行政区 监测点 导出
      const result = yield call(services.operaPointExportTaskWorkList, payload);
      if (result.IsSuccess) {
        message.success('下载成功');
          downloadFile(`/upload${result.Datas}`);
         } else {
        message.warning(result.Message);
      }
    }, 
    *workEntExportTaskWorkList({ payload,callback }, { call, put, update }) { //企业工单数 导出
      const result = yield call(services.workEntExportTaskWorkList, payload);
      if (result.IsSuccess) {
        message.success('下载成功');
          downloadFile(`/upload${result.Datas}`);
         } else {
        message.warning(result.Message);
      }
    }, 
  },
})