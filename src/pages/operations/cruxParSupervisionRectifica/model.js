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
    operationInfoList:[],
  },
  effects: {
    *getInspectorOperationManageList({ payload, callback }, { call, put, update }) { //列表
      yield update({ tableLoading: true })
      const result = yield call(services.GetInspectorOperationManageList, payload);
      if (result.IsSuccess) {
        yield update({
          tableTotal: result.Total,
          tableDatas: result.Datas,
          tableLoading: false
        })
      } else {
        message.error(result.Message)
        yield update({ tableLoading: false })
      }
    },
    *getInspectorOperationInfoList({ payload, callback }, { call, put, update }) { //获取单个督查表实体
      const result = yield call(services.GetInspectorOperationInfoList, payload);
      if (result.IsSuccess) {
        yield update({  operationInfoList: result.Datas, })
        callback(result.Datas)
      } else {
        message.error(result.Message)
        callback()
      }
    },
    *getPointParames({ payload, callback }, { call, put, update }) { //获取单个排口默认值
      const result = yield call(services.GetPointParames, payload);
      if (result.IsSuccess) {
        callback(result.Datas)
      } else {
        message.error(result.Message)
      }
    },
    *addOrEditInspectorOperation({ payload, callback }, { call, put, update }) { //添加或修改督查模板
      const result = yield call(services.AddOrEditInspectorOperation, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback(result.IsSuccess)
      } else {
        message.error(result.Message)
        callback(result.IsSuccess)
      }
    },
    *getInspectorOperationView({ payload, callback }, { call, put, update }) { //详情
      const result = yield call(services.GetInspectorOperationView, payload);
      if (result.IsSuccess) {
        callback(result.Datas)
      } else {
        message.error(result.Message)
      }
    },
    *exportInspectorOperationManage({ payload, callback }, { call, put, update }) { //导出
      const result = yield call(services.ExportInspectorOperationManage, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        downloadFile(`${result.Datas}`)
      } else {
        message.error(result.Message)
      }
    },
    *deleteInspectorOperation({ payload, callback }, { call, put, update }) { //删除
      const result = yield call(services.DeleteInspectorOperation, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback();
      } else {
        message.error(result.Message)
      }
    },
    *pushInspectorOperation({ payload, callback }, { call, put, update }) { //整改推送
      const result = yield call(services.PushInspectorOperation, payload);
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