import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'cruxParSupervisionRectifica',
  state: {
    tableDatas: [],
    parametersList: [],
    tableLoading: false,
    tableTotal: 0,
    parameterQuestionDetailList: [],
    regQueryPar: '',
  },
  effects: {
    *getKeyParameterQuestionList({ payload, callback }, { call, put, update }) { //关键参数核查整改信息列表
      const result = yield call(services.GetKeyParameterQuestionList, payload);
      if (result.IsSuccess) {
        yield update({
          tableTotal: result.Total,
          tableDatas: result.Datas,
          regQueryPar: payload,
        })
      } else {
        message.error(result.Message)
      }
    },
    *exportKeyParameterQuestionList({ payload, callback }, { call, put, update }) { //关键参数核查整改信息列表 导出
      const result = yield call(services.ExportKeyParameterQuestionList, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        downloadFile(`/upload${result.Datas}`)
      } else {
        message.error(result.Message)
      }
    },
    *checkItemKeyParameterQuestion({ payload, callback }, { call, put, update }) { //关键参数核查整改
      const result = yield call(services.CheckItemKeyParameterQuestion, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback(result.IsSuccess);
      } else {
        message.error(result.Message)
        callback(result.IsSuccess);
      }
    },
    *getKeyParameterQuestionDetailList({ payload, callback }, { call, put, update }) { //关键参数核查整改详情
      const result = yield call(services.GetKeyParameterQuestionDetailList, payload);
      if (result.IsSuccess) {
        yield update({  parameterQuestionDetailList:  result.Datas&&result.Datas.Itemlist? result.Datas.Itemlist : [],  })
      } else {
        message.error(result.Message)
      }
    },
    *updateKeyParameterQuestionStatus({ payload, callback }, { call, put, update }) { //通过或驳回关键参数核查整改
      const result = yield call(services.UpdateKeyParameterQuestionStatus, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback(result.IsSuccess);
      } else {
        message.error(result.Message)
        callback(result.IsSuccess);
      }
    },
  },
})