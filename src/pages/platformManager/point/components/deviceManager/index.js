/**
 * 功  能：计划工单统计
 * 创建人：贾安波
 * 创建时间：2021.10.13
 */
import React, { useState,useEffect,useRef,Fragment  } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography,Card,Button,Select,Progress, message,Row,Col,Tooltip,Divider,Modal,DatePicker,Radio   } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined,UpOutlined,DownOutlined,ExportOutlined,QuestionCircleOutlined } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon,PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import styles from "../../index.less"
import Cookie from 'js-cookie';
const { TextArea } = Input;
const { Option } = Select;


const namespace = 'deviceManager'




const dvaPropsData =  ({ loading,deviceManager }) => ({
  tableDatas:deviceManager.tableDatas,
})

const  dvaDispatch = (dispatch) => {
  return {
    updateState:(payload)=>{ 
      dispatch({
        type: `${namespace}/updateState`,
        payload:payload,
      })
    },
  }
}
const originData = [];
for (let i = 0; i < 100; i++) {
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
  const  { tableDatas,} = props; 
  
  
  useEffect(() => {

  
  },[]);
  const [form] = Form.useForm();
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
 


const SystemInfo = () =>{
  return <div>
   <Row gutter={16}>
  <Col span={6}>
<Form.Item label="气态污染物CEMS设备生成商" name="layout">
   <Select  placeholder="请选择">
   </Select>
 </Form.Item>
 </Col>
 <Col span={6} >
 <Form.Item label="气态污染物CEMS设备规格型号">
   <Input placeholder="请输入" />
 </Form.Item>
 </Col>
 </Row>
 <Row gutter={16}>
  <Col span={6}>
<Form.Item label="颗粒物CEMS设备生成商" name="layout">
   <Select  placeholder="请选择">
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
     <div style={{fontWeight:'bold',paddingBottom:2}}> 系统信息</div>
      <SystemInfo />

      <div style={{fontWeight:'bold',paddingBottom:10}}>监测设备参数</div>
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
export default connect(dvaPropsData,dvaDispatch)(Index);