/**
 * 功  能：项目管理
 * 创建人：贾安波
 * 创建时间：2021.08.18
 */
import React, { useState,useEffect  } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography,Card,Button,Select, message } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined } from '@ant-design/icons';
// import SmokeSetUpForm from './components/SmokeSetUpForm'
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"

const { Option } = Select;

const namespace = 'projectManager'




const dvaPropsData =  ({ loading,projectManager }) => ({
  tableDatas:projectManager.tableDatas,
  parametersList:projectManager.parametersList
})

const  dvaDispatch = (dispatch) => {
  return {
    addOrUpdateEquipmentParametersInfo : (payload,callback) =>{ //修改 or 添加
      dispatch({
        type: `${namespace}/addOrUpdateEquipmentParametersInfo`,
        payload:payload,
        callback:callback
      })
      
    },
    getEquipmentParametersInfo:(payload,callback)=>{ //参数列表
      dispatch({
        type: `${namespace}/getEquipmentParametersInfo`,
        payload:payload,
        callback:callback
      })
    },
    getParametersInfo:(payload)=>{ //下拉列表测量参数
      dispatch({
        type: `${namespace}/getParametersInfo`,
        payload:payload
      }) 
    },
    deleteEquipmentParametersInfo:(payload,callback)=>{ //删除
      dispatch({
        type: `${namespace}/deleteEquipmentParametersInfo`, 
        payload:payload,
        callback:callback
      }) 
    }
  }
}
const Index = (props) => {



  const [form] = Form.useForm();

  const [data, setData] = useState([]);
  const [tableLoading, setTableLoading] = useState(true);

  const [editingKey, setEditingKey] = useState('');
  const [count, setCount] = useState(513);
  const [DGIMN,setDGIMN] =  useState('')
 
  const isEditing = (record) => record.key === editingKey;

  const  { type , tableDatas,parametersList } = props; 
  useEffect(() => {

      setTableLoading(true)
      props.getEquipmentParametersInfo({DGIMN:props.DGIMN},(res)=>{
        setTableLoading(false)
        setData(res)
      })
      getParametersInfos();

    
  },[props.DGIMN]);
 
  const getParametersInfos=()=>{
    props.getParametersInfo({PolltantType:type==='smoke'?2:1})
  }
  const columns = [
    {
      title: '测量参数',
      dataIndex: 'EquipmentParametersCode',
      editable: true,
      width: 300,
      align:'center'
    },
    {
      title: '设置量程范围1',
      dataIndex: 'Range1',
      width: 200,
      editable: true,
      align:'center',
      render:(text,record)=>{
        return `${record.Range1Min} ~ ${record.Range1Max}` 
      }
    },
    {
      title: '设置量程范围2',
      dataIndex: 'Range2',
      width: 200,
      editable: true,
      align:'center',
      render:(text,record)=>{
          return record.Range2Min!==null&&record.Range2Max!==null? `${record.Range2Min} ~ ${record.Range2Max}` : '';

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
    {
      title: '操作',
      dataIndex: 'operation',
      align:'center',
      render: (_, record) => {
        const editable = isEditing(record);

        if( record.type=='add'){
          return   <>
          <Typography.Link  onClick={() => save(record)}>
          添加
        </Typography.Link>
        <Typography.Link  onClick={() => handleAddDelete(record.ID)} style={{paddingLeft:8}}  >
          删除
        </Typography.Link>
        </>
        }
        return record.type=='modify'? (
            <span>
            <a
              href="javascript:;"
              onClick={() => save(record)}
              style={{
                marginRight: 8,
              }}
            >
              保存 
            </a>
              <a  onClick={ () => cancel(record.ID)}>取消</a>
          </span> 
        ) : (
          <>
          {/* disabled={editingKey !== ''} */}
          <Typography.Link  onClick={() => edit(record)}>
            编辑
          </Typography.Link>
          <Popconfirm title="确定要删除?" onConfirm={() => handleDelete(record.ID)}>
          <Typography.Link  style={{paddingLeft:8}}  >
            删除
          </Typography.Link>
          </Popconfirm>
          </>
        );
      },
    },
  ];
  const edit = async (record) => {

    try {
    //   const row = await form.validateFields();//触发校验

   

    } catch (errInfo) {
    console.log('Validate Failed:', errInfo);
    }
  };




  const save = async (record) => {

    try {


      
    } catch (errInfo) {
      message.warning("请输入测量参数和设置量程范围1")
      console.log('错误信息:', errInfo);
    }
  };

  const handleDelete = (ID) => {  //常规删除
    // const dataSource = [...data];
    // let newData = dataSource.filter((item) => item.ID !== ID)
    // setTableLoading(true)
    // props.deleteEquipmentParametersInfo({ID:ID},()=>{
    //    setTableLoading(false)
    //    setData(newData)
    // })

  };

  
  const handleAdd = () => {

     setCount(count+1)
     const newData = {
      DetectionLimit: "",
      EquipmentParametersCode: "",
      ID: count,
      Range1: '',
      Range2: '',
      Unit: "",
      editable:true,
      type:'add'
     }
    setData([...data,newData])
   

  };
  const onFinish=()=>{

  }
  const searchComponents = () =>{
     return  <Form
    form={form}
    name="advanced_search"
    className="ant-advanced-search-form"
    onFinish={onFinish}
  >
      <a style={{  fontSize: 12,  }} onClick={() => {setExpand(!expand);  }} >
       {expand ? <UpOutlined /> : <DownOutlined />} Collapse
      </a>
     </Form>
  }
  return (
    <div>
    <BreadcrumbWrapper  >
    <Card title={searchComponents()}>
      <SdlTable
        loading = {tableLoading}
        bordered
        dataSource={data}
        columns={columns}
        pagination={false}
      />
      {/* <Button style={{margin:'10px 0'}} type="dashed" block icon={<PlusOutlined />}  onClick={()=>handleAdd()} > 
       新增成员
       </Button> */}
   </Card>
   </BreadcrumbWrapper>
        </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);