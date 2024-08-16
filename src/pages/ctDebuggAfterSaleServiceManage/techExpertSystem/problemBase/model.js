import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'problemBase',
  state: {
    tableDatas:[],
    queryPar:{},
    tableDetailTotal:0,
    detailQueryPar:{},
  },
  effects: {
    *GetQuestionList({ payload,callback }, { call, put, update }) { //获取问题库
      const result = yield call(services.GetQuestionList, payload);
      if (result.IsSuccess) {
         yield update({
           queryPar:payload,
           tableDatas:result.Datas,
           tableTotal:result.Total,
         })
         callback&&callback()
      }else{
        result.Message && message.error(result.Message)
      }
    },
    *ExportQuestion({ payload,callback }, { call, put, update }) { //问题库 导出
      const result = yield call(services.ExportQuestion, payload);
      if (result.IsSuccess) {
        message.success('下载成功');
        downloadFile(`${result.Datas}`);
      } else {
        result.Message && message.error(result.Message);
      }
    },
    *GetQuestionTemplate({ payload,callback }, { call, put, update }) { //获取问题库导入模板
      const result = yield call(services.GetQuestionTemplate, payload);
      if (result.IsSuccess) {
        message.success('下载成功');
        downloadFile(`${result.Datas}`);
      }else{
        result.Message && message.error(result.Message)
      }
    },
    
    *AddOrUpdateQuestion({ payload,callback }, { call, put, update }) { //问题库添加修改
      const result = yield call(services.AddOrUpdateQuestion, payload);
      if (result.IsSuccess) {
        message.success(result.Message);
        callback&&callback(result.Datas)
      }else{
        result.Message && message.error(result.Message)
      }
    },

    *DeleteQuestion({ payload,callback }, { call, put, update }) { //问题库添加删除
      const result = yield call(services.DeleteQuestion, payload);
      if (result.IsSuccess) {
        message.success(result.Message);
        callback&&callback(result.Datas)
      }else{
        result.Message && message.error(result.Message)
      }
    },


  }
})