/**
 * 功  能：异常工单统计
 * 创建人：贾安波
 * 创建时间：2021.09.27
 */
import React, { useState,useEffect,Fragment  } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography,Card,Button,Select,Progress, message,Row,Col,Tooltip,Divider,Modal,DatePicker,Radio   } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined,UpOutlined,DownOutlined,ExportOutlined,QuestionCircleOutlined } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon,PointIcon, Left } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import styles from "../style.less"
import Cookie from 'js-cookie';
const { TextArea } = Input;
const { Option } = Select;

const namespace = 'abnormalWorkStatistics'




const dvaPropsData =  ({ loading,abnormalWorkStatistics }) => ({
  tableDatas:abnormalWorkStatistics.tableDatas,
  pointDatas:abnormalWorkStatistics.pointDatas,
  tableLoading:abnormalWorkStatistics.tableLoading,
  tableTotal:abnormalWorkStatistics.tableTotal,
  loadingConfirm: loading.effects[`${namespace}/addOrUpdateProjectInfo`],
  pointLoading: loading.effects[`${namespace}/getProjectPointList`],
  exportLoading: loading.effects[`${namespace}/exportProjectInfoList`],
  exportPointLoading: loading.effects[`${namespace}/getParametersInfo`],
})

const  dvaDispatch = (dispatch) => {
  return {
    updateState:(payload)=>{ 
      dispatch({
        type: `${namespace}/updateState`,
        payload:payload,
      })
    },
    getProjectInfoList:(payload)=>{ //项目管理列表
      dispatch({
        type: `${namespace}/getProjectInfoList`,
        payload:payload,
      })
    },
    addOrUpdateProjectInfo : (payload,callback) =>{ //修改 or 添加
      dispatch({
        type: `${namespace}/addOrUpdateProjectInfo`,
        payload:payload,
        callback:callback
      })
      
    },
    deleteProjectInfo:(payload,callback)=>{ //删除
      dispatch({
        type: `${namespace}/deleteProjectInfo`, 
        payload:payload,
        callback:callback
      }) 
    },
  }
}
const Index = (props) => {


  const [regionForm] = Form.useForm();


  const [data, setData] = useState([]);


  const [tableVisible,setTableVisible] = useState(false)


  const [pageSize,setPageSize] = useState(20)
  const [pageIndex,setPageIndex] = useState(1)

  const [aa,setAa] = useState(['周一','周二','周三','周四','周五','周六','周日'])

  
  const isEditing = (record) => record.key === editingKey;
  
  const  { tableDatas,tableTotal,loadingConfirm,pointDatas,tableLoading,pointLoading,exportLoading,exportPointLoading } = props; 
  useEffect(() => {

  
    },[]);
  const abnormalNumber = ()=>{
    return <ol type='1' style={{listStyleType:'decimal'}}>
    <li>打卡异常：每个监测点设置了电子围栏，填写运维工单时需要打卡，如果电子围栏外打卡，则判断定工单打卡异常工单。</li>
  </ol>
  }
  

  const columns = [
    {
      title: '序号',
      dataIndex: 'ProjectName',
      key:'ProjectName',
      align:'center',
      width: 50,
      render:(text,record,index)=>{
        return index;
      }
    },
    {
      title: '省',
      dataIndex: 'RegionName',
      key:'RegionName',
      align:'center',
      render:(text,record,index)=>{
        return  <Button type="link"
         onClick={()=>{
          router.push({pathname:`/Intelligentanalysis/abnormalWorkStatistics/regionDetail`,query:JSON.stringify(record)});
         }}
        >河南省</Button>
      }
    },
    {
      title: '计划内工单',
      width:200,
      children: [
        {
          title: '总数',
          dataIndex: 'building',
          key: 'building',
          width: 50,
          align:'center',
        },
        {
          title:  <span>打卡异常数<Tooltip overlayClassName='customTooltipSty' title={abnormalNumber()}><QuestionCircleOutlined style={{paddingLeft:5}}/></Tooltip></span>,
          dataIndex: 'number',
          key: 'number',
          width: 100,
          align:'center',
          render:(record,text,index)=>{
            return  <Button type="link" onClick={abnormalNum}>3</Button>
          }
        },
        {
          title: '异常率',
          dataIndex: 'number',
          key: 'number',
          width: 100,
          align:'center',
          render: (text, record) => {
            return (
              <div>
                <Progress
                  percent={text&&text.replace("%","")}
                  size="small"
                  style={{width:'90%'}}
                  status='normal'
                  format={percent => <span style={{ color: 'rgba(0,0,0,.6)' }}>{text}</span>}
                />
              </div>
            );
          }
        },
      ],
    },
    {
      title: '计划外工单',
      width:200,
      children: [
        {
          title: '总数',
          dataIndex: 'building',
          key: 'building',
          width: 50,
          align:'center',
        },
        {
          title: '打卡异常数',
          dataIndex: 'number',
          key: 'number',
          width: 100,
          align:'center',
          render:(record,text,index)=>{
            return   <Button type="link" onClick={abnormalNum}>3</Button>
          }
        },
        {
          title: '异常率',
          dataIndex: 'number',
          key: 'number',
          width: 100,
          align:'center',
          render: (text, record) => {
            return (
              <div>
                <Progress
                  percent={text&&text.replace("%","")}
                  size="small"
                  style={{width:'90%'}}
                  status='normal'
                  format={percent => <span style={{ color: 'rgba(0,0,0,.6)' }}>{text}</span>}
                />
              </div>
            );
          }
        },
      ],
    },
    {
      title: '异常率',
      dataIndex: 'number',
      key: 'number',
      width: 100,
      align:'center',
      render: (text, record) => {
        return (
          <div>
            <Progress
              percent={text&&text.replace("%","")}
              size="small"
              style={{width:'90%'}}
              status='normal'
              format={percent => <span style={{ color: 'rgba(0,0,0,.6)' }}>{text}</span>}
            />
          </div>
        );
      }
    },
  ];
  const cityColumns = [
    {
      title: '省/市',
      dataIndex: 'ProjectName',
      key:'ProjectName',
      align:'center',
      width: 100,
    },
    {
      title: '企业名称',
      dataIndex: 'RegionName',
      key:'RegionName',
      align:'center',
      width: 150,
      render:(record,text,index)=>{
        return  <div style={{textAlign:"left"}}>Link Button</div>
      }
    },
    {
      title: '监测点名称',
      dataIndex: 'RegionName',
      key:'RegionName',
      align:'center',
    },
    {
      title: '打卡异常数',
      dataIndex: 'RegionName',
      key:'RegionName',
      align:'center',
    },
  ];
 




  
  


 
 const abnormalExports = () => {

};
const abnormalNum = () =>{

   setTableVisible(true)
    

}

  const handleTableChange =   async (PageIndex, )=>{ //分页
  }
  const onFinish  = async () =>{  //查询
      
    try {
      const values = await form.validateFields();

      props.getProjectInfoList({
        ...values,
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  const searchComponents = () =>{
    return <Form
    onFinish={onFinish}
    form={regionForm}
    layout={'inline'}
  >   
      <Row justify='space-between'  align='middle' style={{flex:1}} >

        <Col >
        <Row align='middle'>
      <Form.Item name='entName' >
       <Input placeholder='请输入企业名称' />
     </Form.Item>

        <Form.Item>
     <Button  type="primary" htmlType='submit'>
          查询
     </Button>
     <Button icon={<ExportOutlined />}  style={{  margin: '0 8px'}}  loading={exportLoading}  onClick={()=>{ abnormalExports()} }>
            导出
     </Button> 
     
     </Form.Item>
     </Row>
     </Col>


     <Col>
     <Row align='middle'><div style={{background:'rgb(247,152,34)',width:20,height:10,marginRight:5}}></div><span>打卡异常数</span></Row>
     </Col>
    </Row>
     </Form>
  }

  cityColumns.push({
    title: '计划异常工单分布',
    width:200, 
    align:'center',
    children:aa.map((item,index)=>{
      return { 
        title: index,
        width: 50,
        align:'center',
        children: [{
            title: item,
            dataIndex: 'building',
            key: 'building',
            width: 50,
            align:'center',
        }]
      }
    })
})
  return (
      <div>
      <SdlTable
        loading = {tableLoading}
        bordered
        dataSource={tableDatas}
        columns={columns}
        pagination={false}
      />
   
      <Modal
        title={'河南省新乡市'}
        visible={tableVisible}
        onCancel={()=>{setTableVisible(false)}}
        footer={null}
        destroyOnClose
        centered
        width='90%'
      >
     <Card title={searchComponents()}>
     <SdlTable
        loading = {tableLoading}
        bordered
        dataSource={tableDatas}
        columns={cityColumns}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          // onChange: handleTableChange,
      }}
      />
   </Card>
 
      </Modal>
        </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);