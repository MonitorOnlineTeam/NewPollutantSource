import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'projectManageAuthor',
  state: {
    tableDatas: [],
    tableTotal: 0,
    projectAuthorList:[],
    projectAuthorListTotal: 0,
    userList:[],
  },
  effects: {
    *getProjectAuthorList({ payload, callback }, { call, put, update }) { //项目权限列表
      const result = yield call(services.GetProjectAuthorList, payload);
      if (result.IsSuccess) {
        yield update({
          tableTotal: result.Total,
          tableDatas:result.Datas? result.Datas:[],
        })
      } else {
        message.error(result.Message)
      }
    },
    *addProjectAuthor({ payload, callback }, { call, put, update }) { //分配项目权限
      const result = yield call(services.AddProjectAuthor, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      } else {
        message.error(result.Message)
      }
    },
    *getAddProjectAuthorList({ payload, callback }, { call, put, update }) { //获取当前人员未分配的项目权限
      const result = yield call(services.GetAddProjectAuthorList, payload);
      if (result.IsSuccess) {
        yield update({
          projectAuthorListTotal: result.Total,
          projectAuthorList:result.Datas? result.Datas.map(item=>{return {...item,}}):[],
        })
      } else {
        message.error(result.Message)
      }
    },
    *deleteProjectAuthor({ payload, callback }, { call, put, update }) { //删除项目权限
      const result = yield call(services.DeleteProjectAuthor, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      } else {
        message.error(result.Message)
      }
    },
    *getUserList({ payload, callback }, { call, put, update }) { //角色列表
      const result = yield call(services.GetUserList, payload);
      if (result.IsSuccess) {
        yield update({ userList: result.Datas? result.Datas : []})
        callback&&callback( result.Datas? result.Datas[0] : null)
      } else {
        message.error(result.Message)
      }
    },
   

  },
})