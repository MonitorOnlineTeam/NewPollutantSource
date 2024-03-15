/**
 * 功  能：超标核实率
 * 创建人：张赟
 * 创建时间：2020.10.17
 */
import React, { Component } from 'react';
import { ExportOutlined,RollbackOutlined } from '@ant-design/icons';
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
  Checkbox,
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
import config from '@/config'
import { downloadFile } from '@/utils/utils';
import ButtonGroup_ from '@/components/ButtonGroup';
import EntAtmoList from '@/components/EntAtmoList';
import VerifyDetailsPop from '@/pages/dataSearch/exceedDataAlarmRecord/VerifyDetailsPop';
import { uploadPrefix } from '@/config'

const { Search } = Input;
const { MonthPicker } = DatePicker;
const { Option } = Select;
const { RangePicker } = DatePicker;
const monthFormat = 'YYYY-MM';

const pageUrl = {
  updateState: 'overVerifyRate/updateState',
  getData: 'overVerifyRate/getDefectPointDetail',
  GetOverToExamineOperation:'exceedDataAlarmModel/GetOverToExamineOperation',
  GetAlarmVerifyDetail: 'exceedDataAlarmModel/GetAlarmVerifyDetail',
  ExportAlarmVerifyDetail:'exceedDataAlarmModel/ExportAlarmVerifyDetail',
};
@connect(({ loading, overVerifyRate, autoForm, common,exceedDataAlarmModel}) => ({
  priseList: overVerifyRate.priseList,
  loading: loading.effects[pageUrl.getData],
  exloading: overVerifyRate.exloading,
  overVerifyRateForm: overVerifyRate.overVerifyRateForm,
  divisorList: overVerifyRate.divisorList,
  tableDatil: overVerifyRate.tableDatil,
  tableDatilTotal:overVerifyRate.tableDatilTotal,
  alarmNumLoadingDetail:loading.effects['exceedDataAlarmModel/GetAlarmVerifyDetail'],
  alarmDealTypeList:exceedDataAlarmModel.AlarmDealTypeList,
  managementDetail:exceedDataAlarmModel.ManagementDetail,
  alarmVerifyQueryPar:exceedDataAlarmModel.alarmVerifyQueryPar,
  alarmVerifyDetailLoaing:loading.effects[pageUrl.GetAlarmVerifyDetail],
  exportAlarmVerifyDetailLoaing:loading.effects[pageUrl.ExportAlarmVerifyDetail],
}))
export default class PointVerifyLst extends Component {
  constructor(props) {
    super(props);

    this.state = {
      checkedValues: [],
      columns: [],
      pageIndex:1,
      pageSize:20,
      alarmNumVisible: false,
      alarmNumModalTitle: '',
      PollutantCode:'',
      dealType:'2',
      alarmDealTypeListCode:[],
      enterpriseValue:'',
      regionCode:'',
      columns2 :[
        // {
        //     title: "行政区",
        //     width: 100,
        //     align: 'center',
        //     fixed: 'left',
        //     dataIndex: 'regionName',
        //     key: 'regionName',
        // },
        {
          title: '省',
          dataIndex: 'ProvinceName',
          key: 'ProvinceName',
          width: 100,
          align: 'center',
          fixed: 'left',
        },
        {
          title: '市',
          dataIndex: 'CityName',
          key: 'CityName',
          width: 100,
          align: 'center',
          fixed: 'left',
        },
        {
            title: "企业名称",
            width: 100,
            align: 'left',
            fixed: 'left',
            dataIndex: 'entName',
            key: 'entName',
        },
        {
            title: "监测点名称",
            width: 100,
            align: 'left',
            fixed: 'left',
            dataIndex: 'pointName',
            key: 'pointName',
        },
        {
            title: "数据类型",
            width: 100,
            align: 'center',
            dataIndex: 'dataType',
            key: 'dataType',
        },
        {
            title: "首次报警时间",
            width: 100,
            align: 'center',
            dataIndex: 'firstTime',
            key: 'firstTime',
            defaultSortOrder: 'descend',
            sorter: (a, b) => moment(a.firstTime).valueOf() - moment(b.firstTime).valueOf()
        },
        {
            title: "报警因子",
            width: 90,
            align: 'center',
            dataIndex: 'pollutantName',
            key: 'pollutantName',
        },
        {
          title: "报警生成时间",
          width: 120,
          align: 'center',
          dataIndex: 'createTime',
          key: 'createTime',
        },
        {
            title: "报警信息",
            width: 200,
            align: 'left',
            dataIndex: 'message',
            key: 'message',
        },
        {
            title: "核实人",
            width: 90,
            align: 'center',
            dataIndex: 'dealPerson',
            key: 'dealPerson',
            render:(text)=>{
                return text == ''?'-':text
                }
        },
        {
            title: "核实时间",
            width: 100,
            align: 'center',
            dataIndex: 'verifyTime',
            key: 'verifyTime',
            render:(text)=>{
                return text == ''?'-':text
                }
        },
        {
            title: "核实状态",
            width: 90,
            align: 'center',
            dataIndex: 'status',
            key: 'status',
            render:(text)=>{
                return text == ''?'-':text == 0?'待核实':'已核实'
                }
        },
        {
            title: "核实结果",
            width: 90,
            align: 'center',
            dataIndex: 'verifymessage',
            key: 'verifymessage',
            render:(text)=>{
                return text == ''?'-':text
                }
        },
        {
            title: "核实详情",
            width: 100,
            align: 'center',
            dataIndex: 'remark',
            key: 'remark',
            render:(text,record)=>{
                let sourc = []
                 if(!record.verifyImage&&!record.remark )
                 {
                    sourc = []
                 }
                 else
                 {
                    let obj = {};
                    record.verifyImage&&record.verifyImage.map(item=>{
                        obj = {
                            name:item.FileName,
                            attach:`${uploadPrefix}/`+item.FileName
                        }
                    })
                    obj.remark = text;
                    sourc.push(obj)
                 }
                 return sourc.length>0? <VerifyDetailsPop dataSource={sourc}/>:'-'
            }
        },
    ],
    };
  }

  componentDidMount() {
    // this.updateQueryState({
    //   RegionCode: this.props.RegionCode,
    // });
    this.initData();
  }

  initData = () => {
    const { location, dispatch } = this.props;
    dispatch({
      //获取企业列表
      type: 'overVerifyRate/getEntByRegion',
      payload: { RegionCode: this.props.RegionCode },
    });
    let newColumns = [
      // {
      //   title: <span>行政区</span>,
      //   dataIndex: 'regionName',
      //   key: 'regionName',
      //   width: 200,
      //   align: 'center',
      // },
      {
        title: '省',
        dataIndex: 'ProvinceName',
        key: 'ProvinceName',
        align: 'center',
        fixed: 'left',
      },
      {
        title: '市',
        dataIndex: 'CityName',
        key: 'CityName',
        align: 'center',
        fixed: 'left',
      },
      {
        title: <span>{'企业名称'}</span>,
        dataIndex: 'entName',
        key: 'entName',
        align: 'left',
      },
      {
        title: <span>监测点名称</span>,
        dataIndex: 'pointName',
        key: 'pointName',
        align: 'left',
      },
      {
        title: <span>运维负责人</span>,
        dataIndex: 'operationUser',
        key: 'operationUser',
        align: 'left',
      },
    ];
    let colList = this.props.divisorList
        colList =  [{PollutantName:'全部合计',PollutantCode:'全部合计'},...colList]
        colList.map((item, key) => {
        let pollutantList = this.props.overVerifyRateForm.PollutantList.value?  
                        this.props.overVerifyRateForm.PollutantList.value : this.props.overVerifyRateForm.PollutantList;
        let index = pollutantList.findIndex((checkedItem, checkedKey) => {
          if (item.PollutantCode == checkedItem) {
            return true;
          }
        });
      if (index !== -1) {
        newColumns.push({
          title: <span>{item.PollutantName}</span>,
          dataIndex: item.PollutantCode,
          key: item.PollutantCode,
          children: [
            {
              title: <span>报警次数</span>,
              width: 100,
              dataIndex: item.PollutantCode + '_alarmCount',
              key: item.PollutantCode + '_alarmCount',
              align: 'center',
              render: (text, record) => {
                return <a onClick={() => { this.entAlarmNum(record,item.PollutantCode,'2') }}>{text}</a>
              }
            },
            {
              title: <span>已核实报警次数</span>,
              width: 110,
              dataIndex: item.PollutantCode + '_respondedCount',
              key: item.PollutantCode + '_respondedCount',
              align: 'center',
              render: (text, record) => {
                return <a onClick={() => { this.entAlarmNum(record,item.PollutantCode,'1') }}>{text}</a>
              }
            },
            {
              title: <span>待核实报警次数</span>,
              width: 110,
              dataIndex: item.PollutantCode + '_noRespondedCount',
              key: item.PollutantCode + '_noRespondedCount',
              align: 'center',
              render: (text, record) => {
                return <a onClick={() => { this.entAlarmNum(record,item.PollutantCode,'0') }}>{text}</a>
              }
            },
            {
              title: <span>核实率</span>,
              width: 100,
              dataIndex: item.PollutantCode + '_RespondedRate',
              key: item.PollutantCode + '_RespondedRate',
              align: 'center',
              render: (text, record) => {
                return <div>{text == '-' ? text : text? `${text}%` : ''}</div>;
              },
            },
          ],
        });
      } else {
      }
    });
    // newColumns.push({
    //   title: <span>核实率</span>,
    //   dataIndex: 'AllRespondedRate',
    //   key: 'AllRespondedRate',
    //   align: 'center',
    //   render: (text, record) => {
    //     return <div>{text == '-' ? text : `${text}%`}</div>;
    //   },
    // });
    this.setState({ columns: newColumns });
    setTimeout(() => {
      this.getTableData();
    });
        //获取核实结果
        dispatch({
          type: pageUrl.GetOverToExamineOperation,
          payload: { PollutantType: '' },
          callback: (data) => {
            if (data.length > 0) {
              this.setState({
                alarmDealTypeListCode: data.map(poll => poll.code)
              })
            }
    
          }
        })
  };
  
  updateQueryState = payload => {
    const { overVerifyRateForm, dispatch } = this.props;

    dispatch({
      type: pageUrl.updateState,
      payload: { overVerifyRateForm: { ...overVerifyRateForm, ...payload } },
    });
  };

  getTableData = () => {
    const { dispatch, overVerifyRateForm } = this.props;
    dispatch({
      type: pageUrl.getData,
      payload: { ...overVerifyRateForm, RegionCode: this.props.RegionCode,PageIndex:this.state.pageIndex,PageSize:this.state.pageSize, },
    });
  };
  changeEnt = (value, data) => {
    //企业事件
    this.updateQueryState({
      EntCode: value,
    });
    setTimeout(() => {
      this.queryClick();
    });
  };
  //创建并获取模板   导出
  template = () => {
    const { dispatch, overVerifyRateForm } = this.props;
    dispatch({
      type: 'overVerifyRate/exportDefectPointDetail',
      payload: { ...overVerifyRateForm, RegionCode: this.props.RegionCode },
      callback: data => {
        downloadFile(`${data}`);
      },
    });
  };
  //查询事件
  queryClick = () => {
    this.getTableData();
  };

  entChildren = () => {
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
  onRef1 = ref => {
    this.child = ref;
  };
  handleTableChange = (PageIndex, PageSize) =>{
   this.setState({
     pageIndex:PageIndex,
     pageSize:PageSize
   },()=>{
    this.queryClick()
   })
  }
  entAlarmNum = (record,pollutantCode,status) => { //报警次数 弹框
    const {overVerifyRateForm: {beginTime,  endTime, EntCode,PollutantList, RegionCode,  AttentionCode,  PollutantType, OperationPersonnel } } = this.props;
    this.setState({
      alarmNumVisible:true,
      PollutantCode:pollutantCode,
      dealType:status,
      alarmNumModalTitle:record.regionName + moment(beginTime).format('YYYY年MM月DD号HH时') + '至'+moment(endTime).format('YYYY年MM月DD号HH时')+'超标报警情况',
    })
  this.props.dispatch({
      type:pageUrl.GetAlarmVerifyDetail,
      payload: {
          RegionCode: record.regionCode,
          attentionCode: record.attentionValue,
          PollutantType: record.outletValue,
          // DataType: record.dataType == '日'? 'DayData' : 'HourData',
          DataType:'',
          BeginTime: moment(beginTime).format("YYYY-MM-DD HH:mm:ss"),
          EndTime: moment(endTime).format("YYYY-MM-DD HH:mm:ss"),
          PollutantCode: pollutantCode,
          Status:status==2? '' : status,
          EntCode:'',
          VerifyStatus:this.state.alarmDealTypeListCode,
          operationpersonnel:OperationPersonnel,
          DGIMN:record.DGIMN,
      }
  })
  }
  entAlarmNumQuery = (query) =>{ //报警次数 点击查询

    const {enterpriseValue,dealType,} = this.state;
    this.props.dispatch({
      type:pageUrl.GetAlarmVerifyDetail,
      payload: {
         ...query,
         EntCode:enterpriseValue,
         Status:dealType,
         VerifyStatus: this.state.alarmDealTypeListCode,
      }
  })
  }
  //报警次数数据   导出
  entAlarmNumExport=(query)=>{
    const {enterpriseValue,dealType,} = this.state;
        this.props.dispatch({
            type:pageUrl.ExportAlarmVerifyDetail,
            payload: {
              ...query,
              EntCode:enterpriseValue,
              Status:dealType,
            }
        })
    }
  render() {
    let columns = [];
    return (
      <Card
        bordered={false}
        title={
          <Form layout="inline">
            <Row>
              <Form.Item>
                <Select
                  showSearch
                  optionFilterProp="children"
                  allowClear
                  placeholder="企业列表"
                  onChange={this.changeEnt}
                  style={{ width: 177 }}
                >
                  {this.entChildren()}
                </Select>
              </Form.Item>
              <Form.Item>
                <Button
                  style={{ margin: '0 5px' }}
                  icon={<ExportOutlined />}
                  onClick={this.template}
                  loading={this.props.exloading}
                >
                  导出
                </Button>
                <Button
                  style={{ marginLeft: 8 }}
                  onClick={() => {
                    this.updateQueryState({
                      EntCode: '',
                    });
                    history.go(-1);
                  }}
                >
                   <RollbackOutlined />
                  返回
                </Button>
              </Form.Item>
            </Row>
          </Form>
        }
      >
        <SdlTable
          rowKey={(record, index) => `complete${index}`}
          loading={this.props.loading}
          columns={this.state.columns}
          dataSource={this.props.tableDatil}
          pagination={{
            total: this.props.tableDatilTotal,
            pageSize: this.state.pageSize,
            current: this.state.pageIndex,
            showSizeChanger: true,
            showQuickJumper: true,
            onChange: this.handleTableChange,
          }}
        />
         <Modal
          centered
          title={this.state.alarmNumModalTitle}
          visible={this.state.alarmNumVisible}
          footer={null}
          wrapClassName='spreadOverModal'
          onCancel={() => { this.setState({ alarmNumVisible: false }) }}
        >
          <div style={{ marginBottom: 10 }}>
            <EntAtmoList placeholder="企业列表" regionCode={this.state.regionCode} onChange={(value) => {
              this.setState({
                enterpriseValue: value
              })
            }} EntCode={this.state.enterpriseValue} style={{ width: 200,  marginRight: 10 }} />
            <Radio.Group value={this.state.dealType} style={{ marginRight: 10, marginLeft: 10 }} onChange={(e) => {
              this.setState({
                dealType: e.target.value,
              })
            }}>
              <Radio.Button value="2">全部</Radio.Button>
              <Radio.Button value="1">已核实</Radio.Button>
              <Radio.Button value="0">待核实</Radio.Button>
            </Radio.Group>
            <Button type='primary' loading={this.props.alarmVerifyDetailLoaing} style={{ marginRight: 10 }} onClick={()=>{this.entAlarmNumQuery(this.props.alarmVerifyQueryPar)}}> 查询</Button>
            <Button loading={this.props.exportAlarmVerifyDetailLoaing} onClick={()=>{this.entAlarmNumExport(this.props.alarmVerifyQueryPar)}}><ExportOutlined /> 导出</Button>
            <div style={{ marginTop: 10 }}>
              {this.state.dealType === '1' ?
                <div>
                  <label style={{ fontSize: 14, marginRight: 10, marginLeft: 10 }}>核实结果:</label>
                  <Checkbox.Group value={this.state.alarmDealTypeListCode}
                   onChange={(checkedValues)=>{this.setState({alarmDealTypeListCode:checkedValues })}}>
                    {
                      this.props.alarmDealTypeList.map(poll =>
                        <Checkbox value={poll.code}>{poll.name}</Checkbox>
                      )
                    }
                  </Checkbox.Group>
                </div>
                : null}
            </div>
          </div>
          {
            <SdlTable loading={this.props.alarmNumLoadingDetail} columns={this.state.columns2} dataSource={this.props.managementDetail} pagination={false} />
          }
        </Modal>
      </Card>
    );
  }
}
