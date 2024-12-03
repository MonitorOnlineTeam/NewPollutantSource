import Model from '@/utils/model';
import * as services from '../services/commonApi';
import moment from 'moment';
import { message } from 'antd';
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'ctCommon',
  state: { 
    // largeRegionList: [],
  },
  effects: {
    //服务大区
    *GetLargeRegionList({ payload, callback }, { call, put, update, select }) {
      const result = yield call(services.GetCtLargeRegionList, { ...payload });
      // if (result.IsSuccess) {
      //   yield update({ largeRegionList: result.Datas });
      // }
      callback && callback(result.Datas)
    },

  }
});
