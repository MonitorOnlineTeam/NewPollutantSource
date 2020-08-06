/*
 * @desc: 历史数据
 * @Author: jab
 * @Date: 2020.07.30
 */
import Model from '@/utils/model';
import { getAllTypeDataList , getpollutantListByDgimn } from './service';
import { formatPollutantPopover } from '@/utils/utils';
import moment from 'moment';

export default Model.extend({
  namespace: 'historyData',
  state: {
    tableDatas: [],
    total:"",
    loading:true,
    // historyparams: {
    //   datatype: 'realtime',
    //   DGIMNs: null,
    //   pageIndex: null,
    //   pageSize: null,
    //   beginTime: moment().startOf('day').format("YYYY-MM-DD HH:mm:ss"),
    //   endTime: moment().format("YYYY-MM-DD HH:mm:ss"),
    //   pollutantCodes: null,
    //   pollutantNames: null,
    //   unit: null,
    //   isAsc: true,
    //   DGIMN: '',
    // },
  },
  effects: {
    * getAllTypeDataList( { payload, },{ call, update,  put, take,  select }) {
      // const { dgimn, beginTime, endTime, packageType, pageIndex, pageSize, dataType } = yield select(state => state.historyparams); //获取state的值
      // console.log("dgimn=", dgimn);
      const body = {
        ...payload
      }
      const result = yield call(getAllTypeDataList, { ...body });
      if (result.IsSuccess) {
        yield update({ tableDatas: result.Datas, total: result.Total,loading:false }); //更新state的值
      }
    },
  },
});
