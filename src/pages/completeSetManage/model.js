import * as services from './services';
import Model from '@/utils/model';
import { message } from 'antd';

export default Model.extend({
  namespace: 'completeSetManage',
  state: {
    regionalList: [],
    expertList: [],
  },
  effects: {
    // 获取大区
    *GetAllRegionalList({ payload }, { call, select, update }) {
      const result = yield call(services.GetAllRegionalList, payload);
      if (result.IsSuccess) {
        yield update({
          regionalList: result.Datas,
        });
      } else {
        message.error(result.Message);
      }
    },
    // 添加、编辑专家信息
    *InsOrUpdExpert({ payload, callback }, { call, select, update }) {
      const result = yield call(services.InsOrUpdExpert, payload);
      if (result.IsSuccess) {
        message.success('操作成功！');
        callback && callback();
      } else {
        message.error(result.Message);
      }
    },
    // 刪除专家信息
    *DeleteExpert({ payload, callback }, { call, select, update }) {
      const result = yield call(services.DeleteExpert, payload);
      if (result.IsSuccess) {
        message.success('刪除成功！');
        callback && callback();
      } else {
        message.error(result.Message);
      }
    },
    // 查询专家信息
    *GetExpertList({ payload, callback }, { call, select, update }) {
      const result = yield call(services.GetExpertList, payload);
      if (result.IsSuccess) {
        let expertList = [];

        result.Datas.map((item, index) => {
          if (item.Data) {
            item.Data.map((info, idx) => {
              expertList.push({
                ...info,
                Model: item.Model,
                rowSpan: idx === 0 ? item.Data.length : 0,
                index: index + 1,
              });
            });
          }
        });
        callback && callback(expertList, result.Datas);
      } else {
        message.error(result.Message);
      }
    },
  },
});
