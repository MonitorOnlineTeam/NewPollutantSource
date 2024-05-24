import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config';
import { downloadFile, requestPost } from '@/utils/utils';
import { API } from '@config/API';
export default Model.extend({
  namespace: 'smsSend',
  state: {
    tableDatas: [],
    tableTotal: 0,
    queryPar: {},
    tableDatas2: [],
    tableTotal2: 0,
    queryPar2: {},
  },
  effects: {
    //列表
    *GetUserMessageList({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.AssetManagementApi.GetUserMessageList, payload);
      if (result.IsSuccess) {
        yield update({
          tableDatas: result.Datas,
          tableTotal: result.Total,
          queryPar: payload,
        });
      }
    },
    //导出
    *ExportUserMessageList({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.AssetManagementApi.ExportUserMessageList, payload);
      if (result.IsSuccess) {
        message.success('导出成功！');
        downloadFile(result.Datas);
      }
    },
    //添加短信推送人员
    *AddOrUpdUserMessage({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.AssetManagementApi.AddOrUpdUserMessage, payload);
      if (result.IsSuccess) {
        message.success(result.Message);
        callback && callback()
      }
    },
    //删除短信推送人员
    *DelUserMessage({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.AssetManagementApi.DelUserMessage, payload);
      if (result.IsSuccess) {
        message.success(result.Message);
        callback && callback()
      }
    },
    //添加人员短信报警排口
    *InsertPointUserMessage({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.AssetManagementApi.InsertPointUserMessage, payload);
      if (result.IsSuccess) {
        message.success(result.Message);
        callback && callback()
      }
    },
  },
});
