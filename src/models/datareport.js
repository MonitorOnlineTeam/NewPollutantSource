import Model from '@/utils/model';
import { message } from 'antd';
import { sdlMessage } from '@/utils/utils';
import {
    getDataReportUserAndEntInfo,
    addDataReport,
    deleteDataReport
  } from '../services/dataReportApi';

  /*
数据上报
add by zhb
modify by
*/
export default Model.extend({
    namespace: 'datareport',
    state: {
      userandentInfo: null,
    },
    subscriptions: {
      setup({ dispatch, history }) {
        history.listen(location => { });
      },
    },
    effects: {
        *getDataReportUserAndEntInfo({ payload }, { call, update }) {
          debugger;
            const result = yield call(getDataReportUserAndEntInfo, {
              ...payload,
            });
            if (result.IsSuccess) {
              yield update({
                userandentInfo: result.Datas,
              });
            } else {
              yield update({
                userandentInfo: null,
              });
            }
          },
          *addDataReport({ payload }, { call, update }) {
         
            const result = yield call(addDataReport, {
              ...payload,
            });

            if (result.IsSuccess) {
              sdlMessage('操作成功！', 'success');
            } else {
              sdlMessage(result.Message, 'error');
            }

            payload.callback(result);
          },
          *deleteDataReport({ payload }, { call, update }) {
         
            const result = yield call(deleteDataReport, {
              ...payload,
            });
            if (result.IsSuccess) {
              sdlMessage(result.Message, 'success');
            } else {
              sdlMessage(result.Message, 'error');
            }
            payload.callback();
          },
    }})