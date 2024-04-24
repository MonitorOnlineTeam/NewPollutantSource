import moment from 'moment';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile, requestPost } from '@/utils/utils';
import { API } from '@config/API'

export default Model.extend({
  namespace: 'generalManager',
  state: {
    carTableDatas: [],
    carTableTotal: 0,
    carQueryPar: {},
    carTableLoading: false,
    userTableDatas: [],
    userTableTotal: 0,
    userQueryPar: {},
    provinceTableDatas: [],
    provinceTableTotal: 0,
    provinceQueryPar: {},
  },
  effects: {
    /*车辆管理 */
    *GetCarList({ payload, callback }, { call, put, update }) { //获取车辆信息
      !payload.id ? yield update({ carTableLoading: true }) : null
      const result = yield call(requestPost, API.GeneralManagerApi.GetCarList, payload);
      if (result.IsSuccess) {
        if (payload.id) {
          callback && callback(result.Datas ? result.Datas : {})
        } else {
          yield update({
            carTableDatas: result.Datas,
            carTableTotal: result.Total,
            carQueryPar: payload,
          })
        }
      } else {
        message.error(result.Message)
        callback && callback({})
      }
      !payload.id ? yield update({ carTableLoading: false }) : null
    },
    *ExportCarList({ payload, callback }, { call, put, update }) { //车辆信息 导出
      const result = yield call(requestPost, API.GeneralManagerApi.ExportCarList, payload);
      if (result.IsSuccess) {
        message.success('下载成功');
        downloadFile(`${result.Datas}`);
      } else {
        message.error(result.Message);
      }
    },
    /*人员管理 */
    *GetUserList({ payload, callback }, { call, put, update }) { //获取人员档案
      const result = yield call(requestPost, API.GeneralManagerApi.GetUserList, payload);
      if (result.IsSuccess) {
        yield update({
          userTableDatas: result.Datas,
          userTableTotal: result.Total,
          userQueryPar: payload,
        })
      } else {
        message.error(result.Message)
      }
    },
    *ExportUserList({ payload, callback }, { call, put, update }) { //人员档案 导出
      const result = yield call(requestPost, API.GeneralManagerApi.ExportUserList, payload);
      if (result.IsSuccess) {
        message.success('下载成功');
        downloadFile(`${result.Datas}`);
      } else {
        message.error(result.Message);
      }
    },

    *GetCodList({ payload, callback }, { call, put, update }) {  //岗位类别、行业属性、问题类别
      const result = yield call(requestPost, `${API.GeneralManagerApi.GetCodList}?CodID=${payload.CodID}`, null);
      if (result.IsSuccess) {
        callback && callback(result.Datas)
      } else {
        message.error(result.Message)
      }
    },

    /*大区档案 */
    *GetProvinceList({ payload, callback }, { call, put, update }) { //获取大区档案
      const result = yield call(requestPost, API.GeneralManagerApi.GetProvinceList, payload);
      if (result.IsSuccess) {
        yield update({
          provinceTableDatas: result.Datas,
          provinceTableTotal: result.Total,
          provinceQueryPar: payload,
        })
      } else {
        message.error(result.Message)
      }
    },
    *ExportProvinceList({ payload, callback }, { call, put, update }) { //大区档案 导出
      const result = yield call(requestPost, API.GeneralManagerApi.ExportProvinceList, payload);
      if (result.IsSuccess) {
        message.success('下载成功');
        downloadFile(`${result.Datas}`);
      } else {
        message.error(result.Message);
      }
    },
    *GetManagerSelect({ payload, callback }, { call, put, update }) { //获取大区系统类型、档案执行大区、项目所在地、大区经理、省区经理信息
      const result = yield call(requestPost, API.GeneralManagerApi.GetManagerSelect, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas)
      } else {
        message.error(result.Message)
        callback && callback([])
      }
    },



  }
})