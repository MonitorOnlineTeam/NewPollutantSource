import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config';

export default Model.extend({
  namespace: 'operations',
  state: {
    calendarList: [],
    logForm: {
      RecordType: undefined,
      dateTime: [
        moment()
          .subtract(3, 'month')
          .startOf('day'),
        moment().endOf('day'),
      ],
    },
    abnormalDetailList: [],
    futureDetailList: [],
    abnormalForm: {
      current: 1,
      pageSize: 6,
      total: 0,
    },
    recordTypeList: [],
    timeLineList: [],
    timeLineTotal: 0,
    imageList: [],
    imageListVisible: false,
    // 车辆申请
    applicationModalVisible: false,
    vehicleApplicationList: [],
    vehicleList: [],
    applyVehicleList: [],
    vehicleApplicationForm: {
      Applicant: Cookie.get('currentUser') && JSON.parse(Cookie.get('currentUser')).UserId,
      current: 1,
      pageSize: 10,
      total: 0,
    },
    // 车辆审批
    vehicleApproveList: [],
    vehicleApproveForm: {
      current: 1,
      pageSize: 10,
      total: 0,
    },
    approveModalVisible: false,
    approveModalData: {},
    applicantList: [],
    operationsUserList: [],
    modalTableDataSource: [],
    // 车辆轨迹
    longlatList: [],
    speedList: [],
    recordingTimeList: [],
    railData: null,
    recordType: [],
    targetInfoList: [],
    pointInfoList: [],
    // 指挥调度报表
    datatable: [],
    queryparams: {
      DGIMN: '',
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      UserID: '',
      BTime: '',
      ETime: '',
      CommandDispatchType: '',

    },
    operationCompanyList:[]

  },
  effects: {
    // 获取日历信息
    *getCalendarInfo({ payload }, { call, put, update }) {
      const result = yield call(services.getCalendarInfo, payload);
      if (result.IsSuccess) {
        const excetionTotal = result.Datas.excetionTotal || [];
        const FutureTotal = result.Datas.FutureTotal || [];
        yield update({
          calendarList: [...excetionTotal, ...FutureTotal],
        });
      }
    },

    // 获取异常详细信息 - 表格数据
    *getAbnormalDetailList({ payload }, { call, put, update, select }) {
      const abnormalForm = yield select(state => state.operations.abnormalForm);
      const result = yield call(services.getAbnormalDetailList, payload);
      if (result.IsSuccess) {
        let newState = {};
        if (payload.FutureType !== undefined) {
          // 之后
          newState = {
            futureDetailList: result.Datas || [],
          };
        } else {
          // 之前
          newState = {
            abnormalDetailList: result.Datas || [],
          };
        }
        yield update({
          abnormalForm: {
            ...abnormalForm,
            total: result.Total,
          },
          ...newState,
        });
      }
    },

    // 获取运维日志信息
    *getOperationLogList({ payload }, { call, put, update, select }) {
      const logForm = yield select(state => state.operations.logForm);
      const time = yield select(state => state.operationform.currentDate);
      const recordTypeList = yield select(state => state.operations.recordTypeList);
      const postData = {
        RecordType: logForm.RecordType,
        beginTime: time[0].format('YYYY-MM-DD 00:00:00'),
        endTime: time[1].format('YYYY-MM-DD 23:59:59'),
        ...payload,
      };
      const result = yield call(services.getOperationLogList, postData);
      if (result.IsSuccess) {
        // if(JSON.stringify(result.Datas.RecordType) != JSON.stringify(recordTypeList)){
        if (payload.RecordType == '') {
          yield update({
            recordTypeList: result.Datas.RecordType,
            logForm: {
              ...logForm,
              RecordType: '',
            },
          });
        }
        yield update({
          recordTypeList: result.Datas.RecordType,
          timeLineList: result.Datas.FormList,
          timeLineTotal: result.Total,
        });
      }
    },
    // 获取运维日志详情图片
    *getOperationImageList({ payload, callback }, { call, put, update }) {
      const result = yield call(services.getOperationImageList, payload);
      if (result.IsSuccess) {
        let imageList = [];
        if (result.Datas) {
          imageList = result.Datas.map((item, index) => ({
            uid: index,
            name: item,
            status: 'done',
            url: `/uploadplantform/${item}`,
          }));
          yield update({
            imageListVisible: true,
          });
          callback && callback(result);
        } else {
          message.error('暂无数据');
        }
        yield update({
          imageList,
        });
      }
    },
    // 车辆申请
    *getVehicleApplicationList({ payload }, { call, put, update, select }) {
      const searchForm = yield select(state => state.operations.vehicleApplicationForm);
      const postData = {
        Applicant: searchForm.Applicant,
        ApplicationCode: searchForm.ApplicationCode && searchForm.ApplicationCode.value,
        VehicleName: searchForm.VehicleName && searchForm.VehicleName.value,
        LicensePlateNumber: searchForm.LicensePlateNumber && searchForm.LicensePlateNumber.value,
        ApplicationBTime:
          searchForm.ApplicationTime &&
          searchForm.ApplicationTime.value[0] &&
          moment(searchForm.ApplicationTime.value[0]).format('YYYY-MM-DD'),
        ApplicationETime:
          searchForm.ApplicationTime &&
          searchForm.ApplicationTime.value[1] &&
          moment(searchForm.ApplicationTime.value[1]).format('YYYY-MM-DD'),
        pageIndex: searchForm.current,
        pageSize: searchForm.pageSize,
        ...payload,
      };
      const result = yield call(services.getVehicleApplicationList, postData);
      if (result.IsSuccess) {
        yield update({
          vehicleApplicationList: result.Datas,
          vehicleApplicationForm: {
            ...searchForm,
            total: result.Total,
          },
        });
      }
    },

    // 车辆审批列表
    *getVehicleApproveList({ payload }, { call, put, update, select }) {
      const searchForm = yield select(state => state.operations.vehicleApproveForm);
      const postData = {
        ApplicantID: searchForm.ApplicantID && searchForm.ApplicantID.value,
        ApplicationCode: searchForm.ApplicationCode && searchForm.ApplicationCode.value,
        VehicleName: searchForm.VehicleName && searchForm.VehicleName.value,
        LicensePlateNumber: searchForm.LicensePlateNumber && searchForm.LicensePlateNumber.value,
        ApplicationBTime:
          searchForm.ApplicationTime &&
          searchForm.ApplicationTime.value[0] &&
          moment(searchForm.ApplicationTime.value[0]).format('YYYY-MM-DD'),
        ApplicationETime:
          searchForm.ApplicationTime &&
          searchForm.ApplicationTime.value[1] &&
          moment(searchForm.ApplicationTime.value[1]).format('YYYY-MM-DD'),
        ApprovalStatus: searchForm.ApprovalStatus && searchForm.ApprovalStatus.value,
        pageIndex: searchForm.current,
        pageSize: searchForm.pageSize,
        ...payload,
      };
      const result = yield call(services.getVehicleApplicationList, postData);
      if (result.IsSuccess) {
        yield update({
          vehicleApproveList: result.Datas,
          vehicleApproveForm: {
            ...searchForm,
            total: result.Total,
          },
        });
      }
    },

    // 获取车辆列表
    *getVehicleList({ payload }, { call, put, update }) {
      const result = yield call(services.getVehicleList, payload);
      if (result.IsSuccess) {
        payload.type === '0'
          ? yield update({
              applyVehicleList: result.Datas,
            })
          : yield update({
              vehicleList: result.Datas,
            });
      }
    },

    // 申请车辆
    *addVehicleApplication({ payload }, { call, put, update }) {
      const postData = {
        Applicant: JSON.parse(Cookie.get('currentUser')).UserId,
        ...payload,
      };
      const result = yield call(services.addVehicleApplication, postData);
      if (result.IsSuccess) {
        yield put({
          type: 'autoForm/getAutoFormData',
          payload: {
            configId: 'VehicleApplication',
          },
        });
        yield update({
          applicationModalVisible: false,
        });
        message.success('申请成功');
      } else {
        message.error('申请失败');
      }
    },
    // 撤销申请
    *cancelApplication({ payload }, { call, put, update }) {
      const result = yield call(services.cancelApplication, payload);
      if (result.IsSuccess) {
        yield put({
          type: 'autoForm/getAutoFormData',
          payload: {
            configId: 'VehicleApplication',
          },
        });
        message.success('撤销成功');
      } else {
        message.error('失败');
      }
    },
    // 审批
    *approve({ payload }, { call, put, update }) {
      const result = yield call(services.approve, payload);
      if (result.IsSuccess) {
        yield update({
          approveModalVisible: false,
        });
        message.success('操作成功');
        yield put({
          type: 'autoForm/getAutoFormData',
          payload: {
            configId: 'VehicleApproval',
          },
        });
      }
    },

    // 车辆归还
    *returnVehicle({ payload }, { call, put, update }) {
      const result = yield call(services.returnVehicle, payload);
      if (result.IsSuccess) {
        message.success('操作成功');
        yield put({
          type: 'autoForm/getAutoFormData',
          payload: {
            configId: 'VehicleApproval',
          },
        });
      }
    },

    // 获取申请人
    *getApplicant({ payload }, { call, put, update }) {
      const result = yield call(services.getApplicant, payload);
      if (result.IsSuccess) {
        yield update({
          applicantList: result.Datas,
        });
      }
    },

    // 派单
    *addTask({ payload, callback }, { call, put, update }) {
      const result = yield call(services.addTask, payload);
      if (result.IsSuccess) {
        message.success('操作成功');
        yield put({
          type: 'autoForm/getAutoFormData',
          payload: {
            configId: 'TaskRecord',
          },
        });

        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 驳回
    *rejectTask({ payload }, { call, put, update }) {
      const result = yield call(services.rejectTask, payload);
      if (result.IsSuccess) {
        message.success('操作成功');
        yield put({
          type: 'autoForm/getAutoFormData',
          payload: {
            configId: 'TaskRecord',
          },
        });
      }
    },

    // 获取运维人员列表
    *getOperationsUserList({ payload }, { call, put, update }) {
      const result = yield call(services.getOperationsUserList, payload);
      if (result.IsSuccess) {
        yield update({
          operationsUserList: result.Datas,
        });
      }
    },
    // 获取运维更换记录
    *getOperationReplacePageList({ payload }, { call, put, update }) {
      const result = yield call(services.getOperationReplacePageList, payload);
      if (result.IsSuccess) {
        yield update({
          modalTableDataSource: result.Datas,
          modalTableTotal: result.Total,
        });
      }
    },
    // 获取车辆轨迹数据
    *getVehicleTrajectory({ payload }, { call, put, update }) {
      const result = yield call(services.getVehicleTrajectory, payload);
      if (result.IsSuccess) {
        // 经纬度集合
        const longlatList = [];
        // 时间集合
        const speedList = [];
        // 时间集合
        const recordingTimeList = [];
        result.Datas.VehicleInfo.map(item => {
          longlatList.push([item.Longitude, item.Latitude]);
          speedList.push(item.Speed);
          recordingTimeList.push(item.RecordingTime);
        });
        if (!result.Datas.VehicleInfo.length) {
          message.error('暂无车辆轨迹信息');
        } else {
          router.push(
            `/operations/carmanager/vehicleApplication/trajectory/${payload.ApplicantID}`,
          );
        }
        yield update({
          longlatList,
          speedList,
          recordingTimeList,
          railData: result.Datas.Enclosure,
        });
      }
    },

    // 获取任务类型
    *getTaskType({ payload }, { call, update }) {
      const result = yield call(services.getTaskType, payload);
      yield update({
        recordType: result.Datas,
      });
    },
    // 获取监控标列表
    *getTargetInfoList({ payload }, { call, update }) {
      const result = yield call(services.getTargetInfoList, payload);
      yield update({
        targetInfoList: result.Datas,
      });
    },
    // 获取站点列表
    *getPointInfoList({ payload }, { call, update }) {
      const result = yield call(services.getPointInfoList, payload);
      yield update({
        pointInfoList: result.Datas,
      });
    },
    /** 获取指挥调度数据 */
    *getcommanddispatchreport({ payload }, { call, update, select }) {
      const { queryparams } = yield select(_ => _.operations);
      const result = yield call(services.getcommanddispatchreport, queryparams);
      if (result.IsSuccess) {
        yield update({
          queryparams: {
            ...queryparams,
            total: result.Total,
          },
          datatable: result.Datas,
        });
      }
    },
    //查询公司运维单位列表信息
    *getOperationCompanyList({ payload }, { call, put, update, select }) {
      const result = yield call(services.getOperationCompanyList, payload);

      if (result.IsSuccess) {
        yield update({
          operationCompanyList: result.Datas,
        });
      } else {
        sdlMessage(result.Message, "warning");
      }
    },      
  },
  reducers: {
    // 更新车辆申请state
    updateVehicleApplicationState(state, { payload }) {
      return {
        ...state,
        vehicleApplication: {
          ...state.vehicleApplication,
          ...payload,
        },
      };
    },
  },
});
