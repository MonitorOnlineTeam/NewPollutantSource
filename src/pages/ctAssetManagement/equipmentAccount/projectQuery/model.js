import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'ctProjectQuery',
  state: {
    tableDatas: [],
    parametersList: [],
    tableLoading: false,
    tableTotal: 0,
    queryPar: {},
    entAndPoint: [],
  },
  effects: {
    *updateCTProject({ payload, callback }, { call, put, update }) { //修改
      const result = yield call(services.updateCTProject, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      } else {
        message.error(result.Message)
      }
    },
    *getrojectPointRelationList({ payload, callback }, { call, put, update }) { //获取项目与站点管理关系
      const result = yield call(services.getrojectPointRelationList, payload);
      if (result.IsSuccess) {
        callback&&callback(result.Datas)
      } else {
        message.error(result.Message)
      }
    },
    *addProjectPointRelation({ payload, callback }, { call, put, update }) { //添加成套项目与站点关联关系
      const result = yield call(services.addProjectPointRelation, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      } else {
        message.error(result.Message)
      }
    },
    *exportCTProjectList({ callback, payload }, { call, put, update, select }) { //导出
      const response = yield call(services.exportCTProjectList, { ...payload });
      if (response.IsSuccess) {
        message.success('下载成功');
        downloadFile(`/upload${response.Datas}`);
      } else {
        message.warning(response.Message);
      }
    },
  },
})