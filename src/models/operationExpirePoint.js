import moment from 'moment';
import * as services from '../services/operationExpirePoint';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'operationExpirePoint',
  state: {
    totalDatas:{ notExpired7:0,notExpired30:0,notExpired14:0,overdue7:0 },
    tableLoading:false,
    checkName:'0~7日'
  },
  effects: {
    *getOperationExpirePointList({ payload,callback }, { call, put, update }) { //运维到期点位统计
      yield update({ tableLoading:true})
      const result = yield call(services.GetOperationExpirePointList, payload);
      if (result.IsSuccess) {
        yield update({
          totalDatas:result.Datas,
          tableLoading:false
        })
        callback(result.Datas)
      }else{
        message.error(result.Message)
        yield update({ tableLoading:false})
      }
    },
    *exportOperationExpirePointList({ callback,payload }, { call, put, update, select }) { //运维到期点位统计 导出
      const response = yield call(services.ExportOperationExpirePointList, { ...payload });
      if (response.IsSuccess) {
        message.success('下载成功');
        downloadFile(`/upload${response.Datas}`);
      } else {
        message.warning(response.Message);
      }
    },
  },
})