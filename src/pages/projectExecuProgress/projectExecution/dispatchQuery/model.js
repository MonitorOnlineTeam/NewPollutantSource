import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'dispatchQuery',
  state: {
    tableDatas:[],
    parametersList:[],
    tableLoading:false,
    tableTotal:0,
  },
  effects: {
    *getServiceDispatch({ payload,callback }, { call, put, update }) { //派单信息
      const result = yield call(services.getServiceDispatch, payload);
      if (result.IsSuccess) {
        yield update({
          tableTotal:result.Total,
          tableDatas:result.Datas,
        })
      }else{
        message.error(result.Message)
      }
    },

    *exportProjectInfoList({ callback,payload }, { call, put, update, select }) { //导出
      const response = yield call(services.ExportProjectInfoList, { ...payload });
      if (response.IsSuccess) {
        message.success('下载成功');
        downloadFile(`/upload${response.Datas}`);
      } else {
        message.warning(response.Message);
      }
    },

  },
})