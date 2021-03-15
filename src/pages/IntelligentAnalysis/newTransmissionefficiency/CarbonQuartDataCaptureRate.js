/**
 * 功  能：有效传输率
 * 创建人：贾安波
 * 创建时间：
 */
import React, { Component } from 'react';
import { ExportOutlined, QuestionCircleTwoTone } from '@ant-design/icons';
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
import { downloadFile, interceptTwo } from '@/utils/utils';
import SdlCascader from '../../AutoFormManager/SdlCascader';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import RegionList from '@/components/RegionList'
import YearPicker from '@/components/YearPicker';

const { Search } = Input;
const { MonthPicker } = DatePicker;
const { Option } = Select;
const InputGroup = Input.Group;

const currMonth = new Date().getMonth();

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
  beginTime: newtransmissionefficiency.beginTime,
  endTime: newtransmissionefficiency.endTime,
  pollutantType: newtransmissionefficiency.pollutantType,
  assessment: newtransmissionefficiency.assessment,
  RegionCode: newtransmissionefficiency.RegionCode,
}))
@Form.create()
export default class CarbonQuartDataCaptureRate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      EnterpriseCode: '',
      EnterpriseName: '',
      visible: false,
      eName: '',
      regions: '',
      effectiveLoading: false,
      yearValue: moment(),
      currQuarter: Math.floor((currMonth % 3 == 0 ? (currMonth / 3) : (currMonth / 3 + 1))),
    };
  }

  componentWillMount() {
    this.updateState({
      pollutantType: 2,
      assessment: undefined,
    })
    this.getTableData();
    this.props.dispatch({
      type: 'autoForm/getRegions',
      payload: {
        RegionCode: '',
        PointMark: '2',
      },
    });
  }

  handleQuarterTime = () => {
    let BeginTime; let EndTime;
    const { currQuarter, yearValue } = this.state;
    switch (currQuarter) {
      case 1:
        BeginTime = moment(yearValue).format('YYYY-01-01 00:00:00')
        EndTime = moment(yearValue).format('YYYY-04-01 00:00:00')
        break;
      case 2:
        BeginTime = moment(yearValue).format('YYYY-04-01 00:00:00')
        EndTime = moment(yearValue).format('YYYY-07-01 00:00:00')
        break;
      case 3:
        BeginTime = moment(yearValue).format('YYYY-07-01 00:00:00')
        EndTime = moment(yearValue).format('YYYY-10-01 00:00:00')
        break;
      case 4:
        BeginTime = moment(yearValue).format('YYYY-10-01 00:00:00')
        EndTime = moment(yearValue).format('YYYY-12-31 59:59:59')
        break;
    }
    return [BeginTime, EndTime];
  }

  updateState = payload => {
    this.props.dispatch({
      type: pageUrl.updateState,
      payload,
    });
  };

  getTableData = () => {
    let time = this.handleQuarterTime();
    this.updateState({
      beginTime: time[0],
      endTime: time[1]
    })
    this.props.dispatch({
      type: pageUrl.getData,
      payload: {
        PollutantType: 2,
        Assessment: undefined,
        beginTime: time[0],
        endTime: time[1]
      }
    });
  };

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
    this.updateState({
      pollutantType: value,
    });
  };

  asseChange = value => {
    this.updateState({
      assessment: value,
    });
  };

  changeRegion = value => {
    this.updateState({
      RegionCode: value,
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

  //查询事件
  queryClick = () => {
    let time = this.handleQuarterTime();
    this.props.dispatch({
      type: pageUrl.getData,
      payload: {
        PollutantType: 2,
        Assessment: undefined,
        beginTime: time[0],
        endTime: time[1]
      }
    });
    this.updateState({
      beginTime: time[0],
      endTime: time[1]
    })
  };

  interceptTwo = (value) => {
    const data = value.toString();
    const result = data.substring(0, data.indexOf(".") + 3)
    return result;
  }

  // componentWillUnmount() {
  //   this.props.dispatch({
  //     type: "newtransmissionefficiency/resetState"
  //   })
  // }
  

  render() {
    const { eName, yearValue, currQuarter } = this.state;
    const { regionList, exRegionloading, RegionCode } = this.props;
    const columns = [
      {
        title: <span style={{ fontWeight: 'bold' }}>行政区</span>,
        dataIndex: 'RegionName',
        key: 'RegionName',
        align: 'center',
        render: (text, record) => {
          return <Link to={{
            pathname: '/Intelligentanalysis/carbonQuartDataCaptureRate/qutDetail',
            query: { RegionCode: record.RegionCode },
          }}
          >
            {text}
          </Link>

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
          if (record.ShouldNumber == 0) {
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
          if (record.ShouldNumber == 0) {
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
          if (record.ShouldNumber == 0) {
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
                  style={{ width: '90%' }}
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
                style={{ width: '90%' }}
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
          if (record.ShouldNumber == 0) {
            return <span>停运</span>;
          } else {
            return <span>{text}</span>
          }
        },
      },
    ];
    return (
      <BreadcrumbWrapper>
        {/* <div className="contentContainer"> */}
        <Card
          bordered={false}
          title={
            <>
              <Form layout="inline">
                <Form.Item>
                  查询时间：
                  <div style={{ display: 'inline-block' }}>
                    <InputGroup compact>
                      <YearPicker
                        allowClear={false}
                        // style={{ width: '100%' }}
                        value={yearValue}
                        _onPanelChange={v => {
                          this.setState({
                            yearValue: v
                          })
                        }}
                      />
                      <Select value={currQuarter} onChange={(value) => {
                        this.setState({
                          currQuarter: value
                        })
                      }}>
                        <Option value={1}>第一季度</Option>
                        <Option value={2}>第二季度</Option>
                        <Option value={3}>第三季度</Option>
                        <Option value={4}>第四季度</Option>
                      </Select>
                    </InputGroup>
                  </div>
                </Form.Item>
                <Form.Item>
                  <RegionList changeRegion={this.changeRegion} RegionCode={RegionCode} />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" onClick={this.queryClick}>
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
              </Form>
              <div style={{ paddingTop: 10 }}>
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
                  {' '}
                  {`<90%未达标`}
                </span>
                <span style={{ color: '#f5222d', fontSize: 14, paddingLeft: 15 }}>每日凌晨计算昨日的有效传输率，每月4号和10号重新计算上个月的有效传输率</span>
              </div>
            </>
          }
        >
          <SdlTable
            rowKey={(record, index) => `complete${index}`}
            loading={this.props.loading}
            columns={columns}
            bordered={false}
            dataSource={this.props.tableDatas}
            pagination={false}
          />
        </Card>
      </BreadcrumbWrapper>
    );
  }
}
