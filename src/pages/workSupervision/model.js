import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config';
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'wordSupervision',
  state: {
    TYPE: '',
    todoList: [],
    messageList: [],
    customerList: [],
    otherCustomerList: [],
    RegionalAndProvince: [],
    officeList: [],
    allUser: [],
    IndustryList: [],
    managerList: [],
    operaServiceList: [],
    workAlarmPushList: [
      {
        EntNamePointName: '度翻译 依托互联网数据资源和自然语言处理技术优势，致力于帮助用户跨越语言鸿沟，方便快捷地获取信息和服务。支持全球200多个语言互译，覆盖4万多个翻译方向，通过开放平台支持超过50万企业和个人开发者，是国内市场份额第一的翻译类产品。百度翻译拥有网...详情',
        Time: '2021-09-01 11:22'
      },
      {
        EntNamePointName: '度翻译 依托互联网数据资源和自然语言处理技术优势，致力于帮助用户跨越语言鸿沟，方便快捷地获取信息和服务。支持全球200多个语言互译，覆盖4万多个翻译方向，通过开放平台支持超过50万企业和个人开发者，是国内市场份额第一的翻译类产品。百度翻译拥有网...详情',
        Time: '2021-09-01 11:22'
      },
      {
        EntNamePointName: '度翻译 依托互联网数据资源和自然语言处理技术优势，致力于帮助用户跨越语言鸿沟，方便快捷地获取信息和服务。支持全球200多个语言互译，覆盖4万多个翻译方向，通过开放平台支持超过50万企业和个人开发者，是国内市场份额第一的翻译类产品。百度翻译拥有网...详情',
        Time: '2021-09-01 11:22'
      },
      {
        EntNamePointName: '度翻译 依托互联网数据资源和自然语言处理技术优势，致力于帮助用户跨越语言鸿沟，方便快捷地获取信息和服务。支持全球200多个语言互译，覆盖4万多个翻译方向，通过开放平台支持超过50万企业和个人开发者，是国内市场份额第一的翻译类产品。百度翻译拥有网...详情',
        Time: '2021-09-01 11:22'
      },
      {
        EntNamePointName: '度翻译 依托互联网数据资源和自然语言处理技术优势，致力于帮助用户跨越语言鸿沟，方便快捷地获取信息和服务。支持全球200多个语言互译，覆盖4万多个翻译方向，通过开放平台支持超过50万企业和个人开发者，是国内市场份额第一的翻译类产品。百度翻译拥有网...详情',
        Time: '2021-09-01 11:22'
      },
      {
        EntNamePointName: '度翻译 依托互联网数据资源和自然语言处理技术优势，致力于帮助用户跨越语言鸿沟，方便快捷地获取信息和服务。支持全球200多个语言互译，覆盖4万多个翻译方向，通过开放平台支持超过50万企业和个人开发者，是国内市场份额第一的翻译类产品。百度翻译拥有网...详情',
        Time: '2021-09-01 11:22'
      },
      {
        EntNamePointName: '度翻译 依托互联网数据资源和自然语言处理技术优势，致力于帮助用户跨越语言鸿沟，方便快捷地获取信息和服务。支持全球200多个语言互译，覆盖4万多个翻译方向，通过开放平台支持超过50万企业和个人开发者，是国内市场份额第一的翻译类产品。百度翻译拥有网...详情',
        Time: '2021-09-01 11:22'
      },
      {
        EntNamePointName: '度翻译 依托互联网数据资源和自然语言处理技术优势，致力于帮助用户跨越语言鸿沟，方便快捷地获取信息和服务。支持全球200多个语言互译，覆盖4万多个翻译方向，通过开放平台支持超过50万企业和个人开发者，是国内市场份额第一的翻译类产品。百度翻译拥有网...详情',
        Time: '2021-09-01 11:22'
      },
      {
        EntNamePointName: '度翻译 依托互联网数据资源和自然语言处理技术优势，致力于帮助用户跨越语言鸿沟，方便快捷地获取信息和服务。支持全球200多个语言互译，覆盖4万多个翻译方向，通过开放平台支持超过50万企业和个人开发者，是国内市场份额第一的翻译类产品。百度翻译拥有网...详情',
        Time: '2021-09-01 11:22'
      },
      {
        EntNamePointName: '度翻译 依托互联网数据资源和自然语言处理技术优势，致力于帮助用户跨越语言鸿沟，方便快捷地获取信息和服务。支持全球200多个语言互译，覆盖4万多个翻译方向，通过开放平台支持超过50万企业和个人开发者，是国内市场份额第一的翻译类产品。百度翻译拥有网...详情',
        Time: '2021-09-01 11:22'
      },
      {
        EntNamePointName: '度翻译 依托互联网数据资源和自然语言处理技术优势，致力于帮助用户跨越语言鸿沟，方便快捷地获取信息和服务。支持全球200多个语言互译，覆盖4万多个翻译方向，通过开放平台支持超过50万企业和个人开发者，是国内市场份额第一的翻译类产品。百度翻译拥有网...详情',
        Time: '2021-09-01 11:22'
      },
      {
        EntNamePointName: '度翻译 依托互联网数据资源和自然语言处理技术优势，致力于帮助用户跨越语言鸿沟，方便快捷地获取信息和服务。支持全球200多个语言互译，覆盖4万多个翻译方向，通过开放平台支持超过50万企业和个人开发者，是国内市场份额第一的翻译类产品。百度翻译拥有网...详情',
        Time: '2021-09-01 11:22'
      },
      {
        EntNamePointName: '度翻译 依托互联网数据资源和自然语言处理技术优势，致力于帮助用户跨越语言鸿沟，方便快捷地获取信息和服务。支持全球200多个语言互译，覆盖4万多个翻译方向，通过开放平台支持超过50万企业和个人开发者，是国内市场份额第一的翻译类产品。百度翻译拥有网...详情',
        Time: '2021-09-01 11:22'
      },

    ],
    workAlarmTotal:1,
  },
  effects: {
    // 获取工作台待办
    *GetToDoDailyWorks({ payload, callback }, { call, select, update }) {
      const state = yield select(state => state.wordSupervision);
      let body = {
        type: payload.type || state.TYPE,
      };
      const result = yield call(services.GetToDoDailyWorks, body);
      if (result.IsSuccess) {
        yield update({
          todoList: result.Datas,
        });
        callback && callback();
      } else {
        message.error(result.Message);
      }
    },
    // 获取工作台消息
    *GetWorkBenchMsg({ payload, callback }, { call, put, update }) {
      const result = yield call(services.GetWorkBenchMsg, payload);
      if (result.IsSuccess) {
        yield update({
          messageList: result.Datas,
        });
        callback && callback();
      } else {
        message.error(result.Message);
      }
    },
    // 结束任务
    *endTask({ payload, callback }, { call, put, update }) {
      const result = yield call(services.endTask, payload);
      if (result.IsSuccess) {
        message.success('操作成功！');
        callback && callback();
      } else {
        message.error(result.Message);
      }
    },
    // 手动申请任务
    *manualTask({ payload, callback }, { call, put, update }) {
      const result = yield call(services.manualTask, payload);
      if (result.IsSuccess) {
        message.success('操作成功！');
        callback && callback();
      } else {
        message.error(result.Message);
      }
    },
    // 添加或编辑回访客户
    *InsOrUpdReturnVisitCustomers({ payload, callback }, { call, put, update }) {
      const result = yield call(services.InsOrUpdReturnVisitCustomers, payload);
      if (result.IsSuccess) {
        message.success('操作成功！');
        // 编辑时不加载工作台
        if (!payload.ID) {
          // 重新加载数据
          yield put({
            type: 'GetToDoDailyWorks',
            payload: {
              // TYPE: state.TYPE,
            },
          });
          yield put({
            type: 'GetWorkBenchMsg',
            payload: {},
          });
        }
        callback && callback();
      } else {
        message.error(result.Message);
      }
    },
    // 获取所有客户
    *getCustomerList({ payload, callback }, { call, put, update }) {
      const result = yield call(services.getCustomerList, payload);
      if (result.IsSuccess) {
        yield update({
          customerList: result.Datas,
        });
        callback && callback();
      } else {
        message.error(result.Message);
      }
    },
    // 获取维护的客户
    *getOtherCustomerList({ payload, callback }, { call, put, update }) {
      const result = yield call(services.getOtherCustomerList, payload);
      if (result.IsSuccess) {
        yield update({
          otherCustomerList: result.Datas,
        });
        callback && callback();
      } else {
        message.error(result.Message);
      }
    },
    // 添加编辑客户
    *InsOrUpdOtherCustomer({ payload, callback }, { call, put, update }) {
      const result = yield call(services.InsOrUpdOtherCustomer, payload);
      if (result.IsSuccess) {
        message.success('操作成功！');

        callback && callback();
      } else {
        message.error(result.Message);
      }
    },
    // 获取已配置的省区和大区
    *GetRegionalAndProvince({ payload, callback }, { call, put, update }) {
      const result = yield call(services.GetRegionalAndProvince, payload);
      if (result.IsSuccess) {
        yield update({
          RegionalAndProvince: result.Datas,
        });
        callback && callback();
      } else {
        message.error(result.Message);
      }
    },
    // 删除客户
    *DeleteOtherCustom({ payload, callback }, { call, put, update }) {
      const result = yield call(services.DeleteOtherCustom, payload);
      if (result.IsSuccess) {
        message.success('删除成功！');
        callback && callback();
      } else {
        message.error(result.Message);
      }
    },
    // 查询回访客户记录
    *GetReturnVisitCustomersList({ payload, callback }, { call, put, update }) {
      const result = yield call(services.GetReturnVisitCustomersList, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 删除回访客户记录
    *DeleteReturnVisitCustomers({ payload, callback }, { call, put, update }) {
      const result = yield call(services.DeleteReturnVisitCustomers, payload);
      if (result.IsSuccess) {
        message.success('删除成功！');
        callback && callback();
      } else {
        message.error(result.Message);
      }
    },
    // 添加、编辑人员培训记录
    *InsOrUpdPersonTrain({ payload, callback }, { call, put, update }) {
      const result = yield call(services.InsOrUpdPersonTrain, payload);
      if (result.IsSuccess) {
        message.success('操作成功！');

        // 编辑时不加载工作台
        if (!payload.ID) {
          // 重新加载数据
          yield put({
            type: 'GetToDoDailyWorks',
            payload: {},
          });
          yield put({
            type: 'GetWorkBenchMsg',
            payload: {},
          });
        }
        callback && callback();
      } else {
        message.error(result.Message);
      }
    },
    // 查询人员培训记录
    *GetPersonTrainList({ payload, callback }, { call, put, update }) {
      const result = yield call(services.GetPersonTrainList, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 删除培训记录
    *DeletePersonTrain({ payload, callback }, { call, put, update }) {
      const result = yield call(services.DeletePersonTrain, payload);
      if (result.IsSuccess) {
        message.success('删除成功！');
        callback && callback();
      } else {
        message.error(result.Message);
      }
    },
    // 获取办事处列表
    *GetOfficeList({ payload, callback }, { call, put, update }) {
      const result = yield call(services.GetOfficeList, payload);
      if (result.IsSuccess) {
        yield update({
          officeList: result.Datas,
        });
        callback && callback();
      } else {
        message.error(result.Message);
      }
    },
    // 添加、编辑办事处检查
    *InsOrUpdOfficeCheck({ payload, callback }, { call, put, update }) {
      const result = yield call(services.InsOrUpdOfficeCheck, payload);
      if (result.IsSuccess) {
        message.success('操作成功！');

        // 编辑时不加载工作台
        if (!payload.ID) {
          // 重新加载数据
          yield put({
            type: 'GetToDoDailyWorks',
            payload: {},
          });
          yield put({
            type: 'GetWorkBenchMsg',
            payload: {},
          });
        }
        callback && callback();
      } else {
        message.error(result.Message);
      }
    },
    // 获取办事处检查提交记录
    *GetOfficeCheckList({ payload, callback }, { call, put, update }) {
      const result = yield call(services.GetOfficeCheckList, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 删除办事处检查记录
    *DeleteOfficeCheck({ payload, callback }, { call, put, update }) {
      const result = yield call(services.DeleteOfficeCheck, payload);
      if (result.IsSuccess) {
        message.success('删除成功！');
        callback && callback();
      } else {
        message.error(result.Message);
      }
    },
    // 添加或编辑现场工作/其它工作/其他部门工作记录
    *InsOrUpdOtherWork({ payload, callback }, { call, put, update }) {
      const result = yield call(services.InsOrUpdOtherWork, payload);
      if (result.IsSuccess) {
        message.success('操作成功！');

        // 编辑时不加载工作台
        if (!payload.ID) {
          // 重新加载数据
          yield put({
            type: 'GetToDoDailyWorks',
            payload: {},
          });
          yield put({
            type: 'GetWorkBenchMsg',
            payload: {},
          });
        }
        callback && callback();
      } else {
        message.error(result.Message);
      }
    },
    // 查询现场工作/其它工作/其他部门工作记录
    *GetOtherWorkList({ payload, callback }, { call, put, update }) {
      const result = yield call(services.GetOtherWorkList, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 删除现场工作/其它工作/其他部门工作记录
    *DeleteOtherWork({ payload, callback }, { call, put, update }) {
      const result = yield call(services.DeleteOtherWork, payload);
      if (result.IsSuccess) {
        message.success('删除成功！');
        callback && callback();
      } else {
        message.error(result.Message);
      }
    },
    // 导出任务单记录
    *exportTaskRecord({ payload, callback }, { call, put, update }) {
      const result = yield call(services.exportTaskRecord, payload);
      if (result.IsSuccess) {
        message.success('导出成功！');
        window.open(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 导出任务单记录
    *GetAllUser({ payload }, { call, put, update }) {
      const result = yield call(services.GetAllUser, payload);
      if (result.IsSuccess) {
        yield update({
          allUser: result.Datas,
        });
      } else {
        message.error(result.Message);
      }
    },
    // 添加、编辑检查考勤和日志记录
    *InsOrUpdCheckAttendance({ payload, callback }, { call, put, update }) {
      const result = yield call(services.InsOrUpdCheckAttendance, payload);
      if (result.IsSuccess) {
        message.success('操作成功！');

        // 编辑时不加载工作台
        if (!payload.ID) {
          // 重新加载数据
          yield put({
            type: 'GetToDoDailyWorks',
            payload: {},
          });
          yield put({
            type: 'GetWorkBenchMsg',
            payload: {},
          });
        }
        callback && callback();
      } else {
        message.error(result.Message);
      }
    },
    // 查询检查考勤和日志提交记录
    *GetCheckAttendanceRecordList({ payload, callback }, { call, put, update }) {
      const result = yield call(services.GetCheckAttendanceRecordList, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 删除 检查考勤和日志记录
    *DeleteCheckAttendanceRecord({ payload, callback }, { call, put, update }) {
      const result = yield call(services.DeleteCheckAttendanceRecord, payload);
      if (result.IsSuccess) {
        message.success('删除成功！');
        callback && callback();
      } else {
        message.error(result.Message);
      }
    },
    // 根据考勤和日志记录ID获取数据
    *GetCheckAttendanceLogList({ payload, callback }, { call, put, update }) {
      const result = yield call(services.GetCheckAttendanceLogList, payload);
      if (result.IsSuccess) {
        let datas = result.Datas.map((item, index) => {
          return {
            Key: index,
            RegionalArea: item.RegionName,
            ...item,
          };
        });
        callback && callback(datas);
      } else {
        message.error(result.Message);
      }
    },
    // 获取统计数据
    *getStatisticsData({ payload, callback }, { call, put, update }) {
      const result = yield call(services.getStatisticsData, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 导出统计数据
    *exportStatisticsData({ payload, callback }, { call, put, update }) {
      const result = yield call(services.exportStatisticsData, payload);
      if (result.IsSuccess) {
        message.success('导出成功！');
        window.open(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 获取 现场工作/其它工作/其他部门工作统计
    *StatisticsOtherWork({ payload, callback }, { call, put, update }) {
      const result = yield call(services.StatisticsOtherWork, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 导出 现场工作/其它工作/其他部门工作统计
    *ExportStatisticsOtherWork({ payload, callback }, { call, put, update }) {
      const result = yield call(services.ExportStatisticsOtherWork, payload);
      if (result.IsSuccess) {
        message.success('导出成功！');
        window.open(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 获取行业
    *GetPollutantTypeList({ payload, callback }, { call, put, update }) {
      const result = yield call(services.GetPollutantTypeList, payload);
      if (result.IsSuccess) {
        yield update({
          IndustryList: result.Datas,
        });
      } else {
        message.error(result.Message);
      }
    },
    // 获取项目
    *GetProjectInfoList({ payload, callback }, { call, put, update }) {
      const result = yield call(services.GetProjectInfoList, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 提交应收账款催收
    *InsOrUpdAccountsReceivable({ payload, callback }, { call, put, update }) {
      const result = yield call(services.InsOrUpdAccountsReceivable, payload);
      if (result.IsSuccess) {
        message.success('操作成功！');
        // 编辑时不加载工作台
        if (!payload.ID) {
          // 重新加载数据
          yield put({
            type: 'GetToDoDailyWorks',
            payload: {},
          });
          yield put({
            type: 'GetWorkBenchMsg',
            payload: {},
          });
        }
        callback && callback();
      } else {
        message.error(result.Message);
      }
    },
    // 删除应收账款催收记录
    *DeleteAccountsReceivable({ payload, callback }, { call, put, update }) {
      const result = yield call(services.DeleteAccountsReceivable, payload);
      if (result.IsSuccess) {
        message.success('删除成功！');
        callback && callback();
      } else {
        message.error(result.Message);
      }
    },
    // 查询应收账款催收记录
    *GetAccountsReceivableList({ payload, callback }, { call, put, update }) {
      const result = yield call(services.GetAccountsReceivableList, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 查询应收账款催收统计
    *StatisticsAccountsReceivable({ payload, callback }, { call, put, update }) {
      const result = yield call(services.StatisticsAccountsReceivable, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 查询应收账款催收统计
    *DeleteTasks({ payload, callback }, { call, put, update }) {
      const result = yield call(services.DeleteTasks, payload);
      if (result.IsSuccess) {
        message.success('任务已撤销！');
        // 重新加载数据
        yield put({
          type: 'GetToDoDailyWorks',
          payload: {},
        });
        yield put({
          type: 'GetWorkBenchMsg',
          payload: {},
        });
        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 获取大区经理或省区经理
    *GetManagerByType({ payload, callback }, { call, put, update }) {
      const result = yield call(services.GetManagerByType, payload);
      if (result.IsSuccess) {
        yield update({
          managerList: result.Datas,
        });
        callback && callback();
      } else {
        message.error(result.Message);
      }
    },
    // 转发任务单
    *RetransmissionTasks({ payload, callback }, { call, put, update }) {
      const result = yield call(services.RetransmissionTasks, payload);
      if (result.IsSuccess) {
        message.success('转发成功！');
        // 重新加载数据
        yield put({
          type: 'GetToDoDailyWorks',
          payload: {},
        });
        yield put({
          type: 'GetWorkBenchMsg',
          payload: {},
        });
        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 运维服务列表
    *GetStagingInspectorRectificationList({ payload, callback }, { call, put, update }) {
      const result = yield call(services.GetStagingInspectorRectificationList, payload);
      if (result.IsSuccess) {
        yield update({
          // operaServiceList: result.Datas,
        });
        callback && callback();
      } else {
        message.error(result.Message);
      }
    },
    // 数据报警列表
    *GetWorkAlarmPushList({ payload, callback }, { call, put, update }) {
      const result = yield call(services.GetWorkAlarmPushList, payload);
      if (result.IsSuccess) {
        yield update({
          workAlarmPushList: result.Datas,
          workAlarmTotal: result.Total,
        });
        callback && callback(1);
      } else {
        message.error(result.Message);
      }
    },
    // 删除应收账款催收记录
    *UpdateWorkPushStatus({ payload, callback }, { call, put, update }) {
      const result = yield call(services.UpdateWorkPushStatus, payload);
      if (result.IsSuccess) {
        message.success('删除成功！');
        callback && callback();
      } else {
        message.error(result.Message);
      }
    },
    // 删除所有数据报警
    *UpdateAllWorkPushStatus({ payload, callback }, { call, put, update }) {
      const result = yield call(services.UpdateAllWorkPushStatus, payload);
      if (result.IsSuccess) {
        message.success('删除成功！');
        callback && callback();
      } else {
        message.error(result.Message);
      }
    },
  },
});
