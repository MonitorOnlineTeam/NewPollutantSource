/**
 * 功  能：异常工单统计
 * 创建人：贾安波
 * 创建时间：2021.09.27
 */
import React, { useState,useEffect,Fragment  } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography,Card,Button,Select,Progress, message,Row,Col,Tooltip,Divider,Modal,DatePicker,Radio   } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined,UpOutlined,DownOutlined,ExportOutlined,QuestionCircleOutlined,EnvironmentFilled } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { 
  DelIcon, DetailIcon, EditIcon,PointIcon, Left, GasOffline,
  GasNormal,
  GasExceed,
  GasAbnormal,
  WaterIcon,
  WaterNormal,
  WaterExceed,
  WaterAbnormal,
  WaterOffline } from '@/utils/icon'


import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import styles from "../style.less"
import Cookie from 'js-cookie';
const { TextArea } = Input;
const { Option } = Select;
import config from '@/config';
import { Map, MouseTool, Marker,Markers, Polygon,Circle } from '@/components/ReactAmap';

const namespace = 'planWorkOrderStatistics'




const dvaPropsData =  ({ loading,planWorkOrderStatistics }) => ({
  tableDatas:planWorkOrderStatistics.tableDatas,
  pointDatas:planWorkOrderStatistics.pointDatas,
  tableLoading:planWorkOrderStatistics.tableLoading,
  tableTotal:planWorkOrderStatistics.tableTotal,
  loadingConfirm: loading.effects[`${namespace}/addOrUpdateProjectInfo`],
  pointLoading: loading.effects[`${namespace}/getProjectPointList`],
  exportLoading: loading.effects[`${namespace}/exportProjectInfoList`],
  exportPointLoading: loading.effects[`${namespace}/getParametersInfo`],
  abnormalTypes:planWorkOrderStatistics.abnormalTypes
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


  const [abnormalNumVisible,setAbnormalNumVisible] = useState(false)


  const [pageSize,setPageSize] = useState(20)
  const [pageIndex,setPageIndex] = useState(1)

  const [aa,setAa] = useState(['周一','周二','周三','周四','周五','周六','周日'])


  
  const  { tableDatas,tableTotal,loadingConfirm,pointDatas,tableLoading,pointLoading,exportLoading,exportPointLoading,abnormalTypes } = props; 
  useEffect(() => {

  
    },[]);
  const abnormalNumber = ()=>{
    return <ol type='1' style={{listStyleType:'decimal'}}>
    <li>打卡异常：每个监测点设置了电子围栏，填写运维工单时需要打卡，如果电子围栏外打卡，则判断定工单打卡异常工单。</li>
  </ol>
  }
  

  const columns = [
    {
      title: '省/市',
      dataIndex: 'RegionName',
      key:'RegionName',
      align:'center',
    },
    {
      title: '企业名称',
      dataIndex: 'RegionName',
      key:'RegionName',
      align:'center',
      render:(text)=>{
      return <div style={{textAlign:'left'}}>{text}</div>
      }
    },
    {
      title: '监测点名称',
      dataIndex: 'RegionName',
      key:'RegionName',
      align:'center',
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
  
  
  
  const reponseNumColumns = [
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
      title: '响应超时数',
      dataIndex: 'RegionName',
      key:'RegionName',
      align:'center',
    }
  ];

 
 const abnormalExports = () => {

};
const abnormalNum = () =>{

  setAbnormalNumVisible(true)
    

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
     <Row align='middle'><div style={{background:'rgb(247,152,34)',width:30,height:15,marginRight:5}}></div><span>打卡异常数</span></Row>
     </Col>
    </Row>
     </Form>
  }


 const  getWaterIcon = status => {
    let icon = '';
    switch (status) {
      case 0: // 离线
        icon = <WaterOffline />;
        break;
      case 1: // 正常
        icon = <WaterNormal />;
        break;
      case 2: // 超标
        icon = <WaterExceed />;
        break;
      case 3: // 异常
        icon = <WaterAbnormal />;
        break;
    }
    return icon;
  };

  const getGasIcon = status => {
    let icon = '';
    switch (status) {
      case 0: // 离线
        icon = <GasOffline />;
        break;
      case 1: // 正常
        icon = <GasNormal />;
        break;
      case 2: // 超标
        icon = <GasExceed />;
        break;
      case 3: // 异常
        icon = <GasAbnormal />;
        break;
    }
    return icon;
  };
 const entMap = () =>{
  const styleA= {
    position: 'absolute',
    top: 0,
    padding: 5,
    color: '#fff',
    backgroundColor: "rgba(0,0,0,.4)"
}
   const styleB = {
    position: 'absolute',
    bottom: 0,
    padding: 5,
    color: '#fff',
    backgroundColor: "rgba(0,0,0,.4)"
}

const randomPosition = () => ({
  longitude: 100 + Math.random() * 20,
  latitude: 30 + Math.random() * 20
})
const randomMarker = (len) => (
  Array(len).fill(true).map((e, idx) => ({
    position: randomPosition()
  }))
);
const renderMarker = (extData) =>{
  console.log(extData)
  return <div>
          
         <Row style={{whiteSpace:"nowrap",padding:5,background:'#fff',marginBottom:5,marginLeft:-58}}>2021/09/16 14:08:08</Row>
         {/* <EnvironmentFilled style={{color:'#1890ff',fontSize:24}}/> */}
         <img src='/location.png' style={{width:24}}/>
         </div>
}

const [markers,setMarkers] = useState(randomMarker(10))
const [center,setCenter] = useState(randomPosition())
//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png
   return <div style={{width: '100%', height: '800px'}}>
     <Map
   amapkey={config.amapKey}
  //  events={this.amapEvents}
  //  mapStyle="amap://styles/normal"
   mapStyle="amap://styles/macaron"
   useAMapUI={!config.offlineMapUrl.domain}
   center={{longitude: 110, latitude: 40} } //center 地图中心点坐标值
   zoom={10}
 >
           <Markers markers={markers} render={renderMarker}  />
        <div style={styleA}>
        <span>某某化工厂- 脱硫排口，2021-06-01 ~ 2021-08-01期间打卡异常数: 200</span>
        </div>
           <div  style={styleB}>
          <Row align='middle'>
              {/* <EnvironmentFilled style={{color:'#1890ff',fontSize:18}}/> */}
              <img src='/location.png' style={{width:18}}/>
               <span style={{paddingLeft:5}}>打卡位置及时间</span></Row>
        </div>
        <Marker position={ {longitude: 110.222222, latitude: 40.222222}} >
        <div>
          
          <Row style={{whiteSpace:"nowrap",padding:'0 5px',background:'#fff',marginBottom:5,marginLeft:-22}}>脱硫排口</Row>
                 {getGasIcon(1)}
          </div> 
        </Marker>
        <Circle 
            center={ {longitude: 110.222222, latitude: 40.222222} } 
            radius={ 15000 }
            style={  {fillColor:"rgba(228,228,228,.7)", strokeColor: 'rgba(228,228,228,.8)'}}
          />
   </Map>
   </div>  
 }
  reponseNumColumns.push({
    title: '报警响应超时工单分布',
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

  const type = 1;
  return (
      <div>
      <SdlTable
        loading = {tableLoading}
        bordered
        dataSource={tableDatas}
        columns={columns}
        pagination={false}
      />
   
  {/**打卡异常 响应超时 弹框 */}
  <Modal
        title={'河南省新乡市'}
        visible={abnormalNumVisible}
        onCancel={()=>{setAbnormalNumVisible(false)}}
        footer={null}
        destroyOnClose
        centered
        width='90%'
      >
     <Card title={abnormalTypes==1? '' : searchComponents()} className={abnormalTypes==1&&styles.mapContentSty}>
     {abnormalTypes ==1?  
     entMap()
     :
      <SdlTable
      loading = {tableLoading}
      bordered
      dataSource={tableDatas}
      columns={reponseNumColumns}
      pagination={false}
    />
  }
     
   </Card>
   </Modal>
        </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);