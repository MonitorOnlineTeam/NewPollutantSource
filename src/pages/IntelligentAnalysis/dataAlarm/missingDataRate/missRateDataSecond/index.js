/**
 * 功  能：缺失报警响应率详情
 * 创建人：jab
 * 创建时间：2020.10
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
import { downloadFile,interceptTwo } from '@/utils/utils';
import ButtonGroup_ from '@/components/ButtonGroup'

const { Search } = Input;
const { MonthPicker } = DatePicker;
const { Option } = Select;
const { RangePicker } = DatePicker;
const monthFormat = 'YYYY-MM';

const pageUrl = {
  updateState: 'MissingRateData/updateState',
  getData: 'MissingRateData/getDefectPointDetailRate',
};
@connect(({ loading, MissingRateData,autoForm }) => ({
  priseList: MissingRateData.priseList,
  exloading:MissingRateData.exloading,
  loading: loading.effects[pageUrl.getData],
  total: MissingRateData.detailTotal,
  tableDatas: MissingRateData.tableDatil,
  queryPar: MissingRateData.queryPar,
  regionList: autoForm.regionList,
  attentionList:MissingRateData.attentionList,
  type:MissingRateData.type,
}))
@Form.create()
export default class EntTransmissionEfficiency extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pageIndex:1,
      pageSize:20,
    };
    
    this.columns = [
      // {
      //   title: <span>行政区</span>,
      //   dataIndex: 'regionName',
      //   key: 'regionName',
      //   align: 'center',
      //   render: (text, record) => {
      //     return <span>{text}</span>;
      //   },
      // },
      {
        title: '省',
        dataIndex: 'ProvinceName',
        key: 'ProvinceName',
        align: 'center',
      },
      {
        title: '市',
        dataIndex: 'CityName',
        key: 'CityName',
        align: 'center',
      },
      {
        title: <span>{ JSON.parse(this.props.location.query.queryPar).EntType==='1'? '企业名称': '大气站名称'}</span>,
        dataIndex: 'entName',
        key: 'entName',
        align: 'center',
        render: (text, record) => {     
          return  <div style={{textAlign:'left',width:'100%'}}>{text}</div>
       },
      },
      {
        title: <span>监测点名称</span>,
        dataIndex: 'pointName',
        key: 'pointName',
        // width: '10%',
        align: 'center',
        render: (text, record) => {     
          return  <div style={{textAlign:'left',width:'100%'}}>{text}</div>
       },
      },
      {
        title: '运维负责人',
        dataIndex: 'operationUser',
        key: 'operationUser',
        align: 'center',
      },
      {
        title: <span>缺失数据报警次数</span>,
        dataIndex: 'alarmCount',
        key: 'alarmCount',
        // width: '10%',
        align: 'center',
      
      },
      {
        title: <span>已响应报警次数</span>,
        dataIndex: 'xiangyingCount',
        key: 'xiangyingCount',
        align: 'center',
      },
      {
        title: <span>待响应报警次数</span>,
        dataIndex: 'weixiangyingCount',
        key: 'weixiangyingCount',
        align: 'center'
      },
      {
        title: <span>响应率</span>,
        dataIndex: 'xiangyingRate',
        key: 'xiangyingRate',
        align: 'center',
        render:(text,row)=>{
          return <span>{`${interceptTwo(Number(text))}%`}</span>
        }
      }
    ];
  }

  componentDidMount() {
    this.initData();
  }
  initData = () => {
    const { dispatch, location,Atmosphere,
            location:{ query: {regionCode, queryPar:{EntCode,PollutantType }}}, } = this.props;

    this.updateQueryState({
      // beginTime: moment()
      //   .subtract(1, 'day')
      //   .format('YYYY-MM-DD HH:mm:ss'),
      // endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      // AttentionCode: '',
      EntCode: EntCode,
      RegionCode: '',
      RegionCode:regionCode,
      Status:'',
    });
    //  dispatch({  type: 'autoForm/getRegions',  payload: {  RegionCode: '',  PointMark: '2',  }, });  //获取行政区列表

     dispatch({ type: 'MissingRateData/getEntByRegion', payload: { RegionCode: regionCode },  });//获取企业列表
 
     dispatch({ type: 'MissingRateData/getAttentionDegreeList', payload: { RegionCode: regionCode},  });//获取关注列表
  

    setTimeout(() => {
      this.getTableData(this.state.pageIndex,this.state.pageSize);
    });
  };
  updateQueryState = payload => {
    const { queryPar, dispatch } = this.props;

    dispatch({
      type: pageUrl.updateState,
      payload: { queryPar: { ...queryPar, ...payload } },
    });
  };

  getTableData = (pageIndex,pageSize) => {
    const { dispatch, queryPar } = this.props;
    this.setState({pageIndex,pageSize},()=>{
      dispatch({
        type: pageUrl.getData,
        payload: { ...queryPar,PageIndex:pageIndex,PageSize:pageSize,},
      });
    })

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
      type: 'MissingRateData/exportDefectPointDetail',
      payload: { ...queryPar },
      callback: data => {
         downloadFile(`/upload${data}`);
        },
    });
  };
  //查询事件
  queryClick = () => {
    this.getTableData(1,this.state.pageSize);
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
        dataType: value,
        beginTime: moment().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
        endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
       
        });
      }else{
        this.updateQueryState({
          dataType: value,
          beginTime: moment().subtract(7, 'day').format('YYYY-MM-DD HH:mm:ss'),
          endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
          
          });
      }
    }
  dateChange=(date)=>{
      this.updateQueryState({
        beginTime: date[0].format('YYYY-MM-DD HH:mm:ss'),
        endTime: date[1].format('YYYY-MM-DD HH:mm:ss'),
      });
    }
    dateOk=()=>{ 

   }
   reponseChange=(e)=>{
    this.updateQueryState({
      Status: e.target.value,
    });
    setTimeout(()=>{
      this.getTableData();
    })
  }
  // queryComponents=(type)=>{
  //   const { 
  //      queryPar: {  beginTime, endTime, RegionCode,AttentionCode,dataType, },
  //   } = this.props;
  //   return  <><Form.Item label='数据类型'>
  //   <Select
  //         placeholder="数据类型"
  //         onChange={this._handleDateTypeChange}
  //         value={dataType}
  //         style={{ width: type==='ent'? 200 : 150  }}
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
  //             value={[moment(beginTime),moment(endTime)]}
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
  //         style={{ width: type==='ent'? 200 : 150  }}
  //       >
  //         {this.regchildren()}
  //       </Select>
  //     </Form.Item>
  //     <Form.Item label='关注程度'>
  //       <Select
  //         placeholder="关注程度"
  //         onChange={this.changeAttent}
  //         value={AttentionCode}
  //         style={{ width: type==='ent'? 200 : 150  }}
  //       >
  //         <Option value="">全部</Option>
  //         {this.attentchildren()}
  //       </Select>
  //     </Form.Item>
  //     </>
  // }
    /** 分页 */

    onChange = (pageIndex, pageSize) => {
      this.getTableData(pageIndex,pageSize);
    }
  btnCompents=()=>{
    const { exloading } = this.props;
   return (
     <Form.Item>
       <Button type="primary" onClick={this.queryClick}>
        查询
      </Button> 
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
  reponseComp = (type)=>{
    const { queryPar:{ Status } } = this.props;
    return <Form.Item label=''>
          <Radio.Group value={Status} onChange={this.reponseChange}>
            <Radio.Button value="">全部</Radio.Button>
            <Radio.Button value="1">已响应</Radio.Button>
            <Radio.Button value="0">待响应</Radio.Button>
          </Radio.Group>
  </Form.Item> 
  }
  render() {
    const {
      queryPar:{EntCode}
    } = this.props;
  //  debugger;
    
    return (
        <BreadcrumbWrapper title={this.props.location.query.queryPar? JSON.parse(this.props.location.query.queryPar).EntType==='1'? "缺失数据报警响应率详情(企业)":"缺失数据报警响应率详情(空气站)":""}>
        <Card
          bordered={false}
          title={
            <>
              <Form layout="inline">
                
                {/* {this.reponseComp()} */}
                <Form.Item label=''>
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
              pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                sorter: true,
                total: this.props.total,
                pageSize: this.state.pageSize,
                current: this.state.pageIndex,
                onChange: this.onChange,
              }}
            />
          </>
        </Card>
        </BreadcrumbWrapper>
    );
  }
}
