import Model from '@/utils/model';
import { requestPost, requestGet } from '@/utils/utils';
import { API } from '@config/API';
import { message } from 'antd';

export default Model.extend({
  namespace: 'projectManage',
  state: {
    projectList: [],
    allUser: [],
    currentProjectID: undefined,
  },

  effects: {
    // 获取所有项目
    *GetUserProjectList({ payload, callback }, { call, select, update }) {
      if (configInfo.IsOpenAQI === '1') {
        callback && callback([]);
        yield update({
          projectList: [],
        });
      } else {
        const result = yield call(
          requestPost,
          `${API.SystemManageApi.GetUserProjectList}`,
          payload,
        );
        if (result.IsSuccess) {
          callback && callback(result.Datas);
          yield update({
            projectList: result.Datas,
          });
        }
      }
    },
    //  获取所有用户
    *getAllUser({ payload }, { call, update }) {
      const result = yield call(requestPost, `${API.AuthorityApi.GetAllUser}`, payload);
      if (result.IsSuccess) {
        yield update({
          allUser: result.Datas,
        });
      }
    },
    //  保存关联用户
    *InsertProjectUser({ payload }, { call, update }) {
      const result = yield call(requestPost, `${API.SystemManageApi.InsertProjectUser}`, payload);
      if (result.IsSuccess) {
        message.success('操作成功');
      }
    },
    // 获取已保存关联用户
    *GetProjectUserList({ payload, callback }, { call, update }) {
      const result = yield call(requestPost, `${API.SystemManageApi.GetProjectUserList}`, payload);
      if (result.IsSuccess) {
        callback(result.Datas);
      }
    },
    // 保存关联点位权限
    *InsertProjectUserPoint({ payload, callback }, { call, update }) {
      const result = yield call(
        requestPost,
        `${API.SystemManageApi.InsertProjectUserPoint}`,
        payload,
      );
      if (result.IsSuccess) {
        callback();
      }
    },
    // 获取已保存关联点位权限
    *GetProjectPointList({ payload, callback }, { call, update }) {
      const result = yield call(requestPost, `${API.SystemManageApi.GetProjectPointList}`, payload);
      callback && callback(result);
    },
    // 切换项目
    *UpdateUserProject({ payload, callback }, { call, update }) {
      const result = yield call(requestPost, `${API.SystemManageApi.UpdateUserProject}`, payload);
      if (result.IsSuccess) {
        yield update({
          currentProjectID: payload.projectCode,
        });
        callback && callback();
      }
    },
    // 编辑项目
    *UpdateOrAddUserProject({ payload, callback }, { call, update }) {
      const result = yield call(
        requestPost,
        `${API.SystemManageApi.UpdateOrAddUserProject}`,
        payload,
      );
      if (result.IsSuccess) {
        message.success('更新成功！');
        callback();
      }
    },
    // 获取当前项目
    *GetUserProject({ payload, callback }, { call, update }) {
      const result = yield call(requestPost, `${API.SystemManageApi.GetUserProject}`, payload);
      if (result.IsSuccess) {
        yield update({
          currentProjectID: result.Datas,
        });
      }
    },
    // 删除项目
    *DeleteUserProject({ payload, callback }, { call, update }) {
      const result = yield call(requestPost, `${API.SystemManageApi.DeleteUserProject}`, payload);
      if (result.IsSuccess) {
        callback();
        message.success('删除成功');
      }
    },
  },
});
