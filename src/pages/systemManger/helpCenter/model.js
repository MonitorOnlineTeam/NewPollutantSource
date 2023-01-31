import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'helpCenter',
  state: {
    questTypeTreeData : [],
    questionListData:[],
    questionListTotal:0,
    questionTypeTitle:undefined,
    questTypeFirstLevel:undefined,
    questTypeSecondLevel:undefined,
  },
  effects: {
    *getQuestionDetialList({ payload,callback }, { call, put, update }) { //问题列表
      const result = yield call(services.GetQuestionDetialList, payload);
      if (result.IsSuccess) {
        const data = result.Datas.map(item=>{
          return {...item,content:item.QuestionName,key:item.ID }
        })
        if(payload.firstLevel){ //防止弹框刷新
         yield update({
          questionListTotal:result.Total,
          questionListData:data? data : [],
        })
       }
        callback&&callback(data)
      }else{
        message.error(result.Message)
        callback&&callback([])
      }
    },
    *getQuestionType({ payload,callback }, { call, put, update }) { //问题类别
      const result = yield call(services.GetQuestionType, payload);
      if (result.IsSuccess) {
         if(result.Datas){
          // const data = [result.Datas.appPage,result.Datas.webPage]
          yield update({  questTypeTreeData :result.Datas,  })
          callback&&callback(result.Datas)
         }
      }else{
        message.error(result.Message)
      }
    },
  },
})