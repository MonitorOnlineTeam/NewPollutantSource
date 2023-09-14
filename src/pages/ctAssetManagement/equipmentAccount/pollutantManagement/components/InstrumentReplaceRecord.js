/**
 * 功  能：仪表更换记录
 * 创建人：jab
 * 创建时间：2023.09.08
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
import ProjectInfo from './ProJectInfo'
const { TabPane } = Tabs;
const { Option } = Select;
const namespace = 'ctPollutantManger'



const dvaPropsData = ({ loading, ctPollutantManger, commissionTest, }) => ({
  manufacturerList: commissionTest.manufacturerList,
  pollutantTypeList: commissionTest.pollutantTypeList,
  loadingGetPollutantById: loading.effects[`ctPollutantManger/getPollutantById`] || false,
  cEMSSystemListLoading: loading.effects[`${namespace}/getCEMSSystemList`],
  equipmentInfoList: ctPollutantManger.equipmentInfoList,
  equipmentInfoListTotal: ctPollutantManger.equipmentInfoListTotal,
  loadingGetEquipmentInfoList: loading.effects[`${namespace}/getTestEquipmentInfoList`],
  deviceChangeData: ctPollutantManger.deviceChangeData,
  deviceChangeEditingKey: ctPollutantManger.deviceChangeEditingKey,
})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
    getPollutantById: (payload) => { //监测类型
      dispatch({
        type: `commissionTest/getPollutantById`,
        payload: payload,

      })
    },
    getTestEquipmentInfoList: (payload, callback) => { //监测设备 弹框
      dispatch({
        type: `${namespace}/getTestEquipmentInfoList`,
        payload: payload,
        callback: callback,
      })
    },

  }
}




const Index = (props) => {

  const { current, dgimn, manufacturerList, equipmentInfoList, equipmentInfoListTotal, pollutantTypeList, deviceChangeData, deviceChangeEditingKey, } = props;



  const [form3] = Form.useForm();

  const [formDevice] = Form.useForm();
  useEffect(() => {
    initData()
  }, [dgimn]);

  const initData = () => {

    // props.getPollutantById({})  // 默认加载监测参数
  }

  const isDeviceEditing = (record) => record.ID === deviceChangeEditingKey;

  const deviceEdit = (record) => {
    formDevice.setFieldsValue({
      ...record,
      PollutantCode: record.APollutantCode,
      AEquipmentManufacturer: record.AManufactorName,
      BEquipmentManufacturer: record.BManufactorName,
      ProjectCode:record.ProjectCode ? record.ProjectCode : record.ItemCode
    });
    setDevicePollutantName(record.APollutantName) //监测设备

    if (record.type != "add") {
      setAdeviceManufactorID(record.AManufactorID)//设备厂家 后
      setBdeviceManufactorID(record.BManufactorID)//设备厂家 前
      setProjectID(record.ProjectID)
    }
    props.updateState({ deviceChangeEditingKey: record.ID })
  };


  const deviceCancel = (record, type) => {
    if (record.type === 'add' || type) { //新添加一行 删除 || 原有数据编辑的删除  不用走接口
      const dataSource = [...deviceChangeData];
      let newData = dataSource.filter((item) => item.ID !== record.ID)
      props.updateState({ deviceChangeData: newData })
      props.updateState({ deviceChangeEditingKey: '' })
    } else { //编辑状态
      props.updateState({ deviceChangeEditingKey: '' })
    }
  };




  const deviceSave = async (record) => { //监测设备 保存添加

    try {
      const row = await formDevice.validateFields();
      const newData = [...deviceChangeData];
      const key = record.ID;
      const index = newData.findIndex((item) => key === item.ID);
      if (index > -1) {
        const editRow = {
          APollutantName: devicePollutantName,
          AManufactorName: row.AEquipmentManufacturer,
          AManufactorID: adeviceManufactorID, //设备厂家 后
          BManufactorName: row.BEquipmentManufacturer,
          BManufactorID: bdeviceManufactorID, //设备厂家 前
          ProjectID:projectID,
        };
        const item = record.type === 'add' ? { ...newData[index], ID: cuid() } : { ...newData[index] }
        newData.splice(index, 1, { ...item, ...row, ...editRow });

        props.updateState({ deviceChangeData: newData })
        props.updateState({ deviceChangeEditingKey: '' })
      } else {
        newData.push(row);
        props.updateState({ deviceChangeData: newData })
        props.updateState({ deviceChangeEditingKey: '' })
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };



  const equipmentCol = [
    {
      title: '监测参数',
      dataIndex: 'PollutantCode',
      align: 'center',
      width: 120,
      editable: true,
      render: (text, row) => row.APollutantName,
    },
    {
      title: '项目号',
      dataIndex: 'ProjectCode',
      align: 'center',
      editable: true,
      render:(text,record)=>{
        return text ? text : record.ItemCode
    }
    },
    {
      title: '变更前设备仪器信息',
      align: 'center',
      children: [
        {
          title: '生产厂家',
          dataIndex: 'BEquipmentManufacturer',
          align: 'center',
          editable: true,
          render: (text, row) => row.BManufactorName,
        },
        {
          title: '设备型号',
          dataIndex: 'BEquipmentModel',
          align: 'center',
          editable: true,
        },
        {
          title: '出厂编号',
          dataIndex: 'BFactoryNumber',
          align: 'center',
          editable: true,
        },
      ]
    },
    {
      title: '变更后设备仪器信息',
      align: 'center',
      children: [
        {
          title: '生产厂家',
          dataIndex: 'AEquipmentManufacturer',
          align: 'center',
          editable: true,
          render: (text, row) => row.AManufactorName,
        },
        {
          title: '设备型号',
          dataIndex: 'AEquipmentModel',
          align: 'center',
          editable: true,
        },
        {
          title: '出厂编号',
          dataIndex: 'AFactoryNumber',
          align: 'center',
          editable: true,
        },
      ]
    },
    {
      title: '创建人',
      dataIndex: 'CreateUserName',
      key: 'CreateUserName',
      align: 'center',
      width: 110,
    },
    {
      title: '创建时间',
      dataIndex: 'CreateTime',
      key: 'CreateTime',
      align: 'center',
    },
    {
      title: '更新人',
      dataIndex: 'UpdateUserName',
      key: 'UpdateUserName',
      align: 'center',
      width: 110,
    },
    {
      title: '更新时间',
      dataIndex: 'UpdateTime',
      key: 'UpdateTime',
      align: 'center',
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
            <Typography.Link disabled={deviceChangeEditingKey !== ''} onClick={() => deviceEdit(record)}>
              编辑
            </Typography.Link>
          );
      },
    },
  ];



  const deviceColumns = equipmentCol.map((col) => {
    if (col.title === '变更前设备仪器信息' || col.title === '变更后设备仪器信息') {
      return {
        ...col,
        children: col.children.map(childCol => {
          if (!childCol.editable) {
            return childCol;
          } else {
            return {
              ...childCol,
              onCell: (record) => ({
                record,
                inputType: col.inputType === 'number' ? 'number' : 'text',
                dataIndex: childCol.dataIndex,
                title: childCol.title,
                disType: childCol.disType,
                editing: isDeviceEditing(record),
              }),
            };
          }
        })

      };
    }
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.inputType === 'number' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isDeviceEditing(record),
      }),
    };
  });



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
      align: 'center',
      render: (text, record) => {
        return <Button type='primary' size='small' onClick={() => { deviceColChoice(record) }}> 选择 </Button>
      }
    },
  ];


  const [adeviceManufactorID, setAdeviceManufactorID] = useState(undefined) //生产厂家ID 后
  const [bdeviceManufactorID, setBdeviceManufactorID] = useState(undefined) //生产厂家ID 前

  const [devicePollutantName, setDevicePollutantName] = useState()


  const deviceColChoice = (record) => { // 监测参数选择
    formDevice.setFieldsValue({
      PollutantCode: record.PollutantCode,
    });
    if (infoType == 1) {
      formDevice.setFieldsValue({
        AEquipmentModel: record.EquipmentModel,
        AEquipmentManufacturer: record.ManufactorName,
      });
      setAdeviceManufactorID(record.ID)
    } else {
      formDevice.setFieldsValue({
        BEquipmentModel: record.EquipmentModel,
        BEquipmentManufacturer: record.ManufactorName,
      });
      setBdeviceManufactorID(record.ID)
    }
    setDevicePollutantName(record.PollutantName)
    setDevicePopVisible(false)
  }


  const onDeviceClearChoice = (value, type) => {//监测设备 厂家清除

    formDevice.setFieldsValue({ PollutantCode: undefined, });

    if (type == 1) {
      formDevice.setFieldsValue({ AEquipmentManufacturer: value, AEquipmentModel: '', });
    } else {
      formDevice.setFieldsValue({ BEquipmentManufacturer: value, BEquipmentModel: '', });

    }

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




  const [devicePopVisible, setDevicePopVisible] = useState(false) //监测设备参数弹出框
  const handleDeviceAdd = () => { //添加设备
    if (deviceChangeEditingKey) {
      message.warning('请先保存数据')
      return
    } else {
      formDevice.resetFields();
      props.updateState({ deviceChangeEditingKey: deviceChangeEditingKey + 1 })
      const newData = {
        ID: deviceChangeEditingKey + 1,
        type: 'add',
      }
      props.updateState({ deviceChangeData: [...deviceChangeData, newData] })
    }
  };

  const onDeviceValuesChange = async (hangedValues, allValues) => { //CEMS监测设备参数

    if (Object.keys(hangedValues).join() == 'PollutantCode') { //设备厂家
      const data = pollutantTypeList.filter((item) => item.ChildID === hangedValues.PollutantCode)
      setDevicePollutantName(data[0] ? data[0].Name : '')
    }

  }

  const [infoType, setInfoType] = useState(1)
  const devicePopVisibleClick = (type) => {  // 设备类型弹框

    setDevicePopVisible(!devicePopVisible);
    setInfoType(type)
    setTimeout(() => {
      setPageIndex3(1); onFinish3(1, pageSize3)
    })


  }

  const [projectPopVisible, setProjectPopVisible] = useState(false)
  const [projectID,setProjectID]= useState('')

  const projectColChoice = (record) => {
    formDevice.setFieldsValue({ ProjectCode: record.ProjectCode?  record.ProjectCode : record.ItemCode  })
    setProjectID(record.ID)
    setProjectPopVisible(false)
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
    const infoType = dataIndex === 'AEquipmentManufacturer' ? 1 : 2;
    if (dataIndex === 'AEquipmentManufacturer' || dataIndex === 'BEquipmentManufacturer') {
      inputNode = <Select onClick={() => { devicePopVisibleClick(infoType) }} onChange={(value) => onDeviceClearChoice(value, infoType)} allowClear showSearch={false} dropdownClassName={'popSelectSty'} placeholder="请选择"> </Select>;
    } else if (inputType === 'number') {
      inputNode = <InputNumber style={{ width: '100%' }} placeholder={`请输入`} />
    } else {
      inputNode = <Input title={formDevice.getFieldValue([dataIndex])} disabled={title === '设备型号' || title === 'CEMS测试原理' ? true : false} placeholder={`请输入`} />
    }
    const parLoading = record && record.type && record.type === 'add' ? props.loadingGetPollutantById : null; //监测参数提示loading
    return (
      <td {...restProps}>
        {editing ? (
          dataIndex === 'PollutantCode' ? // 监测参数 监测设备
            <>{parLoading ? <Spin size='small' style={{ textAlign: 'left' }} />
              :
              <Form.Item name={`${dataIndex}`} style={{ margin: 0 }}>
                <Select placeholder='请选择' allowClear={false} showSearch filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} >
                  {
                    pollutantTypeList[0] && pollutantTypeList.map(item => {
                      return <Option key={item.ChildID} value={item.ChildID}>{item.Name}</Option>
                    })
                  }
                </Select></Form.Item>}</>
            :
            dataIndex === 'ProjectCode' ?  //项目号
              <Form.Item name={`${dataIndex}`} style={{ margin: 0 }}>
                <Select onClick={() => { setProjectPopVisible(true) }} onChange={(value) => { formDevice.setFieldsValue({ ProjectCode: value, });setProjectID('') }} allowClear showSearch={false} dropdownClassName={'popSelectSty'} placeholder="请选择"> </Select>
              </Form.Item>
              :
              <Form.Item
                name={`${dataIndex}`}
                style={{ margin: 0 }}
                rules={[{ required: (formDevice.getFieldValue('PollutantCode') != '508' && formDevice.getFieldValue('PollutantCode') != '509' && formDevice.getFieldValue('PollutantCode') != '510') || dataIndex === 'number', message: `请输入`, },]}
              >
                {inputNode}
              </Form.Item>
        ) : (
            children
          )}
      </td>
    );
  };



  return (
    <div className={styles.deviceManagerSty} style={{ display: current == 4 ? 'block' : 'none' }}>

      <Form form={formDevice} name="advanced_search_device_change" onValuesChange={onDeviceValuesChange}>
        <SdlTable
          components={{
            body: {
              cell: EditableCell
            }
          }}
          bordered
          dataSource={deviceChangeData}
          columns={deviceColumns}
          rowClassName="editable-row"
          loading={props.cEMSSystemListLoading}
          className={`${styles.deviceSty}`}
          pagination={false}
          size='small'
        />
      </Form>
      <Button style={{ margin: '10px 0' }} type="dashed" block icon={<PlusOutlined />} onClick={() => handleDeviceAdd()} >
        添加仪表信息
       </Button>
      {/**  监测设备 生产厂家弹框 */}
      <Modal visible={devicePopVisible} getContainer={false} onCancel={() => { setDevicePopVisible(false) }} destroyOnClose footer={null} closable={false} maskStyle={{ display: 'none' }} wrapClassName='noSpreadOverModal'>
        {devicePopContent}
      </Modal>
      {/** 项目信息 弹框 */}
      <ProjectInfo projectPopVisible={projectPopVisible} projectColChoice={projectColChoice} onProjectCancel={() => { setProjectPopVisible(false) }} />
    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);