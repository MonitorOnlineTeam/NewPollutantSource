// 运维任务列表
import moment from 'moment';
import { message } from 'antd';
import * as services from './services';
import Model from '@/utils/model';
// import { EnumRequstResult } from '../utils/enum';

export default Model.extend({
  namespace: 'sysTypeMiddlePage',
  state: {
    sysPollutantTypeList: [],
  },

  effects: {
    // 获取系统入口
    *getSysPollutantTypeList({ payload }, { call, update, select }) {
      const result = yield call(services.getSysPollutantTypeList);
      if (result.IsSuccess) {
        yield update({
          sysPollutantTypeList: result.Datas,
        })
      } else {
        message.error(result.Message)
      }
    },
  },
});
