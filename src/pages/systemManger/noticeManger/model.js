import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'noticeManger',
  state: {
    tableDatas:[],
    parametersList:[],
    tableLoading:false,
    tableTotal:0,
    monitoringTypeList:[],
    manufacturerList:[],
    maxNum:null,
  },
  effects: {
    *getNoticeContentList({ payload,callback }, { call, put, update }) { //列表
      const result = yield call(services.GetNoticeContentList, payload);
      if (result.IsSuccess) {
        yield update({
          tableTotal:result.Total,
          tableDatas:result.Datas?result.Datas : [],
        })
        callback&&callback(result.Datas?result.Datas : [])
      }else{
        message.error(result.Message)
      }
    },
    *addOrUpdNoticeContent({ payload,callback }, { call, put, update }) { //添加
      const result = yield call(services.AddOrUpdNoticeContent, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      }else{
        message.error(result.Message)
      }
    },  
    *deleteNoticeContent({ payload,callback }, { call, put, update }) { //删除
      const result = yield call(services.DeleteNoticeContent, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      }else{
        message.error(result.Message)
      }
    },

  },
})