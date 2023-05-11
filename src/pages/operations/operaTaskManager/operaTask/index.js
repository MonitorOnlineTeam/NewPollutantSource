/**
 * 功  能：运维任务管理
 * 创建人：jab
 * 创建时间：2023.05
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Checkbox, Form, Tag, Popover, Upload, Cascader, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Spin, Tabs, } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, UploadOutlined, SearchOutlined, } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import { DelIcon, DetailIcon, EditIcon, PointIcon, } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import styles from "./style.less"
import Cookie from 'js-cookie';
import NumTips from '@/components/NumTips'
import TableTransfer from '@/components/TableTransfer'
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;
const { Search } = Input;
const namespace = 'operaTask'





const dvaPropsData = ({ loading, operaTask }) => ({
  tableDatas: operaTask.tableDatas,
  tableLoading: operaTask.tableLoading,
  tableDatas2: operaTask.tableDatas2,
  tableLoading2: operaTask.tableLoading2,
  taskDetailData: operaTask.taskDetailData,
  taskDetailLoading: operaTask.taskDetailLoading,
  contractTableLoading: operaTask.contractTableLoading,
  contractTableData: operaTask.contractTableData,
  contractTableAllData: operaTask.contractTableAllData,
  taskTypeListLoading: operaTask.taskTypeListLoading,
  taskTypeList: operaTask.taskTypeList,
  cityInfoListLoading: operaTask.cityInfoListLoading,
  cityInfoList: operaTask.cityInfoList,
  pointList: operaTask.pointList,
  pointListLoading: operaTask.pointListLoading,
  operaUserList: operaTask.operaUserList,
  operaUserListLoading: operaTask.operaUserListLoading,
  operaDeviceList: operaTask.operaDeviceList,
  operaDeviceListLoading: operaTask.operaDeviceListLoading,
  operaContantListLoading: operaTask.operaContantListLoading,
  operaContantList: operaTask.operaContantList,
  operationTaskLoading: operaTask.operationTaskLoading,
  addOperationTaskPlanData: operaTask.addOperationTaskPlanData,
  basicInfoTaskLoading: operaTask.basicInfoTaskLoading,
  taskId: operaTask.taskId,
  addPointLoading:operaTask.addPointLoading,
})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
    bWWebService: (payload, callback) => {
      dispatch({
        type: `${namespace}/bWWebService`,
        payload: payload,
        callback: callback,
      })
    },

  }
}
const Index = (props) => {



  const [form] = Form.useForm();
  const [basicInfoform] = Form.useForm();
  const [planform] = Form.useForm();
  const [taskReportUploadform] = Form.useForm();
  const [taskAbnormalTerminaform] = Form.useForm();


  const [taskType, setTaskType] = useState('1')
  const [operaModelTabType, setOperaModelTabType] = useState('1')
  const [addTaskModelTabType, setAddTaskModelTabType] = useState('1')







  const { tableDatas, tableLoading, tableDatas2, tableLoading2, loadingAddConfirm, loadingEditConfirm, contractTableData, contractTableAllData, taskDetailData, pointList, operaUserList, operaDeviceList, taskId, } = props;
  useEffect(() => {
    onFinish(pageIndex);
    onFinish2(pageIndex2)
  }, []);

  const columns = [
    {
      title: '序号',
      align: 'center',
      render: (text, record, index) => {
        return taskType === '1' ? (index + 1) + (pageIndex - 1) * pageSize : (index + 1) + (pageIndex2 - 1) * pageSize2;
      }
    },
    {
      title: '任务名称',
      dataIndex: 'RWMC',
      key: 'RWMC',
      align: 'left',
    },
    {
      title: '任务编号',
      dataIndex: 'RWBH',
      key: 'RWBH',
      align: 'left',
    },
    {
      title: '任务类型',
      dataIndex: 'RWMC',
      key: 'RWMC',
      align: 'left',
    },
    {
      title: '任务开始日期',
      dataIndex: 'RWRQKS',
      key: 'RWRQKS',
      align: 'center',
    },
    {
      title: '任务结束日期',
      dataIndex: 'RWRQJS',
      key: 'RWRQJS',
      align: 'center',
    },
    {
      title: <span>操作</span>,
      align: 'center',
      width: 190,
      fixed: 'right',
      render: (text, record) => {
        return <>
          <Fragment>
            <a style={{ paddingRight: 8 }} onClick={() => { taskUploadReport(record) }} >上传报告</a>
          </Fragment>
          <Fragment>
            <a style={{ paddingRight: 8 }} onClick={() => { taskEdit(record) }} >任务编辑</a>
          </Fragment>
          <Fragment>
            <Popconfirm title="您确定要完结此运维任务吗？" style={{ paddingRight: 5 }} onConfirm={() => { endTask(record) }} okText="是" cancelText="否">
              <a style={{ paddingRight: 8 }}>任务完结</a>
            </Popconfirm>
          </Fragment>
          <Fragment>
            <a style={{ paddingRight: 8 }} onClick={() => { taskDetail(record) }} >任务详情</a>
          </Fragment>
          <Fragment>
            <a onClick={() => { taskAbnormalTermina(record) }} >异常终止</a>
          </Fragment>
        </>
      }
    },
  ];
  const restData = () => {
    setPointTargetKeys([]); setAddPointList([])
    setOperaUserTargetKeys([]); setAddOperaUserList([])
    setOperaDeviceTargetKeys([]); setAddOperaDeviceList([])
    setContractSearchVal('');
    planform.resetFields();
  }
  const [taskAddVisible, setTaskAddVisible] = useState(false)
  const taskAdd = () => {//任务添加
    setTaskAddVisible(true)
    props.bWWebService({ //任务类别
      functionName: 'M_OpenationTaskType',
    })
    props.bWWebService({ //任务所在地
      functionName: 'Z_CityInfo',
    })
    restData();
  }
  const [taskTitle, setTaskTitle] = useState()
  const [taskEditVisible, setTaskEditVisible] = useState(false)

  const taskEdit = async (record, type) => {  //任务编辑
    setTaskEditVisible(true)
    setTaskTitle(` ${record.RWMC} - 任务编辑`)
    props.bWWebService({ //任务详情
      functionName: 'M_GetOperationTaskByID',
      paramList: {
        OPTID: record.ID,
      }
    })
    restData();
  };
  const [taskDetailVisible, setTaskDetailVisible] = useState(false)
  const taskDetail = async (record, type) => {  //任务详情
    setTaskDetailVisible(true)
    setTaskTitle(`${record.RWMC} - 任务详情`)
    props.bWWebService({ //任务详情
      functionName: 'M_GetOperationTaskByID',
      paramList: {
        OPTID: record.ID,
      }
    })
    // basicInfoform.setFieldsValue({

    // })
  };
  const [taskReportTitle, setTaskReportTitle] = useState()
  const [taskReportVisible, setTaskReportVisible] = useState(false)
  const taskUploadReport = (record) => { //上传报告
    // setTaskReportVisible(true)
    setTaskReportTitle(`${record.RWMC} - 上传报告`)
    setTaskReportUploadVisible(true)
  };
  const endTask = (record) => { //完结任务

  }
  const [taskAbnormalTerminaTitle, setTaskAbnormalTerminaTitle] = useState()
  const [taskAbnormalTerminaVisible, setTaskAbnormalTerminaVisible] = useState(false)
  const taskAbnormalTermina = (record) => { //异常终止
    setTaskAbnormalTerminaVisible(true)
    setTaskAbnormalTerminaTitle(`${record.RWMC} - 异常终止`)
    taskAbnormalTerminaform.resetFields()
  }
  const taskOk = async () => { //任务提交

    try {
      const values = await basicInfoform.validateFields();//触发校验
      props.bWWebService({
        functionName: 'M_SubmitOperationTask',
        paramList: {
          OPTID: record.ID,
        }
      })
    } catch (errInfo) {
      console.log('错误信息:', errInfo);
    }
  }
  const onFinish = (pageIndexs) => {  //查询
    const values = form.getFieldsValue();
    setPageIndex(pageIndexs); //除编辑  每次查询页码重置为第一页
    props.bWWebService({
      functionName: 'M_GetALLOperationTask',
      ...values,
      // pageIndex: pageIndexs,
      // pageSize: pageSize,
    })
  }
  const onFinish2 = (pageIndexs) => {  //查询

    const values = form.getFieldsValue();
    setPageIndex2(pageIndexs); //除编辑  每次查询页码重置为第一页
    props.bWWebService({
      functionName: 'M_GetOperationTaskDone',
      ...values,
      // pageIndex: pageIndexs,
      // pageSize: pageSize,
    })
  }





  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const handleTableChange = (PageIndex, PageSize) => { //分页 进行中的任务
    setPageIndex(PageIndex)
    setPageSize(PageSize)
  }
  const [pageIndex2, setPageIndex2] = useState(1)
  const [pageSize2, setPageSize2] = useState(20)
  const handleTableChange2 = (PageIndex, PageSize) => { //分页 已完结的任务
    setPageIndex2(PageIndex)
    setPageSize2(PageSize)
  }
  const searchComponents = () => {
    return <Form
      form={form}
      name="advanced_search"
      initialValues={{
        // Status:1
      }}
      className={styles["ant-advanced-search-form"]}
      onFinish={() => { taskType === '1' ? onFinish(1) : onFinish2(1) }}
      layout='inline'
    >
      <Form.Item label="关键字" name="keywords" >
        <Input placeholder='请输入' allowClear style={{ width: 200 }} />
      </Form.Item>
      {/* <Form.Item label="任务状态" name="Status" style={{ margin: '0 16px' }} >
        <Select placeholder='请选择状态' allowClear style={{ width: 200 }}>
          <Option key={1} value={1}>启用</Option>
          <Option key={2} value={2}>停用</Option>
        </Select>
      </Form.Item> */}
      <Form.Item>
        <Button type="primary" htmlType='submit' loading={taskType === '1' ? tableLoading : tableLoading2} style={{ marginRight: 8 }}>
          查询
          </Button>
        <Button type="primary" onClick={taskAdd} style={{ marginRight: 8 }}>
          添加
          </Button>
      </Form.Item>
    </Form>
  }

  const contractColumns = [
    {
      title: '序号',
      dataIndex: 'ID',
      key: 'ID',
      align: 'center',
      width: 80,
    },
    {
      title: '合同标题',
      dataIndex: 'BT',
      key: 'BT',
      align: 'left',
      ellipsis: true,
      width: '30%',
    },
    {
      title: '合同性质',
      dataIndex: 'XZ',
      key: 'XZ',
      align: 'center',
    },
    {
      title: '合同金额',
      dataIndex: 'JE',
      key: 'JE',
      align: 'center',
      sorter: (a, b) => a.JE - b.JE,
    },
    {
      title: '履行开始时间',
      dataIndex: 'ZQS',
      key: 'ZQS',
      align: 'center',
      sorter: (a, b) => moment(a.ZQS).valueOf() - moment(b.ZQS).valueOf()
    },
    {
      title: '履行结束时间',
      dataIndex: 'ZQZ',
      key: 'ZQZ',
      align: 'center',
      sorter: (a, b) => moment(a.ZQZ).valueOf() - moment(b.ZQZ).valueOf()
    },
  ];
  const [contractSearchVal, setContractSearchVal] = useState('')
  const contractComponents = () => {
    return <>
      <Form>
        <Input placeholder='请输入内容项'
          onChange={(e) => {
            const val = e.target.value; setContractSearchVal(val)
            if (val) {
              const data = contractTableAllData.filter((item) => item.BT.indexOf(val) != -1 || item.XZ.indexOf(val) != -1); props.updateState({ contractTableData: data })
            } else { props.updateState({ contractTableData: contractTableAllData }) }
          }} style={{ width: 200, marginBottom: 8 }} allowClear suffix={!contractSearchVal && <SearchOutlined style={{ color: 'rgba(0, 0, 0, 0.25)' }} />} />
      </Form>
      <SdlTable
        loading={props.contractTableLoading}
        bordered
        dataSource={contractTableData}
        scroll={{ y: 'calc(100vh - 500px)' }}
        columns={contractColumns}
        rowSelection={{
          type: 'radio',
          onChange: (selectedRowKeys, selectedRows) => {
            basicInfoform.setFieldsValue({ contractId: selectedRowKeys })
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
          },
          // selectedRowKeys: basicInfoform.getFieldValue('contractId'),
        }}
      />
    </>
  }
  const [contractVisible, setContractVisible] = useState(false)
  const contractVisibleChange = (newVisible) => {
    setContractVisible(newVisible)
    if (newVisible) {
      props.bWWebService({
        functionName: 'C_GetALLContractList',
      })
    }
  }

  const pointColumns = [
    {
      title: '序号',
      dataIndex: 'ID',
      key: 'ID',
      align: 'center',
      width: 80,
    },
    {
      title: '点位名称',
      dataIndex: 'MC',
      key: 'MC',
      align: 'left',
      ellipsis: true,
      width: 'auto',
    },
    {
      title: '地址',
      dataIndex: 'ADDRESS',
      key: 'ADDRESS',
      align: 'center',
      ellipsis: true,
      width: 'auto',
    },
    {
      title: '纬度',
      dataIndex: 'LATITUDE',
      key: 'LATITUDE',
      align: 'center',
      width: 90,
      sorter: (a, b) => a.LATITUDE - b.LATITUDE,
    },
    {
      title: '经度',
      dataIndex: 'LONGITUDE',
      key: 'LONGITUDE',
      align: 'center',
      width: 90,
      sorter: (a, b) => a.LONGITUDE - b.LONGITUDE,
    },
  ];

  const [addPointVisible, setAddPointVisible] = useState(false);
  const [pointTargetKeys, setPointTargetKeys] = useState([]);
  const addPoint = () => {  //添加点位
    setAddPointVisible(true)
    setPointTargetKeys([])
    props.bWWebService({ //点位列表
      functionName: 'M_GetOperationSchemeList',
    })
  }
  const dataFormat = (name, addData) => { //格式化添加运维项数据
    let arrData = [];
    if (operaModelTabType != 1 && taskDetailData && taskDetailData[0] && taskDetailData[0][name] && taskDetailData[0][name].Item) {
      const data = taskDetailData[0][name].Item;
      data instanceof Array ? arrData = data : arrData.push(data)
      return operaModelTabType == 2 ? [...arrData, ...addData] : arrData;
    } else { //添加
      return addData;
    }

  }
  const [addPointList, setAddPointList] = useState([])
  const [addAllPointList, setAllAddPointList] = useState([])
  const addPointOk = () => {
    const listData = [];
    props.bWWebService({ //点位添加
      functionName: 'M_InsertOperationTaskScheme',
      xmlParamList: {
        OPTID: "101154",
        OTSID: pointTargetKeys.join('&'),
      }
    },(data)=>{
      const list = dataFormat('SCHEMES', data)
      setAddPointList(list)
      setAllAddPointList(list)
      setAddPointVisible(false)
    })

  }
  const [operaUserPageIndex, setOperaUserPageIndex] = useState(1);
  const [operaUserPageSize, setOperaUserPageSize] = useState(20);
  const [addOperaUserPageIndex, setAddOperaUserPageIndex] = useState(1);
  const [addOperaUserPageSize, setAddOperaUserPageSize] = useState(20);
  const operaUserColumns = (type) => [
    {
      title: '序号',
      dataIndex: 'ID',
      key: 'ID',
      align: 'center',
      render: (text, record, index) => {
        return type == 1 ? (index + 1) + (operaUserPageIndex - 1) * operaUserPageSize : (index + 1) + (addOperaUserPageIndex - 1) * addOperaUserPageSize;
      }
    },
    {
      title: '姓名',
      dataIndex: 'XM',
      key: 'XM',
      align: 'center',
      ellipsis: true,
      width: 100,
    },
    {
      title: '性别',
      dataIndex: 'XB',
      key: 'XB',
      align: 'center',
      width: 60,
    },
    {
      title: '身份证号',
      dataIndex: 'MC',
      key: 'MC',
      align: 'center',
      ellipsis: true,
      width: 130,
    },
    {
      title: '学历',
      dataIndex: 'XL',
      key: 'XL',
      align: 'center',
      width: 100,
    },
    {
      title: '岗位',
      dataIndex: 'ZW',
      key: 'ZW',
      align: 'left',
      ellipsis: true,
      width: 100,
    },
    {
      title: '是否专业技术人员',
      dataIndex: 'IS_ZYJSRY',
      key: 'IS_ZYJSRY',
      align: 'center',
      width: 130,
    },
    {
      title: '专业技术人员职称',
      dataIndex: 'ZYJSRYZC',
      key: 'ZYJSRYZC',
      align: 'center',
      width: 130,
    },
    {
      title: '是否离职',
      dataIndex: 'ZW_OTHER',
      key: 'ZW_OTHER',
      align: 'center',
      width: 90,
    },
  ];

  const [addOperaUserVisible, setAddOperaUserVisible] = useState(false)
  const [operaUserTargetKeys, setOperaUserTargetKeys] = useState([]);

  const addOperaUser = () => {
    setAddOperaUserVisible(true)
    props.bWWebService({ //运维人员
      functionName: 'B_GetALLWorkersList',
    })
  }
  const [addOperaUserList, setAddOperaUserList] = useState([])
  const addOperaUserOk = (data) => {
    const listData = [];
    data.map(item => {
      pointTargetKeys.map(item2 => {
        if (item.key == item2) {
          listData.push(item)
        }
      })
    })
    setAddOperaUserList(listData)
    setAddOperaUserVisible(false)
  }
  const [operaDevicePageIndex, setOperaDevicePageIndex] = useState(1);
  const [operaDevicePageSize, setOperaDevicePageSize] = useState(20);
  const [addOperaDevicePageIndex, setAddOperaDevicePageIndex] = useState(1);
  const [addOperaDevicePageSize, setAddOperaDevicePageSize] = useState(20);
  const operaDeviceColumns = (type) => [
    {
      title: '序号',
      dataIndex: 'ID',
      key: 'ID',
      align: 'center',
      render: (text, record, index) => {
        return type == 1 ? (index + 1) + (operaDevicePageIndex - 1) * operaDevicePageSize : (index + 1) + (addOperaDevicePageIndex - 1) * addOperaDevicePageSize;
      }
    },
    {
      title: '设备编号',
      dataIndex: 'SBBH',
      key: 'SBBH',
      align: 'left',
      ellipsis: true,
      width: 'auto',
    },
    {
      title: '设备名称',
      dataIndex: 'SBMC',
      key: 'SBMC',
      align: 'center',
      ellipsis: true,
      width: 'auto',
    },
    {
      title: '出厂编号',
      dataIndex: 'CCBH',
      key: 'CCBH',
      align: 'center',
      ellipsis: true,
      width: 'auto',
    },
    {
      title: '型号/规格',
      dataIndex: 'XH_GE',
      key: 'XH_GE',
      align: 'left',
      ellipsis: true,
      width: 100,
    },
    {
      title: '设备描述',
      dataIndex: 'SBMS',
      key: 'SBMS',
      align: 'left',
      ellipsis: true,
      width: 'auto',
    },
  ];
  const [addOperaDeviceVisible, setAddOperaDeviceVisible] = useState(false)
  const [operaDeviceTargetKeys, setOperaDeviceTargetKeys] = useState([]);
  const addOperaDevice = () => {
    setAddOperaDeviceVisible(true)
    props.bWWebService({ //运维设备
      functionName: 'B_GetALLDevicesList',
    })
  }
  const [addOperaDeviceList, setAddOperaDeviceList] = useState([])
  const addOperaDeviceOk = (data) => {
    const listData = [];
    data.map(item => {
      pointTargetKeys.map(item2 => {
        if (item.key == item2) {
          listData.push(item)
        }
      })
    })
    setAddOperaDeviceList(listData)
    setAddOperaDeviceVisible(false)
  }
  const [operaPlanListPageIndex, setOperaPlanListPageIndex] = useState(1)
  const [operaPlanListPageSize, setOperaPlanListPageSize] = useState(20)
  const operaPlanColumns = [
    {
      title: '序号',
      dataIndex: 'ID',
      key: 'ID',
      align: 'center',
      render: (text, record, index) => {
        return (index + 1) + (operaPlanListPageIndex - 1) * operaPlanListPageSize;
      }
    },
    {
      title: '计划标题',
      dataIndex: 'JHBT',
      key: 'JHBT',
      align: 'left',
      ellipsis: true,
      width: 'auto',
    },
    {
      title: '计划执行频次',
      dataIndex: 'JHJG',
      key: 'JHJG',
      align: 'center',
      width: 120,
      render: (text, row, index) => {
        return `每${row.JHZX}${row.JHJG}次`
      }
    },
    {
      title: '执行时间',
      dataIndex: 'JHRQJS',
      key: 'JHRQJS',
      align: 'center',
      width: 260,
      ellipsis: true,
      sorter: (a, b) => moment(a.JHRQJS).valueOf() - moment(b.JHRQJS).valueOf(),
      render: (text, row, index) => {
        return `${row.JHRQJS}至${row.JHRQKS}`
      }
    },
    {
      title: '详情',
      align: 'center',
      width: 120,
      render: (text, row, index) => {
        return <a onClick={() => operaPlanAddDetail(row)}>计划详情</a>
      }
    },
  ];
  const [planModalType, setPlanModalType] = useState('add')
  const [addOperaPlanVisible, setAddOperaPlanVisible] = useState(false)
  const operaPlanAddDetail = (row) => { //计划添加详情
    setAddOperaPlanVisible(true)
    row ? setPlanModalType('detail') : setPlanModalType('add')
    props.bWWebService({ //运维内容
      functionName: 'M_GetOperationDetailList',
    })
  }
  const taskPlanOk = async () => { //计划添加提交
    try {
      const values = await planform.validateFields();
      props.bWWebService({
        functionName: 'M_InsertOperationTaskPlan',
        xmlParamList:{
          ...values,
          JHRQKS: values.time && moment(values.time[0]).format('YYYY-MM-DD'),
          JHRQJS: values.time && moment(values.time[1]).format('YYYY-MM-DD'),
          DETAIL: values.DETAIL.join('&'),
          time: undefined,
        }
      }, () => {
        setAddOperaPlanVisible(false)
      })
    } catch (errInfo) {
      console.log('错误信息:', errInfo);
    }
  }
  const [addPointSearchVal, setAddPointSearchVal] = useState('')
  const taskAddEditDetailTab = (type) => {


    return <Tabs type="card" onChange={(key) => { setOperaModelTabType(key) }}>
      <TabPane tab="运维点位" key='1'>
        <Input placeholder='请输入内容项'
          onChange={(e) => {
            const val = e.target.value; setAddPointSearchVal(val)
            if (val) {
              const data = addAllPointList.filter((item) => item.MC.indexOf(val) != -1 || item.ADDRESS.indexOf(val) != -1);
              setAddPointList(data)
            } else { setAddPointList(addAllPointList) }
          }} style={{ width: 200, marginBottom: 8, marginRight: 8 }} allowClear suffix={!addPointSearchVal && <SearchOutlined style={{ color: 'rgba(0, 0, 0, 0.25)' }} />} />
        {type != 3 && <Button type='primary' style={{ marginBottom: 8 }} onClick={addPoint}>添加点位</Button>}
        <SdlTable dataSource={dataFormat('SCHEMES', addPointList)} loading={props.taskDetailLoading} columns={pointColumns} />
      </TabPane>
      <TabPane tab="运维人员" key='2'>
        {type != 3 && <Button type='primary' style={{ marginBottom: 8 }} onClick={addOperaUser}>添加人员</Button>}
        <SdlTable dataSource={dataFormat('WORKERS', addOperaUserList)} loading={props.taskDetailLoading} columns={operaUserColumns(1)}
          onPageChange={(PageIndex, PageSize) => {
            setOperaUserPageIndex(PageIndex)
            setOperaUserPageSize(PageSize)
          }}
        />
      </TabPane>
      <TabPane tab="运维设备" key='3'>
        {type != 3 && <Button type='primary' style={{ marginBottom: 8 }} onClick={addOperaDevice}>添加设备</Button>}
        <SdlTable dataSource={dataFormat('DEVICES', addOperaDeviceList)} loading={props.taskDetailLoading} columns={operaDeviceColumns(1)}
          onPageChange={(PageIndex, PageSize) => {
            setDeviceListPageIndex(PageIndex)
            setDeviceListPageSize(PageSize)
          }}
        />
      </TabPane>
      <TabPane tab="运维计划" key='4'>
        {type != 3 && <Button type='primary' style={{ marginBottom: 8 }} onClick={() => operaPlanAddDetail()}>添加计划</Button>}
        <SdlTable dataSource={dataFormat('PLANS', props.addOperationTaskPlanData)} loading={props.taskDetailLoading} columns={operaPlanColumns}
          onPageChange={(PageIndex, PageSize) => {
            setOperaPlanListPageIndex(PageIndex)
            setOperaPlanListPageSize(PageSize)
          }}
        />
      </TabPane>
    </Tabs>
  }
  const taskBasicInfoForm = (type) => {
    return <Form
      form={basicInfoform}
      name="add_form"
      initialValues={{
      }}
      className={styles.fromModal}
      onFinish={() => { basicInfoSave() }}
    >
      <Row>
        <Col span={12}>
          <Popover
            content={contractComponents()}
            trigger="click"
            visible={contractVisible}
            onVisibleChange={(newVisible) => contractVisibleChange(type == 1 && newVisible)}
            getPopupContainer={trigger => trigger.parentNode}
            overlayClassName='contractPopoverSty'
            placement='bottomLeft'
          >
            <Form.Item label="合同名称" name="contractId" className='contractName' rules={[{ required: true, message: '请输入合同名称', }]} >
              <Select placeholder='请选择' getPopupContainer={trigger => trigger.parentNode}>
                {contractTableAllData.map(item =>
                  <Option key={item.ID} value={item.ID}>
                    {item.BT}
                  </Option>
                )}
              </Select>

            </Form.Item>
          </Popover>
        </Col>
        <Col span={12}>
          <Form.Item label="任务编号" name="ManufacturerID22" >
            <Input placeholder='请输入' allowClear disabled={type == 2} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="任务名称" name="ManufacturerID3" rules={[{ required: true, message: '请输入任务名称', }]}>
            <TextArea rows={1} placeholder='请输入' allowClear showCount maxLength={128} disabled={type == 2} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Spin spinning={props.taskTypeListLoading} size='small'>
            <Form.Item label="任务类别" name="ManufacturerID4" rules={[{ required: true, message: '请选择任务类别', }]}>
              <Select allowClear showSearch placeholder='请选择' disabled={type == 2}>
                {props.taskTypeList.map(item =>
                  <Option key={item.ID} value={item.ID}>
                    {item.NAME}
                  </Option>
                )}
              </Select>
            </Form.Item>
          </Spin>
        </Col>
        <Col span={12}>
          <Form.Item label="任务来源" name="ManufacturerID5" rules={[{ required: true, message: '请选择任务来源', }]}>
            <Select placeholder='请选择' disabled={type == 2}>
              <Option key={1} value={1}> 政府委托 </Option>
              <Option key={2} value={2}> 社会委托 </Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Spin spinning={props.cityInfoListLoading} size='small'>
            <Form.Item label="任务所在地" name="ManufacturerID6">
              <Cascader options={props.cityInfoList} placeholder="请选择" changeOnSelect showSearch disabled={type == 2} />
            </Form.Item>
          </Spin>
        </Col>
        <Col span={12}>
          <Form.Item label="任务开始/结束日期" name="ManufacturerID7">
            <RangePicker_ format='YYYY-MM-DD' disabled={type == 2} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="任务概述" name="ManufacturerID7">
            <TextArea placeholder='请输入' disabled={type == 2} />
          </Form.Item>
        </Col>
        {/* <Col span={12} ></Col> */}
        <Col span={24}>
          <Form.Item style={{ marginLeft: 130 }}>
            <Button type='primary' htmlType='submit' loading={props.basicInfoTaskLoading}>保存</Button>
            <Button style={{ margin: '0 8px' }} disabled={!taskId} onClick={() => { setAddTaskModelTabType('2') }}>下一步</Button>
            {taskAddVisible && <span className='red'>*注：保存基本信息之后才能添加运维项</span>}
          </Form.Item>
        </Col>
      </Row>
    </Form>
  }
  const basicInfoSave = async () => {
    try {
      const values = await basicInfoform.validateFields();
      props.bWWebService({
        functionName: 'M_InsertOperationTask', //保存基本信息
        paramList: {
          ...values,
        }
      })
    } catch (errInfo) {
      console.log('错误信息:', errInfo);
    }
  }
  const taskReportColumns = [
    {
      title: '序号',
      dataIndex: 'ID',
      key: 'ID',
      align: 'center',
    },
    {
      title: '报告名称',
      dataIndex: 'RWMC',
      key: 'RWMC',
      align: 'left',
      ellipsis: true,
    },
    {
      title: '报告类别',
      dataIndex: 'RWBH',
      key: 'RWBH',
      width: 100,
    },
    {
      title: '附件',
      dataIndex: 'RWMC',
      key: 'RWMC',
      align: 'left',
      ellipsis: true,
      render: (text, row, index) => {
      }
    },
    {
      title: '添加时间',
      dataIndex: 'RWRQKS',
      key: 'RWRQKS',
      align: 'center',
      width: 150,
    },
    {
      title: '操作',
      align: 'center',
      width: 120,
      render: (text, row, index) => {
      }
    },
  ]
  const [taskReportUploadVisible, setTaskReportUploadVisible] = useState(false)
  const taskReportUploadOk = () => { //上传报告提交

  }
  const taskAbnormalTerminaOk = () => {//异常终止提交

  }
  const uploadProps = {
    name: 'file',
    accept: 'pdf/*',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    beforeUpload: (file) => {
      const fileType = file?.type; //获取文件类型 type  PDF/*
      if (!(/pdf$/g.test(fileType))) {
        message.error(`请上传PDF文件!`);
        return;
      }
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  }
  return (
    <div className={styles.operaTaskSty}>
      <BreadcrumbWrapper>
        <Card title={searchComponents()}>
          <Tabs onChange={(key) => { setTaskType(key) }}>
            <TabPane tab="进行中的任务" key='1'>
              <SdlTable
                loading={tableLoading}
                bordered
                dataSource={tableDatas}
                columns={columns}
                pagination={{
                  pageSize: pageSize,
                  current: pageIndex,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  onChange: handleTableChange,
                }}
              />

            </TabPane>
            <TabPane tab="已完结的任务" key='2'>
              <SdlTable
                loading={tableLoading2}
                bordered
                dataSource={tableDatas2}
                columns={columns}
                pagination={{
                  pageSize: pageSize2,
                  current: pageIndex2,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  onChange: handleTableChange2,
                }}
              />
            </TabPane>
          </Tabs>
        </Card>
      </BreadcrumbWrapper>
      <Modal
        title={'添加任务'}
        visible={taskAddVisible}
        onCancel={() => { setTaskAddVisible(false) }}
        className={styles.addFromModal}
        destroyOnClose
        wrapClassName='spreadOverModal'
        okText='提交'
        onOk={taskOk}
        confirmLoading={false}
      >
        <Tabs tabPosition="left" activeKey={addTaskModelTabType} onChange={(key) => { setAddTaskModelTabType(key) }}>
          <TabPane tab="基础信息" key='1'>
            {taskBasicInfoForm(1)}

          </TabPane>
          <TabPane tab="运维项" key='2' disabled={!taskId} >
            {taskAddEditDetailTab(1)}
          </TabPane>
        </Tabs>
      </Modal>
      <Modal
        title={taskTitle}
        visible={taskEditVisible}
        confirmLoading={loadingEditConfirm}
        onCancel={() => { setTaskEditVisible(false) }}
        className={styles.fromModal}
        destroyOnClose
        wrapClassName='spreadOverModal'
        okText='提交'
        onOk={taskOk}
      >
        {taskAddEditDetailTab(2)}
      </Modal>
      <Modal
        title={taskTitle}
        visible={taskDetailVisible}
        onCancel={() => { setTaskDetailVisible(false) }}
        className={styles.addFromModal}
        destroyOnClose
        wrapClassName='spreadOverModal'
        footer={null}
      >
        {taskBasicInfoForm(2)}
        {taskAddEditDetailTab(3)}
      </Modal>
      <Modal
        title={taskReportTitle}
        visible={taskReportVisible}
        onCancel={() => { setTaskReportVisible(false) }}
        destroyOnClose
        wrapClassName='spreadOverModal'
        footer={null}
      >
        <Button type='primary' style={{ marginBottom: 8 }} onClick={() => { setTaskReportUploadVisible(true) }}>添加</Button>
        {/* <SdlTable dataSource={[]} loading={false} columns={taskReportColumns}/>      */}
      </Modal>
      <Modal
        title={`${taskReportTitle}添加`}
        visible={taskReportUploadVisible}
        onCancel={() => { setTaskReportUploadVisible(false) }}
        className={styles.taskReportUploadformModal}
        destroyOnClose
        width='80%'
        okText='提交'
        onOk={taskReportUploadOk}
      >
        <Form
          form={taskReportUploadform}
          name="task_report_upload_form"
          initialValues={{
          }}
        >
          <Form.Item label="上传报告名称" name="ManufacturerID3">
            <Input placeholder='请输入' allowClear style={{ width: 300 }} />
          </Form.Item>
          <Form.Item label="报告类别" name="ManufacturerID23" rules={[{ required: true, message: '请续租你咋报告类别', }]}>
            <Select placeholder='请选择' style={{ width: 300 }}>
              <Option key={1} value={1}>季度</Option>
              <Option key={2} value={2}>半年</Option>
              <Option key={3} value={3}>年</Option>
            </Select>
          </Form.Item>
          <Form.Item label="附件" name="ManufacturerID142">
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>上传报告</Button>
            </Upload>
          </Form.Item>
          <Form.Item label="描述" name="ManufacturerID142">
            <TextArea placeholder='请输入' allowClear />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={taskAbnormalTerminaTitle}
        visible={taskAbnormalTerminaVisible}
        onCancel={() => { setTaskAbnormalTerminaVisible(false) }}
        className={styles.taskAbnormalTerminaModal}
        destroyOnClose
        width='80%'
        okText='提交'
        onOk={taskAbnormalTerminaOk}
      >
        <Form
          form={taskAbnormalTerminaform}
          name="task_abnorma_termina_form"
          initialValues={{
          }}
        >
          <Form.Item label="终止时间" name="ManufacturerID3">
            <RangePicker_ format='YYYY-MM-DD' style={{ width: 300 }} disabled={planModalType === 'detail'} />
          </Form.Item>
          <Form.Item label="终止描述" name="ManufacturerID142">
            <TextArea placeholder='请输入' allowClear />
          </Form.Item>
          <Form.Item label="终止附件" name="ManufacturerID14332">
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>终止报告</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={'点位添加'}
        visible={addPointVisible}
        onCancel={() => { setAddPointVisible(false) }}
        className={styles.fromModal}
        destroyOnClose
        width='85%'
        onOk={() => addPointOk()}
        confirmLoading={props.addPointLoading}
      >
        <TableTransfer leftColumns={pointColumns} rightColumns={pointColumns} scroll={{ y: 'calc(100vh - 480px)' }} bordered={false} dataSource={pointList} loading={props.pointListLoading} targetKeys={pointTargetKeys} onChange={(checked) => { setPointTargetKeys(checked) }} showSearch filterOption={(inputValue, item) => item.MC.indexOf(inputValue) !== -1 || item.ADDRESS.indexOf(inputValue) !== -1} />
      </Modal>
      <Modal
        title={'人员添加'}
        visible={addOperaUserVisible}
        onCancel={() => { setAddOperaUserVisible(false) }}
        className={styles.operaUserFormModal}
        destroyOnClose
        width='85%'
        onOk={() => addOperaUserOk(operaUserList)}
      >
        <TableTransfer
          leftColumns={operaUserColumns()} rightColumns={operaUserColumns()} scroll={{ y: 'calc(100vh - 480px)' }}
          bordered={false} dataSource={operaUserList} loading={props.operaUserListLoading} targetKeys={operaUserTargetKeys} onChange={(checked) => { setOperaUserTargetKeys(checked) }} showSearch filterOption={(inputValue, item) => item.XM.indexOf(inputValue) !== -1 || item.XB.indexOf(inputValue) !== -1 || item.XL.indexOf(inputValue) !== -1}
          pagination={{
            current: addOperaUserPageIndex,
            pageSize: addOperaUserPageSize,
            showSizeChanger: true,
            onChange: (PageIndex, PageSize) => {
              setAddOperaUserPageIndex(PageIndex)
              setAddOperaUserPageSize(PageSize)
            },
          }}
        />
      </Modal>
      <Modal
        title={'设备添加'}
        visible={addOperaDeviceVisible}
        onCancel={() => { setAddOperaDeviceVisible(false) }}
        className={styles.deviceFormModal}
        destroyOnClose
        width='85%'
        onOk={() => addOperaDeviceOk(operaDeviceList)}
      >
        <TableTransfer
          leftColumns={(operaDeviceColumns())} rightColumns={operaDeviceColumns()} scroll={{ y: 'calc(100vh - 480px)' }}
          bordered={false} dataSource={operaDeviceList} loading={props.operaDeviceListLoading} targetKeys={operaDeviceTargetKeys} onChange={(checked) => { setOperaDeviceTargetKeys(checked) }} showSearch filterOption={(inputValue, item) => item.SBBH.indexOf(inputValue) !== -1 || item.SBMC.indexOf(inputValue) !== -1 || item.CCBH.indexOf(inputValue) !== -1 || item.XH_GE.indexOf(inputValue) !== -1}
          pagination={{
            current: addOperaDevicePageIndex,
            pageSize: addOperaDevicePageSize,
            showSizeChanger: true,
            onChange: (PageIndex, PageSize) => {
              setAddOperaDevicePageIndex(PageIndex)
              setAddOperaDevicePageIndex(PageSize)
            },
          }}
        />
      </Modal>
      <Modal
        title={'计划添加'}
        visible={addOperaPlanVisible}
        onCancel={() => { setAddOperaPlanVisible(false) }}
        className={styles.addPlanFormModal}
        destroyOnClose
        width='85%'
        onOk={taskPlanOk}
        confirmLoading={props.operationTaskLoading}
      >
        <Form
          form={planform}
          name="plan_form"
          initialValues={{
          }}
          className={styles.fromModal}
        >
          <Form.Item label="计划标题" name="JHBT" rules={[{ required: true, message: '请输入计划标题', }]}>
            <Input placeholder='请输入' allowClear style={{ width: 300 }} disabled={planModalType === 'detail'} />
          </Form.Item>
          <Form.Item label="执行" name="JHZX" rules={[{ required: true, message: '请选择执行', }]}>
            <Select placeholder='请选择' style={{ width: 150 }} disabled={planModalType === 'detail'}>
              <Option key={'周'} value={'周'}>周</Option>
              <Option key={'月'} value={'月'}>月</Option>
            </Select>
          </Form.Item>
          <Form.Item label="间隔" name="JHJG" rules={[{ required: true, message: '请输入间隔', }]}>
            <InputNumber placeholder='请输入' style={{ width: 150 }} allowClear disabled={planModalType === 'detail'} />
          </Form.Item>
          <Form.Item label="计划开始/结束日期" name="time" rules={[{ required: true, message: '请选择计划开始/结束日期', }]}>
            <RangePicker_ format='YYYY-MM-DD' style={{ width: 300 }} disabled={planModalType === 'detail'} />
          </Form.Item>

          <Form.Item label="运维内容" name="DETAIL">
            {props.operaContantListloading ? <Spin size='small' />
              : <Checkbox.Group options={props.operaContantList} disabled={planModalType === 'detail'} />
            }
          </Form.Item>
          <Form.Item label="计划描述" name="JHMR">
            <TextArea placeholder='请输入' allowClear disabled={planModalType === 'detail'} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);