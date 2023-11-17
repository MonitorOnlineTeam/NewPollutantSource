/**
 * 功  能：远程督查
 * 创建人：jab
 * 创建时间：2021.3.16
 */
import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Card, Checkbox, Upload, Button, Select, Tabs, Progress, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Spin, Timeline } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, UploadOutlined, ExportOutlined, QuestionCircleOutlined, ProfileOutlined, EditOutlined, IssuesCloseOutlined, } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import EntAtmoList from '@/components/EntAtmoList'
import styles from "./style.less"
import Cookie from 'js-cookie';
import AttachmentView from '@/components/AttachmentView'
import { getAttachmentDataSource } from '@/pages/AutoFormManager/utils'
import NumTips from '@/components/NumTips'
import Detail from "./detail";
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import Lightbox from "react-image-lightbox-rotate";
import "react-image-lightbox/style.css";
import OperationInspectoUserList from '@/components/OperationInspectoUserList'
import CheckUserEditDetail from "./checkUserEdit";

const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;
import cuid from 'cuid';
import { permissionButton } from '@/utils/utils';
import { DevOpsGuru } from 'aws-sdk';

const namespace = 'remoteSupervision'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}


const dvaPropsData = ({ loading, remoteSupervision, global, common, autoForm }) => ({
  tableDatas: remoteSupervision.tableData,
  tableLoading: remoteSupervision.tableLoading,
  tableTotal: remoteSupervision.tableTotal,
  parLoading: loading.effects[`${namespace}/getPointConsistencyParam`] || false,
  // parLoading: remoteSupervision.getPointConsistencyParamLoading,
  editLoading: loading.effects[`${namespace}/getConsistencyCheckInfo`] || false,
  pointListByEntCode: common.pointListByEntCode,
  clientHeight: global.clientHeight,
  addDataConsistencyData: remoteSupervision.addDataConsistencyData,
  addRealTimeData: remoteSupervision.addRealTimeData,
  addParconsistencyData: remoteSupervision.addParconsistencyData,
  consistencyCheckDetail: remoteSupervision.consistencyCheckDetail,
  tableInfo: autoForm.tableInfo,
  exportLoading: loading.effects[`${namespace}/exportRemoteInspectorList`],
  entLoading: common.noFilterEntLoading,
  getRemoteInspectorPointLoading: loading.effects[`${namespace}/getRemoteInspectorPointList`],
  remoteInspectorPointList: remoteSupervision.remoteInspectorPointList,
  addRemoteInspectorPointLoading: loading.effects[`${namespace}/addRemoteInspectorPoint`],
  regQueryPar: remoteSupervision.regQueryPar,
  forwardTableData: remoteSupervision.forwardTableData,
  forwardTableTotal: remoteSupervision.forwardTableTotal,
  forwardTableLoading: remoteSupervision.forwardTableLoading,
  forwardOkLoading: loading.effects[`${namespace}/forwardRemoteInspector`],
  permisBtnTip: global.permisBtnTip,
  importDataLoading: loading.effects[`${namespace}/exportRangeParam`] || false,

})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },

    getPointByEntCode: (payload, callback) => { // 根据企业获取监测点
      dispatch({
        type: `${namespace}/getPointByEntCode`,
        payload: payload,
        callback: callback
      })
    },
    deleteAttach: (file) => { //删除照片
      dispatch({
        type: "autoForm/deleteAttach",
        payload: {
          Guid: file.response && file.response.Datas ? file.response.Datas : file.uid,
        }
      })
    },
    getRemoteInspectorList: (payload) => { // 列表查询
      dispatch({
        type: `${namespace}/getRemoteInspectorList`,
        payload: payload,
      })
    },
    exportRemoteInspectorList: (payload) => { // 列表导出
      dispatch({
        type: `${namespace}/exportRemoteInspectorList`,
        payload: payload,
      })
    },
    getPointConsistencyParam: (payload, callback) => {  //获取数据一致性核查列表 添加参数列表
      dispatch({
        type: `${namespace}/getPointConsistencyParam`,
        payload: payload,
        callback: callback
      })
    },
    getNoxValue: (payload, callback) => { // 获取NOx数采仪实时数据
      dispatch({
        type: `${namespace}/getNoxValue`,
        payload: payload,
        callback: callback
      })
    },
    judgeConsistencyRangeCheck: (payload, callback) => { //量程一致性检查 自动判断
      dispatch({
        type: `${namespace}/judgeConsistencyRangeCheck`,
        payload: payload,
        callback: callback,
      })
    },
    judgeConsistencyCouCheck: (payload, callback) => { //数据一致性检查 自动判断
      dispatch({
        type: `${namespace}/judgeConsistencyCouCheck`,
        payload: payload,
        callback: callback,
      })
    },
    judgeParamCheck: (payload, callback) => { //参数一致性检查 自动判断
      dispatch({
        type: `${namespace}/judgeParamCheck`,
        payload: payload,
        callback: callback,
      })
    },
    addOrUpdConsistencyCheck: (payload, callback) => {  //添加或修改数据一致性核查
      dispatch({
        type: `${namespace}/addOrUpdConsistencyCheck`,
        payload: payload,
        callback: callback,
      })
    },
    addOrUpdParamCheck: (payload, callback) => {  //添加或修改参数一致性核查表
      dispatch({
        type: `${namespace}/addOrUpdParamCheck`,
        payload: payload,
        callback: callback,
      })
    },
    deleteRemoteInspector: (payload, callback) => {  //删除
      dispatch({
        type: `${namespace}/deleteRemoteInspector`,
        payload: payload,
        callback: callback,
      })
    },
    getConsistencyCheckInfo: (payload, callback) => {  //编辑获取详情
      dispatch({
        type: `${namespace}/getConsistencyCheckInfo`,
        payload: payload,
        callback: callback,
      })
    },
    issueRemoteInspector: (payload, callback) => {  //下发 
      dispatch({
        type: `${namespace}/issueRemoteInspector`,
        payload: payload,
        callback: callback,
      })
    },
    getUserList: (payload, callback) => {  //运维人员 列表
      dispatch({
        type: `autoForm/getAutoFormData`,
        payload: {
          configId: 'View_UserOperation',
          otherParams: {
            pageIndex: 1,
            pageSize: 9999999
          }
        },
      })
    },
    addRemoteInspector: (payload, callback) => {  //保存 提交
      dispatch({
        type: `${namespace}/addRemoteInspector`,
        payload: payload,
        callback: callback,
      })
    },
    getRemoteInspectorPointList: (payload, callback) => {  //可申请工单站点
      dispatch({
        type: `${namespace}/getRemoteInspectorPointList`,
        payload: payload,
        callback: callback,
      })
    },
    addRemoteInspectorPoint: (payload, callback) => {  //手工申请工单
      dispatch({
        type: `${namespace}/addRemoteInspectorPoint`,
        payload: payload,
        callback: callback,
      })
    },
    forwardRemoteInspector: (payload, callback) => {  // 转发工单 提交
      dispatch({
        type: `${namespace}/forwardRemoteInspector`,
        payload: payload,
        callback: callback,
      })
    },
    exportRangeParam: (payload, callback) => {  // 导入
      dispatch({
        type: `${namespace}/exportRangeParam`,
        payload: payload,
        callback: callback,
      })
    },
  }
}
const Index = (props) => {
  const pchildref = useRef();
  const [form] = Form.useForm();
  const [form2] = Form.useForm(); //添加编辑表单  数据一致性核查表
  const [form3] = Form.useForm(); //添加编辑表单   参数一致性核查表
  const [commonForm] = Form.useForm();

  const [dates, setDates] = useState([]);
  const { tableDatas, tableLoading, clientHeight, tableTotal, addDataConsistencyData, addRealTimeData, consistencyCheckDetail, parLoading, editLoading, tableInfo, exportLoading, forwardTableLoading, forwardTableData, forwardOkLoading, regQueryPar, getRemoteInspectorPointLoading, remoteInspectorPointList, addRemoteInspectorPointLoading, forwardTableTotal, importDataLoading, } = props;

  const [tabType, setTabType] = useState('1')





  const isRecord = props.match.path === '/operations/remoteSupervisionRecord' ? true : false;



  // const [filePar, setFilePar] = useState() //参数一致性核查表 上传附件 点击字段
  // const [filesCuidList, setFilesCuidList] = useState({}) //参数一致性核查表 上传附件
  // const [filesList3, setFilesList3] = useState({}) //参数一致性核查表 参数附件列表

  const [analyzerFilePar, setAnalyzerFilePar] = useState() //分析仪量程照片
  const [analyzerFileCuidList, setAnalyzerFileCuidList] = useState({})
  const [analyzerFileList, setAnalyzerFileList] = useState({})

  const [dasFilePar, setDasFilePar] = useState() //das量程照片
  const [dasFileCuidList, setDasFileCuidList] = useState({})
  const [dasFileList, setDasFileList] = useState({})

  const [rangeFilePar, setRangeFilePar] = useState() //数采仪量程照片
  const [rangeFileCuidList, setRangeFileCuidList] = useState({})
  const [rangeFileList, setRangeFileList] = useState({})



  const [settingFilePar, setSettingFilePar] = useState() //仪表设定值照片
  const [settingFileCuidList, setSettingFileCuidList] = useState({})
  const [settingFileList, setSettingFileList] = useState({})

  const [instrumentFilePar, setInstrumentFilePar] = useState() //DAS设定值照片
  const [instrumentFileCuidList, setInstrumentFileCuidList] = useState({})
  const [instrumentFileList, setInstrumentFileList] = useState({})

  const [traceabilityFilePar, setTraceabilityFilePar] = useState() //溯源值照片
  const [traceabilityFileCuidList, setTraceabilityFileCuidList] = useState({})
  const [traceabilityFileList, setTraceabilityFileList] = useState({})

  const [dataFilePar, setDataFilePar] = useState() //数采仪设定值照片
  const [dataFileCuidList, setDataFileCuidList] = useState({})
  const [dataFileList, setDataFileList] = useState({})

  const [delPermis, setDelPermis] = useState(false)

  useEffect(() => {
    const buttonList = permissionButton(props.match.path)
    buttonList.map(item => {
      switch (item) {
        case 'delete': setDelPermis(true); break;
      }
    })
    onFinish(pageIndex, pageSize)
    props.getUserList()


  }, []);



  const [rangReq, setRangReq] = useState({})
  const [remark, setRemark] = useState({})
  const [indicaValReq, setIndicaValReq] = useState({}) //示值
  const [remark2, setRemark2] = useState({})

  const [traceValReq, setTraceValReq] = useState({})
  const [remark3, setRemark3] = useState({})





  const reqinit = () => { //初始化是否校验
    if (addDataConsistencyData && addDataConsistencyData[0]) { //动态生成判断量程 是否 是否必填的
      let analysisParRangObj = {}, parRemarkObj = {};
      let indicaValReqObj = {}, parRemark2Obj = {};

      addDataConsistencyData.map((item, index) => {
        analysisParRangObj[`${item.par}RangFlag`] = true; //量程 量程一致性
        parRemarkObj[`${item.par}RemarkFlag`] = false;

      })
      setRangReq(analysisParRangObj)
      // setRemark(parRemarkObj)

      addRealTimeData.map((item, index) => {
        indicaValReqObj[`${item.par}IndicaValFlag`] = true;//示值 实时数据一致性
        parRemark2Obj[`${item.par}Remark2Flag`] = false;
      })
      setIndicaValReq(indicaValReqObj)
      // setRemark2(parRemark2Obj)
    }



    if (addParconsistencyData && addParconsistencyData[0]) { //动态生成判断设定值 溯源值是否必填的 参数一致性核查表参数一致性核查表
      let setValObj = {}, traceValObj = {}, parRemark3Obj = {};

      addParconsistencyData.map((item, index) => {
        traceValObj[`${item.par}TraceValFlag`] = false;
        parRemark3Obj[`${item.par}Remark3Flag`] = false;
      })
      setTraceValReq(traceValObj)
      // setRemark3(parRemark3Obj)
    }
  }



  const [ID, setID] = useState()


  const issueTipContent = <div>
    <p style={{ marginBottom: 5 }}>1、待下发：督查结果未发送通知给点运维负责人。</p>
    <p style={{ marginBottom: 0 }}>2、已下发：督查结果已下发通知给点运维负责人。</p>
  </div>

  const columns = [
    {
      title: '省/市',
      dataIndex: 'regionName',
      key: 'regionName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '企业名称',
      dataIndex: 'entName',
      key: 'entName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '监测点名称',
      dataIndex: 'pointName',
      key: 'pointName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '核查结果',
      dataIndex: 'resultCheck',
      key: 'resultCheck',
      align: 'center',
      ellipsis: true,
      render: (text, record) => {
        return text === '不合格' ? <span style={{ color: '#f5222d' }}>{text}</span> : <span>{text}</span>
      }
    },
    {
      title: '量程是否一致',
      dataIndex: 'rangeStatus',
      key: 'rangeStatus',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '数据是否一致',
      dataIndex: 'couStatus',
      key: 'couStatus',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '参数是否一致',
      dataIndex: 'paramStatus',
      key: 'paramStatus',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '量程一致性问题数量',
      dataIndex: 'rangeErrCount',
      key: 'rangeErrCount',
      align: 'center',
      width: 180,
      ellipsis: true,
    },
    {
      title: '数据一致性问题数量',
      dataIndex: 'couErrCount',
      key: 'couErrCount',
      align: 'center',
      width: 180,
      ellipsis: true,
    },
    {
      title: '参数一致性问题数量',
      dataIndex: 'paramErrCount',
      key: 'paramErrCount',
      align: 'center',
      width: 180,
      ellipsis: true,
    },
    {
      title: '不规范数量',
      dataIndex: 'StandardErrCount',
      key: 'StandardErrCount',
      align: 'center',
      width: 100,
      ellipsis: true,
    },
    {
      title: '核查人',
      dataIndex: 'CheckUser',
      key: 'CheckUser',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '核查日期',
      dataIndex: 'CheckTime',
      key: 'CheckTime',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '任务执行人',
      dataIndex: 'operationUserName',
      key: 'operationUserName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: <span style={{ position: 'relative' }}>下发状态 <NumTips content={issueTipContent} style={{ top: 2, zIndex: 1, }} /></span>,
      dataIndex: 'issue',
      key: 'issue',
      align: 'center',
      ellipsis: true,
      render: (text, record) => {
        return text === '待下发' ? <span style={{ color: '#f5222d' }}>{text}</span> : <span>{text}</span>
      }
    },
    {
      title: '下发时间',
      dataIndex: 'issueTime',
      key: 'issueTime',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '创建人',
      dataIndex: 'userName',
      key: 'userName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '更新人',
      dataIndex: 'updName',
      key: 'updName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '更新时间',
      dataIndex: 'updTime',
      key: 'updTime',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      width: 150,
      ellipsis: true,
      render: (text, record) => {
        // const updateflag = record.updateflag;
        // const flag = record.flag;
        const issue = record.issue;
        const isCheckUser = record.isCheckUser;
        let detail = <Tooltip title="详情">
          <a onClick={() => {
            details(record)
          }}>
            <ProfileOutlined style={{ fontSize: 16 }} />
          </a>
        </Tooltip>
        if (isRecord) { //远程督查记录页面
          return detail
        }
        return (
          <>
            <Tooltip title={'编辑'}> {/* title={updateflag && flag? "编辑" : null  } */}
              <a onClick={() => {
                // if (updateflag && flag) {
                //   edit(record)
                // }
                // return;
                edit(record)
              }}  >
                {/* <EditOutlined style={{ cursor: updateflag && flag ? 'pointer' : 'not-allowed', color: updateflag && flag ? '#1890ff' : 'rgba(0, 0, 0, 0.25) ', fontSize: 16 }} /> */}
                <EditOutlined style={{ fontSize: 16 }} />

              </a>
            </Tooltip>
            <Divider type="vertical" />
            {detail}
            {delPermis && <><Divider type="vertical" />
              <Tooltip title={'删除'} >
                {/* title={ updateflag && flag? "删除": null  } */}
                {/* <Popconfirm disabled={!(updateflag && flag && !isCheckUser)} title="确定要删除此条信息吗？" placement="left" onConfirm={() => del(record)} okText="是" cancelText="否">
                <a style={{ cursor: updateflag && flag && !isCheckUser? 'pointer' : 'not-allowed', color: updateflag && flag && !isCheckUser? '#1890ff' : 'rgba(0, 0, 0, 0.25) ', }}><DelIcon style={{ fontSize: 16 }} /></a>
              </Popconfirm>  */}
                <Popconfirm disabled={!isCheckUser ? false : true} title="确定要删除此条信息吗？" placement="left" onConfirm={() => del(record)} okText="是" cancelText="否">
                  <a style={{ cursor: !isCheckUser ? 'pointer' : 'not-allowed', color: !isCheckUser ? '#1890ff' : 'rgba(0, 0, 0, 0.25) ', }}><DelIcon style={{ fontSize: 16 }} /></a>
                </Popconfirm>
              </Tooltip></>}
            <Divider type="vertical" />
            <Tooltip title={"下发"} > {/* title={!issue||issue==='已下发'?  null : "下发"}*/}
              <Popconfirm disabled={(!issue) || issue === '已下发' || (!isCheckUser) ? true : false} title="确定要下发督查结果给点位的运维负责人吗？" placement="left" onConfirm={() => issues(record)} okText="是" cancelText="否">
                <a style={{ cursor: (!issue) || issue === '已下发' || (!isCheckUser) ? 'not-allowed' : 'pointer', color: !issue || issue === '已下发' || !isCheckUser ? 'rgba(0, 0, 0, 0.25) ' : '#1890ff', }}><IssuesCloseOutlined style={{ fontSize: 16 }} /></a>
              </Popconfirm>
            </Tooltip>
          </>
        )
      }

    }
  ]
  const [taskForm] = Form.useForm();
  const [forwardTaskVisible, setForwardTaskVisible] = useState(false)

  const forwardClick = () => {
    setForwardTaskVisible(true);
    taskForm.resetFields();
    setPageIndex(1)
    onTaskFinish({}, 1, forwardpageSize);
  }

  const [forwardTaskForm] = Form.useForm();
  const [forwardTaskOkVisible, setForwardTaskOkVisible] = useState(false)
  const [forwardTaskID, setForwardTaskID] = useState(false)
  const forwardTask = (record) => { //转发
    setForwardTaskOkVisible(true)
    setForwardTaskID(record.id)
    forwardTaskForm.resetFields()
  }
  const forwardTaskOk = async () => { //转发提交
    try {
      const values = await forwardTaskForm.validateFields();
      props.forwardRemoteInspector({ ID: forwardTaskID, ...values }, (res) => {
        setForwardTaskOkVisible(false)
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  const onTaskFinish = (values, pageIndex, pageSize) => {
    props.getRemoteInspectorList({
      ...values,
      beginTime: regQueryPar.BeginTime,
      endTime: regQueryPar.EndTime,
      isForward: 1,
      pageIndex: pageIndex,
      pageSize: pageSize,
    })
  }


  const [forwardpageIndex, setForwardPageIndex] = useState(1)
  const [forwardpageSize, setForwardPageSize] = useState(20)

  const forwardHandleTableChange = (PageIndex, PageSize) => {
    setForwardPageIndex(PageIndex)
    setForwardPageSize(PageSize)
    onTaskFinish({}, PageIndex, PageSize)
  }

  const [taskPointList, setTaskPointList] = useState([])
  const [taskPointLoading, setTaskPointLoading] = useState(false)
  const onTaskValuesChange = (hangedValues, allValues) => {
    if (Object.keys(hangedValues).join() == 'entCode') {
      if (!hangedValues.entCode) { //清空时 不走请求
        form.setFieldsValue({ DGIMN: undefined })
        setTaskPointList([])
        return;
      }
      setTaskPointLoading(true)
      props.getPointByEntCode({ EntCode: hangedValues.entCode }, (res) => {
        setTaskPointList(res)
        setTaskPointLoading(false)
      })
      taskForm.setFieldsValue({ DGIMN: undefined })
    }
  }
  /***转发任务单 */
  const taskColumns = [
    {
      title: '序号',
      align: 'center',
      ellipsis: true,
      render: (text, record, index) => {
        return index + 1
      }
    },
    // {
    //   title: '省',
    //   dataIndex: 'provinceName',
    //   key: 'provinceName',
    //   align: 'center',
    // },
    // {
    //   title: '市',
    //   dataIndex: 'cityName',
    //   key: 'cityName',
    //   align: 'center',
    // },
    {
      title: '省/市',
      dataIndex: 'regionName',
      key: 'regionName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: `企业名称`,
      dataIndex: 'entName',
      key: 'entName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '监测点名称',
      dataIndex: 'pointName',
      key: 'pointName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '任务执行人',
      dataIndex: 'operationUserName',
      key: 'operationUserName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '派单时间',
      dataIndex: 'createTime',
      key: 'createTime',
      align: 'center',
      ellipsis: true,
      // render: (text, record, index) => {
      //   return text ? moment(text).format('YYYY-MM-DD') : undefined
      // }
    },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      width: 150,
      ellipsis: true,
      render: (text, record) => {
        return <a onClick={() => { forwardTask(record) }}>转发</a>
      }

    }
  ];
  const searchTaskComponents = () => {
    return <Form
      form={taskForm}
      name="advanced_search2"
      className={styles["ant-advanced-search-form"]}
      onFinish={(value) => { setForwardPageIndex(1); onTaskFinish(value, 1, forwardpageSize) }}
      onValuesChange={onTaskValuesChange}
      layout='inline'
    >
      <Spin spinning={entLoading} size='small'>
        <Form.Item label='企业' name='entCode' style={{ marginRight: 8 }}>
          <EntAtmoList noFilter style={{ width: 300 }} />
        </Form.Item>
      </Spin>
      <Spin spinning={taskPointLoading} size='small'>
        <Form.Item label='监测点名称' name='DGIMN' >

          <Select placeholder='请选择' showSearch allowClear optionFilterProp="children" style={{ width: 150 }}>
            {
              taskPointList[0] && taskPointList.map(item => {
                return <Option key={item.DGIMN} value={item.DGIMN} >{item.PointName}</Option>
              })
            }
          </Select>
        </Form.Item>
      </Spin>
      <Form.Item>
        <Button type="primary" loading={forwardTableLoading} htmlType='submit'>
          查询
            </Button>
      </Form.Item>

    </Form>
  }
  const [requestTaskForm] = Form.useForm();
  const [requestTaskVisible, setRequestTaskVisible] = useState(false)
  const requestTask = () => { //申请任务单
    setRequestTaskVisible(true)
    requestTaskForm.resetFields()
    props.getRemoteInspectorPointList({
      beginTime: moment().startOf('month').format('YYYY-MM-DD HH:mm:ss'),
      endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
    })
  }
  const requestTaskOk = async () => {
    try {
      const values = await requestTaskForm.validateFields();
      props.addRemoteInspectorPoint({ ...values }, (res) => {
        setRequestTaskVisible(false)
        setPageIndex(1)
        onFinish(1, pageSize)
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }


  const echoForamtUnit = (code, val, item, isImport) => { //格式化 除单位外的所有单位 数据一致性核查表
    form2.setFieldsValue({
      [`${code}AnalyzerUnit`]: val.AnalyzerUnit,
      [`${code}DsUnit`]: val.DASUnit,
      [`${code}ScyUnit`]: val.DataUnit,
    })
    !isImport&&form2.setFieldsValue({//实时数据一致性核查表单位 导入数据不用
      [`${code}IndicaUnit`]: val.AnalyzerCouUnit,
      [`${code}DsDataUnit`]: val.DASCouUnit,
      [`${code}ScyDataUnit`]: val.DataCouUnit,
    })
  }
  const echoForamtData = (code, val, item,isImport) => { //格式化 除单位外的所有数据 数据一致性核查表
    form2.setFieldsValue({
      [`${code}AnalyzerRang1`]: val.AnalyzerMin,
      [`${code}AnalyzerRang2`]: val.AnalyzerMax,
      [`${code}DsRang1`]: val.DASMin,
      [`${code}DsRang2`]: val.DASMax,
      [`${code}ScyRang1`]: val.DataMin,
      [`${code}ScyRang2`]: val.DataMax,
      [`${code}RangUniformity`]: val.RangeAutoStatus,
      [`${code}RangCheck`]:isImport? form2.getFieldValue(`${code}RangCheck`): val.RangeStatus ? [val.RangeStatus] : [],
      [`${code}Remark`]:isImport? form2.getFieldValue(`${code}Remark`): val.RangeRemark,
      [`${code}OperationRangeRemark`]: val.OperationRangeRemark,
      }) 
      !isImport&&form2.setFieldsValue({//实时数据一致性核查表 导入数据不用
        [`${code}IndicaVal`]: val.AnalyzerCou,
        [`${code}DsData`]: val.DASCou,
        [`${code}ScyData`]: val.DataCou,
        [`${code}DataUniformity`]: val.CouAutoStatus,
        [`${code}RangCheck2`]: val.CouStatus ? [val.CouStatus] : [],
        [`${code}Remark2`]: val.CouRemrak,
        [`${code}OperationDataRemark`]: val.OperationDataRemark,
        [`${code}AnalyzerFilePar`]: item.AnalyzerFileList?.[0] && item.AnalyzerFileList?.[0].FileUuid,
        [`${code}DasFilePar`]: item.DASFileList?.[0] && item.DASFileList?.[0].FileUuid,
        [`${code}RangeFilePar`]: item.RangeFileList?.[0] && item.RangeFileList?.[0].FileUuid,
      })
   
  }

  const echoForamt = (code, val, item,isImport) => { //格式化 编辑回显
    // form2.setFieldsValue({
    //   [`${code}AnalyzerRang1`]: val.AnalyzerMin,
    //   [`${code}AnalyzerRang2`]: val.AnalyzerMax,
    //   [`${code}AnalyzerUnit`]: val.AnalyzerUnit,
    //   [`${code}DsRang1`]: val.DASMin,
    //   [`${code}DsRang2`]: val.DASMax,
    //   [`${code}DsUnit`]: val.DASUnit,
    //   [`${code}ScyRang1`]: val.DataMin,
    //   [`${code}ScyRang2`]: val.DataMax,
    //   [`${code}ScyUnit`]: val.DataUnit,
    //   [`${code}RangUniformity`]: val.RangeAutoStatus,
    //   [`${code}RangCheck`]: val.RangeStatus ? [val.RangeStatus] : [],
    //   [`${code}Remark`]: val.RangeRemark,
    //   [`${code}OperationRangeRemark`]: val.OperationRangeRemark,
    //   [`${code}IndicaVal`]: val.AnalyzerCou,//实时数据一致性核查表
    //   [`${code}IndicaUnit`]: val.AnalyzerCouUnit,
    //   [`${code}DsData`]: val.DASCou,
    //   [`${code}DsDataUnit`]: val.DASCouUnit,
    //   [`${code}ScyData`]: val.DataCou,
    //   [`${code}ScyDataUnit`]: val.DataCouUnit,
    //   [`${code}DataUniformity`]: val.CouAutoStatus,
    //   [`${code}RangCheck2`]: val.CouStatus ? [val.CouStatus] : [],
    //   [`${code}Remark2`]: val.CouRemrak,
    //   [`${code}OperationDataRemark`]: val.OperationDataRemark,
    //   [`${code}AnalyzerFilePar`]: item.AnalyzerFileList?.[0] && item.AnalyzerFileList?.[0].FileUuid,
    //   [`${code}DasFilePar`]: item.DASFileList?.[0] && item.DASFileList?.[0].FileUuid,
    //   [`${code}RangeFilePar`]: item.RangeFileList?.[0] && item.RangeFileList?.[0].FileUuid,
    // })
    echoForamtData(code, val, item, isImport)
    echoForamtUnit(code, val, item, isImport)
  }

  const [echoLoading, setEchoLoading] = useState(false)
  const [isCheckUser, setIsCheckUser] = useState(false)
  const [visible, setVisible] = useState(false)
  const [title, setTitle] = useState('添加')
  const [editId, setEditId] = useState()
  const [checkEditvisible, setCheckEditvisible] = useState(false)

  const edit = (record) => { //编辑
    // if(record.isCheckUser){ //核查人员编辑的时候
    //   setCheckEditvisible(true)
    //   setTitle('编辑')
    //   setEditId(record.id)
    //   return;
    // }
    setVisible(true)
    setTitle('编辑')
    setEditId(record.id)
    setEchoLoading(true)
    resetData();
    setTabType("1")
    setIsCheckUser(record.isCheckUser)
    // setIsCheckUser(true)
    props.getConsistencyCheckInfo({ ID: record.id }, (data) => {
      //共同的字段
      commonForm.setFieldsValue({
        OperationUserID: data.operationUserID,
        EntCode: data.entCode,
        month: moment(moment(data.dateTime).format("YYYY-MM-DD")),
        Commitment: data.Commitment,
      })
      setPointLoading2(true)
      props.getPointByEntCode({ EntCode: data.entCode }, (res) => {
        setPointList2(res)
        setPointLoading2(false)
        commonForm.setFieldsValue({
          DGIMN: data.DGIMN,
        })

      })
      dgimnEchoDataFun(data.DGIMN, data, '编辑')

    })
  }
  const importData = () => { //导入数据
    const mn = commonForm.getFieldValue('DGIMN')
    props.exportRangeParam({ DGIMN: mn }, (data) => {
      setIsDisPlayCheck1(false)
      setIsDisPlayCheck2(false)
      setIsDisPlayCheck3(false)
      setIsDisPlayCheck4(false)
      let codeArr = data.consistencyCheckList?.[0]&&data.consistencyCheckList.map(item=>item?.DataList?.PollutantCode)
          codeArr = codeArr.filter((item, index) => codeArr.indexOf(item) === index);//去重
      let i=0,j=0;
      codeArr.map((item,index)=>{
       if(item=='411'&&i==0){ //颗粒物
          codeArr.push('411a')
          i++
       }
       if(item=='415'&&j==0){ //流速
          codeArr.push('415b')
          j++;
        }
       
     })
     codeArr.map(code=>{ //初始化量程一致性 流速和颗粒物
      form2.setFieldsValue({
        [`${code}AnalyzerRang1`]: undefined,
        [`${code}AnalyzerRang2`]: undefined,
        [`${code}DsRang1`]: undefined,
        [`${code}DsRang2`]: undefined,
        [`${code}ScyRang1`]: undefined,
        [`${code}ScyRang2`]: undefined,
        [`${code}RangUniformity`]: undefined,
        // [`${code}RangCheck`]: [],
        // [`${code}Remark`]: undefined,
        [`${code}OperationRangeRemark`]: undefined,
        [`${code}AnalyzerFilePar`]: undefined,
        [`${code}DasFilePar`]: undefined,
        [`${code}RangeFilePar`]: undefined,
        [`${code}AnalyzerUnit`]: undefined,
        [`${code}DsUnit`]: undefined,
        [`${code}ScyUnit`]: undefined,

      })
     })
      echoUnit(addDataConsistencyData,'isImport') //初始化量程一致性单位
      // form3.resetFields();//初始化参数一致性核查表
      form3.setFieldsValue({allSelect:false})
      //量程一致性和数据一致性 回显数据
      data.consistencyCheckList?.[0] && consistencyEchoData(data.consistencyCheckList, 'isImport')
      //参数一致性核查 回显数据
      data.consistentParametersCheckList?.[0] && echoParFun(data.consistentParametersCheckList,'isImport')
    })

  }

  const dgimnEchoDataFun = (mn, data, title) => { //通过监测点获取回显数据  编辑时

    getPointConsistencyParamFun(mn, (pollutantList, paramList, addRealTimeList) => {
      if (!data.consistencyCheckList || data.consistencyCheckList?.length == 0) { //数据一致性核查表 回显数据为空数组时
        if (pollutantList?.[0]) {
          pollutantList.map(item => {
            echoForamtData(item.par, [], [])
          })
          echoUnit(pollutantList) //默认显示单位默认值
          echoUnit(addRealTimeList)
          defaultRangeTimeFilesCuid(pollutantList)
        }
        setIsDisPlayCheck1(false)
        setIsDisPlayCheck2(false)
        setIsDisPlayCheck3(false)
        setIsDisPlayCheck4(false)
        // setDasChecked(false)
        // setNumChecked(false)
        // setNumRealTimeChecked(false)
      } else {
        consistencyEchoData(data.consistencyCheckList)

      }


      if (data.couUpload && data.couUpload[0]) { //实时数据一致性核查表 附件
        form2.setFieldsValue({ files2: data.couUpload[0].FileUuid })
        setFilesCuid2(data.couUpload[0].FileUuid)
        const fileList = []
        data.couUpload.map(uploadItem => {
          if (!uploadItem.IsDelete) {
            fileList.push({
              uid: uploadItem.GUID,
              name: uploadItem.FileName,
              status: 'done',
              url: `/upload/${uploadItem.FileName}`,
            })

          }
        })
        setFileList2(fileList)
      } else {
        setFilesCuid2(cuid())
      }

      //参数一致性核查 回显数据
      const paramData = data?.consistentParametersCheckList?.[0] ? data?.consistentParametersCheckList : paramList
      paramData?.[0] && echoParFun(paramData)
      setEchoLoading(false)


    }, title)
  }

  const consistencyEchoData = (consistencyCheckList, isImport) => { //量程一致性和数据一致性回显
    let analyzerUploadList = {}, analyzerUploadFilesListObj = {};
    let dasUploadList = {}, dasUploadFilesListObj = {};
    let rangeUploadList = {}, rangeUploadFilesListObj = {};

    consistencyCheckList.map(item => { //一致性核查表 量程和数据

      let val =  item.DataList;
      let code = item.DataList.PollutantCode;

      if (item.PollutantName == '颗粒物') { 
        if (val.Special) {
          if (val.Special == 1) { //有显示屏
            echoForamt(code, val, item)
            setIsDisPlayCheck1(true)
            isDisplayChange({ target: { checked: true } }, 'isDisplay1', 'firstDefault')
            onManualChange(val.RangeStatus && [val.RangeStatus], { ...val, par: `${code}` }, `${code}RangCheck`, 1)
          }
          if (val.Special == 2) { //无显示屏
            echoForamt(`${code}a`, val, item)
            isDisplayChange({ target: { checked: true } }, 'isDisplay2', 'firstDefault')
            onManualChange(val.RangeStatus && [val.RangeStatus], { ...val, par: `${code}a` }, `${code}aRangCheck`, 1)

          }
        }
        if (val.CouType && !isImport) { //导入数据不用覆盖实时数据
          if (val.CouType == 1) { //原始浓度
            echoForamt(`${code}c`, val, item)
            onManualChange(val.CouStatus && [val.CouStatus], { ...val, par: `${code}c` }, `${code}cRangCheck2`, 2)
          }
          if (val.CouType == 2) { //标杆浓度
            echoForamt(`${code}d`, val, item)
            onManualChange(val.CouStatus && [val.CouStatus], { ...val, par: `${code}d` }, `${code}dRangCheck2`, 2)
          }

        }
      } else if (item.PollutantName === '流速') {
        if(!isImport){
         form2.setFieldsValue({  //实时数据
          [`${code}DsData`]: val.DASCou,
          [`${code}DsDataUnit`]: val.DASCouUnit,
          [`${code}ScyData`]: val.DataCou,
          [`${code}ScyDataUnit`]: val.DataCouUnit,
          [`${code}DataUniformity`]: val.CouAutoStatus,
          [`${code}RangCheck2`]: val.CouStatus ? [val.CouStatus] : [],
          [`${code}Remark2`]: val.CouRemrak,
          [`${code}OperationDataRemark`]: val.OperationDataRemark,
         })
        onManualChange(val.RangeStatus && [val.RangeStatus], { ...val, par: `${code}` }, `${code}RangCheck2`, 2)
        }
        if (val.Special == 1) { //差压法
          echoForamt(code, val, item,isImport)
          isDisplayChange2({ target: { checked: true } }, 'isDisplay3', 'firstDefault')
          onManualChange(val.RangeStatus && [val.RangeStatus], { ...val, par: `${code}` }, `${code}RangCheck`, 1)
        } else if (val.Special == 2) { //直测流速法
          echoForamt(`${code}b`, val, item,isImport)
          isDisplayChange2({ target: { checked: true } }, 'isDisplay4', 'firstDefault')
          onManualChange(val.RangeStatus && [val.RangeStatus], { ...val, par: `${code}b` }, `${code}bRangCheck`, 1)

        }

      } else {
        echoForamt(code, val, item,isImport)
        onManualChange(val.RangeStatus && [val.RangeStatus], { ...val, par: `${code}` }, `${code}RangCheck`, 1) //编辑 手工修正结果 量程一致性
        !isImport&&onManualChange(val.CouStatus && [val.CouStatus], { ...val, par: `${code}` }, `${code}RangCheck2`, 2)//编辑 手工修正结果 实时数据

      }
      // setNumChecked(val.DataRangeStatus == 1 ? true : false)
      // setNumRealTimeChecked(val.DataStatus == 1 ? true : false)
      // setDasChecked(val.DASStatus == 1 ? true : false)

      const echoFileList = (uploadList, uploadListPar, uploadFilesListObj, filePar) => { //附件回显

        if (code == '411' && item.DataList && !item.DataList.Special) { return }
        let parFileList = [];
        uploadList?.length && uploadList.map(uploadItem => {
          if (!uploadItem.IsDelete) {
            parFileList.push({
              uid: uploadItem.GUID,
              name: uploadItem.FileName,
              status: 'done',
              url: `\\upload\\${uploadItem.FileName}`,
            })
          }
        })
        uploadListPar[`${code}${filePar}`] = parFileList;
        uploadFilesListObj[`${code}${filePar}`] = uploadList?.[0]?.FileUuid ? uploadList[0].FileUuid : cuid(); //添加过的照片 再次编辑时
      }
      const pars = item.PollutantName == '颗粒物' && val.Special == 2 ? 'a' : item.PollutantName === '流速' && val.Special == 2 ? 'b' : ''
      echoFileList(item.AnalyzerFileList, analyzerUploadList, analyzerUploadFilesListObj, `${pars}AnalyzerFilePar`) //分析仪量程照片	
      echoFileList(item.DASFileList, dasUploadList, dasUploadFilesListObj, `${pars}DasFilePar`) //DAS量程照片	
      echoFileList(item.RangeFileList, rangeUploadList, rangeUploadFilesListObj, `${pars}RangeFilePar`) //数采仪量程照片	

    })
    setAnalyzerFileList({ ...analyzerUploadList })
    setAnalyzerFileCuidList({ ...analyzerUploadFilesListObj })

    setDasFileList({ ...dasUploadList })
    setDasFileCuidList({ ...dasUploadFilesListObj })

    setRangeFileList({ ...rangeUploadList })
    setRangeFileCuidList({ ...rangeUploadFilesListObj })
  }


  const filesCuidObjFun = (data, filePar, callFun) => { //照片默认展示
    let filesCuidObj = {}, filesListObj = {}; //附件 cuid
    data.map((item, index) => {
      filesCuidObj[`${item.par}${filePar}`] = cuid();
      filesListObj[`${item.par}${filePar}`] = [];
    })
    callFun && callFun(filesCuidObj, filesListObj)

  }
  const defaultRangeTimeFilesCuid = (pollutantList) => { //默认量程一致性和实时数据一致性附件id
    const pars = isDisPlayCheck2 ? 'a' : isDisPlayCheck4 ? 'b' : ''
    filesCuidObjFun(pollutantList, `${pars}AnalyzerFilePar`, (cuidObj, listObj) => { setAnalyzerFileCuidList(cuidObj); setAnalyzerFileList(listObj) })
    filesCuidObjFun(pollutantList, `${pars}DasFilePar`, (cuidObj, listObj) => { setDasFileCuidList(cuidObj); setDasFileList(listObj) })
    filesCuidObjFun(pollutantList, `${pars}RangeFilePar`, (cuidObj, listObj) => { setRangeFileCuidList(cuidObj); setRangeFileList(listObj) })
  }
  const defaultParCuid = (paramList) => { //默认参数一致性核查附件id
    filesCuidObjFun(paramList, 'SettingFilePar', (cuidObj, listObj) => { setSettingFileCuidList(cuidObj); setSettingFileList(listObj) })
    filesCuidObjFun(paramList, 'InstrumentFilePar', (cuidObj, listObj) => { setInstrumentFileCuidList(cuidObj); setInstrumentFileList(listObj) })
    filesCuidObjFun(paramList, 'TraceabilityFilePar', (cuidObj, listObj) => { setTraceabilityFileCuidList(cuidObj); setTraceabilityFileList(listObj) })
    filesCuidObjFun(paramList, 'DataFilePar', (cuidObj, listObj) => { setDataFileCuidList(cuidObj); setDataFileList(listObj) })
  }
  const getPointConsistencyParamFun = (mn, callback, title) => {// 添加或编辑参数列表
    props.getPointConsistencyParam({ DGIMN: mn }, (pollutantList, addRealTimeList, paramList, operationName) => {
      // resetData(true)//防止提交完之后 切换tab栏 提交下一个 数据清空的情况
      echoUnit(pollutantList) //默认显示单位默认值
      echoUnit(addRealTimeList)
      if (title === '添加') {
        if (pollutantList?.[0]) {
          defaultRangeTimeFilesCuid(pollutantList)
        }
        if (paramList?.[0]) {
          defaultParCuid(paramList)
        }
      }
      callback && callback(pollutantList, paramList, addRealTimeList)
    })
  }


  const del = (record) => { //删除
    props.deleteRemoteInspector({ ID: record.id }, () => {
      onFinish(1, 20)
    })
  }
  const issues = (record) => { //下发
    props.issueRemoteInspector({ ID: record.id }, () => {
      onFinish(pageIndex, pageSize)
    })
  }
  const [outOrInside, setOutOrInside] = useState(1)
  const onFinish = async (pageIndex, pageSize) => {  //查询
    try {
      const values = await form.validateFields();
      props.getRemoteInspectorList({
        ...values,
        month: undefined,
        BeginTime: values.month ? moment(values.month[0]).format("YYYY-MM-DD 00:00:00") : undefined,
        EndTime: values.month ? moment(values.month[1]).format("YYYY-MM-DD 23:59:59") : undefined,
        pageIndex: pageIndex,
        pageSize: pageSize,
      })


    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  const exports = async () => {  //导出
    const values = await form.validateFields();
    props.exportRemoteInspectorList({
      ...values,
      month: undefined,
      BeginTime: values.month ? moment(values.month[0]).format("YYYY-MM-DD 00:00:00") : undefined,
      EndTime: values.month ? moment(values.month[1]).format("YYYY-MM-DD 23:59:59") : undefined,
    })
  }
  const resetData = () => {
    form2.resetFields();
    form3.resetFields();
    // setDasChecked(false)
    // setNumChecked(false)
    // setNumRealTimeChecked(false)
    setIsDisPlayCheck1(false)
    setIsDisPlayCheck2(false)
    setIsDisPlayCheck3(false)
    setIsDisPlayCheck4(false)
    // setFileList1([]); 
    setPointList2([])
    setFileList2([]); //清除附件
    commonForm.resetFields();
    props.updateState({ addDataConsistencyData: [], addRealTimeData: [], addParconsistencyData: [] })
    // setAddId();
    // !flag&&commonForm.resetFields();
    // !flag&&setAddId();
    // !flag&&props.updateState({ addDataConsistencyData: [], addRealTimeData: [], addParconsistencyData: [] })
  }
  const add = () => {

    setTitle('添加')
    setVisible(true)
    setTabType('1')
    // setFilesCuid1(cuid())
    setFilesCuid2(cuid())
    resetData()
  }
  const [saveLoading1, setSaveLoading1] = useState(false)
  const [saveLoading2, setSaveLoading2] = useState(false)


  const [addId, setAddId] = useState();
  const save = (type) => {

    commonForm.validateFields().then(commonValues => {
      if (type == 2 && !isCheckUser && !commonValues.Commitment) { //运维人员不在结尾的“已阅读已承诺”打勾，不能提交
        message.error(`请确认“已阅读已承诺”!`)
        return;
      }
      const commonData = {
        ...commonValues,
        // ID: title === '添加' ? addId : editId,
        ID: editId,
        month: undefined,
        DateTime: commonValues.month ? moment(commonValues.month).format("YYYY-MM-DD 00:00:00") : undefined,
        Commitment: commonValues.Commitment ? 1 : undefined,
      }
      // if (tabType == 1) { //数据一致性核查表

      type == 1 ? setSaveLoading1(true) : setSaveLoading2(true);
      form2.validateFields().then((values) => {
        form3.validateFields().then(values2 => {
          const dataList1 = addDataConsistencyData.map(item => {
            return {
              PollutantCode: item.ChildID,
              AnalyzerMin: values[`${item.par}AnalyzerRang1`],
              AnalyzerMax: values[`${item.par}AnalyzerRang2`],
              AnalyzerUnit: values[`${item.par}AnalyzerUnit`],
              DASMin: dasChecked ? values[`${item.par}DsRang1`] : undefined,
              DASMax: dasChecked ? values[`${item.par}DsRang2`] : undefined,
              DASUnit: dasChecked ? values[`${item.par}DsUnit`] : undefined,
              DataMin: numChecked ? values[`${item.par}ScyRang1`] : undefined,
              DataMax: numChecked ? values[`${item.par}ScyRang2`] : undefined,
              DataUnit: numChecked ? values[`${item.par}ScyUnit`] : undefined,
              RangeAutoStatus: values[`${item.par}RangUniformity`], //量程一致性(自动判断)
              RangeStatus: values[`${item.par}RangCheck`] && values[`${item.par}RangCheck`][0] ? values[`${item.par}RangCheck`][0] : undefined,
              RangeRemark: values[`${item.par}Remark`],
              OperationRangeRemark: values[`${item.par}OperationRangeRemark`],
              Special: item.isDisplay == 1 && isDisPlayCheck1 || item.isDisplay == 3 && isDisPlayCheck3 ? 1 : item.isDisplay == 2 && isDisPlayCheck2 || item.isDisplay == 4 && isDisPlayCheck4 ? 2 : undefined,//颗粒物有无显示屏 流速差压法和直测流速法
              DASStatus: dasChecked ? 1 : 2,
              DataRangeStatus: numChecked ? 1 : 2, //数采仪量程
              DataStatus: numRealTimeChecked ? 1 : 2, //数采仪实时数据
              AnalyzerFile: values[`${item.par}AnalyzerFilePar`],
              DASFile: values[`${item.par}DasFilePar`],
              RangeFile: values[`${item.par}RangeFilePar`],
            }
          })
          const dataList2 = addRealTimeData.map(item => {
            return {
              PollutantCode: item.ChildID,
              AnalyzerCou: values[`${item.par}IndicaVal`],
              AnalyzerCouUnit: values[`${item.par}IndicaUnit`],
              DASCou: dasChecked ? values[`${item.par}DsData`] : undefined,
              DASCouUnit: dasChecked ? values[`${item.par}DsDataUnit`] : undefined,
              DataCou: numRealTimeChecked ? values[`${item.par}ScyData`] : undefined,
              DataCouUnit: numRealTimeChecked ? values[`${item.par}ScyDataUnit`] : undefined,
              CouAutoStatus: values[`${item.par}DataUniformity`],
              CouStatus: values[`${item.par}RangCheck2`] && values[`${item.par}RangCheck2`][0] ? values[`${item.par}RangCheck2`][0] : undefined,
              CouRemrak: values[`${item.par}Remark2`],
              OperationDataRemark: values[`${item.par}OperationDataRemark`],
              CouType: item.concentrationType == '原始浓度' ? 1 : item.concentrationType == '标杆浓度' ? 2 : undefined,
            }
          })
          dataList1.map((item, index) => { // 合并颗粒物和流速的数据  量程一致性核查表 删除没勾选的 颗粒物和流速
            if (item.PollutantCode == '411' && !item.Special || item.PollutantCode == '415' && !item.Special) {
              dataList1.splice(index, 1)
            }
          })

          let dataList = [], obj1 = null, obj2 = null, obj3 = null;
          dataList1.map((item1, index1) => { //合并两个表格的数据     
            dataList2.map((item2, index2) => {
              if (item1.PollutantCode == '411' || item2.PollutantCode == '411') { //颗粒物特殊处理
                if (item1.PollutantCode == '411' && item1.Special) {
                  obj1 = item1 //颗粒物 有无显示屏
                }
                if (item2.PollutantCode == '411' && item2.CouType == 1) {
                  obj2 = item2  //颗粒物 原始浓度
                }
                if (item2.PollutantCode == '411' && item2.CouType == 2) {
                  obj3 = item2  //颗粒物 标杆浓度
                }
              } else {
                if (item1.PollutantCode == item2.PollutantCode) {
                  dataList.push({ ...item1, ...item2 })
                }
              }
            })
          })

          dataList.push(obj1, obj2, obj3)
          dataList = dataList.filter(item => item) //去除值为空的情况

          const paramDataList = addParconsistencyData.map(item => {
            const values = values2
            return {
              CheckItem: item.ChildID,
              Status: values[`${item.par}IsEnable`] && values[`${item.par}IsEnable`][0] == 1 ? 1 : 2,
              SetValue: values[`${item.par}SetVal`],
              InstrumentSetValue: values[`${item.par}InstrumentSetVal`],
              TraceabilityValue: values[`${item.par}TraceVal`],
              DataValue: values[`${item.par}DataVal`],
              AutoUniformity: values[`${item.par}Uniform`],
              Uniformity: values[`${item.par}RangCheck3`] && values[`${item.par}RangCheck3`][0] ? values[`${item.par}RangCheck3`][0] : undefined,//手工修正结果
              Remark: values[`${item.par}Remark3`],
              OperationReamrk: values[`${item.par}OperationReamrk`],
              SetFile: values[`${item.par}SettingFilePar`],
              InstrumentFile: values[`${item.par}InstrumentFilePar`],
              TraceabilityFile: values[`${item.par}TraceabilityFilePar`],
              DataFile: values[`${item.par}DataFilePar`],
              SetStatus: values[`${item.par}SetStatus`] && values[`${item.par}SetStatus`][0] == 1 ? 1 : 2,
              InstrumentStatus: values[`${item.par}InstrumentStatus`] && values[`${item.par}InstrumentStatus`][0] == 1 ? 1 : 2,
              DataStatus: values[`${item.par}DataStatus`] && values[`${item.par}DataStatus`][0] == 1 ? 1 : 2,
            }
          })
          props.addRemoteInspector({
            AddType: type,
            isCheckUser: isCheckUser,
            Data: {
              ...commonData,
              CouUpload: values.files2,
            },
            DataList: dataList,
            ParamDataList: paramDataList,
          }, (isSuccess) => {
            // title === '添加' && id && setAddId(id)
            type == 1 ? setSaveLoading1(false) : setSaveLoading2(false)
            isSuccess && onFinish(pageIndex, pageSize)
          })


        }).catch((info) => {
          console.log('Validate Failed3:', info);
        });






      }).catch((info) => {
        console.log('Validate Failed2:', info);
      });




      // } else {  //参数一致性核查
      // form3.validateFields().then(values => {
      //   const paramDataList = addParconsistencyData.map(item => {
      //     return {
      //       CheckItem: item.ChildID,
      //       Status: values[`${item.par}IsEnable`] && values[`${item.par}IsEnable`][0] == 1 ? 1 : 2,
      //       SetValue: values[`${item.par}SetVal`],
      //       InstrumentSetValue: values[`${item.par}InstrumentSetVal`],
      //       TraceabilityValue: values[`${item.par}TraceVal`],
      //       DataValue: values[`${item.par}DataVal`],
      //       AutoUniformity: values[`${item.par}Uniform`],
      //       Uniformity: values[`${item.par}RangCheck3`] && values[`${item.par}RangCheck3`][0] ? values[`${item.par}RangCheck3`][0] : undefined,//手工修正结果
      //       Remark: values[`${item.par}Remark3`],
      //       OperationReamrk: values[`${item.par}OperationReamrk`],
      //       SetFile: values[`${item.par}SettingFilePar`],
      //       InstrumentFile: values[`${item.par}InstrumentFilePar`],
      //       TraceabilityFile: values[`${item.par}TraceabilityFilePar`],
      //       DataFile: values[`${item.par}DataFilePar`],
      //       SetStatus: values[`${item.par}SetStatus`] && values[`${item.par}SetStatus`][0] == 1 ? 1 : 2,
      //       InstrumentStatus: values[`${item.par}InstrumentStatus`] && values[`${item.par}InstrumentStatus`][0] == 1 ? 1 : 2,
      //       DataStatus: values[`${item.par}DataStatus`] && values[`${item.par}DataStatus`][0] == 1 ? 1 : 2,
      //     }
      //   })
      //   props.addOrUpdParamCheck({
      //     AddType: type,
      //     Data: {
      //       ...commonData,
      //     },
      //     ParamDataList: paramDataList,
      //   }, (id) => {
      //     title === '添加' && setAddId(id)
      //     onFinish(pageIndex, pageSize)
      //     type == 1 ? setSaveLoading11(false) : setSaveLoading22(false)
      //   })
      // }).catch((info) => {
      //   console.log('Validate Failed3:', info);
      // });

      // }
      // }).catch((info) => {
      //   console.log('Validate Failed:', info);
    });





  }

  const [pointList, setPointList] = useState([])
  const [pointLoading, setPointLoading] = useState(false)
  const onValuesChange = (hangedValues, allValues) => {
    if (Object.keys(hangedValues).join() == 'EntCode') {
      if (!hangedValues.EntCode) { //清空时 不走请求
        form.setFieldsValue({ DGIMN: undefined })
        setPointList([])
        return;
      }
      setPointLoading(true)
      props.getPointByEntCode({ EntCode: hangedValues.EntCode }, (res) => {
        setPointList(res)
        setPointLoading(false)
      })
      form.setFieldsValue({ DGIMN: undefined })
    }
  }

  const unitDefault = (code, value,isImport) => {
    form2.setFieldsValue({
      [`${code}AnalyzerUnit`]: value,
      [`${code}DsUnit`]: value,
      [`${code}ScyUnit`]: value,
    })
    !isImport&&form2.setFieldsValue({ //导入数据 实时数据不需要格式化单位
      [`${code}IndicaUnit`]: value,
      [`${code}DsDataUnit`]: value,
      [`${code}ScyDataUnit`]: value,
    })
  }
  const echoUnit = (data,isImport) => { //格式化
    data.map(item => {
      const code = item.par;
      if (item.Name == '流速' && item.isDisplay == 4) {
        const value = item.Col1.split(',')[2];
        unitDefault(code, value,isImport)
      }

      if (item.Col1.search(",") == -1) { //单位只有一个的情况
        const value = item.Col1;
        unitDefault(code, value,isImport)
      }

    })

  }


  const [pointList2, setPointList2] = useState([])
  const [pointLoading2, setPointLoading2] = useState(false)
  const onValuesChange2 = (hangedValues, allValues) => { //添加 编辑
    if (Object.keys(hangedValues).join() == 'EntCode') {
      if (!hangedValues.EntCode) {//清空时 
        setPointList2([])
        commonForm.setFieldsValue({ DGIMN: undefined })
        return;
      }
      setPointLoading2(true)
      props.getPointByEntCode({ EntCode: hangedValues.EntCode }, (res) => {
        setPointList2(res)
        setPointLoading2(false)
      })
      commonForm.setFieldsValue({ DGIMN: undefined })

    }
    if (Object.keys(hangedValues).join() == 'DGIMN' && hangedValues.DGIMN) { //切换监测点
      getPointConsistencyParamFun(hangedValues.DGIMN, (pollutantList, paramList) => {
        pollutantList.map(item => {
          echoForamtData(item.par, [], [])
        })
        setIsDisPlayCheck1(false)
        setIsDisPlayCheck2(false)
        setIsDisPlayCheck3(false)
        setIsDisPlayCheck4(false)
        // setDasChecked(false)
        // setNumChecked(false)
        // setNumRealTimeChecked(false)
        paramList.map(item => {
          echoFilePar(item.ChildID, item)
        })
      }, '添加')
      //     if(title=='添加' && !addId){
      //       getPointConsistencyParamFun(hangedValues.DGIMN,()=>{
      //       },'添加')
      //     }else{
      //     props.getConsistencyCheckInfo({ ID: title=='添加' ? addId : editId }, (data) => {
      //       dgimnEchoDataFun(hangedValues.DGIMN,data,title)
      //     })
      //  }
    }
  }


  const [pageSize, setPageSize] = useState(20)
  const [pageIndex, setPageIndex] = useState(1)

  const handleTableChange = (PageIndex, PageSize) => { //分页 打卡异常 响应超时 弹框
    setPageIndex(PageIndex)
    setPageSize(PageSize)
    onFinish(PageIndex, PageSize)
  }
  const echoFilePar = (code, item,isImport ) => {
    form3.setFieldsValue({
      [`${code}IsEnable`]: item.Status ? [item.Status] : [],
      [`${code}SetVal`]: item.SetValue,
      [`${code}InstrumentSetVal`]: item.InstrumentSetValue,
      [`${code}TraceVal`]: item.TraceabilityValue,
      [`${code}DataVal`]: item.DataValue,
      [`${code}Uniform`]: item.AutoUniformity,
      [`${code}RangCheck3`]: isImport? form3.getFieldValue(`${code}RangCheck3`): item.Uniformity ? [item.Uniformity] : [],//手工修正结果
      [`${code}Remark3`]:  isImport? form3.getFieldValue(`${code}Remark3`): item.Remark,
      [`${code}OperationReamrk`]: item.OperationReramk,
      [`${code}SettingFilePar`]: item.SetFileList?.[0] && item.SetFileList?.[0].FileUuid,
      [`${code}InstrumentFilePar`]: item.InstrumentFileList?.[0] && item.InstrumentFileList?.[0].FileUuid,
      [`${code}TraceabilityFilePar`]: item.TraceabilityFileList?.[0] && item.TraceabilityFileList?.[0].FileUuid,
      [`${code}DataFilePar`]: item.DataFileList?.[0] && item.DataFileList?.[0].FileUuid,
      [`${code}SetStatus`]: item.SetStatus ? [item.SetStatus] : [],
      [`${code}InstrumentStatus`]: item.InstrumentStatus ? [item.InstrumentStatus] : [],
      [`${code}DataStatus`]: item.DataStatus ? [item.DataStatus] : [],
    })
  }
  const echoParFun = (data,isImport) => { //格式化 编辑回显     参数一致性核查表
    /***参数一致性核查表***/
    let settingUploadList = {}, settingUploadFilesListObj = {};
    let instrumentUploadList = {}, instrumentUploadFilesListObj = {};
    let traceabilityUploadList = {}, traceabilityUploadFilesListObj = {};
    let dataUploadList = {}, dataUploadFilesListObj = {};
    data.map(item => {
      const code = item.CheckItem ? item.CheckItem : item.ChildID;
      echoFilePar(code, item,isImport)
      const echoFileList = (uploadList, uploadListPar, uploadFilesListObj, filePar) => {
        let parFileList = [];
        uploadList?.length && uploadList.map(uploadItem => {
          if (!uploadItem.IsDelete) {
            parFileList.push({
              uid: uploadItem.GUID,
              name: uploadItem.FileName,
              status: 'done',
              url: `\\upload\\${uploadItem.FileName}`,
            })
          }
        })
        uploadListPar[`${code}${filePar}`] = parFileList;
        uploadFilesListObj[`${code}${filePar}`] = uploadList?.[0]?.FileUuid ? uploadList[0].FileUuid : cuid();
      }
      echoFileList(item.SetFileList, settingUploadList, settingUploadFilesListObj, 'SettingFilePar') //仪表设定值照片	
      echoFileList(item.InstrumentFileList, instrumentUploadList, instrumentUploadFilesListObj, 'InstrumentFilePar') //DAS设定值照片	
      echoFileList(item.TraceabilityFileList, traceabilityUploadList, traceabilityUploadFilesListObj, 'TraceabilityFilePar') //溯源值照片	
      echoFileList(item.DataFileList, dataUploadList, dataUploadFilesListObj, 'DataFilePar') //数采仪设定值照片	
      item.Uniformity && onManualChange([item.Uniformity], item, `${code}RangCheck3`, 3) //编辑 手工修正结果 参数一致性核查
    })
    setSettingFileList({ ...settingUploadList })
    setSettingFileCuidList({ ...settingUploadFilesListObj })

    setInstrumentFileList({ ...instrumentUploadList })
    setInstrumentFileCuidList({ ...instrumentUploadFilesListObj })

    setTraceabilityFileList({ ...traceabilityUploadList })
    setTraceabilityFileCuidList({ ...traceabilityUploadFilesListObj })

    setDataFileList({ ...dataUploadList })
    setDataFileCuidList({ ...dataUploadFilesListObj })
  }
  // const tabsChange = (key) => {
  //   setTabType(key)
  //   if (key == 2 && title == '编辑') {
  //     consistencyCheckDetail?.consistentParametersCheckList?.[0] && echoParFun(consistencyCheckDetail.consistentParametersCheckList)
  //   }
  // }
  const { entLoading } = props;
  const [dasChecked, setDasChecked] = useState(true)
  const onDasChange = (e) => { //DAS量程
    setDasChecked(e.target.checked)
  }

  const [numChecked, setNumChecked] = useState(true)
  const onNumChange = (e) => { //数采仪量程
    setNumChecked(e.target.checked)
  }
  const [numRealTimeChecked, setNumRealTimeChecked] = useState(true)
  const onNumRealTimeChange = (e) => { //数采仪实时数据
    setNumRealTimeChecked(e.target.checked)
  }
  const [fileType, setFileType] = useState(1)

  // const [filesCuid1, setFilesCuid1] = useState(cuid())
  const [filesCuid2, setFilesCuid2] = useState(cuid())

  // const [fileList1, setFileList1] = useState([])
  const [fileList2, setFileList2] = useState([])


  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewTitle, setPreviewTitle] = useState()
  const [previewImage, setPreviewImage] = useState()
  const [photoIndex, setPhotoIndex] = useState(0); //预览附件Index
  const [imgUrlList, setImgUrlList] = useState([]);//预览附件列表

  // const filesCuid3 = () => {
  //   for (var key in filesCuidList) {
  //     if (key == filePar) {
  //       return filesCuidList[key]
  //     }
  //   }
  // }
  const filesCuidFun = (filesCuidList, filePar) => {
    for (var key in filesCuidList) {
      if (key == filePar) {
        return filesCuidList[key]
      }
    }
  }
  const uploadProps = { //附件上传 
    action: '/api/rest/PollutantSourceApi/UploadApi/PostFiles',
    accept: 'image/*',
    showUploadList: { showPreviewIcon: true, showRemoveIcon: !isCheckUser },
    data: {
      // FileUuid: fileType == 1 ? filesCuid1 : fileType == 2 ? filesCuid2 : filesCuid3(),
      FileUuid: function () {
        switch (fileType) {
          case 2: return filesCuid2;
          case 'analyzerFile': return filesCuidFun(analyzerFileCuidList, analyzerFilePar);
          case 'dasFile': return filesCuidFun(dasFileCuidList, dasFilePar);
          case 'rangeFile': return filesCuidFun(rangeFileCuidList, rangeFilePar);
          case 'settingFile': return filesCuidFun(settingFileCuidList, settingFilePar);
          case 'instrumentFile': return filesCuidFun(instrumentFileCuidList, instrumentFilePar);
          case 'traceabilityFile': return filesCuidFun(traceabilityFileCuidList, traceabilityFilePar);
          case 'dataFile': return filesCuidFun(dataFileCuidList, dataFilePar);
        }
      }(),
      FileActualType: '0',
    },
    listType: "picture-card",
    beforeUpload: (file) => {
      const fileType = file?.type; //获取文件类型 type  image/*
      if (!(/^image/g.test(fileType))) {
        message.error(`请上传图片格式文件!`);
        return false;
      }
    },
    onChange(info) {
      const fileList = [];
      info.fileList.map(item => {
        if (item.response && item.response.IsSuccess) { //刚上传的
          fileList.push({ ...item, url: `/upload/${item.response.Datas}`, })
        } else if (!item.response) {
          fileList.push({ ...item })
        }
      })
      if (info.file.status === 'uploading') {
        switch (fileType) {
          case 2: setFileList2(fileList); break;
          case 'analyzerFile': setAnalyzerFileList({ ...analyzerFileList, [analyzerFilePar]: fileList }); break;
          case 'dasFile': setDasFileList({ ...dasFileList, [dasFilePar]: fileList }); break;
          case 'rangeFile': setRangeFileList({ ...rangeFileList, [rangeFilePar]: fileList }); break;
          case 'settingFile': setSettingFileList({ ...settingFileList, [settingFilePar]: fileList }); break;
          case 'instrumentFile': setInstrumentFileList({ ...instrumentFileList, [instrumentFilePar]: fileList }); break;
          case 'traceabilityFile': setTraceabilityFileList({ ...traceabilityFileList, [traceabilityFilePar]: fileList }); break;
          case 'dataFile': setDataFileList({ ...dataFileList, [dataFilePar]: fileList }); break;

        }
      }

      if (info.file.status === 'done' || info.file.status === 'removed' || info.file.status === 'error') {
        switch (fileType) {
          case 2: setFileList2(fileList); form2.setFieldsValue({ files2: fileList && fileList[0] ? filesCuid2 : undefined }); break;
          case 'analyzerFile': setAnalyzerFileList({ ...analyzerFileList, [analyzerFilePar]: fileList }); form2.setFieldsValue({ [analyzerFilePar]: filesCuidFun(analyzerFileCuidList, analyzerFilePar) }); break;
          case 'dasFile': setDasFileList({ ...dasFileList, [dasFilePar]: fileList }); form2.setFieldsValue({ [dasFilePar]: filesCuidFun(dasFileCuidList, dasFilePar) }); break;
          case 'rangeFile': setRangeFileList({ ...rangeFileList, [rangeFilePar]: fileList }); form2.setFieldsValue({ [rangeFilePar]: filesCuidFun(rangeFileCuidList, rangeFilePar) }); break;
          case 'settingFile': setSettingFileList({ ...settingFileList, [settingFilePar]: fileList }); form3.setFieldsValue({ [settingFilePar]: filesCuidFun(settingFileCuidList, settingFilePar) }); break;
          case 'instrumentFile': setInstrumentFileList({ ...instrumentFileList, [instrumentFilePar]: fileList }); form3.setFieldsValue({ [instrumentFilePar]: filesCuidFun(instrumentFileCuidList, instrumentFilePar) }); break;
          case 'traceabilityFile': setTraceabilityFileList({ ...traceabilityFileList, [traceabilityFilePar]: fileList }); form3.setFieldsValue({ [traceabilityFilePar]: filesCuidFun(traceabilityFileCuidList, traceabilityFilePar) }); break;
          case 'dataFile': setDataFileList({ ...dataFileList, [dataFilePar]: fileList }); form3.setFieldsValue({ [dataFilePar]: filesCuidFun(dataFileCuidList, dataFilePar) }); break;

        }
        info.file.status === 'done' && message.success('上传成功！')
        info.file.status === 'error' && message.error(`${info.file.name}${info.file && info.file.response && info.file.response.Message ? info.file.response.Message : '上传失败'}`);

      }
    },
    onRemove: (file) => {
      if (!file.error) {
        props.deleteAttach(file)
      }

    },
    onPreview: async file => { //预览
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      let imageList = []
      switch (fileType) {
        case 2: imageList = fileList2; break;
        case 'analyzerFile': imageList = analyzerFileList[analyzerFilePar]; break;
        case 'dasFile': imageList = dasFileList[dasFilePar]; break;
        case 'rangeFile': imageList = rangeFileList[rangeFilePar]; break;
        case 'settingFile': imageList = settingFileList[settingFilePar]; break;
        case 'instrumentFile': imageList = instrumentFileList[instrumentFilePar]; break;
        case 'traceabilityFile': imageList = traceabilityFileList[traceabilityFilePar]; break;
        case 'dataFile': imageList = dataFileList[dataFilePar]; break;

      }
      let imageListIndex = 0;
      imageList.map((item, index) => {
        if (item.uid === file.uid) {
          imageListIndex = index;
        }
      });
      if (imageList && imageList[0]) {
        //拼接放大的图片地址列表
        const imgData = [];
        imageList.map((item, key) => {
          imgData.push(item.url)
        })
        setImgUrlList(imgData)
      }
      setPhotoIndex(imageListIndex)
      setPreviewVisible(true)
      setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
    },
    fileList: function () {
      switch (fileType) {
        case 2: return fileList2;
        case 'analyzerFile': return analyzerFileList[analyzerFilePar];
        case 'dasFile': return dasFileList[dasFilePar];
        case 'rangeFile': return rangeFileList[rangeFilePar];
        case 'settingFile': return settingFileList[settingFilePar];
        case 'instrumentFile': return instrumentFileList[instrumentFilePar];
        case 'traceabilityFile': return traceabilityFileList[traceabilityFilePar];
        case 'dataFile': return dataFileList[dataFilePar];

      }
    }()
  };
  const [selectManualVal, setSelectManualVal] = useState({})
  const [manualOptions, setManualOptions] = useState([
    { label: '是', value: 1 },
    { label: '否', value: 2 },
    { label: '不适用', value: 3 },
    { label: '不规范', value: 4 },
  ])
  const onManualChange = (val, row, name, type) => { //手工修正结果

    if (!val) { return }
    const ele = document.getElementById(`advanced_search_${name}`)
    if (!ele) { return }
    for (var i = 0; i < ele.childNodes.length; i++) {
      if (val.toString() != i + 1) {
        ele.childNodes && ele.childNodes[i] && ele.childNodes[i].getElementsByTagName('input')[0].setAttribute("disabled", true)
      }
      if (!val[0]) { //点击取消复选框
        ele.childNodes && ele.childNodes[i] && ele.childNodes[i].getElementsByTagName('input')[0].removeAttribute("disabled")
      }
    }

    // switch (type) {
    //   case 1: // 量程一致性核查表
    //     if (val[0] == 3) { //不适用 量程 可不填
    //       setRangReq({ ...rangReq, [`${row.par}RangFlag`]: false })
    //       setRemark({ ...remark, [`${row.par}RemarkFlag`]: true })
    //     } else {
    //       setRangReq({ ...rangReq, [`${row.par}RangFlag`]: true })
    //       setRemark({ ...remark, [`${row.par}RemarkFlag`]: false })
    //     }
    //     break;
    //   case 2: // 实时数据一致性核查表
    //     if (val[0] == 3) { //不适用 示值 可不填
    //       setIndicaValReq({ ...indicaValReq, [`${row.par}IndicaValFlag`]: false })
    //       setRemark2({ ...remark2, [`${row.par}Remark2Flag`]: true })
    //     } else {
    //       setIndicaValReq({ ...indicaValReq, [`${row.par}IndicaValFlag`]: true })
    //       setRemark2({ ...remark2, [`${row.par}Remark2Flag`]: false })
    //     }


    //   case 3: // 参数一致性核查表
    //     if (val[0] == 3) {
    //       setTraceValReq({ ...traceValReq, [`${row.par}TraceValFlag`]: false })
    //       setRemark3({ ...remark3, [`${row.par}Remark3Flag`]: true })
    //     } else {
    //       setTraceValReq({ ...traceValReq, [`${row.par}TraceValFlag`]: true })
    //       setRemark3({ ...remark3, [`${row.par}Remark3Flag`]: false })
    //     }
    // }

  }

  let NO, NO2; //获取NOx的值

  const isJudge = (row, type) => {

    let analyzerRang1, analyzerRang2, analyzerUnit, analyzerFlag;

    switch (type) {
      case 1: // 量程一致性核查表 自动判断
        analyzerRang1 = form2.getFieldValue(`${row.par}AnalyzerRang1`), analyzerRang2 = form2.getFieldValue(`${row.par}AnalyzerRang2`), analyzerUnit = form2.getFieldValue(`${row.par}AnalyzerUnit`);
        analyzerFlag = (analyzerRang1 || analyzerRang1 == 0) && (analyzerRang2 || analyzerRang2 == 0) && analyzerUnit || row.Name == 'NOx' || row.Name == '标干流量' ? true : false;
        let dsRang1 = form2.getFieldValue(`${row.par}DsRang1`), dsRang2 = form2.getFieldValue(`${row.par}DsRang2`), dsUnit = form2.getFieldValue(`${row.par}DsUnit`);
        let scyRang1 = form2.getFieldValue(`${row.par}ScyRang1`), scyRang2 = form2.getFieldValue(`${row.par}ScyRang2`), scyUnit = form2.getFieldValue(`${row.par}ScyUnit`);

        let dsRangFlag = (dsRang1 || dsRang1 == 0) && (dsRang2 || dsRang2 == 0) && dsUnit ? true : false;
        let scyRangFlag = (scyRang1 || scyRang1 == 0) && (scyRang2 || scyRang2 == 0) && scyUnit ? true : false;
        const judgeConsistencyRangeCheckFun = (par) => {
          props.judgeConsistencyRangeCheck({
            PollutantCode: row.ChildID,
            Special: row.isDisplay == 1 || row.isDisplay == 3 ? 1 : row.isDisplay == 2 || row.isDisplay == 4 ? 2 : undefined,
            DASStatus: dasChecked ? 1 : 2,
            DataRangeStatus: numChecked ? 1 : 2,
            DataStatus: numRealTimeChecked ? 1 : 2,
            ...par
          }, (data) => {
            form2.setFieldsValue({ [`${row.par}RangUniformity`]: data })
          })
        }
        if (analyzerFlag && dsRangFlag && !(scyRang1 || scyRang1 == 0) && !(scyRang2 || scyRang2 == 0)) { //只判断分析仪和DAS量程填完的状态
          judgeConsistencyRangeCheckFun({
            AnalyzerMin: analyzerRang1, AnalyzerMax: analyzerRang2, AnalyzerUnit: analyzerUnit,
            DASMin: dsRang1, DASMax: dsRang2, DASUnit: dsUnit,
          })
        } else if (analyzerFlag && scyRangFlag && !(dsRang1 || dsRang1 == 0) && !(dsRang2 || dsRang2 == 0)) { //只判断分析仪和数采仪量程填完的状态
          judgeConsistencyRangeCheckFun({
            AnalyzerMin: analyzerRang1, AnalyzerMax: analyzerRang2, AnalyzerUnit: analyzerUnit,
            DataMin: scyRang1, DataMax: scyRang2, DataUnit: scyUnit,
          })
        } else if (dsRangFlag && scyRangFlag && !(analyzerRang1 || analyzerRang1 == 0) && !(analyzerRang2 || analyzerRang2 == 0)) { //只判断DAS量程和数采仪量程填完的状态
          judgeConsistencyRangeCheckFun({
            DASMin: dsRang1, DASMax: dsRang2, DASUnit: dsUnit,
            DataMin: scyRang1, DataMax: scyRang2, DataUnit: scyUnit,
          })
        } else if (analyzerFlag && dsRangFlag && scyRangFlag) { //三项都填完的判断
          judgeConsistencyRangeCheckFun({
            AnalyzerMin: analyzerRang1, AnalyzerMax: analyzerRang2, AnalyzerUnit: analyzerUnit,
            DASMin: dsRang1, DASMax: dsRang2, DASUnit: dsUnit,
            DataMin: scyRang1, DataMax: scyRang2, DataUnit: scyUnit,
          })
        } else {
          form2.setFieldsValue({ [`${row.par}RangUniformity`]: undefined })
        }

        break;
      case 2: // 实时数据一致性核查表 自动判断
        if (row.Name == '颗粒物') {
          // isDisPlayCheck2 无显示屏  isDisPlayCheck4   直测流速法
          analyzerRang1 = isDisPlayCheck2 ? form2.getFieldValue(`${row.ChildID}aAnalyzerRang1`) : isDisPlayCheck1 ? form2.getFieldValue(`${row.ChildID}AnalyzerRang1`) : undefined;
          analyzerRang2 = isDisPlayCheck2 ? form2.getFieldValue(`${row.ChildID}aAnalyzerRang2`) : isDisPlayCheck1 ? form2.getFieldValue(`${row.ChildID}AnalyzerRang2`) : undefined;
          analyzerUnit = isDisPlayCheck2 ? form2.getFieldValue(`${row.ChildID}aAnalyzerUnit`) : isDisPlayCheck1 ? form2.getFieldValue(`${row.ChildID}AnalyzerUnit`) : undefined;

        } else if (row.Name == '流速') {
          analyzerRang1 = isDisPlayCheck4 ? form2.getFieldValue(`${row.ChildID}bAnalyzerRang1`) : isDisPlayCheck3 ? form2.getFieldValue(`${row.ChildID}AnalyzerRang1`) : undefined;
          analyzerRang2 = isDisPlayCheck4 ? form2.getFieldValue(`${row.ChildID}bAnalyzerRang2`) : isDisPlayCheck3 ? form2.getFieldValue(`${row.ChildID}AnalyzerRang2`) : undefined;
          analyzerUnit = isDisPlayCheck4 ? form2.getFieldValue(`${row.ChildID}bAnalyzerUnit`) : isDisPlayCheck3 ? form2.getFieldValue(`${row.ChildID}AnalyzerUnit`) : undefined;

        } else if (row.Name == 'NOx') {
          analyzerRang1 = form2.getFieldValue(`400AnalyzerRang1`);
          analyzerRang2 = form2.getFieldValue(`400AnalyzerRang2`);
          analyzerUnit = form2.getFieldValue(`400AnalyzerUnit`);
        } else {
          analyzerRang1 = form2.getFieldValue(`${row.ChildID}AnalyzerRang1`),
            analyzerRang2 = form2.getFieldValue(`${row.ChildID}AnalyzerRang2`),
            analyzerUnit = form2.getFieldValue(`${row.ChildID}AnalyzerUnit`);
        }


        // analyzerFlag = (analyzerRang1 || analyzerRang1 == 0) && (analyzerRang2 || analyzerRang2 == 0) && analyzerUnit || row.Name == '流速' || row.Name == '标干流量' || row.Name == 'NO' || row.Name == 'NO2' ? true : false;

        const indicaVal = (row.Name == 'NO' && !form2.getFieldValue(`${row.par}IndicaVal`)) || (row.Name == 'NO2' && !form2.getFieldValue(`${row.par}IndicaVal`)) ? '0' : form2.getFieldValue(`${row.par}IndicaVal`), indicaUnit = form2.getFieldValue(`${row.par}IndicaUnit`);
        const dsData = form2.getFieldValue(`${row.par}DsData`), dsDataUnit = form2.getFieldValue(`${row.par}DsDataUnit`);
        const scyData = form2.getFieldValue(`${row.par}ScyData`), scyDataUnit = form2.getFieldValue(`${row.par}ScyDataUnit`);

        const indicaValFlag = (indicaVal || indicaVal == 0) && indicaUnit || row.concentrationType == '标杆浓度' || row.Name == '流速' || row.Name == 'NOx' || row.Name == '标干流量' || row.Name == '温度' || row.Name == '压力' || row.Name == '湿度' ? true : false;
        const dsDataFlag = (dsData || dsData == 0) && dsDataUnit ? true : false; //只判断DAS示值填完的状态
        const scyDataFlag = (scyData || scyData == 0) && scyDataUnit ? true : false;
        const judgeConsistencyCouCheckFun = (par) => {
          props.judgeConsistencyCouCheck({
            PollutantCode: row.ChildID,
            Special: isDisPlayCheck1 || isDisPlayCheck3 ? 1 : isDisPlayCheck2 || isDisPlayCheck4 ? 2 : undefined,//颗粒物有无显示屏 流速差压法和直测流速法
            CouType: row.concentrationType === '原始浓度' ? 1 : row.concentrationType === '标杆浓度' ? 2 : undefined,
            // AnalyzerMin: analyzerRang1, AnalyzerMax: analyzerRang2, AnalyzerUnit: analyzerUnit,
            DASStatus: dasChecked ? 1 : 2,
            DataRangeStatus: numChecked ? 1 : 2,
            DataStatus: numRealTimeChecked ? 1 : 2,
            ...par,
          }, (data) => {
            form2.setFieldsValue({ [`${row.par}DataUniformity`]: data })
          })
        }

        if (indicaValFlag && dsDataFlag && !(scyData || scyData == 0)) { //只判断分析仪示值和DAS示值
          judgeConsistencyCouCheckFun({
            AnalyzerCou: indicaVal, AnalyzerCouUnit: indicaUnit,
            DASCou: dsData, DASCouUnit: dsDataUnit,
          })
        } else if (indicaValFlag && scyDataFlag && !(dsData || dsData == 0)) { //只判断分析仪示值和数采仪
          judgeConsistencyCouCheckFun({
            AnalyzerCou: indicaVal, AnalyzerCouUnit: indicaUnit,
            DataCou: scyData, DataCouUnit: scyDataUnit,
          })
        } else if (dsDataFlag && scyDataFlag && !(indicaVal || indicaVal == 0)) { //只判断DAS示值和数采仪
          judgeConsistencyCouCheckFun({
            DASCou: dsData, DASCouUnit: dsDataUnit,
            DataCou: scyData, DataCouUnit: scyDataUnit,
          })
        } else if (indicaValFlag && dsDataFlag && scyDataFlag) { //三项都填完的判断
          judgeConsistencyCouCheckFun({
            AnalyzerCou: indicaVal, AnalyzerCouUnit: indicaUnit,
            DASCou: dsData, DASCouUnit: dsDataUnit,
            DataCou: scyData, DataCouUnit: scyDataUnit,
          })
        } else {
          form2.setFieldsValue({ [`${row.par}DataUniformity`]: undefined })
        }

        if (row.Name === 'NO') {
          NO = form2.getFieldValue(`${row.par}IndicaVal`);
        }
        if (row.Name === 'NO2') {
          NO2 = form2.getFieldValue(`${row.par}IndicaVal`);
        }
        if (NO && NO2) {  //获取NOx数采仪实时数据
          props.getNoxValue({ NO: NO, NO2: NO2 }, (data) => {
            form2.setFieldsValue({ [`402ScyData`]: data })
          })
        }
        break;
      case 3: // 参数一致性核查表 自动判断
        const setVal = form3.getFieldValue(`${row.par}SetVal`),
          instrumentSetVal = form3.getFieldValue(`${row.par}InstrumentSetVal`),
          dataVal = form3.getFieldValue(`${row.par}DataVal`),
          traceVal = form3.getFieldValue(`${row.par}TraceVal`),
          setStatusVal = form3.getFieldValue(`${row.par}SetStatus`),
          instrumentStatusVal = form3.getFieldValue(`${row.par}InstrumentStatus`),
          dataStatusVal = form3.getFieldValue(`${row.par}DataStatus`);
        if (traceVal || traceVal == 0) {
          if ((setStatusVal?.[0] == 1 || instrumentStatusVal?.[0] == 1 || dataStatusVal?.[0] == 1) && ((setVal || setVal == 0) || (instrumentSetVal || instrumentSetVal == 0) || (dataVal || dataVal == 0))) {
            props.judgeParamCheck({
              PollutantCode: row.ChildID,
              SetValue: setVal, InstrumentSetValue: instrumentSetVal, DataValue: dataVal,
              TraceabilityValue: traceVal,
              SetStatus: setStatusVal?.length && setStatusVal[0],
              InstrumentStatus: instrumentStatusVal?.length && instrumentStatusVal[0],
              DataStatus: dataStatusVal?.length && dataStatusVal[0],
            }, (data) => {
              form3.setFieldsValue({ [`${row.par}Uniform`]: data })
            })
          } else {
            form3.setFieldsValue({ [`${row.par}Uniform`]: undefined })
          }
        } else {
          form3.setFieldsValue({ [`${row.par}Uniform`]: undefined })
        }
        // if ((setVal || setVal == 0) && (traceVal || traceVal == 0) && (setStatusVal && setStatusVal[0] && setStatusVal[0] == 1)) {
        //   if (setVal == traceVal) {
        //     form3.setFieldsValue({ [`${row.par}Uniform`]: 1 })
        //   } else {
        //     form3.setFieldsValue({ [`${row.par}Uniform`]: 2 })
        //   }
        // } else if ((!setVal) && (!traceVal)) {
        //   form3.setFieldsValue({ [`${row.par}Uniform`]: undefined })
        // }

        break;
    }
  }
  //颗粒物 有无显示屏
  const [isDisPlayCheck1, setIsDisPlayCheck1] = useState(false)
  const [isDisPlayCheck2, setIsDisPlayCheck2] = useState(false)
  const isDisplayChange = (e, name, firstDefault) => {

    // const displayEle1 = document.getElementById(`advanced_search_isDisplay1`);
    // const displayEle2 = document.getElementById(`advanced_search_isDisplay2`);
    if (name === 'isDisplay1') {
      setIsDisPlayCheck1(e.target.checked)
      setIsDisPlayCheck2(false)
      // displayEle2 && displayEle2.setAttribute("disabled", true)
    }
    if (name === 'isDisplay2') {
      setIsDisPlayCheck2(e.target.checked)
      setIsDisPlayCheck1(false)
      // displayEle1 && displayEle1.setAttribute("disabled", true)
    }
    const code = name === 'isDisplay2' ? '411' : '411a'
    form2.setFieldsValue({
      [`${code}AnalyzerRang1`]: undefined,
      [`${code}AnalyzerRang2`]: undefined,
      [`${code}DsRang1`]: undefined,
      [`${code}DsRang2`]: undefined,
      [`${code}ScyRang1`]: undefined,
      [`${code}ScyRang2`]: undefined,
      [`${code}RangUniformity`]: undefined,
      [`${code}RangCheck`]: [],
      [`${code}Remark`]: undefined,
      [`${code}OperationRangeRemark`]: undefined,
      [`${code}AnalyzerFilePar`]: undefined,
      [`${code}DasFilePar`]: undefined,
      [`${code}RangeFilePar`]: undefined,
    })
    if (!firstDefault && addDataConsistencyData && addDataConsistencyData[0]) { //切换 附件id 需要重新赋值
      const pars = '411'
      setAnalyzerFileCuidList({ ...analyzerFileCuidList, [`${pars}aAnalyzerFilePar`]: cuid(), [`${pars}AnalyzerFilePar`]: cuid() })
      setAnalyzerFileList({ ...analyzerFileList, [`${pars}aAnalyzerFilePar`]: [], [`${pars}AnalyzerFilePar`]: [] })
      setDasFileCuidList({ ...dasFileCuidList, [`${pars}aDasFilePar`]: cuid(), [`${pars}DasFilePar`]: cuid() })
      setDasFileList({ ...dasFileList, [`${pars}aDasFilePar`]: [], [`${pars}DasFilePar`]: [] })
      setRangeFileCuidList({ ...rangeFileCuidList, [`${pars}aRangeFilePar`]: cuid(), [`${pars}RangeFilePar`]: cuid() })
      setRangeFileList({ ...rangeFileList, [`${pars}aRangeFilePar`]: [], [`${pars}RangeFilePar`]: [] })
    }
    // if (!e.target.checked) { //取消选中状态
    //   setIsDisPlayCheck1(e.target.checked)
    //   setIsDisPlayCheck2(e.target.checked)
    //   displayEle1 && displayEle1.removeAttribute("disabled")
    //   displayEle2 && displayEle2.removeAttribute("disabled")
    // }
  }

  //流速 
  const [isDisPlayCheck3, setIsDisPlayCheck3] = useState(false)
  const [isDisPlayCheck4, setIsDisPlayCheck4] = useState(false)
  const isDisplayChange2 = (e, name, firstDefault) => {
    // const displayEle3 = document.getElementById(`advanced_search_isDisplay3`);
    // const displayEle4 = document.getElementById(`advanced_search_isDisplay4`);
    if (name === 'isDisplay3') {
      setIsDisPlayCheck3(e.target.checked)
      setIsDisPlayCheck4(false)
      // displayEle4 && displayEle4.setAttribute("disabled", true)
    }
    if (name === 'isDisplay4') {
      setIsDisPlayCheck4(e.target.checked)
      setIsDisPlayCheck3(false)
      // displayEle3 && displayEle3.setAttribute("disabled", true)
    }
    const code = name === 'isDisplay4' ? '415' : '415b'
    form2.setFieldsValue({
      [`${code}AnalyzerRang1`]: undefined,
      [`${code}AnalyzerRang2`]: undefined,
      [`${code}DsRang1`]: undefined,
      [`${code}DsRang2`]: undefined,
      [`${code}ScyRang1`]: undefined,
      [`${code}ScyRang2`]: undefined,
      [`${code}RangUniformity`]: undefined,
      [`${code}RangCheck`]: [],
      [`${code}Remark`]: undefined,
      [`${code}OperationRangeRemark`]: undefined,
      [`${code}AnalyzerFilePar`]: undefined,
      [`${code}DasFilePar`]: undefined,
      [`${code}RangeFilePar`]: undefined,
    })
    if (!firstDefault && addParconsistencyData && addParconsistencyData[0]) {
      const pars = '415'
      setAnalyzerFileCuidList({ ...analyzerFileCuidList, [`${pars}bAnalyzerFilePar`]: cuid(), [`${pars}AnalyzerFilePar`]: cuid() })
      setAnalyzerFileList({ ...analyzerFileList, [`${pars}bAnalyzerFilePar`]: [], [`${pars}AnalyzerFilePar`]: [] })
      setDasFileCuidList({ ...dasFileCuidList, [`${pars}bDasFilePar`]: cuid(), [`${pars}DasFilePar`]: cuid() })
      setDasFileList({ ...dasFileList, [`${pars}bDasFilePar`]: [], [`${pars}DasFilePar`]: [] })
      setRangeFileCuidList({ ...rangeFileCuidList, [`${pars}bRangeFilePar`]: cuid(), [`${pars}RangeFilePar`]: cuid() })
      setRangeFileList({ ...rangeFileList, [`${pars}bRangeFilePar`]: [], [`${pars}RangeFilePar`]: [] })
    }
    // if (!e.target.checked) { //取消选中状态
    //   setIsDisPlayCheck3(e.target.checked )
    //   setIsDisPlayCheck4(e.target.checked)
    //   displayEle3.removeAttribute("disabled")
    //   displayEle4.removeAttribute("disabled")
    // }
  }

  const unitFormat = (record) => {
    return record.Col1 && record.Col1.split(',').map((item, index) => {
      if (record.Name == '流速' && record.isDisplay == 3) { //差压法
        if (index <= 1) { //只取前两个
          return <Option value={item}>{item}</Option>
        }
      } else if (record.Name == '流速' && (record.isDisplay == 4 || !record.isDisplay)) { //直测流速法 或 实时数据一致性核查表 
        if (index > 1) { //只取最后一个
          return <Option value={item}>{item}</Option>
        }
      } else {
        return <Option value={item}>{item}</Option>
      }
    })
  }

  const columns2 = [
    {
      title: '序号',
      align: 'center',
      fixed: 'left',
      render: (text, record, index) => {
        return index + 1;
      }
    },
    {
      title: '监测参数',
      dataIndex: 'Name',
      key: 'Name',
      align: 'center',
      fixed: 'left',
      width: 100,
      render: (text, record, index) => {
        const obj = {
          children: text,
          props: {},
        };
        if (text == '颗粒物' && record.isDisplay == 1 || text == '流速' && record.isDisplay == 3) {
          obj.props.rowSpan = 2;
        }
        if (text == '颗粒物' && record.isDisplay == 2 || text == '流速' && record.isDisplay == 4) {
          obj.props.rowSpan = 0;
        }
        return obj;
      }
    },
    {
      title: '量程一致性核查表',
      children: [
        {
          title: '有无显示屏',
          align: 'center',
          dataIndex: 'isDisplay',
          key: 'isDisplay',
          width: 145,
          render: (text, record) => {
            switch (text) {
              case 1:
                return <Row align='middle' justify='center'>
                  <Form.Item name='isDisplay1'>
                    <Checkbox disabled={isCheckUser} checked={isDisPlayCheck1} onChange={(e) => { isDisplayChange(e, 'isDisplay1') }}>有显示屏</Checkbox>
                  </Form.Item></Row>
                break;
              case 2:
                return <Row align='middle' justify='center'>
                  <Form.Item name='isDisplay2'>
                    <Checkbox disabled={isCheckUser} checked={isDisPlayCheck2} onChange={(e) => { isDisplayChange(e, 'isDisplay2') }}>无显示屏</Checkbox>
                  </Form.Item> <NumTips style={{ top: 'auto', right: 12, zIndex: 1 }} content={'1、颗粒物分析仪无显示屏时，分析仪量程填写铭牌量程'} /></Row>
                break;
              case 3:
                return <Row align='middle' style={{ paddingLeft: 10 }}>
                  <Form.Item name='isDisplay3' rules={[{ required: false, message: '请选择' }]}>
                    <Checkbox disabled={isCheckUser} checked={isDisPlayCheck3} onChange={(e) => { isDisplayChange2(e, 'isDisplay3') }}>差压法</Checkbox>
                  </Form.Item></Row>
                break;
              case 4:
                return <Row align='middle' style={{ paddingLeft: 9 }}>
                  <Form.Item name='isDisplay4' rules={[{ required: false, message: '请选择' }]}>
                    <Checkbox disabled={isCheckUser} checked={isDisPlayCheck4} onChange={(e) => { isDisplayChange2(e, 'isDisplay4') }}>直测流速法</Checkbox>
                  </Form.Item></Row>
                break;
              default:
                return '—'
                break;

            }

          }
        },
        {
          title: '分析仪量程',
          align: 'center',
          dataIndex: 'par',
          key: 'par',
          width: 320,
          render: (text, record) => {
            if (record.Name === 'NOx' || record.Name === '标干流量') {
              return '—'
            } else {
              // type=='edit'&&isCheckUser
              let disabledFlag = false;
              switch (record.isDisplay) {
                case 1: case 2:
                  disabledFlag = record.isDisplay == 1 && !isDisPlayCheck1 || record.isDisplay == 2 && !isDisPlayCheck2 ? true : false
                  break;
                case 3: case 4:
                  disabledFlag = record.isDisplay == 3 && !isDisPlayCheck3 || record.isDisplay == 4 && !isDisPlayCheck4 ? true : false
                  break;
              }
              return <Row justify='center' align='middle'>
                {/* <Form.Item name={`${record.par}AnalyzerRang1`} rules={[{ required: !disabledFlag ? rangReq[`${record.par}RangFlag`] : !disabledFlag, message: '请输入' }]}> */}
                <Form.Item name={`${record.par}AnalyzerRang1`} >

                  <InputNumber placeholder='最小值' disabled={disabledFlag || isCheckUser} onBlur={() => { isJudge(record, 1) }} />
                </Form.Item>
                <span style={{ padding: '0 2px' }}> - </span>
                {/* <Form.Item name={`${record.par}AnalyzerRang2`} rules={[{ required: !disabledFlag ? rangReq[`${record.par}RangFlag`] : !disabledFlag, message: '请输入' }]}> */}
                <Form.Item name={`${record.par}AnalyzerRang2`} >

                  <InputNumber placeholder='最大值' disabled={disabledFlag || isCheckUser} onBlur={() => { isJudge(record, 1) }} />
                </Form.Item>
                {/* <Form.Item name={`${record.par}AnalyzerUnit`} style={{ marginLeft: 5 }} rules={[{ required: !disabledFlag ? rangReq[`${record.par}RangFlag`] : !disabledFlag, message: '请选择' }]}> */}
                <Form.Item name={`${record.par}AnalyzerUnit`} style={{ marginLeft: 5 }} >

                  <Select allowClear placeholder='单位列表' disabled={disabledFlag || isCheckUser} onChange={() => { isJudge(record, 1) }}>
                    {unitFormat(record)}
                  </Select>
                </Form.Item>
              </Row>
            }
          }
        },
        {
          title: '分析仪量程照片',
          align: 'center',
          dataIndex: 'par',
          key: 'par',
          width: 130,
          render: (text, record) => {
            if (record.Name === 'NOx' || record.Name === '标干流量') {
              return '—'
            } else {
              let disabledFlag = false;
              switch (record.isDisplay) {
                case 1: case 2:
                  disabledFlag = (record.isDisplay == 1 && !isDisPlayCheck1) || (record.isDisplay == 2 && !isDisPlayCheck2) || (isCheckUser) ? true : false
                  break;
                case 3: case 4:
                  disabledFlag = (record.isDisplay == 3 && !isDisPlayCheck3) || (record.isDisplay == 4 && !isDisPlayCheck4) || (isCheckUser) ? true : false
                  break;
                default:
                  disabledFlag = isCheckUser;
                  break;
              }
              const fileFlag = !(analyzerFileList[`${record.par}AnalyzerFilePar`] && analyzerFileList[`${record.par}AnalyzerFilePar`][0])
              return <Row justify='center' align='middle'>
                <Form.Item name={`${record.par}AnalyzerFilePar`}>
                  <a style={{ cursor: disabledFlag && fileFlag && 'not-allowed', color: disabledFlag && fileFlag && 'rgba(0, 0, 0, 0.25) ', }} onClick={() => { if (disabledFlag && fileFlag) { return }; setFileType('analyzerFile'); setAnalyzerFilePar(`${record.par}AnalyzerFilePar`); setFileVisible(true); }}>{analyzerFileList[`${record.par}AnalyzerFilePar`] && analyzerFileList[`${record.par}AnalyzerFilePar`][0] ? '查看附件' : '上传附件'}</a>
                </Form.Item>
              </Row>
            }
          }
        },
        {
          title: <Row align='middle' justify='center'>
            {/* <Checkbox checked={dasChecked} onChange={onDasChange}>DAS量程</Checkbox> */}
                 DAS量程
                </Row>,
          align: 'center',
          dataIndex: 'par',
          key: 'par',
          width: 320,
          render: (text, record) => {
            if (record.Name === 'NOx' || record.Name === '标干流量') {
              return '—'
            } else {
              let disabledFlag = false;
              switch (record.isDisplay) {
                case 1: case 2:
                  disabledFlag = (record.isDisplay == 1 && !isDisPlayCheck1 || !dasChecked) || (record.isDisplay == 2 && !isDisPlayCheck2 || !dasChecked) ? true : false
                  break;
                case 3: case 4:
                  disabledFlag = (record.isDisplay == 3 && !isDisPlayCheck3 || !dasChecked) || (record.isDisplay == 4 && !isDisPlayCheck4 || !dasChecked) ? true : false
                  break;
              }
              return <Row justify='center' align='middle'>
                {/* <Form.Item name={[`${record.par}DsRang1`]} rules={[{ required: !disabledFlag ? rangReq[`${record.par}RangFlag`] : !disabledFlag, message: '请输入' }]} > */}
                <Form.Item name={[`${record.par}DsRang1`]} >
                  <InputNumber placeholder='最小值' disabled={disabledFlag || isCheckUser} onBlur={() => { isJudge(record, 1) }} />
                </Form.Item>
                <span style={{ padding: '0 2px' }}> - </span>
                {/* <Form.Item name={[`${record.par}DsRang2`]} rules={[{ required: !disabledFlag ? rangReq[`${record.par}RangFlag`] : !disabledFlag, message: '请输入' }]}> */}
                <Form.Item name={[`${record.par}DsRang2`]}>
                  <InputNumber placeholder='最大值' disabled={disabledFlag || isCheckUser} onBlur={() => { isJudge(record, 1) }} />
                </Form.Item>
                {/* <Form.Item name={[`${record.par}DsUnit`]} style={{ marginLeft: 5 }} rules={[{ required: !disabledFlag ? rangReq[`${record.par}RangFlag`] : !disabledFlag, message: '请选择' }]}> */}
                <Form.Item name={[`${record.par}DsUnit`]} style={{ marginLeft: 5 }} >
                  <Select allowClear placeholder='单位列表' disabled={disabledFlag || isCheckUser} onChange={() => { isJudge(record, 1) }}>
                    {unitFormat(record)}
                  </Select>
                </Form.Item>
              </Row>
            }
          }
        },
        {
          title: 'DAS量程照片',
          align: 'center',
          dataIndex: 'par',
          key: 'par',
          width: 130,
          render: (text, record) => {
            if (record.Name === 'NOx' || record.Name === '标干流量') {
              return '—'
            } else {
              let disabledFlag = false;
              switch (record.isDisplay) {
                case 1: case 2:
                  disabledFlag = (record.isDisplay == 1 && !isDisPlayCheck1) || (record.isDisplay == 2 && !isDisPlayCheck2) || (isCheckUser) ? true : false
                  break;
                case 3: case 4:
                  disabledFlag = (record.isDisplay == 3 && !isDisPlayCheck3) || (record.isDisplay == 4 && !isDisPlayCheck4) || (isCheckUser) ? true : false
                  break;
                default:
                  disabledFlag = isCheckUser;
                  break;
              }
              const fileFlag = !(dasFileList[`${record.par}DasFilePar`] && dasFileList[`${record.par}DasFilePar`][0])
              return <Row justify='center' align='middle'>
                <Form.Item name={`${record.par}DasFilePar`}>
                  <a style={{ cursor: disabledFlag && fileFlag && 'not-allowed', color: disabledFlag && fileFlag && 'rgba(0, 0, 0, 0.25) ', }} onClick={() => { if (disabledFlag && fileFlag) { return }; setFileType('dasFile'); setDasFilePar(`${record.par}DasFilePar`); setFileVisible(true); }}>{dasFileList[`${record.par}DasFilePar`] && dasFileList[`${record.par}DasFilePar`][0] ? '查看附件' : '上传附件'}</a>
                </Form.Item>
              </Row>
            }
          }
        },
        {
          title: <Row align='middle' justify='center'>
            {/* <Checkbox checked={numChecked} onChange={onNumChange}>数采仪量程</Checkbox> */}
                数采仪量程
                </Row>,
          align: 'center',
          dataIndex: 'par',
          key: 'par',
          width: 320,
          render: (text, record) => {
            if (record.Name === 'NOx' || record.Name === '标干流量') {
              return '—'
            } else {
              let disabledFlag = false;
              switch (record.isDisplay) {
                case 1: case 2:
                  disabledFlag = (record.isDisplay == 1 && !isDisPlayCheck1 || !numChecked) || (record.isDisplay == 2 && !isDisPlayCheck2 || !numChecked) || (isCheckUser) ? true : false
                  break;
                case 3: case 4:
                  disabledFlag = (record.isDisplay == 3 && !isDisPlayCheck3 || !numChecked) || (record.isDisplay == 4 && !isDisPlayCheck4 || !numChecked) || (isCheckUser) ? true : false
                  break;
                default:
                  disabledFlag = !numChecked
              }
              return <Row justify='center' align='middle'>
                {/* <Form.Item name={[`${record.par}ScyRang1`]} rules={[{ required: !disabledFlag ? rangReq[`${record.par}RangFlag`] : !disabledFlag, message: '请输入' }]}> */}
                <Form.Item name={[`${record.par}ScyRang1`]}>
                  <InputNumber placeholder='最小值' disabled={disabledFlag || isCheckUser} onBlur={() => { isJudge(record, 1) }} />
                </Form.Item>
                <span style={{ padding: '0 2px' }}> - </span>
                {/* <Form.Item name={[`${record.par}ScyRang2`]} rules={[{ required: !disabledFlag ? rangReq[`${record.par}RangFlag`] : !disabledFlag, message: '请输入' }]}> */}
                <Form.Item name={[`${record.par}ScyRang2`]} >
                  <InputNumber placeholder='最大值' disabled={disabledFlag || isCheckUser} onBlur={() => { isJudge(record, 1) }} />
                </Form.Item>
                {/* <Form.Item name={[`${record.par}ScyUnit`]} style={{ marginLeft: 5 }} rules={[{ required: !disabledFlag ? rangReq[`${record.par}RangFlag`] : !disabledFlag, message: '请选择' }]}> */}
                <Form.Item name={[`${record.par}ScyUnit`]} style={{ marginLeft: 5 }} >
                  <Select allowClear placeholder='单位列表' disabled={disabledFlag || isCheckUser} onChange={() => { isJudge(record, 1) }}>
                    {unitFormat(record)}
                  </Select>
                </Form.Item>
              </Row>
            }
          }
        },
        {
          title: '数采仪量程照片',
          align: 'center',
          dataIndex: 'par',
          key: 'par',
          width: 130,
          render: (text, record) => {
            if (record.Name === 'NOx' || record.Name === '标干流量') {
              return '—'
            } else {
              let disabledFlag = false;
              switch (record.isDisplay) {
                case 1: case 2:
                  disabledFlag = (record.isDisplay == 1 && !isDisPlayCheck1) || (record.isDisplay == 2 && !isDisPlayCheck2) || (isCheckUser) ? true : false
                  break;
                case 3: case 4:
                  disabledFlag = (record.isDisplay == 3 && !isDisPlayCheck3) || (record.isDisplay == 4 && !isDisPlayCheck4) || (isCheckUser) ? true : false
                  break;
                default:
                  disabledFlag = isCheckUser;
                  break;
              }
              const fileFlag = !(rangeFileList[`${record.par}RangeFilePar`] && rangeFileList[`${record.par}RangeFilePar`][0])

              return <Row justify='center' align='middle'>
                <Form.Item name={`${record.par}RangeFilePar`}>
                  <a style={{ cursor: disabledFlag && fileFlag && 'not-allowed', color: disabledFlag && fileFlag && 'rgba(0, 0, 0, 0.25) ', }} onClick={() => { if (disabledFlag && fileFlag) { return }; setFileType('rangeFile'); setRangeFilePar(`${record.par}RangeFilePar`); setFileVisible(true); }}>{rangeFileList[`${record.par}RangeFilePar`] && rangeFileList[`${record.par}RangeFilePar`][0] ? '查看附件' : '上传附件'}</a>
                </Form.Item>
              </Row>
            }
          }
        },
        {
          title: '量程一致性(自动判断)',
          align: 'center',
          dataIndex: 'par',
          key: 'par',
          width: 170,
          render: (text, record) => {
            if (record.Name === 'NOx' || record.Name === '标干流量') {
              return '—'
            }
            return <Row justify='center' align='middle'>
              <Form.Item name={`${record.par}RangUniformity`}>
                <Radio.Group disabled>
                  <Radio value={1}>是</Radio>
                  <Radio value={2}>否</Radio>
                </Radio.Group>
              </Form.Item>
            </Row>
          }
        },
        {
          title: '手工修正结果',
          align: 'center',
          dataIndex: 'par',
          key: 'par',
          width: 260,
          render: (text, record, index) => {
            if (record.Name === 'NOx' || record.Name === '标干流量') {
              return '—'
            }
            let disabledFlag = false;
            switch (record.isDisplay) {
              case 1: case 2:
                disabledFlag = record.isDisplay == 1 && !isDisPlayCheck1 || record.isDisplay == 2 && !isDisPlayCheck2 || (!isCheckUser) ? true : false
                break;
              case 3: case 4:
                disabledFlag = record.isDisplay == 3 && !isDisPlayCheck3 || record.isDisplay == 4 && !isDisPlayCheck4 || (!isCheckUser) ? true : false
                break;
              default:
                disabledFlag = !isCheckUser;
                break;
            }
            return <Row justify='center' align='middle'  className='manualSty'>
              <Form.Item name={[`${record.par}RangCheck`]}>
                <Checkbox.Group disabled={disabledFlag} options={manualOptions} onChange={(val) => { onManualChange(val, record, `${record.par}RangCheck`, 1) }} />
              </Form.Item>
            </Row>
          }
        },
        {
          title: '运维人员量程备注',
          align: 'center',
          dataIndex: 'par',
          key: 'par',
          width: 180,
          render: (text, record) => {
            if (record.Name === 'NOx' || record.Name === '标干流量') {
              return '—'
            }
            let disabledFlag = false;
            switch (record.isDisplay) {
              case 1: case 2:
                disabledFlag = record.isDisplay == 1 && !isDisPlayCheck1 || record.isDisplay == 2 && !isDisPlayCheck2 ? true : false
                break;
              case 3: case 4:
                disabledFlag = record.isDisplay == 3 && !isDisPlayCheck3 || record.isDisplay == 4 && !isDisPlayCheck4 ? true : false
                break;
            }
            return <Form.Item name={`${record.par}OperationRangeRemark`}>
              <TextArea rows={1} disabled={disabledFlag || isCheckUser} placeholder='请输入' style={{ width: '100%' }} />
            </Form.Item>
          }
        },
        {
          title: '备注',
          align: 'center',
          dataIndex: 'par',
          key: 'par',
          width: 180,
          render: (text, record) => {
            if (record.Name === 'NOx' || record.Name === '标干流量') {
              return '—'
            }
            let disabledFlag = false;
            switch (record.isDisplay) {
              case 1: case 2:
                disabledFlag = record.isDisplay == 1 && !isDisPlayCheck1 || record.isDisplay == 2 && !isDisPlayCheck2 || (!isCheckUser) ? true : false
                break;
              case 3: case 4:
                disabledFlag = record.isDisplay == 3 && !isDisPlayCheck3 || record.isDisplay == 4 && !isDisPlayCheck4 || (!isCheckUser) ? true : false
                break;
              default:
                disabledFlag = !isCheckUser;
                break
            }
            return <Form.Item name={`${record.par}Remark`}>
              <TextArea rows={1} disabled={disabledFlag} placeholder='请输入' style={{ width: '100%' }} />
            </Form.Item>
          }
        },
        // {
        //   title: '附件',
        //   align: 'center',
        //   dataIndex: 'par',
        //   key: 'par',
        //   width: 100,
        //   render: (text, record, index) => {
        //     const obj = {
        //       children: <div>
        //         <Form.Item name='files1' >
        //     <a onClick={() => { setFileType(1); setFileVisible(true) }}>{fileList1[0]? '查看附件' : '上传附件'}</a>
        //         </Form.Item>
        //       </div>,
        //       props: {},
        //     };
        //     if (index === 0) {
        //       obj.props.rowSpan = addDataConsistencyData.length;
        //     } else {
        //       obj.props.rowSpan = 0;
        //     }

        //     return obj;

        //   }
        // },
      ]
    },
  ]

  const isEnableChange = (values, name) => {
    let setValObj = {}, traceValObj = {}, parRemark3Obj = {};
    if (values[0]) { //选中
      if (name == 484) {
        form3.setFieldsValue({ [`485IsEnable`]: [1] })
        return
      }
      if (name == 485) { //	 停炉信号激活时工况真实性
        form3.setFieldsValue({ [`484IsEnable`]: [1] })
        return
      }
      isJudge({ par: name }, 3)
      // setTraceValReq({...traceValReq,[`${name}TraceValFlag`]: true})

    } else {
      if (name == 484) {
        form3.setFieldsValue({ [`485IsEnable`]: [] })
        return
      }
      if (name == 485) {
        form3.setFieldsValue({ [`484IsEnable`]: [] })
        return
      }
      // setTraceValReq({...traceValReq,[`${name}TraceValFlag`]: false})
      form3.setFieldsValue({ [`${name}Uniform`]: undefined })
    }

  }
  const columns3 = [
    {
      title: '序号',
      align: 'center',
      fixed: 'left',
      render: (text, record, index) => {
        return index + 1;
      }
    },
    {
      title: '监测参数',
      dataIndex: 'Name',
      key: 'Name',
      align: 'center',
      fixed: 'left',
      width: 100,
      render: (text, record, index) => {
        const obj = {
          children: text,
          props: {},
        };
        if (text == '颗粒物' && record.concentrationType == '原始浓度') {
          obj.props.rowSpan = 2;
        }
        if (text == '颗粒物' && record.concentrationType == '标杆浓度') {
          obj.props.rowSpan = 0;
        }
        return obj;
      }
    },
    {
      title: '实时数据一致性核查表',
      children: [
        {
          title: '浓度类型',
          align: 'center',
          dataIndex: 'concentrationType',
          key: 'concentrationType',
          width: 145,
          render: (text, record) => {
            return text ? text : '—'

          }
        },
        {
          title: '分析仪示值',
          align: 'center',
          dataIndex: 'par',
          key: 'par',
          width: 320,
          render: (text, record) => {
            if (record.Name === 'NOx' || record.Name === '标干流量' || record.Name === '流速' || record.Name === '颗粒物' && record.concentrationType === '标杆浓度') {
              return '—'
            }
            return <Row justify='center' align='middle'>
              {/* <Form.Item name={`${record.par}IndicaVal`} rules={[{ required: indicaValReq[`${record.par}IndicaValFlag`], message: '请输入' }]}> */}
              <Form.Item name={`${record.par}IndicaVal`}>
                <InputNumber placeholder='请输入' onBlur={() => { isJudge(record, 2) }} disabled={isCheckUser} />
              </Form.Item>
              {/* <Form.Item name={`${record.par}IndicaUnit`} style={{ marginLeft: 5 }} rules={[{ required: indicaValReq[`${record.par}IndicaValFlag`], message: '请选择' }]}> */}
              <Form.Item name={`${record.par}IndicaUnit`} style={{ marginLeft: 5 }}>
                <Select allowClear placeholder='单位列表' onChange={() => { isJudge(record, 2) }} disabled={isCheckUser}>
                  {unitFormat(record)}
                </Select>
              </Form.Item>
            </Row>
          }
        },
        {
          title: <Row align='middle' justify='center'>
            {/* <Checkbox checked={dasChecked} onChange={onDasChange}>DAS示值</Checkbox> */}
                 DAS示值
                 </Row>,
          align: 'center',
          dataIndex: 'par',
          key: 'par',
          width: 320,
          render: (text, record) => {
            return <Row justify='center' align='middle'>
              {/* <Form.Item name={[`${record.par}DsData`]} rules={[{ required: dasChecked ? indicaValReq[`${record.par}IndicaValFlag`] : dasChecked, message: '请输入' }]} > */}
              <Form.Item name={[`${record.par}DsData`]} >
                <InputNumber placeholder='请输入' disabled={!dasChecked || isCheckUser} onBlur={() => { isJudge(record, 2) }} />
              </Form.Item>
              {/* <Form.Item name={[`${record.par}DsDataUnit`]} style={{ marginLeft: 5 }} rules={[{ required: dasChecked ? indicaValReq[`${record.par}IndicaValFlag`] : dasChecked, message: '请选择' }]}> */}
              <Form.Item name={[`${record.par}DsDataUnit`]} style={{ marginLeft: 5 }}>
                <Select allowClear placeholder='单位列表' disabled={!dasChecked || isCheckUser} onChange={() => { isJudge(record, 2) }}>
                  {unitFormat(record)}
                </Select>
              </Form.Item>
            </Row>
          }
        },
        {
          title: <Row align='middle' justify='center'>
            {/* <Checkbox checked={numRealTimeChecked} onChange={onNumRealTimeChange}>数采仪实时数据</Checkbox> */}
                 数采仪实时数据
                 </Row>,
          align: 'center',
          dataIndex: 'par',
          key: 'par',
          width: 320,
          render: (text, record) => {
            if (record.Name === 'NO' || record.Name === 'NO2') {
              return '—'
            }
            return <Row justify='center' align='middle'>
              {/* <Form.Item name={[`${record.par}ScyData`]} rules={[{ required: numRealTimeChecked ? indicaValReq[`${record.par}IndicaValFlag`] : numRealTimeChecked, message: '请输入' }]}> */}
              <Form.Item name={[`${record.par}ScyData`]}>
                <InputNumber placeholder='请输入' style={{ minWidth: 85 }} disabled={!numRealTimeChecked || isCheckUser} onBlur={() => { isJudge(record, 2) }} />
              </Form.Item>
              {/* <Form.Item name={[`${record.par}ScyDataUnit`]} style={{ marginLeft: 5 }} rules={[{ required: numRealTimeChecked ? indicaValReq[`${record.par}IndicaValFlag`] : numRealTimeChecked, message: '请选择' }]}> */}
              <Form.Item name={[`${record.par}ScyDataUnit`]} style={{ marginLeft: 5 }}>
                <Select allowClear placeholder='单位列表' disabled={!numRealTimeChecked || isCheckUser} onChange={() => { isJudge(record, 2) }}>
                  {unitFormat(record)}
                </Select>
              </Form.Item>
            </Row>
          }
        },
        {
          title: '附件',
          align: 'center',
          dataIndex: 'par',
          key: 'par',
          width: 100,
          render: (text, record, index) => {
            const fileFlag = !(fileList2 && fileList2[0]);
            const obj = {
              children: <div>
                <Form.Item name='files2' >
                  <a style={{ cursor: isCheckUser && fileFlag && 'not-allowed', color: isCheckUser && fileFlag && 'rgba(0, 0, 0, 0.25) ', }} onClick={() => { if (isCheckUser && fileFlag) { return }; setFileType(2); setFileVisible(true) }}>{fileList2[0] ? '查看附件' : '上传附件'}</a>
                </Form.Item>
              </div>,
              props: {},
            };
            if (index === 0) {
              obj.props.rowSpan = addRealTimeData.length;
            } else {
              obj.props.rowSpan = 0;
            }

            return obj;

          }
        },
        {
          title: '数据一致性(自动判断)',
          align: 'center',
          dataIndex: 'par',
          key: 'par',
          width: 170,
          render: (text, record) => {
            return <Row justify='center' align='middle'>
              <Form.Item name={[`${record.par}DataUniformity`]}>
                <Radio.Group disabled>
                  <Radio value={1}>是</Radio>
                  <Radio value={2}>否</Radio>
                </Radio.Group>
              </Form.Item>
            </Row>
          }
        },
        {
          title: '手工修正结果',
          align: 'center',
          dataIndex: 'par',
          key: 'par',
          width: 260,
          render: (text, record, index) => {
            return <Row justify='center' align='middle' className='manualSty'>
              <Form.Item name={[`${record.par}RangCheck2`]}>
                <Checkbox.Group disabled={!isCheckUser} options={manualOptions} onChange={(val) => { onManualChange(val, record, `${record.par}RangCheck2`, 2) }} />
              </Form.Item>
            </Row>
          }
        },
        {
          title: '运维人员核查备注',
          align: 'center',
          dataIndex: 'par',
          key: 'par',
          width: 180,
          render: (text, record) => {
            return <Form.Item name={`${record.par}OperationDataRemark`}>
              <TextArea rows={1} placeholder='请输入' style={{ width: '100%' }} disabled={isCheckUser} />
            </Form.Item>
          }
        },
        {
          title: '备注',
          align: 'center',
          dataIndex: 'par',
          key: 'par',
          width: 180,
          render: (text, record) => {
            return <Form.Item name={`${record.par}Remark2`}>
              <TextArea disabled={!isCheckUser} rows={1} placeholder='请输入' style={{ width: '100%' }} />
            </Form.Item>
          }
        },
      ]
    },
  ]
  const columns4 = [
    {
      title: '序号',
      align: 'center',
      fixed: 'left',
      render: (text, record, index) => {
        return index + 1;
      }
    },
    {
      title: '检查项目',
      dataIndex: 'Name',
      key: 'Name',
      align: 'center',
      fixed: 'left',
      render: (text, record, index) => {
        return <div style={{ textAlign: 'left' }}>{text}</div>
      }
    },
    {
      title: '参数一致性核查表',
      children: [
        // {
        //   title: '是否启用',
        //   align: 'center',
        //   dataIndex: 'isDisplay',
        //   key: 'isDisplay',
        //   width: 80,
        //   render: (text, record) => {

        //     return <Form.Item name={`${record.par}IsEnable`}>
        //       <Checkbox.Group onChange={(value) => { isEnableChange(value, `${record.par}`) }}> <Checkbox value={1} ></Checkbox></Checkbox.Group>
        //     </Form.Item>

        //   }
        // },
        {
          title: '仪表设定值',
          align: 'center',
          dataIndex: 'par',
          key: 'par',
          width: 140,
          render: (text, record) => {
            if (record.Name === '停炉信号接入有备案材料' || record.Name === '停炉信号激活时工况真实性') {
              return '—'
            }
            return <Row style={{ flexWrap: 'nowrap' }}>
              <Form.Item name={`${record.par}SetStatus`} style={{ paddingRight: 4 }}>
                <Checkbox.Group onChange={() => { isJudge(record, 3) }} disabled={isCheckUser}> <Checkbox value={1} ></Checkbox></Checkbox.Group>
              </Form.Item>
              <Form.Item name={`${record.par}SetVal`} >
                <InputNumber placeholder='请输入' onBlur={() => { isJudge(record, 3) }} disabled={isCheckUser} style={{ width: '100%' }} />
              </Form.Item>
            </Row>
          }
        },
        {
          title: '仪表设定值照片',
          align: 'center',
          dataIndex: 'par',
          key: 'par',
          width: 120,
          render: (text, record, index) => {
            const fileFlag = !(settingFileList[`${record.par}SettingFilePar`] && settingFileList[`${record.par}SettingFilePar`][0])
            return <Form.Item name={`${record.par}SettingFilePar`} >
              <a style={{ paddingRight: 8 }} style={{ cursor: isCheckUser && fileFlag && 'not-allowed', color: isCheckUser && fileFlag && 'rgba(0, 0, 0, 0.25) ', }} onClick={() => { if (isCheckUser && fileFlag) { return }; setFileType('settingFile'); setSettingFilePar(`${record.par}SettingFilePar`); setFileVisible(true); }}>{settingFileList[`${record.par}SettingFilePar`] && settingFileList[`${record.par}SettingFilePar`][0] ? '查看附件' : '上传附件'}</a>
            </Form.Item>


          }
        },
        {
          title: 'DAS设定值',
          align: 'center',
          dataIndex: 'par',
          key: 'par',
          width: 140,
          render: (text, record) => {
            if (record.Name === '停炉信号接入有备案材料' || record.Name === '停炉信号激活时工况真实性') {
              return '—'
            }
            return <Row style={{ flexWrap: 'nowrap' }}>
              <Form.Item name={`${record.par}InstrumentStatus`} style={{ paddingRight: 4 }}>
                <Checkbox.Group onChange={() => { isJudge(record, 3) }} disabled={isCheckUser}> <Checkbox value={1} ></Checkbox></Checkbox.Group>
              </Form.Item>
              <Form.Item name={`${record.par}InstrumentSetVal`} >
                <InputNumber onBlur={() => { isJudge(record, 3) }} placeholder='请输入' disabled={isCheckUser} style={{ width: '100%' }} />
              </Form.Item>
            </Row>
          }
        },
        {
          title: 'DAS设定值照片',
          align: 'center',
          dataIndex: 'par',
          key: 'par',
          width: 120,
          render: (text, record, index) => {
            const fileFlag = !(instrumentFileList[`${record.par}InstrumentFilePar`] && instrumentFileList[`${record.par}InstrumentFilePar`][0])
            return <div>
              <Form.Item name={`${record.par}InstrumentFilePar`} >
                <a style={{ paddingRight: 8 }} style={{ cursor: isCheckUser && fileFlag && 'not-allowed', color: isCheckUser && fileFlag && 'rgba(0, 0, 0, 0.25) ', }} onClick={() => { if (isCheckUser && fileFlag) { return }; setFileType('instrumentFile'); setInstrumentFilePar(`${record.par}InstrumentFilePar`); setFileVisible(true); }}>{instrumentFileList[`${record.par}InstrumentFilePar`] && instrumentFileList[`${record.par}InstrumentFilePar`][0] ? '查看附件' : '上传附件'}</a>
              </Form.Item>
            </div>;

          }
        },
        {
          title: '数采仪设定值',
          align: 'center',
          dataIndex: 'par',
          key: 'par',
          width: 140,
          render: (text, record) => {
            if (record.Name === '停炉信号接入有备案材料' || record.Name === '停炉信号激活时工况真实性') {
              return '—'
            }
            return <Row style={{ flexWrap: 'nowrap' }}>
              <Form.Item name={`${record.par}DataStatus`} style={{ paddingRight: 4 }}>
                <Checkbox.Group onChange={() => { isJudge(record, 3) }} disabled={isCheckUser}> <Checkbox value={1} ></Checkbox></Checkbox.Group>
              </Form.Item>
              <Form.Item name={`${record.par}DataVal`}>
                <InputNumber placeholder='请输入' onBlur={() => { isJudge(record, 3) }} disabled={isCheckUser} style={{ width: '100%' }} />
              </Form.Item>
            </Row>
          }
        },
        {
          title: '数采仪设定值照片',
          align: 'center',
          dataIndex: 'par',
          key: 'par',
          width: 130,
          render: (text, record, index) => {
            const fileFlag = !(dataFileList[`${record.par}DataFilePar`] && dataFileList[`${record.par}DataFilePar`][0])

            return <div>
              <Form.Item name={`${record.par}DataFilePar`} >
                <a style={{ paddingRight: 8 }} style={{ cursor: isCheckUser && fileFlag && 'not-allowed', color: isCheckUser && fileFlag && 'rgba(0, 0, 0, 0.25) ', }} onClick={() => { if (isCheckUser && fileFlag) { return }; setFileType('dataFile'); setDataFilePar(`${record.par}DataFilePar`); setFileVisible(true); }}>{dataFileList[`${record.par}DataFilePar`] && dataFileList[`${record.par}DataFilePar`][0] ? '查看附件' : '上传附件'}</a>
              </Form.Item>
            </div>;

          }
        },
        {
          title: '溯源值',
          align: 'center',
          dataIndex: 'par',
          key: 'par',
          width: 140,
          render: (text, record) => {
            if (record.Name === '停炉信号接入有备案材料' || record.Name === '停炉信号激活时工况真实性') {
              return '—'
            }
            // return <Form.Item name={`${record.par}TraceVal`} rules={[{ required: traceValReq[`${record.par}TraceValFlag`], message: '请输入' }]}>
            return <Form.Item name={`${record.par}TraceVal`}>
              <InputNumber placeholder='请输入' onBlur={() => { isJudge(record, 3) }} disabled={isCheckUser} style={{ width: '100%' }} />
            </Form.Item>
          }
        },
        {
          title: '溯源值照片',
          align: 'center',
          dataIndex: 'par',
          key: 'par',
          width: 100,
          render: (text, record, index) => {
            const fileFlag = !(traceabilityFileList[`${record.par}TraceabilityFilePar`] && traceabilityFileList[`${record.par}TraceabilityFilePar`][0])
            return <div>
              <Form.Item name={`${record.par}TraceabilityFilePar`} >
                <a style={{ paddingRight: 8 }} style={{ cursor: isCheckUser && fileFlag && 'not-allowed', color: isCheckUser && fileFlag && 'rgba(0, 0, 0, 0.25) ', }} onClick={() => { if (isCheckUser && fileFlag) { return }; setFileType('traceabilityFile'); setTraceabilityFilePar(`${record.par}TraceabilityFilePar`); setFileVisible(true); }}>{traceabilityFileList[`${record.par}TraceabilityFilePar`] && traceabilityFileList[`${record.par}TraceabilityFilePar`][0] ? '查看附件' : '上传附件'}</a>
              </Form.Item>
            </div>;

          }
        },
        {
          title: '一致性(自动判断)',
          align: 'center',
          dataIndex: 'par',
          key: 'par',
          width: 150,
          render: (text, record) => {
            if (record.Name === '停炉信号接入有备案材料' || record.Name === '停炉信号激活时工况真实性') {
              return '—'
            }
            return <Row justify='center' align='middle'>
              <Form.Item name={`${record.par}Uniform`}>
                <Radio.Group disabled>
                  <Radio value={1}>是</Radio>
                  <Radio value={2}>否</Radio>
                </Radio.Group>
              </Form.Item>
            </Row>
          }
        },
        {
          title: '手工修正结果',
          align: 'center',
          dataIndex: 'par',
          key: 'par',
          width: 260,
          render: (text, record, index) => {
            return <Row justify='center' align='middle' className='manualSty'>
              <Form.Item name={`${record.par}RangCheck3`}>
                <Checkbox.Group disabled={!isCheckUser} options={manualOptions} onChange={(val) => { onManualChange(val, record, `${record.par}RangCheck3`, 3) }} />
              </Form.Item>
            </Row>
          }
        },
        {
          title: '运维人员核查备注',
          align: 'center',
          dataIndex: 'par',
          key: 'par',
          width: 150,
          render: (text, record) => {
            return <Form.Item name={`${record.par}OperationReamrk`}>
              <TextArea rows={1} placeholder='请输入' disabled={isCheckUser} style={{ width: '100%' }} />
            </Form.Item>
          }
        },
        {
          title: '备注',
          align: 'center',
          dataIndex: 'par',
          key: 'par',
          width: 150,
          render: (text, record) => {
            return <Form.Item name={`${record.par}Remark3`}>
              <TextArea disabled={!isCheckUser} rows={1} placeholder='请输入' style={{ width: '100%' }} />
            </Form.Item>
          }
        },
        // {
        //   title: '附件',
        //   align: 'center',
        //   dataIndex: 'par',
        //   key: 'par',
        //   width: 100,
        //   render: (text, record, index) => {
        //     return <div>
        //       <Form.Item name={`${record.par}ParFiles`} >
        //         <a style={{ paddingRight: 8 }} onClick={() => { setFileType(3); setFilePar(`${record.par}ParFiles`); setFileVisible(true);}}>{ filesList3[`${record.par}ParFiles`]&&filesList3[`${record.par}ParFiles`][0]? '查看附件' : '上传附件'}</a>
        //       </Form.Item>
        //     </div>;

        //   }
        // },
        {
          title: '判断依据',
          align: 'center',
          dataIndex: 'Col1',
          key: 'Col1',
          width: 150,
          render: (text, record, index) => {
            return <div style={{ textAlign: 'left' }}>{text}</div>
          }
        }
      ]
    }
  ]
  const onAllChange = (e) => { //参数一致性核查表 
    const checked = e.target.checked
    addParconsistencyData.map(item => {
      form3.setFieldsValue({
        [`${item.ChildID}SetStatus`]: checked ? [1] : [],
        [`${item.ChildID}InstrumentStatus`]: checked ? [1] : [],
        [`${item.ChildID}DataStatus`]: checked ? [1] : [],
      })
    })
  }

  const [id, setId] = useState()
  const [detailVisible, setDetailVisible] = useState(false)
  const [detailTitle, setDetailTitle] = useState()
  const details = (record) => {
    setDetailTitle(`${record.entName} - ${record.pointName}`)
    setDetailVisible(true)
    setId(record.id)
  }
  const { addParconsistencyData } = props;

  const [fileVisible, setFileVisible] = useState(false)

  const userlist = tableInfo && tableInfo['View_UserOperation'] && tableInfo['View_UserOperation'].dataSource || [];


  return (
    <div className={styles.remoteSupervisionSty}>

      <BreadcrumbWrapper>
        <Card title={
          <Form
            form={form}
            name="advanced_search"
            onFinish={() => { setPageIndex(1); onFinish(1, pageSize) }}
            initialValues={{
              month: [moment().add(-30, 'day'), moment()],
            }}
            className={styles.queryForm}
            onValuesChange={onValuesChange}
          >
            <Row align='middle'>
              <Form.Item label='行政区' name='RegionCode' className='regSty'>
                <RegionList noFilter levelNum={2} style={{ width: 150 }} />
              </Form.Item>
              <Spin spinning={entLoading} size='small' style={{ top: -4, left: 20 }}>
                <Form.Item label='企业' name='EntCode'>
                  <EntAtmoList noFilter style={{ width: 200 }} />
                </Form.Item>
              </Spin>
              <Spin spinning={pointLoading} size='small' style={{ top: -4, left: 20 }}>
                <Form.Item label='监测点名称' name='DGIMN' >

                  <Select placeholder='请选择' allowClear showSearch optionFilterProp="children" style={{ width: 200 }}>
                    {
                      pointList[0] && pointList.map(item => {
                        return <Option key={item.DGIMN} value={item.DGIMN} >{item.PointName}</Option>
                      })
                    }
                  </Select>
                </Form.Item>
              </Spin>
            </Row>

            <Row >
              <Form.Item label='核查日期' name='month'>
                {/* <DatePicker allowClear={false} picker="day" /> */}
                <RangePicker_ format='YYYY-MM-DD' allowClear={false} showTime={false} style={{ marginLeft: 0, width: 407 }} />
              </Form.Item>
              <Form.Item label='核查结果' name='CheckStatus' className='checkSty'>
                <Select placeholder='请选择' allowClear style={{ marginLeft: 0, width: 200 }}>
                  <Option key={1} value={1} >合格</Option>
                  <Option key={2} value={2} >不合格</Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Button type="primary" loading={tableLoading} htmlType="submit">
                  查询
               </Button>
                <Button style={{ margin: '0 8px' }} onClick={() => { form.resetFields(); }}  >
                  重置
                </Button>
                {/* {!isRecord && <Button style={{ marginRight: 8 }} onClick={add}>
                  添加
                </Button>} */}
                <Button loading={exportLoading} icon={<ExportOutlined />} onClick={() => { exports() }}  >
                  导出
                </Button>
                {!isRecord && <><Button type="primary" style={{ margin: '0 8px' }} onClick={() => { forwardClick() }}>
                  转发任务单
               </Button>
                  <Button type="primary" onClick={() => { requestTask() }}  >
                    申请任务单
                 </Button></>
                }
              </Form.Item>
            </Row>
          </Form>}>
          <SdlTable
            loading={tableLoading}
            bordered
            dataSource={tableDatas}
            columns={columns}
            // scroll={{x:false, y: clientHeight - 500 }}
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              total: tableTotal,
              pageSize: pageSize,
              current: pageIndex,
              onChange: handleTableChange,
            }}
          />
        </Card>
      </BreadcrumbWrapper>
      <Modal
        title={title}
        visible={visible}
        // onOk={save}
        // okText='保存'
        destroyOnClose
        onCancel={() => { setVisible(false); }}
        wrapClassName={styles.modalSty}
        getContainer={false}
        mask={false}
        footer={[
          <Button onClick={() => { setVisible(false) }}>
            取消
          </Button>,
          <Button type="primary" onClick={() => { save(1) }} loading={saveLoading1 || echoLoading || parLoading || importDataLoading || false}>
            保存
          </Button>,
          <Button type="primary" onClick={() => save(2)} loading={saveLoading2 || echoLoading || parLoading || importDataLoading || false} >
            提交
          </Button>,
        ]}
      >
        <Spin spinning={(title === '编辑' && editLoading) || importDataLoading}>
          <Form
            form={commonForm}
            name={"advanced_search"}
            initialValues={{
              month: moment(moment())
            }}
            className={styles.queryForm2}
            onValuesChange={onValuesChange2}
          >

            <Row className={styles.queryPar} style={{ paddingTop: 12 }}>
              <Spin spinning={entLoading} size='small' style={{ top: -2, left: '6%' }}>
                <Form.Item label='企业' name='EntCode' rules={[{ required: true, message: '请选择企业名称' }]}>
                  <EntAtmoList noFilter disabled={title === '编辑'} allowClear={false} style={{ width: 200 }} />
                </Form.Item>
              </Spin>
              <Spin spinning={pointLoading2} size='small' style={{ top: -2, left: '12.5%' }}>
                <Form.Item label='监测点名称' name='DGIMN' style={{ margin: '0 8px' }} rules={[{ required: true, message: '请选择监测点名称!' }]} >
                  <Select placeholder='请选择' disabled={title === '编辑'} showSearch optionFilterProp="children" style={{ width: 200 }}>
                    {
                      pointList2[0] && pointList2.map(item => {
                        return <Option key={item.DGIMN} value={item.DGIMN} >{item.PointName}</Option>
                      })
                    }
                  </Select>
                </Form.Item>
              </Spin>

              <Form.Item label='核查日期' name='month' rules={[{ required: true, message: '请选择核查月份!' }]}>
                <DatePicker disabled={title === '编辑'} allowClear={false} picker="day" style={{ width: 200 }} />
              </Form.Item>

              <Spin size='small' spinning={title === '编辑' ? false : parLoading || false} style={{ top: -2, left: '15%' }}>
                <Form.Item label='任务执行人' name='OperationUserID' rules={[{ required: true, message: '请设置点位的负责运维人!' }]}>
                  <Select disabled={title === '编辑'} placeholder='请选择' showSearch optionFilterProp="children">
                    {userlist.map(item => {
                      return <Option key={item['dbo.View_User.User_ID']} value={item['dbo.View_User.User_ID']} >
                        {item['dbo.View_User.User_Name']}
                      </Option>
                    })
                    }
                  </Select>
                </Form.Item>
              </Spin>
              {!isCheckUser&&<Form.Item>
                <Button type='primary' icon={<UploadOutlined />} loading={importDataLoading || echoLoading} onClick={importData}>导入</Button>
              </Form.Item>}

            </Row>

            <Spin spinning={parLoading}>
              {/* <Tabs
                activeKey={tabType}
                onChange={key => {
                  tabsChange(key);
                }}
                className={styles.tabSty}
              > */}
              {/* <TabPane tab="数据一致性核查表" key='1'> */}
              <Form
                form={form2}
                name={"advanced_search"}
                initialValues={{}}
                className={styles.queryForm2}
              // onValuesChange={onValuesChange2}
              >
                <SdlTable
                  // loading={parLoading}
                  columns={columns2}
                  dataSource={addDataConsistencyData}
                  pagination={false}
                  scroll={{ y: 'auto' }}
                  className='compactTableSty'
                  rowClassName={null}
                  sticky
                />
                <SdlTable
                  // loading={parLoading}                                         
                  columns={columns3}
                  dataSource={addRealTimeData}
                  pagination={false}
                  scroll={{ y: 'auto' }}
                  className='compactTableSty'
                  rowClassName={null}
                  sticky
                />
                <Row style={{ color: '#f5222d', marginTop: 10, fontSize: 16 }}>
                  <span style={{ paddingRight: 12 }}>注：</span>
                  <ol type="1" style={{ listStyle: 'auto', paddingBottom: 8 }}>
                    <li>填写数值，带单位；</li>
                    <li>项目无DAS，可只填写实时数据内容；若使用我司数采仪，仍需简单核算、确认历史数据情况；</li>
                    <li>数字里传输数据须完全一致；模拟量传输，实时数据数据差值/量程≤1‰ (参考HJ/T 477-2009)；</li>
                    <li>多量程仅核查正常使用量程；</li>
                    <li>“数采仪里程”选项，若数采仪使用数字量方式传输且不需设定量程，可不勾选；</li>
                    <li>若同时存在普通数采仪及动态管控仪数采仪，“数采仪”相关选项选择向“国发平台”发送数据的数采仪；</li>
                    <li>颗粒物数值一致性： ≤10mg/m3的、绝对误差≤3mg/m3、 >10mg/m3的、绝对误差≤5mg/m3；</li>
                    <li>流速直测法的(如热质式、超声波式)，有显示屏的填写设置量程，无显示屏的填写铭牌量程；</li>
                    <li>手工修正结果填写“是、否、不适用、不规范“四项，不适用必须备注填写原因</li>
                  </ol>
                </Row>
              </Form>
              <Form
                form={form3}
                name={"advanced_search"}
                initialValues={{}}
                className={styles.queryForm2}
              // onValuesChange={onValuesChange2}
              >
               <Form.Item name="allSelect" valuePropName="checked">
                <Checkbox  disabled={isCheckUser} onChange={onAllChange}>全选</Checkbox>
                </Form.Item>
                <SdlTable
                  loading={parLoading}
                  columns={columns4}
                  dataSource={addParconsistencyData}
                  pagination={false}
                  scroll={{ y: 'auto' }}
                  className='compactTableSty'
                  sticky
                  rowClassName={null}
                />
                <Row style={{ color: '#f5222d', marginTop: 10, fontSize: 16 }}>
                  <span style={{ paddingRight: 10 }}>注：</span>
                  <ol type="1" style={{ listStyle: 'auto' }}>
                    <li>设定值一般在DAS查阅；若现场无DAS，应在其他对应设备查阅，如数采仪；</li>
                    <li>无72小时调试检测报告的，应向客户发送告知函；</li>
                    <li>已上传告知函的，同一点位可不再上传相应附件；</li>
                  </ol>
                </Row>
              </Form>
              {/* </TabPane> */}
              {/* <TabPane tab="参数一致性核查表" key='2'>
                  <Form
                    form={form3}
                    name={"advanced_search"}
                    initialValues={{}}
                    className={styles.queryForm2}
                  >
                    <SdlTable
                      loading={parLoading}
                      columns={columns4}
                      dataSource={addParconsistencyData}
                      pagination={false}
                      scroll={{ y: 'auto' }}
                      className='compactTableSty'
                      sticky
                    />
                    <Row style={{ color: '#f5222d', marginTop: 10 }}>
                      <span style={{ paddingRight: 10 }}>注：</span>
                      <ol type="1" style={{ listStyle: 'auto' }}>
                        <li>设定值一般在DAS查阅；若现场无DAS，应在其他对应设备查阅，如数采仪；</li>
                        <li>无72小时调试检测报告的，应向客户发送告知函；</li>
                        <li>已上传告知函的，同一点位可不再上传相应附件；</li>
                      </ol>
                    </Row>
                  </Form>
                </TabPane> */}
              {/* </Tabs> */}
            </Spin>
            <div style={{ color: '#f5222d', marginTop: 4, fontSize: 18 }}>
              我承诺：当月上传的全部量程、参数设定值和溯源值均已核对无误，现场实时数据保持一致，上传的各项数据和照片如有任何问题，本人愿接受相应处罚。
           </div>
            <Form.Item name='Commitment' valuePropName="checked" style={{ marginBottom: 0 }}>
              <Checkbox disabled={isCheckUser} className={styles.commitmentSty}>
                已阅读已承诺！
            </Checkbox>
            </Form.Item>
          </Form>
        </Spin>
      </Modal>

      <Modal
        title='上传附件'
        visible={fileVisible}
        onOk={() => { setFileVisible(false) }}
        destroyOnClose
        onCancel={() => { setFileVisible(false) }}
        width={'50%'}
        footer={null}
      >
        <Upload {...uploadProps} style={{ width: '100%' }} >
          {!isCheckUser && <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>上传</div>
          </div>}
        </Upload>
      </Modal>
      {previewVisible && <Lightbox
        mainSrc={imgUrlList[photoIndex]}
        nextSrc={imgUrlList[(photoIndex + 1) % imgUrlList.length]}
        prevSrc={imgUrlList[(photoIndex + imgUrlList.length - 1) % imgUrlList.length]}
        onCloseRequest={() => setPreviewVisible(false)}
        onPreMovePrevRequest={() =>
          setPhotoIndex((photoIndex + imgUrlList.length - 1) % imgUrlList.length)
        }
        onPreMoveNextRequest={() =>
          setPhotoIndex((photoIndex + 1) % imgUrlList.length)
        }
        imageTitle={`${photoIndex + 1}/${imgUrlList.length}`}
      />}


      <Modal
        title={detailTitle}
        visible={detailVisible}
        destroyOnClose
        onCancel={() => { setDetailVisible(false); }}
        wrapClassName={`${styles.modalSty} ${styles.detailModalSty}`}
        getContainer={false}
        footer={null}
        mask={false}
      >
        <Detail match={{ params: { id: id } }} />
      </Modal>
      <Modal //转发任务单
        visible={forwardTaskVisible}
        footer={null}
        title={searchTaskComponents()}
        wrapClassName='spreadOverModal'
        onCancel={() => { setForwardTaskVisible(false) }}
        destroyOnClose
        zIndex={999}
      >
        <SdlTable
          resizable
          loading={forwardTableLoading}
          bordered
          dataSource={forwardTableData}
          columns={taskColumns}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            total: forwardTableTotal,
            pageSize: forwardpageSize,
            current: forwardpageIndex,
            onChange: forwardHandleTableChange,
          }}
        />
      </Modal>
      <Modal
        title="任务转发"
        visible={forwardTaskOkVisible}
        onOk={forwardTaskOk}
        onCancel={() => { setForwardTaskOkVisible(false) }}
        confirmLoading={forwardOkLoading}
      >
        <Form
          form={forwardTaskForm}
          name="advanced_search3"
          layout='inline'
        >
          <Form.Item label='转发人' name='ForwardUserID' style={{ width: '100%' }} rules={[{ required: true, message: '请选择转发人' }]}>
            <OperationInspectoUserList workNum />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="申请任务单"
        visible={requestTaskVisible}
        onOk={requestTaskOk}
        onCancel={() => { setRequestTaskVisible(false) }}
        confirmLoading={addRemoteInspectorPointLoading}
        wrapClassName={styles.requestTaskModal}
        width={650}
      >
        <Form
          form={requestTaskForm}
          name="advanced_search3"
        >
          <Spin spinning={getRemoteInspectorPointLoading} size='small' style={{ top: -4 }}>
            <Form.Item label='监测点' name='DGIMN' rules={[{ required: !isCheckUser, message: '请选择监测点' }]}>
              <Select placeholder='请选择' showSearch optionFilterProp="children"  >
                {remoteInspectorPointList.map(item => {
                  return <Option key={item.DGIMN} value={item.DGIMN} >
                    {`${item.ParentName} - ${item.PointName}`}
                  </Option>
                })
                }
              </Select>
            </Form.Item>
          </Spin>
        </Form>

      </Modal> 
      <CheckUserEditDetail  visible={checkEditvisible}  title={title} id={editId}   onCancel={() => { setCheckEditvisible(false); }} onFinish={()=>onFinish(pageIndex,pageSize)}/>
    </div>

  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);