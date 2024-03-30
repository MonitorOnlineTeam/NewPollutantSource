import moment from 'moment';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config';
import { downloadFile, requestPost } from '@/utils/utils';
import { API } from '@config/API';

export default Model.extend({
  namespace: 'customer',
  state: {
    largeRegionList: [],
  },
  effects: {
    // 客户回访统计列表
    *GetCustomerVisitList({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.CustomerReturnVisit.GetCustomerVisitList,
        payload,
      );
      if (result.IsSuccess) {
        callback && callback(result);
      }
    },
    // 获取单个客户回访记录
    *GetCustomerVisitInfor({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        `${API.CtAPI_WJQ.CustomerReturnVisit.GetCustomerVisitInfor}?ID=${payload.ID}`,
        {},
      );
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      }
    },
    // 导出客户回访记录
    *ExportCustomerVisitList({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.CustomerReturnVisit.ExportCustomerVisitList,
        payload,
      );
      if (result.IsSuccess) {
        message.success('导出成功！');
        downloadFile(result.Datas);
      }
    },
    // 获取所属大区
    *getLargeRegion({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.CtAPI_WJQ.DisciplineCheck.GetRegionList, payload);
      if (result.IsSuccess) {
        yield update({
          largeRegionList: result.Datas,
        });
      }
    },
    // 删除客户回访记录
    *DeleteReturnVisitCustomers({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        `${API.CtAPI_WJQ.CustomerReturnVisit.DeleteReturnVisitCustomers}?ID=${payload.ID}`,
        {},
      );
      if (result.IsSuccess) {
        callback && callback();
        message.success('删除成功！');
      }
    },
  },
});
