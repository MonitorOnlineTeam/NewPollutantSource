/**
 * 功  能：异常工单统计
 * 创建人：贾安波
 * 创建时间：2021.09.27
 */
import React, { useState,useEffect,Fragment,useRef,useImperativeHandle,forwardRef} from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography,Card,Button,Select,Progress, message,Row,Col,Tooltip,Divider,Modal,DatePicker,Radio,Tabs    } from 'antd';
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

const namespace = 'planWorkOrderStatistics'




const dvaPropsData =  ({ loading,planWorkOrderStatistics }) => ({
  tableDatas:planWorkOrderStatistics.tableDatas,
  pointDatas:planWorkOrderStatistics.pointDatas,
  tableLoading:planWorkOrderStatistics.tableLoading,
  tableTotal:planWorkOrderStatistics.tableTotal,
  abnormalTypes:planWorkOrderStatistics.abnormalTypes,
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
const Index = (props,ref) => {


  const [regionForm] = Form.useForm();


  const [data, setData] = useState([]);


  const [tableVisible,setTableVisible] = useState(false)
  const [abnormalType,setAbnormalType] = useState(1)

  const [cityVisible,setCityVisible] = useState(false)

  const [operaPointVisible,setOperaPointVisible] = useState(false)

  const [workOrderVisible,setWorkOrderVisible] = useState(false)

  

  const [pageSize,setPageSize] = useState(20)
  const [pageIndex,setPageIndex] = useState(1)

  const [aa,setAa] = useState(['周一','周二','周三','周四','周五','周六','周日'])


  
  const  { tableDatas,tableTotal,loadingConfirm,pointDatas,tableLoading,pointLoading,exportLoading,exportPointLoading,abnormalTypes,refInstance } = props; 
  useEffect(() => {

  
    },[]);

  
  const alarmResponse = () =>{
    return <ol type='1' style={{listStyleType:'decimal'}}>
              <li>报警响应工单:数据出现异常、缺失后:系统会发出报警，运维人员响应报警后会生成工单。</li>
              <li>响应超时:报警首欠出现后:超过5个小时响应，则生成的工单判定为响应超时异常工单。</li>
           </ol>
  }

  const plannedInspectTip =()=>{
    return <ol type='1' style={{listStyleType:'decimal'}}>
    <li>通过该页面可以查看监测点派发计划工单情况。</li>
    <li>运维状态：已结束则系统停止派发计划工单情况。</li>
  </ol>
  }
  const workOrderTip = ()=>{
    return <ol type='1' style={{listStyleType:'decimal'}}>
    <li>运营周期内:在监测点的实际运营周期内。</li>
    <li>完成工单:当日存在完成的计划工单。</li>
    <li>系统关闭工单:在运维周期内未完成计划工单，系统会关闭掉。</li>
    <li>4、同时存在关闭和完成的工单:当日存在系统关闭的计划工单，也存在完成的工单。</li>

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
           setCityVisible(true)
          // router.push({pathname:`/Intelligentanalysis/planWorkOrderStatistics/regionDetail`,query:{data:JSON.stringify(record) }});
         }}
        >河南省</Button>
      }
    },
    {
      title: '运营企业数',
      dataIndex: 'ProjectName',
      key:'ProjectName',
      align:'center',
      width: 50,
    },
    {
      title: <span>运营监测点数<Tooltip title={'点击运营监测点数，可以查看运营监测点在条件日期内派发计划工单情况。'}><QuestionCircleOutlined style={{paddingLeft:5}}/></Tooltip></span>,
      dataIndex: 'ProjectName',
      key:'ProjectName',
      align:'center',
      width: 100,
      render:(text,record,index)=>{
        return  <Button type="link"
         onClick={()=>{
           setOperaPointVisible(true)
         }}
        >3</Button>
      }
    },
    {
      title: '计划巡检工单',
      width:200,
      children: [
        {
          title: <span>总数<Tooltip  title={'日期条件内，派发的计划巡检工单数。'}><QuestionCircleOutlined style={{paddingLeft:5}}/></Tooltip></span>,
          dataIndex: 'building',
          key: 'building',
          width: 50,
          align:'center',
          render:(record,text,index)=>{
            return  <Button type="link" onClick={()=>{totalNum()}}>3</Button>
          }
        },
        {
          title:  <span>完成数</span>,
          dataIndex: 'number',
          key: 'number',
          width: 50,
          align:'center',
        },
        {
          title: '完成率',
          dataIndex: 'number',
          key: 'number',
          width: 100,
          align:'center',
          sorter: (a, b) => a.number - b.number,
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
      title: '计划校准工单',
      width:200,
      children: [
        {
          title: <span>总数<Tooltip  title={'日期条件内，派发的计划巡检工单数。'}><QuestionCircleOutlined style={{paddingLeft:5}}/></Tooltip></span>,
          dataIndex: 'building',
          key: 'building',
          width: 50,
          align:'center',
          render:(record,text,index)=>{
            return  <Button type="link" onClick={()=>{totalNum()}}>3</Button>
          }
        },
        {
          title:  <span>完成数</span>,
          dataIndex: 'number',
          key: 'number',
          width: 50,
          align:'center',
        },
        {
          title: '完成率',
          dataIndex: 'number',
          key: 'number',
          width: 100,
          align:'center',
          sorter: (a, b) => a.number - b.number,
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
   
  ];

  const cityRegColumns = [
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
      title: '省/市',
      dataIndex: 'RegionName',
      key:'RegionName',
      align:'center',
    },
    {
      title: '运营企业数',
      dataIndex: 'ProjectName',
      key:'ProjectName',
      align:'center',
      width: 50,
    },
    {
      title: <span>运营监测点数<Tooltip title={'点击运营监测点数，可以查看运营监测点在条件日期内派发计划工单情况。'}><QuestionCircleOutlined style={{paddingLeft:5}}/></Tooltip></span>,
      dataIndex: 'ProjectName',
      key:'ProjectName',
      align:'center',
      width: 100,
    },
    {
      title: '计划巡检工单',
      width:200,
      children: [
        {
          title: <span>总数<Tooltip  title={'日期条件内，派发的计划巡检工单数。'}><QuestionCircleOutlined style={{paddingLeft:5}}/></Tooltip></span>,
          dataIndex: 'building',
          key: 'building',
          width: 50,
          align:'center',
          render:(record,text,index)=>{
            return  <Button type="link" onClick={()=>{totalNum()}}>3</Button>
          }
        },
        {
          title:  <span>完成数</span>,
          dataIndex: 'number',
          key: 'number',
          width: 50,
          align:'center',
        },
        {
          title: '完成率',
          dataIndex: 'number',
          key: 'number',
          width: 100,
          align:'center',
          sorter: (a, b) => a.number - b.number,
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
      title: '计划校准工单',
      width:200,
      children: [
        {
          title: <span>总数<Tooltip  title={'日期条件内，派发的计划巡检工单数。'}><QuestionCircleOutlined style={{paddingLeft:5}}/></Tooltip></span>,
          dataIndex: 'building',
          key: 'building',
          width: 50,
          align:'center',
          render:(record,text,index)=>{
            return  <Button type="link" onClick={()=>{totalNum()}}>3</Button>
          }
        },
        {
          title:  <span>完成数</span>,
          dataIndex: 'number',
          key: 'number',
          width: 50,
          align:'center',
        },
        {
          title: '完成率',
          dataIndex: 'number',
          key: 'number',
          width: 100,
          align:'center',
          sorter: (a, b) => a.number - b.number,
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
   
  ];

  const operaPointColumns = [
    {
      title: '省/市',
      dataIndex: 'RegionName',
      key:'RegionName',
      align:'center',
    },
    {
      title: '企业名称',
      dataIndex: 'ProjectName',
      key:'ProjectName',
      align:'center',
    },
    {
      title: '监测点名称',
      dataIndex: 'RegionName',
      key:'RegionName',
      align:'center',
    },
    {
      title: '运维周期',
      dataIndex: 'RegionName',
      key:'RegionName',
      align:'center',
    },
    {
      title: '运维状态',
      dataIndex: 'RegionName',
      key:'RegionName',
      align:'center',
    },
    {
      title: <span>计划巡检工单数<Tooltip title={'日期条件内，派发的计划巡检工单数。'}><QuestionCircleOutlined style={{paddingLeft:5}}/></Tooltip></span>,
      dataIndex: 'ProjectName',
      key:'ProjectName',
      align:'center',
      width: 100,
    },
    {
      title: <span>计划校准工单数<Tooltip title={'日期条件内，派发的计划校工单数。'}><QuestionCircleOutlined style={{paddingLeft:5}}/></Tooltip></span>,
      dataIndex: 'ProjectName',
      key:'ProjectName',
      align:'center',
      width: 100,
    },
  ]
  const workOrderColumns = [
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
      title: '巡检周期',
      dataIndex: 'RegionName',
      key:'RegionName',
      align:'center',
    },
    {
      title: '计划巡检工单',
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
          title:  "完成数",
          dataIndex: 'number',
          key: 'number',
          width: 100,
          align:'center',
        },
        {
          title: '完成率',
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
   
  ];
 

 

 
 const operaPointExports = () => {

};
const cityRegColumnsExports = () =>{

}

const totalNum = () =>{

   setWorkOrderVisible(true)
    

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
  


  const searchCityRegComponents = () =>{
    return  <Button icon={<ExportOutlined />}   loading={exportLoading}  onClick={()=>{ cityRegColumnsExports()} }>
    导出
    </Button> 
  }


  const [ workOrderForm ]= Form.useForm()
  const searchWorkOrderComponents = () =>{
    return <> <Form
    onFinish={onFinish}
    form={workOrderForm}
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
     <Row align='middle'>
       <div style={{marginRight:8}}>
     <div style={{display:'inline-block', background:'#bae7ff',width:24,height:12,marginRight:5}}></div>
       <span>运营周期内</span>
       </div>
       <div  style={{ marginRight:8}}>
     <div style={{ display:'inline-block',background:'#1890ff',width:24,height:12,marginRight:5}}></div>
       <span>完成工单</span>
       </div>
       <div  style={{ marginRight:8}}>
     <div style={{display:'inline-block',background:'#f5222d',width:24,height:12,marginRight:5}}></div>
       <span>系统关闭工单</span>
       </div>
       <div >
       <div style={{display:'inline-block',background:'#faad14',width:24,height:12,marginRight:5}}></div>
       <span>当日存在关闭和完成工单</span>
       <Tooltip overlayClassName='customTooltipSty'  title={workOrderTip()}><QuestionCircleOutlined style={{paddingLeft:5,fontSize:10}}/></Tooltip>
       </div>

     </Row>
     </Col>
    </Row>
      </Form>
      <Row style={{paddingTop:8}}>
     <span style={{color:'#f5222d',fontSize:14}}>计划巡检工单由系统自动派发，在巡检周期内没有被完成，将被系统自动关闭。 </span>
     </Row>
      </>
   }
 const [OperaPointForm] = Form.useForm()
  const searchOperaPointComponents = () =>{
     return  <Form
     form={OperaPointForm}
     onFinish={onFinish}
     layout={'inline'}
     initialValues={{
       a:undefined,
       b:undefined,
     }}
   >    
    <Form.Item>
     <Radio.Group    buttonStyle="solid">
      <Radio.Button value={undefined}>全部</Radio.Button>
      <Radio.Button value="2">缺失计划工单</Radio.Button>
      <Radio.Button value="3">缺失计划巡检工单</Radio.Button>
      <Radio.Button value="4">缺失计划校准工单</Radio.Button>
    </Radio.Group>
    </Form.Item>
    <Form.Item>
     <Radio.Group  name='a'  buttonStyle="solid"   style={{  margin: '0 8px'}}>
      <Radio.Button value={undefined}>全部</Radio.Button>
      <Radio.Button value="2">进行中</Radio.Button>
      <Radio.Button value="3">已结束</Radio.Button>
    </Radio.Group>
    </Form.Item>
    <Form.Item>
     <Button icon={<ExportOutlined />}  loading={exportLoading}  onClick={()=>{operaPointExports()} }>
            导出
     </Button> 

     <Tooltip overlayClassName='customTooltipSty'  title={plannedInspectTip()}><QuestionCircleOutlined style={{paddingLeft:5}}/></Tooltip>
    </Form.Item>
    </Form>
  }
  workOrderColumns.push({
    title: '工单分布(按工单完成日期分布)',
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
            render:(text,record)=>{
              switch(text){
                case 1 :
                  return  <Row align='middle' justify='center' style={{ background:'#bae7ff',width:'100%',height:'100%',position:'absolute',top:0,left:0}}>
                  <span style={{color:'#fff'}}>1</span>
                </Row>
                break;
                case 2 :
                  return  <Row align='middle' justify='center' style={{ background:'#1890ff',width:'100%',height:'100%',position:'absolute',top:0,left:0}}>
                  <span style={{color:'#fff'}}>1</span>
                </Row>
                break;
                case 3 :
                  return  <Row align='middle' justify='center' style={{ background:'#f5222d',width:'100%',height:'100%',position:'absolute',top:0,left:0}}>
                  <span style={{color:'#fff'}}>1</span>
                </Row>
                break;
                case 4 :
                  return  <Row align='middle' justify='center' style={{ background:'#faad14',width:'100%',height:'100%',position:'absolute',top:0,left:0}}>
                  <span style={{color:'#fff'}}>1</span>
                </Row>
                break;
                default:
                  return  <Row align='middle' justify='center' style={{ background:'#bae7ff',width:'100%',height:'100%',position:'absolute',top:0,left:0}}>
                  <span style={{color:'#fff'}}>1</span>
                </Row>
              }

            }
        }]
      }
    })
})
// 暴露的子组件方法，给父组件调用
const childRef = useRef();
useImperativeHandle(refInstance,() => {
     return {
        _childFn(values) {
            // setAbnormalType(values)
        }
    }
})
  return (
      <div>
   
      <Tabs defaultActiveKey="1" >
    <Tabs.TabPane tab="计划工单统计" key="1">
    <SdlTable
        loading = {tableLoading}
        bordered
        dataSource={tableDatas}
        columns={columns}
        pagination={false}
      />
    </Tabs.TabPane>
    <Tabs.TabPane tab="计划外工单统计" key="2">
    <SdlTable
        loading = {tableLoading}
        bordered
        dataSource={tableDatas}
        columns={columns}
        pagination={false}
      />
    </Tabs.TabPane>
  </Tabs>
     
   

      {/**市级别弹框 */}
      <Modal
        title={'河南省新乡市'}
        visible={cityVisible}
        onCancel={()=>{setCityVisible(false)}}
        footer={null}
        destroyOnClose
        centered
        width='90%'
      >
     <Card title={  searchCityRegComponents()}>
     <SdlTable
        loading = {tableLoading}
        bordered
        dataSource={tableDatas}
        columns={cityRegColumns}
        pagination={false}
      />
   </Card>
 
      </Modal> 
  {/**运营监测点数弹框 */}
      
      <Modal
        title={'河南省新乡市运营监测点数'}
        visible={operaPointVisible}
        onCancel={()=>{setOperaPointVisible(false)}}
        footer={null}
        destroyOnClose
        centered
        width='90%'
      >
     <Card title={  searchOperaPointComponents()}>
     <SdlTable
        loading = {tableLoading}
        bordered
        dataSource={tableDatas}
        columns={operaPointColumns}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          // onChange: handleTableChange,
      }}
      />
   </Card>
 
      </Modal> 

        {/**省级&&市级工单数弹框 */}
      
        <Modal
        title={'内派发的计划巡检啊工单完成情况'}
        visible={workOrderVisible}
        onCancel={()=>{setWorkOrderVisible(false)}}
        footer={null}
        destroyOnClose
        centered
        width='90%'
      >
     <Card title={  searchWorkOrderComponents()}>
     <SdlTable
        loading = {tableLoading}
        bordered
        dataSource={tableDatas}
        columns={workOrderColumns}
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
const TFunction = connect(dvaPropsData,dvaDispatch)(Index);

export default forwardRef((props,ref)=><TFunction {...props} refInstance={ref}/>);