import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import config from '@/config'

export default Model.extend({
  namespace: 'operations',
  state: {
    calendarList: [],
    abnormalDetailList: [],
    abnormalForm: {
      current: 1,
      pageSize: 10,
      total: 0
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
      Applicant: Cookie.get("currentUser") && JSON.parse(Cookie.get("currentUser")).UserId,
      current: 1,
      pageSize: 10,
      total: 0
    },
    // 车辆审批
    vehicleApproveList: [],
    vehicleApproveForm: {
      current: 1,
      pageSize: 10,
      total: 0
    },
    approveModalVisible: false,
    approveModalData: {},
    applicantList: [],
  },
  effects: {
    // 获取日历信息
    * getCalendarInfo({ payload }, { call, put, update }) {
      const result = yield call(services.getCalendarInfo, payload);
      if (result.IsSuccess) {
        yield update({
          calendarList: result.Datas
        })
      }
    },

    // 获取异常详细信息 - 表格数据
    * getAbnormalDetailList({ payload }, { call, put, update, select }) {
      const abnormalForm = yield select(state => state.operations.abnormalForm)
      const result = yield call(services.getAbnormalDetailList, payload);
      if (result.IsSuccess) {
        yield update({
          abnormalDetailList: result.Datas,
          abnormalForm: {
            ...abnormalForm,
            total: result.Total
          }
        })
      }
    },

    // 获取运维日志信息
    * getOperationLogList({ payload }, { call, put, update }) {
      const result = yield call(services.getOperationLogList, payload);
      if (result.IsSuccess) {
        yield update({
          recordTypeList: result.Datas.RecordType,
          timeLineList: result.Datas.FormList,
          timeLineTotal: result.Total
        })
      }
    },

    // 获取运维日志详情图片
    * getOperationImageList({ payload, callback }, { call, put, update }) {
      const result = yield call(services.getOperationImageList, payload);
      if (result.IsSuccess) {
        let imageList = [];
        if (result.Datas) {
          imageList = result.Datas.map((item, index) => {
            return {
              uid: index,
              name: item,
              status: 'done',
              url: config.imgaddress + item
            }
          })
          yield update({
            imageListVisible: true
          })
          callback && callback(result)
        } else {
          message.error("暂无数据")
        }
        yield update({
          imageList: imageList,
        })
      }
    },
    // 车辆申请
    * getVehicleApplicationList({ payload }, { call, put, update, select }) {
      const searchForm = yield select(state => state.operations.vehicleApplicationForm);
      const postData = {
        Applicant: searchForm.Applicant,
        ApplicationCode: searchForm.ApplicationCode && searchForm.ApplicationCode.value,
        VehicleName: searchForm.VehicleName && searchForm.VehicleName.value,
        LicensePlateNumber: searchForm.LicensePlateNumber && searchForm.LicensePlateNumber.value,
        ApplicationBTime: searchForm.ApplicationTime && searchForm.ApplicationTime.value[0] && moment(searchForm.ApplicationTime.value[0]).format("YYYY-MM-DD"),
        ApplicationETime: searchForm.ApplicationTime && searchForm.ApplicationTime.value[1] && moment(searchForm.ApplicationTime.value[1]).format("YYYY-MM-DD"),
        pageIndex: searchForm.current,
        pageSize: searchForm.pageSize,
        ...payload
      }
      const result = yield call(services.getVehicleApplicationList, postData);
      if (result.IsSuccess) {
        yield update({
          vehicleApplicationList: result.Datas,
          vehicleApplicationForm: {
            ...searchForm,
            total: result.Total
          }
        })
      }
    },

    // 车辆审批列表
    * getVehicleApproveList({ payload }, { call, put, update, select }) {
      const searchForm = yield select(state => state.operations.vehicleApproveForm);
      const postData = {
        Applicant: searchForm.Applicant && searchForm.Applicant.value,
        ApplicationCode: searchForm.ApplicationCode && searchForm.ApplicationCode.value,
        VehicleName: searchForm.VehicleName && searchForm.VehicleName.value,
        LicensePlateNumber: searchForm.LicensePlateNumber && searchForm.LicensePlateNumber.value,
        ApplicationBTime: searchForm.ApplicationTime && searchForm.ApplicationTime.value[0] && moment(searchForm.ApplicationTime.value[0]).format("YYYY-MM-DD"),
        ApplicationETime: searchForm.ApplicationTime && searchForm.ApplicationTime.value[1] && moment(searchForm.ApplicationTime.value[1]).format("YYYY-MM-DD"),
        ApprovalStatus: searchForm.ApprovalStatus && searchForm.ApprovalStatus.value,
        pageIndex: searchForm.current,
        pageSize: searchForm.pageSize,
        ...payload
      }
      const result = yield call(services.getVehicleApplicationList, postData);
      if (result.IsSuccess) {
        yield update({
          vehicleApproveList: result.Datas,
          vehicleApproveForm: {
            ...searchForm,
            total: result.Total
          }
        })
      }
    },

    // 获取车辆列表
    * getVehicleList({ payload }, { call, put, update }) {
      const result = yield call(services.getVehicleList, payload);
      if (result.IsSuccess) {
        payload.type === "0" ?
          yield update({
            applyVehicleList: result.Datas
          }) : yield update({
            vehicleList: result.Datas
          })
      }
    },

    // 申请车辆
    * addVehicleApplication({ payload }, { call, put, update }) {
      const postData = {
        Applicant: JSON.parse(Cookie.get("currentUser")).UserId,
        ...payload
      }
      const result = yield call(services.addVehicleApplication, postData);
      if (result.IsSuccess) {
        yield put({
          type: "getVehicleApplicationList"
        })
        yield update({
          applicationModalVisible: false
        })
        message.success('申请成功');
      } else {
        message.error('申请失败')
      }
    },
    // 撤销申请
    * cancelApplication({ payload }, { call, put, update }) {
      const result = yield call(services.cancelApplication, payload);
      if (result.IsSuccess) {
        yield put({
          type: "getVehicleApplicationList"
        })
        message.success("撤销成功")
      }else{
        message.error("失败")
      }
    },
    // 审批
    *approve({ payload }, { call, put, update }) {
      const result = yield call(services.approve, payload);
      if (result.IsSuccess) {
        yield update({
          approveModalVisible: false
        })
        message.success("操作成功");
        yield put({
          type: "getVehicleApproveList"
        })
      }
    },

    // 车辆归还
    *returnVehicle({ payload }, { call, put, update }) {
      const result = yield call(services.returnVehicle, payload);
      if (result.IsSuccess) {
        message.success("操作成功")
        yield put({
          type: "getVehicleApproveList"
        })
      }
    },

    // 获取申请人
    *getApplicant({ payload }, { call, put, update }) {
      const result = yield call(services.getApplicant, payload);
      if (result.IsSuccess) {
        yield update({
          applicantList: result.Datas
        })
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
          ...payload
        },
      };
    },
  }
})