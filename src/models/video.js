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
    VideoType: [],
    HKLiveVideoUrl: '',
    HKPlaybackVideoUrl: '',
    backData: [],
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
    // 获取视频接入方式
    *GetVideoInputType({ payload }, { call, update }) {
      const result = yield call(services.GetVideoInputType, payload);
      if (result.IsSuccess) {
        yield update({
          VideoType: result.Datas
        })
      } else {
        message.error(result.Message)
      }
    },
    // 获取实时视频地址
    *GetPreviewURL({ payload }, { call, update }) {
      const result = yield call(services.GetPreviewURL, payload);
      if (result.IsSuccess) {
        yield update({
          HKLiveVideoUrl: result.Datas
        })
      } else {
        message.error(result.Message)
      }
    },
    // 获取海康历史视频地址
    *GetPlaybackURL({ payload }, { call, update }) {
      const result = yield call(services.GetPlaybackURL, payload);
      if (result.IsSuccess) {
        yield update({
          HKPlaybackVideoUrl: result.Datas ? result.Datas.url : "",
          backData: result.Datas ? result.Datas.list : []
        })
      } else {
        message.error(result.Message)
      }
    },
    // 海康云台操作
    *PTZControl({ payload }, { call, update }) {
      const result = yield call(services.PTZControl, payload);
      if (result.IsSuccess) {
        if (result.Datas.code === '0') {

        } else {
          message.error("错误码：" + result.Datas.code + "，错误信息" + result.Datas.msg)
        }
      } else {
        message.error(result.Message)
      }
    },

  }
})