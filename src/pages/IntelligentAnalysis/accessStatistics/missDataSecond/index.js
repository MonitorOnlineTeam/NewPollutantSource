/**
 * 功  能：缺失数据报警响应
 * 创建人：贾安波
 * 创建时间：2020/10
 */
import React, { Component } from 'react';
import { ExportOutlined, RollbackOutlined } from '@ant-design/icons';
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
  Radio,
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
import EmergencyDetailInfo from '../../../../pages/EmergencyTodoList/TaskDetailModel';
const { Search } = Input;
const { MonthPicker } = DatePicker;
const { Option } = Select;
const { RangePicker } = DatePicker;
const monthFormat = 'YYYY-MM';

const pageUrl = {
  updateState: 'regionalAccountStatistics/updateState',
  getData: 'regionalAccountStatistics/getDefectPointDetail',
};
@connect(({ loading, regionalAccountStatistics,autoForm }) => ({
  priseList: regionalAccountStatistics.priseList,
  exloading:regionalAccountStatistics.exloading,
  loading: loading.effects[pageUrl.getData],
  total: regionalAccountStatistics.total,
  tableDatas: regionalAccountStatistics.tableDatil,
  queryPar: regionalAccountStatistics.queryPar,
  regionList: autoForm.regionList,
  attentionList:regionalAccountStatistics.attentionList,
  type:regionalAccountStatistics.type
}))
@Form.create()

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible:false,
      DGIMN:'',
      TaskID:''
    };
    this.columns = [
      {
        title: <span>行政区</span>,
        dataIndex: 'regionName',
        key: 'regionName',
        align: 'center',
        render: (text, record) => {
          return <span>{text}</span>;
        },
      },
      {
        title: <span>{ JSON.parse(this.props.location.query.queryPar).EntType==='1'? '企业名称': '大气站名称'}</span>,
        dataIndex: 'entName',
        key: 'entName',
        align: 'center',
        width:250,
        render: (text, record) => {     
          return  <div style={{textAlign:'left',width:'100%'}}>{text}</div>
       },
      },
      {
        title: <span>监测点名称</span>,
        dataIndex: 'pointName',
        key: 'pointName',
        align: 'center',
        render: (text, record) => {     
          return  <div style={{textAlign:'left',width:'100%'}}>{text}</div>
       },
      },
      {
        title: <span>{JSON.parse(this.props.location.query.queryPar).EntType==='1'? '首次缺失时间' : '首次缺失时间' }</span>,
        dataIndex: 'firstTime',
        key: 'firstTime',
        // width: '10%',
        align: 'center',
        defaultSortOrder: 'descend',
        sorter: (a, b) => Number(moment( new Date(a.firstTime)).valueOf()) -   Number(moment( new Date(b.firstTime)).valueOf()),
      //   render: (text, record) => {     
      //     return  <div>{ moment( new Date(text)).valueOf()}</div>
      //  },
      },
      {
        title: <span>报警信息</span>,
        dataIndex: 'message',
        key: 'message',
        align: 'center',
        width:250,
        render: (text, record) => {     
          return  <div style={{textAlign:'left',width:'100%'}}>{text}</div>
       },
      },
      {
        title: <span>响应状态</span>,
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        render:(text,record)=>{return text==0?'待响应':'已响应'}
      },
      {
        title: <span>响应人</span>,
        dataIndex: 'operationName',
        key: 'operationName',
        align: 'center',
        render: (text, record) => {     
          return  record.status==0? "-":text
       },
      },
      {
        title: <span>响应时间</span>,
        dataIndex: 'xiangyingTime',
        key: 'xiangyingTime',
        align: 'center',
      
      },
      {
        title: <span>处理详情</span>,
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        render:(text,record)=>{
          return !text?
           '': <a href='javascript:;' onClick={this.detail.bind(this,record)}>详情</a>
          }        
        // render:(text,record)=>{
        //   return text==0?
        //    '': <Link to={{  pathname: `/operations/taskRecord/details/${record.TaskID}/${record.DGIMN}` }} > 详情 </Link>
        //   }
      },
    ];
  }

  detail=(record)=>{
debugger;
     this.setState({DGIMN:record.DGIMN,TaskID:record.TaskID},()=>{

      setTimeout(()=>{
        this.setState({visible:true})

      })
     })
  }
  componentDidMount() {
    this.initData();
  }
  initData = () => {
    const { dispatch, location,Atmosphere,type,location:{query:{regionCode}} } = this.props;
   
    // type === 'ent'? this.columns[1].title = '企业名称' :  this.columns[1].title = '大气站名称'
   

    this.updateQueryState({
      // BeginTime: moment()
      // .subtract(1, 'day')
      // .format('YYYY-MM-DD 00:00:00'),
      // endTime: moment().format('YYYY-MM-DD 23:59:59'),
      // AttentionCode: '',
      // EntCode: '',
      // RegionCode: '',
      // PollutantType:'',
      // DataType:'HourData',
      // EntType:'',
      RegionCode:regionCode,
      Status:'',
     });
     
    //  dispatch({  type: 'autoForm/getRegions',  payload: {  RegionCode: '',  PointMark: '2',  }, });  //获取行政区列表

    //  dispatch({ type: 'regionalAccountStatistics/getEntByRegion', payload: { RegionCode: regionCode },  });//获取企业列表
 
    //  dispatch({ type: 'regionalAccountStatistics/getAttentionDegreeList', payload: { RegionCode: regionCode },  });//获取关注列表
  

    setTimeout(() => {
      this.getTableData();
    });
  };
  updateQueryState = payload => {
    const { queryPar, dispatch } = this.props;

    dispatch({
      type: pageUrl.updateState,
      payload: { queryPar: { ...queryPar, ...payload } },
    });
  };

  getTableData = () => {
    const { dispatch, queryPar } = this.props;
    dispatch({
      type: pageUrl.getData,
      payload: { ...queryPar },
    });
  };



  children = () => { //企业列表
    const { priseList } = this.props;

    const selectList = [];
    if (priseList.length > 0) {
      priseList.map(item => {
        selectList.push(
          <Option key={item.EntCode} value={item.EntCode} title={item.EntName}>
            {item.EntName}
          </Option>,
        );
      });
      return selectList;
    }
  };

  typeChange = value => {
    this.updateQueryState({
      PollutantType: value,
    });
  };

  changeRegion = (value) => { //行政区事件
    
    this.updateQueryState({
      RegionCode: value,
    });
  };
  changeAttent=(value)=>{
    this.updateQueryState({
      AttentionCode: value,
    });
  }
  changeEnt=(value,data)=>{ //企业事件
    this.updateQueryState({
      EntCode: value,
    });
  }
  //创建并获取模板   导出
  template = () => {
    const { dispatch, queryPar } = this.props;
    dispatch({
      type: 'regionalAccountStatistics/exportDefectPointDetail',
      payload: { ...queryPar },
      callback: data => {
         downloadFile(`/upload${data}`);
        },
    });
  };
  //查询事件
  queryClick = () => {
    this.getTableData();
  };


  regchildren=()=>{
    const { regionList } = this.props;
    const selectList = [];
    if (regionList.length > 0) {
      regionList[0].children.map(item => {
        selectList.push(
          <Option key={item.key} value={item.value}>
            {item.title}
          </Option>,
        );
      });
      return selectList;
    }
  }
  attentchildren=()=>{
    const { attentionList } = this.props;
    const selectList = [];
    if (attentionList.length > 0) {
       attentionList.map(item => {
        selectList.push(
          <Option key={item.AttentionCode} value={item.AttentionCode}>
            {item.AttentionName}
          </Option>,
        );
      });
      return selectList;
    }
  }
  
      /** 数据类型切换 */
 _handleDateTypeChange = value => {
   
    if( value === 'HourData'){
      this.updateQueryState({
        DataType: value,
        BeginTime: moment().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
        endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
       
        });
      }else{
        this.updateQueryState({
          DataType: value,
          BeginTime: moment().subtract(7, 'day').format('YYYY-MM-DD HH:mm:ss'),
          endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
          
          });
      }
    }
  dateChange=(date)=>{
      this.updateQueryState({
        BeginTime: date[0].format('YYYY-MM-DD HH:mm:ss'),
        endTime: date[1].format('YYYY-MM-DD HH:mm:ss'),
      });
    }
    dateOk=()=>{ 

   }
  // queryComponents=(type)=>{
  //   const { 
  //      queryPar: {  BeginTime, EndTime, RegionCode,AttentionCode,DataType, },
  //   } = this.props;
  //   return  <><Form.Item label='数据类型'>
  //   <Select
  //         placeholder="数据类型"
  //         onChange={this._handleDateTypeChange}
  //         value={DataType}
  //         style={{ width: 200  }}
  //       >  
  //      <Option key='0' value='HourData'>小时数据</Option>
  //      <Option key='1' value='DayData'> 日数据</Option>

  //       </Select>
  //   </Form.Item>
  //     <Form.Item>
  //       日期查询：
  //           <RangePicker
  //             showTime={{ format: 'HH:mm:ss' }}
  //             format="YYYY-MM-DD HH:mm:ss"
  //             placeholder={['开始时间', '结束时间']}
  //             value={[moment(BeginTime),moment(endTime)]}
  //             onChange={this.dateChange}
  //             onOk={this.dateOk}
  //        />
  //     </Form.Item>
  //     <Form.Item label='行政区'>
  //       <Select
  //         allowClear
  //         placeholder="行政区"
  //         onChange={this.changeRegion}
  //         value={RegionCode ? RegionCode : undefined}
  //         style={{ width: 200  }}
  //       >
  //         {this.regchildren()}
  //       </Select>
  //     </Form.Item>
  //     <Form.Item label='关注程度'>
  //       <Select
  //         placeholder="关注程度"
  //         onChange={this.changeAttent}
  //         value={AttentionCode}
  //         style={{ width: 200  }}
  //       >
  //         <Option value="">全部</Option>
  //         {this.attentchildren()}
  //       </Select>
  //     </Form.Item>
  //     </>
  // }
  reponseChange=(e)=>{
      this.updateQueryState({
        Status: e.target.value,
      });
      setTimeout(()=>{
        this.getTableData();
      })
     
  }
  btnCompents=()=>{
    const { exloading } = this.props;
   return (
     <Form.Item>
      {/* <Button type="primary" onClick={this.queryClick}>
        查询
      </Button> */}
      <Button
        style={{ margin: '0 5px' }}
        icon={<ExportOutlined />}
        onClick={this.template}
        loading={exloading}
      >
        导出
      </Button>
        <Button  onClick={() => { this.props.history.go(-1);  }} >
           <RollbackOutlined />
                  返回
       </Button>
    </Form.Item>
   );
  }
reponseComp = ()=>{
  const {queryPar:{Status} } = this.props;
  return <Form.Item label=''>
        <Radio.Group value={Status} onChange={this.reponseChange}>
          <Radio.Button value="">全部</Radio.Button>
          <Radio.Button value="1">已响应</Radio.Button>
          <Radio.Button value="0">待响应</Radio.Button>
        </Radio.Group>
</Form.Item> 
}

handleTableChange = (pagination, filters, sorter) => {

    this.updateQueryState({
      // transmissionEffectiveRate: 'ascend',
      PageIndex: pagination.current,
      PageSize: pagination.pageSize,
    });
    sessionStorage.setItem("missDataDetailPageIndex",pagination.current)
    sessionStorage.setItem("missDataDetailPageSize",pagination.pageSize)
  // setTimeout(() => {
  //   this.getTableData();
  // });
};
  render() {
    const {
      queryPar: { EntCode,PollutantType,PageSize,PageIndex },
      location,
      type
    } = this.props;
    return (
        <BreadcrumbWrapper title={JSON.parse(location.query.queryPar).EntType==='1'? "缺失数据报警详情(企业)":"缺失数据报警详情(空气站)"}>
        <Card
          bordered={false}
          title={
            <>
              <Form layout="inline">
                
                {this.reponseComp()}
                 {this.btnCompents()}
              {/* {type==='ent'?
              <>
              <Row>
              {this.queryComponents(type)}
              </Row>
                <Row>

               <Form.Item label='企业类型'>
                  <Select
                    placeholder="企业类型"
                    onChange={this.typeChange}
                    value={PollutantType}
                    style={{ width: 200 }}
                  >
                    <Option value="">全部</Option>
                    <Option value="1">废水</Option>
                    <Option value="2">废气</Option>
                  </Select>
                </Form.Item>                  
                <Form.Item label='企业列表'>
                  <Select
                    showSearch
                    optionFilterProp="children"
                    allowClear
                    placeholder="企业列表"
                    onChange={this.changeEnt}
                    value={EntCode ? EntCode : undefined}
                    style={{ width: 350  }}
                  >
                    {this.children()}
                  </Select>
                </Form.Item>

                 {this.reponseComp(type)}
                 {this.btnCompents()}
                </Row>
                </>:
                <>
                <Row>
                {this.queryComponents(type)}

                </Row>
                <Row>

                {this.reponseComp(type)}
                <Form.Item label='大气站列表'>
                <Select
                  showSearch
                  optionFilterProp="children"
                  allowClear
                  placeholder="大气站列表"
                  onChange={this.changeEnt}
                  value={EntCode ? EntCode : undefined}
                  style={{ width: 336  }}
                >
                  {this.children()}
                </Select>
                </Form.Item>
                {this.btnCompents()}

                </Row>
                </>
              } */}
              </Form>
            </>
          }
        >
          <>
            <SdlTable
              rowKey={(record, index) => `complete${index}`}
              loading={this.props.loading}
              columns={this.columns}
              // bordered={false}
              dataSource={this.props.tableDatas}
              onChange={this.handleTableChange}
              pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                // sorter: true,
                // total: this.props.total,
                //defaultPageSize:20,
                pageSize:sessionStorage.getItem("missDataDetailPageSize"),
                current:parseInt(sessionStorage.getItem("missDataDetailPageIndex")),
                // pageSizeOptions: ['10', '20', '30', '40', '50'],
              }}
            />
          </>
        </Card>
        <Modal
          title="任务详情"
          visible={this.state.visible}
          width='100%'
          style={{hegiht:'90%'}}
          footer={null}
          destroyOnClose={true}
          onCancel={()=>{this.setState({visible:false})}}
        >
            <EmergencyDetailInfo DGIMN={this.state.DGIMN}  TaskID={this.state.TaskID}/>
        </Modal>
        </BreadcrumbWrapper>
    );
  }
}
 