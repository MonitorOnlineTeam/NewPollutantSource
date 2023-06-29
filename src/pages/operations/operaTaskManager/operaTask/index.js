/**
 * 功  能：运维任务管理
 * 创建人：jab
 * 创建时间：2023.05
 */
import React, { useState, useEffect, Fragment, useDebugValue } from 'react';
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
import { getBase64, } from '@/utils/utils';
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
  tableDatas3: operaTask.tableDatas3,
  tableLoading3: operaTask.tableLoading3,
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
  basicInfoTaskLoading: operaTask.basicInfoTaskLoading,
  taskId: operaTask.taskId,
  addPointLoading: operaTask.addPointLoading,
  addOperaUserLoading: operaTask.addOperaUserLoading,
  addOperaDeviceLoading: operaTask.addOperaDeviceLoading,
  operationTaskPlanLoading: operaTask.operationTaskPlanLoading,
  taskSubmitLoading: operaTask.taskSubmitLoading,
  taskUploadReportLoading: operaTask.taskUploadReportLoading,
  taskAbnormalTerminaLoading: operaTask.taskAbnormalTerminaLoading,
  endTaskLoading: operaTask.endTaskLoading,
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
  const [basicInfoformDetail] = Form.useForm();
  const [planform] = Form.useForm();
  const [taskReportUploadform] = Form.useForm();
  const [taskAbnormalTerminaform] = Form.useForm();


  const [taskType, setTaskType] = useState('3')

  const [addTaskModelTabType, setAddTaskModelTabType] = useState('1')







  const { tableDatas, tableLoading, tableDatas2, tableLoading2, tableDatas3, tableLoading3, taskSubmitLoading, contractTableData, contractTableAllData, taskDetailData, pointList, operaUserList, operaDeviceList, taskId, taskDetailLoading, taskTypeList, endTaskLoading, basicInfoTaskLoading, } = props;
  useEffect(() => {
    initData();
    props.bWWebService({  functionName: 'M_OpenationTaskType',})//任务类别
    props.bWWebService({ functionName: 'Z_CityInfo' }) //任务所在地
    props.bWWebService({functionName: 'C_GetALLContractList',}) //合同列表
  }, []);

  const initData = () => {
    onFinish(1);
    onFinish2(1)
    onFinish3(1)
  }
  const columns = [
    {
      title: '序号',
      align: 'center',
      render: (text, record, index) => {
        return taskType === '1' ? (index + 1) + (pageIndex - 1) * pageSize : taskType === '2' ? (index + 1) + (pageIndex2 - 1) * pageSize2 : (index + 1) + (pageIndex3 - 1) * pageSize3;
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
      width: taskType == 2 ? 80 : taskType == 3 ? 100 : 160,
      fixed: 'right',
      render: (text, record) => {
        return <>
          {taskType == 1 && <Fragment>
            <a style={{ paddingRight: 8  }} onClick={() => { taskUploadReport(record) }} >上传报告</a>
          </Fragment>}
          {taskType == 3 && <Fragment>
            <a style={{ paddingRight: 8 }} onClick={() => { taskEdit(record) }} >任务编辑</a>
          </Fragment>}
          {taskType == 1 && <Fragment>
            <Popconfirm title="您确定要完结此运维任务吗？" style={{ paddingRight: 5 }} onConfirm={() => { endTask(record) }} okText="是" cancelText="否">
              <a style={{ paddingRight: 8, whiteSpace: 'nowrap' }}>任务完结</a>
            </Popconfirm>
          </Fragment>}
          <Fragment>
            <a style={{ paddingRight: 8 , whiteSpace: 'nowrap'}} onClick={() => { taskDetail(record) }} >任务详情</a>
          </Fragment>
          {taskType == 1 && <Fragment>
            <a style={{ paddingRight: 8 , whiteSpace: 'nowrap'}} onClick={() => { taskAbnormalTermina(record) }} >异常终止</a>
          </Fragment>}
        </>
      }
    },
  ];
  const restOperaList = (value) => {
    setPointTargetKeys([]);
    if (value === rememTaskCategoryId) {
      setAddPointList(rememPointList); setAllAddPointList(rememPointList);
    } else {
      setAddPointList([]); setAllAddPointList([]);
    }
    setOperaUserTargetKeys([]);
    // setAddOperaUserList([]);setAllAddOperaUserList([]);
    setOperaDeviceTargetKeys([]);
    // setAddOperaDeviceList([]); setAllAddOperaDeviceList([]);
    // setAddOperaPlanList([]); setAllAddOperaPlanList([]);
    setContractSearchVal('');
    setAddPointSearchVal('');
    setAddOperaUserSearchVal('');
    setAddDeviceSearchVal('');
    setAddPlanSearchVal('');
  }
  const restData = () => {
    props.updateState({ taskId: undefined })
    restOperaList();
    basicInfoform.resetFields();
    planform.resetFields();
  }
  const taskDataFormat = (name, addData, type, isFirstLoad) => { //格式化添加运维项数据 type 1添加 2编辑 3详情
    if (type == 1) { //添加
      return addData;
    } else { //编辑或详情
      let arrData = [];
      if (isFirstLoad) { //编辑详情首次加载
        if (addData[0] && addData[0][name] && addData[0][name].Item) {
          let data = addData[0][name].Item;
          data instanceof Array ? arrData = data : arrData.push(data)
          return arrData;
        } else {
          return [];
        }
      } else {
        let data = taskDetailData?.[0]?.[name]?.Item;
        data ? data instanceof Array ? arrData = data : arrData.push(data) : undefined
        return type == 2 ? [...arrData, ...addData] : arrData;
      }
    }
  }
  const [taskAddVisible, setTaskAddVisible] = useState(false)
  const [taskOperateType, setTaskOperateType] = useState(1)
  const taskAdd = () => {//任务添加
    setTaskAddVisible(true)
    basicInfoform.resetFields()
    setTaskOperateType(1)
    restData();
  }
  const [taskTitle, setTaskTitle] = useState()
  const [taskEditVisible, setTaskEditVisible] = useState(false)
  const [taskOTID, setTaskOTID] = useState(false)

  const taskEdit = async (record) => {  //任务编辑
    setTaskEditVisible(true)
    setTaskOperateType(2)
    basicInfoform.resetFields()
    setTaskTitle(` ${record.RWMC} - 任务编辑`)
    setTaskOTID(record.OTID)
    getTaskDetailData(record.ID, 2)
  };
  const [taskDetailVisible, setTaskDetailVisible] = useState(false)
  const taskDetail = async (record) => {  //任务详情
    setTaskDetailVisible(true)
    setTaskOperateType(3)
    basicInfoformDetail.resetFields()
    setTaskTitle(`${record.RWMC} - 任务详情`)
    getTaskDetailData(record.ID, 3)
  };
  const [rememTaskCategoryId, setRememTaskCategoryId] = useState()
  const [rememPointList, setRememPointList] = useState([])

  const getTaskDetailData = (id, type) => {
    props.bWWebService({ //任务详情信息
      functionName: 'M_GetOperationTaskByID',
      paramList: {
        OPTID: id,
      }
    }, (data) => {
      props.updateState({ taskId: id })
      const pointData = taskDataFormat('SCHEMES', data, type, 'firstLoad')
      const operaUserData = taskDataFormat('WORKERS', data, type, 'firstLoad')
      const operaDeviceData = taskDataFormat('DEVICES', data, type, 'firstLoad')
      const operaPlanData = taskDataFormat('PLANS', data, type, 'firstLoad')
      setAddPointList(pointData); setAllAddPointList(pointData)
      setAddOperaUserList(operaUserData); setAllAddOperaUserList(operaUserData)
      setAddOperaDeviceList(operaDeviceData); setAllAddOperaDeviceList(operaDeviceData)
      setAddOperaPlanList(operaPlanData); setAllAddOperaPlanList(operaPlanData)
      type == 2 ? setRememPointList(pointData) : setRememPointList([]) //记住监测点列表
      const echoData = data && data[0]
      if(type==2){ //编辑
        echoData && basicInfoform.setFieldsValue({
          ...echoData,
          location: [echoData.PROVINCE, echoData.CITY, echoData.DISTRICT],
          time: echoData.RWRQKS && echoData.RWRQJS ? [moment(echoData.RWRQKS), moment(echoData.RWRQJS)] : [] ,
        })
      }else{ //详情
        echoData && basicInfoformDetail.setFieldsValue({
          ...echoData,
          location:  `${echoData.PROVINCE}${echoData.CITY ? '/' + echoData.CITY : ''}${echoData.DISTRICT ? '/' + echoData.DISTRICT : ''}`,
          time:  `${echoData.RWRQKS}至${echoData.RWRQJS}`,
        })
      }

      type == 2 ? echoData && setRememTaskCategoryId(echoData.OTID) : setRememTaskCategoryId() //编辑 记住任务类别 任务类别切换 任务监测点会清空 

    })
  }

  const endTask = (record) => { //完结任务
    props.bWWebService({
      functionName: 'M_OperationTaskEnd',
      paramList: {
        OPTID: record.ID,
      }
    }, () => {
      setTaskType('2')
      onFinish(1);
      onFinish2(1);
    })
  }
  const [taskAbnormalTerminaTitle, setTaskAbnormalTerminaTitle] = useState()
  const [taskAbnormalTerminaVisible, setTaskAbnormalTerminaVisible] = useState(false)
  const taskAbnormalTermina = (record) => { //异常终止
    setTaskAbnormalTerminaVisible(true)
    setTaskAbnormalTerminaTitle(`${record.RWMC} - 异常终止`)
    setReportTerminaTaskId(record.ID)
    taskAbnormalTerminaform.resetFields()
    setFileList([])
  }
  const taskOk = async () => { //任务提交

    try {
      const values = await basicInfoform.validateFields();//触发校验
      props.bWWebService({
        functionName: 'M_SubmitOperationTask',
        paramList: {
          ID: taskId,
        }
      }, () => {
        taskAddVisible ? setTaskAddVisible(false) : setTaskEditVisible(false);
        setTaskType('1')
        onFinish(1)
        onFinish3(1)
      })
    } catch (errInfo) {
      console.log('错误信息:', errInfo);
    }
  }
  const onFinish = (pageIndexs) => {  //查询 进行中的任务
    const values = form.getFieldsValue();
    setPageIndex(pageIndexs); //除编辑  每次查询页码重置为第一页
    props.bWWebService({
      functionName: 'M_GetALLOperationTask',
      ...values,
      // pageIndex: pageIndexs,
      // pageSize: pageSize,
    })
  }
  const onFinish2 = (pageIndexs) => {  //查询 已完结的任务

    const values = form.getFieldsValue();
    setPageIndex2(pageIndexs);
    props.bWWebService({
      functionName: 'M_GetOperationTaskDone',
      ...values,
    })
  }

  const onFinish3 = (pageIndexs) => {  //查询 未提交的任务

    const values = form.getFieldsValue();
    setPageIndex3(pageIndexs);
    props.bWWebService({
      functionName: 'M_GetALLOperationTaskUnSubmited',
      ...values,
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

  const [pageIndex3, setPageIndex3] = useState(1)
  const [pageSize3, setPageSize3] = useState(20)
  const handleTableChange3 = (PageIndex, PageSize) => { //分页 未提交的任务
    setPageIndex3(PageIndex)
    setPageSize3(PageSize)
  }
  const searchComponents = () => {
    return <Form
      form={form}
      name="advanced_search"
      initialValues={{
        // Status:1
      }}
      className={styles["ant-advanced-search-form"]}
      onFinish={() => { taskType === '1' ? onFinish(1) : taskType === '2' ? onFinish2(1) : onFinish3(1) }}
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
        <Input placeholder='关键字'
          value={contractSearchVal}
          onChange={(e) => {
            const val = e.target.value; setContractSearchVal(val)
            if (val) {
              const data = contractTableAllData.filter((item) => item.ID.indexOf(val) != -1 || item.BT.indexOf(val) != -1 || item.XZ.indexOf(val) != -1); props.updateState({ contractTableData: data })
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
            if (selectedRowKeys && selectedRowKeys.toString()) {
              basicInfoform.setFieldsValue({ CID: selectedRowKeys.toString() })
              setContractVisible(false)
              console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            }

          },
          // selectedRowKeys: basicInfoform.getFieldValue('contractId'),
        }}
      />
    </>
  }
  const [contractVisible, setContractVisible] = useState(false)
  const contractVisibleChange = (newVisible) => {
    setContractVisible(newVisible)
    setContractSearchVal('')
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
      OTID: taskOTID,
    })
  }
  const [addPointList, setAddPointList] = useState([])
  const [addAllPointList, setAllAddPointList] = useState([])
  const addPointOk = () => {
    if (!(pointTargetKeys && pointTargetKeys[0])) {
      message.error('请选择运维点位')
      return
    }
    props.bWWebService({ //点位添加
      functionName: 'M_InsertOperationTaskScheme',
      xmlParamList: pointTargetKeys.map(item => ({
        OPTID: taskId,
        OTSID: item,
      }))
    }, () => {
      const data = [];
      pointList.map(item => {
        pointTargetKeys.map(item2 => {
          if (item.key == item2) { data.push(item) }
        })
      })
      const list = taskDataFormat('SCHEMES', data, taskOperateType)
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
    setAddOperaUserPageIndex(1)
    setAddOperaUserPageSize(20)
    props.bWWebService({ //运维人员
      functionName: 'B_GetALLWorkersList',
    })
  }
  const [addOperaUserList, setAddOperaUserList] = useState([])
  const [addAllOperaUserList, setAllAddOperaUserList] = useState([])

  const addOperaUserOk = () => {
    if (!(operaUserTargetKeys && operaUserTargetKeys[0])) {
      message.error('请选择运维人员')
      return
    }
    props.bWWebService({ //运维人员添加
      functionName: 'M_InsertOperationTaskWorkers',
      xmlParamList: operaUserTargetKeys.map(item => ({
        OTID: taskId,
        OWID: item,
      }))
    }, () => {
      const data = [];
      operaUserList.map(item => {
        operaUserTargetKeys.map(item2 => {
          if (item.key == item2) { data.push(item) }
        })
      })
      const list = taskDataFormat('WORKERS', data, taskOperateType)
      setAddOperaUserList(list)
      setAllAddOperaUserList(list)
      setAddOperaUserVisible(false)
    })

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
      width: 120,
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
    setAddOperaDevicePageIndex(1)
    setAddOperaDevicePageSize(20)
    props.bWWebService({ //运维设备
      functionName: 'B_GetALLDevicesList',
    })
  }
  const [addOperaDeviceList, setAddOperaDeviceList] = useState([])
  const [addAllOperaDeviceList, setAllAddOperaDeviceList] = useState([])

  const addOperaDeviceOk = () => {
    if (!(operaDeviceTargetKeys && operaDeviceTargetKeys[0])) {
      message.error('请选择运维设备')
      return
    }
    props.bWWebService({ //运维设备添加
      functionName: 'M_InsertOperationTaskDevices',
      xmlParamList: operaDeviceTargetKeys.map(item => ({
        OTID: taskId,
        ODID: item,
      }))
    }, () => {
      const data = [];
      operaDeviceList.map(item => {
        operaDeviceTargetKeys.map(item2 => {
          if (item.key == item2) { data.push(item) }
        })
      })
      const list = taskDataFormat('DEVICES', data, taskOperateType)
      setAddOperaDeviceList(list)
      setAllAddOperaDeviceList(list)
      setAddOperaDeviceVisible(false)
    })
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
      // width: 'auto',
    },
    {
      title: '计划执行频次',
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
      // width: 260,
      ellipsis: true,
      sorter: (a, b) => moment(a.JHRQJS).valueOf() - moment(b.JHRQJS).valueOf(),
      render: (text, row, index) => {
        return `${row.JHRQKS}至${row.JHRQJS}`
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
  const operaPlanAddDetail = (row) => { // 计划 添加和详情
    setAddOperaPlanVisible(true)
    planform.resetFields()
    row ? setPlanModalType('detail') : setPlanModalType('add')
    if (row) {
      setPlanModalType('detail')
      planform.setFieldsValue({
        ...row,
        // time:`${row.JHRQKS && moment(row.JHRQKS).format('YYYY/MM/DD')}至${row.JHRQJS && moment(row.JHRQJS).format('YYYY/MM/DD')}`,
        time: `${row.JHRQKS}至${row.JHRQJS}`,
      })
    } else {
      setPlanModalType('add')
      planform.resetFields();
    }

    props.bWWebService({ //运维内容
      functionName: 'M_GetOperationDetailList',
      OTID: taskOTID,
    }, () => {
      let list = [];
      if (row) {
        const data = row.Arrays && row.Arrays.Item;
        data && planform.setFieldsValue({
          DETAIL: data instanceof Array ? data.map(item => item.ID) : [data].map(item => item.ID),
        })
        // list = res.filter(item=>item.CYCLE.indexOf(row.JHZX)!=-1)
      }

    })
  }
  const [addOperaPlanList, setAddOperaPlanList] = useState([])
  const [addAllOperaPlanList, setAllAddOperaPlanList] = useState([])
  const taskPlanOk = async () => { //计划添加提交
    try {
      const values = await planform.validateFields();
      props.bWWebService({
        functionName: 'M_InsertOperationTaskPlan',
        xmlParamList: [{
          ...values,
          JHMR: values.JHMR ? values.JHMR : '',
          OPTID: taskId,
          DETAIL: values.DETAIL ? values.DETAIL.join('&') : '',
          JHRQKS: values.time && moment(values.time[0]).format('YYYY-MM-DD'),
          JHRQJS: values.time && moment(values.time[1]).format('YYYY-MM-DD'),
          time: undefined,
        }]
      }, (data) => {
        const list = taskDataFormat('PLANS', data, taskOperateType)
        setAddOperaPlanVisible(false)
        setAddOperaPlanList(list)
        setAllAddOperaPlanList(list)
      })
    } catch (errInfo) {
      console.log('错误信息:', errInfo);
    }
  }
  const [addPointSearchVal, setAddPointSearchVal] = useState('')
  const [addOperaUserSearchVal, setAddOperaUserSearchVal] = useState('')
  const [addDeviceSearchVal, setAddDeviceSearchVal] = useState('')
  const [addPlanSearchVal, setAddPlanSearchVal] = useState('')


  const taskAddEditDetailTab = (type) => {
    return <Tabs type="card">
      <TabPane tab="运维点位" key='1'>
        <Input placeholder='关键字'
          onChange={(e) => {
            const val = e.target.value; setAddPointSearchVal(val)
            if (val) {
              const data = addAllPointList.filter((item) => item.ID && item.ID.indexOf(val) != -1 || item.MC && item.MC.indexOf(val) != -1 || item.ADDRESS && item.ADDRESS.indexOf(val) != -1);
              setAddPointList(data)
            } else { setAddPointList(addAllPointList) }
          }} style={{ width: 200, marginBottom: 8, marginRight: 8 }} allowClear suffix={!addPointSearchVal && <SearchOutlined style={{ color: 'rgba(0, 0, 0, 0.25)' }} />} />
        {type != 3 && <Button type='primary' style={{ marginBottom: 8 }} onClick={addPoint}>添加点位</Button>}
        <SdlTable dataSource={addPointList} columns={pointColumns} />
      </TabPane>
      <TabPane tab="运维人员" key='2'>
        <Input placeholder='关键字'
          onChange={(e) => {
            const val = e.target.value; setAddOperaUserSearchVal(val)
            if (val) {
              const data = addAllOperaUserList.filter((item) => item.XM && item.XM.indexOf(val) != -1 || item.XB && item.XB.indexOf(val) != -1 || item.MC && item.MC.indexOf(val) != -1 || item.XL && item.XL.indexOf(val) != -1 || item.ZW && item.ZW.indexOf(val) != -1);
              setAddOperaUserList(data)
            } else { setAddOperaUserList(addAllOperaUserList) }
          }} style={{ width: 200, marginBottom: 8, marginRight: 8 }} allowClear suffix={!addOperaUserSearchVal && <SearchOutlined style={{ color: 'rgba(0, 0, 0, 0.25)' }} />} />
        {type != 3 && <Button type='primary' style={{ marginBottom: 8 }} onClick={addOperaUser}>添加人员</Button>}
        <SdlTable dataSource={addOperaUserList} columns={operaUserColumns(1)}
          onPageChange={(PageIndex, PageSize) => {
            setOperaUserPageIndex(PageIndex)
            setOperaUserPageSize(PageSize)
          }}
        />
      </TabPane>
      <TabPane tab="运维设备" key='3'>
        <Input placeholder='关键字'
          onChange={(e) => {
            const val = e.target.value; setAddDeviceSearchVal(val)
            if (val) {
              const data = addAllOperaDeviceList.filter((item) => item.SBBH && item.SBBH.indexOf(val) != -1 || item.SBMC && item.SBMC.indexOf(val) != -1 || item.CCBH && item.CCBH.indexOf(val) != -1 || item.XH_GE && item.XH_GE.indexOf(val) != -1 || item.SBMS && item.SBMS.indexOf(val) != -1);
              setAddOperaDeviceList(data)
            } else { setAddOperaDeviceList(addAllOperaDeviceList) }
          }} style={{ width: 200, marginBottom: 8, marginRight: 8 }} allowClear suffix={!addDeviceSearchVal && <SearchOutlined style={{ color: 'rgba(0, 0, 0, 0.25)' }} />} />
        {type != 3 && <Button type='primary' style={{ marginBottom: 8 }} onClick={addOperaDevice}>添加设备</Button>}
        <SdlTable dataSource={addOperaDeviceList} columns={operaDeviceColumns(1)}
          onPageChange={(PageIndex, PageSize) => {
            setDeviceListPageIndex(PageIndex)
            setDeviceListPageSize(PageSize)
          }}
        />
      </TabPane>
      <TabPane tab="运维计划" key='4'>
        <Input placeholder='关键字'
          onChange={(e) => {
            const val = e.target.value; setAddPlanSearchVal(val)
            if (val) {
              const data = addAllOperaPlanList.filter((item) => item.JHBT && item.JHBT.indexOf(val) != -1 || item.JHZX && item.JHZX.indexOf(val) != -1)
              setAddOperaPlanList(data)
            } else { setAddOperaPlanList(addAllOperaPlanList) }
          }} style={{ width: 200, marginBottom: 8, marginRight: 8 }} allowClear suffix={!addPlanSearchVal && <SearchOutlined style={{ color: 'rgba(0, 0, 0, 0.25)' }} />} />
        {type != 3 && <Button type='primary' style={{ marginBottom: 8 }} onClick={() => operaPlanAddDetail()}>添加计划</Button>}
        <SdlTable dataSource={addOperaPlanList} columns={operaPlanColumns}
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
      name="basic_form"
      initialValues={{
        ID: '0',
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
            onVisibleChange={(newVisible) => contractVisibleChange(newVisible)}
            // getPopupContainer={trigger => trigger.parentNode}
            overlayClassName={styles.contractPopoverSty}
            placement='bottomLeft'
          >
            <Form.Item label="合同名称" name="CID" className='contractName' rules={[{ required: true, message: '请输入合同名称', }]} >
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
        <Form.Item name="ID" > </Form.Item>
        <Col span={12}>
          <Form.Item label="任务编号" name="RWBH" >
             <Input placeholder='请输入' allowClear />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="任务名称" name="RWMC" rules={[{ required: true, message: '请输入任务名称', }]}>
             <TextArea rows={1} placeholder='请输入' allowClear showCount maxLength={128} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Spin spinning={props.taskTypeListLoading} size='small'>
            <Form.Item label="任务类别" name="OTID" rules={[{ required: true, message: '请选择任务类别', }]}>
               <Select allowClear showSearch placeholder='请选择'
                onChange={(value) => {
                  setTaskOTID(value)
                  restOperaList(value);
                }}>
                {taskTypeList.map(item =>
                  <Option key={item.ID} value={item.ID}>
                    {item.NAME}
                  </Option>
                )}
              </Select>
            </Form.Item>
          </Spin>
        </Col>
        <Col span={12}>
          <Form.Item label="任务来源" name="RWLY" rules={[{ required: true, message: '请选择任务来源', }]}>
             <Select placeholder='请选择' disabled={type == 2}>
              <Option key={'政府委托'} value={'政府委托'}> 政府委托 </Option>
              <Option key={'社会委托'} value={'社会委托'}> 社会委托 </Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Spin spinning={props.cityInfoListLoading} size='small'>
            <Form.Item label="任务所在地" name="location">
              <Cascader options={props.cityInfoList} placeholder="请选择" changeOnSelect showSearch />
            </Form.Item>
          </Spin>
        </Col>
        <Col span={12}>
          <Form.Item label="任务开始/结束日期" name="time" rules={[{ required: true, message: '请选择任务开始/结束日期', }]}>
           <RangePicker_ format='YYYY-MM-DD' />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="任务概述" name="RWGS">
            <TextArea placeholder='请输入' />
          </Form.Item>
        </Col>
        {type == 1 && <Col span={24}>
          <Form.Item style={{ marginLeft: 130 }}>
            <Button type='primary' htmlType='submit' loading={basicInfoTaskLoading}>保存</Button>
            <Button style={{ margin: '0 8px' }} disabled={!taskId} onClick={() => { nextStep() }}>下一步</Button>
            {taskAddVisible && <span className='red'>*注：保存基本信息之后才能添加运维项</span>}
          </Form.Item>
        </Col>}
      </Row>
    </Form>
  }
  const taskBasicInfoFormDetail = () => {
    return <Form
      className={styles.fromModal}
    >
      <Row>
        <Col span={12}>
            <Form.Item label="合同名称" name="CID" className='contractName' rules={[{ required: true, message: '请输入合同名称', }]} >
              {contractTableAllData.filter(item => item.ID == basicInfoformDetail.getFieldValue('CID')) && contractTableAllData.filter(item => item.ID == basicInfoformDetail.getFieldValue('CID'))[0] && contractTableAllData.filter(item => item.ID == basicInfoformDetail.getFieldValue('CID'))[0].BT}
            </Form.Item>
        </Col>
        <Form.Item name="ID" > </Form.Item>
        <Col span={12}>
          <Form.Item label="任务编号" name="RWBH" >
            {basicInfoformDetail.getFieldValue('RWBH')}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="任务名称" name="RWMC" rules={[{ required: true, message: '请输入任务名称', }]}>
            {basicInfoformDetail.getFieldValue('RWBH')}
          </Form.Item>
        </Col>
        <Col span={12}>
            <Form.Item label="任务类别" name="OTID" rules={[{ required: true, message: '请选择任务类别', }]}>
             {taskTypeList.filter(item => item.ID == basicInfoformDetail.getFieldValue('OTID')) && taskTypeList.filter(item => item.ID == basicInfoformDetail.getFieldValue('OTID'))[0] && taskTypeList.filter(item => item.ID == basicInfoformDetail.getFieldValue('OTID'))[0].NAME}
            </Form.Item>
      
        </Col>
        <Col span={12}>
          <Form.Item label="任务来源" name="RWLY" rules={[{ required: true, message: '请选择任务来源', }]}>
            { basicInfoformDetail.getFieldValue('RWLY') }
          </Form.Item>
        </Col>
        <Col span={12}>
          <Spin spinning={props.cityInfoListLoading} size='small'>
            <Form.Item label="任务所在地" name="location">
              { basicInfoformDetail.getFieldValue('location')}
            </Form.Item>
          </Spin>
        </Col>
        <Col span={12}>
          <Form.Item label="任务开始/结束日期" name="time" rules={[{ required: true, message: '请选择任务开始/结束日期', }]}>
            {  basicInfoformDetail.getFieldValue('time')} 
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="任务概述" name="RWGS">
            { basicInfoformDetail.getFieldValue('RWGS')}
          </Form.Item>
        </Col>
      </Row>
    </Form>
  }
  const basicInfoSave = async () => {
    try {
      const values = await basicInfoform.validateFields();
      const location = values.location;
      props.bWWebService({
        functionName: 'M_InsertOperationTask', //保存基本信息
        paramList: {
          ...values,
          RWRQKS: values.time && moment(values.time[0]).format('YYYY-MM-DD'),
          RWRQJS: values.time && moment(values.time[1]).format('YYYY-MM-DD'),
          PROVINCE: location && location[0],
          CITY: location && location[1],
          DISTRICT: location && location[2],
          location: undefined,
          time: undefined,
        }
      }, () => {
        onFinish3(1)
      })
    } catch (errInfo) {
      console.log('错误信息:', errInfo);
    }
  }
  const nextStep = () => {
    basicInfoform.validateFields().then(() => {
      setAddTaskModelTabType('2')
    })
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
      render: (text, record, index) => {
        return <>
          <a style={{ paddingRight: 8 }} onClick={() => taskReportUploadEdit(record)}>编辑</a>
          <a onClick={() => taskReportUploadDel(record)}>删除</a>
        </>
      }
    },
  ]
  const taskReportUploadAdd = () => {
    setTaskReportUploadVisible(true)
    setTaskReportTitle(`添加 - 上传报告`)
    taskReportUploadform.resetFields()
    setFileList([])
  }

  const taskReportUploadEdit = (record) => {
    setTaskReportUploadVisible(true)
    setTaskReportTitle(`${record.RWMC} - 上传报告`)
    setReportTerminaTaskId(record.ID)
    taskReportUploadform.resetFields()
    setFileList([])
  }
  const taskReportUploadDel = (record) => {

  }
  const [taskReportTitle, setTaskReportTitle] = useState()
  const [taskReportVisible, setTaskReportVisible] = useState(false)
  const [reportTerminaTaskId, setReportTerminaTaskId] = useState('')
  const taskUploadReport = (record) => { //上传报告
    setTaskReportVisible(true)
    setReportTerminaTaskId(record.ID)
  };
  const [taskReportUploadVisible, setTaskReportUploadVisible] = useState(false)
  const taskReportUploadOk = async () => { //上传报告提交
    try {
      const values = await taskReportUploadform.validateFields();
      props.bWWebService({
        functionName: 'M_AddOperationTaskReport', //保存基本信息
        paramList: {
          ...values,
          OPTID: reportTerminaTaskId,
        }
      }, () => {
        setTaskReportUploadVisible(false);
        setTaskType('3')
        onFinish3(1);
      })
    } catch (errInfo) {
      console.log('错误信息:', errInfo);
    }
  }
  const taskAbnormalTerminaOk = async () => {//异常终止提交
    try {
      const values = await taskAbnormalTerminaform.validateFields();
      props.bWWebService({
        functionName: 'M_OperationTaskAbortEnd',
        paramList: {
          ...values,
          END_DATE: values.END_DATE && moment(values.END_DATE).format('YYYY-MM-DD'),
          OPTID: reportTerminaTaskId,
        }
      }, () => {
        setTaskAbnormalTerminaVisible(false);
         onFinish(1)
      })
    } catch (errInfo) {
      console.log('错误信息:', errInfo);
    }
  }

  const [fileList, setFileList] = useState([])

  const [fileLoading, setFileLoading] = useState(false)
  const uploadProps = (type) => ({
    accept: '.pdf',
    showUploadList: {
      showRemoveIcon: false,
    },
    fileList: fileList,
    customRequest: ({ action, data, file, filename, headers, onError, onProgress, onSuccess, withCredentials, }) => {
      const fileType = file?.type; //获取文件类型 type  PDF/*
      if (!(/pdf$/g.test(fileType))) {
        message.error(`请上传pdf文件!`);
        return false;
      }
      file.status = 'uploading'
      setFileLoading(true)
      setFileList([file])
      props.bWWebService({
        functionName: 'CreateFile', //创建文件
        paramList: {
          fileName: file.name,
          fileType: type,
        }
      }, async (data) => {
        const fileBuffer = await getBase64(file);
        data.message ? props.bWWebService({
          functionName: 'AppendFile', //添加文件
          paramList: {
            fileNameNew: data.message,
            fileType: type,
            buffer: fileBuffer.replace(/^data:application\/\w+;base64,/, ''),
          }
        }, (isSuccess) => {
          setFileLoading(false)
          if (isSuccess) {
            message.success('上传成功');
            file.status = 'done';
            setFileList([file])
            // setFileList([{...file, name: file.name, url:fileBuffer}])
            if (type == 7) {
              taskReportUploadform.setFieldsValue({ FILENAMEOLD: data.message, FILENAME: file.name, })
            } else {
              taskAbnormalTerminaform.setFieldsValue({ FILENAMEOLD: data.message, FILENAME:file.name ,  })
            }
          } else {
            file.status = 'error'
            setFileList([])
          }
        }) : setFileLoading(false)
      })
    },

  })
  return (
    <div className={styles.operaTaskSty}>
      <BreadcrumbWrapper>
        <Card title={searchComponents()}>
          <Tabs activeKey={taskType} onChange={(key) => { setTaskType(key) }}>
            <TabPane tab="未提交的任务" key='3'>
              <SdlTable
                loading={tableLoading3 || endTaskLoading}
                bordered
                dataSource={tableDatas3}
                columns={columns}
                pagination={{
                  pageSize: pageSize3,
                  current: pageIndex3,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  onChange: handleTableChange3,
                }}
              />
            </TabPane>
            <TabPane tab="进行中的任务" key='1'>
              <SdlTable
                loading={tableLoading || endTaskLoading}
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
                loading={tableLoading2 || endTaskLoading}
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
        okButtonProps={{
          disabled: !taskId,
        }}
        okText='提交'
        onOk={taskOk}
        confirmLoading={taskSubmitLoading}
      >
        <Tabs tabPosition="left" activeKey={addTaskModelTabType} onChange={(key) => { setAddTaskModelTabType(key) }}>
          <TabPane tab="基础信息" key='1' className='taskBasicInfoTab'>
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
        onCancel={() => { setTaskEditVisible(false) }}
        className={styles.editFromModal}
        destroyOnClose
        wrapClassName='spreadOverModal'
        footer={[
          <Button onClick={() => { setTaskEditVisible(false) }}>取消</Button>,
          <Button type="primary" loading={basicInfoTaskLoading} onClick={basicInfoSave}>保存</Button>,
          <Button type="primary" loading={taskSubmitLoading} onClick={taskOk}>提交</Button>
        ]}
      >
        <Spin spinning={taskDetailLoading}>
          {taskBasicInfoForm(2)}
          {taskAddEditDetailTab(2)}
        </Spin>
      </Modal>
      <Modal
        title={taskTitle}
        visible={taskDetailVisible}
        onCancel={() => { setTaskDetailVisible(false) }}
        className={styles.detailFromModal}
        destroyOnClose
        wrapClassName='spreadOverModal'
        footer={null}
      >
        <Spin spinning={taskDetailLoading}>
          {taskBasicInfoFormDetail(3)}
          {taskAddEditDetailTab(3)}
        </Spin>
      </Modal>
      <Modal
        title={taskReportTitle}
        visible={taskReportVisible}
        onCancel={() => { setTaskReportVisible(false) }}
        destroyOnClose
        wrapClassName='spreadOverModal'
        footer={null}
      >
        <Button type='primary' style={{ marginBottom: 8 }} onClick={() => { taskReportUploadAdd() }}>添加</Button>
        <SdlTable dataSource={[]} loading={false} columns={taskReportColumns} />
      </Modal>
      <Modal
        title={taskReportTitle}
        visible={taskReportUploadVisible}
        onCancel={() => { setTaskReportUploadVisible(false) }}
        className={styles.taskReportUploadformModal}
        destroyOnClose
        width='80%'
        okText='提交'
        onOk={taskReportUploadOk}
        confirmLoading={props.taskUploadReportLoading}
      >
        <Form
          form={taskReportUploadform}
          name="task_report_upload_form"
          initialValues={{
            ID: '0'
          }}
        >
          <Form.Item name="ID" hidden></Form.Item>
          <Form.Item label="上传报告名称" name="NAME" rules={[{ required: true, message: '请输入上传报告名称', }]}>
            <Input placeholder='请输入' allowClear style={{ width: 300 }} />
          </Form.Item>
          <Form.Item label="报告类别" name="TYPE" rules={[{ required: true, message: '请选择报告类别', }]}>
            <Select placeholder='请选择' style={{ width: 300 }}>
              <Option key={'季度'} value={'季度'}>季度</Option>
              <Option key={'半年'} value={'半年'}>半年</Option>
              <Option key={'年'} value={'年'}>年</Option>
            </Select>
          </Form.Item>
          <Form.Item name="FILENAME" hidden></Form.Item>
          <Form.Item label="附件" name="FILENAMEOLD" rules={[{ required: true, message: '请上传附件', }]}>
            <Upload {...uploadProps(7)}>
              <Button icon={<UploadOutlined />} loading={fileLoading}>上传报告</Button>
            </Upload>
          </Form.Item>
          <Form.Item label="描述" name="DEMO">
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
        confirmLoading={props.taskAbnormalTerminaLoading}
      >
        <Form
          form={taskAbnormalTerminaform}
          name="task_abnorma_termina_form"
          initialValues={{
          }}
        >
          <Form.Item label="终止时间" name="END_DATE" rules={[{ required: true, message: '请终止时间', }]}>
            <DatePicker format='YYYY-MM-DD' style={{ width: 300 }} />
          </Form.Item>
          <Form.Item label="终止描述" name="END_MESSAGE" rules={[{ required: true, message: '请输入终止描述', }]}>
            <TextArea placeholder='请输入' allowClear />
          </Form.Item>
          <Form.Item name="FILENAME" hidden></Form.Item>
          <Form.Item label="终止附件" name="FILENAMEOLD" rules={[{ required: true, message: '请上传终止报告', }]}>
            <Upload {...uploadProps(8)}>
              <Button icon={<UploadOutlined />} loading={fileLoading}>上传报告</Button>
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
        <TableTransfer leftColumns={pointColumns} rightColumns={pointColumns} scroll={{ y: 'calc(100vh - 480px)' }} bordered={false} dataSource={pointList} loading={props.pointListLoading} targetKeys={pointTargetKeys} onChange={(checked) => { setPointTargetKeys(checked) }} showSearch filterOption={(inputValue, item) => item.ID.indexOf(inputValue) !== -1 || item.MC.indexOf(inputValue) !== -1 || item.ADDRESS.indexOf(inputValue) !== -1} />
      </Modal>
      <Modal
        title={'人员添加'}
        visible={addOperaUserVisible}
        onCancel={() => { setAddOperaUserVisible(false) }}
        className={styles.operaUserFormModal}
        destroyOnClose
        width='85%'
        confirmLoading={props.addOperaUserLoading}
        onOk={() => addOperaUserOk()}
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
        confirmLoading={props.addOperaDeviceLoading}
        onOk={() => addOperaDeviceOk()}
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
        title={planModalType === 'add' ? '计划添加' : '计划详情'}
        visible={addOperaPlanVisible}
        onCancel={() => { setAddOperaPlanVisible(false) }}
        className={planModalType === 'add' ? styles.addPlanFormModal : styles.detailPlanFormModal}
        destroyOnClose
        width='85%'
        confirmLoading={props.operationTaskPlanLoading}
        onOk={taskPlanOk}
      >
        <Form
          form={planform}
          name="plan_form"
          initialValues={{
            // JHZX:'周',
          }}
          className={styles.fromModal}
        >
          <Form.Item label="计划标题" name="JHBT" rules={[{ required: true, message: '请输入计划标题', }]}>
            {planModalType === 'add' ? <Input placeholder='请输入' allowClear style={{ width: 300 }} /> : planform.getFieldValue('JHBT')}
          </Form.Item>
          <Form.Item label="执行" name="JHZX" rules={[{ required: true, message: '请选择执行', }]}>
            {planModalType === 'add' ?
              <Select placeholder='请选择' style={{ width: 150 }}  >
                <Option key={'周'} value={'周'}>周</Option>
                <Option key={'月'} value={'月'}>月</Option>
              </Select>
              : planform.getFieldValue('JHZX')}
          </Form.Item>
          <Form.Item label="间隔" name="JHJG" rules={[{ required: true, message: '请输入间隔', }]}>
            {planModalType === 'add' ? <InputNumber placeholder='请输入' style={{ width: 150 }} allowClear /> : planform.getFieldValue('JHJG')}
          </Form.Item>
          <Form.Item label="计划开始/结束日期" name="time" rules={[{ required: true, message: '请选择计划开始/结束日期', }]}>
            {planModalType === 'add' ? <RangePicker_ format='YYYY-MM-DD' style={{ width: 300 }} /> : planform.getFieldValue('time')}
          </Form.Item>

          <Form.Item label="运维内容" name="DETAIL">
            {props.operaContantListLoading ? <Spin size='small' />
              : <Checkbox.Group options={props.operaContantList} disabled={planModalType === 'detail'} />
            }
          </Form.Item>
          <Form.Item label="计划描述" name="JHMR">
            {planModalType === 'add' ? <TextArea placeholder='请输入' allowClear /> : planform.getFieldValue('JHMR')}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);