import moment from 'moment';
import * as services from '../services/abnormalWorkStatistics';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'abnormalWorkStatistics',
  state: {
    tableDatas:[],
    parametersList:[],
    tableLoading:false,
    tableTotal:0,
    abnormalTypes:1,
    pointDatas:[],
    entTableDatas:[],
    abnormalList:[],
    abnormalListTotal:0,
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
    exportCardExceptionLoading:false,
    exportResExceptionLoading:false,
    entAbnormalNumVisible:false,//打卡异常地图弹框
  },
  effects: {
    *regEntExceptionTaskList({ payload,callback }, { call, put, update }) { //行政区省级 企业第一级
      yield update({ tableLoading:true})
      const result = yield call(services.exceptionTaskList, payload);
      if (result.IsSuccess) {
        yield update({
          tableTotal:result.Total,
          tableDatas:result.Datas,
          tableLoading:false,
          queryPar:{...payload,entCode:undefined,entName:undefined},
        })

        
      }else{
        message.error(result.Message)
        yield update({ tableLoading:false})
      }
    },
    *abnormalExceptionTaskList({ payload,callback }, { call, put, update }) { //行政区省级 企业 打卡异常 响应超时
      const result = yield call(services.abnormalExceptionTaskList, payload);
      if (result.IsSuccess) {
        yield update({
          abnormalList:result.Datas,
          abnormalListTotal:result.Total,
          dateCol:result.Datas[0]&&result.Datas[0].datePick,
          queryPar:{...payload,entCode:undefined,entName:undefined},
        })

      }else{
        message.error(result.Message)
      }
    },
    *cityExceptionTaskList({ payload,callback }, { call, put, update }) { //行政区市 级别 第一级
      yield update({ cityTableLoading:true})
      const result = yield call(services.cityExceptionTaskList, payload);
      if (result.IsSuccess) {
        yield update({
          cityTableTotal:result.Total,
          cityTableDatas:result.Datas,
          cityTableLoading:false
        })

        
      }else{
        message.error(result.Message)
        yield update({ cityTableLoading:false})
      }
    },
    *cityDetailExceptionTaskList({ payload,callback }, { call, put, update }) { //行政区市 级别 第二级 弹框
      const result = yield call(services.cityDetailExceptionTaskList, payload);
      if (result.IsSuccess) {
        yield update({
          cityDetailTableTotal:result.Total,
          cityDetailTableDatas:result.Datas,
          queryPar:{...payload,entCode:undefined,entName:undefined},
        })
      }else{
        message.error(result.Message)
      }
    },
    

    *cityAbnormalExceptionTaskList({ payload,callback }, { call, put, update }) { //行政区市级 打卡异常
      const result = yield call(services.cityAbnormalExceptionTaskList, payload);
      if (result.IsSuccess) {
        yield update({
          cityAbnormalList:result.Datas,
          cityDateCol:result.Datas[0]&&result.Datas[0].datePick
        })

      }else{
        message.error(result.Message)
      }
    },
    *getPointExceptionSignList({ payload,callback }, { call, put, update }) { //企业 打卡异常
      
      yield update({  getPointExceptionLoading:true })
      const result = yield call(services.getPointExceptionSignList, payload);
      if (result.IsSuccess) {
        if(result.Datas.taskList[0]){
          const taskLists = result.Datas.taskList.map((item)=>({
             position:{
               ...item
            }
          }))
          yield update({
            taskList:taskLists,
          })
        }
        yield update({
          entAbnormalList:result.Datas,
          getPointExceptionLoading:false
        })
      }else{
        message.error(result.Message)
        yield update({getPointExceptionLoading:false })
      }
    },
    
     *exportExceptionTaskList({ payload,callback }, { call, put, update }) { //行政区 导出
      const result = yield call(services.exportExceptionTaskList, payload);
       if (result.IsSuccess) {
         message.success('下载成功');
           downloadFile(`/upload${result.Datas}`);
          } else {
         message.warning(result.Message);
       }
    },
    *exportCardResExceptionTaskList({ payload,callback }, { call, put, update }) { //行政区 打卡异常  导出
      
      payload.exceptionType == 1 ? yield update({exportCardExceptionLoading:true }) : yield update({exportCardResExceptionLoading:true })
      
      const result = yield call(services.exportCardResExceptionTaskList, payload);

       if (result.IsSuccess) {
         message.success('下载成功');
           downloadFile(`/upload${result.Datas}`);
           payload.exceptionType == 1 ? yield update({exportCardExceptionLoading:false }) : yield update({exportCardResExceptionLoading:false })
          } else {
          message.warning(result.Message);
          payload.exceptionType == 1 ? yield update({exportCardExceptionLoading:false }) : yield update({exportCardResExceptionLoading:false })
       }
    },
    *regDetaiExportExceptionTaskList({ payload,callback }, { call, put, update }) { //行政区详情 市级 导出
      const result = yield call(services.regDetaiExportExceptionTaskList, payload);
       if (result.IsSuccess) {
         message.success('下载成功');
           downloadFile(`/upload${result.Datas}`);
          } else {
         message.warning(result.Message);
       }
    },
    *abnormalExceptionTaskListExport({ payload,callback }, { call, put, update }) { //行政区详情 打卡异常 导出
      const result = yield call(services.abnormalExceptionTaskListExport, payload);
       if (result.IsSuccess) {
           message.success('下载成功');
           downloadFile(`/upload${result.Datas}`);
          } else {
         message.warning(result.Message);
       }
    },
    *cityDetailExceptionTaskListExport({ payload,callback }, { call, put, update }) { //行政区详情 市级弹框  导出
      const result = yield call(services.cityDetailExceptionTaskListExport, payload);
       if (result.IsSuccess) {
         message.success('下载成功');
           downloadFile(`/upload${result.Datas}`);
          } else {
         message.warning(result.Message);
       }
    },
    *exportEntResExceptionTaskList({ payload,callback }, { call, put, update }) { //响应超时 导出
      const result = yield call(services.exportEntResExceptionTaskList, payload);
       if (result.IsSuccess) {
         message.success('下载成功');
           downloadFile(`/upload${result.Datas}`);
          } else {
         message.warning(result.Message);
       }
    },
  },
})