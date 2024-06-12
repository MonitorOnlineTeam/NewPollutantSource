import moment from 'moment';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config';
import { downloadFile, requestPost } from '@/utils/utils';
import { API } from '@config/API';

export default Model.extend({
  namespace: 'serviceIsNotTimely',
  state: {},
  effects: {
    // 获取已设置不及时的服务列表
    *GetServiceSetList({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.CTProjectExecutionApi.GetServiceSetList,
        payload,
      );
      if (result.IsSuccess) {
        callback && callback(result);
      }
    },
    // 获取未设置不及时的服务列表
    *GetServiceNotSetList({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.CTProjectExecutionApi.GetServiceNotSetList,
        payload,
      );
      if (result.IsSuccess) {
        callback && callback(result);
      }
    },
    // 设置服务不及时
    *SetServiceStatus({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.CTProjectExecutionApi.SetServiceStatus,
        payload,
      );
      if (result.IsSuccess) {
        callback && callback(result);
      }
    },
    // 删除
    *DeleteServiceSetStatus({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.CTProjectExecutionApi.DeleteServiceSetStatus,
        payload,
      );
      if (result.IsSuccess) {
        message.success('删除成功！');
        callback && callback(result);
      }
    },
    // 导出
    *ExportServiceSetList({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.CTProjectExecutionApi.ExportServiceSetList,
        payload,
      );
      if (result.IsSuccess) {
        message.success('导出成功！');
        downloadFile(result.Datas);
      }
    },
  },
});
