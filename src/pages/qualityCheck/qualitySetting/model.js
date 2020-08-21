/*
 * @desc: 质控核查设置
 * @Author: jab
 * @Date: 2020.08.18
 */
import Model from '@/utils/model';
import moment from 'moment';
import {  message } from 'antd';
export default Model.extend({
  namespace: 'qualitySet',
  state: {
    dgimn:"",
    pollType:"",
    cycleOptions:[{value:"0",name:"1天"},{value:"1",name:"7天"},{value:"2",name:"30天"},{value:"3",name:"季度"}]
  },
  effects: {

  },
});
