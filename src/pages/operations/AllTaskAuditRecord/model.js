//运维任务列表
import moment from 'moment';
import {
  GetMaintenanceTaskHistoryList,
  queryAuditTaskList,
  getTaskType,
  getInsertApplication,
  taskAudit,
  taskUndo,
  getTaskDetails,
  queryAllTaskAuditRecordList,
} from './services';
import Model from '@/utils/model';
import Cookie from 'js-cookie';
import { EnumRequstResult } from '../../../utils/enum';
import { message } from 'antd';

export default Model.extend({
  namespace: 'tasklist',
  state: {
    taskList: [],
    pageIndex: 1,
    pageSize: 10,
    RegionCode: null, //行政区编码
    EnterCode: null, //企业编码
    PointCode: null, //监测点名称
    OperationsUserId: [], //任务执行人
    TaskCode: null, //任务单号
    ItemNum: null,
    beginTime: moment()
      .subtract(1, 'month')
      .format('YYYY-MM-DD 00:00:00'), //任务开始时间
    endTime: moment().format('YYYY-MM-DD 23:59:59'), //任务结束时间
    taskFinishBeginTime: null, //任务开始时间
    taskFinishEndTime: null, //任务结束时间
    TaskContentType: [], //工单类型
    AuditStatus: 0, //任务审核状态
    TaskStatus: 0, //任务状态
    Total: 0, //任务总数
    auditTaskList: [], // 审核任务列表
    auditTaskSearchForm: {
      // 任务审核form
      current: 1,
      pageSize: 10,
      total: 0,
    },
    taskTypeList: [], // 任务类型
    InsertApplicationList: [], //监测点
    toggleTaskAuditModalVisible: false, // 任务审批弹窗
    taskDetails: {}, // 任务详情
    allTaskAuditList: [], // 审批单记录列表
    allTaskAuditSearchForm: {
      // 审批单记录form
      current: 1,
      pageSize: 10,
      total: 0,
    },
  },

  effects: {
    // 获取运维任务历史记录
    *GetMaintenanceTaskHistoryList({ payload }, { call, update, select }) {
      let {
        taskList,
        pageIndex,
        pageSize,
        PointCode,
        OperationsUserId,
        TaskCode,
        beginTime,
        endTime,
        TaskContentType,
        AuditStatus,
        TaskStatus,
        taskFinishBeginTime,
        taskFinishEndTime,
        ItemNum,
        RegionCode,
        EnterCode,
      } = yield select(_ => _.tasklist);
      let body = {
        pageIndex,
        pageSize,
        PointCode,
        OperationsUserId,
        TaskCode,
        beginTime,
        endTime,
        TaskContentType,
        AuditStatus,
        TaskStatus,
        taskFinishBeginTime,
        taskFinishEndTime,
        ItemNum,
        RegionCode,
        EnterCode,
      };
      const DataInfo = yield call(GetMaintenanceTaskHistoryList, body);
      if (DataInfo !== null && DataInfo.requstresult == EnumRequstResult.Success) {
        yield update({ taskList: DataInfo.data, Total: DataInfo.total });
      }
    },
    // 获取任务单审核列表
    *getAuditTaskList({ payload }, { call, update, select }) {
      const auditTaskSearchForm = yield select(state => state.tasklist.auditTaskSearchForm);
      const postData = {
        pageIndex: auditTaskSearchForm.current,
        pageSize: auditTaskSearchForm.pageSize,
        PointCode: auditTaskSearchForm.PointCode && auditTaskSearchForm.PointCode.value,
        TaskContentType:
          auditTaskSearchForm.TaskContentType && auditTaskSearchForm.TaskContentType.value,
        ImpPerson: auditTaskSearchForm.ImpPerson && auditTaskSearchForm.ImpPerson.value,
        ExamStaus: auditTaskSearchForm.ExamStaus && auditTaskSearchForm.ExamStaus.value,
        StartTime:
          auditTaskSearchForm.Time &&
          auditTaskSearchForm.Time.value &&
          auditTaskSearchForm.Time.value[0] &&
          moment(auditTaskSearchForm.Time.value[0]).format('YYYY-MM-DD HH:mm:ss'),
        EndTime:
          auditTaskSearchForm.Time &&
          auditTaskSearchForm.Time.value &&
          auditTaskSearchForm.Time.value[1] &&
          moment(auditTaskSearchForm.Time.value[1]).format('YYYY-MM-DD HH:mm:ss'),
        ExamNumber: auditTaskSearchForm.ExamNumber && auditTaskSearchForm.ExamNumber.value,
        UserId: JSON.parse(Cookie.get('token')).User_ID,
        // UserId: "83192d72-84b4-46f0-8935-20985afb768c"
      };
      const result = yield call(queryAuditTaskList, postData);
      if (result && result.requstresult === '1') {
        yield update({
          auditTaskList: result.data,
          auditTaskSearchForm: {
            ...auditTaskSearchForm,
            total: result.total,
          },
        });
      }
    },
    // 任务单审核
    *taskAudit({ payload }, { call, update, put, take }) {
      const postData = {
        ...payload,
      };
      const result = yield call(taskAudit, postData);
      if (result && result.requstresult === '1') {
        message.success('操作成功！');
        yield update({
          toggleTaskAuditModalVisible: false,
        });
        yield put({
          type: 'getAuditTaskList',
        });
        yield take('getAuditTaskList/@@end');
      }
    },
    // 任务单撤销
    *taskUndo({ payload }, { call, put, take }) {
      const postData = {
        ...payload,
      };
      const result = yield call(taskUndo, postData);
      if (result && result.requstresult === '1') {
        message.success('操作成功！');
        yield put({
          type: 'getAuditTaskList',
        });
        yield take('getAuditTaskList/@@end');
      }
    },
    // 获取任务类型
    *getTaskType({ payload }, { call, update, take }) {
      const result = yield call(getTaskType, {});
      if (result && result.requstresult === '1') {
        yield update({
          taskTypeList: result.data,
        });
      }
    },
    // 获取任务类型
    *getInsertApplication({ payload }, { call, update, take }) {
      const result = yield call(getInsertApplication, {});
      if (result && result.requstresult === '1') {
        yield update({
          InsertApplicationList: result.data,
        });
      }
    },
    // 获取任务详情
    *getTaskDetails({ payload }, { call, update, take }) {
      const result = yield call(getTaskDetails, payload);
      if (result && result.requstresult === '1') {
        yield update({
          taskDetails: result.data,
        });
      }
    },
    // 审批单记录列表
    *loadAllTaskAuditRecordList({ payload }, { call, update, select }) {
      const allTaskAuditSearchForm = yield select(state => state.tasklist.allTaskAuditSearchForm);
      const postData = {
        pageIndex: allTaskAuditSearchForm.current,
        pageSize: allTaskAuditSearchForm.pageSize,
        PointCode: allTaskAuditSearchForm.PointCode && allTaskAuditSearchForm.PointCode.value,
        TaskContentType:
          allTaskAuditSearchForm.TaskContentType && allTaskAuditSearchForm.TaskContentType.value,
        ImpPerson: allTaskAuditSearchForm.ImpPerson && allTaskAuditSearchForm.ImpPerson.value,
        ExamStaus: allTaskAuditSearchForm.ExamStaus && allTaskAuditSearchForm.ExamStaus.value,
        StartTime:
          allTaskAuditSearchForm.Time &&
          allTaskAuditSearchForm.Time.value &&
          allTaskAuditSearchForm.Time.value[0] &&
          moment(allTaskAuditSearchForm.Time.value[0]).format('YYYY-MM-DD HH:mm:ss'),
        EndTime:
          allTaskAuditSearchForm.Time &&
          allTaskAuditSearchForm.Time.value &&
          allTaskAuditSearchForm.Time.value[1] &&
          moment(allTaskAuditSearchForm.Time.value[1]).format('YYYY-MM-DD HH:mm:ss'),
        ExamNumber: allTaskAuditSearchForm.ExamNumber && allTaskAuditSearchForm.ExamNumber.value,
        // UserId: JSON.parse(Cookie.get('token')).User_ID
        // UserId: "83192d72-84b4-46f0-8935-20985afb768c"
      };
      const result = yield call(queryAllTaskAuditRecordList, postData);
      if (result && result.requstresult === '1') {
        yield update({
          allTaskAuditList: result.data,
          allTaskAuditSearchForm: {
            ...allTaskAuditSearchForm,
            total: result.total,
          },
        });
      }
    },
  },
});
