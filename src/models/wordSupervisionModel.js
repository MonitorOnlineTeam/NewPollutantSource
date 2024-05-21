import moment from 'moment';
import * as services from '../services/wordSupervisionManage';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config';
import { downloadFile, requestPost } from '@/utils/utils';
import { API } from '@config/API';

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
    supervisionVerificaList: [],
    workAlarmPushList: [],
    workAlarmTotal: 0,
    contractList: [],
    menuList: [],
    allMenuList: [],
    contractLoading: false,
    projectExecutionLoading: false,
    customeSatisfactList: [],
    customeSatisfactLoading: false,
    largeRegionList: [],
    standgaswaringList: [],
    standgaswaringLoading: false,
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
        callback && callback(result.Datas);
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
        callback && callback(result);
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
        callback && callback(result);
      } else {
        message.error(result.Message);
      }
    },
    // 人员培训记录 - 导出
    *ExportPersonTrainList({ payload, callback }, { call, put, update }) {
      const result = yield call(services.ExportPersonTrainList, payload);
      if (result.IsSuccess) {
        message.success('导出成功！');
        window.open(result.Datas);
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
    // 根据省份获取办事处列表
    *GetOfficeList({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.DailyManagement.GetOfficeList, payload);
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
      const result = yield call(requestPost, API.DailyManagement.InsOrUpdOtherWork, payload);
      if (result.IsSuccess) {
        message.success('操作成功！');
        callback && callback();
      } else {
        message.error(result.Message);
      }
    },
    // 查询现场工作/其它工作/其他部门工作记录
    *GetOtherWorkList({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.DailyManagement.GetOtherWorkList, payload);
      if (result.IsSuccess) {
        callback && callback(result);
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
        // // 编辑时不加载工作台
        // if (!payload.ID) {
        //   // 重新加载数据
        //   yield put({
        //     type: 'GetToDoDailyWorks',
        //     payload: {},
        //   });
        //   yield put({
        //     type: 'GetWorkBenchMsg',
        //     payload: {},
        //   });
        // }
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
    // 待办中心 监督核查
    *GetStagingInspectorRectificationList({ payload, callback }, { call, put, update }) {
      const result = yield call(services.GetStagingInspectorRectificationList, payload);
      if (result.IsSuccess) {
        yield update({
          supervisionVerificaList: result.Datas,
        });
        callback && callback(result.Total);
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
        callback && callback(result.Total);
      } else {
        message.error(result.Message);
      }
    },
    // 删除数据报警
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
    // 删除合同到期、项目执行等
    *DelWorkbenchMsg({ payload, callback }, { call, put, update }) {
      const result = yield call(services.DelWorkbenchMsg, payload);
      if (result.IsSuccess) {
        message.success('删除成功！');
        callback && callback();
      } else {
        message.error(result.Message);
      }
    },
    // 删除所有  合同到期、标气有效期报警等
    *DelAllWorkbenchMsg({ payload, callback }, { call, put, update }) {
      const result = yield call(services.DelAllWorkbenchMsg, payload);
      if (result.IsSuccess) {
        message.success('删除成功！');
        callback && callback();
      } else {
        message.error(result.Message);
      }
    },
    //获取工作台快捷导航列表 以及 可添加菜单列表
    *GetUserMenuList({ payload, callback }, { call, put, update }) {
      const result = yield call(services.GetUserMenuList, payload);
      if (result.IsSuccess) {
        const menuList = result.Datas?.menuList ? result.Datas.menuList : [];
        const allMenuListFun = data => {
          if (data?.length) {
            return data.map(item => {
              return {
                selectable: item.children?.length ? false : true,
                title: item.name,
                key: item.id,
                children: allMenuListFun(item.children) ? allMenuListFun(item.children) : [],
                icon: item.children?.length ? null : (
                  <img src="/work_meun.png" style={{ paddingRight: 8 }} />
                ),
              };
            });
          }
        };

        const allMenuList = result.Datas?.allMenuList?.length
          ? allMenuListFun(result.Datas.allMenuList)
          : [];
        const menuFilterTree = (treeNodes = [], checkedKeys = []) => {
          return (
            treeNodes?.length &&
            treeNodes
              .filter(item => checkedKeys.indexOf(item.key) == -1)
              .map(item => {
                item = { ...item };
                if (item.children?.length && !treeNodes.selectable) {
                  item.children = menuFilterTree(item.children, checkedKeys);
                }
                return item;
              })
          );
        };
        const allMenuData = menuFilterTree(
          allMenuList,
          menuList.map(item => item.id),
        );
        yield update({
          menuList: menuList,
          allMenuList: allMenuData,
        });
        callback && callback();
      } else {
        message.error(result.Message);
      }
    },
    // 添加快捷菜单
    *AddUserMenu({ payload, callback }, { call, put, update }) {
      const result = yield call(services.AddUserMenu, payload);
      if (result.IsSuccess) {
        message.success('添加成功！');
        callback && callback();
      } else {
        message.error(result.Message);
      }
    },
    // 动态加载工作台模块
    *GetWorkbenchesModuleList({ payload, callback }, { call, put, update }) {
      const result = yield call(services.GetWorkbenchesModuleList, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    //项目执行、合同到期等
    *CtGetWorkbenchMsg({ payload, callback }, { call, put, update }) {
      yield update(
        payload.type == 1
          ? { contractLoading: true }
          : payload.type == 2
          ? { projectExecutionLoading: true }
          : payload.type == 11
          ? { customeSatisfactLoading: true }
          : payload.type == 12
          ? { standgaswaringLoading: true }
          : null,
      );
      const result = yield call(services.CtGetWorkbenchMsg, { ...payload, type: undefined });
      if (result.IsSuccess) {
        const data = result.Datas;
        yield update({  //旧
          projectExecutionList: data?.ctList   || [],
          contractList: data  || [],
        });
        callback && callback({ ctListTotal:data?.ctList?.length || 0, projectListTotal:data?.length || 0});
        // yield update({
        //   projectExecutionList: data?.ctList || [],
        //   contractList: data?.projectList || [],
        //   customeSatisfactList: data?.customerList || [],
        //   standgaswaringList: data?.standgaswaringList || [],
        // });
        // callback &&
        //   callback({
        //     ctListTotal: data?.ctList?.length || 0,
        //     customerListTotal: data?.customerList?.length || 0,
        //     projectListTotal: data?.projectList?.length || 0,
        //     standgaswaringListTotal: data?.standgaswaringList?.length || 0,
        //   });
      }
      yield update(
        payload.type == 1
          ? { contractLoading: false }
          : payload.type == 2
          ? { projectExecutionLoading: false }
          : payload.type == 11
          ? { customeSatisfactLoading: false }
          : payload.type == 12
          ? { standgaswaringLoading: false }
          : null,
      );
    },
    //待办中心 项目执行-解决遗留问题
    *UpdateImplementationStatus({ payload, callback }, { call, put, update }) {
      const result = yield call(services.UpdateImplementationStatus, payload);
      if (result.IsSuccess) {
        message.success(result.Message);
      } else {
        message.error(result.Message);
      }
      callback && callback(result.Datas);
    },

    // 办事处检查统计
    *GetOfficeCheckStatisticsForRegion({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.DailyManagement.GetOfficeCheckStatisticsForRegion,
        payload,
      );
      if (result.IsSuccess) {
        // yield update({
        //   timeoutServicesData: result.Datas,
        // });
        callback && callback(result.Datas);
      }
    },
    // 办事处检查统计 - 导出
    *ExportOfficeCheckStatisticsForRegion({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.DailyManagement.ExportOfficeCheckStatisticsForRegion,
        payload,
      );
      if (result.IsSuccess) {
        message.success('导出成功！');
        downloadFile(result.Datas);
      }
    },
    // 省区详情 - 检查任务完成记录
    *GetOfficeCheckStatisticsForRegionInfo({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.DailyManagement.GetOfficeCheckStatisticsForRegionInfo,
        payload,
      );
      if (result.IsSuccess) {
        callback && callback(result);
      }
    },
    // 省区详情 - 检查任务完成记录 - 导出
    *ExportOfficeCheckStatisticsForRegionInfo({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.DailyManagement.ExportOfficeCheckStatisticsForRegionInfo,
        payload,
      );
      if (result.IsSuccess) {
        message.success('导出成功！');
        downloadFile(result.Datas);
      }
    },
    // 检查记录和检查管理
    *GetOfficeCheckStatisticsList({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.DailyManagement.GetOfficeCheckStatisticsList,
        payload,
      );
      if (result.IsSuccess) {
        callback && callback(result);
      }
    },
    // 检查记录和检查管理 - 导出
    *ExportOfficeCheckStatisticsList({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.DailyManagement.ExportOfficeCheckStatisticsList,
        payload,
      );
      if (result.IsSuccess) {
        message.success('导出成功！');
        downloadFile(result.Datas);
      }
    },
    // 获取运维大区和省区
    *GetLargeRegion({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.DailyManagement.GetLargeRegion, payload);
      if (result.IsSuccess) {
        yield update({
          largeRegionList: result.Datas,
        });
        callback && callback(result.Datas);
      }
    },
    // 删除办事处
    *DeleteOfficeCheckStatistics({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.DailyManagement.DeleteOfficeCheckStatistics,
        payload,
      );
      if (result.IsSuccess) {
        message.success('删除成功！');
        callback && callback(result);
      }
    },

    // 获取人员培训统计
    *GetPersonTrainForRegion({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.DailyManagement.TrainingApi.GetPersonTrainForRegion,
        payload,
      );
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      }
    },
    // 人员培训统计 - 导出
    *ExportPersonTrainForRegion({ payload }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.DailyManagement.TrainingApi.ExportPersonTrainForRegion,
        payload,
      );
      if (result.IsSuccess) {
        message.success('导出成功！');
        downloadFile(result.Datas);
      }
    },
    // 获取人员培训统计
    *GetPersonTrainForRegionInfo({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.DailyManagement.TrainingApi.GetPersonTrainForRegionInfo,
        payload,
      );
      if (result.IsSuccess) {
        callback && callback(result);
      }
    },
    // 人员培训统计 - 导出
    *ExportPersonTrainForRegionInfo({ payload }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.DailyManagement.TrainingApi.ExportPersonTrainForRegionInfo,
        payload,
      );
      if (result.IsSuccess) {
        message.success('导出成功！');
        downloadFile(result.Datas);
      }
    },

    // 获取应收账款催收记录数据
    *GetAccountsReceivableList({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.DailyManagement.CollectionsApi.GetAccountsReceivableList,
        payload,
      );
      if (result.IsSuccess) {
        callback && callback(result);
      }
    },
    // 应收账款催收记录数据 - 导出
    *ExportAccountsReceivableList({ payload }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.DailyManagement.CollectionsApi.ExportAccountsReceivableList,
        payload,
      );
      if (result.IsSuccess) {
        message.success('导出成功！');
        downloadFile(result.Datas);
      }
    },
    // 应收账款催收记录数据 - 删除
    *DeleteAccountsReceivable({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        `${API.DailyManagement.CollectionsApi.DeleteAccountsReceivable}?ID=${payload.ID}`,
        {},
      );
      if (result.IsSuccess) {
        message.success('删除成功！');
        callback && callback();
      }
    },

    // 获取现场检查统计列表
    *GetSiteInspectionForRegion({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.DailyManagement.FieldCheckApi.GetSiteInspectionForRegion,
        payload,
      );
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      }
    },
    // 现场检查统计列表 - 导出
    *ExportSiteInspectionForRegion({ payload }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.DailyManagement.FieldCheckApi.ExportSiteInspectionForRegion,
        payload,
      );
      if (result.IsSuccess) {
        message.success('导出成功！');
        downloadFile(result.Datas);
      }
    },
    // 获取现场检查统计 - 省区详情
    *GetSiteInspectionForRegionInfo({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.DailyManagement.FieldCheckApi.GetSiteInspectionForRegionInfo,
        payload,
      );
      if (result.IsSuccess) {
        callback && callback(result);
      }
    },
    // 现场检查统计 - 省区详情 - 导出
    *ExportSiteInspectionForRegionInfo({ payload }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.DailyManagement.FieldCheckApi.ExportSiteInspectionForRegionInfo,
        payload,
      );
      if (result.IsSuccess) {
        message.success('导出成功！');
        downloadFile(result.Datas);
      }
    },

    // 客户回访统计列表
    *GetCustomerVisitList({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.DailyManagement.CustomerReturnVisit.GetCustomerVisitList,
        payload,
      );
      if (result.IsSuccess) {
        callback && callback(result);
      }
    },
    // 获取单个客户回访记录
    *GetCustomerVisitInfor({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        `${API.DailyManagement.CustomerReturnVisit.GetCustomerVisitInfor}?ID=${payload.ID}`,
        {},
      );
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      }
    },
    // 导出客户回访记录
    *ExportCustomerVisitList({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.DailyManagement.CustomerReturnVisit.ExportCustomerVisitList,
        payload,
      );
      if (result.IsSuccess) {
        message.success('导出成功！');
        downloadFile(result.Datas);
      }
    },
    // 客户现场回访记录，客户现场回访管理
    *GetCustomerVisitInfo({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        `${API.DailyManagement.CustomerReturnVisit.GetCustomerVisitInfo}`,
        payload,
      );
      if (result.IsSuccess) {
        callback && callback(result);
      }
    },
    // 客户现场回访记录，客户现场回访管理 - 导出
    *ExportCustomerVisitInfo({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.DailyManagement.CustomerReturnVisit.ExportCustomerVisitInfo,
        payload,
      );
      if (result.IsSuccess) {
        message.success('导出成功！');
        downloadFile(result.Datas);
      }
    },
  },
});
