import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'dispatchCompletionRate',
  state: {
    tableDatas: [],
    tableLoading: false,
    queryPar: {},
    incompleteData: [],
    incompleteTotal:0,
    incompleteLoading: false,
    exportLoading:false,
    exportIncompleteLoading:false,

  },

  effects: {
    *GetCTServiceDispatchRateList({ payload, callback }, { call, put, update }) { //派单完成率
      payload.pointType == 1?  yield update({ tableLoading: true }) : yield update({ incompleteLoading: true })
      const result = yield call(services.GetCTServiceDispatchRateList, payload);
      if (result.IsSuccess) {
        if (payload.pointType == 1) {
          yield update({
            queryPar: payload,
            tableDatas: result.Datas,
          })
        }else{
          yield update({
            incompleteData: result.Datas,
            incompleteTotal: result.Total,
          })
        }
        payload.pointType == 1?  yield update({ tableLoading: false }) : yield update({ incompleteLoading: false })

      } else {
        message.error(result.Message)
      }
  },
  *ExportCTServiceDispatchRateList({ callback, payload }, { call, put, update, select }) { //派单完成率 导出
    payload.pointType == 1?  yield update({ exportLoading: true }) : yield update({ exportIncompleteLoading: true })
    const result = yield call(services.ExportCTServiceDispatchRateList, { ...payload });
    if (result.IsSuccess) {
      message.success('下载成功');
      downloadFile(`${result.Datas}`);
    } else {
      message.warning(result.Message);
    }
    payload.pointType == 1?  yield update({ exportLoading: false }) : yield update({ exportIncompleteLoading: false })

  },

},
})