import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'supervisionList',
  state: {
    inspectorTypeItemList: [],
    entList: [],
    MaxNum: 0,
    inspectorTypeList: [],
    assessmentMethodList: [],
    inspectorTemplateList: [],
    inspectorTemplateListTotal: 0,
    inspectorTypeDescList:[],//类别描述
    inspectorTemplateView:[],
  },
  effects: {
    //督查类别清单 列表
    *getInspectorTypeItemList({ payload, }, { call, update, select, put }) {
      const result = yield call(services.GetInspectorTypeItemList, { ...payload });
      if (result.IsSuccess) {
        yield update({
          inspectorTypeItemList: result.Datas.rtnList,
          MaxNum: result.Datas.MaxNum,
          inspectorTypeItemListTotal: result.Total,
        });
      } else {
        message.error(result.Message)
      }
    },
    //督查类别清单 添加or修改
    *addOrEditInspectorTypeItem({ payload, callback }, { call, update, select, put }) {
      const result = yield call(services.AddOrEditInspectorTypeItem, { ...payload });
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      } else {
        message.error(result.Message)
      }
    },

    //督查类别 下拉列表
    *getInspectorTypeCode({ payload, callback }, { call, update, select, put }) {
      const result = yield call(services.GetInspectorTypeCode, { ...payload });
      if (result.IsSuccess) {
        yield update({
          inspectorTypeList: result.Datas.InspectorType ? result.Datas.InspectorType : [],
          assessmentMethodList: result.Datas.AssessmentMethod ? result.Datas.AssessmentMethod : [],
        });
      } else {
        message.error(result.Message)
      }
    },
    //督查类别清单 删除
    *deleteInspectorType({ payload, callback }, { call, update, select, put }) {
      const result = yield call(services.DeleteInspectorType, { ...payload });
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      } else {
        message.error(result.Message)
      }
    },
    //督查类别清单 更改状态
    *changeInspectorTypeStatus({ payload, callback }, { call, update, select, put }) {
      const result = yield call(services.ChangeInspectorTypeStatus, { ...payload });
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      } else {
        message.error(result.Message)
      }
    },

    /***********督查模板****************/

    //列表
    *getInspectorTemplateList({ payload, }, { call, update, select, put }) {
      const result = yield call(services.GetInspectorTemplateList, { ...payload });
      if (result.IsSuccess) {
        yield update({
          inspectorTemplateList: result.Datas,
          inspectorTemplateListTotal: result.Total,
        });
      } else {
        message.error(result.Message)
      }
    },
    // 添加or修改
    *addOrEditInspectorTemplate({ payload, callback }, { call, update, select, put }) {
      
      if(payload.InspectorTemplateList&&payload.InspectorTemplateList[0]){
       const result = yield call(services.AddOrEditInspectorTemplate, { ...payload });
        if (result.IsSuccess) {
         message.success(result.Message)
        callback()
       } else {
        message.error(result.Message)
       }
      }else{
      message.warning('模板数据不能为空')
    }
    },
    // 删除
    *deleteInspectorTemplate({ payload, callback }, { call, update, select, put }) {
      const result = yield call(services.DeleteInspectorTemplate, { ...payload });
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      } else {
        message.error(result.Message)
      }
    },
    // 类别描述
    *getInspectorTypeList({ payload, callback }, { call, update, select, put }) {
      const result = yield call(services.GetInspectorTypeList, { ...payload });
      if (result.IsSuccess) {
        yield update({
          inspectorTypeDescList: result.Datas,
        });
        callback()
      } else {
        message.error(result.Message)
      }
    },
    // 更改模板状态
    *changeInspectorTemplateStatus({ payload, callback }, { call, update, select, put }) {
      const result = yield call(services.ChangeInspectorTemplateStatus, { ...payload });
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      } else {
        message.error(result.Message)
      }
    },
    // 督察模板详细
    *getInspectorTemplateView({ payload, callback }, { call, update, select, put }) {
      const result = yield call(services.GetInspectorTemplateView, { ...payload });
      if (result.IsSuccess) {
        yield update({ inspectorTemplateView: result.Datas.rtnlist,  });
        callback(result.Datas.rtnlist)
      } else {
        message.error(result.Message)
      }
    },
  }

})