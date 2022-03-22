/**
 * 功  能：烟气参数备案
 * 创建人：贾安波
 * 创建时间：2021.3.2
 */
import React, { useState,useEffect  } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography,Card,Button,Select, message,Spin } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined } from '@ant-design/icons';
import SmokeSetUpForm from './components/SmokeSetUpForm'
import { connect } from "dva";

const { Option } = Select;

const originData = [];
const namespace = 'equipmentParmars'



const EditableCell = (parametersLists,parametersInfoChange,{
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  

  let inputNode='';
 
  if(inputType==="select"){
    // loadingGetParametersInfos? <Spin size="small"/>:

    inputNode =  <Select onChange={ parametersInfoChange.bind(this,record)} placeholder={`请选择${title}`}>
      {parametersLists.map(item=>{
        return  <Option value={item.ChildID}>{item.Name}</Option>
      })} 
    </Select>
  }else if(inputType === 'number'){
    inputNode =  <InputNumber placeholder={`请输入${title}`}/>
  }else{
    inputNode = <Input placeholder={`请输入${title}`}/>
  }
  return (
    <td {...restProps}>
      {editing ? (
      inputType === 'range'? 
      <Form.Item  style={{margin:0}}>
      <Form.Item style={{display:'inline-block',margin: 0 }}
      //  rules={[ {   required: dataIndex==="Range1"&&true,   message: ``  } ]}
       name={`${dataIndex}Min${record.ID}`}
      >
         <InputNumber placeholder={`最小值`}/>
        </Form.Item>
      <span  style={{ display: 'inline-block', width: '24px', lineHeight: '32px', textAlign: 'center' }}>
        -
      </span>
      <Form.Item 
      //  rules={[ {   required: dataIndex==="Range1"&&true,   message: `` } ]}
      style={{display:'inline-block',margin: 0 }} name={`${dataIndex}Max${record.ID}`}
      >
         <InputNumber placeholder={`最大值`}/>
        </Form.Item>
      </Form.Item> : <Form.Item
           name={`${dataIndex}${record.ID}`}
           style={{ margin: 0  }}
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


const dvaPropsData =  ({ loading,equipmentParmars }) => ({
  tableDatas:equipmentParmars.tableDatas,
  parametersList:equipmentParmars.parametersList,
  loadingGetParametersInfos: loading.effects['equipmentParmars/getParametersInfo'],
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
    getParametersInfo:(payload,callback)=>{ //下拉列表测量参数
      dispatch({
        type: `${namespace}/getParametersInfo`,
        payload:payload,
        callback:callback
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
const EditableTable = (props) => {



  const [form] = Form.useForm();

  const [data, setData] = useState([]);
  const [tableLoading, setTableLoading] = useState(true);

  const [editingKey, setEditingKey] = useState('');
  const [count, setCount] = useState(513);
  const [DGIMN,setDGIMN] =  useState('')
  const [parametersLists,setParametersLists] =  useState([])
  const [selectParVal,setSelectParVal] =  useState('')

  
  const isEditing = (record) => record.key === editingKey;

  const  { type , tableDatas,parametersList } = props; 
  useEffect(() => {
    if(props.DGIMN){
      setDGIMN(props.DGIMN)
      setTableLoading(true)
      props.getEquipmentParametersInfo({DGIMN:props.DGIMN},(res)=>{
        setTableLoading(false)
        setData(res)
      })
    }
    getParametersInfos(props.DGIMN,(res)=>{setParametersLists(res)});

    
  },[props.DGIMN]);
 
  const getParametersInfos=(DGIMN,callback)=>{
    props.getParametersInfo({PolltantType:type==='smoke'?2:1,DGIMN:DGIMN},callback)
  }

  const edit = async (record) => {

    try {
      const row = await form.validateFields();//触发校验
      form.setFieldsValue({
        ["EquipmentParametersCode"+(()=>record.ID)()]: record.EquipmentParametersCode,
        ["Range1Min"+(()=>record.ID)()]: record.Range1Min,
        ["Range1Max"+(()=>record.ID)()]: record.Range1Max,
        ["Range2Min"+(()=>record.ID)()]: record.Range2Min,
        ["Range2Max"+(()=>record.ID)()]: record.Range2Max,
        ["DetectionLimit"+(()=>record.ID)()]: record.DetectionLimit ? record.DetectionLimit : '',
        ["Unit"+(()=>record.ID)()]: record.Unit,
      });
      const newData = [...data];
      const index = newData.findIndex((item) => record.ID === item.ID);

      console.log(index)
      const item = newData[index];
      newData.splice(index, 1, { ...item,...row, type:'modify' });
      setData(newData);
   

    } catch (errInfo) {
    console.log('Validate Failed:', errInfo);
    }
  };

  const cancel = (ID) => {
    const newData = [...data];
    const index = newData.findIndex((item) => ID === item.ID);
    const item = newData[index];
    newData.splice(index, 1, { ...item, type:'' });
    setData(newData);
  };


  const save = async (record) => {

    try {
      const row = await form.validateFields();//触发校验
      const newData = [...data];
      const index = newData.findIndex((item) => record.ID === item.ID);
 
     const EquipmentParametersCode=row[`EquipmentParametersCode${record.ID}`],
           Range1Min = row[`Range1Min${record.ID}`],
           Range1Max = row[`Range1Max${record.ID}`],
           Range2Min = row[`Range2Min${record.ID}`],
           Range2Max=  row[`Range2Max${record.ID}`],
           DetectionLimit = type === 'smoke'? row[`DetectionLimit${record.ID}`]: '',
           Unit = row[`Unit${record.ID}`];

      let pass = EquipmentParametersCode&&EquipmentParametersCode.toString()&&Range1Min.toString()&&Range1Max.toString();
     
      let payload = {
        ID: record.type=='add'? '' : record.ID,
        DGIMN: DGIMN,
        EquipmentParametersCode: EquipmentParametersCode,
        Range1Min: Range1Min,
        Range1Max:Range1Max,
        Range2Min: Range2Min,
        Range2Max: Range2Max,
        DetectionLimit: DetectionLimit ,
        Unit:Unit
    }

      if(pass){
        setTableLoading(true)
        props.addOrUpdateEquipmentParametersInfo(payload,()=>{
       

          const newRow = {
            ID: '',
            EquipmentParametersCode: '',
            DGIMN: DGIMN,
            Range1Min: Range1Min,
            Range1Max:Range1Max,
            Range2Min: Range2Min,
            Range2Max: Range2Max,
            DetectionLimit: DetectionLimit ,
            Unit:Unit
          }
          for(let key in row){ 
            if( row[key] === EquipmentParametersCode &&  key !== `EquipmentParametersCode${record.ID}`){
             form.setFieldsValue({
               [key]: undefined,
             });
            }
         }
       getParametersInfos(DGIMN,(res)=>{setParametersLists(res) }); //重新获取下拉列表

       const EquipmentParametersName  = parametersLists.filter(item=>item.ChildID === row[`EquipmentParametersCode${record.ID}`])[0].Name

       if(record.type=='add'){ //添加

          // const EquipmentParametersName  = parametersLists.filter(item=>item.ChildID === row[`EquipmentParametersCode${record.ID}`])[0].Name
          props.getEquipmentParametersInfo({DGIMN:props.DGIMN},(res)=>{
           let addID =  res.filter(item=>item.EquipmentParametersCode === EquipmentParametersName&&  item.Range1Min === Range1Min && item.Range1Max === Range1Max)[0].ID
           const item = newData[index];
           newData.splice(index, 1, { ...item,...newRow, type:'',ID: addID,EquipmentParametersCode: EquipmentParametersName, });
           setData(newData);
           setTableLoading(false)
         })
        }else{
        // const EquipmentParametersName  = parametersLists.filter(item=>item.ChildID === row[`EquipmentParametersCode${record.ID}`])[0].Name

        setTableLoading(false)
        const item = newData[index];
        newData.splice(index, 1, { ...item,...newRow, type:'',ID: record.ID,EquipmentParametersCode: EquipmentParametersName, });
        setData(newData);
       }


 
    })
  }else{
    message.warning("请选择测量参数或设置量程范围1")
  }
    } catch (errInfo) {
      message.warning("请选择测量参数或设置量程范围1")
      // message.error("请输入完整的信息")
      console.log('错误信息:', errInfo);
    }
  };

  const handleDelete = (ID) => {  //常规删除
    const dataSource = [...data];
    let newData = dataSource.filter((item) => item.ID !== ID)
    setTableLoading(true)
    props.deleteEquipmentParametersInfo({ID:ID},()=>{
       setTableLoading(false)
       setData(newData)
       getParametersInfos(DGIMN,(res)=>{setParametersLists(res) }); //重新获取下拉列表
    })

  };
  const handleAddDelete = (ID) => { //新添加一行 删除  不用走接口
    const dataSource = [...data];
    let newData = dataSource.filter((item) => item.ID !== ID)
    setData(newData)


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
    //  data.filter(item=>item.EquipmentParametersCode === parametersList)
     getParametersInfos(DGIMN,(res)=>{
      //  console.log(res)
      setParametersLists(res) 
      // setData([...data,newData])
     });
   

  };
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
        if(record.Range2Min&&record.Range2Max || record.Range2Min==0&&record.Range2Max ||record.Range2Min&&record.Range2Max==0 ||  record.Range2Min==0&&record.Range2Max==0){
          return `${record.Range2Min} ~ ${record.Range2Max}`;
        }
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
  const parametersInfoChange  = async (record,value)=>{

    // const row = await form.validateFields();//触发校验
    // console.log(row)
    // console.log(row[`EquipmentParametersCode${record.ID}`])


  



  }
  const mergedColumns = columns.map((col) => {
    const { type } = props;
    if (!col.editable) {
      return  col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'Range1' || col.dataIndex === 'Range2' ? 'range' : col.dataIndex === 'EquipmentParametersCode'? 'select':'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing:record.type=='add' || record.type=='modify' ?true : false,
      }),
    };
  });
  return (
    <Card title={'量程设定'}>
       <Form form={form} layout={"horizontal"} component={false}>
      <SdlTable
        loading = {tableLoading}
        components={{
          body: {
            cell:EditableCell.bind(this,parametersLists,parametersInfoChange),
          },
        }}
        bordered
        dataSource={data}
        columns={type==='smoke'? mergedColumns.filter((item)=>item.dataIndex !== 'DetectionLimit') : mergedColumns}
        rowClassName="editable-row"
        pagination={false}
      />
      <Button style={{margin:'10px 0'}} type="dashed" block icon={<PlusOutlined />}  onClick={()=>handleAdd()} > 
       新增成员
       </Button>
    </Form>
     {type==='smoke'&&<SmokeSetUpForm  DGIMN={DGIMN}/>}
   </Card>

  );
};
export default connect(dvaPropsData,dvaDispatch)(EditableTable);