import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config';
import { downloadFile, requestPost } from '@/utils/utils';
import { API } from '@config/API';
export default Model.extend({
  namespace: 'operaPlan',
  state: {
    commonCol: (type, pageIndex, pageSize) => [{
      title: '序号',
      ellipsis: true,
      render: (text, record, index) => {
        return (index + 1) + (pageIndex - 1) * pageSize;
      }
    },
    {
      title: '计划编号',
      dataIndex: 'code',
      key: 'code',
      ellipsis: true,
    },
    {
      title: type == 1 ? '项目编号' : '合同编号',
      dataIndex: 'projectCode',
      key: 'projectCode',
      ellipsis: true,
    },
    {
      title: '合同名称',
      dataIndex: 'projectName',
      key: 'projectName',
      ellipsis: true,
    },
    {
      title: '污染源企业',
      dataIndex: 'entName',
      key: 'entName',
      width: 150,
      ellipsis: true,
    },
    {
      title: '运维单位',
      dataIndex: 'operationEnt',
      key: 'operationEnt',
      ellipsis: true,
    },
    {
      title: '点位类别',
      dataIndex: 'pollutantType',
      key: 'pollutantType',
      ellipsis: true,
      width: 90,
    },
    {
      title: '计划起始日期',
      dataIndex: 'beginTime',
      key: 'beginTime',
      ellipsis: true,
      width: 160,
    },
    {
      title: '计划结束日期',
      dataIndex: 'endTime',
      key: 'endTime',
      ellipsis: true,
      width: 160,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      ellipsis: true,
      width: 160,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      ellipsis: true,
      width: 90,
      render: (text, record, index) => {
        return <span className={text=='异常终止' ? 'red' : text == '进行中'? 'green' : ''}>{text}</span>
      }
    },
    {
      title: '创建人',
      dataIndex: 'createUserName',
      key: 'createUserName',
      ellipsis: true,
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      ellipsis: true,
    }],
    operationPlanQueryRefreshType: '',
    tableDatas: [],
    tableTotal: 0,
    queryPar: {},
    tableDatas2: [],
    tableTotal2: 0,
    queryPar2: {},
    tableDatas3: [],
    tableTotal3: 0,
    queryPar3: {},
    tableDatas4: [],
    tableTotal4: 0,
    queryPar4: {},
    operationPlanInfoRefreshType: '',
    operationPlanInfoRefreshId: '',
    operationPlanInfo: [],
    operationPlanInfoTotal: 0,
    operationPlanInfoQueryPar: {},
    xjPointList: [], //未排计划点位
    jzPointList: [],
    szwcPointList: [],
    jycsPointList: [],
    allPointList: [],
    operationPlanCalendarCol: [],
    operationPlanCalendarList: [],
    operationPlanCalendarTotal: 0,
    operationPlanCalendarQueryPar: {},
    operationPlanStatusList:[],
    operationPlanStatusTotal:0,
  },
  effects: {
    // 运维计划列表
    *GetOperationPlanList({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.PredictiveMaintenanceApi.GetOperationPlanList, payload);
      if (result.IsSuccess) {
        const planType = payload.planType
        switch (planType) {
          case 1:
            yield update({ tableDatas: result.Datas, tableTotal: result.Total, queryPar: payload, });
            break;
          case 2:
            yield update({ tableDatas2: result.Datas, tableTotal2: result.Total, queryPar2: payload, });
            break;
          case 3:
            yield update({ tableDatas3: result.Datas, tableTotal3: result.Total, queryPar3: payload, });
          default: //所有计划
            yield update({ tableDatas4: result.Datas, tableTotal4: result.Total, queryPar4: payload, });
            break;
        }
      }
    },
    // 运维计划 - 导出
    *ExportOperationPlanList({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.PredictiveMaintenanceApi.ExportOperationPlanList, payload);
      if (result.IsSuccess) {
        message.success('导出成功！');
        downloadFile(result.Datas);
      }
    },
    // 运维计划 - 删除
    *DeleteOperationPlan({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.PredictiveMaintenanceApi.DeleteOperationPlan, payload);
      if (result.IsSuccess) {
        message.success(result.Message);
        callback && callback()
      }
    },
    //修改运维计划基本信息
    *UpdOperationPlan({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.PredictiveMaintenanceApi.UpdOperationPlan, payload);
      if (result.IsSuccess) {
        message.success(result.Message);
        console.log('99999',result.Datas)
        yield update({ operationPlanInfoRefreshId: result.Datas });
        callback && callback(result.Datas)
      }
    },
    // 获取未排计划的点位
    *GetOperationPlanPointList({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.PredictiveMaintenanceApi.GetOperationPlanPointList, payload);
      if (result.IsSuccess) {
        yield update({ xjPointList: result?.Datas?.xjList, jzPointList: result?.Datas?.jzList, szwcPointList: result?.Datas?.szwcList, jycsPointList: result?.Datas?.jycsList, });
      }
    },
    // 生成运维计划
    *AddOperationPlan({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.PredictiveMaintenanceApi.AddOperationPlan, payload);
      if (result.IsSuccess) {
        message.success(result.Message);
        yield update({ operationPlanInfoRefreshId: result.Datas });
      }
      callback && callback(result.IsSuccess, result.Datas)
    },
    // 获取单个运维计划详情
    *GetOperationPlanInfo({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.PredictiveMaintenanceApi.GetOperationPlanInfo, {...payload,type:undefined});
      if (result.IsSuccess && payload.type!='par') {
        yield update({ operationPlanInfo: result?.Datas?.planInfoList, operationPlanInfoTotal: result?.Total || 0, operationPlanInfoQueryPar: payload, });
      }
      callback && callback(result?.Datas)
    },
     // 获取单个运维计划详情
    *ExportOperationPlanInfo({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.PredictiveMaintenanceApi.ExportOperationPlanInfo, payload);
      if (result.IsSuccess) {
        message.success('导出成功');
        downloadFile(`${result.Datas}`);
      }
    },
    // 删除运维计划点位
    *DelOperationPlanPoint({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.PredictiveMaintenanceApi.DelOperationPlanPoint, payload);
      if (result.IsSuccess) {
        message.success(result.Message);
        callback && callback()
      }
    },
    // 运维计划日历
    *GetOperationPlanCalendar({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.PredictiveMaintenanceApi.GetOperationPlanCalendar, payload);
      if (result.IsSuccess && result.Datas) {
        yield update({ operationPlanCalendarCol: result.Datas.colList, operationPlanCalendarList: result.Datas.dataList, operationPlanCalendarTotal: result.Total, operationPlanCalendarQueryPar: payload, });
        callback && callback(result.Datas)
      }
    },
     // 运维计划日历 导出
    *ExportOperationPlanCalendar({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.PredictiveMaintenanceApi.ExportOperationPlanCalendar, payload);
      if (result.IsSuccess) {
        message.success('导出成功');
        downloadFile(`${result.Datas}`);
      }
    },
    //可调整计划点位
    *GetFormulatePointList({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.PredictiveMaintenanceApi.GetFormulatePointList, payload);
      if (result.IsSuccess && result.Datas) {
        callback && callback(result.Datas)
      }
    },
    //计划点位 调整
    *AdjustmentOperationPlan({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.PredictiveMaintenanceApi.AdjustmentOperationPlan, payload);
      if (result.IsSuccess) {
        message.success(result.Message);
        callback && callback()
      }
    },
    //计划点位 延长
    *ExtendPlanDate({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.PredictiveMaintenanceApi.ExtendPlanDate, payload);
      if (result.IsSuccess) {
        message.success(result.Message);
        callback && callback()
      }
    },
     //计划点位 状态修改
    *UpdOperationPlanPoint({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.PredictiveMaintenanceApi.UpdOperationPlanPoint, payload);
      if (result.IsSuccess) {
        message.success(result.Message);
        callback && callback()
      }
    },
    //运维计划状态修改记录
    *GetOperationPlanStatusList({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.PredictiveMaintenanceApi.GetOperationPlanStatusList, payload);
      if (result.IsSuccess) {
        yield update({ operationPlanStatusList: result.Datas, operationPlanStatusTotal: result.Total });
        callback && callback()
      }
    },
    //运维计划状态修改
    *UpdOperationPlanStatus({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.PredictiveMaintenanceApi.UpdOperationPlanStatus, payload);
      if (result.IsSuccess) {
        message.success(result.Message);
        callback && callback()
      }
    },


  },
});
