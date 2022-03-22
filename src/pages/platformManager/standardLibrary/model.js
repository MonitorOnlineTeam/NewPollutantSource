import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'

export default Model.extend({
  namespace: 'standardLibraryManager',
  state: {
    libraryEditData: {},
  },
  effects: {
    // 删除标准库
    *delLibrary({ payload }, { call, put }) {
      const result = yield call(services.deleteStandardLibrary, payload);
      if (result.IsSuccess) {
        message.success("操作成功");
        yield put({ type: "autoForm/getAutoFormData" })
      } else {
        message.error(result.Message)
      }
    },
    // 添加标准库
    *addLibrary({ payload }, { call, put }) {
      const result = yield call(services.addStandardLibrary, payload);
      if (result.IsSuccess) {
        message.success("添加成功");
        router.push("/platformconfig/StandardLibrary")
        // yield put({ type: "autoForm/getAutoFormData" })
      } else {
        message.error(result.Message)
      }
    },
    // 编辑标准库 - 获取数据
    *getEditData({ payload }, { call, update, put }) {
      const result = yield call(services.getStandardLibraryByID, payload);
      if (result.IsSuccess) {
        yield put({
          type: "common/getAllPollutantCode",
          payload: {
            pollutantTypes: result.Datas.PollutantType
          }
        })
        yield update({
          libraryEditData: result.Datas
        })
      } else {
        message.error(result.Message)
      }
    },
    // 编辑标准库 - 保存
    *updateLibrary({ payload }, { call, put }) {
      const result = yield call(services.updateStandardLibrary, payload);
      if (result.IsSuccess) {
        message.success("修改成功");
        router.push("/platformconfig/StandardLibrary")
      } else {
        message.error(result.Message)
      }
    }
  },
})