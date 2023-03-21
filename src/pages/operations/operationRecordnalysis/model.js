import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'operationRecordnalysis',
  state: {
    taskTypeList:[],
    tableDatas: [],
    tableTotal: 0,
    tableDatas2: [],
    tableTotal2: 0,
    accountQueryPar:{},
  },
  effects: {
    *getTaskTypeList({ payload, callback }, { call, put, update }) { //获取工单类型
      const result = yield call(services.GetTaskTypeList, payload);
      if (result.IsSuccess) {
        yield update({taskTypeList: result.Datas,})
      } else {
        message.error(result.Message)
      }
    },
    *getoperationRecordnalysisByDGIMN({ payload, callback }, { call, put, update }) { //列表
      const result = yield call(services.GetoperationRecordnalysisByDGIMN, payload);
      if (result.IsSuccess) {
        yield update({
          tableTotal: result.Total,
          tableDatas: result.Datas&&result.Datas.DataList ? result.Datas.DataList : [],
        })
        callback(result.Datas&&result.Datas.ColumnList&&result.Datas.ColumnList[0] ? result.Datas.ColumnList[0] : [])
      } else {
        message.error(result.Message)
      }
    },
    *exportoperationRecordnalysisByDGIMN({ payload, callback }, { call, put, update }) { // 导出
      const result = yield call(services.ExportoperationRecordnalysisByDGIMN, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        downloadFile(`/upload${result.Datas}`)
      } else {
        message.error(result.Message)
      }
    },
  },
})