import Model from '@/utils/model';
import * as services from '../services/installEquipment';
import moment from 'moment';
import { message } from 'antd';
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'installEquipment',
  state: {
    installEquipmentTableDatas:[],
    installEquipmentTableTotal:0,
    installEquipmentQueryPar: {},
    installPhotoData:[],
  },
  effects: {
    //获取设备安装审核信息
    *GetEquipmentAuditList({ payload, callback }, { call, put, update, select }) {
      const result = yield call(services.GetEquipmentAuditList, { ...payload });
      if (result.IsSuccess) {
        yield update({
          installEquipmentTableDatas:result.Datas,
          installEquipmentTableTotal:result.Total,
          installEquipmentQueryPar: payload,
        })
      } else {
        message.error(result.Message)
      }
    },
    //设备安装审核信息 导出
    *ExportEquipmentAudit({ payload,callback }, { call, put, update }) { 
      const result = yield call(services.ExportEquipmentAudit, payload);
      if (result.IsSuccess) {
        message.success('下载成功');
        downloadFile(`${result.Datas}`);
      } else {
        message.error(result.Message);
      }
    },
    //获取设备安装审核照片详细
    *GetAuditPhoto({ payload, callback }, { call, put, update, select }) {
      const result = yield call(services.GetAuditPhoto, { ...payload });
      if (result.IsSuccess) {
        yield update({
          installPhotoData:result.Datas,
        })
      } else {
        message.error(result.Message)
      }
    },
    // 安装照片审核
    *AddAuditInfo({ payload, callback }, { call, put, update, select }) {
      const result = yield call(services.AddAuditInfo, { ...payload });
      if (result.IsSuccess) {
        callback && callback(result.Datas)
      } else {
        message.error(result.Message)
      }
    },
    




  }
});
