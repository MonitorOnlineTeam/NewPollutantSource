/**
 * 功  能：监测设备
 * 创建人：贾安波
 * 创建时间：2021.02.11
 */
import React, { useState, useEffect, useRef, Fragment, useMemo } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Card, Button, Select, Progress, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Popover ,Tag,Spin} from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import styles from "../../index.less"
import Cookie from 'js-cookie';
import cuid from 'cuid';
const { TextArea } = Input;
const { Option } = Select;


const namespace = 'point'




const dvaPropsData = ({ loading, point }) => ({
  monitoringTypeList: point.monitoringTypeList,
  manufacturerList: point.manufacturerList,
  systemModelList: point.systemModelList,
  loadingSystemModel: loading.effects[`${namespace}/getSystemModelList`]|| false,
  monitoringTypeList2: point.monitoringTypeList2,
  pollutantTypeList: point.pollutantTypeList,
  equipmentInfoList: point.equipmentInfoList,
  loadingGetEquipmentInfoList: loading.effects[`${namespace}/getEquipmentInfoList`],
  loadingGetPollutantById: loading.effects[`${namespace}/getPollutantById`] || false,
  pollutantTypeList2: point.pollutantTypeList2,
  loadingGetPollutantById2: loading.effects[`${namespace}/getPollutantById2`] || false,
  addOrUpdateEquipmentInfoLoading:loading.effects[`${namespace}/addOrUpdateEquipmentInfo`],
  tableDatasLoading:loading.effects[`${namespace}/getPointEquipmentParameters`],
  pointSystemInfoLoading:loading.effects[`${namespace}/getPointEquipmentInfo`],
  monitoringCategoryTypeLoading:loading.effects[`${namespace}/getMonitoringCategoryType`],
})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
    getMonitoringTypeList: (payload) => {
      dispatch({
        type: `${namespace}/getMonitoringTypeList`, //获取监测类别
        payload: payload,
      })
    },
    getPointEquipmentInfo: (payload,callback) => { //回显 获取站点设备信息
      dispatch({
        type: `${namespace}/getPointEquipmentInfo`,
        payload: payload,
        callback:callback
      })
    },
    addOrUpdateEquipmentInfo: (payload,callback) => { //添加或者修改设备参数信息
      dispatch({
        type: `${namespace}/addOrUpdateEquipmentInfo`,
        payload: payload,
        callback:callback
      })
    },
    getPointEquipmentParameters: (payload,callback) => { // 列表回显 设备参数
      dispatch({
        type: `${namespace}/getPointEquipmentParameters`,
        payload: payload,
        callback:callback
      })
    },
    getManufacturerList: (payload) => { //厂商列表
      dispatch({
        type: `${namespace}/getManufacturerList`,
        payload: payload,
      })
    },
    getSystemModelList: (payload) => { //列表 系统型号
      dispatch({
        type: `${namespace}/getSystemModelList`,
        payload: payload,
      })
    },
    getMonitoringTypeList2: (payload, callback) => { //设备信息 监测类别
      dispatch({
        type: `${namespace}/getMonitoringTypeList2`,
        payload: payload,
        callback: callback
      })
    },
    getPollutantById: (payload) => { //监测类型
      dispatch({
        type: `${namespace}/getPollutantById`,
        payload: payload,

      })
    },
    getPollutantById2: (payload,callback) => { //监测类型
      dispatch({
        type: `${namespace}/getPollutantById2`,
        payload: payload,
        callback:callback
      })
    },
    getEquipmentInfoList: (payload) => { //列表 设备信息
      dispatch({
        type: `${namespace}/getEquipmentInfoList`,
        payload: payload,
      })
    },
    getMonitoringCategoryType: (payload) => { //监测类型
      dispatch({
        type: `${namespace}/getMonitoringCategoryType`,
        payload: payload,
      })
    },
  }
}




const Index = (props) => {

  const [dates, setDates] = useState([]);
  const { DGIMN, pollutantType, manufacturerList, systemModelList, pollutantTypeList,pollutantTypeList2,equipmentInfoList,pointSystemInfo } = props;


  useEffect(() => {
    initData()

  }, []);

  const initData = () => {
    props.getMonitoringTypeList({})
    props.getManufacturerList({})
    //设备信息
    props.getMonitoringTypeList2({})
    props.updateState({pollutantTypeList2:[]})

    //回显数据
    props.getPointEquipmentParameters({DGIMN:DGIMN,PollutantType:pollutantType},(res)=>{ //设备参数
      setData(res)
    }) 
    pollutantType!=1&&props.getPointEquipmentInfo({DGIMN:DGIMN,PollutantType:pollutantType},(res)=>{//系统信息
      form.setFieldsValue({
        GasEquipment:res&&res.gasEquipment? res.gasEquipment : '',
        PMEquipment: res&&res.pMEquipment? res.pMEquipment : '',
        GasManufacturer: res.gasManufacturer,
        PMManufacturer: res.pMManufacturer
      })
      setGaschoiceData(res.gasManufacturerName)
      setPmchoiceData(res.pMManufacturerName)
    })
  }

  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [form3] = Form.useForm(); 
  const [formDevice] = Form.useForm();
  
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    formDevice.setFieldsValue({
      ...record,
      Range1Min: record.Range1? record.Range1.split("-")[0] :'',
      Range1Max: record.Range1? record.Range1.split("-")[1] :'',
      Range2Min: record.Range1? record.Range2.split("-")[0] :'',
      Range2Max: record.Range1? record.Range2.split("-")[1] :'',
      EquipmentManufacturer:record.EquipmentManufacturer,
      EquipmentModel: record.EquipmentModel,
      EquipmentNumber: record.EquipmentNumber,
      Equipment: record.Equipment,
      PollutantCode:record.PollutantCode||undefined,
    });
    setDevicePollutantName(record.PollutantName) //设备参数
    record.type!="add"? setParchoiceDeViceID(record.EquipmentManufacturerID) : null //设备厂家
    setEditingKey(record.key);
    console.log(record)
    props.getMonitoringCategoryType({PollutantCode:record.PollutantCode})

  };

  const cancel = (record,type) => {
    if (record.type === 'add' || type) { //新添加一行 删除 || 原有数据编辑的删除  不用走接口
      const dataSource = [...data];
      let newData = dataSource.filter((item) => item.key !== record.key)
      setData(newData)
      setEditingKey('');
    } else { //编辑状态
      setEditingKey('');
    }
  };


  const save = async (record) => {
    
      try {
        const row = await formDevice.validateFields();
        const newData = [...data];
        const key = record.key;
        const index = newData.findIndex((item) => key === item.key);
        console.log(row)
        if (index > -1) {
          const editRow = { 
                       Range1:row.Range1Min||row.Range1Max? `${row.Range1Min}-${row.Range1Max}`: null,
                       Range2:row.Range2Min||row.Range2Max? `${row.Range2Min}-${row.Range2Max}`: null,
                       PollutantName:devicePollutantName,
                       PollutantCode:row.PollutantCode,
                       EquipmentManufacturerID: parchoiceDeViceID, //设备厂家
                      };
          const item = record.type==='add'? {...newData[index],key:cuid() } : {...newData[index]}
          newData.splice(index, 1, { ...item, ...row, ...editRow});
          setData(newData);
          setEditingKey('');
        } else {
          newData.push(row);
          setData(newData);
          setEditingKey('');
        }
      } catch (errInfo) {
        console.log('Validate Failed:', errInfo);
      }
  };

  let columns = [
    {
      title: '监测参数',
      dataIndex: 'PollutantName',
      align: 'center',
      editable: true,
    },
    {
      title: '量程1',
      dataIndex: 'Range1',
      align: 'center',
      width: 200,
      editable: true,
    },
    {
      title: '量程2',
      dataIndex: 'Range2',
      align: 'center',
      width: 200,
      editable: true,
    },
    {
      title: '设备厂家',
      dataIndex: 'EquipmentManufacturer',
      align: 'center',
      editable: true,
    },
    {
      title: '设备名称',
      dataIndex: 'EquipmentInfoID',
      align: 'center',
      editable: true,
    },
    {
      title: '设备型号',
      dataIndex: 'EquipmentModel',
      align: 'center',
      editable: true,
    },
    {
      title: '设备序列号',
      dataIndex: 'EquipmentNumber',
      align: 'center',
      editable: true,
    },
    {
      title: '配备',
      dataIndex: 'Equipment',
      align: 'center',
      editable: true,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      align: 'center',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record)}
              style={{
                marginRight: 8,
              }}
            >
              {record.type == 'add' ? "添加" : "保存"}
            </Typography.Link>
            <span onClick={() => { cancel(record) }}  style={{  marginRight: 8 }}>
              <a>{record.type == 'add' ? "删除" : "取消"}</a>
            </span>
            <span onClick={() => { cancel(record,'del') }}> {/*编辑的删除 */}
              <a>{!record.type&& "删除"}</a>
            </span>
          </span>
        ) : (
            <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
              编辑
            </Typography.Link>
          );
      },
    },
  ];
  if(pollutantType==1){
    columns = columns.filter(item=>{
      return item.dataIndex !='Equipment'
   })
  }
  
  const mergedColumns = columns.map((col) => {

    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'Range1' || col.dataIndex === 'Range2' ? 'range' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const generatorCol = [
    {
      title: '设备厂家',
      dataIndex: 'ManufacturerName',
      key: 'ManufacturerName',
      align: 'center',
    },
    {
      title: '系统名称',
      dataIndex: 'SystemName',
      key: 'SystemName',
      align: 'center',
    },
    {
      title: '系统型号',
      dataIndex: 'SystemModel',
      key: 'SystemModel',
      align: 'center',
    },
    {
      title: '监测类别',
      dataIndex: 'MonitoringType',
      key: 'MonitoringType',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'x',
      key: 'x',
      align: 'center',
      render: (text, record) => {
        return <Button type='primary' size='small' onClick={() => { generatorColChoice(record) }}> 选择 </Button>
      }
    },

  ]
  const [gaschoiceData, setGaschoiceData] = useState()

  const [pmchoiceData, setPmchoiceData] = useState()


  const generatorColChoice = (record) => {
    if (popVisible) {
      form.setFieldsValue({ GasManufacturer: record.ID, GasEquipment: record.SystemModel });
      setGaschoiceData(record.ManufacturerName)
      setPopVisible(false)
    } else {//颗粒物
      form.setFieldsValue({ PMManufacturer: record.ID, PMEquipment: record.SystemModel });
      setPmchoiceData(record.ManufacturerName)
      setPmPopVisible(false)
    }

  }
  const [parchoiceDeViceID, setParchoiceDeViceID] = useState(undefined) //设备厂家ID


  const onClearChoice = (value) => {
    form.setFieldsValue({ GasManufacturer: value, GasEquipment: '' });
    setGaschoiceData(value)
  }

  const onPmClearChoice = (value) => {
    form.setFieldsValue({ PMManufacturer: value, PMEquipment: '' });
    setPmchoiceData(value)
  }

  const [devicePollutantName,setDevicePollutantName] = useState() 
  const deviceColChoice = (record) => { //设备参数选择
    formDevice.setFieldsValue({ EquipmentManufacturer: record.ManufacturerName, EquipmentInfoID : record.EquipmentName,
                            EquipmentModel: record.EquipmentType, });
      setParchoiceDeViceID(record.ID)
      setParPopVisible(false)
      props.getPollutantById2({ id: record.PollutantType },()=>{
          formDevice.setFieldsValue({ PollutantCode: record.PollutantCode})
          setDevicePollutantName(record.PollutantName)
      })
  }
  const onParClearChoice = (value) => {//设备参数清除
    formDevice.setFieldsValue({ EquipmentManufacturer: value,PollutantCode:undefined,EquipmentInfoID :'', EquipmentModel: '', });
    setParchoiceDeViceID(value)
    props.updateState({pollutantTypeList2:[]}) //清除监测参数
  }


  const onFinish2 = async () => { //生成商弹出框 查询
    try {
      const values = await form2.validateFields();
      props.getSystemModelList({
        pageIndex: 1,
        pageSize: 100000,
        ...values,
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }

  const [popVisible, setPopVisible] = useState(false)
  const [pmPopVisible, setPmPopVisible] = useState(false) //颗粒物弹出框
  
   useEffect(()=>{
     if(pmPopVisible || popVisible){
       form2.resetFields()
       onFinish2()
     }
   },[pmPopVisible,popVisible])
  const { monitoringTypeList } = props;
  const selectPopover = (type) => {
    return <Popover
      title=""
      trigger="click"
      visible={type === 'pm' ? pmPopVisible : popVisible}
      onVisibleChange={(visible) => { type === 'pm' ? setPmPopVisible(visible) : setPopVisible(visible) }}
      placement={"bottom"}
      getPopupContainer={trigger => trigger.parentNode}
      content={
        <Form
          form={form2}
          name="advanced_search2"
          onFinish={() => { onFinish2() }}
        >
          <Row>
            <Form.Item style={{ marginRight: 8 }} name='ManufacturerID' >
              <Select placeholder='请选择设备厂家' showSearch allowClear filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} style={{ width: 200 }}>
                {
                  manufacturerList[0] && manufacturerList.map(item => {
                    return <Option key={item.ID} value={item.ID}>{item.ManufacturerName}</Option>
                  })
                }
              </Select>
            </Form.Item>
            <Form.Item style={{ marginRight: 8 }} name="SystemModel">
              <Input allowClear placeholder="请输入系统型号" />
            </Form.Item>
            <Form.Item style={{ marginRight: 8 }} name="MonitoringType">
              <Select allowClear placeholder="请选择监测类别" style={{ width: 150 }}>
                {
                  monitoringTypeList[0] && monitoringTypeList.map(item => {
                    return <Option key={item.Code} value={item.Code}>{item.Name}</Option>
                  })
                }
              </Select>

            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType='submit'>
                查询
             </Button>
            </Form.Item>
          </Row>
          <SdlTable scroll={{ y: 'calc(100vh - 500px)' }} style={{ width: 800 }} loading={props.loadingSystemModel} bordered dataSource={systemModelList} columns={generatorCol} />
        </Form>
      }
    >
      <Select onChange={type === 'pm' ? onPmClearChoice : onClearChoice} allowClear showSearch={false} value={type === 'pm' ? pmchoiceData : gaschoiceData} dropdownClassName={styles.popSelectSty} placeholder="请选择">
      </Select>
    </Popover>
  }
  const deviceCol = [
    {
      title: '编号',
      dataIndex: 'EquipmentCode',
      key: 'EquipmentCode',
      align: 'center',
    },
    {
      title: '设备厂家',
      dataIndex: 'ManufacturerName',
      key: 'ManufacturerName',
      align: 'center',
    },
    {
      title: '设备品牌',
      dataIndex: 'EquipmentBrand',
      key: 'EquipmentBrand',
      align: 'center',
    },
    {
      title: '设备名称',
      dataIndex: 'EquipmentName',
      key: 'EquipmentName',
      align: 'center',
    },
    {
      title: '分析方法',
      dataIndex: 'AnalyticalMethod',
      key: 'AnalyticalMethod',
      align: 'center',
    },
    {
      title: '设备型号',
      dataIndex: 'EquipmentType',
      key: 'EquipmentType',
      align: 'center',
    },
    {
      title: '监测类型',
      dataIndex: 'PollutantName',
      key: 'PollutantName',
      align: 'center',
    },
    {
      title: '监测类别',
      dataIndex: 'PollutantTypeName',
      key: 'PollutantTypeName',
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'Status',
      key: 'Status',
      align: 'center',
      render: (text, record) => {
        if (text === 1) {
          return <span><Tag color="blue">启用</Tag></span>;
        }
        if (text === 2) {
          return <span><Tag color="red">停用</Tag></span>;
        }
      },
    },
    {
      title: '操作',
      dataIndex: 'x',
      key: 'x',
      align: 'center',
      render: (text, record) => {
        return <Button type='primary' size='small' onClick={() => { deviceColChoice(record) }}> 选择 </Button>
      }
    },
  ];
  const [pageSize3, setPageSize3] = useState(20)
  const [pageIndex3, setPageIndex3] = useState(1)
  const onFinish3 = async () => {  //查询 设备信息
    try {
      const values = await form3.validateFields();

      props.getEquipmentInfoList({
        ManufacturerId:manufacturerList[0] && manufacturerList[0].ID,
        ...values,
        PageIndex: 1,
        PageSize: 1000000
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }


  const onValuesChange3 = (hangedValues, allValues) => {
    if (Object.keys(hangedValues).join() == 'PollutantType') {
      props.getPollutantById({ id: hangedValues.PollutantType })
      form3.setFieldsValue({ PollutantCode: undefined })
    }
  }
  const { monitoringTypeList2 } = props;
  const [parPopVisible, setParPopVisible] = useState(false) //监测设备参数弹出框
  // const selectPopover2 = () => { //设备信息
  //   return <Tooltip 
  //   // title=""
  //   trigger="click"
  //   visible={parPopVisible}
  //   onVisibleChange={(visible) => { setParPopVisible(visible) }}
  //   placement={"right"}
  //   // getPopupContainer={trigger => trigger.parentNode}
  //   destroyTooltipOnHide={true}
  //   title={
  //     <Form
  //       form={form3}
  //       name="advanced_search3"
  //       onFinish={() => { onFinish3() }}
  //       onValuesChange={onValuesChange3}
  //     >
  //       <Row>
  //         <span>
  //         <Form.Item style={{ marginRight: 8 }} name='ManufacturerId' >
  //           <Select placeholder='请选择设备厂家' showSearch allowClear filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} style={{ width: 150 }}>
  //             {
  //               manufacturerList[0] && manufacturerList.map(item => {
  //                 return <Option key={item.ID} value={item.ID}>{item.ManufacturerName}</Option>
  //               })
  //             }
  //           </Select>
  //         </Form.Item>
  //         </span>
  //         <Form.Item style={{ marginRight: 8 }} name="EquipmentType">
  //           <Input allowClear placeholder="请输入设备型号" style={{ width: 150 }} />
  //         </Form.Item>
  //         <Form.Item style={{ marginRight: 8 }} name="MonitoringType">
  //           <Select allowClear placeholder="请选择监测类别" style={{ width: 150 }}>
  //             {
  //               monitoringTypeList2[0] && monitoringTypeList2.map(item => {
  //                 return <Option key={item.ID} value={item.ID}>{item.Name}</Option>
  //               })
  //             }
  //           </Select>
  //         </Form.Item>
  //         <Form.Item style={{ marginRight: 8 }} name="PollutantCode"  >
  //           {props.loadingGetPollutantById ? <Spin size='small' style={{ width: 150, textAlign: 'left' }} />
  //             :
  //             <Select placeholder='请选择监测类型' allowClear style={{ width: 150 }}>

  //               {
  //                 pollutantTypeList[0] && pollutantTypeList.map(item => {
  //                   return <Option key={item.ID} value={item.ID}>{item.Name}</Option>
  //                 })
  //               }
  //             </Select>}
  //         </Form.Item>
  //         <Form.Item>
  //           <Button type="primary" htmlType='submit'>
  //             查询
  //          </Button>
  //         </Form.Item>
  //       </Row>
  //       <SdlTable scroll={{ y: 'calc(100vh - 500px)' }} style={{ width: 900 }} loading={props.loadingGetEquipmentInfoList} bordered dataSource={equipmentInfoList} columns={deviceCol} />
  //     </Form>}
  // >
  //   <Select onChange={onParClearChoice} allowClear showSearch={false} value={parchoiceData} dropdownClassName={styles.popSelectSty} placeholder="请选择">
  //   </Select>
  // </Tooltip >

  // }

  const systemInfo = () => {
    return <Spin spinning={props.pointSystemInfoLoading}> 
         <div style={{ paddingBottom: 10 }}>
      <Row gutter={[16, 8]}>
        <Col span={6}>
          <Form.Item label="气态污染物CEMS设备生成商" name="GasManufacturer">
            {selectPopover()}
          </Form.Item>
        </Col>
        <Col span={6} >
          <Form.Item label="气态污染物CEMS设备规格型号" name="GasEquipment">
            <Input placeholder="请输入" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Form.Item label="颗粒物CEMS设备生成商" name="PMManufacturer">
            {selectPopover('pm')}
          </Form.Item>
        </Col>
        <Col span={6} >
          <Form.Item label="颗粒物CEMS设备规格型号" className={"specificationSty"} name='PMEquipment'>
            <Input placeholder="请输入" />
          </Form.Item>
        </Col>
      </Row>
    </div>
    </Spin>
  }

  const [count, setCount] = useState(513);
  const handleAdd = () => { //新增成员
    if (editingKey) {
      message.warning('请先保存数据')
      return
    }else{
    formDevice.resetFields();
    setEditingKey(editingKey + 1)
    const newData = {
      PollutantCode: "",
      Range1: "",
      Range2: "",
      EquipmentManufacturer: undefined,
      EquipmentInfoID: "",
      EquipmentModel: "",
      EquipmentNumber: '',
      Equipment: '',
      key: editingKey+1,
      type: 'add',
      editable: true,
    }
    setData([...data, newData])
    props.updateState({pollutantTypeList2:[]})
   }
  };

  const onValuesChange = async (hangedValues, allValues) => {

    if (Object.keys(hangedValues).join() == 'PollutantCode') { //设备厂家
     const data =  pollutantTypeList2.filter((item)=>item.ID === hangedValues.PollutantCode)
      setDevicePollutantName(data[0]? data[0].Name : '')
    } 
  }
  const handleTableChange = (PageIndex, PageSize) => {
    setPageIndex(PageIndex)
    setPageSize(PageSize)
    onFinish(PageIndex, PageSize)
  }
 
  const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    let inputNode = '';
    if (dataIndex ==='EquipmentManufacturer') {
      inputNode = <Select onClick={()=>{setParPopVisible(!parPopVisible);form3.resetFields();onFinish3()}} onChange={onParClearChoice} allowClear showSearch={false}  dropdownClassName={styles.popSelectSty} placeholder="请选择"> </Select>;
    } else if (inputType === 'number') {
      inputNode = <InputNumber placeholder={`请输入${title}`} />
    } else {
      inputNode = <Input placeholder={`请输入${title}`} />
    }

    const parLoading = record&&record.type&&record.type==='add'? props.loadingGetPollutantById2 : props.monitoringCategoryTypeLoading; //监测参数提示loading
    return (
      <td {...restProps}>
        {editing ? (
          inputType === 'range' ?
            <Form.Item style={{ margin: 0 }}>
              <Form.Item style={{ display: 'inline-block', margin: 0 }}
                //  rules={[ {   required: dataIndex==="Range1"&&true,   message: ``  } ]}
                name={`${dataIndex}Min`}
              >
                <InputNumber placeholder={`最小值`} />
              </Form.Item>
              <span style={{ display: 'inline-block', width: '24px', lineHeight: '32px', textAlign: 'center' }}>
                -
        </span>
              <Form.Item
                //  rules={[ {   required: dataIndex==="Range1"&&true,   message: `` } ]}
                style={{ display: 'inline-block', margin: 0 }} name={`${dataIndex}Max`}
              >
                <InputNumber placeholder={`最大值`} />
              </Form.Item>
            </Form.Item> : dataIndex ==='PollutantName'? //监测参数
            
            <>{ parLoading? <Spin size='small' style={{ width: 150, textAlign: 'left' }} />
                     :
                     <Form.Item  name={`PollutantCode`} style={{ margin: 0 }}>
            <Select placeholder='请选择监测参数' showSearch filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}  style={{ width: 150 }}>
            {
             pollutantTypeList2[0] && pollutantTypeList2.map(item => {
            return <Option key={item.ID} value={item.ID}>{item.Name}</Option>
           })
          }
      </Select></Form.Item>}</>
      :
            <Form.Item
              name={`${dataIndex}`}
              style={{ margin: 0 }}
            //  rules={[ {   required: dataIndex==="EquipmentParametersCode"&&true,  message: ``  } ]}
            >
              {inputNode}
            </Form.Item>
        ) : (
            children
          )}
      </td>
    );
  };
  const submits = async() =>{
    if(editingKey){
      message.warning('请先保存未保存的数据')
      return;
    }
    try {
      const values = await form.validateFields();
       console.log(data)
      const  parList =  data.map(itme=>{
        return {ID:'',DGIMN:DGIMN, PollutantCode:itme.PollutantCode,Range1:itme.Range1,Range2:itme.Range1,EquipmentManufacturer:itme.EquipmentManufacturerID,
                EquipmentInfoID:itme.EquipmentInfoID,EquipmentModel:itme.EquipmentModel,EquipmentNumber:itme.EquipmentNumber,Equipment :itme.EquipmentNumber}
      })
      const  par =  {
        equipmentModel: pollutantType ==1? null : {...values,DGIMN:DGIMN},
        equipmentParametersList:parList[0]? parList : [],
        DGIMN:DGIMN}

      props.addOrUpdateEquipmentInfo({
        ...par
      },()=>{
        props.onCancel()
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  return (
    <div>

      <Form form={form} name="advanced_search" >
         {pollutantType!=1&&<div>
        <div style={{ fontWeight: 'bold', paddingBottom: 5 }}> 系统信息</div>
        { systemInfo()}
        </div>}
        <div style={{ fontWeight: 'bold', paddingBottom: 10 }}>监测设备参数</div>
        <Form form={formDevice}  name="advanced_search_device" onValuesChange={onValuesChange}>
        <SdlTable
          components={{
            body: {
              cell:EditableCell
           }
          }}
          bordered
          dataSource={data}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={false}
          scroll={{ y: 'calc(100vh - 380px)' }}
          loading={props.tableDatasLoading}
        />
        </Form>
        <Button style={{ margin: '10px 0' }} type="dashed" block icon={<PlusOutlined />} onClick={() => handleAdd()} >
          新增成员
       </Button>
        <Row justify='end'> <Button type="primary" loading={props.addOrUpdateEquipmentInfoLoading} onClick={submits} > 保存</Button></Row>
      </Form>
      
      <Modal visible={parPopVisible}  getContainer={false} onCancel={()=>{setParPopVisible(false)}} width={900} destroyOnClose footer={null} closable={false} maskStyle={{display:'none'}}>
      <Form
        form={form3}
        name="advanced_search3"
        onFinish={() => { onFinish3() }}
        onValuesChange={onValuesChange3}
        initialValues={{
          ManufacturerId:manufacturerList[0] && manufacturerList[0].ID,
        }}
      >
        <Row>
          <span>
          <Form.Item style={{ marginRight: 8 }} name='ManufacturerId' >
            <Select placeholder='请选择设备厂家' showSearch  filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} style={{ width: 150 }}>
              {
                manufacturerList[0] && manufacturerList.map(item => {
                  return <Option key={item.ID} value={item.ID}>{item.ManufacturerName}</Option>
                })
              }
            </Select>
          </Form.Item>
          </span>
          <Form.Item style={{ marginRight: 8 }} name="EquipmentType">
            <Input allowClear placeholder="请输入设备型号" style={{ width: 150 }} />
          </Form.Item>
          <Form.Item style={{ marginRight: 8 }} name="PollutantType">
            <Select allowClear placeholder="请选择监测类别" style={{ width: 150 }}>
              {
                monitoringTypeList2[0] && monitoringTypeList2.map(item => {
                  return <Option key={item.ID} value={item.ID}>{item.Name}</Option>
                })
              }
            </Select>
          </Form.Item>
          <Form.Item style={{ marginRight: 8 }} name="PollutantCode"  >
            {props.loadingGetPollutantById ? <Spin size='small' style={{ width: 150, textAlign: 'left' }} />
              :
              <Select placeholder='请选择监测类型' allowClear showSearch filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} style={{ width: 150 }}>

                {
                  pollutantTypeList[0] && pollutantTypeList.map(item => {
                    return <Option key={item.ID} value={item.ID}>{item.Name}</Option>
                  })
                }
              </Select>}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType='submit'>
              查询
           </Button>
          </Form.Item>
        </Row>
        <SdlTable scroll={{ y: 'calc(100vh - 500px)' }} style={{ width: 900 }} loading={props.loadingGetEquipmentInfoList} bordered dataSource={equipmentInfoList} columns={deviceCol} />
      </Form>
      </Modal>
    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);