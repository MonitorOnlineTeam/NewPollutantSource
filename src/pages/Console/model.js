import * as services from './service';
import Model from '@/utils/model';
import { message } from 'antd';

export default Model.extend({
  namespace: 'console',
  state: {
    serverSetList: [],
    transferConfig: [],
    entAndPointList: [],
    agreementList: [],
    allPointList: [],
    DGIMNList: [],
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
      const result = yield call(services.RestartCollect, payload);
      if (result.isSuccess) {
        callback();
        message.success("重启成功");
      } else {
        message.error(result.message)
      }
    },
    // 获取采集连接数详情
    *GetRemotePoint({ payload, callback }, { call, update, put, take, select }) {
      const result = yield call(services.GetRemotePoint, payload);
      if (result.isSuccess) {
        yield update({
          DGIMNList: result.datas
        })
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
      const result = yield call(services.Restart, payload);
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
      const result = yield call(services.ModifyTransmitSet, payload);
      if (result.isSuccess) {
        callback();
      } else {
        message.error(result.message)
      }
    },
    // 重启转发服务
    *RestartTransmit({ payload, callback }, { call, update, put, take, select }) {
      const result = yield call(services.RestartTransmit, payload);
      if (result.isSuccess) {
        callback();
        message.success("操作成功");
      } else {
        message.error(result.message)
      }
    },
    // 获取协议列表
    *GetAnayticeList({ payload, callback }, { call, update, put, take, select }) {
      const result = yield call(services.GetAnayticeList, {});
      if (result.isSuccess) {
        let agreementList = [];
        for (const key in result.datas) {
          agreementList.push({
            key: key,
            value: result.datas[key]
          })
        }
        yield update({
          agreementList
        })
      } else {
        message.error(result.message)
      }
    },
    // 获取排口信息
    *GetPoint({ payload }, { call, update, put, take, select }) {
      const result = yield call(services.GetPoint, {});
      if (result.isSuccess) {
        let allPointList = []
        let entAndPointList = result.datas.map(item => {
          if (item.children) {
            allPointList = allPointList.concat(item.children)
            let children = item.children.map(child => {
              return {
                ...child, title: child.entName + " - " + child.title
              }
            })
            return { ...item, children }
          }
          return item
        })
        console.log('allPointList', allPointList)
        yield update({
          entAndPointList,
          allPointList
        })
      } else {
        message.error(result.message)
      }
    },

  }
});
