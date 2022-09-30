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
    // questionListData:[{content:'player支付凡是的设置文档',key:'1'}],
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
        yield update({
          questionListTotal:result.Total,
          questionListData:data? data : [],
        })
        callback&&callback(data)
      }else{
        message.error(result.Message)
        callback&&callback([])
      }
    },
    *getHelpCenterList({ payload,callback }, { call, put, update }) { //问题类别
      const result = yield call(services.GetHelpCenterList, payload);
      if (result.IsSuccess) {
         if(result.Datas){
          const data = [result.Datas.appPage,result.Datas.webPage]
          yield update({  questTypeTreeData :data,  })
          callback&&callback(data)
         }
      }else{
        message.error(result.Message)
      }
    },
  },
})