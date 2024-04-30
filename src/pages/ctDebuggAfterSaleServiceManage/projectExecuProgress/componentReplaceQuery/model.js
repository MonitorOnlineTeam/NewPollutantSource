import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config';
import { downloadFile, requestPost } from '@/utils/utils';
import { API } from '@config/API';
export default Model.extend({
  namespace: 'componentReplaceQuery',
  state: {
    tableDatas: [{dd:'好好喝哈哈哈哈哈哈好好喝哈哈哈哈哈哈好好喝哈哈哈哈哈哈好好喝哈哈哈哈哈哈好好喝哈哈哈哈哈哈好好喝哈哈哈哈哈哈好好喝哈哈哈哈哈哈好好喝哈哈哈哈哈哈'}],
    tableTotal: 0,
    queryPar: {},
  },
  effects: {
    //列表信息
    *GetResourceOverviewLeft({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.ResourceOverviewApi.GetResourceOverviewLeft, payload);
      if (result.IsSuccess) {
        yield update({
          tableDatas: result.Datas,
          tableTotal: result.Total,
          queryPar: payload,
        });
      }
    },
   //导出
    *ExportDisposableServiceInfo({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.ReportsViewsApi.ExportDisposableServiceInfo, payload);
      if (result.IsSuccess) {
        message.success('导出成功！');
        downloadFile(result.Datas);
      }
    },
  },
});
