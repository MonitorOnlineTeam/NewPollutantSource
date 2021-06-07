/**
 * 功  能：企业数据导入
 * 创建人：贾安波
 * 创建时间：2021.6.3
 */
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
  Card,
  Table,
  DatePicker,
  Progress,
  Row,
  Popover,
  Col,
  Badge,
  Modal,
  Input,
  Button,
  Select,
  Upload,
  message,
  Tabs 
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import Link from 'umi/link';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import SdlTable from '@/components/SdlTable';
import DatePickerTool from '@/components/RangePicker/DatePickerTool';
import { router } from 'umi';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import { downloadFile } from '@/utils/utils';
import ButtonGroup_ from '@/components/ButtonGroup'
import { routerRedux } from 'dva/router';
import RegionList from '@/components/RegionList'
import { DownloadOutlined,CloudDownloadOutlined,ImportOutlined } from '@ant-design/icons';
import styles from '../style.less'
const { Search } = Input;
const { MonthPicker } = DatePicker;
const { Option } = Select;
const { RangePicker } = DatePicker;

const { TabPane } = Tabs;
const monthFormat = 'YYYY-MM';

const pageUrl = {
  updateState: 'entImport/updateState',
  insertImportEnt: 'entImport/insertImportEnt',
};
@connect(({ loading, entImport,autoForm,common }) => ({
  loading: loading.effects[pageUrl.getData],
  saveLoading: loading.effects[pageUrl.getData],
}))
@Form.create()
export default class EntImport extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      importLoading:false,
      tableDatas1:[],
      tableDatas2:[],
      saveDisabled:true
    };
//     Abbreviation: "哈尔滨石化分公司热电厂"
// AttentionCode: "国控"
// City: "哈尔滨市"
// Col3: "完全抽取法"
// County: "兰西县"
// DGIMN: "as548545"
// EntAddress: "沙发沙发士大夫"
// EntLatitude: "41.204923"
// EntLongitude: "123.242485"
// EntName: "哈尔滨石化分公司热电厂"
// EnvironmentPrincipal: "张三"
// Error: "哈尔滨市下不存在此（县/区）；监测因子（折算SO₂1111）无效；工号（SDL001）不存在系统中请先添加此员工；"
// Latitude: "41.204923"
// Longitude: "123.242485"
// MobilePhone: "15210415451"
// OutputType: "排放口"
// PSScaleCode: "特大型"
// PointName: "1号"
// PolltantType: "2"
// PollutantList: "实测烟尘,折算烟尘,实测SO2,折算SO21111"
// Province: "黑龙江省"
// UserName: "张三"
// UserNum: "SDL001"
// warning: ""
    this.columns = [
      {
        title: <span>序号</span>,
        dataIndex: 'Sort',
        key: 'Sort',
        align: 'center',
        fixed: 'left',
        width:50,
        // render:(text,rocord)=>{
        //   if(!rocord.warning&&!rocord.Error){
        //     return text 
        //   }else if(rocord.Error){
        //   return <span style={{color:'#f5222d'}} >{text}</span>
        //   }else{
        //     return <span style={{color:'#faad14'}} >{text}</span>
        //   }
        // }
      },
      {
        title: <span>省</span>,
        dataIndex: 'Province',
        key: 'Province',
        align: 'center',
        fixed: 'left',
        width:90,
        // render:(text,rocord)=>{
        //   if(!rocord.warning&&!rocord.Error){
        //     return text 
        //   }else if(rocord.Error){
        //   return <span style={{color:'#f5222d'}} >{text}</span>
        //   }else{
        //     return <span style={{color:'#faad14'}} >{text}</span>
        //   }
        // }
      },
      {
        title: <span>地级市</span>,
        dataIndex: 'City',
        key: 'City',
        align: 'center',
        fixed: 'left',
        width:90,
        // render:(text,rocord)=>{
        //   if(!rocord.warning&&!rocord.Error){
        //     return text 
        //   }else if(rocord.Error){
        //   return <span style={{color:'#f5222d'}} >{text}</span>
        //   }else{
        //     return <span style={{color:'#faad14'}} >{text}</span>
        //   }
        // }
      },
      {
        title: <span>县/市</span>,
        dataIndex: 'County',
        key: 'County',
        align: 'center',
        fixed: 'left',
        width:90,
        // render:(text,rocord)=>{
        //   if(!rocord.warning&&!rocord.Error){
        //     return text 
        //   }else if(rocord.Error){
        //   return <span style={{color:'#f5222d'}} >{text}</span>
        //   }else{
        //     return <span style={{color:'#faad14'}} >{text}</span>
        //   }
        // }
      },
      {
        title: <span>企业名称</span>,
        dataIndex: 'EntName',
        key: 'EntName',
        align: 'center',
        fixed: 'left',
        // render:(text,rocord)=>{
        //   if(!rocord.warning&&!rocord.Error){
        //     return text 
        //   }else if(rocord.Error){
        //   return <span style={{color:'#f5222d'}} >{text}</span>
        //   }else{
        //     return <span style={{color:'#faad14'}} >{text}</span>
        //   }
        // }
      },
      {
        title: <span>企业简称</span>,
        dataIndex: 'Abbreviation',
        key: 'Abbreviation',
        align: 'center',
        fixed: 'left',
        // render:(text,rocord)=>{
        //   if(!rocord.warning&&!rocord.Error){
        //     return text 
        //   }else if(rocord.Error){
        //   return <span style={{color:'#f5222d'}} >{text}</span>
        //   }else{
        //     return <span style={{color:'#faad14'}} >{text}</span>
        //   }
        // }
      },
      {
        title: <span>企业经度</span>,
        dataIndex: 'Longitude',
        key: 'Longitude',
        align: 'center',
        width:100,
        // render:(text,rocord)=>{
        //   if(!rocord.warning&&!rocord.Error){
        //     return text 
        //   }else if(rocord.Error){
        //   return <span style={{color:'#f5222d'}} >{text}</span>
        //   }else{
        //     return <span style={{color:'#faad14'}} >{text}</span>
        //   }
        // }
      },
      {
        title: <span>企业纬度</span>,
        dataIndex: 'EntLatitude',
        key: 'Latitude',
        align: 'center',
        width:100,
        // render:(text,rocord)=>{
        //   if(!rocord.warning&&!rocord.Error){
        //     return text 
        //   }else if(rocord.Error){
        //   return <span style={{color:'#f5222d'}} >{text}</span>
        //   }else{
        //     return <span style={{color:'#faad14'}} >{text}</span>
        //   }
        // }
      },
      {
        title: <span>企业地址</span>,
        dataIndex: 'EntAddress',
        key: 'EntAddress',
        align: 'center',
        // render:(text,rocord)=>{
        //   if(!rocord.warning&&!rocord.Error){
        //     return text 
        //   }else if(rocord.Error){
        //   return <span style={{color:'#f5222d'}} >{text}</span>
        //   }else{
        //     return <span style={{color:'#faad14'}} >{text}</span>
        //   }
        // }
      },
      {
        title: <span>关注程度</span>,
        dataIndex: 'AttentionCode',
        key: 'AttentionCode',
        align: 'center',
        width:80,
        // render:(text,rocord)=>{
        //   if(!rocord.warning&&!rocord.Error){
        //     return text 
        //   }else if(rocord.Error){
        //   return <span style={{color:'#f5222d'}} >{text}</span>
        //   }else{
        //     return <span style={{color:'#faad14'}} >{text}</span>
        //   }
        // }
      },
      {
        title: <span>污染源规模</span>,
        dataIndex: 'PSScaleCode',
        key: 'PSScaleCode',
        align: 'center',
        width:100,
        // render:(text,rocord)=>{
        //   if(!rocord.warning&&!rocord.Error){
        //     return text 
        //   }else if(rocord.Error){
        //   return <span style={{color:'#f5222d'}} >{text}</span>
        //   }else{
        //     return <span style={{color:'#faad14'}} >{text}</span>
        //   }
        // }
      },
      {
        title: <span>环保负责人</span>,
        dataIndex: 'EnvironmentPrincipal',
        key: 'EnvironmentPrincipal',
        align: 'center',
        width:100,
        // render:(text,rocord)=>{
        //   if(!rocord.warning&&!rocord.Error){
        //     return text 
        //   }else if(rocord.Error){
        //   return <span style={{color:'#f5222d'}} >{text}</span>
        //   }else{
        //     return <span style={{color:'#faad14'}} >{text}</span>
        //   }
        // }
      },
      {
        title: <span>移动电话</span>,
        dataIndex: 'MobilePhone',
        key: 'MobilePhone',
        align: 'center',
        // render:(text,rocord)=>{
        //   if(!rocord.warning&&!rocord.Error){
        //     return text 
        //   }else if(rocord.Error){
        //   return <span style={{color:'#f5222d'}} >{text}</span>
        //   }else{
        //     return <span style={{color:'#faad14'}} >{text}</span>
        //   }
        // }
      },
      {
        title: <span>监测点名称</span>,
        dataIndex: 'PointName',
        key: 'PointName',
        align: 'center',
        width:100,
        // render:(text,rocord)=>{
        //   if(!rocord.warning&&!rocord.Error){
        //     return text 
        //   }else if(rocord.Error){
        //   return <span style={{color:'#f5222d'}} >{text}</span>
        //   }else{
        //     return <span style={{color:'#faad14'}} >{text}</span>
        //   }
        // }
      },
      {
        title: <span>监测点编号(MN)</span>,
        dataIndex: 'DGIMN',
        key: 'DGIMN',
        align: 'center',
        // render:(text,rocord)=>{
        //   if(!rocord.warning&&!rocord.Error){
        //     return text 
        //   }else if(rocord.Error){
        //   return <span style={{color:'#f5222d'}} >{text}</span>
        //   }else{
        //     return <span style={{color:'#faad14'}} >{text}</span>
        //   }
        // }
      },
      {
        title: <span>监测点类型</span>,
        dataIndex: 'OutputType',
        key: 'OutputType',
        align: 'center',
        width:90,
        // render:(text,rocord)=>{
        //   if(!rocord.warning&&!rocord.Error){
        //     return text 
        //   }else if(rocord.Error){
        //   return <span style={{color:'#f5222d'}} >{text}</span>
        //   }else{
        //     return <span style={{color:'#faad14'}} >{text}</span>
        //   }
        // }
      },
      {
        title: <span>监测点经度</span>,
        dataIndex: 'Longitude',
        key: 'Longitude',
        align: 'center',
        width:100,
        // render:(text,rocord)=>{
        //   if(!rocord.warning&&!rocord.Error){
        //     return text 
        //   }else if(rocord.Error){
        //   return <span style={{color:'#f5222d'}} >{text}</span>
        //   }else{
        //     return <span style={{color:'#faad14'}} >{text}</span>
        //   }
        // }
      },
      {
        title: <span>监测点维度</span>,
        dataIndex: 'Latitude',
        key: 'Latitude',
        align: 'center',
        width:100,
        // render:(text,rocord)=>{
        //   if(!rocord.warning&&!rocord.Error){
        //     return text 
        //   }else if(rocord.Error){
        //   return <span style={{color:'#f5222d'}} >{text}</span>
        //   }else{
        //     return <span style={{color:'#faad14'}} >{text}</span>
        //   }
        // }
      },
      {
        title: <span>点位负责人</span>,
        dataIndex: 'UserName',
        key: 'UserName',
        align: 'center',
        // render:(text,rocord)=>{
        //   if(!rocord.warning&&!rocord.Error){
        //     return text 
        //   }else if(rocord.Error){
        //   return <span style={{color:'#f5222d'}} >{text}</span>
        //   }else{
        //     return <span style={{color:'#faad14'}} >{text}</span>
        //   }
        // }
      },
      {
        title: <span>工号</span>,
        dataIndex: 'UserNum',
        key: 'UserNum',
        align: 'center',
        width:70,
        // render:(text,rocord)=>{
        //   if(!rocord.warning&&!rocord.Error){
        //     return text 
        //   }else if(rocord.Error){
        //   return <span style={{color:'#f5222d'}} >{text}</span>
        //   }else{
        //     return <span style={{color:'#faad14'}} >{text}</span>
        //   }
        // }
      },
      {
        title: <span>监测因子</span>,
        dataIndex: 'PollutantList',
        key: 'PollutantList',
        align: 'center',
        // render:(text,rocord)=>{
        //   if(!rocord.warning&&!rocord.Error){
        //     return text 
        //   }else if(rocord.Error){
        //   return <span style={{color:'#f5222d'}} >{text}</span>
        //   }else{
        //     return <span style={{color:'#faad14'}} >{text}</span>
        //   }
        // }
      },
      {
        title: <span>数据警告提示</span>,
        dataIndex: 'warning',
        key: 'warning',
        align: 'center',
        fixed: 'right',
        width:450,
        render:(text,rocord)=>{
        //   if(!rocord.warning&&!rocord.Error){
        //     return text 
        //   }else if(rocord.Error){
        //   return <span style={{color:'#f5222d'}} >{text}</span>
        //   }else{ return <span style={{color:'#faad14'}} >{text
        //    }</span>
        //   }
        return <span  style={{textAlign:'left',display:'inline-block'}}  >{text}</span>
        }
        
      },
      {
        title: <span>数据错误提示</span>,
        dataIndex: 'Error',
        key: 'Error',
        align: 'center',
        width:450,
        fixed: 'right',
        render:(text,rocord)=>{
          return <span  style={{color:'#f5222d',textAlign:'left',display:'inline-block'}} >{text}</span>
        }
      },
    ];
  }

  componentDidMount() {
    this.initData();
  }
  initData = () => {
    const { dispatch} = this.props;

    let  gasObj =  [
         {
          title: <span>CEMS监测原理</span>,dataIndex: 'Col3', key: 'Col3',align: 'center',
          // render:(text,rocord)=>{
          //   if(!rocord.warning&&!rocord.Error){
          //     return text 
          //   }else if(rocord.Error){
          //   return <span style={{color:'#f5222d'}} >{text}</span>
          //   }else{
          //     return <span style={{color:'#faad14'}} >{text}</span>
          //   }
          // }
        },
        {
         title: <span>排口类型</span>,dataIndex: 'PSScaleCode', key: 'PSScaleCode',align: 'center',
         // render:(text,rocord)=>{
        //   if(!rocord.warning&&!rocord.Error){
        //     return text 
        //   }else if(rocord.Error){
        //   return <span style={{color:'#f5222d'}} >{text}</span>
        //   }else{
        //     return <span style={{color:'#faad14'}} >{text}</span>
        //   }
        // }
        },
    ]

    var arr = new Array(...this.columns)
    
     this.columns2 = arr;
     this.columns2.splice(17,0,...gasObj);
  };
  updateQueryState = payload => {
    const { queryPar, dispatch } = this.props;

    dispatch({
      type: pageUrl.updateState,
      payload: { queryPar: { ...queryPar, ...payload } },
    });
  };





  
  
  //保存入库
  saveClick=()=>{
    const { dispatch } = this.props;
    const { tableDatas1,tableDatas2 } = this.state;
    console.log()
    dispatch({
      type: pageUrl.insertImportEnt,
      payload: {ImportEntList:[...tableDatas1,...tableDatas2]},
    });
  }
  importChange=(info)=>{


    if (info.file.status === 'uploading') {
      this.setState({ importLoading:true,saveDisabled:true })
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name}上传成功`);

      let data = info.file.response.Datas;
      this.setState({ 
         importLoading:false,
         tableDatas1:data.List1,
         tableDatas2:data.List2,
         errorText:data.MessErr
        })
       let list = [...data.List1,...data.List2];

     let  flag = true;
       if(list.length>0){
          list.map(item=>{
            if(item.Error){
             this.setState({
              saveDisabled:false
             })
             return 
            }
         })
       }
       console.log(flag                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                )
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name}上传失败`);
      this.setState({ importLoading:false,saveDisabled:true })
    }
  }
  render() {
    const { tableDatas, saveLoading} = this.props;
    const props = {
        name: 'file',
        action: '/api/rest/PollutantSourceApi/BaseDataApi/ImportEnt',
        headers: {
          // authorization: 'authorization-text',
        }
      };
    return (
        <BreadcrumbWrapper>
      <Card
        bordered={false}
        className={styles.entImport}
        title={
            <Form layout="inline">
              <Form.Item>
              <a style={{color:'rgba(0, 0, 0, 0.65)'}} href='/upload/公司运维基础数据模板.xlsm' download="模板文件"> 
                <Button
                  icon={<DownloadOutlined />}
                >
                 模板下载
                </Button>
                </a>
              </Form.Item>
              <Form.Item>
              <Upload {...props} onChange={this.importChange}>
                <Button
                  icon={<ImportOutlined  />}
                  style={{ margin: '0 5px' }}
                  loading={this.state.importLoading}
                >
                  导入
                </Button>
                </Upload>
                </Form.Item>
                <Form.Item>
                <Button
                  onClick={this.saveClick}
                  loading={saveLoading}
                  type='primary'
                  disabled={this.state.saveDisabled}
                >
                  保存入库
                </Button>
              </Form.Item>
              <Form.Item>
            {/* <div
                  style={{
                    width: 20,
                    height: 9,
                    backgroundColor: '#faad14',
                    display: 'inline-block',
                    borderRadius: '20%',
                    cursor: 'pointer',
                    marginRight: 3,
                  }}
                />{' '}
                <span style={{ cursor: 'pointer', fontSize: 14, color: 'rgba(0, 0, 0, 0.65)' }}>
                  {' '}
                  警告
                </span>
                <div
                  style={{
                    width: 20,
                    height: 9,
                    backgroundColor: '#f5222d',
                    display: 'inline-block',
                    borderRadius: '20%',
                    cursor: 'pointer',
                    marginLeft: 10,
                    marginRight: 3,
                  }}
                />
                <span style={{ cursor: 'pointer', fontSize: 14, color: 'rgba(0, 0, 0, 0.65)' }}>
                 错误
                </span> */}
                <span style={{color:'#f5222d',fontSize:14,paddingLeft:10}}>
                 注：警告可以保存入库，错误不可以保存入库
                   <span>{this.state.errorText? '，'+this.state.errorText : ''}</span>
                  </span>

                </Form.Item>
            </Form>
        }
      >
      
        <Tabs defaultActiveKey="2">
          <TabPane tab="废气" key="2">
          <SdlTable
            rowKey={(record, index) => `complete${index}`}
            loading={this.state.importLoading}
            columns={this.columns}
            dataSource={this.state.tableDatas2}
            scroll={{y:'calc(100vh - 380px)'}}
            // pagination={{
            //     pageSize: 10, 
            // }}
          />
            </TabPane>
           <TabPane tab="废水" key="1">
           <SdlTable
            rowKey={(record, index) => `complete${index}`}
            loading={this.state.importLoading}
            columns={this.columns2}
            dataSource={this.state.tableDatas1}
            scroll={{y:'calc(100vh - 380px)'}}
          />
         </TabPane>
  
  </Tabs>
       {/* <>
        <Row align='middle' style={{marginBottom:8,paddingTop:20}}>
          <div style={{width:3,height:16,background:'#1890FF'}}></div>
           <span style={{paddingLeft:5}}>废气</span>
          </Row>
          <SdlTable
            rowKey={(record, index) => `complete${index}`}
            loading={this.state.importLoading}
            columns={this.columns}
            dataSource={this.state.tableDatas2}
            pagination={false}
            scroll={{y: 'calc(50% - 45px)'}}
          />
        <Row align='middle' style={{marginBottom:8,paddingTop:20}}>
          <div style={{width:3,height:16,background:'#1890FF'}}></div>
           <span style={{paddingLeft:5}}>废水</span>
          </Row>
          <SdlTable
            rowKey={(record, index) => `complete${index}`}
            loading={this.state.importLoading}
            columns={this.columns2}
            dataSource={this.state.tableDatas1}
            pagination={false}
          />
        </> */}
      </Card>
      </BreadcrumbWrapper>
    );
  }
}
