/**
 * 功  能：企业下运维信息管理
 * 创建人：贾安波
 * 创建时间：2021.08.24
 */
import React, { useState,useEffect,Fragment  } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography,Card,Button,Select, message,Row,Col,Tooltip,Divider,Modal,DatePicker,Popover    } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined,UpOutlined,DownOutlined,ExportOutlined,RollbackOutlined, CodeSandboxCircleFilled  } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import RangePicker_ from '@/components/RangePicker/NewRangePicker'
import RegionList from '@/components/RegionList'
import { DelIcon, DetailIcon, EditIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import styles from "./style.less";
import moment from 'moment';

const { Option } = Select;

const namespace = 'operationInfo'




const dvaPropsData =  ({ loading,operationInfo,autoForm }) => ({
  tableDatas:operationInfo.tableDatas,
  projectTableDatas:operationInfo.projectTableDatas,
  tableLoading:operationInfo.tableLoading,
  loadingConfirm: loading.effects[`${namespace}/updateOrAddProjectRelation`],
  exportLoading: loading.effects[`${namespace}/exportEntProjectRelationList`],
  projectNumListLoading:loading.effects[`${namespace}/projectNumList`],
  operationInfoList:autoForm.tableInfo,
  entPointList:operationInfo.entPointList,
})

const  dvaDispatch = (dispatch) => {
  return { 
    getEntProjectRelationList:(payload)=>{ //监测运维列表
      dispatch({
        type: `${namespace}/getEntProjectRelationList`,
        payload:payload,
      })
    },
    updateOrAddProjectRelation : (payload,callback) =>{ //修改 or 添加
      dispatch({
        type: `${namespace}/updateOrAddProjectRelation`,
        payload:payload,
        callback:callback
      }) 
      
    },
    deleteOperationPoint:(payload,callback)=>{ //删除
      dispatch({
        type: `${namespace}/deleteOperationPoint`, 
        payload:payload,
        callback:callback
      }) 
    },
    projectNumList:(payload)=>{ //项目编号列表
      dispatch({
        type: `${namespace}/projectNumList`,
        payload:payload
      })
    },
    operationList:(payload)=>{ //运维单位列表
      dispatch({
        type: 'autoForm/getAutoFormData',
        payload: {
            configId: 'OperationMaintenanceEnterprise', 
            otherParams:{
                pageSize:10000,
              },

        },
     });
     dispatch({
      type: 'autoForm/getPageConfig',
      payload: {
        configId: 'OperationMaintenanceEnterprise',
      },
    });
    },
    getEntPointList:(payload)=>{ //企业监测点列表
      dispatch({
        type: `${namespace}/getEntPointList`,
        payload:payload
      })
    },
    exportEntProjectRelationList:(payload)=>{ //导出
      dispatch({
        type: `${namespace}/exportEntProjectRelationList`,
        payload:payload
      })
    },
  }
}
let choiceArr = [],choiceID = []
const Index = (props) => {



  const [form] = Form.useForm();
  const [form2] = Form.useForm();

  const [fromVisible,setFromVisible] = useState(false)
  const [tableVisible,setTableVisible] = useState(false)
  const [popVisible,setPopVisible] = useState(false)

  const [type,setType] = useState('add')
  
  
  const [projectNum,setProjectNum] = useState('')
  const [choiceData,setChoiceData] = useState([])

  

  
  
  const  { tableDatas,projectTableDatas,loadingConfirm,tableLoading,exportLoading,projectNumListLoading,operationInfoList,entPointList } = props; 

  
  useEffect(() => {
    
    initData();

  },[props.DGIMN]);
 

  const initData=()=>{
    onFinish();
    projectNumQuery(); //项目编号列表
    props.operationList();//运维列表
    props.getEntPointList({EntID:props.location.query.p});//企业运维列表
    

  }

  const projectNumList=()=>{
    props.projectNumList()
  }
  const columns = [
    {
      title: '监测点',
      dataIndex: 'pointName',
      key:'pointName',
      align:'center'
    },
    {
      title: '运维单位',
      dataIndex: 'company',
      key:'company',
      align:'center'
    },
    {
      title: '项目编号',
      dataIndex: 'projectCode',
      key:'projectCode',
      align:'center',
    },
    {
      title: '省区名称',
      dataIndex: 'regionName',
      key:'regionName',
      align:'center',
    },
    {
      title: '运营起始日期',
      dataIndex: 'operationBeginTime',
      key:'operationBeginTime',
      align:'center',
      sorter: (a, b) => moment(a.operationBeginTime).valueOf() - moment(b.operationBeginTime).valueOf()
    },
    {
      title: '运营结束日期',
      dataIndex: 'operationEndTime',
      key:'operationEndTime',
      align:'center',
      sorter: (a, b) => moment(a.operationEndTime).valueOf() - moment(b.operationEndTime).valueOf()
      
    },
    {
      title: '实际开始日期',
      dataIndex: 'actualBeginTime',
      key:'actualBeginTime',
      align:'center',
      sorter: (a, b) => moment(a.actualBeginTime).valueOf() - moment(b.actualBeginTime).valueOf()
    },
    {
      title: '实际结束日期',
      dataIndex: 'actualEndTime',
      key:'actualEndTime',
      align:'center',
      sorter: (a, b) => moment(a.actualEndTime).valueOf() - moment(b.actualEndTime).valueOf()
      
    },
    {
      title: <span>操作</span>,
      dataIndex: 'x',
      key: 'x',
      align: 'center',
      render: (text, record) =>{
        return  <span>
               <Fragment><Tooltip title="编辑"> <a href="#" onClick={()=>{edit(record)}} ><EditIcon /></a> </Tooltip><Divider type="vertical" /> </Fragment>
               <Fragment> <Tooltip title="删除">
                  <Popconfirm  title="确定要删除此条信息吗？"   style={{paddingRight:5}}  onConfirm={()=>{del(record)}} okText="是" cancelText="否">
                  <a href="#" ><DelIcon/></a>
               </Popconfirm>
               </Tooltip>
               </Fragment> 
             </span>
      }
    },
  ];

  
const projectNumCol =[
  {
    title: '项目编号',
    dataIndex: 'ProjectCode',
    key:'ProjectCode',
    align:'center',
  },
  {
    title: '卖方公司名称',
    dataIndex: 'SellCompanyName',
    key:'SellCompanyName',
    align:'center',
  },
  {
    title: '运营起始日期',
    dataIndex: 'BeginTime',
    key:'BeginTime',
    align:'center',
  },
  {
    title: '运营结束日期',
    dataIndex: 'EndTime',
    key:'EndTime',
    align:'center',
    
  },
  {
    title: <span>操作</span>,
    dataIndex: 'x',
    key: 'x',
    align: 'center',
    render: (text, record) =>{
      return<Button size='small' type="primary" onClick={()=>{ choice(record)}} >选择</Button>
    }
  },
  ]


  const choice = (record) =>{
    // choiceArr.push(record.ProjectCode)
    // const  value = Array.from(new Set(choiceArr))
    // choiceID.push(record.ID)
    // const  idArr = Array.from(new Set(choiceID))
    // form2.setFieldsValue({PorjectID:idArr[0]? idArr.toString() : ''});
    // setChoiceData(value)
    form2.setFieldsValue({PorjectID:record.ID});
    setChoiceData(record.ProjectCode)
  }
  const onClearChoice=(value)=>{
    // choiceArr=value;
    // setChoiceData(choiceArr)
    // choiceID=[];
    // projectTableDatas.map(item=>{
    //   value.map(items=>{
    //     if(item.ProjectCode === items){
    //       choiceID.push(item.ID) 
    //     }
    //   })
    // })
    // form2.setFieldsValue({PorjectID:choiceID[0]? choiceID.toString() : ''});
    form2.setFieldsValue({PorjectID:value});
    setChoiceData(value)
  }
  const del = async (record) => {
    props.deleteOperationPoint({ID:record.ID},()=>{
       onFinish()
    })
  };




  
  const add = () => {
    setChoiceData([])
    form2.resetFields();
    setFromVisible(true)

  };
  const edit = async (record) => {
    form2.setFieldsValue({ ...record,PorjectID:record.projectID,OperationCompany:record.companyID,RegionCode:record.regionCode,BeginTime:moment(record.actualBeginTime),EndTime:moment(record.actualEndTime)});
    setChoiceData(record.projectCode)
    setFromVisible(true)
  };

  const exports = async () => {
    const values = await form.validateFields();
    props.exportEntProjectRelationList({...values})
 };
 

  const onFinish  = async () =>{  //查询
    try {
      const values = await form.validateFields();
       props.getEntProjectRelationList({...values})
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  const onModalOk  = async () =>{ //添加 or 编辑弹框
    try {
      const values = await form2.validateFields();
      props.updateOrAddProjectRelation(
        {...values,BeginTime:values.BeginTime.format('YYYY-MM-DD 00:00:00'),EndTime:values.EndTime.format('YYYY-MM-DD 23:59:59')},()=>{
        setFromVisible(false);
        onFinish();
     })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }

  const  projectNumQuery = ()=>{
    props.projectNumList({ProjectCode:projectNum})
 }
  
 const endDisabledDate=(current)=>{
  const time = form2.getFieldValue('BeginTime')
  return time&&current && current < moment(time).endOf('day');
}
 const startDisabledDate=(current)=>{
  const time = form2.getFieldValue('EndTime')
  return time&&current && current > moment(time).startOf('day');
}
  const searchComponents = () =>{
     return  <Form
    name="advanced_search"
    className={styles['ant-advanced-search-form']}
    form={form}
    onFinish={onFinish}
    initialValues={{EntID:props.location.query.p}}
  > 

         <Row> 
         <Form.Item name='DGIMN' label='监测点' >
          <Select placeholder="请选择监测点列表" style={{width:180}}>
             {entPointList[0]&&entPointList.map(item=>{
              return <Option value={item.DGIMN}>{item.PointName}</Option>
          })
         }
        </Select>
          </Form.Item>
          <Form.Item name='ProjectID' style={{margin:'20px 12px'}}  label='项目编号' >
            <Input placeholder="请输入项目编号" />
          </Form.Item>
     
      <Form.Item label="" style={{margin:'20px 12px'}} name="EntID" hidden>
          <Input />
      </Form.Item> 
      <Form.Item>
        <Button type="primary" htmlType="submit">
            查询
          </Button>
          <Button style={{  margin: '0 8px',}} onClick={() => {  form.resetFields(); }}  >
            重置
          </Button>
          <Button onClick={() => {props.history.go(-1);   }} ><RollbackOutlined />返回</Button>
          </Form.Item>
      </Row>  

      <Row  align='middle'>
      <Form.Item style={{margin:'0 8px 20px 0'}} >
     <Button  icon={<PlusOutlined />} type="primary" onClick={()=>{ add()}} >
          添加
     </Button>
       <Button icon={<ExportOutlined />} loading={exportLoading} style={{  margin: '0 8px',}} onClick={()=>{ exports()} }>
            导出
          </Button> 
          </Form.Item>
      </Row>   
      
     </Form>
  }
  const operationDataSource = operationInfoList['OperationMaintenanceEnterprise']&&operationInfoList['OperationMaintenanceEnterprise'].dataSource ? operationInfoList['OperationMaintenanceEnterprise'].dataSource : [];

  return (
    <div  className={styles.entOperationInfo}>
    <BreadcrumbWrapper>
    <Card title={ props.location.query.entName}>
     {searchComponents()}
      <SdlTable
        loading = {tableLoading}
        bordered
        dataSource={tableDatas}
        columns={columns}
      />
   </Card>
   </BreadcrumbWrapper>
   
   <Modal
        title={type==='edit'? '编辑合同':'添加合同'}
        visible={fromVisible}
        onOk={onModalOk}
        confirmLoading={loadingConfirm}
        onCancel={()=>{setFromVisible(false)}}
        className={styles.fromModal}
        destroyOnClose
        centered
      >
    <Form
      name="basic2"
      form={form2}
    >
      <Row>
        <Col span={12}>
        <Form.Item label="监测点列表" name="DGIMN" rules={[  { required: true, message: '请选择监测点列表!',  },]} >
        <Select placeholder="请选择监测点列表">
          {entPointList[0]&&entPointList.map(item=>{
            return <Option value={item.DGIMN}>{item.PointName}</Option>
          })
         }
        </Select>
      </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="运维单位" name="OperationCompany" rules={[  { required: true, message: '请选择运维单位!',  },]} >
          <Select placeholder="请选择运维单位">
           {operationDataSource[0]&&operationDataSource.map(item=>{
             return <Option value={item['dbo.T_Bas_OperationMaintenanceEnterprise.EnterpriseID']}>{item['dbo.T_Bas_OperationMaintenanceEnterprise.Company']}</Option>
           })
          }
        </Select> 
      </Form.Item>
      </Col>
      </Row>
      <Row>
        <Col span={12}>
        <Form.Item label="项目编号" name="PorjectID"  rules={[  { required: true, message: '请输入项目编号!',  },]} >
          <Popover
            content={<>
              <Row>
              <Form.Item  style={{marginRight:8}}  label='项目编号' >
                  <Input allowClear placeholder="请输入项目编号"  onChange={(e)=>{ setProjectNum(e.target.value)}}/>
                </Form.Item>
              <Form.Item>
               <Button type="primary" onClick={projectNumQuery}>
               查询
             </Button>
             </Form.Item>
             </Row>
               <SdlTable style={{width:800}} loading = {projectNumListLoading} bordered    dataSource={projectTableDatas}   columns={projectNumCol}  />
               </>}
            title=""
            trigger="click"
            visible={popVisible}
            onVisibleChange={(visible )=>{setPopVisible(visible)}}
            placement="bottom"
          >
           <Select onChange={onClearChoice} allowClear showSearch={false}   value={choiceData} dropdownClassName={styles.projectNumSty} placeholder="请选择项目编号"> </Select>
      </Popover>
      </Form.Item> 
      </Col>
      <Col span={12}>
      <Form.Item label="省份名称" name="RegionCode" rules={[  { required: true, message: '请选择省份名称!',  },]} >
       <RegionList     levelNum={1} selectType = '1,是' style={{width:'100%'}}/>
      </Form.Item>
      </Col>
      </Row>



      <Row>
        <Col span={12}>
        <Form.Item label="实际起始日期" name="BeginTime" rules={[{ required: true, message: '请选择实际起始日期!',  },]} >
        <DatePicker  disabledDate={startDisabledDate} />
      </Form.Item>
      </Col>
      <Col span={12}>
      <Form.Item label="实际结束日期"  name="EndTime" rules={[{ required: true, message: '请选择实际结束日期!',  },]} >
        <DatePicker  disabledDate={endDisabledDate} />
      </Form.Item>
      </Col>
      </Row>
      <Row>
        <Col span={12}>
        <Form.Item label="备注" name='Remark' hidden={type==='add'}>
        <Input placeholder='请输入备注信息'/>
      </Form.Item>
      </Col>
      <Col span={12}>
      <Form.Item label="ID"  name="ID" hidden>
          <Input />
      </Form.Item> 
      </Col>
      </Row>
      <Row>
        <Col span={12}>
        <Form.Item label="备注" name='Remark' hidden={type==='add'}>
        <Input placeholder='请输入备注信息'/>
      </Form.Item>
      </Col>
      </Row>
    </Form>
      </Modal>
        </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);