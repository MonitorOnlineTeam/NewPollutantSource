//运维任务列表
import * as services from './service';
import Model from '@/utils/model';
import { message } from 'antd';

export default Model.extend({
  namespace: 'KBS',
  state: {
    KBSData: {},
    KBSMoreModalVisible: false,
    viewFileModalVisible: false,
  },

  effects: {
    // 修改运维人
    *getKBSData({ payload, callback }, { call, update, put, take, select }) {
      const result = yield call(services.getKBMList, payload);
      if (result.IsSuccess) {
        yield update({ KBSData: result.Datas });
      } else {
        message.error(result.Message)
      }
    },
    // 更新下载和查看次数
    *updViewForKBM({ payload, callback }, { call, update, put, take, select }) {
      const result = yield call(services.updViewForKBM, payload);
      if (result.IsSuccess) {
        callback && callback();
      } else {
        message.error(result.Message)
      }
    },

  }
});
