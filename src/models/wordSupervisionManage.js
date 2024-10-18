/*
 * @Author: outman0611
 * @Date: 2024-08-16 18:00:06
 * @LastEditors: outman0611
 * @LastEditTime: 2024-10-17 09:41:56
 * @Description: 
 */
import moment from 'moment';
import * as services from '../services/wordSupervisionManage';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config';
import { downloadFile,requestPost } from '@/utils/utils';
import { API } from '@config/API';

export default Model.extend({
  namespace: 'wordSupervisionManage',
  state: {
    allUserByOffice: [],
    allManager: [],
  },
  effects: {
    // 仪器借出、归还
    *StandbyAndInsLendOrReturn({ payload, callback }, { call, put, update }) {
      const result = yield call(services.StandbyAndInsLendOrReturn, payload);
      if (result.IsSuccess) {
        callback && callback();
        message.success('操作成功！');
      } else {
        result.Message && message.error(result.Message);
      }
    },
    // 办事处删除
    *DeleteOffice({ payload, callback }, { call, put, update }) {
      const result = yield call(services.DeleteOffice, payload);
      if (result.IsSuccess) {
        callback && callback();
        message.success('删除成功！');
      } else {
        result.Message && message.error(result.Message);
      }
    },
    // 获取办事处人员 新
    *GetOfficeUserList({ payload, callback }, { call, select, update }) {
      const result = yield call( requestPost, `${API.GeneralManagerApi.GetOfficeUserList}`, payload,);
      if (result.IsSuccess) {
        yield update({
          allUserByOffice: result.Datas,
        });
      } 
    },
    // 获取办事处人员(已经选过的办事处用户不会出现)
    // *GetAllUserByOffice({ payload, callback }, { call, put, update }) {
    //   const result = yield call(services.GetAllUserByOffice, payload);
    //   if (result.IsSuccess) {
    //     yield update({
    //       allUserByOffice: result.Datas,
    //     });
    //   } else {
    //     result.Message && message.error(result.Message);
    //   }
    // },
    // 绑定办事处人员
    *InsertOfficeByUser({ payload, callback }, { call, put, update }) {
      const result = yield call(services.InsertOfficeByUser, payload);
      if (result.IsSuccess) {
        message.success('操作成功！');
        callback && callback();
      } else {
        result.Message && message.error(result.Message);
      }
    },
    // 获取已绑定的办事处用户
    *GetUserByOfficeCode({ payload, callback }, { call, put, update }) {
      const result = yield call(services.GetUserByOfficeCode, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        result.Message && message.error(result.Message);
      }
    },
    // 获取所有经理
    *GetAllManager({ payload, callback }, { call, put, update }) {
      const result = yield call(services.GetAllManager, payload);
      if (result.IsSuccess) {
        yield update({
          allManager: result.Datas
        })
      } else {
        result.Message && message.error(result.Message);
      }
    },
    // 办事处设置经理
    *SetOfficeManager({ payload, callback }, { call, put, update }) {
      const result = yield call(services.SetOfficeManager, payload);
      if (result.IsSuccess) {
        message.success('设置成功！');
        callback && callback(result.Datas);
      } else {
        result.Message && message.error(result.Message);
      }
    },
  },
});
