/**
 * 功  能：计划工单统计 固定到天
 * 创建人：jab
 * 创建时间：2024.05.20
 */
import React, { useState, useEffect, Fragment, useRef, useImperativeHandle, forwardRef } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Card, Popover, Button, Select, Progress, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Tabs } from 'antd';
import SdlTable from '@/components/SdlTable';
import MultipleHeadResizeTable from '@/components/MultipleHeadResizeTable';
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon, PointIcon, Left } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import styles from "../style.less"
import Cookie from 'js-cookie';
import TaskRecordDetails from '@/pages/EmergencyTodoList/EmergencyDetailInfoLayout'

const { TextArea } = Input;
const { Option } = Select;
const namespace = 'planWorkOrderStatisticsDay'




const dvaPropsData = ({ loading, planWorkOrderStatisticsDay, global }) => ({
  tableDatas: planWorkOrderStatisticsDay.tableDatas,
  pointDatas: planWorkOrderStatisticsDay.pointDatas,
  tableLoading: planWorkOrderStatisticsDay.tableLoading,
  tableTotal: planWorkOrderStatisticsDay.tableTotal,
  abnormalTypes: planWorkOrderStatisticsDay.abnormalTypes,
  abnormalLoading: loading.effects[`${namespace}/abnormalExceptionTaskList`],
  abnormalList: planWorkOrderStatisticsDay.abnormalList,
  queryPar: planWorkOrderStatisticsDay.queryPar,
  cityTableDatas: planWorkOrderStatisticsDay.cityTableDatas,
  cityTableLoading: loading.effects[`${namespace}/cityGetTaskWorkOrderList`],
  cityTableTotal: planWorkOrderStatisticsDay.cityTableTotal,
  regPointTableDatas: planWorkOrderStatisticsDay.regPointTableDatas,
  regPointTableLoading: loading.effects[`${namespace}/regPointGetTaskWorkOrderList`],
  insideOrOutsideWorkLoading: loading.effects[`${namespace}/insideOrOutsideWorkGetTaskWorkOrderList`],
  insideOrOutsideWorkActualLoading: loading.effects[`${namespace}/insideOrOutsideWorkActualGetTaskWorkOrderList`],
  insideOrOutsiderWorkTableDatas: planWorkOrderStatisticsDay.insideOrOutsiderWorkTableDatas,
  insideOrOutsiderWorkTableTotal: planWorkOrderStatisticsDay.insideOrOutsiderWorkTableTotal,
  clientHeight: global.clientHeight,
  dateCol: planWorkOrderStatisticsDay.dateCol,
  workRegExportLoading: loading.effects[`${namespace}/workRegExportTaskWorkList`],
  cityRegExportLoading: loading.effects[`${namespace}/cityRegExportTaskWorkList`],
})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
    regEntGetTaskWorkOrderList: (payload) => { // 计划工单统计
      dispatch({
        type: `${namespace}/regEntGetTaskWorkOrderList`,
        payload: payload,
      })
    },
    cityGetTaskWorkOrderList: (payload) => { // 计划工单统计 市级别
      dispatch({
        type: `${namespace}/cityGetTaskWorkOrderList`,
        payload: payload,
      })
    },
    regPointGetTaskWorkOrderList: (payload) => { // 计划工单统计 运维监测点
      dispatch({
        type: `${namespace}/regPointGetTaskWorkOrderList`,
        payload: payload,
      })
    },
    insideOrOutsideWorkGetTaskWorkOrderList: (payload) => { // 计划内or计划外 工单数 弹框
      dispatch({
        type: `${namespace}/insideOrOutsideWorkGetTaskWorkOrderList`,
        payload: payload,
      })
    },
    workRegExportTaskWorkList: (payload) => { // 导出 计划内or计划外 工单数 弹框
      dispatch({
        type: `${namespace}/workRegExportTaskWorkList`,
        payload: payload,
      })
    },
    cityRegExportTaskWorkList: (payload) => { // 导出 市级别
      dispatch({
        type: `${namespace}/cityRegExportTaskWorkList`,
        payload: payload,
      })
    },
    operaPointExportTaskWorkList: (payload) => { // 导出 监测点
      dispatch({
        type: `${namespace}/operaPointExportTaskWorkList`,
        payload: payload,
      })
    },

  }
}
const Index = (props, ref) => {



  const [cityForm] = Form.useForm();




  const [cityVisible, setCityVisible] = useState(false)


  const [regionCode, setRegionCode] = useState();
  const [regName, setRegName] = useState()

  const [pageSize, setPageSize] = useState(20)
  const [pageIndex, setPageIndex] = useState(1)




  const { planType, clientHeight, tableDatas, tableLoading, pollutantType, refInstance, } = props;

  const { cityTableDatas, cityTableLoading, cityTableTotal, } = props; //市级别


  const { insideOrOutsiderWorkTableDatas, insideOrOutsideWorkLoading, insideOrOutsiderWorkTableTotal, } = props; //计划内or计划外工单数

  const { workRegExportLoading, cityRegExportLoading,  } = props; //导出
  useEffect(() => {


  }, []);



  const plannedInspectTip = () => {
    return <ol type='1' style={{ listStyleType: 'decimal' }}>
      <li>通过该页面可以查看监测点完成的计划工单情况。</li>
      <li>运维状态：运维暂停则系统停止派发自动工单。</li>
    </ol>
  }
  const workOrderTip = () => {
    return <ol type='1' style={{ listStyleType: 'decimal' }}>
      <li>完成工单：当日完成的工单。</li>
      <li>系统关闭工单：当日系统关闭的工单。</li>
      <li>同时存在关闭和完成的工单：当日存在系统关闭工单，也存在完成工单。</li>

    </ol>
  }
  const [popVisible, setPopVisible] = useState(false)
  const [showTaskID, setShowTaskID] = useState()
  const [showId, setShowId] = useState(-1)

  const popContent = (type, id, taskTypeName, data, taskWorkNum1, taskWorkNum2,taskWorkNums3 ) => {
    const oneNum = (record, taskNumData) => record && record[0] ? <div style={{ width: '100%', lineHeight: '44.5px', cursor: 'pointer', color: '#fff' }} onClick={() => { setShowId(-1); taskDetail(record && record[0]) }}>{taskNumData}</div> : <span style={{ color: '#fff' }}>{taskNumData}</span>
    const multipleNum = (dataSource, taskNumData, typeName) => dataSource && dataSource[0] ? <Popover
      zIndex={1000}
      placement="top"
      onVisibleChange={(newVisible) => { setPopVisible(newVisible) }}
      trigger="click"
      visible={showId == `${id}${typeName}` && popVisible}
      content={
        <Table
          bordered
          size='small'
          showHeader={false}
          columns={[
            {
              align: 'center',
              width: 180,
              dataIndex: 'TaskCode',
              key: 'TaskCode',
            },
            {
              align: 'center',
              width: 100,
              render: (text, record, index) => <a onClick={() => { taskDetail(record) }}>查看详情</a>
            }
          ]}
          dataSource={dataSource} pagination={false} />
      }>
      <div onClick={() => { setShowId(`${id}${typeName}`) }} style={{ width: '100%', lineHeight: '44.5px', cursor: 'pointer', color: '#fff' }}>{taskNumData}</div>
    </Popover> : <span style={{ color: '#fff' }}>{taskNumData}</span>
  

  const colorObj = {
    'taskCompleteCount': '#1890ff',
    'overCompleteList': '#faad14',
    'overIncompleteList': '#f5222d'
  }
  const popData = data.taskList

  if (type == 3) {//同时存在三种工单
      let taskWorkNums1, taskWorkNums2, taskWorkNums3;
      taskTypeName = taskTypeName.split(',')
      if (data[taskTypeName[0]] > 1) {
        taskWorkNums1 = multipleNum(popData, taskWorkNum1, taskTypeName[0])
      } else {
        taskWorkNums1 = oneNum(popData, taskWorkNum1)
      }
      if (data[taskTypeName[1]] > 1) {
        taskWorkNums2 = multipleNum(popData, taskWorkNum2, taskTypeName[1])
      } else {
        taskWorkNums2 = oneNum(popData, taskWorkNum2)
      }
      if (data[taskTypeName[2]] > 1) {
        taskWorkNums3 = multipleNum(popData, taskWorkNum2, taskTypeName[2])
      } else {
        taskWorkNums3 = oneNum(popData, taskWorkNum2)
      }
      return <Row align='middle' justify='center' style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
        <div style={{ width: '33.33%', height: '100%', display: 'flex', alignItems: 'center', background:  colorObj[taskTypeName[0]] }}> {taskWorkNums1} </div>
        <div style={{ width: '33.33%', height: '100%', display: 'flex', alignItems: 'center', background:  colorObj[taskTypeName[1]] }}> {taskWorkNums2} </div>
        <div style={{ width: '33.33%', height: '100%', display: 'flex', alignItems: 'center', background:  colorObj[taskTypeName[2]]}}> {taskWorkNums3} </div>
      </Row>;
    } else if(type == 2){ //同时存在两种工单
      let taskWorkNums1, taskWorkNums2;
      taskTypeName = taskTypeName.split(',')
      if (data[taskTypeName[0]] > 1) {
        taskWorkNums1 = multipleNum(popData, taskWorkNum1, taskTypeName[0])
      } else {
        taskWorkNums1 = oneNum(popData, taskWorkNum1)
      }
      if (data[taskTypeName[1]] > 1) {
        taskWorkNums2 = multipleNum(popData, taskWorkNum2, taskTypeName[1])
      } else {
        taskWorkNums2 = oneNum(popData, taskWorkNum2)
      }
      return <Row align='middle' justify='center' style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
        <div style={{ width: '50%', height: '100%', display: 'flex', alignItems: 'center', background:  colorObj[taskTypeName[0]]  }}> {taskWorkNums1} </div>
        <div style={{ width: '50%', height: '100%', display: 'flex', alignItems: 'center', background:  colorObj[taskTypeName[1]]  }}> {taskWorkNums2} </div>
      </Row>;
    }else{
      if (data.taskID && data.taskID.length > 1) {
        return multipleNum(data.taskList, taskWorkNum1, taskTypeName)
      } else {
        return oneNum(data.taskList, taskWorkNum1)
      }
    }

  }


  const [taskRecordDetailVisible, setTaskRecordDetailVisible] = useState(false)
  const [taskID, setTaskID] = useState()
  const [dgimn, setDgimn] = useState()

  const taskDetail = (record) => { //详情
    setTaskRecordDetailVisible(true)
    setTaskID(record.ID)
    setDgimn(record.DGIMN)
  }

  const commonCol = (type) => [
    {
      title:  `截止昨日（计划内${type == 1 ?'巡检': '校准'}）`,
      width: 255,
      children: [
        {
          title: '应完成次数',
          dataIndex: type == 1 ? 'inspectionCount' : 'calibrationCount',
          key: type == 1 ? 'inspectionCount' : 'calibrationCount',
          width: 100,
          align: 'center',
          sorter: (a, b) => props.sortRate(a, b,  type == 1? 'inspectionCount' : 'calibrationCount'),
          render: (text, record, index) => {
            return text != '-' && text != 0 ? <Button type="link" onClick={() => { workOrderNum(type, record, 'inspectionCount') }}>{text}</Button> : text
          }
        },
        {
          title: '完成次数',
          dataIndex: type == 1 ? 'inspectionCompleteCount' : 'calibrationCompleteCount',
          key: type == 1 ? 'inspectionCompleteCount' : 'calibrationCompleteCount',
          width: 100,
          align: 'center',
          sorter: (a, b) => props.sortRate(a, b,  type == 1? 'inspectionCompleteCount' : 'calibrationCompleteCount'),

        },
        {
          title: '超时完成次数',
          dataIndex: type == 1 ? 'inspectionOverCompleteCount' : 'calibrationOverCompleteCount',
          key: type == 1 ? 'inspectionOverCompleteCount' : 'calibrationOverCompleteCount',
          width: 100,
          align: 'center',
          sorter: (a, b) => props.sortRate(a, b,  type == 1? 'inspectionOverCompleteCount' : 'calibrationOverCompleteCount'),

        },
        {
          title: '超时未完成次数',
          dataIndex: type == 1 ? 'inspectionOverIncompleteCount' : 'calibrationOverIncompleteCount',
          key: type == 1 ? 'inspectionOverIncompleteCount' : 'calibrationOverIncompleteCount',
          width: 100,
          align: 'center',
          sorter: (a, b) => props.sortRate(a, b,  type == 1? 'inspectionOverIncompleteCount' : 'calibrationOverIncompleteCount'),

        },
        {
          title: type == 1 ? '巡检完成率' : '校准完成率',
          dataIndex: type == 1 ? 'inspectionRate' : 'calibrationRate',
          key: type == 1 ? 'inspectionRate' : 'calibrationRate',
          width: 105,
          align: 'center',
          sorter: (a, b) => props.sortRate(a, b,  type == 1? 'inspectionRate' : 'calibrationRate'),
          render: (text, record) => {
            return (
              <div>
                <Progress
                  percent={text == '-' ? 0 : text}
                  size="small"
                  style={{ width: '70%' }}
                  status='normal'
                  format={percent => <span style={{ color: 'rgba(0,0,0,.6)' }}>{text == '-' ? text : text + '%'}</span>}
                />
              </div>
            );
          }
        },
      ],
    },
    {
      title: '今日',
      width: 255,
      align: 'center',
      children: [
        {
          title: '待完成次数',
          dataIndex: type == 1 ? 'inspectionTodayIncompleteCount' : 'calibrationTodayIncompleteCount',
          key: type == 1 ? 'inspectionTodayIncompleteCount' : 'calibrationTodayIncompleteCount',
          width: 100,
          align: 'center',
          sorter: (a, b) => props.sortRate(a, b,  type == 1? 'inspectionTodayIncompleteCount' : 'calibrationTodayIncompleteCount'),
        },
      ],
    },
  ]



  const columns = (type) => [
    {
      title: '序号',
      align: 'center',
      render: (text, record, index) => {
        return index + 1;
      }
    },
    {
      title: '省',
      dataIndex: 'regionName',
      key: 'regionName',
      align: 'center',
      render: (text, record, index) => {
        return <Button type="link"
          onClick={() => {
            regionClick(record)
          }}
        >{text}</Button>
      }
    },
    {
      title: '运维企业数',
      dataIndex: 'entCount',
      key: 'entCount',
      align: 'center',
      width: 100,
    },
    {
      title: '运维监测点数',
      dataIndex: 'pointCount',
      key: 'pointCount',
      align: 'center',
      width: 100,
    },
    ...commonCol(type)

  ];

  const cityInsideRegColumns = [ //计划内  市级别 二级弹框
    {
      title: '序号',
      align: 'center',
      render: (text, record, index) => {
        return index + 1;
      }
    },
    {
      title: '省',
      dataIndex: 'province',
      key: 'province',
      align: 'center',
      width: 100,
      render: (text, record, index) => {
        if (text == '全部合计') {
          return { props: { colSpan: 0 }, };
        }
        return text;
      },
    },
    {
      title: '市',
      dataIndex: 'city',
      key: 'city',
      align: 'center',
      width: 100,
      render: (text, record, index) => {
        return { props: { colSpan: text == '全部合计' ? 2 : 1 }, children: text, };
      }
    },
    {
      title: '运维企业数',
      dataIndex: 'entCount',
      key: 'entCount',
      align: 'center',
      width: 100,
    },
    {
      title: '运维监测点数',
      dataIndex: 'pointCount',
      key: 'pointCount',
      align: 'center',
      width: 100,
    },
    ...commonCol(tabType)
  ]
  const insideWorkOrderColumns = [
    {
      title: '省',
      dataIndex: 'province',
      key: 'province',
      align: 'center',
      fixed: 'left',
      render: (text, record, index) => {
        if (text == '全部合计') {
          return { props: { colSpan: 0 }, };
        }
        return text;
      },
    },
    {
      title: '市',
      dataIndex: 'city',
      key: 'city',
      align: 'center',
      fixed: 'left',
      render: (text, record, index) => {
        return { props: { colSpan: text == '全部合计' ? 2 : 1 }, children: text, };
      }
    },
    {
      title: '企业名称',
      dataIndex: 'entName',
      key: 'entName',
      align: 'center',
      width: 150,
      fixed: 'left',
    },
    {
      title: '监测点名称',
      dataIndex: 'pointName',
      key: 'pointName',
      align: 'center',
      fixed: 'left',
    },
    {
      title:  `截止昨日（计划内${tabType == 1 ?'巡检': '校准'}）`,
      width: 255,
      children: [
        {
          title: '应完成次数',
          dataIndex: 'taskCount',
          key:  'taskCount',
          width: 100,
          align: 'center',
          sorter: (a, b) => props.sortRate(a, b, 'taskCount'),
        },
        {
          title: '完成次数',
          dataIndex:'taskCompleteCount',
          key:'taskCompleteCount',
          width: 100,
          align: 'center',
          sorter: (a, b) => props.sortRate(a, b, 'taskCompleteCount'),

        },
        {
          title: '超时完成次数',
          dataIndex: 'overCompleteLis',
          key:  'overCompleteLis',
          width: 100,
          align: 'center',
          sorter: (a, b) => props.sortRate(a, b,  'overCompleteLis'),

        },
        {
          title: '超时未完成次数',
          dataIndex:  'overIncompleteList',
          key:  'overIncompleteList',
          width: 100,
          align: 'center',
          sorter: (a, b) => props.sortRate(a, b, 'overIncompleteList'),

        },
        {
          title: tabType == 1 ? '巡检完成率' : '校准完成率',
          dataIndex: 'taskRate',
          key: 'taskRate',
          width: 105,
          align: 'center',
          sorter: (a, b) => props.sortRate(a, b, 'taskRate'),
          render: (text, record) => {
            return (
              <div>
                <Progress
                  percent={text == '-' ? 0 : text}
                  size="small"
                  style={{ width: '70%' }}
                  status='normal'
                  format={percent => <span style={{ color: 'rgba(0,0,0,.6)' }}>{text == '-' ? text : text + '%'}</span>}
                />
              </div>
            );
          }
        },
      ],
    },
    {
      title: '今日',
      width: 255,
      align: 'center',
      children: [
        {
          title: '待完成次数',
          dataIndex:  'todayIncompleteList',
          key:  'todayIncompleteList',
          width: 100,
          align: 'center',
          sorter: (a, b) => props.sortRate(a, b, 'todayIncompleteList'),
        },
      ],
    },
  

  ];

  const outTypeNames = {
    "inspectionCompleteCount": "巡检",
    "calibrationCompleteCount": '校准',
    "repairCompleteCount": '维修',
    "sparePartsCompleteCount": '备品备件更换',
    "consumablesCompleteCount": '易耗品更换',
    "reagentCompleteCount": '试剂更换',
    "referenceMaterialsCompleteCount": '标准物质更换',
    "maintainCompleteCount": '维护',
    "matchingComparisonCompleteCount": '参数核对',
    "cooperationInspectionCompleteCount": '配合检查',
    "calibrationTestCompleteCount": '校验测试工单',
    "coordinationComparisonCompleteCount": '配合比对',
    "dealExceptionCompleteCount": '异常处理',
  }

  const planOutRegCompleteCommonCol = ()=>{//计划外 行政区 市级别 完成工单数
    const col = [];
    for (let key in outTypeNames) {
      const item = outTypeNames[key]
      if(pollutantType == 1 && item !=='标准物质更换' || pollutantType == 2 && item !=='试剂更换' ){
      col.push({
        title: item,
        dataIndex: key,
        key: key,
        width: 120,
        align: 'center',
        sorter: (a, b) => a[key] - b[key],
        render: (text, record, index) => {
          return text == 0 || key=='allCompleteTaskCount'? text : <Button type="link" onClick={() => { workOrderNum(3, record, key) }}>{text}</Button>
        }
       });
     }
    }
    return col
  }
   
  const outsideColumns = [ //计划外 首页面
    {
      title: '序号',
      align: 'center',
      render: (text, record, index) => {
        return index + 1;
      }
    },
    {
      title: '省',
      dataIndex: 'regionName',
      key: 'regionName',
      align: 'center',
      render: (text, record, index) => {
        return <Button type="link"
          onClick={() => {
            regionClick(record)
          }}
        >{text}</Button>
      }
    },
    {
      title: '运维企业数',
      dataIndex: 'entCount',
      key: 'entCount',
      align: 'center',
      width: 100,
    },
    {
      title: '运维监测点数',
      dataIndex: 'pointCount',
      key: 'pointCount',
      align: 'center',
      width: 100,
    },
    ...planOutRegCompleteCommonCol(),

  ];
  const cityOutRegColumns = [ //计划外  市级别 二级弹框
    {
      title: '序号',
      align: 'center',
      render: (text, record, index) => {
        return index + 1;
      }
    },
    {
      title: '省',
      dataIndex: 'province',
      key: 'province',
      align: 'center',
      width: 100,
      render: (text, record, index) => {
        if (text == '全部合计') {
          return { props: { colSpan: 0 }, };
        }
        return text;
      },
    },
    {
      title: '市',
      dataIndex: 'city',
      key: 'city',
      align: 'center',
      width: 100,
      render: (text, record, index) => {
        return { props: { colSpan: text == '全部合计' ? 2 : 1 }, children: text, };
      }
    },
    {
      title: '运维企业数',
      dataIndex: 'entCount',
      key: 'entCount',
      align: 'center',
      width: 100,
    },
    {
      title: <span>运维监测点数</span>,
      dataIndex: 'pointCount',
      key: 'pointCount',
      align: 'center',
      width: 100,
    },
    ...planOutRegCompleteCommonCol(),

  ];

  const outWorkOrderColumn = [ //计划外 工单
    {
      title: '省',
      dataIndex: 'province',
      key: 'province',
      align: 'center',
      fixed: 'left',
      render: (text, record, index) => {
        if (text == '全部合计') {
          return { props: { colSpan: 0 }, };
        }
        return text;
      },
    },
    {
      title: '市',
      dataIndex: 'city',
      key: 'city',
      align: 'center',
      fixed: 'left',
      render: (text, record, index) => {
        return { props: { colSpan: text == '全部合计' ? 2 : 1 }, children: text, };
      }
    },
    {
      title: '企业名称',
      dataIndex: 'entName',
      key: 'entName',
      align: 'center',
      width: 150,
      fixed: 'left',
      // render:(text,record,index)=>{
      //  return  <div style={{textAlign:"left"}}>{text}</div>
      // }
    },
    {
      title: '监测点名称',
      dataIndex: 'pointName',
      key: 'pointName',
      align: 'center',
      fixed: 'left',
    },
    {
      title: '工单合计',
      dataIndex: 'taskCount',
      key: 'taskCount',
      align: 'center',
      fixed: 'left',
      sorter: (a, b) => a.taskCount - b.taskCount,
    },
  ]






  const [cityDetailRegionCode, setCityDetailRegionCode] = useState()
  const regionClick = (record) => {
    setCityVisible(true)
    setRegName(record.regionName)
    setRegionCode(record.regionCode)
    setCityDetailRegionCode(record.regionCode)//计划外 市级详情 全部合计Code
    cityForm.resetFields();
    cityForm.setFieldsValue({
      time: queryPar&&[moment(queryPar.beginTime), moment(queryPar.endTime)]
    })
    props.cityGetTaskWorkOrderList({
      ...queryPar,
      regionCode: record.regionCode,
      staticType: 1,
      regionLevel: 2,
    })

  }








  const [outWorkOrderVisible, setOutWorkOrderVisible] = useState(false)







  const outTypePar = {
    "inspectionCount": "1",
    "calibrationCount": '2',
    "sparePartsCount": '9', //后加
    "consumablesCount": '10',
    "reagentCount": '11',//废水 试剂更换
    "referenceMaterialsCount": '12',//废水 标准物质更换
    "repairCount": '3',
    "maintainCount": '4',
    "matchingComparisonCount": '5',
    "cooperationInspectionCount": '6',
    "calibrationTestCount": '7',
    "coordinationComparisonCount": '8',
    "dealExceptionCount": '13'
  }
  const insideOrOutsideWorkGetTaskWorkOrderList = (par) => { //计划内or计划外弹框
    const pars = {
      ...queryPar,
      taskType: outTypePar[outType],
      ...par,
      regionLevel: undefined,
      staticType: 3,
      pageIndex: undefined,
      pageSize: undefined,
    }
    props.insideOrOutsideWorkGetTaskWorkOrderList(pars)


  }
  const [insideWorkType, setInsideWorkType] = useState()
  const [insideWorkOrderVisible, setInsideWorkOrderVisible] = useState(false)

  const [outType, setOutType] = useState()
  const [outTypeName, setOutTypeName] = useState()



  const workOrderNum = (type, record, outType) => { //计划内  计划外  总数工单

    if (type == 1 || type == 2) {
      setInsideWorkType(type)
      setInsideWorkOrderVisible(true)
    }
    if (type == 3) {
      setOutWorkOrderVisible(true)
      setOutTypeName(outTypeNames[outType])
    }
    setOutType(outType)
    workRegForm.resetFields();
    workRegForm.setFieldsValue({
      time: queryPar&&[moment(queryPar.beginTime), moment(queryPar.endTime)]
    })
    setRegName(record.regionName)
    setRegionCode(record.regionCode ? record.regionCode : cityDetailRegionCode)

    setWorkPageIndex(1)
    setWorkPageSize(20)
    insideOrOutsideWorkGetTaskWorkOrderList({
      regionCode: record.regionCode,
      taskType: type == 1 || type == 2 ? type : outTypePar[outType]
    })


  }
  const onFinishWorkOrder =  () => {  //计划内 计划外 查询 工单

      const values =  workRegForm.getFieldsValue();
      setWorkPageIndex(1)
      insideOrOutsideWorkGetTaskWorkOrderList({
        ...values,
        time:undefined,
        regionCode: regionCode,
      })
    
  }


  const [workPageIndex, setWorkPageIndex] = useState(1)
  const [workPageSize, setWorkPageSize] = useState(20)

  const handleWorkTableChange = (PageIndex, PageSize) => { //计划内 计划外 工单 分页
    setWorkPageIndex(PageIndex)
    setWorkPageSize(PageSize)
  }
  const workRegExports = () => { //导出 工单
    const par = {
      ...queryPar,
      entName: workRegForm.getFieldValue('entName'),
      taskType: outTypePar[outType],
      staticType: 3,
      regionCode: regionCode,
      pageIndex: undefined,
      pageSize: undefined,
      regionLevel: cityVisible ? 2 : 1,
    }
    props.workRegExportTaskWorkList(par)
  }
  const workCommonForm = () => {
    return <>
          <Col span={8}>
      <Form.Item name='entName' label='行政区'  className='form_label_width_83'>
        <Input placeholder='搜索省、市关键字' allowClear />
      </Form.Item>
      </Col>
      <Col  span={8}>
      <Form.Item name='time' label='日期'>
          <RangePicker  style={{width:'100%'}} allowClear={false} showTime={false} />
     </Form.Item>
     </Col>
     <Col  span={8}>
      <Form.Item name='pointName'  label='企业名称'>
        <Input placeholder='请输入' allowClear />
      </Form.Item>
      </Col>
     <Col  span={8}>
      <Form.Item name='pointName'  label='监测点名称'>
        <Input placeholder='请输入' allowClear />
      </Form.Item>
      </Col>
    </>
  }
  const [workRegForm] = Form.useForm()
  const searchWorkComponents = () => { //计划内  查询 工单
    return <Form
      onFinish={onFinishWorkOrder}
      form={workRegForm}
    >
      <Row gutter={[16,0]}>
       {workCommonForm()}
        <Col span={8}>
            <Form.Item>
              <Button type="primary" htmlType='submit' loading={insideOrOutsideWorkLoading}>
                查询
              </Button>
              <Button style={{ margin: '0 8px' }} onClick={()=>{workRegForm.resetFields();onFinishWorkOrder();}}>
                重置
              </Button>
              <Button icon={<ExportOutlined />}  loading={workRegExportLoading} onClick={() => { workRegExports() }}>
                导出
              </Button>
            </Form.Item>
        </Col>
        </Row>


    </Form>
    
  }

  const searchOutWorkComponents = () => { //计划外 工单弹框
    return <Form
      onFinish={onFinishWorkOrder}
      form={workRegForm}
      layout={'inline'}
    >
     <Row gutter={[16,0]}>
      {workCommonForm()}
        <Col span={8}>
            <Button style={{ margin: '0 8px' }} onClick={()=>{workRegForm.resetFields();onFinishWorkOrder();}}>
                重置
              </Button>
            <Form.Item>
              <Button type="primary" htmlType='submit'>
                查询
             </Button>
              <Button icon={<ExportOutlined />} style={{ margin: '0 8px' }} loading={workRegExportLoading} onClick={() => { workRegExports() }}>
                导出
              </Button>
            </Form.Item>
        </Col>
      </Row>
    </Form>
  }

  const cityRegExports = () => {
    const par = {
      ...queryPar,
      regionCode: cityDetailRegionCode,
      regionLevel: 2,
      staticType: 1,
      pageIndex: undefined,
      pageSize: undefined,
    }
    props.cityRegExportTaskWorkList(par)
  }

  const cityQuery = (values) => {
    props.cityGetTaskWorkOrderList({
      ...values,
      beginTime: values.time[0] && moment(values.time[0]).format("YYYY-MM-DD 00:00:00"),
      endTime: values.time[1] && moment(values.time[1]).format("YYYY-MM-DD 23:59:59"),
      time: undefined,
      regionCode: cityDetailRegionCode,
      staticType: 1,
      regionLevel: 2,
    })
  }
  const searchCityRegComponents = () => { //市级别弹框 
    return <Form
      form={cityForm}
      name="advanced_search"
      layout='inline'
      onFinish={cityQuery}
      initialValues={{
        time: [moment(new Date()).add(-30, 'day').startOf('day'), moment(new Date()).endOf('day')],
      }}
    >
      <Form.Item name='regionName' label='行政区'>
        <Input placeholder='搜索省、市关键字' allowClear />
      </Form.Item>
      <Form.Item name='time' label='日期'>
        <RangePicker style={{ width: '100%' }}
          allowClear={false}
          showTime={false}
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType='submit' loading={cityTableLoading}>
          查询
 </Button>
        <Button icon={<ExportOutlined />} style={{ margin: '0 8px' }} loading={cityRegExportLoading} onClick={() => { cityRegExports() }}>
          导出
 </Button>
      </Form.Item>
    </Form>
  }
  const regPointGetTaskWorkOrderList = (par) => {
    props.regPointGetTaskWorkOrderList({
      ...queryPar,
      pageIndex: 1,
      pageSize: 20,
      regionLevel: undefined,
      staticType: 2,
      ...par
    })
  }



  const [operaPointForm] = Form.useForm()

  const [operationStatus, setOperationStatus] = useState();
  const operaPointClick = (e) => {  //查询  运维监测点
    setRegPointPageIndex(1)
    setRegPointPageSize(20)
    setOperationStatus(e.target.value)
    regPointGetTaskWorkOrderList({
      regionCode: regionCode,
      operationStatus: e.target.value
    })
  }





  const { dateCol } = props;
  const insideWorkOrderCol = () => { //计划内 巡检 校准
    if (dateCol && dateCol[0]) {

      let col =  dateCol.map((item, index) => {
          return {
            title: `${item.date&&moment(item.date).format('MM-DD')}`,
            align: 'center',
            ellipsis: false,
            children: [{
              title: `${item.week}`,
              dataIndex: `${item.week}`,
              key: `${item.week}`,
              width: 70,
              align: 'center',
              ellipsis: false, //taskCompleteCount overCompleteList overIncompleteList
              render: (text, row, index) => {
                let workNumEle, taskWorkNum1, taskWorkNum2, taskWorkNum3, taskTypeName;
                return row.datePick.map(dateItem => {
                  if(dateItem.date == item.date){
                   if (dateItem.taskCompleteCount && dateItem.overCompleteList && dateItem.overIncompleteList) { //同时存在 按照计划完成、 超时完成、超时未完成
                    taskWorkNum1 = dateItem.taskCompleteCount
                    taskWorkNum2 = dateItem.overCompleteList
                    taskWorkNum3 = dateItem.overIncompleteList
                    taskTypeName = 'taskCompleteCount,overCompleteList,overIncompleteList'
                    return popContent(3, `${row.DGIMN}${dateItem.date}`, taskTypeName, dateItem, taskWorkNum1, taskWorkNum2, taskWorkNum3)
                  } else if (dateItem.taskCompleteCount && dateItem.overCompleteList ) { //同时存在 按照计划完成、 超时完成
                    taskWorkNum1 = dateItem.taskCompleteCount
                    taskWorkNum2 = dateItem.overCompleteList
                    taskTypeName = 'taskCompleteCount,overCompleteList'
                    return popContent(2, `${row.DGIMN}${dateItem.date}`, taskTypeName, dateItem, taskWorkNum1, taskWorkNum2)
                  } else  if (dateItem.taskCompleteCount && dateItem.overIncompleteList) { //同时存在 按照计划完成、 超时完成
                    taskWorkNum1 = dateItem.taskCompleteCount
                    taskWorkNum2 = dateItem.overIncompleteList
                    taskTypeName = 'taskCompleteCount,overIncompleteList'
                    return popContent(2, `${row.DGIMN}${dateItem.date}`, taskTypeName, dateItem, taskWorkNum1, taskWorkNum2)
                  } else if (dateItem.overCompleteList && dateItem.overIncompleteList) { //同时存在 超时完成 超时未完成
                    taskWorkNum1 = dateItem.overCompleteList
                    taskWorkNum2 = dateItem.overIncompleteList
                    taskTypeName = 'overCompleteList,overIncompleteList'
                    return popContent(2, `${row.DGIMN}${dateItem.date}`, taskTypeName, dateItem, taskWorkNum1, taskWorkNum2) //同时存在 超时完成、 超时未完成
                  } else if (dateItem.taskCompleteCount) {//按照计划完成
                    workNumEle = <Row align='middle' justify='center' style={{ background: '#1890ff', width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
                      <span style={{ color: '#fff' }}>{dateItem.taskInCompleteCount}</span>
                    </Row>
                    taskTypeName = 'taskCompleteCount'
                    return popContent(1, `${row.DGIMN}${dateItem.date}`, taskTypeName, dateItem, workNumEle)
                  } else if (dateItem.overCompleteList) {//超时完成
                    workNumEle = <Row align='middle' justify='center' style={{ background: '#faad14', width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
                      <span style={{ color: '#fff' }}>{dateItem.taskCompleteCount}</span>
                    </Row>
                    taskTypeName = 'overCompleteList'
                    return popContent(1, `${row.DGIMN}${dateItem.date}`, taskTypeName, dateItem, workNumEle)
                  } else if (dateItem.overIncompleteList) { //超时未完成
                    workNumEle = <Row align='middle' justify='center' style={{ background: '#f5222d', width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
                      <span style={{ color: '#fff' }}>{dateItem.taskCloseCount}</span>
                    </Row>
                    taskTypeName = 'overIncompleteList'
                    return popContent(1, `${row.DGIMN}${dateItem.date}`, taskTypeName, dateItem, workNumEle)
                  }  else{  //没有工单
                    workNumEle = <Row align='middle' justify='center' style={{ background: '#fff', width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}> </Row>
                    return workNumEle
                  }
                }
                })


              }
            }]
          }
        })
        insideWorkOrderColumns.push(...col)
    
    }
    return insideWorkOrderColumns;
  }



  const outWorkOrderCol = () => {  //计划外 巡检工单
    if (dateCol && dateCol[0]) {
      const col = dateCol.map((item, index) => {
          return {
            title: `${item.date&&moment(item.date).format('MM-DD')}`,
            align: 'center',
            ellipsis: false,
            children: [{
              title: `${item.week}`,
              dataIndex: `${item.week}`,
              key: `${item.week}`,
              width: 70,
              align: 'center',
              ellipsis: false,
              render: (text, row, index) => {
                let outWorkNumEle;
                return row.datePick.map(dateItem => {
                  if(dateItem.date == item.date){
                   if (dateItem.taskCompleteCount) {
                    outWorkNumEle = <Row align='middle' justify='center' style={{ background: '#1890ff', width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
                      <span style={{ color: '#fff' }}>{dateItem.taskCompleteCount}</span>
                    </Row>
                    return popContent(1, `${row.DGIMN}${dateItem.date}`, 'taskCompleteCount', dateItem, outWorkNumEle)
                  }else{
                    return <Row align='middle' justify='center' style={{ background: '#fff', width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
                    </Row>
                  }
                }
                })


              }
            }]
          }
      })
      outWorkOrderColumn.push(...col)

    }
    return outWorkOrderColumn;
  }
  // 暴露的子组件方法，给父组件调用   子传父
  const childRef = useRef();
  useImperativeHandle(refInstance, () => {
    return {
      _childFn(values) {
        // setAbnormalType(values)
      },
    }
  })

  const [tabType, setTabType] = useState(planType ? planType : '1')
  const { queryPar } = props;
  const tabsChange = (key) => {
    setTabType(key)
    setTimeout(() => {
      props.parentCallback(key) //子组件调用父组件函数方法 可以向父组件传参，刷新父组件信息 子传父
      queryPar && queryPar.beginTime && props.regEntGetTaskWorkOrderList({
        ...queryPar,
        regionCode: '',
        regionLevel: 1,
        staticType: 1,
        homePageIndex: key,
        outOrInside: key == 3 ? 2 : 1,// 子组件调用的父组件方法
      })
    }, 300)

  }

  const InsideStatusLegend = <Row align='middle' style={{fontSize:14,paddingRight:16}}>
    <Row align='middle' style={{ marginRight: 8 }}>
      <div style={{ display: 'inline-block', background: '#1890ff', width: 24, height: 12, marginRight: 5 }}></div>
      <span>按照计划完成</span>
    </Row>
    <Row align='middle' style={{ marginRight: 8 }}>
      <div style={{ display: 'inline-block', background: '#faad14', width: 24, height: 12, marginRight: 5 }}></div>
      <span>超时完成</span>
    </Row>
    <Row align='middle' style={{ marginRight: 8 }}>
      <div style={{ display: 'inline-block', background: '#f5222d', width: 24, height: 12, marginRight: 5 }}></div>
      <span>超时未完成</span>
    </Row>
    <div >
    </div>
  </Row>


const outStatusLegend =   <Row align='middle' style={{paddingRight:16}}>
<Row  align='middle' style={{ marginRight: 8 }}>
  <div style={{ display: 'inline-block', background: '#1890ff', width: 24, height: 12, marginRight: 5 }}></div>
  <span>计划内完成</span>
</Row>
</Row> 

  return (
    <div style={{ height: '100%' }}>

      <Tabs activeKey={tabType} onChange={tabsChange} style={{ height: '100%' }}>
        <Tabs.TabPane tab="计划巡检完成率" key={'1'}>
          <SdlTable
            size='small'
            loading={tableLoading}
            bordered
            dataSource={tableDatas}
            columns={columns(1)}
            pagination={false}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="计划校准完成率" key={'2'}>
          <SdlTable
            size='small'
            loading={tableLoading}
            bordered
            dataSource={tableDatas}
            columns={columns(2)}
            pagination={false}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="计划外工单统计" key={3}>
          <SdlTable
            size='small'
            loading={tableLoading}
            bordered
            dataSource={tableDatas}
            columns={outsideColumns}
            pagination={false}
          />
        </Tabs.TabPane>
      </Tabs>



      {/**市级别弹框 */}
      <Modal
        title={`${regName} - ${queryPar?.pollutantType == 1 ? '废水' : '废气'}点位计划${tabType == 1 ? '巡检' : tabType == 2 ? '校准' : '外工单'}情况` }
        visible={cityVisible}
        onCancel={() => { setCityVisible(false) }}
        footer={null}
        destroyOnClose
        wrapClassName={`spreadOverModal`}
        bodyStyle={{ padding: 0 }}
      >
        <Card title={searchCityRegComponents()} bordered={false}  bodyStyle={{ padding: '16px  24px 0 24px' }}>
          <MultipleHeadResizeTable
            loading={cityTableLoading}
            bordered
            dataSource={cityTableDatas}
            total={cityTableTotal}
            columns={tabType == 1 || tabType == 2 ? cityInsideRegColumns : cityOutRegColumns}
            pagination={false}
            scroll={{ y: 'calc(100vh - 280px)'}}
          />
        </Card>
      </Modal>


      {/**计划内 省级&&市级工单数弹框  计划巡检 计划校准*/}
      <Modal
        title={<Row justify='space-between' align='middle'>
        <div>{`${regName} - ${queryPar?.pollutantType == 1 ? '废水' : '废气'}点位计划${tabType == 1 ? '巡检' : '校准'}明细`}</div>
        {InsideStatusLegend}
        </Row>
       }
        visible={insideWorkOrderVisible}
        onCancel={() => { setInsideWorkOrderVisible(false) }}
        footer={null}
        destroyOnClose
        wrapClassName={`spreadOverModal`}
        bodyStyle={{ padding: 0 }}
      >
        <Card title={searchWorkComponents()} bordered={false} bodyStyle={{ padding: '16px  24px 0 24px' }}>
          <MultipleHeadResizeTable
            loading={insideOrOutsideWorkLoading}
            bordered
            dataSource={insideOrOutsiderWorkTableDatas}
            columns={insideWorkOrderCol()}
            scroll={{ y: 'calc(100vh - 370px)'}}
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              total: insideOrOutsiderWorkTableTotal,
              pageSize: workPageSize,
              current: workPageIndex,
              onChange: handleWorkTableChange,
            }}
          />
        </Card>
      </Modal>

      {/**计划外 省级&&市级工单数弹框  */}

      <Modal
        title={<Row justify='space-between' align='middle'>
        <div>{`${outTypeName}工单执行明细`}</div>
         {outStatusLegend}
        </Row>
       }
        visible={outWorkOrderVisible}
        onCancel={() => { setOutWorkOrderVisible(false) }}
        footer={null}
        destroyOnClose
        centered
        wrapClassName={`spreadOverModal`}
        bodyStyle={{ padding: 0 }}
      >
        <Card title={searchOutWorkComponents()} bordered={false} bodyStyle={{ padding: '16px  24px 0 24px' }}>
          <MultipleHeadResizeTable
            loading={insideOrOutsideWorkLoading}
            bordered
            dataSource={insideOrOutsiderWorkTableDatas}
            columns={outWorkOrderCol()}
            scroll={{ y: 'calc(100vh - 370px)'}}
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              total: insideOrOutsiderWorkTableTotal,
              pageSize: workPageSize,
              current: workPageIndex,
              onChange: handleWorkTableChange,
            }}
          />
        </Card>
      </Modal>


      <Modal
        title="任务详情"
        visible={taskRecordDetailVisible}
        destroyOnClose
        wrapClassName='spreadOverModal'
        footer={null}
        onCancel={() => {
          setTaskRecordDetailVisible(false)
          setPopVisible(true)
        }}

      >
        <TaskRecordDetails
          match={{ params: { TaskID: taskID, DGIMN: dgimn } }}
          isHomeModal
          hideBreadcrumb
        />
      </Modal>
    </div>
  );
};

export default connect(dvaPropsData, dvaDispatch)(Index);
