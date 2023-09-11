/**
 * 功  能：设备参数查询
 * 创建人：jab
 * 创建时间：2021.3.10
 */
import React, { useState,useEffect  } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography,Card,Button,Select, message } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined } from '@ant-design/icons';
import SmokeSetUpForm from './components/SmokeSetUpForm'
import { connect } from "dva";

const { Option } = Select;

const originData = [];
const namespace = 'deviceParam'







const dvaPropsData =  ({ loading,deviceParam }) => ({
  tableLoading: loading.effects["deviceParam/getEquipmentParametersInfo"],
  tableDatas:deviceParam.tableDatas,
})

const  dvaDispatch = (dispatch) => {
  return {
    getEquipmentParametersInfo:(payload)=>{ //参数列表
      dispatch({
        type: `${namespace}/getEquipmentParametersInfo`,
        payload:payload,
      })
    },
  }
}
const EditableTable = (props) => {


  const [DGIMN,setDGIMN] =  useState('')
 

  const  { type,tableDatas,tableLoading } = props; 
  useEffect(() => {
    if(props.DGIMN){
      setDGIMN(props.DGIMN)
      props.getEquipmentParametersInfo({DGIMN:props.DGIMN,PolltantType:type==='smoke'?2:1})
    }

    
  },[props.DGIMN]);
 



  





  

  const columns = [
    {
      title: '测量参数',
      dataIndex: 'EquipmentParametersCode',
      editable: true,
      width: 300,
      align:'center'
    },
    {
      title: '量程范围1',
      dataIndex: 'Range1',
      width: 200,
      editable: true,
      align:'center',
      render:(text,record)=>{
        return `${record.Range1Min} ~ ${record.Range1Max}` 
      }
    },
    {
      title: '量程范围2',
      dataIndex: 'Range2',
      width: 200,
      editable: true,
      align:'center',
      render:(text,record)=>{
        return record.Range2Min&&record.Range2Max? `${record.Range2Min} ~ ${record.Range2Max}` : '';
      }
    },
    {
      title: '检出限',
      dataIndex: 'DetectionLimit',
      align:'center',
      editable: true,
    },
    {
      title: '单位',
      dataIndex: 'Unit',
      align:'center',
      editable: true,
    },
  ];

  return (
    <Card title={`设备参数查询${type==='smoke'? '(烟气)' : '(废水)'}`}>
      <SdlTable
        loading = {tableLoading}
        bordered
        dataSource={tableDatas}
        columns={type==='smoke'? columns.filter((item)=>item.dataIndex !== 'DetectionLimit') : columns}
        rowClassName="editable-row"
      />
       {type==='smoke'&&<SmokeSetUpForm  DGIMN={DGIMN}/>}
   </Card>

  );
};
export default connect(dvaPropsData,dvaDispatch)(EditableTable);