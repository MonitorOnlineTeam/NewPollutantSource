/*
 * @desc: 质控核查设置
 * @Author: jab
 * @Date: 2020.08.18
 */
import Model from '@/utils/model';
import moment from 'moment';
import {  message } from 'antd';
import {getCycleQualityControlList } from "./service"
export default Model.extend({
  namespace: 'qualitySet',
  state: {
    dgimn:"",
    cycleListParams:{
      PollutantCodeList: "",
      Cycle: 1,
      DGIMN: "",
      QCAType: 1026,
    },
    tableLoading:true,
    tableDatas:[],
    // defaultValue:1,
    cycleOptions:[{value:1,name:"1天"},{value:7,name:"7天"},{value:30,name:"30天"},{value:90,name:"季度"}]
  },
  effects: {
     // 质控核查 质控核查设置 列表
     *getCycleQualityControlList({callback, payload }, { call, update }) {
      yield update({ tableLoading:true  })
      const result = yield call(getCycleQualityControlList, payload);
      if (result.IsSuccess) {
        yield update({ tableDatas: result.Datas,tableLoading:false,total:result.Datas.length  })
      } else {
        message.error(result.Message)
      }
    },
  },
});
