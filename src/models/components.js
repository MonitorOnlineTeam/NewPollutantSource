import { message } from 'antd';
import * as services from '../services/components';
import Model from '@/utils/model';
import _ from 'lodash'

export default Model.extend({
  namespace: 'components',
  state: {
    treeRegionData: [],
    treeIndustryData: [],
    selectTreeItem: {},
  },
  effects: {
    // 获取导航树 - 数据
    * getTreeData({ payload }, { call, update, put, select }) {
      let state = yield select(state => state.components)
      const result = yield call(services.getTreeNodeData, payload);
      if (result.IsSuccess) {
        yield update({
          treeRegionData: result.Datas.regionData,
          treeIndustryData: result.Datas.induData,
          selectTreeItem: state.selectTreeItem.value ? state.selectTreeItem : result.Datas.firstData,
        })
      } else {
        message.error(result.Message)
      }
    },
  },
});
