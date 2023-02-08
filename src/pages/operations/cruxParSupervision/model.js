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
    operationInfoList: [],
    checkDetailDate: null,
    regQueryPar: '',
  },
  effects: {
    *getInspectorOperationManageList({ payload, callback }, { call, put, update }) { //列表
      const result = yield call(services.GetInspectorOperationManageList, payload);
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
    *pushInspectorOperation({ payload, callback }, { call, put, update }) { //整改推送
      const result = yield call(services.GetInspectorOperationManageList, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback(result.IsSuccess);
      } else {
        message.error(result.Message)
        callback(result.IsSuccess);
      }
    },
    *exportRemoteInspectorList({ payload, }, { call, update, select, put }) { //导出
      const result = yield call(services.GetInspectorOperationManageList, { ...payload });
      if (result.IsSuccess) {
        message.success('下载成功');
        downloadFile(`/upload${result.Datas}`);
      } else {
        message.error(result.Message)
      }
    },
  },
})