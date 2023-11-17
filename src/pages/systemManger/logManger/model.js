import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'logManger',
  state: {
    tableDatas:[],
    tableTotal:0,
    queryPar:{},
    tableDatas2:[],
    tableTotal2:0,
    queryPar2:{},
    tableDatas3:[],
    tableTotal3:0,
    queryPar3:{},
  },
  effects: {
    *getSystemExceptionList({ payload,callback }, { call, put, update }) { //异常日志 列表
      const result = yield call(services.GetSystemExceptionList, payload);
      if (result.IsSuccess) {
        yield update({
          tableTotal:result.Total,
          tableDatas:result.Datas?result.Datas : [],
          queryPar:payload,
        })
      }else{
        message.error(result.Message)
      }
    },
    *deleteSystemException({ payload,callback }, { call, put, update }) { //异常日志 删除
      const result = yield call(services.DeleteSystemException, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      }else{
        message.error(result.Message)
      }
    },
    *getSystemLongInLogs({ payload,callback }, { call, put, update }) { //登录日志 列表
      const result = yield call(services.GetSystemLongInLogs, payload);
      if (result.IsSuccess) {
        yield update({
          tableTotal2:result.Total,
          tableDatas2:result.Datas?result.Datas : [],
          queryPar2:payload,
        })
      }else{
        message.error(result.Message)
      }
    },
    *deleteSystemLongInLogs({ payload,callback }, { call, put, update }) { //登录日志 删除
      const result = yield call(services.DeleteSystemLongInLogs, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      }else{
        message.error(result.Message)
      }
    },
    *getUserOprationLogsList({ payload,callback }, { call, put, update }) { //操作日志 列表
      const result = yield call(services.GetUserOprationLogsList, payload);
      if (result.IsSuccess) {
        yield update({
          tableTotal3:result.Total,
          tableDatas3:result.Datas?result.Datas : [],
          queryPar3:payload,
        })
      }else{
        message.error(result.Message)
      }
    },
    *deleteUserOprationLogs({ payload,callback }, { call, put, update }) { //操作日志 删除
      const result = yield call(services.DeleteUserOprationLogs, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      }else{
        message.error(result.Message)
      }
    },
  },
})