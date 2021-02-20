/*
 * @desc: 污染物列表
 * @Author: jab
 * @Date: 2020.08.18
 */
import Model from '@/utils/model';
import { querypollutantlist } from '../services/baseapi'
import moment from 'moment';
import {  message } from 'antd';
export default Model.extend({
  namespace: 'pollutantListData',
  state: {
    pollutantlist :[],
    pollutantCode:[],
  },
  effects: {
     // 获取数据获取率 - 详情污染物列表
        *getPollutantList({callback, payload }, { call, update }) {

          
          const result = yield call(querypollutantlist, payload);
          
          const pollutantCode = result.map((item,index)=>{
                  
            return  item.PollutantCode
         })
         yield update({ pollutantlist: result, pollutantCode:pollutantCode})
          callback(result)
          // if (result.IsSuccess) {
          //   yield update({ pollutantlist: result.Datas  })
          //   callback(result.Datas)

          // } 
        }
  },
});