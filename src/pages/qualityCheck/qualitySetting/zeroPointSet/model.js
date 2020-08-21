/*
 * @desc: 质控核查设置
 * @Author: jab
 * @Date: 2020.08.18
 */
import Model from '@/utils/model';
import moment from 'moment';
import {  message } from 'antd';
export default Model.extend({
  namespace: 'zeroPointSet',
  state: {
    dgimn:"",
    pollType:"",
    tableDatas:[]

  },
  effects: {

  },
});
