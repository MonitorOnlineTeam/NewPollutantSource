import moment from 'moment';
import * as services from '../services/pointMatchingSet';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';


/**
 * 点位匹配
 */

export default Model.extend({
  namespace: 'pointMatchingSet',
  state: {
    tableDatas: [],
    tableTotal: 0,
    statePointList:[],
    tableDetailDatas: [],
    tableDetailTotal: 0,
    entStateList:[],
    StateEntID:undefined,
  },
  effects: {
    *getPointStateRelationList({ payload, callback }, { call, put, update }) { //列表
      yield update({ tableLoading: true })
      const result = yield call(services.GetPointStateRelationList, payload);
      if (result.IsSuccess) { 
        yield update({
          tableTotal: result.Total,
          tableDatas:result.Datas? result.Datas:[],
        })
      } else {
        message.error(result.Message)
      }
    },
    *getStatePointList({ payload, callback }, { call, put, update }) { //弹框
      yield update({ tableLoading: true })
      const result = yield call(services.GetStatePointList, payload);
      if (result.IsSuccess) {
        yield update({
          tableDetailDatas:result.Datas,
          tableDetailTotal:result.Total,
        })
      } else {
        message.error(result.Message)
      }
    },
    *operationStatePoint({ payload, callback }, { call, put, update }) { //操作
      const result = yield call(services.OperationStatePoint, payload);
        if (result.IsSuccess) {
          message.success(result.Message)
          callback()
        } else {
          message.error(result.Message)
        }
    
    },
    *deleteStatePoint({ payload, callback }, { call, put, update }) { //删除
      const result = yield call(services.DeleteStatePoint, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      } else {
        message.error(result.Message)
      }
    },
    *getEntStateList({ payload, callback }, { call, put, update }) { //匹配企业
      const result = yield call(services.GetEntStateList, payload);
      if (result.IsSuccess) {
        yield update({
          entStateList:result.Datas,
        })
      } else {
        message.error(result.Message)
      }
    },
    *getPointStateList({ payload, callback }, { call, put, update }) { //匹配监测点
      const result = yield call(services.GetPointStateList, payload);
      if (result.IsSuccess) {
        callback(result.Datas)
      } else {
        message.error(result.Message)
      }
    },
    *exportPointStateRelationList({ payload, callback }, { call, put, update }) { //导出
      const result = yield call(services.ExportPointStateRelationList, payload);
      if (result.IsSuccess) {
        message.success('下载成功');
        downloadFile(`/wwwroot${result.Datas}`);
      } else {
        message.warning(result.Message);
      }
    },
  },
})