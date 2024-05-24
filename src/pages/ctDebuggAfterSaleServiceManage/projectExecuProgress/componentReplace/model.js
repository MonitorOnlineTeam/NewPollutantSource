import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config';
import { downloadFile, requestPost } from '@/utils/utils';
import { API } from '@config/API';
export default Model.extend({
  namespace: 'componentReplace',
  state: {
    tableDatas: [],
    tableTotal: 0,
    queryPar: {},
    cisPartsList: []
  },
  effects: {
    //列表信息
    *GetSpareReplacementRecordList({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.CtProjectExecuProgressApi.GetSpareReplacementRecordList, payload);
      if (result.IsSuccess) {
        yield update({
          tableDatas: result.Datas,
          tableTotal: result.Total,
          queryPar: payload,
        });
      }
    },
    //导出
    *ExportpareReplacementRecordList({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.CtProjectExecuProgressApi.ExportpareReplacementRecordList, payload);
      if (result.IsSuccess) {
        message.success('导出成功！');
        downloadFile(result.Datas);
      }
    },
    //故障原因
    *GetCisPartsList({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.CtProjectExecuProgressApi.GetCisPartsList, payload);
      if (result.IsSuccess) {
        yield update({
          cisPartsList: result.Datas?.FailureCause || [],
        });
      }
    },
  },
});
