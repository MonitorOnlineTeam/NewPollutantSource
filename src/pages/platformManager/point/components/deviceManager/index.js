/**
 * 功  能：监测设备
 * 创建人：jab
 * 创建时间：2021.02.11
 */
import React, { useState, useEffect, useRef, Fragment, useMemo } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Card, Button, Select, Tabs, Progress, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Popover, Tag, Spin, Empty } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined,CheckCircleOutlined, QuestionCircleOutlined, ConsoleSqlOutlined } from '@ant-design/icons';
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
import TitleComponents from '@/components/TitleComponents'

const { TextArea } = Input;
const { Option } = Select;


const namespace = 'point'




const dvaPropsData = ({ loading, point, global }) => ({
  monitoringTypeList: point.monitoringTypeList,
  manufacturerList: point.manufacturerList,
  systemModelList: point.systemModelList,
  loadingSystemModel: loading.effects[`${namespace}/getSystemModelList`] || false,
  // monitoringTypeList2: point.monitoringTypeList2,
  pollutantTypeList: point.pollutantTypeList,
  equipmentInfoList: point.equipmentInfoList,
  loadingGetEquipmentInfoList: loading.effects[`${namespace}/getEquipmentInfoList`],
  loadingGetPollutantById: loading.effects[`${namespace}/getPollutantById`] || false,
  // pollutantTypeList2: point.pollutantTypeList2,
  // loadingGetPollutantById2: loading.effects[`${namespace}/getPollutantById2`] || false,
  addOrUpdateEquipmentInfoLoading: loading.effects[`${namespace}/addOrUpdateEquipmentInfo`],
  tableDatasLoading: loading.effects[`${namespace}/getPointEquipmentParameters`],
  pointSystemInfoLoading: loading.effects[`${namespace}/getPointEquipmentInfo`],
  monitoringCategoryTypeLoading: loading.effects[`${namespace}/getMonitoringCategoryType`],
  systemModelListTotal: point.systemModelListTotal,
  equipmentInfoListTotal: point.equipmentInfoListTotal,
  pbList: point.pbList,
  pbListLoading: loading.effects[`${namespace}/getPBList`],
  operationSettingInfo: global.operationSettingInfo,
  equipmentParametersListLoading: loading.effects[`${namespace}/GetEquipmentParametersList`],
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
    getPointEquipmentInfo: (payload, callback) => { //回显 获取站点设备信息
      dispatch({
        type: `${namespace}/getPointEquipmentInfo`,
        payload: payload,
        callback: callback
      })
    },
    addOrUpdateEquipmentInfo: (payload, callback) => { //添加或者修改设备参数信息
      dispatch({
        type: `${namespace}/addOrUpdateEquipmentInfo`,
        payload: payload,
        callback: callback
      })
    },
    getPointEquipmentParameters: (payload, callback) => { // 列表回显 设备参数
      dispatch({
        type: `${namespace}/getPointEquipmentParameters`,
        payload: payload,
        callback: callback
      })
    },
    getManufacturerList: (payload, callback) => { //厂商列表
      dispatch({
        type: `${namespace}/getManufacturerList`,
        payload: payload,
        callback: callback,
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
    getPollutantById2: (payload, callback) => { //监测类型
      dispatch({
        type: `${namespace}/getPollutantById2`,
        payload: payload,
        callback: callback
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
    GetEquipmentParametersList: (payload, callback) => { //监测参数设备信息
      dispatch({
        type: `${namespace}/GetEquipmentParametersList`,
        payload: payload,
        callback: callback
      })
    },
  }
}




const Index = (props) => {

  const [dates, setDates] = useState([]);
  const { DGIMN, pollutantType, manufacturerList, systemModelList, systemModelListTotal, pollutantTypeList, equipmentInfoList, pointSystemInfo, equipmentInfoListTotal, pbList, pbListLoading, gasType, operationSettingInfo, titles, equipmentParametersListLoading, } = props;

  const [defaultPollData, setDefaultPollData] = useState([]);

  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [form3] = Form.useForm();
  const [form4] = Form.useForm();
  const [form5] = Form.useForm();
  const [formDevice] = Form.useForm();

  const defaultParId = pollutantType == 1 ? '1b27155c-5b8b-439a-987c-8100723c2866' : '31f8f6f9-5700-443b-8570-9229b36fa00c'
  useEffect(() => {
    initData()

  }, []);

  const initData = () => {
    // props.getMonitoringTypeList({})
    props.getManufacturerList({}, (data) => {
      // console.log(data)
    })
    //设备信息
    // props.getMonitoringTypeList2({})

    //回显数据
    props.getPointEquipmentParameters({ DGIMN: DGIMN, PollutantType: pollutantType }, (res) => { //设备参数
      setData(res)
    })
    pollutantType == 2 && props.getPointEquipmentInfo({ DGIMN: DGIMN, PollutantType: pollutantType }, (res) => {//废气 系统信息 编辑回显
      // form.setFieldsValue({
      //   GasEquipment:res&&res.gasEquipment? res.gasEquipment : '',
      //   PMEquipment: res&&res.pMEquipment? res.pMEquipment : '',
      //   GasManufacturer:res&&res.gasManufacturer? res.gasManufacturer : '',
      //   PMManufacturer: res&&res.pMManufacturer? res.pMManufacturer: ''
      // })
      // setGaschoiceData(res&&res.gasManufacturerName? res.gasManufacturerName : undefined)
      // setPmchoiceData(res&&res.pMManufacturerName? res.pMManufacturerName : undefined)
      const data = res ? res.map(item => {
        return { ...item, key: cuid() }
      }) : null;
      setGasSystemData(data ? data : [])
    })

    //废水 废气   默认加载监测参数
    props.getPollutantById({ id: defaultParId, type: 1 }, (data) => {
    })

    //废气 配备
    props.getPBList({})

    //CEMS设备生产商
    props.getSystemModelList({})
  }






  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  // const isEditing = (record) => record.key === editingKey;
  const isEditing = (record) =>  record.type === 'edit';
  const edit = (record) => {
    formDevice.setFieldsValue({
      ...record,
      [`EquipmentInfoID_${record.key}`]: record.EquipmentInfoID || undefined,
      [`Range1Min_${record.key}`]: record.Range1 ? record.Range1.split("~")[0] : undefined,
      [`Range1Max_${record.key}`]: record.Range1 ? record.Range1.split("~")[1] : undefined,
      // [`Range2Min_${record.key}`]: record.Range2 ? record.Range2.split("~")[0] : undefined,
      // [`Range2Max_${record.key}`]: record.Range2 ? record.Range2.split("~")[1] : undefined,
      [`EquipmentModel_${record.key}`]: record.EquipmentModel,
      [`EquipmentNumber_${record.key}`]: record.EquipmentNumber,
      [`PollutantCode_${record.key}`]: record.PollutantCode || undefined,//设备参数
      [`Equipment_${record.key}`]: record.Equipment || undefined,
      [`EquipmentCode_${record.key}`]: record.EquipmentCode || undefined,//配备
      [`EquipmentManufacturer_${record.key}`]: record.EquipmentManufacturer,
      [`EquipmentManufacturerID_${record.key}`]: record.EquipmentManufacturerID || undefined,//设备生产商
      
    });
    const tableData = data.map(item=>{
      if(record.key == item.key){
        return {...item,type:'edit'}
      }else{
        return item;
      }
    })
    setData(tableData)
    // setDevicePollutantName(record.PollutantName) //设备参数
    // record.type == "edit" ? setParchoiceDeViceID(record.EquipmentManufacturerID) : null //设备生产商
    // setEditingKey(record.key);
    // props.getMonitoringCategoryType({ PollutantCode: record.PollutantCode }) //根据监测参数获取监测类型 设备生产商查询条件用

  };
  const gasSyatemEdit = (record) => {
    form.setFieldsValue({
      systemName: record.systemName,
      gasManufacturerName: record.gasManufacturerName,
      gasEquipment: record.gasEquipment,
    });

    if (record.type != "add") {
      setGasSystemEquipmentId(record.gasEquipment) //CEMS设备生产商
      setCemsVal(Number(record.systemID))//系统名称
    }
    setGasSystemEditingKey(record.key);
  }
  const del = (record) => {
      const dataSource = [...data];
      let newData = dataSource.filter((item) => item.key !== record.key)
      setData(newData)
      // setEditingKey('');
  };
  const gasSyatemCancel = (record, type) => {
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
      const value = await formDevice.validateFields();
      const newData = [...data];
      const key = record.key;
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        if(!(value[`EquipmentManufacturer_${key}`])){
          message.error('请选择设备生产商')
          return;
        }
        const editRow = {
          Range1: value[`Range1Min_${key}`] ||  value[`Range1Max_${key}`] ? `${value[`Range1Min_${key}`]}~${value[`Range1Max_${key}`]}` : null,
          // Range2:  value[`Range2Min_${key}`] || value[`Range2Max_${key}`] ? `${row.Range2Min}~${row.Range2Max}` : null,
          EquipmentInfoID: value[`EquipmentInfoID_${key}`], //设备名称
          EquipmentModel: value[`EquipmentModel_${key}`], //设备型号
          EquipmentManufacturer:value[`EquipmentManufacturer_${key}`],
          EquipmentManufacturerID: value[`EquipmentManufacturerID_${key}`], //设备生产商 需要传的参数
          PollutantName:undefined,
          PollutantCode:  value[`PollutantCode_${key}`],//设备参数 需要传的参数
          Equipment: undefined,
          EquipmentCode:  value[`EquipmentCode_${key}`], //配备 需要传的参数
          EquipmentNumber:   value[`EquipmentNumber_${key}`],  //设备序列号	
        };
        const item = { ...newData[index] }
        newData.splice(index, 1, { ...item, ...editRow, type:'add' });
        setData(newData);
        // setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
      // if (errInfo.errorFields && errInfo.errorFields[0] && errInfo.errorFields[0].name) {
      //   if (errInfo.errorFields[0].name[0].includes('EquipmentManufacturer')) {
      //     message.error('请选择设备生产商')
      //   }
      // }
    }
  };
  const gasSystemSave = async (record) => {
    try {
      const row = await form.validateFields();
      const newData = [...gasSystemData];
      const key = record.key;
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const editRow = {
          systemName: cemsVal == 465 ? '气态污染物CEMS' : '颗粒物污染物CEMS',
          gasManufacturer: gasSystemEquipmentId,
          systemID: cemsVal,
        };

        const item = record.type === 'add' ? { ...newData[index], key: cuid() } : { ...newData[index] }
        newData.splice(index, 1, { ...item, ...row, ...editRow });
        setGasSystemData(newData);
        setGasSystemEditingKey('');
      } else {
        newData.push(row);
        setGasSystemData(newData);
        setGasSystemEditingKey('');
      }
    } catch (errInfo) {
      if (errInfo && errInfo.errorFields && errInfo.errorFields[0] && errInfo.errorFields[0].name && errInfo.errorFields[0].name[0] == 'gasManufacturerName') {
        message.error('请选择CEMS设备生产商')
      }

      console.log('Validate Failed:', errInfo);
    }
  }
  let columns = [
    {
      title: '监测参数',
      dataIndex: 'PollutantCode',
      align: 'center',
      width: 130,
      editable: true,
      render:(text,record)=>{
        if(record.PollutantName){
          return record.PollutantName
        }else{
          const filterData = pollutantTypeList.filter(item=>item.ID == text)
          return filterData?.[0]?.Name;
        }
      }
    },
    {
      title: '设备生产商',
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
      dataIndex: 'EquipmentCode',
      align: 'center',
      editable: true,
      render:(text,record)=>{
        if(record.Equipment){
          return record.Equipment
        }else{
          const filterData =  pbList.filter(item=>item.code == text)
          return filterData?.[0]?.name;
        }
      }
    },
    {
      title: '量程',
      dataIndex: 'Range1',
      align: 'center',
      width: 240,
      editable: true,
    },
    // {
    //   title: '量程2',
    //   dataIndex: 'Range2',
    //   align: 'center',
    //   width: 240,
    //   editable: true,
    // },
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
      fixed: 'right',
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
            {/* <span onClick={() => { cancel(record) }} style={{ marginRight: 8 }}>
              <a>{record.type == 'add' ? "删除" : "取消"}</a>
            </span> */}
            <span onClick={() => { del(record) }}> 
              <a>删除</a>
            </span>
          </span>
        ) : (
            <Typography.Link  onClick={() => edit(record)}>
              编辑
            </Typography.Link>
          );
      },
    },
  ];
  if (pollutantType == 1) {
    //   columns.splice(4,0,{
    //     title: '手填设备生产商',
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

    columns = columns.filter(item => {
      return item.dataIndex != 'Equipment'
    })
  }
  const [gasSystemData, setGasSystemData] = useState([]);
  const [gasSystemEditingKey, setGasSystemEditingKey] = useState('');
  const isGasSystemEditing = (record) => record.key === gasSystemEditingKey;

  let gasSystemCol = [];
  if (pollutantType == 2) {
    gasSystemCol = [{
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
      fixed: 'right',
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
            <span onClick={() => { gasSyatemCancel(record) }} style={{ marginRight: 8 }}>
              <a>{record.type == 'add' ? "删除" : "取消"}</a>{/*添加的删除 和编辑的取消*/}
            </span>
            <span onClick={() => { gasSyatemCancel(record, 'del') }}> {/*编辑的删除 */}
              <a>{!record.type && "删除"}</a>
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

  const gasSystemCols = gasSystemCol.map((col) => {

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
      title: '设备生产商',
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

  const [gasSystemEquipmentId, setGasSystemEquipmentId] = useState()
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
    form.setFieldsValue({ gasManufacturerName: record.ManufacturerName, gasEquipment: record.SystemModel, });
    setGasSystemEquipmentId(record.ID)
    setManufacturerPopVisible(false)
    setChoiceGasManufacturer(true)
  }
  const [parchoiceDeViceID, setParchoiceDeViceID] = useState(undefined) //设备生产商ID


  const onClearChoice = (value) => {
    form.setFieldsValue({ GasManufacturer: value, GasEquipment: '' });
    setGaschoiceData(value)
  }

  const onPmClearChoice = (value) => {
    form.setFieldsValue({ PMManufacturer: value, PMEquipment: '' });
    setPmchoiceData(value)
  }

  const [devicePollutantName, setDevicePollutantName] = useState()
  const [pbName, setPbName] = useState()

  const [choiceGasManufacturer, setChoiceGasManufacturer] = useState(false); //废气 选择生产商

  const [isManual, setIsManual] = useState(false) //是否手填

  // const []
  const deviceColChoice = (record) => { //设备参数选择
    const key = pollCodeKey
    formDevice.setFieldsValue({
      [`EquipmentManufacturer${key}`]: record.ManufacturerName,
      [`EquipmentManufacturerID${key}`]: record.ID,
      [`EquipmentInfoID${key}`]: record.EquipmentName,
      [`EquipmentModel${key}`]: record.EquipmentType,
    });
      // setParchoiceDeViceID(record.ID)
      setParPopVisible(false)
      formDevice.setFieldsValue({ [`PollutantCode${key}`]: record.PollutantCode })
    // setDevicePollutantName(record.PollutantName)
    // setIsManual(true)
    // props.getPollutantById2({ id: record.PollutantType, type: 1 }, () => {
    //    formDevice.setFieldsValue({ PollutantCode: record.PollutantCode })
    //    setDevicePollutantName(record.PollutantName)
    //    setIsManual(true)
    // })
  }
  const onParClearChoice = (value,key) => {//设备参数清除
    formDevice.setFieldsValue({[`EquipmentManufacturer${key}`]: undefined,  [`EquipmentManufacturerID${key}`]: undefined, [`PollutantCode${key}`]: undefined,  [`EquipmentInfoID${key}`]: '',  [`EquipmentModel${key}`]: '', });
    // setParchoiceDeViceID(value)
    // props.updateState({pollutantTypeList2:[]}) //清除监测参数 
    // props.updateState({ pollutantTypeList2: defaultPollData })//恢复默认
    setIsManual(false)
  }
  const onManufacturerClearChoice = (value) => { //CEMS 设备生产商清除功能
    form.setFieldsValue({ gasManufacturerName: value, gasEquipment: value });
    setGasSystemEquipmentId('')
    setChoiceGasManufacturer(false)
  }
  const [pageIndex2, setPageIndex2] = useState(1)
  const [pageSize2, setPageSize2] = useState(10)
  const onFinish2 = async (pageIndex2, pageSize2, cemsVal) => { //生成商弹出框 查询

    setPageIndex2(pageIndex2)
    try {
      const values = await form2.validateFields();
      props.getSystemModelList({
        pageIndex: pageIndex2,
        pageSize: pageSize2,
        SystemName: cemsVal,
        ...values,
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  const handleTableChange2 = async (PageIndex, PageSize) => { //分页
    const values = await form2.validateFields();
    setPageSize2(PageSize)
    setPageIndex2(PageIndex)
    props.getSystemModelList({ ...values, SystemName: cemsVal, PageIndex, PageSize })
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
    onFinish={() => { setPageIndex2(1); onFinish2(1, pageSize2, cemsVal) }}
    initialValues={{
      MonitoringType: 266,
      // ManufacturerID: manufacturerList[0] && manufacturerList[0].ID,
    }}

  >
    <Row>
      <Form.Item style={{ marginRight: 8 }} name='ManufacturerID' >
        <Select placeholder='请选择设备生产商' showSearch allowClear filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} style={{ width: 200 }}>
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
    <SdlTable scroll={{ y: 'calc(100vh - 300px)' }} style={{ width: 800 }}
      loading={props.loadingSystemModel} bordered dataSource={systemModelList} columns={generatorCol}
      pagination={{
        total: systemModelListTotal,
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
      title: '设备生产商',
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
  const onFinish3 = async (pageIndexs, pageSizes,key) => {  //查询 设备信息 除分页 每次查询页码重置为1
    try {
      const values = await form3.validateFields();
      const pollutantCode = formDevice.getFieldValue([`PollutantCode${key}`]);
      props.getEquipmentInfoList({
        ...values,
        PollutantCode: pollutantCode,
        PageIndex: pageIndexs && typeof pageIndexs === "number" ? pageIndexs : pageIndex3,
        PageSize: pageSizes ? pageSizes : pageSize3
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }

  const handleTableChange3 = (PageIndex, PageSize) => {
    setPageIndex3(PageIndex)
    setPageSize3(PageSize)
    onFinish3(PageIndex, PageSize,pollCodeKey)
  }
  // const onValuesChange3 = (hangedValues, allValues) => {
  //   if (Object.keys(hangedValues).join() == 'PollutantType') {
  //     props.getPollutantById({ id: hangedValues.PollutantType, type: 1 })
  //     form3.setFieldsValue({ PollutantCode: undefined })
  //   }
  // }
  // const { monitoringTypeList2 } = props;
  const [parPopVisible, setParPopVisible] = useState(false) //设备信息弹出框

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
  const [selectDeviceParVisible, setSelectDeviceParVisible] = useState(false)
  const [selectDeviceParTitle, setSelectDeviceParTitle] = useState(`${titles}添加设备`)
  const [deviceParData, setDeviceParData] = useState([])
  const handleAdd = () => { //添加设备
    setSelectDeviceParVisible(true)
    setTabPollData([])
    setTotalTabPollData([])
    form4.resetFields()
    form5.resetFields()
    setSelectedEquipmentParametersList([])
    props.GetEquipmentParametersList({
      dgimn: DGIMN,
      pollutantType: defaultParId
    }, (res) => {
      setDeviceParData(res)
    })
    //   if (editingKey) {
    //     message.warning('请先保存数据')
    //     return
    //   }else{
    //   formDevice.resetFields();
    //   formDevice.setFieldsValue({PollutantCode:defaultPollData&&defaultPollData[0]? defaultPollData[0].ID : null})
    //   setDevicePollutantName(defaultPollData&&defaultPollData[0]? defaultPollData[0].Name : null)
    //   setEditingKey(editingKey + 1)
    //   const newData = {
    //     PollutantCode: "",
    //     Range1: "",
    //     Range2: "",
    //     EquipmentManufacturer: undefined,
    //     EquipmentInfoID: "",
    //     EquipmentModel: "",
    //     EquipmentNumber: '',
    //     Equipment: '',
    //     key: editingKey+1,
    //     type: 'add',
    //     editable: true,
    //   }
    //   setData([...data, newData])
    //   setIsManual(false)
    //   props.updateState({pollutantTypeList2:defaultPollData})
    //  }
  };

  const [tabPollData, setTabPollData] = useState([])
  const [tabTotalPollData, setTotalTabPollData] = useState([])
  const [tabKey,setTabKey] = useState()

  const deviceParQuery = () => {
    setSelectedEquipmentParametersList([])
    const monitorParVal = form4.getFieldValue('monitorPar')
    if (monitorParVal) {
      const commonPollutantData = deviceParData.filter(item => {
        return monitorParVal.some(val => {
          // 检查两个对象的 PollutantCode 是否相同  
          return item.PollutantCode === val;
        });
      });
      setTabKey(commonPollutantData[0]?.PollutantCode)
      setTabPollData(commonPollutantData)
      setTotalTabPollData(commonPollutantData)
    }
  }
  const tabPollDataFun = (pollutantCode,manufacturerId, equipmentType ) => {
    let childData, childArr = [], indexToReplace = -1;
    let tabPollList = tabTotalPollData.map(item => ({ ...item }));
    tabPollList.map((item, index) => {
      if (item.PollutantCode == pollutantCode) {
        indexToReplace = index
        if (item.ChildList) {
          childData = item;
          item.ChildList.map(childrenItem => {
            if (childrenItem) {
              if(manufacturerId && equipmentType){
                if ( childrenItem.ManufacturerId == manufacturerId  && childrenItem.EquipmentType?.indexOf(equipmentType) != -1 ) { //设备生产商 设备型号
                  childArr.push(childrenItem)
                }
              }else{
                if ( (manufacturerId&&childrenItem.ManufacturerId == manufacturerId)  || (equipmentType&&childrenItem.EquipmentType?.indexOf(equipmentType) != -1)) { //设备生产商 设备型号
                 childArr.push(childrenItem)
              }
              }

            }
    
          })
        }
      }
    })
    childData.ChildList = childArr
     // 使用 slice 创建一个新数组，包含要替换位置之前的元素
    let newArray = tabPollList.slice(0, indexToReplace);
    // 在新数组的指定位置插入新的对象  
    newArray.push(childData);
    // 继续添加原数组中要替换位置之后的元素
    newArray.push(...tabPollList.slice(indexToReplace + 1));
    setTabPollData(newArray)
  }
  const selectDeviceParChange = (pollutantCode) => {
    const values = form5.getFieldsValue();
    const equipmentManufacturer = values[`equipmentManufacturer_${pollutantCode}`]
    const equipmentType = values[`equipmentType${pollutantCode}`]
      if((!equipmentManufacturer) && (!equipmentType)){
        setTabPollData(tabTotalPollData)
      }else{
        tabPollDataFun(pollutantCode,equipmentManufacturer,equipmentType)
      }
  }
  const selectDeviceParOk = () => {
     selectedEquipmentParametersList.map(item=>{
      const record = item;
      formDevice.setFieldsValue({
        [`EquipmentInfoID_${record.key}`]: record.EquipmentName || undefined, //设备名称
        [`EquipmentModel_${record.key}`]: record.EquipmentType,//设备型号
        [`PollutantCode_${record.key}`]: record.PollutantCode || undefined,//设备参数
        [`EquipmentManufacturer_${record.key}`]: record.ManufacturerName,
        [`EquipmentManufacturerID_${record.key}`]: record.ID || undefined,//设备生产商
      })
     })
     setData([...data,...selectedEquipmentParametersList])
     setSelectDeviceParVisible(false)
  }
  const deviceParCol = (type) => [{
    title: '设备参数',
    dataIndex: 'PollutantName',
    align: 'center',
  },
  {
    title: '设备名称',
    dataIndex: 'EquipmentName',
    align: 'center',
  },
  {
    title: '设备型号',
    dataIndex: 'EquipmentType',
    align: 'center',
  },
  {
    title: '设备生产商',
    dataIndex: 'ManufacturerName',
    align: 'center',
  },
  {
    title: '分析方法',
    dataIndex: 'AnalyticalMethod',
    align: 'center',
    editable: false,
  },
  {
    title: '操作',
    align: 'center',
    fixed: 'right',
    render: (_, record) => {
      return <span onClick={() => { operateDevicePar(record, type) }}>
        <a>{type == 1 ? "选择" : "删除"}</a>
      </span>
    }
  }

  ]
 
  const [selectedEquipmentParametersList,setSelectedEquipmentParametersList] = useState([])
  const operateDevicePar = (record, type)=>{
    let tabPollList = tabPollData.map(item => ({ ...item }));

   if(type==1){ //添加
    setSelectedEquipmentParametersList([...selectedEquipmentParametersList,{...record,type:'edit',key:cuid()}])
    
    let childData =  tabPollList.map((item, index) => {
      if (item.PollutantCode == tabKey) {
        if (item.ChildList) {
          item.ChildList = item.ChildList.filter(obj => obj.ID !== record.ID ); 
          return item;
        }
      }else{
        return item;
      }
    })
    console.log(childData)
    setTabPollData(childData)
   }else{ //删除
     let selectedEquipmentParData = selectedEquipmentParametersList.map(item => ({ ...item }));
         selectedEquipmentParData = selectedEquipmentParData.filter(item=>item.ID !== record.ID)
     setSelectedEquipmentParametersList(selectedEquipmentParData)

     const pollCode = record.PollutantCode
     let childDelData =  tabPollList.map((item, index) => {
       if (item.PollutantCode == pollCode) {
         if (item.ChildList) {
           item.ChildList= [record,...item.ChildList]
           return item;
         }
       }else{
         return item;
       }
     })
     setTabPollData(childDelData)
   }
  }


  const handleGasSystemAdd = () => { //添加系统信息
    if (gasSystemEditingKey) {
      message.warning('请先保存数据')
      return
    } else {
      form.resetFields();
      form.setFieldsValue({ systemName: cemsVal })
      setGasSystemEditingKey(gasSystemEditingKey + 1)
      const newData = {
        systemName: '',
        gasManufacturerName: '',
        gasEquipment: '',
        type: 'add',
        key: gasSystemEditingKey + 1,
      }
      setGasSystemData([...gasSystemData, newData])
      setChoiceGasManufacturer(false)
    }
  }
  // const onValuesChange = async (hangedValues, allValues) => { //设备信息

  //   if (Object.keys(hangedValues).join() == 'PollutantCode') { //设备参数
  //     const data = pollutantTypeList.filter((item) => item.ID === hangedValues.PollutantCode)
  //     setDevicePollutantName(data[0] ? data[0].Name : '')
  //   }
  //   if (Object.keys(hangedValues).join() == 'Equipment') { //废气 配备
  //     const data = pbList.filter((item) => item.code === hangedValues.Equipment)
  //     setPbName(data[0] ? data[0].name : '')
  //   }
  // }
   const [pollCodeKey,setPollCodeKey] = useState()
  const popVisibleClick = (key) => {
    setParPopVisible(!parPopVisible);
    form3.resetFields();
    // form3.setFieldsValue({
      // ManufacturerId:manufacturerList[0] && manufacturerList[0].ID,
      // PollutantType: defaultParId,
    // })
    setPollCodeKey(key)
    setPageIndex3(1); onFinish3(1, pageSize3,key)
    
  }
  const [manufacturerPopVisible, setManufacturerPopVisible] = useState(false)
  const manufacturerPopVisibleClick = () => { //cems设备生产商
    setManufacturerPopVisible(true)
    form2.resetFields();
    form.setFieldsValue({ 'systemName': cemsVal });
    // form2.setFieldsValue({ ManufacturerId:manufacturerList[0] && manufacturerList[0].ID,})
    setTimeout(() => {
      onFinish2(1, 10, cemsVal)
    })

  }


  const [cemsVal, setCemsVal] = useState(465)
  const cemsChange = (val) => {
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
    type,
    ...restProps
  }) => {
    let inputNode = '';
    const key = dataIndex === 'systemName' ||  dataIndex === 'gasEquipment'? '':   record && (`_${record.key}` || `_${record.ID}`)
    if (dataIndex === 'EquipmentManufacturer') { // 设备生产商
      inputNode = <Select onClick={() => { popVisibleClick(key) }} onChange={(val)=>onParClearChoice(val,key)} allowClear showSearch={false} dropdownClassName={styles.popSelectSty} placeholder="请选择"> 
                  </Select>;
    } else if (dataIndex === 'systemName') {
      inputNode = <Select placeholder='请选择' onChange={cemsChange} disabled={choiceGasManufacturer}>
        <Option value={465}>气态污染物CEMS</Option>
        <Option value={466}>颗粒物污染物CEMS</Option>
      </Select>
    } else if (inputType === 'number') {
      inputNode = <InputNumber placeholder={`请输入`} />
    } else {
      inputNode = <Input title={formDevice.getFieldValue([dataIndex])} disabled={title === '设备名称' || title === '设备型号' || title === 'CEMS设备规格型号' ? true : title === '手填设备生产商' || title === '手填设备名称' || title === '手填设备型号' ? isManual : false} placeholder={title === '手填设备生产商' || title === '手填设备名称' || title === '手填设备型号' ? `CIS同步使用` : `请输入`} />
    }

    // const parLoading = record && record.type && record.type === 'add' ? props.loadingGetPollutantById2 : props.monitoringCategoryTypeLoading; //监测参数提示loading
    const parLoading =  props.loadingGetPollutantById;
    return (
      <td {...restProps}>
        {editing ? (
          inputType === 'range' ?
            <Form.Item style={{ margin: 0 }}>
              <Form.Item style={{ display: 'inline-block', margin: 0 }}
                name={`${dataIndex}Min${key}`}
              >
                <InputNumber placeholder={`最小值`} />
              </Form.Item>
              <span style={{ display: 'inline-block', width: '24px', lineHeight: '32px', textAlign: 'center' }}>
                ~
        </span>
              <Form.Item
                name={`${dataIndex}Max${key}`}
                style={{ display: 'inline-block', margin: 0 }}
              >
                <InputNumber placeholder={`最大值`} />
              </Form.Item>
            </Form.Item> : dataIndex === 'PollutantCode' ? //监测参数

              <>{parLoading ? <Spin size='small' style={{ textAlign: 'left' }} />
                :
                <Form.Item name={`PollutantCode${key}`} style={{ margin: 0 }}>
                  <Select placeholder='请选择' disabled={isManual ? true : false} allowClear={false} showSearch filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} >
                    {
                      pollutantTypeList[0] && pollutantTypeList.map(item => {
                        return <Option key={item.ID} value={item.ID}>{item.Name}</Option>
                      })
                    }
                  </Select></Form.Item>}</>
              : dataIndex === 'EquipmentCode' ? //废气 配备

                <>{pbListLoading ? <Spin size='small' style={{ textAlign: 'left' }} />
                  :
                  <Form.Item name={`EquipmentCode${key}`} style={{ margin: 0 }}>
                    <Select allowClear placeholder='请选择' showSearch filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} >
                      {
                        pbList[0] && pbList.map(item => {
                          return <Option key={item.code} value={item.code}>{item.name}</Option>
                        })
                      }
                    </Select></Form.Item>}</>
                : dataIndex === 'gasManufacturerName' ?  //废气-常规CEMS  废气-Vocs
                  <Form.Item name={`gasManufacturerName`} style={{ margin: 0 }} rules={[{ required: true, message: '' }]}>
                    <Select onClick={() => { manufacturerPopVisibleClick() }} onChange={onManufacturerClearChoice} allowClear showSearch={false} dropdownClassName={styles.popSelectSty} placeholder="请选择"> </Select>
                  </Form.Item>

                  :

                  <Form.Item
                    name={`${dataIndex}${key}`}
                    style={{ margin: 0 }}
                    // rules={[{ required: dataIndex === "EquipmentManufacturer", message: `` }]}
                  >
                    {inputNode}
                  </Form.Item>
        ) : (
            children
          )}
            {dataIndex === 'EquipmentManufacturer'&&<Form.Item hidden name={`EquipmentManufacturerID${key}`}></Form.Item>}
      </td>
    );
  };


  const submits = async () => {
    if (gasSystemEditingKey) {
      message.warning('请保存系统信息数据')
      return;
    }
    try {
      // const values = await form.validateFields();
      const gasSystemInfo = gasSystemData.map(item => { //废气 系统信息
        return {
          SystemManufactor: item.systemID,
          GasManufacturer: item.gasManufacturer,
          GasEquipment: item.gasEquipment,
        }
      })
      let  parList = [], flag = true;
      for(let i=0;i<data.length;i++){
        let item = data[i]
        if(item?.type&&item.type=='edit'){
          message.warning('请保存设备信息数据')
          flag = false;
          break;
        }else{
          parList.push({
            ID: '', DGIMN: DGIMN, PollutantCode: item.PollutantCode, Range1: item.Range1, // Range2: item.Range2,
            EquipmentManufacturer: item.EquipmentManufacturerID,
            EquipmentInfoID: item.EquipmentInfoID, EquipmentModel: item.EquipmentModel, EquipmentNumber: item.EquipmentNumber, Equipment: item.EquipmentCode,
            // ManualEquipmentManufacturer: item.ManualEquipmentManufacturer,
            // ManualEquipmentModel: item.ManualEquipmentModel,
            // ManualEquipmentName: item.ManualEquipmentName,
          })
        }
      }
      if(flag){
      const par = {
        equipmentModel: pollutantType == 1 ? null : gasSystemInfo,
        equipmentParametersList: parList[0] ? parList : [],
        DGIMN: DGIMN,
      }
      props.addOrUpdateEquipmentInfo({
        ...par
      }, () => {
        props.onCancel()
      })
    }


    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }

  return (
    <div>

      <Form form={form} name="advanced_search" >
        {pollutantType != 1 && <><div>
          <div style={{ fontWeight: 'bold', paddingBottom: 5 }}> 系统信息</div>
          {/* { systemInfo()} */}
          <SdlTable
            components={{
              body: {
                cell: (data)=>EditableCell({...data,type:'isStyInfo'}),
              }
            }}
            bordered
            dataSource={gasSystemData}
            columns={gasSystemCols}
            rowClassName="editable-row"
            scroll={{ y: 'calc(100vh - 580px)' }}
            loading={props.pointSystemInfoLoading}
            pagination={false}
          />
        </div>
          <Button style={{ margin: '10px 0 15px 0' }} type="dashed" block icon={<PlusOutlined />} onClick={() => handleGasSystemAdd()} >
            添加系统信息
       </Button></>}
      </Form>
      <div style={{ fontWeight: 'bold', paddingBottom: 10 }}>设备信息</div>
      <Form form={formDevice} name="advanced_search_device"
      //  onValuesChange={onValuesChange}
       >
        <SdlTable
          components={{
            body: {
              cell: EditableCell
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
      <Row justify='end' align='middle' style={{width:'100%',height:48,backgroundColor:'#fff',boxShadow: '0 -4px 4px rgb(240, 240, 240)', position:'absolute',left:0,left:0, bottom:0}}> 
        <Button type="primary" style={{marginRight:20}} disabled={gasSystemData?.length==0 &&  data?.length==0 } loading={props.addOrUpdateEquipmentInfoLoading} onClick={submits} > 保存</Button>
      </Row>

      <Modal  wrapClassName={`${styles.popSty}`}  visible={parPopVisible} getContainer={false} onCancel={() => { setParPopVisible(false) }} width={"70%"} destroyOnClose footer={null} closable={false} maskStyle={{ display: 'none' }}>
        <Form
          form={form3}
          name="advanced_search3"
          onFinish={() => { setPageIndex3(1); onFinish3(1, pageSize3,pollCodeKey) }}
          // onValuesChange={onValuesChange3}
          // initialValues={{
            // ManufacturerId: manufacturerList[0] && manufacturerList[0].ID,
          // }}
        >
          <Row>
            <span>
              <Form.Item style={{ marginRight: 8 }} name='ManufacturerId' >
                <Select placeholder='请选择设备生产商' showSearch filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} style={{ width: 240 }} allowClear>
                  {
                    manufacturerList[0] && manufacturerList.map(item => {
                      return <Option key={item.ID} value={item.ID}>{item.ManufacturerName}</Option>
                    })
                  }
                </Select>
              </Form.Item>
            </span>
            <Form.Item style={{ marginRight: 8 }} name="EquipmentType">
            <Input allowClear placeholder="请输入设备型号" style={{ width: 180 }} />
          </Form.Item>
          {/* <Form.Item style={{ marginRight: 8 }} name="PollutantType">
            <Select allowClear placeholder="请选择监测类别" disabled style={{ width: 150 }}>
              {
                monitoringTypeList2[0] && monitoringTypeList2.map(item => {
                  return <Option key={item.ID} value={item.ID}>{item.Name}</Option>
                })
              }
            </Select>
          </Form.Item> */}
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
              total: equipmentInfoListTotal,
              pageSize: pageSize3,
              current: pageIndex3,
              showSizeChanger: true,
              showQuickJumper: true,
              onChange: handleTableChange3,
            }}

          />
        </Form>
      </Modal>
      <Modal visible={selectDeviceParVisible} title={selectDeviceParTitle} wrapClassName={`${styles.deviceParSty} spreadOverModal table-light`} onOk={selectDeviceParOk} onCancel={() => { setSelectDeviceParVisible(false) }} width={800} destroyOnClose getContainer={false} maskStyle={{ display: 'none' }}>
        <TitleComponents simpleSty text='选点位设备监测参数' key='1' style={{ marginTop:4 }}/>
        <Row>
          <Form
            form={form4}
            name="advanced_search4"
          >
            <Form.Item style={{ marginRight: 8 }} label='监测参数' name='monitorPar'>
              <Select placeholder='请选择'
                mode='multiple' maxTagCount={4} maxTagTextLength={5} maxTagPlaceholder="..." style={{ width: 300 }} showSearch filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} >
                {
                  pollutantTypeList[0] && pollutantTypeList.map(item => {
                    return <Option key={item.ID} value={item.ID}>{item.Name}</Option>
                  })
                }
              </Select>
            </Form.Item>
          </Form>
          <Button type="primary" loading={equipmentParametersListLoading} onClick={() => { deviceParQuery() }}>
            确定
           </Button>
        </Row>

        <TitleComponents simpleSty text='待选设备清单' key='2' style={{ marginBottom: 0 ,marginTop:8 }} />
        {tabPollData?.[0] ? <Tabs
          onChange={(key)=>{setTabKey(key)}}
        >
          {tabPollData.map(item => {
            return <Tabs.TabPane tab={<>{item?.PollutantName}
              {selectedEquipmentParametersList?.[0] && selectedEquipmentParametersList?.filter(filterItem=>filterItem.PollutantCode==item.PollutantCode)?.[0]?  <CheckCircleOutlined /> : ''}
               </>} 
               
               
               key={item?.PollutantCode} >
              <Row style={{ marginBottom: 12 }}>
              <Form  form={form5}   name="advanced_search5" layout='inline'>
                <Form.Item style={{ margin: '0 8px 0 0' }} name={`EquipmentManufacturerID_${item?.PollutantCode}`}>
                  <Select onChange={() => { selectDeviceParChange(item?.PollutantCode) }} placeholder='请选择设备生产商' style={{ width: 240 }} showSearch filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} allowClear>
                    {
                      manufacturerList[0] && manufacturerList.map(item => {
                        return <Option key={item.ID} value={item.ID}>{item.ManufacturerName}</Option>
                      })
                    }
                  </Select>
                </Form.Item>
                <Form.Item style={{ margin: '0 8px 0 0' }}  name={`equipmentType_${item?.PollutantCode}`}>
                  <Input onChange={(e) => { selectDeviceParChange( item?.PollutantCode) }} allowClear placeholder="请输入设备型号" style={{ width: 240 }} />
                </Form.Item>
                </Form>
              </Row>
              <SdlTable 
                scroll={{ y: 'calc(100vh - 812px)' }}
                loading={equipmentParametersListLoading}
                dataSource={item?.ChildList} columns={deviceParCol(1)}
              />
            </Tabs.TabPane>
          })
          }
        </Tabs>
          :
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        }

        <TitleComponents simpleSty text='已选设备清单' key='3' />
         {selectedEquipmentParametersList?.[0]? <SdlTable scroll={{ y: 'calc(100vh - 812px)' }}
                dataSource={selectedEquipmentParametersList} columns={deviceParCol(2)}
                pagination={false}
              />
              :
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        }
      </Modal>
      <Modal wrapClassName={`${styles.popSty}`}  visible={manufacturerPopVisible} getContainer={false} onCancel={() => { setManufacturerPopVisible(false) }}  destroyOnClose footer={null} closable={false} maskStyle={{ display: 'none' }}>
        {popContent}
      </Modal>
    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);