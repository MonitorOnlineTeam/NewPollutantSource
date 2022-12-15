import moment from 'moment';
import { message } from 'antd';
import Model from '@/utils/model';
import { post, get } from '@/utils/request';
import { API } from '@config/API'

export default Model.extend({
  namespace: 'alarm',
  state: {
    alarmRecordDataList: [],
  },

  effects: {
    // 获取报警记录
    * getAlarmRecord({ payload }, { call, update, select }) {
      const result = yield call(_post, API.AlarmApi.GetAlarmRecord, payload);
      if (result.IsSuccess)
        yield update({
          alarmRecordDataList: result.Datas
        })
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
