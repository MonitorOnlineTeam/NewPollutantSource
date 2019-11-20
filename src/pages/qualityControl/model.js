/*
 * @Create: Jiaqi 
 * @Date: 2019-11-07 10:53:38 
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2019-11-20 17:17:44
 * @desc: 智能质控model
 */

import moment from 'moment';
import * as services from './service';
import { getentandpoint } from "@/services/baseTreeApi";
import Model from '@/utils/model';
import { router } from 'umi'
import { message } from 'antd';
// import { EnumRequstResult } from '../utils/enum';

export default Model.extend({
  namespace: 'qualityControl',
  state: {
    entAndPointList: [],
    standardGasList: [],
    qualityControlFormData: {},
    qualityControlTableData: [],
    CEMSList: [],
    autoQCAInfo: [],
    entRate: {
      allResult: 0,
      noAllResult: 0,
      entName: [],
      entResult: [],
    },
    entStaticDataList: [],
    resultContrastData: {
      valueList: [],
      timeList: [],
      tableData: [],
      standValue: 0,
      errorStr: undefined,
    },
    resultContrastTimeList: [],
    paramsRecordForm: {
      current: 1,
      pageSize: 10,
      total: 0
    },
    paramsList: [],
    paramsTableData: [],
    /* 
     TODO (WJQ) : 换完图表接口地址后，将下面替换成 
     paramsChartData: {
      TimeList:[],
      DataList:[],
      legendList:[]
     } 
    */
    paramsChartData: {
      TimeList: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      DataList: [
        {
          name: '邮件营销',
          type: 'line',
          // stack: '总量',
          data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
          name: '联盟广告',
          type: 'line',
          // stack: '总量',
          data: [220, 182, 191, 234, 290, 330, 310]
        },
        {
          name: '视频广告',
          type: 'line',
          // stack: '总量',
          data: [150, 232, 201, 154, 190, 330, 410]
        },
        {
          name: '直接访问',
          type: 'line',
          // stack: '总量',
          data: [320, 332, 301, 334, 390, 330, 320]
        },
        {
          name: '搜索引擎',
          type: 'line',
          // stack: '总量',
          data: [820, 932, 901, 934, 1290, 1330, 1320]
        }
      ],
      legendList: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
    }
  },

  effects: {
    // 获取企业及排口
    *getEntAndPointList({ payload }, { call, update, select }) {
      let postData = {
        RunState: "",
        Status: [0, 1, 2, 3]
      }
      let global = yield select(state => state.global);
      if (!global.configInfo) {
        yield take('global/getSystemConfigInfo/@@end');
        global = yield select(state => state.global);
        postData.PollutantTypes = global.configInfo.SystemPollutantType
      } else {
        postData.PollutantTypes = global.configInfo.SystemPollutantType
      }

      const result = yield call(getentandpoint, postData);
      if (result.IsSuccess) {
        yield update({
          entAndPointList: result.Datas
        })
      } else {
        message.error(result.Message)
      }
    },
    // 获取标气
    *getStandardGas({ payload }, { call, put, update }) {
      const result = yield call(services.getStandardGas, payload);
      if (result.IsSuccess) {
        yield update({
          standardGasList: result.Datas
        })
      }
    },
    // 添加质控仪
    *addQualityControl({ payload }, { call, put }) {
      const result = yield call(services.addQualityControl, payload);
      if (result.IsSuccess) {
        router.push("/qualityControl/instrumentManage")
        message.success("添加成功！")
      } else {
        message.error(result.Message)
      }
    },
    // 获取质控仪数据
    *getQualityControlData({ payload }, { call, put, update }) {
      const result = yield call(services.getQualityControlData, payload);
      if (result.IsSuccess) {
        let qualityControlTableData = [];
        if (result.Datas.Relation) {
          qualityControlTableData = result.Datas.Relation.map((item, index) => {
            let Component = [];
            Component = item.Component.map((itm, idx) => {
              return {
                ...itm,
                key: `${index}${idx}`
              }
            })
            return {
              ...item,
              DGIMNArr: item.DGIMN.split("/"),
              key: index,
              Component: [
                ...Component
              ]
            }
          })
        }
        console.log("qualityControlTableData=", qualityControlTableData)
        yield update({
          qualityControlFormData: result.Datas.Info,
          qualityControlTableData: qualityControlTableData,
        })
      } else {
        message.error(result.Message)
      }
    },
    // 获取CEMS列表
    *getCEMSList({ payload }, { call, put, update }) {
      const result = yield call(services.getCEMSList, payload);
      if (result.IsSuccess) {
        yield update({
          CEMSList: [
            ...result.Datas,
            // {
            //   DGIMN: "test1",
            //   PointName: "test1",
            //   MNHall: "test1",
            // }, {
            //   DGIMN: "test2",
            //   PointName: "test2",
            //   MNHall: "test2",
            // },
          ]
        })
      }
    },
    // 发送质控命令 
    * SendQCACmd({ payload }, { call, put, update }) {
      const result = yield call(services.SendQCACmd, payload);
      if (result.IsSuccess) {
        message.success("操作成功")
      } else {
        message.error(result.Message)
      }
    },
    // 获取自动质控信息 
    * getAutoQCAInfo({ payload }, { call, put, update }) {
      const result = yield call(services.getAutoQCAInfo, payload);
      if (result.IsSuccess) {
        yield update({
          autoQCAInfo: result.Datas
        })
      } else {
        message.error(result.Message)
      }
    },
    // 取消自动质控计划 
    * cancelPlan({ payload }, { call, put, update }) {
      const result = yield call(services.cancelPlan, payload);
      if (result.IsSuccess) {
        message.success("取消成功");
        yield put({
          type: "qualityControl/getAutoQCAInfo",
          payload: {
            qcamn: payload.QCAMN
          }
        })
      } else {
        message.error(result.Message)
      }
    },
    // 获取企业达标率 
    * QCAResultStatic({ payload }, { call, put, update }) {
      const result = yield call(services.QCAResultStatic, payload);
      if (result.IsSuccess) {
        let entResult = result.Datas.entResult;
        entResult.map((item, index) => {
          entResult[index] = item * 100;
        })
        yield update({
          entRate: {
            ...result.Datas,
            entResult: entResult
          }
        })
      } else {
        message.error(result.Message)
      }
    },
    // 获取单个企业统计数据 
    * QCAResultStaticByEntCode({ payload }, { call, put, update }) {
      const result = yield call(services.QCAResultStaticByEntCode, payload);
      if (result.IsSuccess) {
        yield update({
          // entRate: result.Datas
          entStaticDataList: result.Datas
        })
      } else {
        message.error(result.Message)
      }
    },
    // 获取结果比对数据 
    * QCAResultCheckByDGIMN({ payload, otherParams }, { call, put, update }) {
      const result = yield call(services.QCAResultCheckByDGIMN, payload);
      if (result.IsSuccess) {
        if (otherParams.isSearch) {
          message.success("结果比对完成！")
        }
        yield update({
          resultContrastData: result.Datas
        })
      } else {
        message.error(result.Message)
      }
    },
    // 获取结果比对时间下拉列表 
    * QCAResultCheckSelectList({ payload, otherParams }, { call, put, update }) {
      const result = yield call(services.QCAResultCheckSelectList, payload);
      if (result.IsSuccess) {
        yield update({
          resultContrastTimeList: result.Datas
        })
      } else {
        message.error(result.Message)
      }
    },
    // 获取结果比对时间下拉列表 
    * QCAResultCheckSelectList({ payload, otherParams }, { call, put, update }) {
      const result = yield call(services.QCAResultCheckSelectList, payload);
      if (result.IsSuccess) {
        yield update({
          resultContrastTimeList: result.Datas
        })
      } else {
        message.error(result.Message)
      }
    },
    // 获取参数列表
    * getParamsList({ payload, otherParams }, { call, put, update }) {
      const result = yield call(services.getDataTempletList, payload);
      if (result.IsSuccess) {
        yield update({
          paramsList: result.Datas
        })
      } else {
        message.error(result.Message)
      }
    },
    //  获取参数记录表格数据
    * getParamsTableData({ payload, otherParams }, { call, put, update, select }) {
      const paramsRecordForm = yield select(state => state.qualityControl.paramsRecordForm);
      const postData = {
        pageIndex: paramsRecordForm.current,
        pageSize: paramsRecordForm.pageSize,
        DataTempletCode: paramsRecordForm.DataTempletCode && paramsRecordForm.DataTempletCode.value.toString(),
        BeginTime: paramsRecordForm.time && paramsRecordForm.time.value[0] && moment(paramsRecordForm.time.value[0]).format("YYYY-MM-DD"),
        EndTime: paramsRecordForm.time && paramsRecordForm.time.value[1] && moment(paramsRecordForm.time.value[1]).format("YYYY-MM-DD"),
        status: paramsRecordForm.status && paramsRecordForm.status.value,
        ...payload
      }
      console.log("postData=", postData)
      const result = yield call(services.getParamsTableData, postData);
      if (result.IsSuccess) {
        yield update({
          paramsTableData: [
            ...result.Datas,
            {
              MonitorTime: "2019-11-20",
              Name: "二氧化硫",
              Value: "12",
              flag: 1
            }
          ],
          paramsRecordForm: {
            ...paramsRecordForm,
            total: result.Total
          }
        })
      } else {
        message.error(result.Message)
      }
    },
    //  获取参数记录图表数据
    * getParamsChartData({ payload, otherParams }, { call, put, update, select }) {
      const paramsRecordForm = yield select(state => state.qualityControl.paramsRecordForm);
      const postData = {
        BeginTime: paramsRecordForm.time && paramsRecordForm.time.value[0] && moment(paramsRecordForm.time.value[0]).format("YYYY-MM-DD"),
        EndTime: paramsRecordForm.time && paramsRecordForm.time.value[1] && moment(paramsRecordForm.time.value[1]).format("YYYY-MM-DD"),
        DataTempletCode: paramsRecordForm.DataTempletCode && paramsRecordForm.DataTempletCode.value.toString(),
        ...payload
      }
      // console.log("postData123213=", postData)
      // return;
      const result = yield call(services.getParamsChartData, postData);
      if (result.IsSuccess) {
        // 处理图例
        let legendList = [];
        result.Datas.DataList.map(item => {
          legendList.push(item.name)
        })
        yield update({
          paramsChartData: {
            ...result.Datas,
            legendList: legendList
          }
        })
      } else {
        message.error(result.Message)
      }
    },
  },
});
