/**
 * 功  能：有效传输率
 * 创建人：贾安波
 * 创建时间：2020
 */
import React, { Component } from 'react';
import { ExportOutlined, QuestionCircleTwoTone, RollbackOutlined} from '@ant-design/icons';
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
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import Link from 'umi/link';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import SdlTable from '@/components/SdlTable';
import DatePickerTool from '@/components/RangePicker/DatePickerTool';
import { router } from 'umi';
import styles from './style.less';
import { downloadFile,interceptTwo } from '@/utils/utils';
import SdlCascader from '../../AutoFormManager/SdlCascader';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
// import IndexModal from './IndexModal';
const { Search } = Input;
const { MonthPicker } = DatePicker;
const { Option } = Select;
const monthFormat = 'YYYY-MM';
import QutPage from "@/pages/IntelligentAnalysis/newTransmissionefficiency/qutPage"
import RegionList from '@/components/RegionList'

const pageUrl = {
  updateState: 'newtransmissionefficiency/updateState',
  getData: 'newtransmissionefficiency/getTransmissionEfficiencyForRegion',
};
const content = <div>当有效传输率未到达90%时判定为未达标</div>;
@connect(({ loading, newtransmissionefficiency, autoForm }) => ({
  exRegionloading: newtransmissionefficiency.exRegionloading,
  loading: loading.effects[pageUrl.getData],
  total: newtransmissionefficiency.entTotal,
  pageSize: newtransmissionefficiency.pageSize,
  pageIndex: newtransmissionefficiency.pageIndex,
  tableDatas: newtransmissionefficiency.entTableDatas,
  regionList: autoForm.regionList,
  // beginTime: newtransmissionefficiency.beginTime,
  // endTime: newtransmissionefficiency.endTime,
  // pollutantType: newtransmissionefficiency.pollutantType,
  assessment: newtransmissionefficiency.assessment,
  RegionCode: newtransmissionefficiency.RegionCode,
  operationpersonnel:newtransmissionefficiency.operationpersonnel,
}))
@Form.create()
export default class EntIndexModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      EnterpriseCode: '',
      EnterpriseName: '',
      visible: false,
      eName: '',
      regions: '',
      operationpersonnel:'',
      effectiveVisible: false,
      effectiveLoading: false,
      TTVisible:false,
      PollutantType: props.pollutantType,
      beginTime:props.beginTime,
      endTime:props.endTime,
      level:''
    };
  }

  componentWillMount() {
    // this.updateState({
    //   pollutantType:this.state.PollutantType,
    //   RegionCode:'',
    // });
    // this.getTableData();
  }
  componentDidUpdate(props){
    if(props.TVisible!==this.props.TVisible&&this.props.TVisible){
      this.updateState({
        pollutantType:this.state.PollutantType,
        RegionCode:'',
      });
      this.setState({
          PollutantType: props.pollutantType, beginTime:props.beginTime,endTime:props.endTime},()=>{
          this.getTableData();
        })
    }
  }
  updateState = payload => {
    this.props.dispatch({
      type: pageUrl.updateState,
      payload,
    });
  };

  getTableData = (regionCode) => {
    this.props.dispatch({
      type: pageUrl.getData,
      payload: {
        PollutantType: this.state.PollutantType?this.state.PollutantType:'',
        beginTime:this.state.beginTime,
        endTime:this.state.endTime,
        RegionCode:this.state.level? regionCode: this.props.RegionCode,
        regionLevel:this.state.level? this.state.level: ''
      }
    });
  };

  // handleTableChange = (pagination, filters, sorter) => {
  //     if (sorter.order) {
  //         this.updateState({
  //             // transmissionEffectiveRate: sorter.order,
  //             pageIndex: pagination.current,
  //             pageSize: pagination.pageSize,
  //         });
  //     } else {
  //         this.updateState({
  //             // transmissionEffectiveRate: 'ascend',
  //             pageIndex: pagination.current,
  //             pageSize: pagination.pageSize,
  //         });
  //     }
  //     this.getTableData(pagination.current);
  // }

  children = () => {
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
  };
  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <Card style={{ paddingBottom: 25, width: '100%', lineHeight: 2 }}>
        <p>
          <Badge status="warning" text="传输率：传输个数/应传个数" />
        </p>
        <p>
          <Badge status="warning" text="有效率：100%" />
        </p>
        <p>
          <Badge status="warning" text="有效传输率：传输率*有效率" />
        </p>
        <p>
          <Badge
            status="warning"
            text="当有效传输率高于90%时有效传输率达标并标记为绿色，否则标记为红色"
          />
        </p>
      </Card>
    ),
    filterIcon: filtered => <QuestionCircleTwoTone />,
  });

  typeChange = value => {
    this.setState({PollutantType: value})
    this.updateState({
      pollutantType: value?value:"",
    });
  };

  asseChange = value => {
    this.updateState({
      assessment: value,
    });
  };

  changeRegion = value => {
    this.updateState({
      RegionCode: value? value : '',
    });
  };
  
  changeOperation = value => {
    this.updateState({
      operationpersonnel: value,
    });
  };

  //创建并获取模板   导出
  template = () => {
    this.updateState({
      exRegionloading: true,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'newtransmissionefficiency/exportTransmissionEfficiencyForRegion',
      payload: {
        callback: data => {
          downloadFile(data);
        },
      },
    });
  };
  dateCallback = date => {
    // console.log(date[0].format("YYYY-MM-DD"))
    this.setState({
      beginTime: date[0].format('YYYY-MM-DD 00:00:00'),
      endTime: date[1].format('YYYY-MM-DD HH:mm:ss'),
    })
    this.updateState({
      beginTime: date[0].format('YYYY-MM-DD 00:00:00'),
      endTime: date[1].format('YYYY-MM-DD HH:mm:ss'),
    });
  };
  //查询事件
  queryClick = () => {
    this.props.dispatch({
      type: pageUrl.getData,
    });
  };

  //手工生成有效传输效率数据
  manualData = () => {
    this.setState({ effectiveVisible: true });
  };
  effectiveOk = () => {
    alert('it is ok');
  };

  // router.push({
  //     pathname: `/Intelligentanalysis/newtransmissionefficiency/point/${record.EnterpriseCode}/${record.EnterpriseName}`,
  //     query: {
  //         tabName: "有效传输率 - 详情"
  //     }
  // })
  showChildModal=()=>{
    // console.log('this.state.pollutantType',this.state.pollutantType);
    this.setState({
      TVisible:false,
      TTVisible:true,
    },()=>{
      
    })
  }
  interceptTwo=(value)=>{
    const data = value.toString();
    const result = data.substring(0,data.indexOf(".")+3)
    return result;
  }
  showModal=()=>{
    
    const { eName,level } = this.state;
    const { regionList, exRegionloading, RegionCode,operationpersonnel } = this.props;
    const columns = [
      {
        title: <span style={{ fontWeight: 'bold' }}>行政区</span>,
        dataIndex: 'RegionName',
        key: 'RegionName',
        align: 'center',
        render: (text, record) => { 
          let RegionCode = record.RegionCode;
          return <a onClick={()=>{
            if(this.state.level){
              this.setState({
                showDetails: true,
                RegionCode: RegionCode,
                OperationPersonnel:operationpersonnel
              })
            }else{
              this.setState({
                level: '2',
              },()=>{
                this.getTableData(RegionCode);
              })
            }

          }}>
            {text}
          </a>
          //  return <Link to={{  pathname: '/Intelligentanalysis/transmissionefficiency/qutDetail',
          //              query: { RegionCode:text=='全部合计'? '': record.RegionCode},
          //              }}
          //              >
          //           {text}
          //       </Link>
                  
        },
      },
      {
        title: <span style={{ fontWeight: 'bold' }}>考核企业数</span>,
        dataIndex: 'CountEnt',
        key: 'CountEnt',
        sorter: (a, b) => a.CountEnt - b.CountEnt,
        // width: '20%',
        align: 'center',
        render: (text, record) => {
         return <span>{text}</span>;
         
        },
      },
      {
        title: <span style={{ fontWeight: 'bold' }}>考核监测点数</span>,
        dataIndex: 'CountPoint',
        key: 'CountPoint',
        sorter: (a, b) => a.CountPoint - b.CountEnt,
        // width: '20%',
        align: 'center',
        render: (text, record) => {
          return <span>{text}</span>

        },
      },
      {
        title: <span style={{ fontWeight: 'bold' }}>有效率</span>,
        dataIndex: 'EffectiveRate',
        key: 'EffectiveRate',
        // width: '10%',
        align: 'center',
        render: (text, record) => {
          if (record.ShouldNumber==0) {
            return <span>停运</span>;
          }
          if (record.AvgEffectiveRate <= text) {
            return <span>{`${interceptTwo(Number(text) * 100)}%`}</span>;
          }
          // const content = (
          //   <span>
          //     <Icon type="warning" style={{ color: '#EEC900' }} />
          //     平均值{`${(parseFloat(record.AvgEffectiveRate) * 100).toFixed(2)}%`}
          //   </span>
          // );
          return (
            // <Popover content={content} trigger="hover">
            <span className={styles.avgtext}>
              {/* <Badge className={styles.warningdata} status="warning" /> */}
              {`${interceptTwo(Number(text) * 100)}%`}
            </span>
            //  </Popover>
          );
        },
      },
      {
        title: <span style={{ fontWeight: 'bold' }}>传输率</span>,
        dataIndex: 'TransmissionRate',
        key: 'TransmissionRate',
        sorter: (a, b) => a.TransmissionRate - b.TransmissionRate,
        // width: '10%',
        align: 'center',
        render: (text, record) => {
          if (record.ShouldNumber==0) {
            return <span>停运</span>;
          }
          if (record.AvgTransmissionRate <= text) {
            return <span>{`${interceptTwo(Number(text) * 100)}%`}</span>;
          }
          return (
            <span className={styles.avgtext}>
              {`${interceptTwo(Number(text) * 100)}%`}
            </span>
            // </Popover>
          );
        },
      },
      ,
      {
        title: <span style={{ fontWeight: 'bold' }}>有效传输率</span>,
        dataIndex: 'TransmissionEffectiveRate',
        key: 'TransmissionEffectiveRate',
        align: 'center',
        sorter: (a, b) => a.TransmissionEffectiveRate - b.TransmissionEffectiveRate,
        render: (text, record) => {
          if (record.ShouldNumber==0) {
            return <span>停运</span>;
          }
          // 红色：#f5222d 绿色：#52c41a
          const percent = interceptTwo(Number(text) * 100);
          if (percent >= 90) {
            return (
              <div>
                <Progress
                  successPercent={percent}
                  percent={percent}
                  size="small"
                  style={{width:'90%'}}
                  format={percent => <span style={{ color: 'black' }}>{percent}%</span>}
                />
              </div>
            );
          }
          return (
            <div>
              <Progress
                successPercent={0}
                percent={percent}
                status="exception"
                size="small"
                style={{width:'90%'}}
                format={percent => <span style={{ color: 'black' }}>{percent}%</span>}
              />
            </div>
          );
        },
      },
      {
        title: <span style={{ fontWeight: 'bold' }}>低于90%的监测点个数</span>,
        dataIndex: 'LowerTransmissionEffectiveRateCount',
        key: 'LowerTransmissionEffectiveRateCount',
        width: 145,
        align: 'center',
        render: (text, record) => {
          if (record.ShouldNumber==0) {
            return <span>停运</span>;
          }else{
          return <span>{text}</span>
          }
        },
      },
    ];
    return(
     <Card
          bordered={false}
          title={
            <>
              {!level&& <Form layout="inline">

               <Form.Item>
                  查询时间：
                  <RangePicker_
                    dateValue={[moment(this.state.beginTime), moment(this.state.endTime)]}
                    format="YYYY-MM-DD"
                    callback={(dates, dataType) => this.dateCallback(dates, dataType)}
                    allowClear={false}
                  />
                </Form.Item>
                <Form.Item>
                  <Select
                    allowClear
                    placeholder="请选择企业类型"
                    onChange={this.typeChange}
                    value={this.state.PollutantType}
                    style={{ width: 200, marginLeft: 10 }}
                  >
                    <Option value="2">废气</Option>
                    <Option value="1">废水</Option>
                  
                  </Select>
                </Form.Item>
                <Form.Item>
                  <Select
                    placeholder="请选择考核类型"
                    onChange={this.asseChange}
                    value={this.props.assessment}
                    style={{ width: 200, marginLeft: 10 }}
                  >
                    {/* <Option value="1">国家考核</Option>
                    <Option value="2">兵团考核</Option> */}
                    <Option value="2">全部考核</Option>
                    <Option value="1">国家考核</Option>
                  </Select>
                </Form.Item>
                <Form.Item>
                   <RegionList style={{ width: 200, marginLeft: 10 }} changeRegion={this.changeRegion} RegionCode={this.props.RegionCode ? this.props.RegionCode : undefined}/>
                </Form.Item>
                <Form.Item>
                <Button type="primary" onClick={this.getTableData}>
                    查询
                  </Button>
                  <Button
                    style={{ margin: '0 5px' }}
                    icon={<ExportOutlined />}
                    onClick={this.template}
                    loading={exRegionloading}
                  >
                    导出
                  </Button>
                </Form.Item>
              </Form>}
              {!level&&  <div style={{ paddingTop: 10 }}>
                <div
                  style={{
                    width: 20,
                    height: 9,
                    backgroundColor: '#52c41a',
                    display: 'inline-block',
                    borderRadius: '20%',
                    cursor: 'pointer',
                    marginRight: 3,
                  }}
                />{' '}
                <span style={{ cursor: 'pointer', fontSize: 14, color: 'rgba(0, 0, 0, 0.65)' }}>
                  {' '}
                  ≥90%达标
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
                   {`<90%未达标`}
                </span>
                <span style={{color:'#f5222d',fontSize:14,paddingLeft:15}}>每日凌晨计算昨日的有效传输率，每月4号和10号重新计算上个月的有效传输率</span>
              </div>}
              {level&&<><Button
                    style={{ margin: '0 5px' }}
                    icon={<ExportOutlined />}
                    onClick={this.template}
                    loading={exRegionloading}
                  >
                    导出
                  </Button><Button
                    onClick={() => {
                      this.setState({
                        level:'',
                      },()=>{
                        this.getTableData();
                      })
                    }}
                  >
                    <RollbackOutlined />
                    返回
                  </Button></>}
            </>
          }
        >
          <SdlTable
             rowKey={(record, index) => `complete${index}`}
             loading={this.props.loading}
            columns={columns}
             bordered={false}
             dataSource={this.props.tableDatas}
            //  scroll={{ y: 'calc(100vh - 450px)'}}
             pagination={false}
           /> 
        </Card>
    )
  }
  render() {
    // console.log("props.pollutantType=",this.props.pollutantType)
    // console.log("state.pollutantType=",this.state.PollutantType)
  const {TVisible,TCancle,TTVisible} = this.props
  return (
      <div>
           <Modal
          centered
          title='有效传输率'
          visible={TVisible}
          footer={null}
          wrapClassName='spreadOverModal'
          onCancel={TCancle}>
           {
              !this.state.showDetails && this.showModal()
            }
            {
              this.state.showDetails && <QutPage hideBreadcrumb isModal={true} location={{ query: { RegionCode: this.state.RegionCode } }} _pollutantType={this.state.PollutantType} onBack={() => {
                this.setState({
                  showDetails: false,
                  RegionCode: undefined
                })
              }} />
            }
          </Modal> 
      </div>
  );
}
}
