import moment from 'moment';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config';
import { downloadFile, requestPost } from '@/utils/utils';
import { API } from '@config/API';
export default Model.extend({
  namespace: 'siteInspecTempSet',
  state: {
    inspectorTypeItemList: [],
    inspectorTypeList: [],
    cemsModelNameList: [], //系统型号
    inspectorTemplateList: [],
    inspectorTemplateListTotal: 0,
    inspectorTemplateView: [],
  },
  effects: {
    //督查类别清单 列表
    *GetOnsiteInspectionTypeList({ payload }, { call, update, select, put }) {
      const result = yield call(
        requestPost,
        API.DailyManagement.SiteQualityInspeTemplate.GetOnsiteInspectionTypeList,
        payload,
      );
      if (result.IsSuccess) {
        yield update({
          inspectorTypeItemList: result.Datas,
          inspectorTypeItemListTotal: result.Total,
        });
      }
    },
    //督查类别清单 添加or修改
    *AddOrUpdateOnsiteInspectionType({ payload, callback }, { call, update, select, put }) {
      const result = yield call(
        requestPost,
        API.DailyManagement.SiteQualityInspeTemplate.AddOrUpdateOnsiteInspectionType,
        payload,
      );
      if (result.IsSuccess) {
        message.success(result.Message);
        callback();
      }
    },

    //系统型号 下拉列表
    *GetMonitorCategorySystemList({ payload, callback }, { call, update, select, put }) {
      const result = yield call(
        requestPost,
        API.CtAssetManagementApi.GetMonitorCategorySystemList,
        payload,
      );
      if (result.IsSuccess) {
        yield update({
          cemsModelNameList: result.Datas?.CategoryList || [],
        });
      }
    },
    //督查类别清单 删除
    *DeleteOnsiteInspectionType({ payload, callback }, { call, update, select, put }) {
      const result = yield call(
        requestPost,
        API.DailyManagement.SiteQualityInspeTemplate.DeleteOnsiteInspectionType,
        payload,
      );
      if (result.IsSuccess) {
        message.success(result.Message);
        callback();
      }
    },
    //督查类别清单 更改状态
    *ChangeOnsiteInspectionTypeStatus({ payload, callback }, { call, update, select, put }) {
      const result = yield call(
        requestPost,
        API.DailyManagement.SiteQualityInspeTemplate.ChangeOnsiteInspectionTypeStatus,
        { ...payload },
      );
      if (result.IsSuccess) {
        message.success(result.Message);
        callback();
      }
    },

    /***********督查模板****************/

    //列表
    *GetOnsiteInspectionInfoList({ payload }, { call, update, select, put }) {
      const result = yield call(
        requestPost,
        API.DailyManagement.SiteQualityInspeTemplate.GetOnsiteInspectionInfoList,
        { ...payload },
      );
      if (result.IsSuccess) {
        yield update({
          inspectorTemplateList: result.Datas,
          inspectorTemplateListTotal: result.Total,
        });
      }
    },
    // 添加or修改
    *AddOrUpdateOnsiteInspectionInfo({ payload, callback }, { call, update, select, put }) {
      if (payload.ChildList && payload.ChildList[0]) {
        const result = yield call(
          requestPost,
          API.DailyManagement.SiteQualityInspeTemplate.AddOrUpdateOnsiteInspectionInfo,
          { ...payload },
        );
        if (result.IsSuccess) {
          message.success(result.Message);
          callback();
        }
      } else {
        message.warning('模板数据不能为空');
      }
    },
    // 删除
    *DeleteOnsiteInspectionInfo({ payload, callback }, { call, update, select, put }) {
      const result = yield call(
        requestPost,
        API.DailyManagement.SiteQualityInspeTemplate.DeleteOnsiteInspectionInfo,
        { ...payload },
      );
      if (result.IsSuccess) {
        message.success(result.Message);
        callback();
      }
    },
    // 更改模板状态
    *ChangeOnsiteInspectionInfoStatus({ payload, callback }, { call, update, select, put }) {
      const result = yield call(
        requestPost,
        API.DailyManagement.SiteQualityInspeTemplate.ChangeOnsiteInspectionInfoStatus,
        { ...payload },
      );
      if (result.IsSuccess) {
        message.success(result.Message);
        callback();
      }
    },
    // 督查模板详细
    *GetOnsiteInspectionInfoDetail({ payload, callback }, { call, update, select, put }) {
      const result = yield call(
        requestPost,
        API.DailyManagement.SiteQualityInspeTemplate.GetOnsiteInspectionInfoDetail,
        { ...payload },
      );
      if (result.IsSuccess) {
        yield update({ inspectorTemplateView: result.Datas?.rtnlist || [] });
        callback(result.Datas?.rtnlist);
      }
    },
    // 根据CEMS型号获取检查项目
    *GetInspectionTypeByCemsModel({ payload, callback }, { call, update, select, put }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.SiteQualityInspection.GetInspectionTypeByCemsModel,
        payload,
      );
      if (result.IsSuccess) {
        callback(result.Datas);
      }
    },
  },
});
