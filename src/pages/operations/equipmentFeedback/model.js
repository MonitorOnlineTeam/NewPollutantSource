import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'equipmentFeedback',
  state: {

  },
  effects: {
   //地图 获取监测点infoWindow数据
    *getInfoWindowData({   payload, }, { call, update, select, put }) {
      yield update({ infoWindowDataLoading: true })
      const result = yield call(services.GetPollutantList, { pollutantTypes: payload.pollutantTypes });
      if (result.IsSuccess) {
        yield put({ type: "getInfoWindowPollutantList", payload: payload, pollutantList: result.Datas });
      } else {
        message.error(result.Message)
      }
    },
  }

})