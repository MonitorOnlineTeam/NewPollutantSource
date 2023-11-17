import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'timerManage',
  state: {
    tableDatas:[],
    parametersList:[],
    tableLoading:false,
    tableTotal:0,
    pointDatas:[],
    maxNum:null,
  },
  effects: {
    *getOnlineTimerManageList({ payload,callback }, { call, put, update }) { //列表
      yield update({ tableLoading:true})
      const result = yield call(services.GetOnlineTimerManageList, payload);
      if (result.IsSuccess) {
        yield update({
          tableTotal:result.Total,
          tableDatas:result.Datas?result.Datas.list : [],
          maxNum:result.Datas.MaxNum,
          tableLoading:false
        })
      }else{
        message.error(result.Message)
        yield update({ tableLoading:false})
      }
    },
    *addOnlineTimerManage({ payload,callback }, { call, put, update }) { //添加
      const result = yield call(services.AddOnlineTimerManage, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      }else{
        message.error(result.Message)
      }
    }, 
    *editOnlineTimerManage({ payload,callback }, { call, put, update }) { //修改
      const result = yield call(services.EditOnlineTimerManage, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      }else{
        message.error(result.Message)
      }
    }, 
    *delOnlineTimerManage({ payload,callback }, { call, put, update }) { //删除
      const result = yield call(services.DelOnlineTimerManage, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      }else{
        message.error(result.Message)
      }
    },



  },
})