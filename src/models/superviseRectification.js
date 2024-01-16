import moment from 'moment';
import * as services from '../services/superviseRectification';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'superviseRectification',
  state: {
    tableDatas: [],
    parametersList: [],
    tableLoading: false,
    tableTotal: 0,
  },
  effects: {
    *getInspectorRectificationManageList({ payload, callback }, { call, put, update }) { //列表
      const result = yield call(services.GetInspectorRectificationManageList, payload);
      if (result.IsSuccess) {
        yield update({
          tableTotal: result.Total,
          tableDatas: result.Datas,
        })
      } else {
        message.error(result.Message)
      }
    },
    *getInspectorRectificationView({ payload, callback }, { call, put, update }) { //详情
      const result = yield call(services.GetInspectorRectificationView, payload);
      if (result.IsSuccess) {
        callback(result.Datas)
      } else {
        message.error(result.Message)
      }
    },
    *exportInspectorRectificationManage({ payload, callback }, { call, put, update }) { //导出
      const result = yield call(services.ExportInspectorRectificationManage, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        downloadFile(`${result.Datas}`)
      } else {
        message.error(result.Message)
      }
    },
    *updateRectificationStatus({ payload, callback }, { call, put, update }) { //修改状态
      const result = yield call(services.UpdateRectificationStatus, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback(result.IsSuccess);
      } else {
        message.error('数据发生改变，操作失败')
      }
    },
    *rejectInspectorRectificationInfo({ payload, callback }, { call, put, update }) { //整改驳回或申述驳回
      const result = yield call(services.RejectInspectorRectificationInfo, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback(result.IsSuccess);
      } else {
        message.error('数据发生改变，操作失败')
      }
    },
    *addSetUser({ payload, callback }, { call, put, update }) { //设置可以看到督察整改全部信息的人员信息
      const result = yield call(services.AddSetUser, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback&&callback(result.Datas)
      } else {
        message.error(result.Message)
      }
    },

    *getSetUser({ payload, callback }, { call, put, update }) { //获取可以看到督察整改全部信息的人员信息
      const result = yield call(services.GetSetUser, payload);
      if (result.IsSuccess) {
        callback&&callback(result.Datas)
      } else {
        message.error(result.Message)
      }
    },




  }
})