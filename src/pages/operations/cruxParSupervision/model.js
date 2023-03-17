import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'cruxParSupervision',
  state: {
    tableDatas: [],
    tableLoading: false,
    tableTotal: 0,
    checkDetailData: [],
    regQueryPar: '',
    editCheckTime:moment(),
  },
  effects: {
    *getKeyParameterCheckList({ payload, callback }, { call, put, update }) { //获取关键参数核查列表
      const result = yield call(services.GetKeyParameterCheckList, payload);
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
    *exportKeyParameterCheckList({ payload, callback }, { call, put, update }) { //获取关键参数核查列表 导出
      const result = yield call(services.ExportKeyParameterCheckList, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        downloadFile(`/upload${result.Datas}`)
      } else {
        message.error(result.Message)
      }
    },
    *deleteKeyParameterCheck({ payload, callback }, { call, put, update }) { //删除关键参数核查信息
      const result = yield call(services.DeleteKeyParameterCheck, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback(result.IsSuccess);
      } else {
        message.error(result.Message)
        callback(result.IsSuccess);
      }
    },
    *issuedKeyParameter({ payload, callback }, { call, put, update }) { //下发关键参数核查信息
      const result = yield call(services.IssuedKeyParameter, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback(result.IsSuccess);
      } else {
        message.error(result.Message)
        callback(result.IsSuccess);
      }
    },
    *getKeyParameterCheckDetailList({ payload, callback }, { call, put, update }) { //获取关键参数核查列表详情
      const result = yield call(services.GetKeyParameterCheckDetailList, payload);
      if (result.IsSuccess) {
        yield update({ checkDetailData: result.Datas&&result.Datas.Itemlist? result.Datas.Itemlist : [],   })
      } else {
        message.error(result.Message)
      }
    },
    *checkItemKeyParameter({ payload, callback }, { call, put, update }) { //核查
      const result = yield call(services.CheckItemKeyParameter, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback(result.IsSuccess);
      } else {
        message.error(result.Message)
        callback(result.IsSuccess);
      }
    },
    *subCheckItem({ payload, callback }, { call, put, update }) { //保存或提交关键参数核查
      const result = yield call(services.SubCheckItem, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback(result.IsSuccess);
      } else {
        message.error(result.Message)
        callback(result.IsSuccess);
      }
    },
    *deleteKeyParameterItemCheck({ payload, callback }, { call, put, update }) { //删除关键参数核查项
      const result = yield call(services.DeleteKeyParameterItemCheck, payload);
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