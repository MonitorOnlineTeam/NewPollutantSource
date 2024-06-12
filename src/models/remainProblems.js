import moment from 'moment';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile, requestPost } from '@/utils/utils';
import { API } from '@config/API';

export default Model.extend({
  namespace: 'remainProblems',
  state: {
    tableDatas: [],
    tableLoading: false,
    tableTotal: 0,
    queryPar: {},
    tableLoading2: false,
    tableTotal2: 0,
    queryPar2: {},
    exportLoading: false,
    exportLoading2: false,
  },
  effects: {

    *GetQuestionList({ payload, callback }, { call, put, update }) { //获取遗留问题信息
      const type = payload.isAll
      yield update(type == 2 ? { tableLoading: true } : { tableLoading2: true })
      const result = yield call(requestPost, API.CtProjectExecuProgressApi.GetQuestionList,payload);
      if (result.IsSuccess) {
        yield update(type == 2 ? {
          queryPar: payload,
          tableDatas: result.Datas,
          tableTotal: result.Total,
        }
          :
          {
            queryPar2: payload,
            tableDatas2: result.Datas,
            tableTotal2: result.Total,
          }
        )
        callback && callback()
      } else {
        message.error(result.Message)
      }
      yield update(type == 2 ? { tableLoading: false } : { tableLoading2: false })
    }, 
    *ExportQuestionList({ payload, callback }, { call, put, update }) { //遗留 导出
      const type = payload.isAll
      yield update(type == 2 ? { exportLoading: true } : { exportLoading2: true })
      const result = yield call(requestPost, API.CtProjectExecuProgressApi.ExportQuestionList, payload);
      if (result.IsSuccess) {
        message.success('下载成功');
        downloadFile(`${result.Datas}`);
      } else {
        message.warning(result.Message);
      }
      yield update(type == 2 ? { exportLoading: false } : { exportLoading2: false })
    },


  }
})