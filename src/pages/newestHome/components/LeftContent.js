/**
 * 功能：首页 左侧内容
 * 创建人：jab
 * 创建时间：2021.11.08
 */
import React, { useState, useEffect, Fragment, useRef, useMemo } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Popover, Radio, Spin } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, RollbackOutlined } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import RangePicker_ from '@/components/RangePicker/NewRangePicker'
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import ReactEcharts from 'echarts-for-react';
import PageLoading from '@/components/PageLoading'
import moment from 'moment'
import styles from "../style.less"
import CardHeader from './publicComponents/CardHeader'
import ScrollTable from './publicComponents/ScrollTable'
import MoreBtn from './publicComponents/MoreBtn'
import PlanWorkOrderStatistics from './springModal/planWorkOrderStatistics'
import EntWorkOrderModal from '@/pages/IntelligentAnalysis/operationWorkStatis/homeEntWorkOrderStatistics/EntWorkOrderModal'
import OperatingInfo from './springModal/operatingInfo'
import TaskRecord from '@/pages/operations/TaskRecord'
import PlanWorkOrderStatisticsDay from '@/pages/IntelligentAnalysis/planWorkOrderStatisticsDay'
import { fontSizeFn } from '@/pages/SystemDashboard/CONST.js';

const { Option } = Select;

const namespace = 'newestHome'

// const subjectFontSize = 14;



const dvaPropsData = ({ loading, newestHome, global }) => ({
  operationLoading: loading.effects[`${namespace}/GetOperatePointList`],
  operationDataSource: newestHome.operationDataSource,
  operationTaskLoading: loading.effects[`${namespace}/GetOperationTaskList`],
  operaOrderData: newestHome.operaOrderData,
  operationPlanTaskLoading: loading.effects[`${namespace}/GetOperationPlanTaskRate`],
  operationTaskCompleteRateByDayLoading: loading.effects[`${namespace}/GetPlanOperationTaskCompleteRateByDay`],
  planOperaList: newestHome.planOperaList,
  planCompleteListLoading: loading.effects[`${namespace}/GetOperationRegionPlanTaskRate`],
  planCompleteList: newestHome.planCompleteList,
  latelyDays30: newestHome.latelyDays30,
  pollType: newestHome.pollType,
  subjectFontSize: newestHome.subjectFontSize,
  operationSettingInfo: global.operationSettingInfo,
  operationTaskStatisticsInfoByDayLoading: loading.effects[`${namespace}/GetOperationTaskStatisticsInfoByDay`],
})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => { //更新参数
      dispatch({
        type: `${namespace}/updateState`,
        payload: { ...payload },
      })
    },
    GetOperatePointList: (payload) => { //运维信息总览
      dispatch({
        type: `${namespace}/GetOperatePointList`,
        payload: { ...payload },
      })
    },
    GetBWOperatePointList: (payload) => { //运维信息总览 宝武
      dispatch({
        type: `${namespace}/GetBWOperatePointList`,
        payload: { ...payload },
      })
    },
    GetOperationTaskList: (payload) => { //运维工单统计
      dispatch({
        type: `${namespace}/GetOperationTaskList`,
        payload: { ...payload },
      })
    },
    GetOperationPlanTaskRate: (payload) => { //近30日运维情况
      dispatch({
        type: `${namespace}/GetOperationPlanTaskRate`,
        payload: { ...payload },
      })
    },
    GetOperationRegionPlanTaskRate: (payload) => { //计划完成率
      dispatch({
        type: `${namespace}/GetOperationRegionPlanTaskRate`,
        payload: { ...payload },
      })
    },
    entWorkOrderStatistics: (payload) => { //运维工单统计弹框
      dispatch({
        type: `entWorkOrderStatistics/GetOperationRegionPlanTaskRate`,
        payload: { ...payload },
      })
    },
    GetOperationTaskStatisticsInfoByDay: (payload, callback) => { //工单执行情况 固定到天
      dispatch({
        type: `${namespace}/GetOperationTaskStatisticsInfoByDay`,
        payload: { ...payload },
        callback: callback,
      })
    },
    GetOperationPlanTaskListByDay: (payload, callback) => { //工单执行情况 详情 固定到天
      dispatch({
        type: `${namespace}/GetOperationPlanTaskListByDay`,
        payload: { ...payload },
        callback: callback,
      })
    },
    GetPlanOperationTaskCompleteRateByDay: (payload, callback) => { //近30日运维情况 固定到天
      dispatch({
        type: `${namespace}/GetPlanOperationTaskCompleteRateByDay`,
        payload: { ...payload },
        callback: callback,
      })
    },
    GetWorkOrderAnalysisList: (payload, callback) => { //近30日运维情况 详情 固定到天
      dispatch({
        type: `${namespace}/GetWorkOrderAnalysisList`,
        payload: { ...payload },
        callback: callback,
      })
    },
  }

}
const Index = (props) => {




  const { operaOrderData, latelyDays30, pollType, subjectFontSize, operationSettingInfo: { TaskPlanType }, operationTaskStatisticsInfoByDayLoading } = props;
  const [workOrderExecuTimeVal, setWorkOrderExecuTimeVal] = useState('1')
  const workOrderExecuTimeOptions =
    [{ label: '今日', value: '1' },
    { label: '昨日', value: '2' },
    { label: '前日', value: '3' },
    { label: '近7日', value: '4' }]
  const workOrderExecuTimeObj = {
    '1': { beginTime: moment().startOf('day').format('YYYY-MM-DD 00:00:00'), endTime: moment().format('YYYY-MM-DD 23:59:59') },
    '2': { beginTime: moment().subtract(1, 'days').startOf('day').format('YYYY-MM-DD 00:00:00'), endTime: moment().subtract(1, 'days').endOf('day').format('YYYY-MM-DD 23:59:59') },
    '3': { beginTime: moment().subtract(2, 'days').startOf('day').format('YYYY-MM-DD 00:00:00'), endTime: moment().subtract(2, 'days').endOf('day').format('YYYY-MM-DD 23:59:59') },
    '4': { beginTime: moment().subtract(7, 'days').startOf('day').format('YYYY-MM-DD 00:00:00'), endTime: moment().format('YYYY-MM-DD 23:59:59') },
  }






  useEffect(() => {
    initData()
  }, []);
  const pollutantType = pollType[props.type]
  const initData = () => {
    getOperationRegionPlanTaskRate(1) //计划完成率
  }

  useEffect(() => {
    if (TaskPlanType) {
      if (TaskPlanType == 1) {
        props.GetOperationTaskList({ //运维工单统计
          pollutantType: pollutantType,
          beginTime: moment(moment().add(-30, 'day')).format('YYYY-MM-DD 00:00:00'),
          endTime: moment(moment()).format('YYYY-MM-DD 23:59:59')
        })
        props.GetOperationPlanTaskRate({ //计划运维情况
          pollutantType: pollutantType,
          ...latelyDays30
        })

      } else {
        GetOperationTaskStatisticsInfoByDayRequest(workOrderExecuTimeVal) //工单执行情况 固定到天
        props.GetPlanOperationTaskCompleteRateByDay({ //近30日运维情况 固定到天
          pollutantType: pollutantType,
          ...latelyDays30
        })
      }
      props.GetOperatePointList({ //运维监测点信息
        pollutantType: pollutantType,
        isBW: TaskPlanType == 2
      })
    }

  }, [TaskPlanType]);
  const [workOrderExecuData, setWorkOrderExecuData] = useState({})

  const GetOperationTaskStatisticsInfoByDayRequest = (val) => {
    props.GetOperationTaskStatisticsInfoByDay({
      pollutantType: pollutantType,
      ...workOrderExecuTimeObj[val]
    }, (res) => {
      setWorkOrderExecuData(res)
    })
  }
  const getOperationRegionPlanTaskRate = (taskType) => {
    props.GetOperationRegionPlanTaskRate({ //计划完成率
      pollutantType: pollutantType,
      taskType: taskType,
      ...latelyDays30
    })
  }

  const [planBtnCheck, setPlanBtnCheck] = useState(1)
  const btnClick = (key, datatype) => { //计划完成率  切换
    setPlanBtnCheck(key)
    getOperationRegionPlanTaskRate(key)
  }
  const operationColumns = [
    {
      title: '统计类别',
      dataIndex: 'type',
      key: 'type',
      align: 'center',
      width: 61,
    },
    {
      title: '运维企业',
      dataIndex: 'entCount',
      key: 'entCount',
      align: 'center',
      width: 61,
      render: (text, record) => {
        return <span style={{ cursor: 'pointer' }} onClick={() => { operatingInfo('ent', record) }}>{text}</span>
      }
    },
    {
      title: '排放口',
      dataIndex: 'disPointCount',
      key: 'disPointCount',
      align: 'center',
      width: 61,
      render: (text, record) => {
        return <span style={{ cursor: 'pointer' }} onClick={() => { operatingInfo('point', record, 0) }}>{text}</span>
      }
    },
    {
      title: '非排放口',
      dataIndex: 'unDisPointCount',
      key: 'unDisPointCount',
      align: 'center',
      width: 61,
      render: (text, record) => {
        return <span style={{ cursor: 'pointer' }} onClick={() => { operatingInfo('point', record, 1) }}>{text}</span>
      }
    },
  ]
  const changeBarData = (data) => {
    let max = 0, bgBarData = [];
    data.map(item => {
      if (max < Number(item)) max = item;
    })

    data.map(item => {
      bgBarData.push(max)
    })
    return bgBarData;
  }
  const bagBarData = changeBarData(operaOrderData);

  const operaOrderOption = {  //运维工单图表
    tooltip: { show: false },
    grid: { top: 0, left: fontSizeFn(80), right: fontSizeFn(65), bottom: 0, },
    xAxis: { show: false, type: 'value' },
    yAxis: {
      type: 'category',
      // data: [ '配合比对', '配合检查','参数核对','校验测试','维护','维修','校准','巡检', ],
      // data: ['配合比对', '配合检查', '校验测试', '异常处理', '维护', '维修', '校准', '巡检',],
      data: ['配合检查', '异常处理', '维护', '维修', '校准', '巡检',],
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        margin: fontSizeFn(80), textStyle: { color: '#fff', fontSize: subjectFontSize, align: 'left' },
      },
      textStyle: {
        fontSize: fontSizeFn(14)
      }
    },
    series: [
      {
        type: 'bar', //显示背景图 
        data: bagBarData,
        label: {
          normal: {
            show: true,
            position: "right",
            //通过formatter函数来返回想要的数据
            formatter: function (params) {
              for (let i = 0; i < operaOrderData.length; i++) {
                if (params.dataIndex == i) {
                  return `${operaOrderData[i]}次`;
                }
              }
            },
            fontSize: subjectFontSize,
            color: '#4BF3F9',
            padding: [0, 0, 0, 5],
          },
        },
        itemStyle: { normal: { color: '#2f3648', barBorderRadius: [15, 15, 15, 15] }, },
        barWidth: '50%',  // 柱形的宽度
        barGap: '-100%', // Make series be ove
        silent: true, //图形是否不响应和触发鼠标事件，默认为 false，即响应和触发鼠标事件。  为了防止鼠标悬浮让此柱状图显示在真正的柱状图上面 
        barMinHeight: 215,
      },
      {
        type: 'bar',
        data: operaOrderData,
        label: { normal: { show: false, } },
        itemStyle: {
          normal: {
            color: {
              type: 'linear', // 线性渐变
              x: 0, y: 0, x2: 1, y2: 0,
              colorStops: [{
                offset: 0,
                color: '#298CFB' // 0%处的颜色为红色
              }, {
                offset: 1,
                color: '#29D6FB' // 100%处的颜色为蓝
              }],
            },
            barBorderRadius: [15, 15, 15, 15]
          },
        },
        barWidth: '50%',   // 柱形的宽度
      },


    ]
  };

  let operaTypeData = [
    { name: '巡检', key: 'inspectionCount', value: workOrderExecuData.inspectionCount, taskType: workOrderExecuData.inspectionTaskType, color1: '#0487ED', color2: '#0FD5F9' },
    { name: '校准', key: 'calibrationCount', value: workOrderExecuData.calibrationCount, taskType: workOrderExecuData.calibrationTaskType, color1: '#0666E8', color2: '#0487ED' },
    { name: '维修', key: 'repairCount', value: workOrderExecuData.repairCount, taskType: workOrderExecuData.repairTaskType, color1: '#3EB076', color2: '#A2FFD0' },
    { name: '维护', key: 'maintainReportCount', value: workOrderExecuData.maintainReportCount, taskType: workOrderExecuData.maintainReportTaskType, color1: '#C1C049', color2: '#FFFE95' },
    { name: '异常处理', key: 'dealExceptionCount', value: workOrderExecuData.dealExceptionCount, taskType: workOrderExecuData.dealExceptionTaskType, color1: '#FFCD5E', color2: '#FF9000' },
    { name: '校验测试', key: 'calibrationTestCount', value: workOrderExecuData.calibrationTestCount, taskType: workOrderExecuData.calibrationTestTaskType, color1: '#56E5EB', color2: '#56E5EB' },
    { name: '配合检查', key: 'cooperationInspectionCount', value: workOrderExecuData.cooperationInspectionCount, taskType: workOrderExecuData.cooperationInspectionTaskType, color1: '#FF87A7', color2: '#FF87A7' },
    { name: '配合比对', key: 'coordinationComparisonCount', value: workOrderExecuData.coordinationComparisonCount, taskType: workOrderExecuData.coordinationComparisonTaskType, color1: '#2043B9', color2: '#2043B9' },
    { name: '参数核对', key: 'matchingComparisonCount', value: workOrderExecuData.matchingComparisonCount, taskType: workOrderExecuData.matchingComparisonTaskType, color1: '#C8C8C8', color2: '#C8C8C8' },
    { name: '备品备件更换', key: 'sparesCount', value: workOrderExecuData.sparesCount, taskType: workOrderExecuData.sparesTaskType, color1: '#f759ab', color2: '#f759ab' },
    { name: '易耗品更换', key: 'consumablesCount', value: workOrderExecuData.consumablesCount, taskType: workOrderExecuData.consumablesTaskType, color1: '#b37feb', color2: '#b37feb' },
    { name: '标准物质更换', key: 'standCount', value: workOrderExecuData.standCount, taskType: workOrderExecuData.standTaskType, color1: '#5cdbd3', color2: '#5cdbd3' },
    { name: '试剂更换', key: 'reagentCount', value: workOrderExecuData.reagentCount, taskType: workOrderExecuData.reagentTaskType, color1: '#ff85c0', color2: '#ff85c0' },
  ]
  const operaOrderOptionDay = () => {
    operaTypeData = operaTypeData.filter(item => item.value != 0)
    const list = operaTypeData?.map(item => {
      return {
        value: item.value, name: item.name, itemStyle: {
          color: {
            x: 0, y: 1, x2: 1, y2: 0,
            colorStops: [{
              offset: 0,
              color: item.color1
            }, {
              offset: 1,
              color: item.color2
            }],
          }
        }
      }
    })
    return {
      title: {
        text: "完成工单",
        left: "center",
        top: "center",
        textStyle: {
          color: "#fff",
          fontSize: 14,
          align: "center",
          fontWeight: 400
        }
      },
      tooltip: {
        show: false,
      },
      toolbox: {
        show: false,
      },
      series: [
        {
          type: 'pie',
          radius: ['30%', '68%'],
          avoidLabeloverlap: false,
          roseType: 'area',
          emphasis: {
            label: {
              show: true, //高亮是标签的样式
            }
          },

          label: {
            normal: {
              // alignTo: "labelLine",
              formatter: [
                '{a|{b}:{c} }',
                '{b|}'
              ].join('\n'),
              rich: {
                a: {
                  fontSize: 13,
                  padding: [-2, -66, 0, -44],
                },
                b: {
                  height: 0,
                  width: 0,
                  padding: [3, -3],
                  borderRadius: 3,
                  backgroundColor: 'auto', // 圆点颜色和饼图块状颜色一致
                }
              },
              textStyle: {
                color: "#fff",
                padding: [0, 0, 11, 0],
              }
            },
          },
          labelLine: {
            normal: {
              length: 10,
              length2: 68,
            },
          },
          emptyCircleStyle: {
            // 将样式改为空心圆
            color: '#343a72',
            borderWidth: 1
          },
          data: list
        },
      ]
    }
  };

  const planOperaText = (type) => {
    switch (type) {
      case 1:
        if (planOperaList.inspectionRate == "-") {
          return '-'
        } else {
          return `${planOperaList.inspectionRate}%`
        }
        break;
      case 2:
        if (planOperaList.calibrationRate == "-") {
          return '-'
        } else {
          return `${planOperaList.calibrationRate}%`
        }
        break;

    }
  }
  const { planOperaList } = props;

  const planOperaOption = (type) => {  //计划运维图表
    let color1 = ["#3DBDFF", "#323A70"], color2 = ["#FFDD54", '#323A70'], color3 = ['#F66080', '#323A70']
    let option = {
      tooltip: {
        show: false,
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      color: type == 1 ? color1 : type == 2 ? color2 : color3,
      title: {
        text: planOperaText(type),
        left: "center",
        top: "48%",
        textStyle: {
          color: type == 1 ? color1[0] : type == 2 ? color2[0] : color3[0],
          fontSize: fontSizeFn(16),
          align: "center",
          fontWeight: 'bold',
        },
      },
      graphic: {
        type: "text",
        left: "center",
        top: "38%",
        style: {
          text: type == 1 ? '巡检完成率' : '校准完成率',
          textAlign: "center",
          fill: "#fff",
          fontSize: fontSizeFn(12),
        }
      },
      series: [
        {
          // name: type == 1 ? '计划巡检完成率' : type == 2 ? '计划校准完成率' : '实际校准完成率',
          name: type == 1 ? '计划巡检完成率' : '计划校准完成率',
          type: 'pie',
          radius: TaskPlanType == 2 ?  ['80%', '90%'] : ['70%', '80%'] ,
          avoidLabelOverlap: false,
          label: { normal: { show: false, position: 'center' }, },
          // data: [
          //   { value: type == 1 ? `${planOperaList.inspectionRate}`: type == 2 ? planOperaList.calibrationRate : planOperaList.actualCalibrationRate, name: '已完成' },
          //   { value: type == 1 ? (100 - `${planOperaList.inspectionRate=='-'? 100 : planOperaList.inspectionRate  }`) : type == 2 ? (100  - `${planOperaList.calibrationRate=='-'? 100 : planOperaList.calibrationRate  }`) : (100 - `${planOperaList.actualCalibrationRate=='-'? 100 : planOperaList.actualCalibrationRate  }`), name: '未完成' },
          // ],
          data: [
            { value: type == 1 ? `${planOperaList.inspectionRate}` : planOperaList.calibrationRate, name: '已完成' },
            { value: type == 1 ? (100 - `${planOperaList.inspectionRate == '-' ? 100 : planOperaList.inspectionRate}`) : (100 - `${planOperaList.calibrationRate == '-' ? 100 : planOperaList.calibrationRate}`), name: '未完成' },
          ],
          startAngle: 330, //起始角度
        }
      ]
    };
    return option;
  }


  const planCalibration = () => {  //计划校准弹框

    setPlanCalibrationVisible(true)
  }

  const planInspection = () => { //计划巡检弹框
    setPlanInspectionVisible(true)
  }

  const actualCalibration = () => {  //实际校准弹框

    setActualInspectionVisible(true)
  }

  const moreBtnClick = (type) => { //近30日运维工单
    switch (type) {
      case "operaOrder":
        setOrderModalVisible(true)
        break;
      // case "planComplete" : //计划完成率
      // setTVisible(true)
      // break;
    }
  }

  const [taskRecordVisible, setTaskRecordVisible] = useState(false)
  const [taskStatus, setTaskStatus] = useState()
  const [operaStatus, setOperaStatus] = useState()
  const [completeTime, setCompleteTime] = useState()


  const operaOrderOptionDayClick = (type) => {  //工单执行情况 固定到天 详情 
    setTaskRecordVisible(true)
    setTaskStatus(workOrderExecuTimeVal == 1 && (type == '未完成' || type == '超时未完成') ? ['1', '2', '11'] : ['3'])
    setOperaStatus((workOrderExecuTimeVal == 1 && (type == '完成' || type == '未完成')) || type == '完成' ? undefined : '3')
    if (type == '完成' || type == '超时完成') {
      setCompleteTime(workOrderExecuTimeObj[workOrderExecuTimeVal] && [moment(workOrderExecuTimeObj[workOrderExecuTimeVal].beginTime), moment(workOrderExecuTimeObj[workOrderExecuTimeVal].endTime)])
    } else {
      setCompleteTime()
    }
  }
  const [operaTaskType, setOperaTaskType] = useState()
  const operaOrderOptionDayEchartsClick = (params) => { //工单执行情况 图表各项点击事件
    if (params.componentType === 'series' && params.seriesType === 'pie') {
      setTaskRecordVisible(true)
      setCompleteTime(workOrderExecuTimeObj[workOrderExecuTimeVal] && [moment(workOrderExecuTimeObj[workOrderExecuTimeVal].beginTime), moment(workOrderExecuTimeObj[workOrderExecuTimeVal].endTime)])
      setTaskStatus(['3'])
      const taskType = operaTypeData.filter(item => item.name == params.name)?.[0]?.taskType;
      setOperaTaskType(taskType)

    }
  }

  useEffect(() => {
    if (!taskRecordVisible) {
      setTaskStatus()
      setOperaStatus()
      setCompleteTime()
      setOperaTaskType()
    }
  }, [taskRecordVisible])
  const [operatingInfoType, setOperatingInfoType] = useState()
  const [operatingStatus, setOperatingStatus] = useState(1)
  const [outputType, setOutputType] = useState(undefined)

  const operatingInfo = (type, record, outputType) => {
    setOperatingInfoVisible(true)
    setOperatingInfoType(type)
    setOutputType(outputType) //排口类型
    record.type === '运维中' ? setOperatingStatus(1) : record.type === '运维暂停' ? setOperatingStatus(2) : setOperatingStatus(undefined);
  }

  const [planOperationVisible, setPlanOperationVisible] = useState(false)
  const [planOperationTitle, setPlanOperationTitle] = useState(false)

  const planOperation = (title) => { //近30日计划运维情况 固定到天
    setPlanOperationVisible(true)
    setPlanOperationTitle(title)
  }

  const planOperaEcharts = useMemo(() => { //监听变量，第一个参数是函数，第二个参数是依赖，只有依赖变化时才会重新计算函数
    return <div style={{ height: '100%', padding: '.3125rem 0 .625rem 1.3125rem' }}> {/**当图表有点击事件时 更新更新页面时  图表抖动 */}
      <Row type='flex' align='middle'>
        <ReactEcharts
          option={planOperaOption(1)}
          style={{ width: '6.5625rem', height: '6.5625rem' }}
          onEvents={{ click: TaskPlanType == 2 ?  () => planOperation('巡检') : planInspection  }}
        />
        <img style={{ padding: '0 1.5rem' }} src='./homePlanSplitLine.png' />
        <div className={styles.planOperaText} >
          {TaskPlanType == 2 ?
            <>
              <div>计划内应完成次数：<span style={{ color: '#3DBDFF' }}>{planOperaList.inspectionCount}</span></div>
              <div>计划内完成次数：<span style={{ color: '#3DBDFF' }}>{planOperaList.inspectionCompleteCount}</span></div>
              <div>超时完成次数：<span style={{ color: '#3DBDFF' }}>{planOperaList.inspectionOverCompleteCount}</span></div>
              <div>超时未完成次数：<span style={{ color: '#3DBDFF' }}>{planOperaList.inspectionOverIncompleteCount}</span></div>
              <div style={{ color: '#4BF3F9' }}>今日待完成次数：<span style={{ color: '#4BF3F9' }}>{planOperaList.inspectionTodayInCompleteCount}</span> </div>
            </>
            :
            <>
              <div>计划内结束次数：<span style={{ color: '#3DBDFF' }}>{planOperaList.inspectionCloseCount}</span></div>
              <div>计划内完成次数：<span style={{ color: '#3DBDFF' }}>{planOperaList.inspectionCompleteCount}</span></div>
              <div style={{ color: '#4BF3F9' }}>计划内待完成次数：<span style={{ color: '#4BF3F9' }}>{planOperaList.inspectionIncompleteCount}</span> </div>
            </>
          }
        </div>
      </Row>
      <div style={{ width: '100%', height: 1, marginLeft: '-1.3125rem', background: "rgba(65, 66, 69, 0.5)", margin: TaskPlanType == 2 ? '.25rem 0' :  0 }}></div>
      <Row type='flex' align='middle'>
        <ReactEcharts
          option={planOperaOption(2)}
          style={{ width: '6.5625rem', height: '6.5625rem' }}
          onEvents={{ click: TaskPlanType == 2 ?  () => planOperation('校准') : planCalibration }}
        />
        <img style={{ padding: '0 1.5rem' }} src='./homePlanSplitLine.png' />
        <div className={styles.planOperaText} >
          {TaskPlanType == 2 ?
            <>
              <div>计划内应完成次数：<span style={{ color: '#3DBDFF' }}>{planOperaList.calibrationCount}</span></div>
              <div>计划内完成次数：<span style={{ color: '#3DBDFF' }}>{planOperaList.calibrationCompleteCount}</span></div>
              <div>超时完成次数：<span style={{ color: '#3DBDFF' }}>{planOperaList.calibrationOverCompleteCount}</span></div>
              <div>超时未完成次数：<span style={{ color: '#3DBDFF' }}>{planOperaList.calibrationOverIncompleteCount}</span></div>
              <div style={{ color: '#4BF3F9' }}>今日待完成次数：<span style={{ color: '#4BF3F9' }}>{planOperaList.calibrationTodayInCompleteCount}</span> </div>
            </>
            :
            <>
              <div>计划内结束次数：<span style={{ color: '#FFDD54' }}>{planOperaList.calibrationCloseCount}</span></div>
              <div>计划内完成次数：<span style={{ color: '#FFDD54' }}>{planOperaList.calibrationCompleteCount}</span></div>
              <div style={{ color: '#4BF3F9' }}>计划内待完成次数：<span style={{ color: '#4BF3F9' }}>{planOperaList.calibrationIncompleteCount}</span> </div>
            </>
          }
        </div>
      </Row>
      {/* <Col span={8} align='middle'>
       <ReactEcharts
         option={planOperaOption(3)}
         style={{ width: '100%', height: 120 }}
         onEvents={{click: actualCalibration }}
       />
      <div className={styles.planOperaText}> <div  style={{fontWeight:'bold'}}>实际校准完成率</div><div>计划内结束次数： {planOperaList.autoCalibrationAllCount}</div> <div>完成次数： {planOperaList.actualCalibrationCount}</div></div>
   </Col> */}
    </div>
  }, [planOperaList])
  const operaOrderOptionDayEcharts = useMemo(() => {
    return <ReactEcharts
      option={operaOrderOptionDay()}
      onEvents={{ click: operaOrderOptionDayEchartsClick }}
      style={{ height: 'calc(100% - 3.625rem )', width: '100%' }}
    />

  }, [workOrderExecuData])
  const cancel = () => {
    props.entWorkOrderStatistics({
      payload: {
        initialForm: {
          Time: [moment().subtract(30, "days").startOf("day"), moment().endOf("day")],
          RegionCode: undefined,
          AttentionCode: undefined,
          PollutantTypeCode: '1',
        },
      },
    });

  }

  pollutantType == 1 && operationColumns.splice(2, 2, {
    title: '监测点',
    dataIndex: 'allPointCount',
    key: 'allPointCount',
    align: 'center',
    width: 61,
    render: (text, record) => {
      return <span style={{ cursor: 'pointer' }} onClick={() => { operatingInfo('point', record) }}>{text}</span>
    }
  })
  const { operationLoading, operationDataSource } = props; {/**运维信息总览 */ }
  const { operationTaskLoading } = props; {/**近30日运维工单 */ }
  const { operationPlanTaskLoading, operationTaskCompleteRateByDayLoading } = props; {/**近30日运维情况 */ }
  const { planCompleteList, planCompleteListLoading } = props; {/**计划完成率 */ }
  const [planCalibrationVisible, setPlanCalibrationVisible] = useState(false)
  const [planInspectionVisible, setPlanInspectionVisible] = useState(false)
  const [actualInspectionVisible, setActualInspectionVisible] = useState(false)
  const [orderModalVisible, setOrderModalVisible] = useState(false)
  const [operatingInfoVisible, setOperatingInfoVisible] = useState(false)



  const workOrderExecuDotSty = {
    display: 'inline-block', width: 8, height: 8, marginRight: 6, backgroundColor: '#1BDEEA', borderRadius: '50%'
  }
  const workOrderExecuNumSty = {
    fontFamily: 'YouSheBiaoTiHei',
    fontWeight: 400,
    fontSize: '1.125rem',
    color: '#1BDEEA',
    paddingRight: '.5rem',
  }


  return (
    <div>
      <Spin spinning={operationLoading}>
        <div className={styles.pointSty}>
          <CardHeader title='运维信息总览' />
          <Table style={{ padding: '1rem .9375rem 0 0' }} columns={operationColumns} dataSource={operationDataSource} pagination={false} />
        </div>
      </Spin>

      {TaskPlanType == 1 ? <Spin spinning={operationTaskLoading}>
        <div className={styles.operaOrder}>
          <CardHeader title='近30日运维工单' />
          <div style={{ height: '100%', padding: '1.25rem .625rem 0 0' }}>
            <ReactEcharts
              option={operaOrderOption}
              style={{ height: 'calc(100% - 2.75rem )', width: '100%' }}
            />
            <MoreBtn style={{ padding: '.5rem .625rem 0' }} type='operaOrder' moreBtnClick={moreBtnClick} />
          </div>
        </div>
      </Spin> :
        <Spin spinning={operationTaskStatisticsInfoByDayLoading}> {/*固定到天 */}
          <div className={styles.operaOrder}>
            <CardHeader title='工单执行情况' />
            <Select placeholder="请选择" value={workOrderExecuTimeVal} size='small' getPopupContainer={trigger => trigger.parentNode}
              className={'operationTaskSelectSty'} options={workOrderExecuTimeOptions}
              onChange={(value) => {
                setWorkOrderExecuTimeVal(value)
                GetOperationTaskStatisticsInfoByDayRequest(value)
              }}
            />
            <div style={{ height: '100%', padding: '1.125rem .625rem 0 0' }}>
              <Row gutter={workOrderExecuTimeVal == 1 ? 0 : 16} style={{ justifyContent: workOrderExecuTimeVal == 1 ? 'space-between' : 'center', paddingRight: '.5rem' }}>
                <Col style={{ cursor: 'pointer' }} onClick={() => operaOrderOptionDayClick('完成')}><div><span style={workOrderExecuDotSty}></span>完成</div> <div><span style={workOrderExecuNumSty}>{workOrderExecuData.completeCount}</span>个</div></Col>
                <Col style={{ cursor: 'pointer' }} onClick={() => operaOrderOptionDayClick('超时完成')}><div><span style={workOrderExecuDotSty}></span>超时完成</div> <div><span style={workOrderExecuNumSty}>{workOrderExecuData.overTimeCompleteCount}</span>个</div></Col>
                {workOrderExecuTimeVal == 1 ? <>
                  <Col style={{ cursor: 'pointer' }} onClick={() => operaOrderOptionDayClick('未完成')}><div><span style={workOrderExecuDotSty}></span>未完成</div> <div><span style={workOrderExecuNumSty}>{workOrderExecuData.notCompleteCount}</span>个</div></Col>
                  <Col style={{ cursor: 'pointer' }} onClick={() => operaOrderOptionDayClick('超时未完成')}><div><span style={workOrderExecuDotSty}></span>超时未完成</div> <div><span style={workOrderExecuNumSty}>{workOrderExecuData.overTimeNotCompleteCount}</span>个</div></Col>
                </> : <></>}
              </Row>
              {/* <ReactEcharts
                  option={operaOrderOptionDay()}
                  onEvents={{ click: operaOrderOptionDayEchartsClick }}
                  style={{ height: 'calc(100% - 58px )', width: '100%' }}
                /> */}
              {operaOrderOptionDayEcharts}
            </div>
          </div>
        </Spin>
      }
      <Spin spinning={TaskPlanType == 1 ? operationPlanTaskLoading : operationTaskCompleteRateByDayLoading}> {/**近30日运维情况 */}
        <div className={styles.planOpera} style={{ height: TaskPlanType == 1 ? '16.8125rem' : '18.25rem' }}>
          <CardHeader title='近30日运维情况' isPopover />
          {planOperaEcharts}
        </div>
      </Spin>

      <Spin spinning={planCompleteListLoading}>
        <div className={styles.planComplete}>
          <CardHeader btnClick={btnClick} datatype='planComplete' showBtn type='plan' btnCheck={planBtnCheck} title='近30日运维排名' />
          <div style={{ height: '100%', padding: '1.3125rem 1.125rem 0 0' }}>
            {!planCompleteListLoading && <ScrollTable data={[...planCompleteList]} column={[]} />}
            {/* <MoreBtn style={{paddingTop:10}} type='planComplete' moreBtnClick={moreBtnClick}/> */}
          </div>
        </div>
      </Spin>

      <PlanWorkOrderStatistics  //计划校准完成率弹框
        modalType="planCalibration"
        visible={planCalibrationVisible}
        type={pollutantType}
        onCancel={() => { setPlanCalibrationVisible(false) }}
        time={[moment(latelyDays30.beginTime), moment(latelyDays30.endTime)]}
      />
      <PlanWorkOrderStatistics  //计划巡检完成率弹框
        modalType="planInspection"
        visible={planInspectionVisible}
        type={pollutantType}
        onCancel={() => { setPlanInspectionVisible(false) }}
        time={[moment(latelyDays30.beginTime), moment(latelyDays30.endTime)]}
      />
      <PlanWorkOrderStatistics  //实际校准完成率弹框
        modalType="actualCalibration"
        visible={actualInspectionVisible}
        type={pollutantType}
        onCancel={() => { setActualInspectionVisible(false) }}
        time={[moment(latelyDays30.beginTime), moment(latelyDays30.endTime)]}
      />
      <PlanWorkOrderStatistics  //计划巡检完成率、计划校准完成率 固定到天
        isDay
        visible={actualInspectionVisible}
        type={pollutantType}
        onCancel={() => { setActualInspectionVisible(false) }}
        time={[moment(latelyDays30.beginTime), moment(latelyDays30.endTime)]}
      />

      <EntWorkOrderModal  //近30日运维工单
        showModal={orderModalVisible}
        onCloseListener={() => {
          setOrderModalVisible(false)
          cancel();
        }}
        pollutantTypeCode={pollutantType}
      />
      <Modal
        title={`工单执行情况 - ${pollutantType == 2 ? '废气' : '废水'}`}
        destroyOnClose
        wrapClassName='spreadOverModal'
        visible={taskRecordVisible}
        onCancel={() => { setTaskRecordVisible(false) }}
        footer={null}
        mask={false}
        bodyStyle={{ padding: 0 }}
      >
        <TaskRecord
          hideBreadcrumb
          isWorkExecue
          taskStatus={taskStatus}
          operaStatus={operaStatus}
          completeTime={completeTime}
          operaTaskType={operaTaskType}
          pollutantType={pollutantType}
        />
      </Modal>
      <Modal
        title={`运维情况`}
        destroyOnClose
        wrapClassName='spreadOverModal'
        visible={planOperationVisible}
        onCancel={() => { setPlanOperationVisible(false) }}
        footer={null}
        bodyStyle={{ padding: 0 }}
      >
        <PlanWorkOrderStatisticsDay
          hideBreadcrumb
          planType={planOperationTitle == '巡检' ? '1' : '2'}
          time={[moment(latelyDays30.beginTime), moment(latelyDays30.endTime)]}
          pollutantTypes={Number(pollutantType)}
        />
      </Modal>
      <OperatingInfo  //运维信息总览
        visible={operatingInfoVisible}
        type={pollutantType}
        onCancel={() => { setOperatingInfoVisible(false) }}
        type={operatingInfoType}
        pollutantType={pollutantType}
        operatingStatus={operatingStatus}
        outputType={outputType}
      />
    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);