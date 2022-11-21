import moment from 'moment';
import { message } from 'antd';
// import * as services from './service';
import Model from '@/utils/model';
import { post, get, getNew } from '@/utils/request';
import { API } from '@config/API'

export default Model.extend({
  namespace: 'standingBook',
  state: {
    installationData: {},
  },

  effects: {
    // 获取排放源下设施列表(治理设施,生产,环保点位) InstallationType: 1=治理设施,2=生产,3=环保点位
    * GetInstallationByEmission({ payload }, { call, update, select }) {
      const result = yield call(_post, API.TYGTApi.GetInstallationByEmission, payload);
      if (result.IsSuccess)
        yield update({
          installationData: result.Datas
        })
    },
    // 关联设施
    * SetInstallation({ payload }, { call, update, put }) {
      console.log('payload', payload)
      // return;
      const result = yield call(_post, API.TYGTApi.SetInstallation, payload);
      if (result.IsSuccess) {
        yield put({
          type: 'updateState',
          payload: {
            governanceModalVisible: false,
            productionModalVisible: false
          }
        })
        message.success('关联成功！');
      }
    },
    // 添加排放源
    * AddEmission({ payload }, { call, update, put }) {
      console.log('payload', payload)
      // return;
      const result = yield call(_post, API.TYGTApi.AddEmission, payload);
      if (result.IsSuccess) {
        yield put({
          type: 'updateState',
          payload: {
            handleModalVisible: false,
          }
        })
        message.success('添加成功！');
      }
    },
    // 删除排放源
    * DeleteEmission({ payload }, { call, update, put }) {
      const result = yield call(_post, API.TYGTApi.DeleteEmission, payload);
      if (result.IsSuccess) {
        message.success('删除成功！');
      }
    },
  }
});

async function _post(url, params) {
  return post(url, params)
    .then(res => {
      if (res.IsSuccess) {
        return res;
      } else {
        message.error(e.Message)
        return false;
      }
    })
    .catch((error) => {
      console["error"](error);
      return error;
    });
}
