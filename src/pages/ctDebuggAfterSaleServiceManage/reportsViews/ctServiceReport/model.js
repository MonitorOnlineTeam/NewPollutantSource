import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config';
import { downloadFile, requestPost } from '@/utils/utils';
import { API } from '@config/API';
export default Model.extend({
  namespace: 'ctServiceReport',
  state: {
  },
  effects: {
    // 成套服务报告 - 导出
    *ExportDebugReports({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.ReportsViewsApi.ExportDebugReports, payload);
      if (result.IsSuccess) {
        message.success('导出成功！');
        downloadFile(result.Datas);
      }
    },
  },
});
