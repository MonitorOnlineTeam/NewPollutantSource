import moment from 'moment';
import * as services from './service';
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
    queryPar:null,
    dateCol:[],
    cityTableTotal:0,
    cityTableDatas:[],
    cityTableLoading:false,
    cityDateCol:[],
    cityAbnormalList:[],
    cityDetailTableTotal:[],
    cityDetailTableDatas:[],
    entAbnormalList:[]
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
          queryPar:{...payload},
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
          dateCol:result.Datas[0]&&result.Datas[0].datePick
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
      const result = yield call(services.getPointExceptionSignList, payload);
      if (result.IsSuccess) {
        yield update({
          entAbnormalList:result.Datas,
        })

      }else{
        message.error(result.Message)
      }
    },
    
  },
})