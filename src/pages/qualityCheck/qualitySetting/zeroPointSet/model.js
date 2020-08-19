/*
 * @desc: 标气管理
 * @Author: jab
 * @Date: 2020.08.13
 */
import Model from '@/utils/model';
import { getQCAStandardManagement  } from './service';
import moment from 'moment';
import {  message } from 'antd';

export default Model.extend({
  namespace: 'qualitySet',
  state: {
    pollutantlist :[],
    tableDatas: [],
    columns:[],
    total:"",
    tableLoading:true,
    standardParams: {
      DGIMN: "",
      BeginTime: moment(new Date()).add(-1, 'month').format('YYYY-MM-DD HH:mm:ss'),
      EndTime: moment().format("YYYY-MM-DD HH:mm:ss"),
    }
  },
  effects: {


    // 导出报表
        *exportStandardData({ payload }, { call, put, update, select }) {
          const { historyparams } = yield select(state => state.historyData);
          const postData = {  ...historyparams,DGIMNs: historyparams.DGIMN,...payload,
          }
          const result = yield call(exportHistoryReport, postData);
          if (result.IsSuccess) {
            window.open(result.Datas)
            message.success('导出成功')
          } else {
            message.error(result.Message)
          }
        },
  }


});
