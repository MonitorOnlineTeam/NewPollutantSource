/**
 * 功  能：运维人员管理
 * 创建人：jab
 * 创建时间：2021.05.08
 */
import React, { Component,Fragment } from 'react';
import { ExportOutlined } from '@ant-design/icons';
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
  Tooltip,
  Popconfirm,
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import Link from 'umi/link';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import SdlTable from '@/components/SdlTable';
import DatePickerTool from '@/components/RangePicker/DatePickerTool';
import { router } from 'umi';
import styles from '../operationPerson/style.less';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import { downloadFile } from '@/utils/utils';
import ButtonGroup_ from '@/components/ButtonGroup'
import { getThirdTableDataSource } from '@/services/entWorkOrderStatistics';
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable';
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper';
const { Search } = Input;
const { MonthPicker } = DatePicker;
const { Option } = Select;
const { RangePicker } = DatePicker;
const monthFormat = 'YYYY-MM';

const pageUrl = {
  updateState: 'operationPerson/updateState',
  getData: 'operationPerson/getDefectModel',
};
@connect(({ loading, operationPerson,autoForm,common}) => ({
  priseList: operationPerson.priseList,
  exloading:operationPerson.exloading,
  loading: loading.effects[pageUrl.getData],
  total: operationPerson.total,
  tableDatas: operationPerson.tableDatas,
  queryPar: operationPerson.queryPar,
  regionList: autoForm.regionList,
  attentionList:operationPerson.attentionList,
  atmoStationList:common.atmoStationList
}))
@Form.create()
export default class EntTransmissionEfficiency extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible:false
    };
    
    this.columns = [
      {
        title: <span>运维单位</span>,
        dataIndex: 'regionName',
        key: 'regionName',
        align: 'center',
      //   render: (text, record) => {     
      //     return  <div style={{textAlign:'left',width:'100%'}}>{text}</div>
      //  },
      },
      {
        title: <span>姓名</span>,
        dataIndex: 'entName',
        key: 'entName',
        align: 'center',
        render: (text, record) => {     
          return  <div style={{textAlign:'left',width:'100%'}}>{text}</div>
       },
      },
      {
        title: <span>性别</span>,
        dataIndex: 'pointName',
        key: 'pointName',
        // width: '10%',
        align: 'center',
        render: (text, record) => {     
          return  <div style={{textAlign:'left',width:'100%'}}>{text}</div>
       },
      },
      {
        title: <span>手机号</span>,
        dataIndex: 'firstAlarmTime',
        key: 'firstAlarmTime',
        align: 'center',
        render:(text,row)=>{
          return `${row.firstAlarmTime}~${row.alarmTime}`
        }
      },
      {
        title: <span>身份证号</span>,
        dataIndex: 'defectCount',
        key: 'defectCount',
        align: 'center',
      },
      {
        title: <span>运维工证书编号(气)</span>,
        dataIndex: 'defectCount',
        key: 'defectCount',
        align: 'center',
      },
      {
        title: <span>运维工证书编号(水)</span>,
        dataIndex: 'defectCount',
        key: 'defectCount',
        align: 'center',
      },
      {
        title: "操作",
        align: "center",
        render: (text, record) => {
          return (
            <div>
               <a href="#" onClick={this.see}>查看</a>
                <a style={{padding:'0 5px'}} onClick={this.edit}>编辑</a>
                <Popconfirm
                  title="确认是否删除?"
                  onConfirm={() => {
                    this.del(record);
                  }}
                  okText="是"
                  cancelText="否">
                  <a href="#">删除</a>
                </Popconfirm>
            </div>
          )
        }
      }
    ];
  }

  componentDidMount() {
    this.initData();
  }
  initData = () => {
    const { dispatch, location,Atmosphere } = this.props;

    this.updateQueryState({
      beginTime: moment()
        .subtract(1, 'day')
        .format('YYYY-MM-DD 00:00:00'),
      endTime: moment().format('YYYY-MM-DD 23:59:59'),
      AttentionCode: '',
      EntCode: '',
      RegionCode: '',
      Atmosphere:Atmosphere,
      dataType:'HourData',
      PageSize:20,
      PageIndex:1,
      OperationPersonnel:'',
    });
    // this.child.onDataValueChange([moment().subtract(1, 'month').startOf('day'),moment()])

     dispatch({  type: 'autoForm/getRegions',  payload: {  RegionCode: '',  PointMark: '2',  }, });  //获取行政区列表

      //获取企业列表 or  大气站列表

      Atmosphere? dispatch({ type: 'common/getStationByRegion', payload: { RegionCode: '' },  }) : dispatch({ type: 'operationPerson/getEntByRegion', payload: { RegionCode: '' },  });  
 
     dispatch({ type: 'operationPerson/getAttentionDegreeList', payload: { RegionCode: '' },  });//获取关注列表
  

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
      callback:(dataType)=>{
        dataType==='HourData'? this.columns[4].title='缺失小时数' : this.columns[4].title='缺失日数';
      }
    });
  };



  children = () => { //企业列表 or 大气站列表
    const { priseList,atmoStationList,Atmosphere } = this.props;

    const selectList = [];
    if(!Atmosphere){
     if (priseList.length > 0) {
      priseList.map(item => {
        selectList.push(
          <Option key={item.EntCode} value={item.EntCode} title={item.EntName}>
            {item.EntName}
          </Option>,
        );
      }); 
    } 
   }else{
    if(atmoStationList.length > 0){
      atmoStationList.map(item => {
        selectList.push(
          <Option key={item.StationCode} value={item.StationCode} title={item.StationName}>
            {item.StationName}
          </Option>,
        );
      }); 
     }
  }

  return selectList;
  };

  typeChange = value => {
    this.updateQueryState({
      PollutantType: value,
    });
  };
  changeOperation = value => {
    this.updateQueryState({
      OperationPersonnel: value,
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
      type: 'operationPerson/exportGetAlarmDataList',
      payload: { ...queryPar },
      callback: data => {
         downloadFile(`/upload${data}`);
        },
    });
  };
  //查询事件
  queryClick = () => {

    const {queryPar: {dataType }, } = this.props;
   

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
  onRef1 = (ref) => {
    this.child = ref;
  }
      /** 数据类型切换 */
 _handleDateTypeChange = value => {
   this.child.onDataTypeChange(value)
    // if( value === 'HourData'){
    //   this.updateQueryState({
    //     dataType: value,
    //     beginTime: moment().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
    //     endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
       
    //     });
    //   }else{
    //     this.updateQueryState({
    //       dataType: value,
    //       beginTime: moment().subtract(7, 'day').format('YYYY-MM-DD HH:mm:ss'),
    //       endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
          
    //       });
    //   }
    }
  dateChange=(date,dataType)=>{
    
      this.updateQueryState({
        dataType:dataType,
        beginTime: date[0].format('YYYY-MM-DD HH:mm:ss'),
        endTime: date[1].format('YYYY-MM-DD HH:mm:ss'),
      });
    }
   btnComponents=()=>{
    const { exloading } = this.props
     return (
       <Form.Item>
       <Button style={{ marginLeft: '6px' }} type="primary" onClick={this.queryClick}>
         查询
       </Button>
       <Button
         style={{ margin: '0 5px' }}
         onClick={this.template}
       >
         添加
       </Button>
     </Form.Item>
     );
   }
   onChange = (PageIndex, PageSize) => {
    this.updateQueryState({
      PageIndex:PageIndex,
      PageSize: PageSize,
    });
    setTimeout(()=>{
      this.queryClick();
    })
   }

   onShowSizeChange= (PageIndex, PageSize) => {
    this.updateQueryState({
      PageIndex:PageIndex,
      PageSize: PageSize,
    });
    setTimeout(()=>{
      this.queryClick();
    })
   }
   see=()=>{

   }

   edit=()=>{  //编辑
    this.setState({
      visible:true
    })
   }
   del=()=>{ //删除

   }

   operationUnit=()=>{ //运维单位

   } 
   operationName=()=>{ //姓名

   }
   operationBook=()=>{

   }

   operationBookOverdue=()=>{

   }
   onFinish=()=>{

   }
  render() {
    const {
      Atmosphere,
      exloading,
      queryPar: {  beginTime, endTime,EntCode, RegionCode,AttentionCode,dataType,PollutantType,PageSize,PageIndex,OperationPersonnel },
      // match: { params: { configId } },
    } = this.props;


    const BtnComponents = this.btnComponents;
    return (
        <Card
          bordered={false}
          title={
            <>
              <Form layout="inline">
            
              <Row>
              <Form.Item label=''>
              <Input
                    placeholder="请输入运维单位"
                    onChange={this.operationUnit}
                    style={{ width: 200}}
                 /> 
              </Form.Item>
              <Form.Item label=''>
              <Input
                    placeholder="请输入姓名"
                    onChange={this.operationName}
                    style={{ width: 100}}
                 /> 
              </Form.Item>
              <Form.Item label=''>
              <Select
                    placeholder="是否有运维工证书"
                    onChange={this.operationBook}
                    value={dataType}
                    allowClear
                  >  
                 <Option key='0' value='HourData'>有运维工证书(气)</Option>
                 <Option key='1' value='DayData'> 无运维工证书(气)</Option>
                 <Option key='0' value='HourData'>有运维工证书(水)</Option>
                 <Option key='1' value='DayData'> 无运维工证书(水)</Option>
                  </Select>
              </Form.Item>
              <Form.Item label=''>
              <Select
                    placeholder="证书是否过期"
                    onChange={this.operationBookOverdue}
                    value={dataType}
                    allowClear
                  >  
                 <Option key='0' value='HourData'>证书已过期</Option>
                 <Option key='1' value='DayData'> 证书未过期</Option>
                  </Select>
              </Form.Item>
                <BtnComponents />
                </Row>
                
              </Form>
            </>
          }
        >
          <>
            {/* <SdlTable
              rowKey={(record, index) => `complete${index}`}
              loading={this.props.loading}
              columns={this.columns}
              dataSource={this.props.tableDatas}
              pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                total: this.props.total,
                pageSize: PageSize,
                current: PageIndex,
                onChange: this.onChange,
                onShowSizeChange:this.onShowSizeChange,
              }}
            /> */}
                    <SearchWrapper
                        // onSubmitForm={form => this.loadReportList(form)}
                        // configId={configId}
                    ></SearchWrapper>
                    <AutoFormTable
                        sort={true}
                        onRef={this.onRef1}
                        style={{ marginTop: 10 }}
                        // configId={configId}
                        appendHandleRows={row => <Fragment>

                            <a onClick={() => { this.edit(row);  }}>编辑 </a>

                        </Fragment>}
                        parentcode="platformconfig/monitortarget"
                        {...this.props}
                    >
                    </AutoFormTable>
       <Modal
        title="Title"
        visible={this.state.visible}
        onOk={this.handleOk}
        footer={null}
        // confirmLoading={confirmLoading}
        onCancel={()=>{this.setState({visible:false})}}
        className={styles.operationModal}
      >
        <Form
      name="basic"
      onFinish={this.onFinish}
    >
      <Row>
        <Col span={12}>
    <Form.Item
        label="运维单位"
        name="username"
        rules={[
          {
            required: true,
            message: '请输入运维单位!',
          },
        ]}
      >
      <Select placeholder="请输入运维单位">
          <Option value="china">China</Option>
          <Option value="usa">U.S.A</Option>
        </Select>
      </Form.Item>
      </Col>
      <Col span={12}>
      <Form.Item
        label="姓名"
        name="password"
        rules={[
          {
            required: true,
            message: '请输入姓名!',
          },
        ]}
      >
        <Input/>
      </Form.Item>
      </Col>
      </Row>

      <Row> 
    <Form.Item
        label="运维证书相关信息(气)"
        name="username"
        rules={[
          {
            required: true,
            message: 'Please input your username!',
          },
        ]}
      >
        <Input/>
      </Form.Item>
      </Row>
      <Form.Item style={{textAlign:'right'}}>
        <Button type="primary" htmlType="submit">
          提交
        </Button>
      </Form.Item>
    </Form>
      </Modal>
          </>
        </Card>
    );
  }
}
