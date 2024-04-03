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
    // 获取服务热线列表
    *GetServiceHotlineList({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.CtAPI_WJQ.HotPhone.GetServiceHotlineList, payload);
      if (result.IsSuccess) {
        callback && callback(result);
      }
    },
    // 添加或编辑服务热线
    *AddOrUpdateServiceHotline({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.HotPhone.AddOrUpdateServiceHotline,
        payload,
      );
      if (result.IsSuccess) {
        callback && callback(result);
      }
    },
    // 删除服务热线
    *DeleteServiceHotline({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.CtAPI_WJQ.HotPhone.DeleteServiceHotline, payload);
      if (result.IsSuccess) {
        message.success('删除成功！');
        callback && callback(result);
      }
    },
    // 导出服务热线
    *ExportServiceHotline({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.CtAPI_WJQ.HotPhone.ExportServiceHotline, payload);
      if (result.IsSuccess) {
        message.success('导出成功！');
        downloadFile(result.Datas);
      }
    },

    // 获取客户投诉列表
    *GetCustomerComplaintsList({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.HandleComplaints.GetCustomerComplaintsList,
        payload,
      );
      if (result.IsSuccess) {
        callback && callback(result);
      }
    },
    // 添加或编辑客户投诉
    *AddOrEditCustomerComplaints({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.HandleComplaints.AddOrEditCustomerComplaints,
        payload,
      );
      if (result.IsSuccess) {
        callback && callback(result);
      }
    },
    // 获取客户投诉项目列表
    *GetCustomerComplaintsProject({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.HandleComplaints.GetCustomerComplaintsProject,
        payload,
      );
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      }
    },
    // 获取客户投诉详情
    *GetCustomerComplaintsView({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.HandleComplaints.GetCustomerComplaintsView,
        payload,
      );
      if (result.IsSuccess) {
        callback && callback(result.Datas[0]);
      }
    },
    // 导出 - 客户投诉项目列表
    *ExportCustomerComplaints({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.HandleComplaints.ExportCustomerComplaints,
        payload,
      );
      if (result.IsSuccess) {
        message.success('导出成功！');
        downloadFile(result.Datas);
      }
    },
    // 处理投诉
    *HandleCustomerComplaints({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.HandleComplaints.HandleCustomerComplaints,
        payload,
      );
      if (result.IsSuccess) {
        callback && callback(result.Datas[0]);
      }
    },
    // 删除客户投诉
    *DeleteCustomerComplaints({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.HandleComplaints.DeleteCustomerComplaints,
        payload,
      );
      if (result.IsSuccess) {
        message.success('删除成功！');
        callback && callback();
      }
    },
  },
});
