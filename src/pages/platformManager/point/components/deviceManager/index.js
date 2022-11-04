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
  systemModelListTotal: point.systemModelListTotal,
  equipmentInfoListTotal:point.equipmentInfoListTotal,
  pbList:point.pbList,
  pbListLoading:loading.effects[`${namespace}/getPBList`],

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
    getManufacturerList: (payload,callback) => { //厂商列表
      dispatch({
        type: `${namespace}/getManufacturerList`,
        payload: payload,
        callback:callback,
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
    getPBList: (payload) => { //废气 配备
      dispatch({
        type: `${namespace}/getPBList`,
        payload: payload,
      })
    },
  }
}




const Index = (props) => {

  const [dates, setDates] = useState([]);
  const { DGIMN, pollutantType, manufacturerList, systemModelList,systemModelListTotal, pollutantTypeList,pollutantTypeList2,equipmentInfoList,pointSystemInfo,equipmentInfoListTotal,pbList,pbListLoading,gasType, } = props;

  const [defaultPollData, setDefaultPollData] = useState([]);

  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [form3] = Form.useForm(); 
  const [formDevice] = Form.useForm();

  const defaultParId = pollutantType == 1 ?  '1b27155c-5b8b-439a-987c-8100723c2866' : '31f8f6f9-5700-443b-8570-9229b36fa00c'
  useEffect(() => {
    initData()

  }, []);

  const initData = () => {
    // props.getMonitoringTypeList({})
    props.getManufacturerList({},(data)=>{
      // console.log(data)
    })
    //设备信息
    props.getMonitoringTypeList2({})

    //回显数据
    props.getPointEquipmentParameters({DGIMN:DGIMN,PollutantType:pollutantType},(res)=>{ //设备参数
      setData(res)
    }) 
    pollutantType==2&&props.getPointEquipmentInfo({DGIMN:DGIMN,PollutantType:pollutantType},(res)=>{//废气 系统信息 编辑回显
      // form.setFieldsValue({
      //   GasEquipment:res&&res.gasEquipment? res.gasEquipment : '',
      //   PMEquipment: res&&res.pMEquipment? res.pMEquipment : '',
      //   GasManufacturer:res&&res.gasManufacturer? res.gasManufacturer : '',
      //   PMManufacturer: res&&res.pMManufacturer? res.pMManufacturer: ''
      // })
      // setGaschoiceData(res&&res.gasManufacturerName? res.gasManufacturerName : undefined)
      // setPmchoiceData(res&&res.pMManufacturerName? res.pMManufacturerName : undefined)
      const data = res? res.map(item=>{
        return {...item,key:cuid()}
      }) : null;
      setGasSystemData(data? data :[])
    })

    //废水 废气   默认加载监测参数
        props.getPollutantById2({ id:defaultParId,type:1 },(data)=>{
          setDefaultPollData(data)
          props.updateState({ pollutantTypeList: data}) 
        })
    

    //废气 配备
    props.getPBList({})

    //CEMS设备生产商
    props.getSystemModelList({})
    }

  



  
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    formDevice.setFieldsValue({
      ...record,
      Range1Min: record.Range1? record.Range1.split("~")[0] :undefined,
      Range1Max: record.Range1? record.Range1.split("~")[1] :undefined,
      Range2Min: record.Range2? record.Range2.split("~")[0] :undefined,
      Range2Max: record.Range2? record.Range2.split("~")[1] :undefined,
      EquipmentManufacturer:record.EquipmentManufacturer,
      EquipmentModel: record.EquipmentModel,
      EquipmentNumber: record.EquipmentNumber,
      Equipment: record.Equipment|| undefined,
      PollutantCode:record.PollutantCode||undefined,
    });
    setDevicePollutantName(record.PollutantName) //设备参数
    record.type!="add"? setParchoiceDeViceID(record.EquipmentManufacturerID) : null //设备厂家
    setEditingKey(record.key);
    props.getMonitoringCategoryType({PollutantCode:record.PollutantCode})

  };
  const gasSyatemEdit = (record) =>{
     form.setFieldsValue({
      systemName:record.systemName,
      gasManufacturerName:record.gasManufacturerName,
      gasEquipment:record.gasEquipment,
    });

    if(record.type!="add"){
      setGasSystemEquipmentId(record.gasEquipment) //CEMS设备生产商
      setCemsVal(Number(record.systemID))//系统名称
    }
    setGasSystemEditingKey(record.key);
  }
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
const gasSyatemCancel = (record,type) =>{
  if (record.type === 'add' || type) { //新添加一行 删除 || 原有数据编辑的删除  不用走接口
    const dataSource = [...gasSystemData];
    let newData = dataSource.filter((item) => item.key !== record.key)
    setGasSystemData(newData)
    setGasSystemEditingKey('');
  } else { //编辑状态
    setGasSystemEditingKey('');
  }
};


  const save = async (record) => {
        
      try {
        const row = await formDevice.validateFields();
        const newData = [...data];
        const key = record.key;
        const index = newData.findIndex((item) => key === item.key);
        if (index > -1) {
          const editRow = { 
                       Range1:row.Range1Min||row.Range1Max? `${row.Range1Min}~${row.Range1Max}`: null,
                       Range2:row.Range2Min||row.Range2Max? `${row.Range2Min}~${row.Range2Max}`: null,
                       PollutantName:devicePollutantName,
                       Equipment:pbName,
                       EquipmentCode:row.Equipment,
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
        if(errInfo.errorFields&&errInfo.errorFields[0]&&errInfo.errorFields[0].name){
          if(errInfo.errorFields[0].name[0] === "EquipmentManufacturer" ){
           message.error('请选择设备厂家')
         }
        }
      }
  };
 const gasSystemSave =  async (record) =>{
  try {
    const row = await form.validateFields();
    const newData = [...gasSystemData];
    const key = record.key;
    const index = newData.findIndex((item) => key === item.key);
    if (index > -1) {
      const editRow = { 
                   systemName:cemsVal==465? '气态污染物CEMS' : '颗粒物污染物CEMS',
                   gasManufacturer:gasSystemEquipmentId,
                   systemID:cemsVal,
                  };
      
      const item = record.type==='add'? {...newData[index],key:cuid() } : {...newData[index]} 
      newData.splice(index, 1, { ...item, ...row, ...editRow});
      setGasSystemData(newData);
      setGasSystemEditingKey('');
    } else {
      newData.push(row);
      setGasSystemData(newData);
      setGasSystemEditingKey('');
    }
  } catch (errInfo) {
    if(errInfo&&errInfo.errorFields&&errInfo.errorFields[0]&&errInfo.errorFields[0].name&&errInfo.errorFields[0].name[0]=='gasManufacturerName'){
       message.warning('请选择CEMS设备生产商')
    }
   
    console.log('Validate Failed:', errInfo);
  }
 }
  let columns = [
    {
      title: '监测参数',
      dataIndex: 'PollutantName',
      align: 'center',
      width: 100,
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
      title: '量程1',
      dataIndex: 'Range1',
      align: 'center',
      width: 240,
      editable: true,
    },
    {
      title: '量程2',
      dataIndex: 'Range2',
      align: 'center',
      width: 240,
      editable: true,
    },
    {
      title: '创建人',
      dataIndex: 'CreateUser',
      align: 'center',
      editable: false,
    },  
    {
      title: '创建时间',
      dataIndex: 'CreateTime',
      align: 'center',
      editable: false,
    },
    {
      title: '更新人',
      dataIndex: 'UpdUser',
      align: 'center',
      editable: false,
    },    
    {
      title: '更新时间',
      dataIndex: 'UpdTime',
      align: 'center',
      editable: false,
    }, 
    {
      title: '操作',
      align: 'center',
      fixed:'right',
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
  //   columns.splice(4,0,{
  //     title: '手填设备厂家',
  //     dataIndex: 'ManualEquipmentManufacturer',
  //     align: 'center',
  //     editable: true,
  //  })
  //   columns.splice(5,0,{
  //       title: '手填设备名称',
  //       dataIndex: 'ManualEquipmentName',
  //       align: 'center',
  //       editable: true,
  //   })
  //   columns.splice(6,0,{
  //       title: '手填设备型号',
  //       dataIndex: 'ManualEquipmentModel',
  //       align: 'center',
  //       editable: true,
  // })

    columns = columns.filter(item=>{
      return item.dataIndex !='Equipment'
   })
  }
  const [gasSystemData, setGasSystemData] = useState([]);
  const [gasSystemEditingKey, setGasSystemEditingKey] = useState('');
  const isGasSystemEditing = (record) => record.key === gasSystemEditingKey;

  let   gasSystemCol = [];
  if(pollutantType==2){
     gasSystemCol= [{
      title: '系统名称',
      dataIndex: 'systemName',
      align: 'center',
      width: 100,
      editable: true,
    },
    {
      title: 'CEMS设备生产商',
      dataIndex: 'gasManufacturerName',
      align: 'center',
      editable: true,
    },
    {
      title: 'CEMS设备规格型号',
      dataIndex: 'gasEquipment',
      align: 'center',
      editable: true,
    },
    {
      title: '创建人',
      dataIndex: 'CreateUser',
      align: 'center',
      editable: true,
    },  
    {
      title: '创建时间',
      dataIndex: 'CreateTime',
      align: 'center',
      editable: false,
    },
    {
      title: '更新人',
      dataIndex: 'UpdUser',
      align: 'center',
      editable: false,
    },    
    {
      title: '更新时间',
      dataIndex: 'UpdTime',
      align: 'center',
      editable: false,
    },  
    {
      title: '操作',
      align: 'center',
      fixed:'right',
      render: (_, record) => {
        const editable = isGasSystemEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => gasSystemSave(record)}
              style={{
                marginRight: 8,
              }}
            >
              {record.type == 'add' ? "添加" : "保存"}
            </Typography.Link>
            <span onClick={() => { gasSyatemCancel(record) }}  style={{  marginRight: 8 }}>
              <a>{record.type == 'add' ? "删除" : "取消"}</a>{/*添加的删除 和编辑的取消*/}
            </span>
            <span onClick={() => { gasSyatemCancel(record,'del') }}> {/*编辑的删除 */}
              <a>{!record.type&& "删除"}</a>
            </span>
          </span>
        ) : (
            <Typography.Link disabled={gasSystemEditingKey !== ''} onClick={() => gasSyatemEdit(record)}>
              编辑
            </Typography.Link>
          );
      },
    },]

  }

  const gasSystemCols =  gasSystemCol.map((col) => {

    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isGasSystemEditing(record),
      }),
    };
  });

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
      align: 'center',
      render: (text, record) => {
        return <Button type='primary' size='small' onClick={() => { generatorColChoice(record) }}> 选择 </Button>
      }
    },

  ]
  const [gaschoiceData, setGaschoiceData] = useState()

  const [pmchoiceData, setPmchoiceData] = useState()

  const [gasSystemEquipmentId,setGasSystemEquipmentId] = useState()
  const generatorColChoice = (record) => {
    // if (popVisible) {
    //   form.setFieldsValue({ GasManufacturer: record.ID, GasEquipment: record.SystemModel });
    //   setGaschoiceData(record.ManufacturerName)
    //   setPopVisible(false)
    // } else if(pmPopVisible) {//颗粒物
    //   form.setFieldsValue({ PMManufacturer: record.ID, PMEquipment: record.SystemModel });
    //   setPmchoiceData(record.ManufacturerName)
    //   setPmPopVisible(false)
    // }else if(pollutantType==2&&gasType){ //废气-常规CEMS 废气-Vocs
     
    // }
    form.setFieldsValue({ gasManufacturerName: record.ManufacturerName,gasEquipment: record.SystemModel, });
    setGasSystemEquipmentId(record.ID)
    setManufacturerPopVisible(false)
    setChoiceGasManufacturer(true)
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
  const [pbName,setPbName] = useState() 

  const [ choiceGasManufacturer, setChoiceGasManufacturer] = useState(false); //废气 选择生产商

  const [isManual,setIsManual] = useState(false) //是否手填
  
  const deviceColChoice = (record) => { //设备参数选择
    formDevice.setFieldsValue({ EquipmentManufacturer: record.ManufacturerName, EquipmentInfoID : record.EquipmentName,
                            EquipmentModel: record.EquipmentType, });
      setParchoiceDeViceID(record.ID)
      setParPopVisible(false)
      props.getPollutantById2({ id: record.PollutantType,type:1 },()=>{
          formDevice.setFieldsValue({ PollutantCode: record.PollutantCode})
          setDevicePollutantName(record.PollutantName)
          setIsManual(true)
      })
  }
  const onParClearChoice = (value) => {//设备参数清除
    formDevice.setFieldsValue({ EquipmentManufacturer: value,PollutantCode:undefined,EquipmentInfoID :'', EquipmentModel: '', });
    setParchoiceDeViceID(value)
    // props.updateState({pollutantTypeList2:[]}) //清除监测参数 
    props.updateState({pollutantTypeList2:defaultPollData})//恢复默认
    setIsManual(false)
  }
  const onManufacturerClearChoice = (value) =>{ //CEMS 设备生产商清除功能
    form.setFieldsValue({ gasManufacturerName: value,gasEquipment:value });
    setGasSystemEquipmentId('')
    setChoiceGasManufacturer(false)
 }
  const [pageIndex2,setPageIndex2] = useState(1)
  const [pageSize2,setPageSize2] = useState(10)
  const onFinish2 = async (pageIndex2,pageSize2,cemsVal) => { //生成商弹出框 查询

    setPageIndex2(pageIndex2)
    try {
      const values = await form2.validateFields();
      props.getSystemModelList({
        pageIndex: pageIndex2,
        pageSize: pageSize2,
        SystemName:cemsVal,
        ...values,
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  const handleTableChange2 =   async (PageIndex, PageSize)=>{ //分页
    const values = await form2.validateFields();
    setPageSize2(PageSize)
    setPageIndex2(PageIndex)
    props.getSystemModelList({...values,SystemName: cemsVal, PageIndex,PageSize})
  }
  const [popVisible, setPopVisible] = useState(false)
  const [pmPopVisible, setPmPopVisible] = useState(false) //颗粒物弹出框
  
  //  useEffect(()=>{
  //    if(pmPopVisible || popVisible){
  //      form2.resetFields()
  //      onFinish2(1,10)
  //    }
  //  },[pmPopVisible,popVisible])
  const { monitoringTypeList } = props;

  const popContent = <Form
  form={form2}
  name="advanced_search3"
  onFinish={() => {setPageIndex2(1); onFinish2(1,pageSize2,cemsVal) }}
  initialValues={{
    MonitoringType:266,
    ManufacturerID: manufacturerList[0] && manufacturerList[0].ID,
  }}

>
  <Row>
    <Form.Item style={{ marginRight: 8 }} name='ManufacturerID' >
      <Select placeholder='请选择设备厂家' showSearch  filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} style={{ width: 200 }}>
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
    <Form.Item style={{ marginRight: 8 }} name="MonitoringType" hidden>
      {/* <Select allowClear placeholder="请选择监测类别" style={{ width: 150 }}>
        {
          monitoringTypeList[0] && monitoringTypeList.map(item => {
            return <Option key={item.Code} value={item.Code}>{item.Name}</Option>
          })
        }
      </Select> */}

    </Form.Item>
    <Form.Item>
      <Button type="primary" htmlType='submit'>
        查询
     </Button>
    </Form.Item>
  </Row>
  <SdlTable scroll={{ y: 'calc(100vh - 500px)' }} style={{ width: 800 }} 
            loading={props.loadingSystemModel} bordered dataSource={ systemModelList} columns={generatorCol}
            pagination={{
              total:systemModelListTotal,
              pageSize: pageSize2,
              current: pageIndex2,
              showSizeChanger: true,
              showQuickJumper: true,
              onChange: handleTableChange2,
            }}
  />
</Form>
  // const selectPopover = (type) => {
  //   return <Popover
  //     title=""
  //     trigger="click"
  //     visible={type === 'pm' ? pmPopVisible : popVisible}
  //     onVisibleChange={(visible) => { type === 'pm' ? setPmPopVisible(visible) : setPopVisible(visible) }}
  //     placement={"bottom"}
  //     getPopupContainer={trigger => trigger.parentNode}
  //     content={popContent }
  //   >
  //     <Select onChange={type === 'pm' ? onPmClearChoice : onClearChoice} allowClear showSearch={false} value={type === 'pm' ? pmchoiceData : gaschoiceData} dropdownClassName={styles.popSelectSty} placeholder="请选择">
  //     </Select>
  //   </Popover>
  // }
  const deviceCol = [
    // {
    //   title: '编号',
    //   dataIndex: 'EquipmentCode',
    //   key: 'EquipmentCode',
    //   align: 'center',
    // },
    {
      title: '设备厂家',
      dataIndex: 'ManufacturerName',
      key: 'ManufacturerName',
      align: 'center',
    },
    // {
    //   title: '设备品牌',
    //   dataIndex: 'EquipmentBrand',
    //   key: 'EquipmentBrand',
    //   align: 'center',
    // },
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
    // {
    //   title: '监测类型',
    //   dataIndex: 'PollutantName',
    //   key: 'PollutantName',
    //   align: 'center',
    // },
    // {
    //   title: '监测类别',
    //   dataIndex: 'PollutantTypeName',
    //   key: 'PollutantTypeName',
    //   align: 'center',
    // },
    // {
    //   title: '状态',
    //   dataIndex: 'Status',
    //   key: 'Status',
    //   align: 'center',
    //   render: (text, record) => {
    //     if (text === 1) {
    //       return <span><Tag color="blue">启用</Tag></span>;
    //     }
    //     if (text === 2) {
    //       return <span><Tag color="red">停用</Tag></span>;
    //     }
    //   },
    // },
    {
      title: '操作',
      align: 'center',
      render: (text, record) => {
        return <Button type='primary' size='small' onClick={() => { deviceColChoice(record) }}> 选择 </Button>
      }
    },
  ];
  const [pageSize3, setPageSize3] = useState(10)
  const [pageIndex3, setPageIndex3] = useState(1)
  const onFinish3 = async (pageIndexs,pageSizes) => {  //查询 设备信息 除分页 每次查询页码重置为1
    try {
      const values = await form3.validateFields();
      const pollutantCode = formDevice.getFieldValue('PollutantCode');
      props.getEquipmentInfoList({
        ...values,
        PollutantCode:pollutantCode,
        PageIndex:pageIndexs&& typeof  pageIndexs === "number" ?pageIndexs:pageIndex3,
        PageSize:pageSizes?pageSizes:pageSize3
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }

  const handleTableChange3 = (PageIndex, PageSize) =>{
    setPageIndex3(PageIndex)
    setPageSize3(PageSize)
    onFinish3(PageIndex,PageSize)
  }
  const onValuesChange3 = (hangedValues, allValues) => {
    if (Object.keys(hangedValues).join() == 'PollutantType') {
      props.getPollutantById({ id: hangedValues.PollutantType,type:1 })
      form3.setFieldsValue({ PollutantCode: undefined })
    }
  }
  const { monitoringTypeList2 } = props;
  const [parPopVisible, setParPopVisible] = useState(false) //监测设备参数弹出框

  // const systemInfo = () => {
  //   return <Spin spinning={props.pointSystemInfoLoading}> 
  //        <div style={{ paddingBottom: 10 }}>
  //     <Row gutter={[16, 8]}>
  //       <Col span={6}>
  //         <Form.Item label="气态污染物CEMS设备生产商" name="GasManufacturer">
  //           {selectPopover()}
  //         </Form.Item>
  //       </Col>
  //       <Col span={6} >
  //         <Form.Item label="气态污染物CEMS设备规格型号" name="GasEquipment">
  //           <Input placeholder="请输入" />
  //         </Form.Item>
  //       </Col>
  //     </Row>
  //     <Row gutter={[16, 16]}>
  //       <Col span={6}>
  //         <Form.Item label="颗粒物CEMS设备生产商" name="PMManufacturer">
  //           {selectPopover('pm')}
  //         </Form.Item>
  //       </Col>
  //       <Col span={6} >
  //         <Form.Item label="颗粒物CEMS设备规格型号" className={"specificationSty"} name='PMEquipment'>
  //           <Input placeholder="请输入" />
  //         </Form.Item>
  //       </Col>
  //     </Row>
  //   </div>
  //   </Spin>
  // }

  const [count, setCount] = useState(513);
  const handleAdd = () => { //添加设备
    if (editingKey) {
      message.warning('请先保存数据')
      return
    }else{
    formDevice.resetFields();
    formDevice.setFieldsValue({PollutantCode:defaultPollData&&defaultPollData[0]? defaultPollData[0].ID : null})
    setDevicePollutantName(defaultPollData&&defaultPollData[0]? defaultPollData[0].Name : null)
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
    // pollutantType!=1&&props.updateState({pollutantTypeList2:[]})
    setIsManual(false)
    props.updateState({pollutantTypeList2:defaultPollData})
   }
  };


  const  handleGasSystemAdd = () =>{ //添加系统信息
    if (gasSystemEditingKey) {
      message.warning('请先保存数据')
      return
    }else{
    form.resetFields();
    form.setFieldsValue({ systemName:cemsVal  }) 
    setGasSystemEditingKey(gasSystemEditingKey + 1)
    const newData = {
      systemName:'',
      gasManufacturerName:'',
      gasEquipment:'',
      type: 'add',
      key: gasSystemEditingKey+1,
    }
     setGasSystemData([...gasSystemData, newData])
     setChoiceGasManufacturer(false)
   }
  }
  const onValuesChange = async (hangedValues, allValues) => {

    if (Object.keys(hangedValues).join() == 'PollutantCode') { //设备厂家
     const data =  pollutantTypeList2.filter((item)=>item.ID === hangedValues.PollutantCode)
      setDevicePollutantName(data[0]? data[0].Name : '')
    }
    if (Object.keys(hangedValues).join() == 'Equipment') { //废气 配备
      const data =  pbList.filter((item)=>item.code === hangedValues.Equipment)
       setPbName(data[0]? data[0].name : '')
     }  
  }
 const popVisibleClick = () =>{
  setParPopVisible(!parPopVisible);
  // form3.resetFields();
  form3.setFieldsValue({
    // ManufacturerId:manufacturerList[0] && manufacturerList[0].ID,
    PollutantType: defaultParId,
  })
  setTimeout(()=>{
    setPageIndex3(1); onFinish3(1,pageSize3)
  })
 }
 const [manufacturerPopVisible,setManufacturerPopVisible] = useState(false)
 const manufacturerPopVisibleClick = () =>{ //cems设备生产商
  setManufacturerPopVisible(true)
  // form2.resetFields();
  form.setFieldsValue({'systemName': cemsVal})
  // form2.setFieldsValue({ ManufacturerId:manufacturerList[0] && manufacturerList[0].ID,})
  setTimeout(()=>{
    onFinish2(1,10,cemsVal)
  })
  
 }


 const [cemsVal,setCemsVal] = useState(465)
 const cemsChange = (val) =>{
  setCemsVal(val)
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
    if (dataIndex ==='EquipmentManufacturer') { //监测参数 设备厂家
      inputNode = <Select onClick={()=>{popVisibleClick()}} onChange={onParClearChoice} allowClear showSearch={false}  dropdownClassName={styles.popSelectSty} placeholder="请选择"> </Select>;
    }else if(dataIndex ==='systemName'){
      inputNode = <Select placeholder='请选择' onChange={cemsChange} disabled={choiceGasManufacturer}>
         <Option value={465}>气态污染物CEMS</Option>
         <Option value={466}>颗粒物污染物CEMS</Option>
      </Select>
    } else if (inputType === 'number') {
      inputNode = <InputNumber placeholder={`请输入`} />
    }else {
      inputNode = <Input  title={formDevice.getFieldValue([dataIndex])} disabled={title==='设备名称'||title==='设备型号' || title ==='CEMS设备规格型号'? true : title==='手填设备厂家'||title==='手填设备名称'||title==='手填设备型号'? isManual  :false} placeholder={  title==='手填设备厂家'||title==='手填设备名称'||title==='手填设备型号'? `CIS同步使用` : `请输入`} />
    }

    const parLoading = record&&record.type&&record.type==='add'? props.loadingGetPollutantById2 : props.monitoringCategoryTypeLoading; //监测参数提示loading
    return (
      <td {...restProps}>
        {editing ? (
          inputType === 'range' ?
            <Form.Item style={{ margin: 0 }}>
              <Form.Item style={{ display: 'inline-block', margin: 0 }}
                name={`${dataIndex}Min`}
              >
                <InputNumber placeholder={`最小值`} />
              </Form.Item>
              <span style={{ display: 'inline-block', width: '24px', lineHeight: '32px', textAlign: 'center' }}>
                ~
        </span>
              <Form.Item
                name={`${dataIndex}Max`}
                style={{ display: 'inline-block', margin: 0 }} 
              >
                <InputNumber placeholder={`最大值`} />
              </Form.Item>
            </Form.Item> : dataIndex ==='PollutantName'? //监测参数
            
            <>{ parLoading? <Spin size='small' style={{ textAlign: 'left' }} />
                     :
                     <Form.Item  name={`PollutantCode`} style={{ margin: 0 }}>
            <Select placeholder='请选择' disabled={isManual? true : false} allowClear={false} showSearch filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} >
            {
             pollutantTypeList2[0] && pollutantTypeList2.map(item => {
            return <Option key={item.ID} value={item.ID}>{item.Name}</Option>
           })
          }
      </Select></Form.Item>}</>
        : dataIndex ==='Equipment'? //废气 配备
            
        <>{ pbListLoading? <Spin size='small' style={{ textAlign: 'left' }} />
                 :
                 <Form.Item  name={`Equipment`} style={{ margin: 0 }}>
        <Select allowClear placeholder='请选择'   showSearch filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} >
        {
         pbList[0] && pbList.map(item => {
        return <Option key={item.code} value={item.code}>{item.name}</Option>
       })
      }
  </Select></Form.Item>}</>
 :   dataIndex ==='gasManufacturerName'?  //废气-常规CEMS  废气-Vocs
 <Form.Item  name={`gasManufacturerName`} style={{ margin: 0 }} rules={[  { required: true, message: ''  }]}>
 <Select  onClick={()=>{manufacturerPopVisibleClick()}} onChange={onManufacturerClearChoice}   allowClear showSearch={false}  dropdownClassName={styles.popSelectSty} placeholder="请选择"> </Select>
 </Form.Item>
     
    :

            <Form.Item
              name={`${dataIndex}`}
              style={{ margin: 0 }}
              rules={[ {   required: dataIndex==="EquipmentManufacturer",  message: ``  } ]}
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
    if(editingKey || gasSystemEditingKey){
      message.warning('请先保存未保存的数据')
      return;
    }
    try {
      // const values = await form.validateFields();
      const gasSystemInfo = gasSystemData.map(item=>{ //废气 系统信息
         return{
             SystemManufactor:item.systemID,
             GasManufacturer:item.gasManufacturer,
             GasEquipment:item.gasEquipment,
          }

       
      })
      const  parList =  data.map(itme=>{
        return {ID:'',DGIMN:DGIMN, PollutantCode:itme.PollutantCode,Range1:itme.Range1,Range2:itme.Range2,EquipmentManufacturer:itme.EquipmentManufacturerID,
                EquipmentInfoID:itme.EquipmentInfoID,EquipmentModel:itme.EquipmentModel,EquipmentNumber:itme.EquipmentNumber,Equipment :itme.EquipmentCode,
                ManualEquipmentManufacturer: itme.ManualEquipmentManufacturer,
                ManualEquipmentModel: itme.ManualEquipmentModel,
                ManualEquipmentName: itme.ManualEquipmentName,
              }
      })
      const  par =  {
        equipmentModel: pollutantType ==1? null :gasSystemInfo,
        equipmentParametersList:parList[0]? parList : [],
        DGIMN:DGIMN,
      }

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
         {pollutantType!=1&&<><div>
        <div style={{ fontWeight: 'bold', paddingBottom: 5 }}> 系统信息</div>
        {/* { systemInfo()} */}
        <SdlTable
          components={{
            body: {
              cell:EditableCell,
           }
          }}
          bordered
          dataSource={gasSystemData}
          columns={gasSystemCols}
          rowClassName="editable-row"
          scroll={{ y: 'calc(100vh - 380px)' }}
          loading={props.pointSystemInfoLoading}
          pagination={false}
        />
        </div>
        <Button style={{ margin: '10px 0 15px 0' }} type="dashed" block icon={<PlusOutlined />} onClick={() => handleGasSystemAdd()} >
          添加系统信息
       </Button></>}
       </Form>
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
          scroll={{ y: 'calc(100vh - 380px)' }}
          loading={props.tableDatasLoading}
          pagination={false}
        />
        </Form>
        <Button style={{ margin: '10px 0' }} type="dashed" block icon={<PlusOutlined />} onClick={() => handleAdd()} >
          添加设备
       </Button>
        <Row justify='end'> <Button type="primary" loading={props.addOrUpdateEquipmentInfoLoading} onClick={submits} > 保存</Button></Row>
  
      
      <Modal  visible={parPopVisible}  getContainer={false} onCancel={()=>{setParPopVisible(false)}} width={"70%"} destroyOnClose footer={null} closable={false} maskStyle={{display:'none'}}>
      <Form
        form={form3}
        name="advanced_search3"
        onFinish={() => {setPageIndex3(1); onFinish3(1,pageSize3) }}
        onValuesChange={onValuesChange3}
        initialValues={{
          ManufacturerId: manufacturerList[0] && manufacturerList[0].ID,
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
            <Select allowClear placeholder="请选择监测类别" disabled style={{ width: 150 }}>
              {
                monitoringTypeList2[0] && monitoringTypeList2.map(item => {
                  return <Option key={item.ID} value={item.ID}>{item.Name}</Option>
                })
              }
            </Select>
          </Form.Item>
          {/* <Form.Item style={{ marginRight: 8 }} name="PollutantCode"  >
            {props.loadingGetPollutantById ? <Spin size='small' style={{ width: 150, textAlign: 'left' }} />
              :
              <Select placeholder='请选择监测类型' allowClear showSearch filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} style={{ width: 150 }}>

                {
                  pollutantTypeList[0] && pollutantTypeList.map(item => {
                    return <Option key={item.ID} value={item.ID}>{item.Name}</Option>
                  })
                }
              </Select>}
          </Form.Item> */}
          <Form.Item>
            <Button type="primary" htmlType='submit'>
              查询
           </Button>
          </Form.Item>
        </Row>
        <SdlTable scroll={{ y: 'calc(100vh - 500px)' }}
                  loading={props.loadingGetEquipmentInfoList}
                  bordered dataSource={equipmentInfoList} columns={deviceCol}
                  pagination={{
                    total:equipmentInfoListTotal,
                    pageSize: pageSize3,
                    current: pageIndex3,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    onChange: handleTableChange3,
                  }}
                  
                  />
      </Form>
      </Modal>
      <Modal visible={manufacturerPopVisible}  getContainer={false} onCancel={()=>{setManufacturerPopVisible(false)}} width={800} destroyOnClose footer={null} closable={false} maskStyle={{display:'none'}}>
                {popContent}
      </Modal>
    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);