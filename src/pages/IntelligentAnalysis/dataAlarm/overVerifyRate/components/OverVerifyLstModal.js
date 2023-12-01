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
import PointVerifyLstModal from '../pointVerifyRate/components/PointVerifyLstModal'
import RegionList from '@/components/RegionList';
import styles from '../index.less'
import EntAtmoList from '@/components/EntAtmoList'
import VerifyDetailsPop from '@/pages/dataSearch/exceedDataAlarmRecord/VerifyDetailsPop'
const { Search } = Input;
const { MonthPicker } = DatePicker;
const { Option } = Select;
const { RangePicker } = DatePicker;
const monthFormat = 'YYYY-MM';

const pageUrl = {
  updateState: 'overVerifyRate/updateState',
  getData: 'overVerifyRate/getDefectModel',
  GetOverToExamineOperation: 'exceedDataAlarmModel/GetOverToExamineOperation',
  GetAlarmVerifyDetail: 'exceedDataAlarmModel/GetAlarmVerifyDetail',
  ExportAlarmVerifyDetail:'exceedDataAlarmModel/ExportAlarmVerifyDetail',
};
@connect(({ loading, overVerifyRate, autoForm, common, exceedDataAlarmModel, }) => ({
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
  alarmNumLoadingDetail: loading.effects['exceedDataAlarmModel/GetAlarmVerifyDetail'],
  alarmDealTypeList: exceedDataAlarmModel.AlarmDealTypeList,
  managementDetail: exceedDataAlarmModel.ManagementDetail,
  alarmVerifyQueryPar: exceedDataAlarmModel.alarmVerifyQueryPar,
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
export default class OverVerifyLstModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      checkedValues: [],
      columns: [],
      cityColumns:[],
      beginTime: props.beginTime,
      endTime: props.endTime,
      showDetails: false,
      regionLevel: '',
      alarmNumVisible: false,
      alarmNumModalTitle: '',
      PollutantCode:'',
      dealType: '2',
      alarmDealTypeListCode: [],
      enterpriseValue: '',
      regionCode: '',
      columns2: [
        // {
        //   title: "行政区",
        //   width: 100,
        //   align: 'center',
        //   fixed: 'left',
        //   dataIndex: 'regionName',
        //   key: 'regionName',
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
          render: (text) => {
            return text == '' ? '-' : text
          }
        },
        {
          title: "核实时间",
          width: 100,
          align: 'center',
          dataIndex: 'verifyTime',
          key: 'verifyTime',
          render: (text) => {
            return text == '' ? '-' : text
          }
        },
        {
          title: "核实状态",
          width: 90,
          align: 'center',
          dataIndex: 'status',
          key: 'status',
          render: (text) => {
            return text == '' ? '-' : text == 0 ? '待核实' : '已核实'
          }
        },
        {
          title: "核实结果",
          width: 90,
          align: 'center',
          dataIndex: 'verifymessage',
          key: 'verifymessage',
          render: (text) => {
            return text == '' ? '-' : text
          }
        },
        {
          title: "核实详情",
          width: 100,
          align: 'center',
          dataIndex: 'remark',
          key: 'remark',
          render: (text, record) => {
            let sourc = []
            if (!record.verifyImage && !record.remark) {
              sourc = []
            }
            else {
              let obj = {};
              record.verifyImage && record.verifyImage.map(item => {
                obj = {
                  name: item.FileName,
                  attach: '/upload/' + item.FileName
                }
              })
              obj.remark = text;
              sourc.push(obj)
            }
            return sourc.length > 0 ? <VerifyDetailsPop dataSource={sourc} /> : '-'
          }
        },
      ],
    };
  }

  componentDidMount() {
    // this.initData();
    // // 根据企业类型查询监测因子
    // this.getPollutantByType(this.props.pollutantByType, this.getExceptionList);
  }
  componentDidUpdate(props) {
    if (props.TVisible !== this.props.TVisible && this.props.TVisible) {
      this.initData(this.props.type);
      this.getPollutantByType(this.props.type, this.getExceptionList);
      this.setState({ beginTime: props.beginTime, endTime: props.endTime, })
    }
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
              return <a onClick={() => {
                const { overVerifyRateForm: { PollutantType, RegionCode, }, } = this.props;
                if (!this.state.regionLevel) { //省进入市
                  this.setState({
                    regionLevel: 2,
                    RegionCode: record.regionCode
                  }, () => {
                    this.initData(PollutantType, text == '全部合计' ? 'all' : record.regionCode);
                  })
                } else {  //进入监测点
                  this.setState({
                    regionLevel: '',
                    RegionCode: text == '全部合计' ? RegionCode : record.regionCode,
                  }, () => {
                    this.setState({
                      showDetails: true
                    })
                  })
                }
              }}>
                {text}
              </a>
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
                  return <a onClick={() => { this.entAlarmNum(record, item.PollutantCode, '2') }}>{text}</a>
                }
              },
              {
                title: <span>已核实报警次数</span>,
                width: 110,
                dataIndex: item.PollutantCode + '_respondedCount',
                key: item.PollutantCode + '_respondedCount',
                align: 'center',
                render: (text, record) => {
                  return <a onClick={() => { this.entAlarmNum(record, item.PollutantCode, '1') }}>{text}</a>
                }
              },
              {
                title: <span>未核实报警次数</span>,
                width: 110,
                dataIndex: item.PollutantCode + '_noRespondedCount',
                key: item.PollutantCode + '_noRespondedCount',
                align: 'center',
                render: (text, record) => {
                  return <a onClick={() => { this.entAlarmNum(record, item.PollutantCode, '0') }}>{text}</a>
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
        let newCloum2 = []; newCloum2.push(...newCloum);
         newCloum2.splice(0,1,{
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
            return { props: { colSpan: record.ProvinceName == '全部合计' ? 2 : 1 },
                children:  <a onClick={() => { //进入监测点
              const { overVerifyRateForm: { PollutantType, RegionCode, }, } = this.props;
                this.setState({
                  regionLevel: '',
                  RegionCode: record.ProvinceName == '全部合计'  ? RegionCode : record.regionCode,
                }, () => {
                  this.setState({
                    showDetails: true
                  })
                }) 
            }}>
             {record.ProvinceName == '全部合计' ? '全部合计' : text}
            </a>
          }
        }
        })
        this.setState(
          { checkedValues: res.map(item => item.PollutantCode), columns: newCloum , cityColumns: newCloum2 },
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
  initData = (type, regionCode) => {
    const { dispatch, location, Atmosphere, } = this.props;

    const { regionLevel } = this.state;
    // dispatch({ type: 'autoForm/getRegions', payload: { RegionCode: '', PointMark: '2' } }); //获取行政区列表

    if (!regionCode) { //初始页面
      dispatch({ type: 'overVerifyRate/getAttentionDegreeList', payload: { RegionCode: '' } }); //获取关注列表
      this.setState({ showDetails: false, regionLevel: '' })
    }
    this.updateQueryState({
      PollutantType: type,
      OperationPersonnel: '',
      RegionCode: regionCode == 'all' ? '' : regionCode,
      regionLevel: '',
      // beginTime: moment()
      // .subtract(7, 'days')
      // .format('YYYY-MM-DD 00:00:00'),
      // endTime: moment().format('YYYY-MM-DD 23:59:59'),
    });

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
  originalData = () => {
    this.updateQueryState({
      PollutantType: type,
      OperationPersonnel: '',
      RegionCode: regionCode,
      regionLevel: '',
      // beginTime: moment()
      // .subtract(7, 'days')
      // .format('YYYY-MM-DD 00:00:00'),
      // endTime: moment().format('YYYY-MM-DD 23:59:59'),
    });
  }


  updateQueryState = payload => {
    const { overVerifyRateForm, dispatch } = this.props;

    dispatch({
      type: pageUrl.updateState,
      payload: { overVerifyRateForm: { ...overVerifyRateForm, ...payload } },
    });
  };

  getTableData = () => {
    const { dispatch, overVerifyRateForm } = this.props;
    const { regionLevel } = this.state;
    dispatch({
      type: pageUrl.getData,
      payload: regionLevel ? {
        ...overVerifyRateForm,
        RegionCode: this.state.RegionCode,
        regionLevel: this.state.regionLevel,
      } : {
          ...overVerifyRateForm,
        },
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
      OperationPersonnel: value ? value : '',
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
    this.setState({
      beginTime: date[0].format('YYYY-MM-DD 00:00:00'),
      endTime: date[1].format('YYYY-MM-DD HH:mm:ss'),
    })
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
          let RegionCode = text == '全部合计' ? '' : record.regionCode;
          return <a onClick={() => {
            this.setState({
              showDetails: true,
              RegionCode: RegionCode
            })
          }}>
            {text}
          </a>
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

    this.props.divisorList.map((item, key) => {
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
              title: <span>未核实报警次数</span>,
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
  /**显示弹出 */
  showModal = () => {
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
    } = this.props;
    const { checkedValues, regionLevel } = this.state;

    return (
      <Card
        bordered={false}
        title={
          <Form layout="inline">
            <Row>
              {!regionLevel ? <><Col md={24} style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
                <Form.Item>
                  日期查询：
                  <RangePicker_
                    onRef={this.onRef1}
                    allowClear={false}
                    dataType={dataType}
                    style={{ minWidth: '200px', marginRight: '10px' }}
                    dateValue={[moment(this.state.beginTime), moment(this.state.endTime)]}
                    callback={(dates, dataType) => this.dateChange(dates, dataType)}
                  />
                </Form.Item>
                <Form.Item label="关注程度">
                  <Select
                    placeholder="关注程度"
                    onChange={this.changeAttent}
                    value={AttentionCode}
                    style={{ width: 110 }}
                  >
                    <Option value="">全部</Option>
                    {this.attentchildren()}
                  </Select>
                </Form.Item>
                <Form.Item label="行政区">
                  {/* <Select
                    allowClear
                    placeholder="行政区"
                    onChange={this.changeRegion}
                    value={RegionCode}
                    style={{ width: 100 }}
                  >
                    <Option value="">全部</Option>
                    {this.regchildren()}
                  </Select> */}
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
              </Col>
                <Col md={24} style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
                  {/* <Form.Item label='运维状态'>
                <Select
                  allowClear
                  style={{ width: 200, marginLeft: 10, marginRight: 10 }}
                  placeholder="运维状态"
                  maxTagCount={2}
                  value={OperationPersonnel?OperationPersonnel:undefined}
                  onChange={this.changePperation}
                  maxTagTextLength={5}
                  maxTagPlaceholder="..."
                  >
                  <Option value="1">已设置运维人员</Option>
                  <Option value="2">未设置运维人员</Option>
                </Select>
                </Form.Item>  */}
                  {getFieldDecorator('PollutantList', {
                    initialValue: checkedValues,
                  })(
                    <Checkbox.Group
                      style={{ maxWidth: 'calc(100% - 5.3% - 168px)' }}
                      onChange={this.onCheckboxChange}
                    >
                      {divisorList.map(item => {
                        return (
                          <Checkbox key={item.PollutantCode} value={item.PollutantCode}>
                            {item.PollutantName}
                          </Checkbox>
                        );
                      })}
                    </Checkbox.Group>,
                  )}
                  <Form.Item>
                    <Button type="primary"  loading={this.props.loading} onClick={this.queryClick}>
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
                </Col>
              </>
                :
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
                    this.setState({
                      RegionCode: '',
                      regionLevel: ''
                    }, () => {
                      // this.getTableData(2);
                      this.initData(PollutantType);
                    })
                  }} ><RollbackOutlined />返回</Button>
                </Form.Item>
              }
            </Row>
          </Form>
        }
      >
        <SdlTable
          rowKey={(record, index) => `complete${index}`}
          loading={this.props.loading}
          columns={!this.state.regionLevel? this.state.columns : this.state.cityColumns}
          dataSource={this.props.tableDatas.data}
        // pagination={{
        // showSizeChanger: true,
        // showQuickJumper: true,
        // sorter: true,
        // total: this.props.total,
        //defaultPageSize: 20,
        // pageSize: PageSize,
        // current: PageIndex,
        // pageSizeOptions: ['10', '20', '30', '40', '50'],
        // }}
        />
      </Card>
    );
  }
  entAlarmNum = (record, pollutantCode, status) => { //报警次数 弹框
    const { overVerifyRateForm: { beginTime, endTime, EntCode, PollutantList, RegionCode, AttentionCode, PollutantType, OperationPersonnel } } = this.props;
    this.setState({
      alarmNumVisible: true,
      PollutantCode: pollutantCode,
      dealType: status,
      alarmNumModalTitle: record.regionName + moment(beginTime).format('YYYY年MM月DD号HH时') + '至' + moment(endTime).format('YYYY年MM月DD号HH时') + '超标报警情况',
    })
    this.props.dispatch({
      type: pageUrl.GetAlarmVerifyDetail,
      payload: {
        RegionCode:  record.ProvinceName == '全部合计' ? RegionCode : record.regionCode,
        attentionCode: record.attentionValue,
        PollutantType: record.outletValue,
        // DataType: record.dataType == '日'? 'DayData' : 'HourData',
        DataType: '',
        BeginTime: moment(beginTime).format("YYYY-MM-DD HH:mm:ss"),
        EndTime: moment(endTime).format("YYYY-MM-DD HH:mm:ss"),
        PollutantCode: pollutantCode,
        Status: status == 2 ? '' : status,
        EntCode: '',
        VerifyStatus: this.state.alarmDealTypeListCode,
        operationpersonnel: OperationPersonnel,
        DGIMN: record.DGIMN,
      }
    })
  }
  entAlarmNumQuery = (query) => { //报警次数 点击查询
    const { enterpriseValue, dealType, } = this.state;
    this.props.dispatch({
      type: pageUrl.GetAlarmVerifyDetail,
      payload: {
        ...query,
        EntCode: enterpriseValue,
        Status: dealType,
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
    const { TVisible, TCancle } = this.props
    return (<>
      <Modal
        centered
        title='超标报警核实率'
        visible={TVisible}
        footer={null}
        wrapClassName='spreadOverModal'
        className={styles.overVerifyModalSty}
        destroyOnClose
        onCancel={() => { TCancle(); }}>
        {
          !this.state.showDetails && this.showModal()
        }
        {
          this.state.showDetails && <PointVerifyLstModal RegionCode={this.state.RegionCode} onBack={() => {
            this.setState({
              showDetails: false,
              RegionCode: this.state.RegionCodeined,
              regionLevel: 2,
            })
          }} />
        }
      </Modal>
      <Modal
        centered
        title={this.state.alarmNumModalTitle}
        visible={this.state.alarmNumVisible}
        footer={null}
        wrapClassName='spreadOverModal'
        onCancel={() => { this.setState({ alarmNumVisible: false }) }}
        zIndex={1001}
      >
        <div style={{ marginBottom: 10 }}>
          <EntAtmoList placeholder="企业列表" regionCode={this.state.regionCode} onChange={(value) => {
            this.setState({
              enterpriseValue: value
            })
          }} EntCode={this.state.enterpriseValue} style={{ width: 200, marginRight: 10 }} />
          <Radio.Group value={this.state.dealType} style={{ marginRight: 10, marginLeft: 10 }} onChange={(e) => {
            this.setState({
              dealType: e.target.value,
            })
          }}>
            <Radio.Button value="2">全部</Radio.Button>
            <Radio.Button value="1">已核实</Radio.Button>
            <Radio.Button value="0">待核实</Radio.Button>
          </Radio.Group>
          <Button type='primary' loading={this.props.alarmVerifyDetailLoaing}  style={{ marginRight: 10 }} onClick={() => { this.entAlarmNumQuery(this.props.alarmVerifyQueryPar) }}> 查询</Button>
          <Button loading={this.props.exportAlarmVerifyDetailLoaing} onClick={()=>{this.entAlarmNumExport(this.props.alarmVerifyQueryPar)}}><ExportOutlined /> 导出</Button>
          <div style={{ marginTop: 10 }}>
            {this.state.dealType === '1' ?
              <div>
                <label style={{ fontSize: 14, marginRight: 10, marginLeft: 10 }}>核实结果:</label>
                <Checkbox.Group value={this.state.alarmDealTypeListCode}
                  onChange={(checkedValues) => {this.setState({ alarmDealTypeListCode: checkedValues }) } }>
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
    </>
    )
  }
}
