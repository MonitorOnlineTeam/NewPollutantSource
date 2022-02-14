/**
 * 功  能：监测设备
 * 创建人：贾安波
 * 创建时间：2021.02.11
 */
import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Card, Button, Select, Progress, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Popover } from 'antd';
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
const { TextArea } = Input;
const { Option } = Select;


const namespace = 'point'




const dvaPropsData = ({ loading, point }) => ({
  tableDatas: point.tableDatas,
  monitoringTypeList: point.monitoringTypeList,
  manufacturerList:point.manufacturerList,
  systemModelList:point.systemModelList,
  loadingSystemModel: loading.effects[`${namespace}/getSystemModelList`],
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
    getPointEquipmentInfo: (payload) => { //获取站点设备信息
      dispatch({
        type: `${namespace}/getPointEquipmentInfo`, 
        payload: payload,
      })
    },
    addOrUpdateEquipmentInfo: (payload) => { //添加或者修改设备参数信息
      dispatch({
        type: `${namespace}/addOrUpdateEquipmentInfo`, 
        payload: payload,
      })
    }, 
    getPointEquipmentParameters: (payload) => { // 列表显示
      dispatch({
        type: `${namespace}/getPointEquipmentParameters`,
        payload: payload,
      })
    }, 
    getManufacturerList:(payload)=>{ //厂商列表
      dispatch({
        type: `${namespace}/getManufacturerList`, 
        payload:payload,
      }) 
    },
    getSystemModelList:(payload)=>{ //列表 系统型号
      dispatch({
        type: `${namespace}/getSystemModelList`,
        payload:payload,
      })
    },
  }
}
const originData = [];
for (let i = 0; i < 10; i++) {
  originData.push({
    key: i.toString(),
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  });
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
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
          children
        )}
    </td>
  );
};
const Index = (props) => {

  const [dates, setDates] = useState([]);
  const { tableDatas, DGIMN, pollutantType,manufacturerList,systemModelList} = props;


  useEffect(() => {
    initData()

  }, []);

  const initData = () => {
    props.getMonitoringTypeList({})
    props.getManufacturerList({})
    onFinish2()
  }

  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [data, setData] = useState(originData);
  const [editingKey, setEditingKey] = useState('');
  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      name: '',
      age: '',
      address: '',
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };


  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
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

  const columns = [
    {
      title: 'name',
      dataIndex: 'name',
      width: '25%',
      editable: true,
    },
    {
      title: 'age',
      dataIndex: 'age',
      width: '15%',
      editable: true,
    },
    {
      title: 'address',
      dataIndex: 'address',
      width: '40%',
      editable: true,
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
            <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
              Edit
            </Typography.Link>
          );
      },
    },
  ];


  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
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
      key:'ManufacturerName',
      align:'center',
    },
    {
      title: '系统名称',
      dataIndex: 'SystemName',
      key:'SystemName',
      align:'center',
    },
    {
      title: '系统型号',
      dataIndex: 'SystemModel',
      key:'SystemModel',
      align:'center',
    },
    {
      title: '监测类别',
      dataIndex: 'MonitoringType',
      key:'MonitoringType',
      align:'center',
    },
    {
      title: '操作',
      dataIndex: 'x',
      key:'x',
      render: (text, record) => {
        return <Button> 选择 </Button>
      }
    },

  ]
  const [choiceData, setChoiceData] = useState()
  const onClearChoice = (value) => {
    // form2.setFieldsValue({ PorjectID: value });
    // setChoiceData(value)
  }


  

  const  onFinish2 = async() =>{ //生成商弹出框 查询
    try {
         const values = await form2.validateFields();
         props.getSystemModelList({
          pageIndex: 1,
          pageSize: 10000,
          ...values,
        })
        console.log(popVisible)
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }

  const [popVisible, setPopVisible] = useState(false)
  const { monitoringTypeList } = props;
  const selectPopover = () => {
    return <Popover
        title=""
        trigger="click"
        visible={popVisible}
        onVisibleChange={(visible) => { setPopVisible(visible) }}
        placement="bottom"
        // getPopupContainer={trigger => trigger.parentNode}
        content={
        
        <Form
        form={form2}
        name="advanced_search2"
        onFinish={()=>{onFinish2()}}
        // onValuesChange={onValuesChange}
      >  
        <Row>
        <Form.Item style={{ marginRight: 8 }} name='ManufacturerID' >
          <Select placeholder='请选择设备厂家' allowClear style={{width:200}}>
                {
               manufacturerList[0]&&manufacturerList.map(item => {
                    return <Option key={item.ID} value={item.ID}>{item.ManufacturerName}</Option>
                  })
                } 
              </Select>
          </Form.Item>
          <Form.Item style={{ marginRight: 8 }}  name="SystemModel">
            <Input allowClear placeholder="请输入系统型号"  />
          </Form.Item>
          <Form.Item style={{ marginRight: 8 }} name="MonitoringType">
            <Select allowClear placeholder="请选择监测类别"  style={{ width: 150 }}>
                {
                  monitoringTypeList[0]&&monitoringTypeList.map(item => {
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
        <SdlTable   scroll={{ y: 'calc(100vh - 500px)' }} style={{ width: 800 }} loading={props.loadingSystemModel} bordered dataSource={systemModelList} columns={generatorCol} />
      </Form>}
    >
      <Select onChange={onClearChoice} allowClear showSearch={false} value={choiceData} dropdownClassName={styles.popSelectSty} placeholder="请选择">
      </Select>
    </Popover>
  }

  const systemInfo = () => {
    return <div style={{ paddingBottom: 10 }}>
      <Row gutter={[16, 8]}>
        <Col span={6}>
          <Form.Item label="气态污染物CEMS设备生成商" name="layout">
           {selectPopover()}
          </Form.Item>
        </Col>
        <Col span={6} >
          <Form.Item label="气态污染物CEMS设备规格型号">
            <Input placeholder="请输入" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Form.Item label="颗粒物CEMS设备生成商" name="layout">
            <Select placeholder="请选择">
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="颗粒物CEMS设备规格型号" className='specificationSty'>
            <Input placeholder="请输入" />
          </Form.Item>
        </Col>
      </Row>
    </div>
  }



  return (
    <div>

      <Form form={form} name="advanced_search">
        <div style={{ fontWeight: 'bold', paddingBottom: 5 }}> 系统信息</div>
         {systemInfo()}

        <div style={{ fontWeight: 'bold', paddingBottom: 10 }}>监测设备参数</div>
        <SdlTable
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={data}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
          scroll={{ y: 'calc(100vh - 380px)' }}
        />
      </Form>
    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);