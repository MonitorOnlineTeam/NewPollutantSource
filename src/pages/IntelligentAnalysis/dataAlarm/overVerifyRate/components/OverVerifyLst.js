/**
 * 功  能：超标核实率
 * 创建人：张赟
 * 创建时间：2020.10.17
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
  Checkbox,
  Select,
  message,
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
import RegionList from '@/components/RegionList'
import EntAtmoList from '@/components/EntAtmoList'
import VerifyDetailsPop from '@/pages/dataSearch/exceedDataAlarmRecord/VerifyDetailsPop'
import { uploadPrefix } from '@/config'
import styles from '../index.less'

const { Search } = Input;
const { MonthPicker } = DatePicker;
const { Option } = Select;
const { RangePicker } = DatePicker;
const monthFormat = 'YYYY-MM';

const pageUrl = {
  updateState: 'overVerifyRate/updateState',
  getData: 'overVerifyRate/getDefectModel',
  GetOverToExamineOperation:'exceedDataAlarmModel/GetOverToExamineOperation',
  GetAlarmVerifyDetail: 'exceedDataAlarmModel/GetAlarmVerifyDetail',
  ExportAlarmVerifyDetail:'exceedDataAlarmModel/ExportAlarmVerifyDetail',
};
@connect(({ loading, overVerifyRate, autoForm, common,exceedDataAlarmModel, }) => ({
  priseList: overVerifyRate.priseList,
  exloading: overVerifyRate.exloading,
  loading: loading.effects[pageUrl.getData],
  total: overVerifyRate.total,
  tableDatas: overVerifyRate.tableDatas,
  regionList: autoForm.regionList,
  attentionList: overVerifyRate.attentionList,
  atmoStationList: common.atmoStationList,
  overVerifyRateForm: overVerifyRate.overVerifyRateForm,
  divisorList: overVerifyRate.divisorList,
  pollutantByType: overVerifyRate.pollutantByType,
  alarmNumLoadingDetail:loading.effects['exceedDataAlarmModel/GetAlarmVerifyDetail'],
  alarmDealTypeList:exceedDataAlarmModel.AlarmDealTypeList,
  managementDetail:exceedDataAlarmModel.ManagementDetail,
  alarmVerifyQueryPar:exceedDataAlarmModel.alarmVerifyQueryPar,
  alarmVerifyDetailLoaing:loading.effects[pageUrl.GetAlarmVerifyDetail],
  exportAlarmVerifyDetailLoaing:loading.effects[pageUrl.ExportAlarmVerifyDetail],
}))
@Form.create({
  mapPropsToFields(props) {
    return {
      PollutantList: Form.createFormField(props.overVerifyRateForm.PollutantList),
      PollutantType: Form.createFormField(props.overVerifyRateForm.PollutantType),
    };
  },
  onFieldsChange(props, fields) {
    props.dispatch({
      type: 'overVerifyRate/updateState',
      payload: {
        overVerifyRateForm: {
          ...props.overVerifyRateForm,
          ...fields,
        },
      },
    });
  },
})
export default class OverVerifyLst extends Component {
  constructor(props) {
    super(props);

    this.state = {
      checkedValues: [],
      columns: [],
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
    this.initData();
    // 根据企业类型查询监测因子
    this.getPollutantByType(this.props.pollutantByType, this.getExceptionList);
  }
  // 根据企业类型查询监测因子
  getPollutantByType = (val, cb) => {
    const { dispatch, overVerifyRateForm } = this.props;
    this.props.dispatch({
      type: 'overVerifyRate/getPollutantByType',
      payload: {
        PollutantType: val,
      },
      callback: res => {
        let newCloum = [
          {
            title: <span>行政区</span>,
            dataIndex: 'regionName',
            key: 'regionName',
            align: 'center',
            width: 200,
            render: (text, record) => {
              const { level, overVerifyRateForm: { RegionCode } } = this.props;
              return <Link
                  to={level == 2 ?
                    {
                      pathname: '/Intelligentanalysis/dataAlarm/overVerifyRate/pointVerifyRate',
                      query: { regionCode: text == '全部合计' ? RegionCode : record.regionCode },
                    } :
                    {
                      pathname: '/Intelligentanalysis/dataAlarm/overVerifyRate/cityLevel',
                      query: { regionCode: record.regionCode },
                    }
                  }
                >
                  {text}
                </Link>
              // return (
              //   <Link
              //     to={
              //       {
              //         pathname: '/Intelligentanalysis/dataAlarm/overVerifyRate/cityLevel',
              //         query: { regionCode: record.regionCode },
              //       }
              //     }
              //   >
              //     {text}
              //   </Link>
              // );
            },
          },
          {
            title: <span>{'数据超标报警企业数'}</span>,
            dataIndex: 'entCount',
            key: 'entCount',
            align: 'center',
          },
          {
            title: <span>数据超标报警监测点数</span>,
            dataIndex: 'pointCount',
            key: 'pointCount',
            align: 'center',
          },
        ];
        this.props.level==2&&newCloum.splice(0,1,{
          title: '省',
          dataIndex: 'ProvinceName',
          key: 'ProvinceName',
          align: 'center',
          render: (text, record, index) => {
            if (text == '全部合计') {
              return { props: { colSpan: 0 }, };
            }
            return text;
          },
        },
        {
          title: '市',
          dataIndex: 'CityName',
          key: 'CityName',
          align: 'center',
          render: (text, record) => {
            const {  overVerifyRateForm: { RegionCode } } = this.props; 
            return { props: { colSpan: record.ProvinceName == '全部合计' ? 2 : 1 },
                children:  <Link to={
                  {
                    pathname: '/Intelligentanalysis/dataAlarm/overVerifyRate/pointVerifyRate',
                    query: { regionCode: record.ProvinceName == '全部合计' ? RegionCode : record.CityCode },
                  } 
                }
              >
                {record.ProvinceName == '全部合计' ? '全部合计' : text}
              </Link>
            }
         
          },
        })
        res = [{PollutantName:'全部合计',PollutantCode:'全部合计'},...res]
        res.map(item => {
          newCloum.push({
            title: <span>{item.PollutantName}</span>,
            dataIndex: item.PollutantCode,
            key: item.PollutantCode,
            width: 420,
            align: 'center',
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
                  return <div>{text == '-' ? text : text ? `${text}%` : ''}</div>;
                },
              },
            ],
          });
        });
        newCloum.push({
          title: <span>核实率</span>,
          dataIndex: 'AllRespondedRate',
          key: 'AllRespondedRate',
          align: 'center',
          render: (text, record) => {
            return <div>{text == '-' ? text : `${text}%`}</div>;
          },
        });
        this.setState(
          { checkedValues: res.map(item => item.PollutantCode), columns: newCloum },
          () => {
            this.updateQueryState({
              PollutantList: this.state.checkedValues,
            });
            cb && cb();
          },
        );
      },
    });
  };
  initData = () => {
    const { dispatch, location, Atmosphere, type, level, query } = this.props;


    // dispatch({ type: 'autoForm/getRegions', payload: { RegionCode: level==2?query&&query.regionCode : '', PointMark: '2' } }); //获取行政区列表

    dispatch({ type: 'overVerifyRate/getAttentionDegreeList', payload: { RegionCode: level == 2 ? query && query.regionCode : '' } }); //获取关注列表
    this.updateQueryState({
      RegionCode: level == 2 ? query && query.regionCode : '',
      regionLevel: level,
    });
    setTimeout(() => {
      this.getTableData();
    });
    //获取核实结果
    dispatch({
            type: pageUrl.GetOverToExamineOperation,
            payload: {  PollutantType:'' },
            callback:(data)=>{
                if(data.length > 0) {
                    this.setState({
                        alarmDealTypeListCode:data.map(poll=>poll.code)
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
      payload: { ...overVerifyRateForm },
    });
  };

  typeChange = value => {
    this.updateQueryState({
      PollutantType: value,
    });
    this.props.dispatch({
      type: 'overVerifyRate/updateState',
      payload: {
        pollutantByType: value,
      },
    });
    this.getPollutantByType(value, this.getExceptionList);
    setTimeout(() => {
      this.getTableData();
    });
  };
  changePperation = (value) => {
    this.updateQueryState({
      OperationPersonnel: value,
    });
  }
  changeRegion = value => {
    //行政区事件

    this.updateQueryState({
      RegionCode: value ? value : '',
    });
  };
  changeAttent = value => {
    this.updateQueryState({
      AttentionCode: value,
    });
  };
  changeEnt = (value, data) => {
    //企业事件
    this.updateQueryState({
      EntCode: value,
    });
  };
  //创建并获取模板   导出
  template = () => {
    const { dispatch, overVerifyRateForm } = this.props;
    dispatch({
      type: 'overVerifyRate/exportDefectDataSummary',
      payload: { ...overVerifyRateForm },
      callback: data => {
        downloadFile(`${data}`);
      },
    });
  };
  //查询事件
  queryClick = () => {
    this.getTableData();
  };

  regchildren = () => {
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
  attentchildren = () => {
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
  };
  onRef1 = ref => {
    this.child = ref;
  };

  dateChange = (date, dataType) => {
    this.updateQueryState({
      dataType: dataType,
      beginTime: date[0].format('YYYY-MM-DD HH:mm:ss'),
      endTime: date[1].format('YYYY-MM-DD HH:mm:ss'),
    });
  };

  // 监测因子change
  onCheckboxChange = checkedValues => {
    let newCloum = [
      {
        title: <span>行政区</span>,
        dataIndex: 'regionName',
        key: 'regionName',
        align: 'center',
        render: (text, record) => {
          return (
            <Link
              to={{
                pathname: '/Intelligentanalysis/dataAlarm/overVerifyRate/pointVerifyRate',
                query: { regionCode: record.regionCode },
              }}
            >
              {text}
            </Link>
          );
        },
      },
      
      {
        title: <span>{'数据超标报警企业数'}</span>,
        dataIndex: 'entCount',
        key: 'entCount',
        align: 'center',
      },
      {
        title: <span>数据超标报警监测点数</span>,
        dataIndex: 'pointCount',
        key: 'pointCount',
        width: 210,
        align: 'center',
      },
    ];
    if (checkedValues.length < 1) {
      message.warning('最少勾选一个监测因子！');
      return;
    }
    let colList = this.props.divisorList
        colList =  [{PollutantName:'全部合计',PollutantCode:'全部合计'},...colList]
        colList.map((item, key) => {
         let index = checkedValues.findIndex((checkedItem, checkedKey) => {
          if (item.PollutantCode == checkedItem) {
          return true;
        }
      });
      if (index !== -1) {
        newCloum.push({
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
            },
            {
              title: <span>已核实报警次数</span>,
              width: 110,
              dataIndex: item.PollutantCode + '_respondedCount',
              key: item.PollutantCode + '_respondedCount',
              align: 'center',
            },
            {
              title: <span>待核实报警次数</span>,
              width: 110,
              dataIndex: item.PollutantCode + '_noRespondedCount',
              key: item.PollutantCode + '_noRespondedCount',
              align: 'center',
            },
            {
              title: <span>核实率</span>,
              width: 100,
              dataIndex: item.PollutantCode + '_RespondedRate',
              key: item.PollutantCode + '_RespondedRate',
              align: 'center',
              render: (text, record) => {
                return <div>{text == '-' ? text : text ? `${text}%` : ''}</div>;
              },
            },
          ],
        });
      } else {
      }
    });
    newCloum.push({
      title: <span>核实率</span>,
      dataIndex: 'AllRespondedRate',
      key: 'AllRespondedRate',
      align: 'center',
      render: (text, record) => {
        return <div>{text == '-' ? text : `${text}%`}</div>;
      },
    });
    this.setState({
      columns: newCloum,
    });
    this.props.dispatch({
      type: 'overVerifyRate/updateState',
      payload: {
        overVerifyRateForm: {
          ...this.props.overVerifyRateForm,
          PollutantList: checkedValues,
        },
      },
    });
  };
  entAlarmNum = (record,pollutantCode,status) => { //报警次数 弹框
    const {overVerifyRateForm: {beginTime,  endTime, EntCode,PollutantList, RegionCode,  AttentionCode,  PollutantType, OperationPersonnel } } = this.props;
    console.log(pollutantCode)
    this.setState({
      alarmNumVisible:true,
      PollutantCode:pollutantCode=='全部合计'? '' : pollutantCode,
      dealType:status,
      alarmNumModalTitle:record.regionName + moment(beginTime).format('YYYY年MM月DD号HH时') + '至'+moment(endTime).format('YYYY年MM月DD号HH时')+'超标报警情况',
    })
  this.props.dispatch({
      type:pageUrl.GetAlarmVerifyDetail,
      payload: {
          RegionCode: record.ProvinceName == '全部合计' ? RegionCode :record.regionCode,
          attentionCode: record.attentionValue,
          PollutantType: record.outletValue,
          // DataType: record.dataType == '日'? 'DayData' : 'HourData',
          DataType:'',
          BeginTime: moment(beginTime).format("YYYY-MM-DD HH:mm:ss"),
          EndTime: moment(endTime).format("YYYY-MM-DD HH:mm:ss"),
          PollutantCode: pollutantCode=='全部合计'? '' : pollutantCode,
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
    const {
      exloading,
      form: { getFieldDecorator, getFieldValue },
      divisorList,
      overVerifyRateForm: {
        beginTime,
        endTime,
        EntCode,
        RegionCode,
        AttentionCode,
        dataType,
        PollutantType,
        OperationPersonnel
      },
      level,
      type,
    } = this.props;
    const { checkedValues } = this.state;

    return (
      <Card
        bordered={false}
        title={
          <Form layout="inline">
            <>
              {!level ? <> <Row style={{  marginTop: 10 }}>
                  <Form.Item>
                    日期查询：
                  <RangePicker_
                      onRef={this.onRef1}
                      allowClear={false}
                      dataType={dataType}
                      style={{ minWidth: '200px', marginRight: '10px' }}
                      dateValue={[moment(beginTime), moment(endTime)]}
                      callback={(dates, dataType) => this.dateChange(dates, dataType)}
                    />
                  </Form.Item>
                  <Form.Item label="关注程度">
                    <Select
                      placeholder="关注程度"
                      onChange={this.changeAttent}
                      value={AttentionCode}
                      style={{ width: 110 }}
                      allowClear
                    >
                      <Option value=""></Option>
                      {this.attentchildren()}
                    </Select>
                  </Form.Item>
                  <Form.Item label="行政区">
                    <RegionList style={{ width: 165 }} changeRegion={this.changeRegion} RegionCode={RegionCode} />
                  </Form.Item>
                  <Form.Item label="企业类型">
                    <Select
                      placeholder="企业类型"
                      onChange={this.typeChange}
                      value={PollutantType}
                      style={{ width: 100 }}
                    >
                      <Option value="2">废气</Option>
                      <Option value="1">废水</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" loading={this.props.loading} onClick={this.queryClick}>
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
                  </Form.Item>
                  </Row> 
                  <div style={{  marginTop: 10 }}>
                  {getFieldDecorator('PollutantList', {
                    initialValue: checkedValues,
                  })(
                    <Checkbox.Group
                      onChange={this.onCheckboxChange}
                      className={styles.pollutantCheckboxSty}
                    >
                      {divisorList.map(item => {
                        return (
                          <Checkbox key={item.PollutantCode} value={item.PollutantCode}>
                            {item.PollutantName}
                          </Checkbox>
                        );
                      })}
                    </Checkbox.Group> ,
                  )}
                  </div>
                </>:
                <Form.Item>
                  <Button
                    style={{ margin: '0 5px' }}
                    icon={<ExportOutlined />}
                    onClick={this.template}
                    loading={exloading}
                  >
                    导出
                </Button>
                  <Button onClick={() => {
                    history.go(-1);
                  }} ><RollbackOutlined />返回</Button>
                </Form.Item>
              }
            </>
          </Form>
        }
      >
        <SdlTable
          rowKey={(record, index) => `complete${index}`}
          loading={this.props.loading}
          columns={this.state.columns}
          dataSource={this.props.tableDatas.data}
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
