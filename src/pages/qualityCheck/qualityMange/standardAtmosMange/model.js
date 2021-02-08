/*
 * @desc: 标气管理
 * @Author: jab
 * @Date: 2020.08.13
 */
import Model from '@/utils/model';
import { getQCAStandardManagement,exportDatas  } from './service';
import moment from 'moment';
import {  message } from 'antd';
import { downloadFile} from '@/utils/utils';

export default Model.extend({
  namespace: 'standardData',
  state: {
    pollutantlist :[],
    tableDatas: [],
    columns:[],
    total:"",
    tableLoading:true,
    standardParams: {
      DGIMN: "",
      BeginTime: moment(new Date()).add(-1, 'year').format('YYYY-MM-DD HH:mm:ss'),
      EndTime: moment().format("YYYY-MM-DD HH:mm:ss"),
    }
  },
  effects: {
     // 获取数据获取率 - 详情污染物列表
        *getQCAStandardList({callback, payload }, { call, update }) {
          yield update({ tableLoading:true  })
          const result = yield call(getQCAStandardManagement, payload);
          if (result.IsSuccess) {
            yield update({ tableDatas: result.Datas,tableLoading:false,total:result.Datas.length  })
          } else {
            message.error(result.Message)
          }
        },

    // 导出数据
        *exportDatas({ payload }, { call, put, update, select }) {
          const result = yield call(exportDatas, payload);
          if (result.IsSuccess) {
            downloadFile(`/upload${result.Datas}`)
          } else {
            message.error(result.Message)
          }
        },
  }


});
