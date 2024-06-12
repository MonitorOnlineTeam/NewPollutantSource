//省区经理管理
import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'provincialManager',
  state: {
    tableDatas: [],
    tableTotal: 0,
    tableDetailDatas: {},
  },
  effects: {
    // 列表
    *GetProvinceManagerList({ payload, }, { call, update, select, put }) {
      const result = yield call(services.GetProvinceManagerList, { ...payload });
      if (result.IsSuccess) {
        yield update({
          tableDatas: result.Datas,
          tableTotal: result.Total,
        });
      } else {
        message.error(result.Message)
      }
    },
    // 添加or修改
    *AddorUpdateProvinceManager({ payload, callback }, { call, update, select, put }) {
      const result = yield call(services.AddorUpdateProvinceManager, { ...payload });
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      } else {
        message.error(result.Message)
      }
    },

    // 删除
    *DeleteProvinceManager({ payload, callback }, { call, update, select, put }) {
      const result = yield call(services.DeleteProvinceManager, { ...payload });
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      } else {
        message.error(result.Message)
      }
    },
    //详情
    *GetProvinceManagerByID({ payload, callback }, { call, update, select, put }) {
      const result = yield call(services.GetProvinceManagerByID, { ...payload });
      if (result.IsSuccess) {
        yield update({  tableDetailDatas: result.Datas?.length? result.Datas[0] : {},});
      } else {
        message.error(result.Message)
      }
    },
  }

})