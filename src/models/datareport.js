import Model from '@/utils/model';
import { message } from 'antd';
import { sdlMessage } from '@/utils/utils';
import moment from 'moment';
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
      reportwhere:[{
        Key: 'dbo__T_Bas_DataReporting__MonitorTime',
        Value: moment().format('YYYY-MM-01 00:00:00'),
        Where: '$gte',
     },{
         Key: 'dbo__T_Bas_DataReporting__MonitorTime',
         Value: moment(moment().format('YYYY-MM-01 00:00:00')).add(1,'month').add(-1,'second').format('YYYY-MM-DD 00:00:00'),
         Where: '$lt',
      }],
      selectEntCode:null,
      selectmonth:moment(),
      beginTime:moment().format('YYYY-MM-01 00:00:00'),
      endTime:moment(moment().format('YYYY-MM-01 00:00:00')).add(1,'month').add(-1,'second').format('YYYY-MM-DD 00:00:00')
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