/*
 * @desc: 污染物列表
 * @Author: jab
 * @Date: 2020.08.18
 */
import Model from '@/utils/model';
import { querypollutantlist } from '../../../services/baseapi'
import { formatPollutantPopover } from '@/utils/utils';
import moment from 'moment';
import {  message } from 'antd';
import { red,yellow } from '@ant-design/colors';
export default Model.extend({
  namespace: 'qualitySet',
  state: {
    dgimn:"yastqsn0000002",
  },
  effects: {

  },
});
