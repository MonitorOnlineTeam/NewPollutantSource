//运维任务列表
import * as services from './service';
import Model from '@/utils/model';
import { message } from 'antd';

export default Model.extend({
  namespace: 'qualityUser',
  state: {
    qualityUserList: [],
    handleUserModalVisible: false,
    viewUserModalVisible: false,
    viewUserData: {},
  },

  effects: {
    *getQualityUserList({ payload, }, { call, update, put, take, select }) {
      const result = yield call(services.getQualityUserList, payload);
      if (result.IsSuccess) {
        yield update({ qualityUserList: result.Datas })
      } else {
        message.error(result.Message)
      }
    },
    // 删除运维人
    *delOperatorUser({ payload, callback }, { call, update, put, take, select }) {
      const result = yield call(services.delOperatorUser, payload);
      if (result.IsSuccess) {
        message.success("删除成功");
        callback && callback()
      } else {
        message.error(result.Message)
      }
    },
    // 添加运维人
    *addOperator({ payload, callback }, { call, update, put, take, select }) {
      const result = yield call(services.addOperator, payload);
      if (result.IsSuccess) {
        message.success("添加成功");
        yield update({ handleUserModalVisible: false });
        yield put({ type: "getQualityUserList", payload: {} })
      } else {
        message.error(result.Message)
      }
    },
    // 修改运维人
    *updateOperatorUser({ payload, callback }, { call, update, put, take, select }) {
      const result = yield call(services.updateOperatorUser, payload);
      if (result.IsSuccess) {
        message.success("修改成功");
        yield update({ handleUserModalVisible: false });
        yield put({ type: "getQualityUserList", payload: {} })
      } else {
        message.error(result.Message)
      }
    },
    // 获取查看运维人
    *getViewUser({ payload, edit }, { call, update, put, take, select }) {
      const result = yield call(services.getViewUser, payload);
      if (result.IsSuccess) {
        yield update({ viewUserData: result.Datas, handleUserModalVisible: edit ? true : false })
      } else {
        message.error(result.Message)
      }
    },


  }
});
