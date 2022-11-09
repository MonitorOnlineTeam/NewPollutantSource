import * as services from './service';
import Model from '@/utils/model';
import { message } from 'antd';

export default Model.extend({
  namespace: 'console',
  state: {
    serverSetList: [],
    transferConfig: [],
  },
  effects: {
    // 获取采集服务配置及基本信息
    *GetConsulConfig({ callback }, { call, update, put, take, select }) {
      const result = yield call(services.GetConsulConfig, {});
      if (result.isSuccess) {
        callback(result.datas)
        // yield update({
        //   serverSetList: result.datas.serverSetList,
        //   transferConfig: result.datas.transferConfig,
        // })
      } else {
        message.error(result.message)
      }
    },
    // 更新采集服务操作
    *UpdateConsulConfig({ payload, callback }, { call, update, put, take, select }) {
      console.log('payload=', payload)
      // return;
      const result = yield call(services.UpdateConsulConfig, payload);
      if (result.isSuccess) {
        callback();
      } else {
        message.error(result.message)
      }
    },
    // 重启采集服务
    *RestartCollect({ payload, callback }, { call, update, put, take, select }) {
      const result = yield call(services.RestartCollect, {});
      if (result.isSuccess) {
        callback();
        message.success("重启成功");
      } else {
        message.error(result.message)
      }
    },

    // 获取定时任务
    *GetStatisSet({ payload, callback }, { call, update, put, take, select }) {
      const result = yield call(services.GetStatisSet, {});
      if (result.isSuccess) {
        callback(result.datas);
      } else {
        message.error(result.message)
      }
    },
    // 更新定时任务配置
    *ModifyStatisTask({ payload, callback }, { call, update, put, take, select }) {
      console.log("payload=", payload);
      // return;
      const result = yield call(services.ModifyStatisTask, payload);
      if (result.isSuccess) {
        callback();
      } else {
        message.error(result.message)
      }
    },
    // 重启定时任务
    *Restart({ payload, callback }, { call, update, put, take, select }) {
      const result = yield call(services.Restart, {});
      if (result.isSuccess) {
        callback();
        message.success("操作成功");
      } else {
        message.error(result.message)
      }
    },
    
    // 获取转发配置
    *GetTransmitSet({ payload, callback }, { call, update, put, take, select }) {
      const result = yield call(services.GetTransmitSet, {});
      if (result.isSuccess) {
        callback(result.datas);
      } else {
        message.error(result.message)
      }
    },
    // 设置转发配置
    *ModifyTransmitSet({ payload, callback }, { call, update, put, take, select }) {
      const result = yield call(services.ModifyTransmitSet, {});
      if (result.isSuccess) {
        callback();
      } else {
        message.error(result.message)
      }
    },
    // 重启转发服务
    *RestartTransmit({ payload, callback }, { call, update, put, take, select }) {
      const result = yield call(services.RestartTransmit, {});
      if (result.isSuccess) {
        callback();
        message.success("操作成功");
      } else {
        message.error(result.message)
      }
    },
    
  }
});
