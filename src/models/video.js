import * as services from '@/services/VideoApi';
import * as commonServices from '@/services/commonApi';
import Model from '@/utils/model';
import { message } from 'antd';


export default Model.extend({
  namespace: 'video',
  state: {
    videoManagerList: {
      one: [],
      two: [],
    },
    videoList: [],
    videoManagerEditData: {},
  },

  effects: {
    // 添加视频
    *AddVideoDevice({ payload, callback }, { call }) {
      const result = yield call(services.AddVideoDevice, payload);
      if (result.IsSuccess) {
        callback && callback();
      } else {
        message.error(result.Message)
      }
    },
    // 验证摄像头是否存在
    *validateVideo({ payload, callback }, { call }) {
      const result = yield call(services.IsTrueSerialNumber, payload);
      if (result.IsSuccess) {
        callback && callback();
      } else {
        message.error(result.Message)
      }
    },
    // 获取摄像头列表
    *getVideoList({ payload, callback }, { call, update }) {
      const result = yield call(services.GetVideoList, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
        if (payload.Type === 'manager') {
          yield update({
            videoManagerList: result.Datas
          })
        } else {
          yield update({
            videoList: result.Datas
          })
        }
      } else {
        message.error(result.Message)
      }
    },
    // 删除单个设备
    *DeleteVideoDeviceOne({ payload, callback }, { call, update }) {
      const result = yield call(services.DeleteVideoDeviceOne, payload);
      if (result.IsSuccess) {
        message.success("删除成功！")
        callback && callback();
      } else {
        message.error(result.Message)
      }
    },
    // 获取编辑数据
    *GetVideoDeviceOne({ payload, callback }, { call, update }) {
      const result = yield call(services.GetVideoDeviceOne, payload);
      if (result.IsSuccess) {
        yield update({
          videoManagerEditData: result.Datas
        })
      } else {
        message.error(result.Message)
      }
    },
    // 获取编辑数据
    *UpdateVideoDeviceOne({ payload, callback }, { call, update }) {
      const result = yield call(services.UpdateVideoDeviceOne, payload);
      if (result.IsSuccess) {
        callback && callback();
      } else {
        message.error(result.Message)
      }
    },
    // 获取乐橙云KitToken
    *GetLeChengKITToken({ payload, callback }, { call, update }) {
      const result = yield call(services.GetLeChengKITToken, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        message.error(result.Message)
      }
    },
  }
})