/**
 * 功  能：问题管理
 * 创建人：jab
 * 创建时间：2022.09
 */
import React, { useState,useEffect,Fragment  } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form,Tag,Spin, Typography,Card,Button,Select, message,Row,Col,Tooltip,Divider,Modal,DatePicker,Radio   } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined,UpOutlined,DownOutlined,ExportOutlined } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon,PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import NumTips from '@/components/NumTips'
import styles from "./style.less"
import Cookie from 'js-cookie';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';


const { TextArea } = Input;
const { Option } = Select;

const namespace = 'problemManger'




const dvaPropsData =  ({ loading,problemManger }) => ({
  tableDatas:problemManger.tableDatas,
  pointDatas:problemManger.pointDatas,
  tableLoading:problemManger.tableLoading,
  tableTotal:problemManger.tableTotal,
  loadingAddConfirm: loading.effects[`${namespace}/addManufacturer`],
  loadingEditConfirm: loading.effects[`${namespace}/editManufacturer`],
})

const  dvaDispatch = (dispatch) => {
  return {
    updateState:(payload)=>{ 
      dispatch({
        type: `${namespace}/updateState`,
        payload:payload,
      })
    },
    getManufacturerList:(payload)=>{ //列表
      dispatch({
        type: `${namespace}/getManufacturerList`,
        payload:payload,
      })
    },
    addManufacturer : (payload,callback) =>{ // 添加
      dispatch({
        type: `${namespace}/addManufacturer`,
        payload:payload,
        callback:callback
      })
      
    },
    editManufacturer : (payload,callback) =>{ // 修改
      dispatch({
        type: `${namespace}/editManufacturer`,
        payload:payload,
        callback:callback
      })
      
    },
    delManufacturer:(payload,callback)=>{ //删除
      dispatch({
        type: `${namespace}/delManufacturer`, 
        payload:payload,
        callback:callback
      }) 
    },
  }
}
const modules = {
  toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],
      ['link', 'image'],

      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],                         // text direction

      // [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean']                                         // remove formatting button
  ]
}

const Index = (props) => {



  const [form] = Form.useForm();
  const [form2] = Form.useForm();

  const [data, setData] = useState([]);

  const [editingKey, setEditingKey] = useState('');
  const [count, setCount] = useState(513);
  const [DGIMN,setDGIMN] =  useState('')
  const [expand,setExpand] = useState(false)
  const [fromVisible,setFromVisible] = useState(false)
  const [tableVisible,setTableVisible] = useState(false)

  const [type,setType] = useState('add')

  
  
  const isEditing = (record) => record.key === editingKey;
  
  const  { tableDatas,tableTotal,tableLoading,loadingAddConfirm,loadingEditConfirm,exportLoading, } = props; 
  useEffect(() => {
    onFinish();
  
  },[]);

  const columns = [
    {
      title: '编号',
      dataIndex: 'ManufacturerCode',
      key:'ManufacturerCode',
      align:'center',
    },
    {
      title: '问题名称',
      dataIndex: 'ManufacturerName',
      key:'ManufacturerName',
      align:'center',
    },
    {
      title: '一级类别',
      dataIndex: 'Abbreviation',
      key:'Abbreviation',
      align:'center',
    },
    {
      title: '二级类别',
      dataIndex: 'ManufacturerCode',
      key:'ManufacturerCode',
      align:'center',
    },
    {
      title: '二级类别',
      dataIndex: 'Status',
      key:'Status', 
      align:'center',
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
      title: '维护人',
      dataIndex: 'ManufacturerName',
      key:'ManufacturerName',
      align:'center',
    },
    {
      title: '维护时间',
      dataIndex: 'ManufacturerName',
      key:'ManufacturerName',
      align:'center',
    },  
    {
      title: <span>操作</span>,
      dataIndex: 'x',
      key: 'x',
      align: 'center',
      width:180,
      render: (text, record) =>{
        return  <span>
               <Fragment><Tooltip title="编辑"> <a  onClick={()=>{edit(record)}} ><EditIcon /></a> </Tooltip><Divider type="vertical" /> </Fragment>
               <Fragment><Tooltip title="详情"> <a  onClick={()=>{detail(record)}} ><DetailIcon /></a> </Tooltip><Divider type="vertical" /> </Fragment>
             
               <Fragment> <Tooltip title="删除">
                  <Popconfirm  title="确定要删除此条信息吗？"   style={{paddingRight:5}}  onConfirm={()=>{ del(record)}} okText="是" cancelText="否">
                  <a><DelIcon/></a>
               </Popconfirm>
               </Tooltip>
               </Fragment> 
             </span>
      }
    },
  ];


  const edit = async (record) => {
    setFromVisible(true)
    setType('edit')
    form2.resetFields();
    try {
      form2.setFieldsValue({
        ...record,
      })

    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };
  const detail = (row) =>{

    router.push({pathname:'/Intelligentanalysis/operationWorkStatis/noAccountStatistics/ent/cityLevel',query:{row}})
  }
  const del =  async (record) => {
    const values = await form.validateFields();
    props.delManufacturer({ID:record.ID},()=>{  
      setPageIndex(1)
      props.getManufacturerList({
        pageIndex:1,
        pageSize:pageSize,
        ...values,
      })
    })
  };



  
  
  const add = () => {
    setFromVisible(true)
    setType('add')
    form2.resetFields();
  };

  const [pageIndex,setPageIndex] = useState(1)
  const [pageSize,setPageSize] = useState(20)
  const onFinish  = async (pageIndexs,pageSizes) =>{  //查询
      
    try {
      const values = await form.validateFields();
      pageIndexs&& typeof  pageIndexs === "number"? setPageIndex(pageIndexs) : setPageIndex(1); //除分页和编辑  每次查询页码重置为第一页

      props.getManufacturerList({
        pageIndex:pageIndexs&& typeof  pageIndexs === "number" ?pageIndexs:1,
        pageSize:pageSizes?pageSizes:pageSize,
        ...values,
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  const onModalOk  = async () =>{ //添加 or 编辑弹框

    setDescText({ ...validatePrimeDesc(descText), descText });
    
    if(JSON.stringify(descText) === '{}'){ //空对象
      setDescText({validateStatus: 'error',  errorMsg: '问题描述不能为空', });
    }
    try {
      const values = await form2.validateFields();//触发校验
      type==='add'? props.addManufacturer({
       ...values,
        desc:descText,
      },()=>{
        setFromVisible(false)
        onFinish()
      })
      :
     props.editManufacturer({
        ...values,
      },()=>{
        setFromVisible(false)
        onFinish(pageIndex)
      })
      
    } catch (errInfo) {
      console.log('错误信息:', errInfo);
    }
  }
  const onAddEditValuesChange= (hangedValues, allValues)=>{ //添加修改时的监测类型请求
    if(Object.keys(hangedValues).join() == 'PollutantType'){
      props.addEditPollutantById({id:hangedValues.PollutantType,type:1}) //监测类型
      form2.setFieldsValue({PollutantCode:undefined})

      props.addEditGetEquipmentName({id:hangedValues.PollutantType,type:2}) //设备名称
      form2.setFieldsValue({EquipmentName:undefined})
    }
  }
  const handleTableChange =   async (PageIndex,PageSize )=>{ //分页
    setPageSize(PageSize)
    setPageIndex(PageIndex)
    onFinish(PageIndex,PageSize)
  }
  const validatePrimeDesc = (text) => {
    console.log(text)
    if (text) {
      return {
        validateStatus: 'success',
        errorMsg: null,
      };
    }
  
    return {
      validateStatus: 'error',
      errorMsg: '问题描述不能为空',
    };
  };
  const [descText,setDescText ] = useState({})
  const descChange = (value) =>{
  const data = value.replaceAll(/<p>|[</p>]/g,'').trim();
  const val = data && data!='br' ? value : undefined
    setDescText({ ...validatePrimeDesc(val), val });
  }

  const descBlur = (e) =>{
    
    console.log(e)
  }
  const searchComponents = () =>{
     return  <Form
    form={form}
    name="advanced_search"
    className={styles['ant-advanced-search-form']}
    layout='inline'
    onFinish={onFinish}
  >  
      <Form.Item label="问题名称" name="ManufacturerName"  >
        <Input placeholder='请输入' allowClear style={{width:200}}/>
      </Form.Item>
      <Form.Item>
      <Button   type="primary" htmlType='submit'  style={{marginRight:8}}>
          查询
     </Button>
     <Button   onClick={()=>{form.resetFields()}}  style={{marginRight:8}}>
          重置
     </Button> 
     <Button   onClick={()=>{ add()}} >
          添加
     </Button>
     </Form.Item>
     </Form>
  }
  return (
    <div  className={styles.equipmentManufacturListSty}>
    <BreadcrumbWrapper>
    <Card title={searchComponents()}>
      <SdlTable
        loading = {tableLoading}
        bordered
        dataSource={tableDatas}
        columns={columns}
        pagination={{
          total:tableTotal,
          pageSize: pageSize,
          current: pageIndex,
          showSizeChanger: true,
          showQuickJumper: true,
          onChange: handleTableChange,
        }}
      />
   </Card>
   </BreadcrumbWrapper>
   
   <Modal
        title={type==='add'? '添加':'编辑'}
        visible={fromVisible}
        onOk={onModalOk}
        confirmLoading={type==='add'? loadingAddConfirm:loadingEditConfirm}
        onCancel={()=>{setFromVisible(false)}}
        className={styles.fromModal}
        destroyOnClose
      >
        <Form
      name="basic"
      form={form2}
      initialValues={{
        Status:1
      }}
      onValuesChange={onAddEditValuesChange}
    >
      <Row>
      <Col span={24}>
      <Form.Item   name="ID" hidden>
          <Input />
      </Form.Item> 
      </Col>
        <Col span={24}>
        <Form.Item   label="问题名称" name="ManufacturerCode"  rules={[  { required: true,  }]} >
        <TextArea showCount  maxLength={50} rows={1} placeholder='请输入'   />
      </Form.Item>
      </Col>
      <Col span={24}>
      <Form.Item label="一级类别" name="SystemName"  rules={[  { required: true,message:'请选择一级类别' }]}>
            <Spin size='small' spinning={false}>
              <Select placeholder='请选择' allowClear >
              {/* {
               systemModelNameList[0]&&systemModelNameList.map(item => {
                 return <Option key={item.Code} value={item.Code}>{item.Name}</Option>
               })
             }    */}
           </Select>
           </Spin>
      </Form.Item>
      </Col>
      <Col span={24}>
      <Form.Item label="二级类别" name="SystemName2"   rules={[  { required: true,message:'请选择二级类别' }]}>
             <Spin size='small' spinning={false}>
              <Select placeholder='请选择' >
              {/* {
               systemModelNameList[0]&&systemModelNameList.map(item => {
                 return <Option key={item.Code} value={item.Code}>{item.Name}</Option>
               })
             }    */}
           </Select>
           </Spin>
      </Form.Item>
      </Col>
        <Col span={24}>
        <Form.Item label="答案描述"   validateStatus={descText.validateStatus }     help={descText.errorMsg}>
        <ReactQuill theme="snow"   onBlur={descBlur}  onChange={descChange}   modules={modules}  className=" ql-editor"  style={{ height:'calc(100% - 500px)' }}/>
      </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item label="问题状态" name="Status" >
           <Radio.Group>
             <Radio value={1}>显示</Radio>
             <Radio value={2}>不显示</Radio>
         </Radio.Group>
      </Form.Item>
      </Col>
      </Row>


     
    </Form>
      </Modal>
        </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);