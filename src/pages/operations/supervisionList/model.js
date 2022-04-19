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
    inspectorTypeItemList:[],
    entList:[],
    MaxNum:0,
    inspectorTypeList:[],
    assessmentMethodList:[],
  },
  effects: {
   //督查类别清单 列表
    *getInspectorTypeItemList({   payload, }, { call, update, select, put }) {
      const result = yield call(services.GetInspectorTypeItemList, { ... payload });
      if (result.IsSuccess) {
        yield update({
          inspectorTypeItemList: result.Datas.rtnList,
          MaxNum: result.Datas.MaxNum,
          inspectorTypeItemListTotal:result.Total,
        });
      } else {
        message.error(result.Message)
      }
    },
   //督查类别清单 添加or修改
   *addOrEditInspectorTypeItem({   payload,callback }, { call, update, select, put }) {
    const result = yield call(services.AddOrEditInspectorTypeItem, { ... payload });
    if (result.IsSuccess) {
      message.success(result.Message)
      callback()
    } else {
      message.error(result.Message)
    }
  },

    //督查类别 下拉列表
    *getInspectorTypeCode({   payload,callback }, { call, update, select, put }) {
      const result = yield call(services.GetInspectorTypeCode, { ... payload });
      if (result.IsSuccess) {
        yield update({inspectorTypeList: result.Datas.InspectorType?result.Datas.InspectorType :[],
                      assessmentMethodList: result.Datas.AssessmentMethod?result.Datas.AssessmentMethod :[],
                     });
      } else {
        message.error(result.Message)
      }
    },
   //督查类别清单 删除
   *deleteInspectorType({   payload,callback }, { call, update, select, put }) {
    const result = yield call(services.DeleteInspectorType, { ... payload });
    if (result.IsSuccess) {
      message.success(result.Message)
      callback()
    } else {
      message.error(result.Message)
    }
  },
    //督查类别清单 更改状态
   *changeInspectorTypeStatus({   payload,callback }, { call, update, select, put }) {
    const result = yield call(services.ChangeInspectorTypeStatus, { ... payload });
    if (result.IsSuccess) {
      message.success(result.Message)
      callback()
    } else {
      message.error(result.Message)
    }
  },
  }
  
})