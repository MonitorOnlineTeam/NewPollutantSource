/**
 * 功  能：调试检测 监测设备
 * 创建人：jab
 * 创建时间：2022.02.20
 */
import React, { useState, useEffect, useRef, Fragment, useMemo } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Tabs, Typography, Card, Button, Select, Progress, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Popover, Tag, Spin } from 'antd';
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
import styles from "../style.less"
import Cookie from 'js-cookie';
import cuid from 'cuid';
const { TabPane } = Tabs;
const { Option } = Select;
const namespace = 'commissionTestPoint'




const dvaPropsData = ({ loading, commissionTestPoint, commissionTest, }) => ({
  manufacturerList: commissionTest.manufacturerList,
  systemModelList: commissionTestPoint.systemModelList,
  loadingSystemModel: loading.effects[`${namespace}/testGetSystemModelList`] || false,
  pollutantTypeList: commissionTest.pollutantTypeList,
  pollutantTypeList2: commissionTest.pollutantTypeList2,
  loadingGetPollutantById: loading.effects[`commissionTest/getPollutantById`] || false,
  equipmentInfoList: commissionTestPoint.equipmentInfoList,
  equipmentInfoListTotal: commissionTestPoint.equipmentInfoListTotal,
  loadingGetEquipmentInfoList: loading.effects[`${namespace}/getTestEquipmentInfoList`],
  systemModelListTotal: commissionTestPoint.systemModelListTotal,
  pbListLoading: loading.effects[`${namespace}/getPBList`],
  paramInfoList:commissionTestPoint.paramInfoList,
  paramInfoListTotal: commissionTestPoint.paramInfoListTotal,
  paramInfoListLoading: loading.effects[`${namespace}/getTestParamInfoList`],
  cEMSSystemListLoading: loading.effects[`${namespace}/getCEMSSystemList`],
  operationCEMSSystemLoading: loading.effects[`${namespace}/operationCEMSSystem`],
  paramListLoading: loading.effects[`${namespace}/getParamList`],
  operationParamLoading: loading.effects[`${namespace}/operationParam`],
})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
    getManufacturerList: (payload, callback) => { //厂家下拉列表
      dispatch({
        type: `commissionTest/getManufacturerList`,
        payload: payload,
        callback: callback
      })
    },
    getPollutantById: (payload) => { //监测类型
      dispatch({
        type: `commissionTest/getPollutantById`,
        payload: payload,

      })
    },
    testGetSystemModelList: (payload, callback) => { //cems系统型号 弹框
      dispatch({
        type: `${namespace}/testGetSystemModelList`,
        payload: payload,
        callback: callback,
      })
    },
    getTestEquipmentInfoList: (payload, callback) => { //cems监测设备 弹框
      dispatch({
        type: `${namespace}/getTestEquipmentInfoList`,
        payload: payload,
        callback: callback,
      })
    },
    getTestParamInfoList: (payload, callback) => { //参比仪器 弹框
      dispatch({
        type: `${namespace}/getTestParamInfoList`,
        payload: payload,
        callback: callback,
      })
    },
    getCEMSSystemList: (payload, callback) => { // CEMS参数信息列表
      dispatch({
        type: `${namespace}/getCEMSSystemList`,
        payload: payload,
        callback: callback,
      })
    },
    operationCEMSSystem: (payload, callback) => { //添加或者修改CEMS参数信息
      dispatch({
        type: `${namespace}/operationCEMSSystem`,
        payload: payload,
        callback: callback,
      })
    },
    getParamList: (payload, callback) => { // 参比仪器信息
      dispatch({
        type: `${namespace}/getParamList`,
        payload: payload,
        callback: callback,
      })
    },
    operationParam: (payload, callback) => { //添加或者修改参比仪器信息
      dispatch({
        type: `${namespace}/operationParam`,
        payload: payload,
        callback: callback,
      })
    },

  }
}




const Index = (props) => {
  
  const { DGIMN, pollutantType, manufacturerList, systemModelList, systemModelListTotal, equipmentInfoList, pointSystemInfo, equipmentInfoListTotal, pbList, pbListLoading, gasType, pollutantTypeList, pollutantTypeList2 ,} = props;
  
  const { paramInfoList, paramInfoListTotal, paramInfoListLoading,} = props;

  const [defaultPollData, setDefaultPollData] = useState([]);

  const evaluationBasisList = [{name: 'HJ 75-2017《固定污染源烟气（SO2、NOX、颗粒物）排放连续监测技术规范',value:'1'},{name:'环办执法【2019】64号',value:'2'}]

  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [form3] = Form.useForm();
  const [form4] = Form.useForm();

  const [formDevice] = Form.useForm();
  const [formReferInstru ]  = Form.useForm();
  useEffect(() => {
    initData()
  }, [DGIMN]);

  const initData = () => {

    props.getManufacturerList({})  // 弹框 厂家列表

    props.getPollutantById({})  //cems 监测设备  默认加载监测参数
    props.getPollutantById({type:1})  //cems 监测设备  默认加载监测参数

    props.getCEMSSystemList({DGIMN:DGIMN},(data)=>{ //cems 系统信息 监测设备 表格数据
      setSystemData(data.systemModelList?data.systemModelList :[] )
      setDeviceData(data.eqModelList?data.eqModelList :[])
    })
    props.getParamList({ DGIMN:DGIMN},(data)=>{ //参比仪器表格数据
       setReferInstruData(data)
    })
  }


  const systemEdit = (record) => {
    form.setFieldsValue({
      ...record,
      SystemName:Number(record.SystemNameID),
    });
    if (record.type != "add") { //获取接口原有列表数据
      setSystemManufactorID(record.ManufactorID) //CEMS设备生产商
      setCemsVal(Number(record.SystemNameID))//系统名称 
    }

    setSystemEditingKey(record.ID);
  }

  const [deviceData, setDeviceData] = useState([]);
  const [deviceEditingKey, setDeviceEditingKey] = useState('');
  const isDeviceEditing = (record) => record.ID === deviceEditingKey;

  const deviceEdit = (record) => {


    formDevice.setFieldsValue({
      ...record,
      EquipmentManufacturer:record.ManufactorName,
    });
    setDevicePollutantName(record.PollutantName) //监测设备
    

    
    
    if(record.type != "add"){
      setDeviceManufactorID(record.ManufactorID)//设备厂家
    }
    setDeviceEditingKey(record.ID)

  };


  const referInstruEdit = (record) => {
    formReferInstru.setFieldsValue({
      ...record,
      ReferInstruManufacturer: record.ManufactorName,
    });
    setRefPollutantName(record.PollutantName)//监测设备
    if (record.type != "add") {
      setRefManufactorID(record.ManufactorID) //CEMS设备生产商
    }
    setReferInstruEditingKey(record.ID);
  }

  const deviceCancel = (record, type) => {
    if (record.type === 'add' || type) { //新添加一行 删除 || 原有数据编辑的删除  不用走接口
      const dataSource = [...deviceData];
      let newData = dataSource.filter((item) => item.ID !== record.ID)
      setDeviceData(newData)
      setDeviceEditingKey('');
    } else { //编辑状态
      setDeviceEditingKey('');
    }
  };
  const systemCancel = (record, type) => {
    if (record.type === 'add' || type) { //新添加一行 删除 || 原有数据编辑的删除  不用走接口
      const dataSource = [...systemData];
      let newData = dataSource.filter((item) => item.ID !== record.ID)
      setSystemData(newData)
      setSystemEditingKey('');
    } else { //编辑状态
      setSystemEditingKey('');
    }
  };
  const referInstruCancel = (record, type) => {
    if (record.type === 'add' || type) { //新添加一行 删除 || 原有数据编辑的删除  不用走接口
      const dataSource = [...referInstruData];
      let newData = dataSource.filter((item) => item.ID !== record.ID)
      setReferInstruData(newData)
      setReferInstruEditingKey('');
    } else { //编辑状态
      setReferInstruEditingKey('');
    }
  };

  const systemSave = async (record) => {
    try {
      const row = await form.validateFields();
      const newData = [...systemData];
      const key = record.ID;
      const index = newData.findIndex((item) => key === item.ID);
      if (index > -1) {
        const editRow = {
          SystemName: cemsVal == 465 ? '气态污染物CEMS' : '颗粒物污染物CEMS',
          ManufactorID: systemManufactorID,
          SystemNameID: cemsVal,
        };

        const item = record.type === 'add' ? { ...newData[index], ID: cuid() } : { ...newData[index] }
        newData.splice(index, 1, { ...item, ...row, ...editRow });
        setSystemData(newData);
        setSystemEditingKey('');
      } else {
        newData.push(row);
        setSystemData(newData);
        setSystemEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  }

  const deviceSave = async (record) => { //监测设备 保存添加

    try {
      const row = await formDevice.validateFields();
      const newData = [...deviceData];
      const key = record.ID;
      const index = newData.findIndex((item) => key === item.ID);
      if (index > -1) {
        const editRow = {
          Range: row.MinRange || row.MaxRange ? `${row.MinRange}~${row.MaxRange}` : null,
          PollutantName: devicePollutantName,
          ManufactorName:row.EquipmentManufacturer,
          ManufactorID: deviceManufactorID, //设备厂家
        };
        const item = record.type === 'add' ? { ...newData[index], ID: cuid() } : { ...newData[index] }
        newData.splice(index, 1, { ...item, ...row, ...editRow });
      
        setDeviceData(newData);
        setDeviceEditingKey('');
      } else {
        newData.push(row);
        setDeviceData(newData);
        setDeviceEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };
   const referInstruSave = async (record) =>{
    try {
      const row = await formReferInstru.validateFields();
      const newData = [...referInstruData];
      const key = record.ID;
      const index = newData.findIndex((item) => key === item.ID);
      if (index > -1) {
        const editRow = {
          PollutantName: refPollutantName,
          ManufactorName:row.ReferInstruManufacturer,
          ManufactorID: refManufactorID,
        };

        const item = record.type === 'add' ? { ...newData[index], ID: cuid() } : { ...newData[index] }
        newData.splice(index, 1, { ...item, ...row, ...editRow });
        setReferInstruData(newData);
        setReferInstruEditingKey('');
      } else {
        newData.push(row);
        setReferInstruData(newData);
        setReferInstruEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  }


  const equipmentCol = [
    {
      title: '监测参数',
      dataIndex: 'PollutantCode',
      align: 'center',
      width: 120,
      editable: true,
      name:'监测设备',
      render: (text, row) => row.PollutantName,
    },
    {
      title: '生产厂家',
      dataIndex: 'EquipmentManufacturer',
      align: 'center',
      editable: true,
      render: (text, row) => row.ManufactorName,
    },

    {
      title: '设备型号',
      dataIndex: 'EquipmentModel',
      align: 'center',
      editable: true,
    },
    {
      title: 'CEMS测试原理',
      dataIndex: 'TestPrinciple',
      align: 'center',
      editable: true,
    },
    {
      title: '手填生产厂家',
      dataIndex: 'ManualManufacturer',
      align: 'center',
      editable: true,
    },
    {
      title: '手填设备型号',
      dataIndex: 'ManualEquipment',
      align: 'center',
      editable: true,
    },
    {
      title: '手填CEMS测试原理',
      dataIndex: 'ManualPrinciple',
      align: 'center',
      editable: true,
    },
    {
      title: '出厂编号',
      dataIndex: 'FactoryNumber',
      align: 'center',
      editable: true,
    },
    {
      title: '测试量程',
      dataIndex: 'Range',
      align: 'center',
      width: 244,
      editable: true,
      render: (text, row) => {
        if(row.MinRange ||  row.MaxRange){
          return  `${row.MinRange}~${row.MaxRange}`
        }
      },
    },
    {
      title: '量程校准气体/标准装置值',
      dataIndex: 'RangeCalibration',
      align: 'center',
      width: 180,
      inputType:'number',
      editable: true,
    },
    {
      title: '计量单位',
      dataIndex: 'Unit',
      align: 'center',
      editable: true,
    },
    {
      title: '评价依据',
      dataIndex: 'EvaluationBasis',
      align: 'center',
      width: 180,
      editable: true,
      render: (text, row) => {
        const data = evaluationBasisList.filter((item) => item.value === text)
        return data[0] ? data[0].name : ''
      },
    },
    {
      title: '操作',
      dataIndex: 'operation',
      align: 'center',
      render: (_, record) => {
        const editable = isDeviceEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => deviceSave(record)}
              style={{
                marginRight: 8,
              }}
            >
              {record.type == 'add' ? "添加" : "保存"}
            </Typography.Link>
            <span onClick={() => { deviceCancel(record) }} style={{ marginRight: 8 }}>
              <a>{record.type == 'add' ? "删除" : "取消"}</a>
            </span>
            <span onClick={() => { deviceCancel(record, 'del') }}> {/*编辑的删除 */}
              <a>{!record.type && "删除"}</a>
            </span>
          </span>
        ) : (
            <Typography.Link disabled={deviceEditingKey !== ''} onClick={() => deviceEdit(record)}>
              编辑
            </Typography.Link>
          );
      },
    },
  ];

  const [systemData, setSystemData] = useState([]);
  const [systemEditingKey, setSystemEditingKey] = useState('');
  const isSystemEditing = (record) => record.ID === systemEditingKey;

  const systemCol = [{
    title: 'CEMS系统名称',
    dataIndex: 'SystemName',
    align: 'center',
    width: 100,
    editable: true,
  },
  {
    title: 'CEMS生产厂家',
    dataIndex: 'ManufactorName',
    align: 'center',
    editable: true,
  },
  {
    title: 'CEMS型号',
    dataIndex: 'SystemModel',
    align: 'center',
    editable: true,
  },
  {
    title: 'CEMS编号',
    dataIndex: 'CEMSNum',
    align: 'center',
    editable: true,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    align: 'center',
    render: (_, record) => {
      const editable = isSystemEditing(record);
      return editable ? (
        <span>
          <Typography.Link
            onClick={() => systemSave(record)}
            style={{
              marginRight: 8,
            }}
          >
            {record.type == 'add' ? "添加" : "保存"}
          </Typography.Link>
          <span onClick={() => { systemCancel(record) }} style={{ marginRight: 8 }}>
            <a>{record.type == 'add' ? "删除" : "取消"}</a>{/*添加的删除 和编辑的取消*/}
          </span>
          <span onClick={() => { systemCancel(record, 'del') }}> {/*编辑的删除 */}
            <a>{!record.type && "删除"}</a>
          </span>
        </span>
      ) : (
          <Typography.Link disabled={systemEditingKey !== ''} onClick={() => systemEdit(record)}>
            编辑
          </Typography.Link>
        );
    },
  },]



  const systemCols = systemCol.map((col) => {

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
        editing: isSystemEditing(record),
      }),
    };
  });

  const deviceColumns = equipmentCol.map((col) => {

    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'Range' ? 'range' : col.inputType==='number'? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isDeviceEditing(record),
      }),
    };
  });
  const [referInstruData, setReferInstruData] = useState([]);
  const [referInstruEditingKey, setReferInstruEditingKey] = useState('');
  const isReferInstruEditing = (record) => record.ID === referInstruEditingKey;
  const referInstruInfoCol = [ //参比仪器信息
    {
      title: '监测参数',
      dataIndex: 'PollutantCode',
      align: 'center',
      width: 100,
      editable: true,
      name:'参比仪器监测参数',
      render:(text,record)=>record.PollutantName,
    },
    {
      title: '生产厂家',
      dataIndex: 'ReferInstruManufacturer',
      align: 'center',
      editable: true,
      render:(text,record)=>record.ManufactorName,
    },

    {
      title: '参比方法仪器名称型号',
      dataIndex: 'ParamModel',
      align: 'center',
      editable: true,
    },
    {
      title: '检测依据',
      dataIndex: 'Basis',
      align: 'center',
      editable: true,
    },
    {
      title: '手填生产厂家',
      dataIndex: 'ManualManufacturer',
      name:'参比仪器信息手填生产厂家',
      align: 'center',
      editable: true,
    },
    {
      title: '手填参比方法仪器名称型号',
      dataIndex: 'ManualInstrument',
      align: 'center',
      width:200,
      editable: true,
    },
    {
      title: '手填检测依据',
      dataIndex: 'ManualBasis',
      align: 'center',
      editable: true,
    },
    {
      title: '设备编号',
      dataIndex: 'Number',
      align: 'center',
      editable: true,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      align: 'center',
      render: (_, record) => {
        const editable = isReferInstruEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => referInstruSave(record)}
              style={{
                marginRight: 8,
              }}
            >
              {record.type == 'add' ? "添加" : "保存"}
            </Typography.Link>
            <span onClick={() => { referInstruCancel(record) }} style={{ marginRight: 8 }}>
              <a>{record.type == 'add' ? "删除" : "取消"}</a>
            </span>
            <span onClick={() => { referInstruCancel(record, 'del') }}> {/*编辑的删除 */}
              <a>{!record.type && "删除"}</a>
            </span>
          </span>
        ) : (
            <Typography.Link disabled={referInstruEditingKey !== ''} onClick={() => referInstruEdit(record)}>
              编辑
            </Typography.Link>
          );
      },
    },
  ];

  const referInstruInfoCols = referInstruInfoCol.map((col) => {

    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.inputType,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isReferInstruEditing(record),
        name:col.name,
      }),
    };
  });


  const generatorCol = [
    {
      title: '生产厂家',
      dataIndex: 'ManufactorName',
      key: 'ManufactorName',
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
      title: '操作',
      dataIndex: 'x',
      key: 'x',
      align: 'center',
      render: (text, record) => {
        return <Button type='primary' size='small' onClick={() => { systemColChoice(record) }}> 选择 </Button>
      }
    },

  ]

  const deviceCol = [
    {
      title: '设备厂家',
      dataIndex: 'ManufactorName',
      key: 'ManufactorName',
      align: 'center',
    },
    {
      title: '设备型号',
      dataIndex: 'EquipmentModel',
      key: 'EquipmentModel',
      align: 'center',
    },
    {
      title: '测试原理',
      dataIndex: 'TestPrinciple',
      key: 'TestPrinciple',
      align: 'center',
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
  const refCol = [ //参比仪器信息 弹框
    {
      title: '生产厂家',
      dataIndex: 'ManufactorName',
      key:'ManufactorName',
      align: 'center',
    },

    {
      title: '参比方法仪器名称型号',
      dataIndex: 'ParamModel',
      key:'ParamModel',
      align: 'center',
    },
    {
      title: '检测依据',
      dataIndex: 'Basis',
      key:'Basis',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'x',
      key: 'x',
      align: 'center',
      render: (text, record) => {
        return <Button type='primary' size='small' onClick={() => { refColChoice(record) }}> 选择 </Button>
      }
    },
  ];
  const [gaschoiceData, setGaschoiceData] = useState()

  const [pmchoiceData, setPmchoiceData] = useState()

  const [systemManufactorID, setSystemManufactorID] = useState()
  const systemColChoice = (record) => {

    form.setFieldsValue({ ManufactorName: record.ManufactorName, SystemModel: record.SystemModel, });
    setSystemManufactorID(record.ID)
    setManufacturerPopVisible(false)
    setChoiceManufacturer(true)
  }
  const [deviceManufactorID, setDeviceManufactorID] = useState(undefined) //CEMS 监测设备 设备厂家ID



  const [devicePollutantName, setDevicePollutantName] = useState()

  const [choiceManufacturer, setChoiceManufacturer] = useState(false); // 选择生产商

  const [isManual, setIsManual] = useState(false) //是否手填

  const deviceColChoice = (record) => { //cems 监测参数选择
    const defaultPollUnit = pollutantTypeList.filter((item) => item.PollutantCode === record.ChildID) //默认单位

    formDevice.setFieldsValue({
      ...record,
      EquipmentManufacturer: record.ManufactorName,
      Unit:defaultPollUnit[0]? defaultPollUnit[0].Col1 : undefined,
    });
    setDevicePollutantName(record.PollutantName)
    setDeviceManufactorID(record.ID)
    setDevicePopVisible(false)
    setIsManual(true)
  }

  const [refPollutantName, setRefPollutantName] = useState()
  const [refManufactorID, setRefManufactorID] = useState()
  const [isRefManual, setIsRefManual] = useState(false) //是否手填

  const refColChoice = (record) => { //参比仪器选择

    formReferInstru.setFieldsValue({
      ...record,
      ReferInstruManufacturer: record.ManufactorName,
    });
    setRefPollutantName(record.PollutantName)
    setRefManufactorID(record.ID)
    setRefPopVisible(false)
    setIsRefManual(true)
  }

  const onManufacturerClearChoice = (value) => { //CEMS-系统信息 厂家清除
    form.setFieldsValue({ ManufactorName: value, });
    setSystemManufactorID(value)
    setChoiceManufacturer(false)
  }
  const onDeviceClearChoice = (value) => {//CEMS-监测设备 厂家清除
    formDevice.setFieldsValue({ EquipmentManufacturer: value, PollutantCode: undefined,  EquipmentModel: '', TestPrinciple: '',});
    setDeviceManufactorID(value)
    setIsManual(false)
  }
  const onRefClearChoice = (value) => { //参比仪器 厂家清除功能
    formReferInstru.setFieldsValue({ ReferInstruManufacturer: value,PollutantCode: undefined,ParamModel:'',Basis:'', });
    setRefManufactorID(value)
    setRefPopVisible(false)
    setIsRefManual(false)
  }

  const [pageIndex2, setPageIndex2] = useState(1)
  const [pageSize2, setPageSize2] = useState(10)
  const onFinish2 = async (pageIndex2, pageSize2,cemsVal, ) => { //生成商弹出框 查询
 
    setPageIndex2(pageIndex2)
    try {
      const values = await form2.validateFields();
      props.testGetSystemModelList({
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
    props.testGetSystemModelList({ ...values, SystemName: cemsVal, PageIndex, PageSize })
  }

  const [pageSize3, setPageSize3] = useState(10)
  const [pageIndex3, setPageIndex3] = useState(1)
  const onFinish3 = async (pageIndexs, pageSizes) => {  //查询 设备信息 除分页 每次查询页码重置为1
    try {
      const values = await form3.validateFields();
      const pollutantCode = formDevice.getFieldValue('PollutantCode');
      props.getTestEquipmentInfoList({
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
    onFinish3(PageIndex, PageSize)
  }
  const onValuesChange3 = (hangedValues, allValues) => {
    if (Object.keys(hangedValues).join() == 'PollutantType') {
    }
  }

  const [pageSize4, setPageSize4] = useState(10)
  const [pageIndex4, setPageIndex4] = useState(1)
  const onFinish4 = async (pageIndexs, pageSizes) => {  //查询 参比仪器信息 除分页 每次查询页码重置为1
    try {
      const values = await form4.validateFields();
      const pollutantCode = formReferInstru.getFieldValue('PollutantCode');
      props.getTestParamInfoList({
        ...values,
        PollutantCode: pollutantCode,
        PageIndex: pageIndexs && typeof pageIndexs === "number" ? pageIndexs : pageIndex3,
        PageSize: pageSizes ? pageSizes : pageSize3
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    [`Recursion${item.deptId}`]
    }
  }

  const handleTableChange4 = (PageIndex, PageSize) => {
    setPageIndex4(PageIndex)
    setPageSize4(PageSize)
    onFinish4(PageIndex, PageSize)
  }
  const onValuesChange4 = (hangedValues, allValues) => {
    if (Object.keys(hangedValues).join() == 'PollutantType') {
    }
  }


  const systemPopContent = <Form //系统信息-cems生产厂家 弹框
    form={form2}
    name="advanced_search3"
    onFinish={() => { setPageIndex2(1); onFinish2(1, pageSize2, cemsVal) }}
    initialValues={{
       ManufactorID: manufacturerList[0] && manufacturerList[0].ID,
    }}

  >
    <Row>
      <Form.Item style={{ marginRight: 8 }} name='ManufactorID' >
        <Select placeholder='请选择生产厂家' showSearch filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} style={{ width: 200 }}>
          {
            manufacturerList[0] && manufacturerList.map(item => {
              return <Option key={item.ID} value={item.ID}>{item.ManufactorName}</Option>
            })
          }
        </Select>
      </Form.Item>
      <Form.Item style={{ marginRight: 8 }} name="SystemModel">
        <Input allowClear placeholder="请输入系统型号" />
      </Form.Item>
      <Form.Item style={{ marginRight: 8 }} name="MonitoringType" hidden>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType='submit'>
          查询
     </Button>
      </Form.Item>
    </Row>
    <SdlTable scroll={{ y: 'calc(100vh - 500px)' }}
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

  const devicePopContent = <Form
    form={form3}
    name="advanced_search3"
    onFinish={() => { setPageIndex3(1); onFinish3(1, pageSize3) }}
    onValuesChange={onValuesChange3}
    initialValues={{
      ManufactorID: manufacturerList[0] && manufacturerList[0].ID,
    }}
  >

    <Row>
      <span>
        <Form.Item style={{ marginRight: 8 }} name='ManufactorID' >
          <Select placeholder='请选择设备厂家' showSearch filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} style={{ width: 150 }}>
            {
              manufacturerList[0] && manufacturerList.map(item => {
                return <Option key={item.ID} value={item.ID}>{item.ManufactorName}</Option>
              })
            }
          </Select>
        </Form.Item>
      </span>
      <Form.Item style={{ marginRight: 8 }} name="EquipmentType">
        <Input allowClear placeholder="请输入设备型号" style={{ width: 150 }} />
      </Form.Item>

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

  const referInstruPopContent = <Form
    form={form4}
    name="advanced_search3"
    onFinish={() => { setPageIndex4(1); onFinish4(1, pageSize4) }}
    onValuesChange={onValuesChange4}
    initialValues={{
      ManufactorID: manufacturerList[0] && manufacturerList[0].ID,
    }}
  >

    <Row>
      <span>
        <Form.Item style={{ marginRight: 8 }} name='ManufactorID' >
          <Select placeholder='请选择设备厂家' showSearch filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} style={{ width: 150 }}>
            {
              manufacturerList[0] && manufacturerList.map(item => {
                return <Option key={item.ID} value={item.ID}>{item.ManufactorName}</Option>
              })
            }
          </Select>
        </Form.Item>
      </span>
      <Form.Item style={{ marginRight: 8 }} name="ParamModel">
        <Input allowClear placeholder="请输入仪器型号" style={{ width: 150 }} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType='submit'>
          查询
    </Button>
      </Form.Item>
    </Row>
    <SdlTable scroll={{ y: 'calc(100vh - 500px)' }}
      loading={props.paramInfoListLoading}
      bordered dataSource={paramInfoList} columns={refCol}
      pagination={{
        total: paramInfoListTotal,
        pageSize: pageSize4,
        current: pageIndex4,
        showSizeChanger: true,
        showQuickJumper: true,
        onChange: handleTableChange3,
      }}

    />
  </Form>


const handleSystemAdd = () => { //添加系统信息
  if (systemEditingKey) {
    message.warning('请先保存数据')
    return
  } else {
    form.resetFields();
    form.setFieldsValue({ SystemName: cemsVal })
    setSystemEditingKey(systemEditingKey + 1)
    const newData = {
      type: 'add',
      ID: systemEditingKey + 1,
    }
    setSystemData([...systemData, newData])
    setChoiceManufacturer(false)
  }
}
  const [devicePopVisible, setDevicePopVisible] = useState(false) //监测设备参数弹出框
  const handleDeviceAdd = () => { //添加设备
    if (deviceEditingKey) {
      message.warning('请先保存数据')
      return
    } else {
      formDevice.resetFields();
      setDeviceEditingKey(deviceEditingKey + 1)
      const newData = {
        ID: deviceEditingKey + 1,
        type: 'add',
      }
      setDeviceData([...deviceData, newData])
      setIsManual(false)
    }
  };




  const handleReferInstruAdd  = () => { //添加参比仪器信息
    if (referInstruEditingKey) {
      message.warning('请先保存数据')
      return
    } else {
      formReferInstru.resetFields();
      setReferInstruEditingKey(referInstruEditingKey + 1)
      const newData = {
        type: 'add',
        ID: referInstruEditingKey + 1,
      }
      setReferInstruData([...referInstruData, newData])
      setIsRefManual(false)
      setChoiceManufacturer(false)
    }
  }
  const onDeviceValuesChange = async (hangedValues, allValues) => { //CEMS监测设备参数

    if (Object.keys(hangedValues).join() == 'PollutantCode') { //设备厂家
      const data = pollutantTypeList.filter((item) => item.ChildID === hangedValues.PollutantCode)
      setDevicePollutantName(data[0] ? data[0].Name : '')
      formDevice.setFieldsValue({Unit:data[0]? data[0].Col1 : undefined})
    }  

  }
  const onRefValuesChange = async (hangedValues, allValues) => { //参比仪器清单

    if (Object.keys(hangedValues).join() == 'PollutantCode') { //设备厂家
      const data = pollutantTypeList.filter((item) => item.ChildID === hangedValues.PollutantCode)
      setRefPollutantName(data[0] ? data[0].Name : '')
    }

  }
  const devicePopVisibleClick = () => {  //CEMS 设备类型弹框
      setDevicePopVisible(!devicePopVisible);
      setTimeout(() => {
        setPageIndex3(1); onFinish3(1, pageSize3)
      })
    
  
  }
  const[ refPopVisible,setRefPopVisible ] = useState(false)
  const refPopVisibleClick = () =>{ //参比仪器 弹框
    setRefPopVisible(!refPopVisible);
    setTimeout(() => {
      setPageIndex4(1); onFinish4(1, pageSize4)
    })
  
  }
  const [manufacturerPopVisible, setManufacturerPopVisible] = useState(false)
  const manufacturerPopVisibleClick = () => { // cems-系统信息 设备生产厂家
    setManufacturerPopVisible(true)
    form.setFieldsValue({ 'SystemName': cemsVal })
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
    name,
    children,
    ...restProps
  }) => {
    let inputNode = '';
    if (dataIndex === 'EquipmentManufacturer' ) {
      inputNode = <Select onClick={() => { devicePopVisibleClick(dataIndex) }} onChange={onDeviceClearChoice} allowClear showSearch={false} dropdownClassName={'popSelectSty'} placeholder="请选择"> </Select>;
    }else if (dataIndex === 'ReferInstruManufacturer') {
      inputNode = <Select onClick={() => { refPopVisibleClick(dataIndex) }} onChange={onRefClearChoice} allowClear showSearch={false} dropdownClassName={'popSelectSty'} placeholder="请选择"> </Select>;
    }   else if (dataIndex === 'SystemName') {
      inputNode = <Select placeholder='请选择' onChange={cemsChange} disabled={choiceManufacturer}>
        <Option value={465}>气态污染物CEMS</Option>
        <Option value={466}>颗粒物污染物CEMS</Option>
      </Select>
    }else if(dataIndex === 'EvaluationBasis'){
      inputNode = <Select placeholder='请选择' onChange={cemsChange}  allowClear>
        {evaluationBasisList.map(item=> <Option key={item.value} value={item.value}>{item.name}</Option>)}
      </Select>
    } else if (inputType === 'number') {
      inputNode = <InputNumber style={{width:'100%'}} placeholder={`请输入`} />
    } else {
      inputNode = <Input title={formDevice.getFieldValue([dataIndex])} disabled={title === '设备型号' || title === '参比方法仪器名称型号' || title === 'CEMS测试原理' || title === '检测依据' ? true : (title === '手填生产厂家'&&!name) || title === '手填CEMS测试原理' || title === '手填设备型号' ? isManual : name === '参比仪器信息手填生产厂家' || title === '手填参比方法仪器名称型号' || title === '手填检测依据' ? isRefManual :  title === 'CEMS系统名称'  || title === 'CEMS型号' ? choiceManufacturer : false} placeholder={ `请输入`} />
    }
    const parLoading = record && record.type && record.type === 'add' ? props.loadingGetPollutantById : props.monitoringCategoryTypeLoading; //监测参数提示loading
    return (
      <td {...restProps}>
        {editing ? (
          inputType === 'range' ?
            <Form.Item style={{ margin: 0 }} className={'rangeSty'}>
              <Form.Item 
                style={{ display: 'inline-block', margin: 0,width:108 }}
                name={`Min${dataIndex}`}
                rules={ [ { required: true , message: `请输入`,   }, ]}
              >
                <InputNumber placeholder={`最小值`} />
              </Form.Item>
              <span style={{ display: 'inline-block', width: 8, lineHeight: '32px', textAlign: 'center' }}>
                ~
             </span>
              <Form.Item
                name={`Max${dataIndex}`}
                style={{ display: 'inline-block', margin: 0,width:108 }}
                rules={ [ { required: true , message: `请输入`,   }, ]}
              >
                <InputNumber placeholder={`最大值`} />
              </Form.Item>
            </Form.Item> : dataIndex === 'PollutantCode'&&!name? // 监测参数 监测设备

              <>{parLoading ? <Spin size='small' style={{ textAlign: 'left' }} />
                :
                <Form.Item name={`${dataIndex}`} style={{ margin: 0 }}>
                  <Select placeholder='请选择' disabled={  isManual } allowClear={false} showSearch filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} >
                    {
                      pollutantTypeList[0] && pollutantTypeList.map(item => {
                        return <Option key={item.ChildID} value={item.ChildID}>{item.Name}</Option>
                      })
                    }
                  </Select></Form.Item>}</>
                  : dataIndex === 'PollutantCode'&&name==='参比仪器监测参数' ? //监测参数 参比仪器信息

                  <>{parLoading ? <Spin size='small' style={{ textAlign: 'left' }} />
                    :
                    <Form.Item name={`${dataIndex}`} style={{ margin: 0 }}>
                      <Select placeholder='请选择' disabled={isRefManual} allowClear={false} showSearch filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} >
                        {
                          pollutantTypeList2[0] && pollutantTypeList2.map(item => {
                            return <Option key={item.ChildID} value={item.ChildID}>{item.Name}</Option>
                          })
                        }
                      </Select></Form.Item>}</>
              : dataIndex === 'ManufactorName' ?  //CEMS-系统信息 生产厂家
                <Form.Item name={`${dataIndex}`} style={{ margin: 0 }}>
                  <Select onClick={() => { manufacturerPopVisibleClick() }} onChange={onManufacturerClearChoice} allowClear showSearch={false} dropdownClassName={'popSelectSty'} placeholder="请选择"> </Select>
                </Form.Item>

                :

                <Form.Item
                  name={`${dataIndex}`}
                  style={{ margin: 0 }}
                  rules={ [ { required: dataIndex === 'CEMSNum' || dataIndex === 'FactoryNumber' || dataIndex === 'Unit' ||  (dataIndex==='RangeCalibration' && formDevice.getFieldValue('PollutantCode')!='508' && formDevice.getFieldValue('PollutantCode')!='509' && formDevice.getFieldValue('PollutantCode')!='510') || dataIndex === 'Number'  , message: `请输入`,   }, ]}
                >
                  {inputNode}
                </Form.Item>
        ) : (
            children
          )}
      </td>
    );
  };


  const submits =  () => { 
    if (tabKey == 1) { //CEMS 参数信息
      if (deviceEditingKey || systemEditingKey) {
        message.warning('请先保存未保存的数据')
        return;
      }
      const systemList = systemData.map(item => { // 系统信息
        return {
          SystemNameID: item.SystemNameID,
          ManufactorID: item.ManufactorID,
          CEMSNum: item.CEMSNum,
        }


      })
      const deviceList = deviceData.map(item => {
        return {
          PollutantCode: item.PollutantCode,
          ManufactorName:item.ManufactorName,
          ManufactorID: item.ManufactorID,
          ManualManufacturer: item.ManualManufacturer,
          ManualEquipment: item.ManualEquipment,
          ManualPrinciple: item.ManualPrinciple,
          FactoryNumber:item.FactoryNumber,
          MinRange: item.MinRange,
          MaxRange: item.MaxRange,
          RangeCalibration: item.RangeCalibration,
          Unit: item.Unit,
          EvaluationBasis: item.EvaluationBasis,
        }
      })
      const par = {
        DGIMN: DGIMN,
        systemList: systemList,
        equipmentList:deviceList ,
      }

      props.operationCEMSSystem({...par}, () => {
        props.onCancel()
      })
    } else { //参比仪器
      const referInstruList = referInstruData.map(item => {
        return {
          PollutantCode: item.PollutantCode,
          ManufactorID: item.ManufactorID,
          ManualManufactor: item.ManualManufacturer,
          ManualInstrument: item.ManualInstrument,
          ManualBasis: item.ManualBasis,
          Number: item.Number,
        }
      })
      props.operationParam({ DGIMN: DGIMN, paramList:referInstruList}, () => {
        props.onCancel()
      })


    }
  }

  const [tabKey, setTabKey] = useState("1")
  return (
    <div className={styles.deviceManagerSty}>
       <Tabs type="card" onChange={(key) => { setTabKey(key) }}>
        <TabPane tab="CEMS参数信息" key="1">
          <Form form={form} name="advanced_search" >
            <><div>
              <div style={{ fontWeight: 'bold', paddingBottom: 5 }}> 系统信息</div>
              <SdlTable
                components={{
                  body: {
                    cell: EditableCell,
                  }
                }}
                bordered
                dataSource={systemData}
                columns={systemCols}
                rowClassName="editable-row"
                scroll={{ y: 'auto' }}
                loading={props.cEMSSystemListLoading}
                className={`${styles.systemListSty}`}
                pagination={false}
                size='small'
              />
            </div>
              <Button style={{ margin: '10px 0 15px 0' }} type="dashed" block icon={<PlusOutlined />} onClick={() => handleSystemAdd()} >
                添加系统信息
       </Button></>
          </Form>
          <div style={{ fontWeight: 'bold', paddingBottom: 10 }}>监测设备</div>
          <Form form={formDevice} name="advanced_search_device" onValuesChange={onDeviceValuesChange}>
            <SdlTable
              components={{
                body: {
                  cell: EditableCell
                }
              }}
              bordered
              dataSource={deviceData}
              columns={deviceColumns}
              rowClassName="editable-row"
              loading={props.cEMSSystemListLoading}
              className={`${styles.deviceSty}`}
              pagination={false}
              size='small'
            />
          </Form>
          <Button style={{ margin: '10px 0' }} type="dashed" block icon={<PlusOutlined />} onClick={() => handleDeviceAdd()} >
            添加监测设备
       </Button>
        </TabPane>

        <TabPane tab="参比仪器信息" key="2">
        <Form form={formReferInstru} name="advanced_search_referInstru" onValuesChange={onRefValuesChange} >

          <SdlTable
            components={{
              body: {
                cell: EditableCell,
              }
            }}
            bordered
            dataSource={referInstruData}
            columns={referInstruInfoCols}
            rowClassName="editable-row"
            loading={props.paramListLoading}
            className={`${styles.formReferInstruSty}`}
            pagination={false}
            size='small'
          />
          <Button style={{ margin: '10px 0' }} type="dashed" block icon={<PlusOutlined />} onClick={() => handleReferInstruAdd()} >
            添加参比仪器信息
       </Button>
        </Form>
        </TabPane>

      </Tabs>
      <Row justify='end' style={{position:'fixed',background:'#fff',width:'100%',padding:'8px 24px',left:0,bottom:0, boxShadow: '0 0 5px 0 #ccc'}}> <Button type="primary" loading={tabKey==1? props.operationCEMSSystemLoading : props.operationParamLoading} onClick={submits} > 保存</Button></Row>




      {/**cems 系统信息  cems生产厂家弹框 */}
      <Modal visible={manufacturerPopVisible} getContainer={false} onCancel={() => { setManufacturerPopVisible(false) }} destroyOnClose footer={null} closable={false} maskStyle={{ display: 'none' }}  wrapClassName='noSpreadOverModal'>
        {systemPopContent}
      </Modal>
      {/**cems 系统信息   监测设备生产厂家弹框 */}
      <Modal visible={devicePopVisible}  getContainer={false} onCancel={() => { setDevicePopVisible(false) }}  destroyOnClose footer={null} closable={false} maskStyle={{ display: 'none' }} wrapClassName='noSpreadOverModal'>
        {devicePopContent}
      </Modal>
      {/** 参比仪器信息 生产厂家弹框 */}
      <Modal visible={refPopVisible}  getContainer={false} onCancel={() => { setRefPopVisible(false) }}  destroyOnClose footer={null} closable={false} maskStyle={{ display: 'none' }} wrapClassName='noSpreadOverModal'>
        {referInstruPopContent}
      </Modal>
    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);