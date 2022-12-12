import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'problemManger',
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
    *getQuestionDetialList({ payload,callback }, { call, put, update }) { //列表
      const result = yield call(services.GetQuestionDetialList, payload);
      if (result.IsSuccess) {
        yield update({
          tableTotal:result.Total,
          tableDatas:result.Datas?result.Datas : [],
        })
      }else{
        message.error(result.Message)
      }
    },
    *addOrUpdQuestionDetial({ payload,callback }, { call, put, update }) { //添加修改
      const result = yield call(services.AddOrUpdQuestionDetial, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      }else{
        message.error(result.Message)
      }
    }, 

    *deleteQuestionDetial({ payload,callback }, { call, put, update }) { //删除
      const result = yield call(services.DeleteQuestionDetial, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      }else{
        message.error(result.Message)
      }
    },
    *getQuestionType({ payload,callback }, { call, put, update }) { //问题类别
      const result = yield call(services.GetQuestionType, payload);
      if (result.IsSuccess) {
        callback(result.Datas)
      }else{
        message.error(result.Message)
      }
    },
    
  },
})