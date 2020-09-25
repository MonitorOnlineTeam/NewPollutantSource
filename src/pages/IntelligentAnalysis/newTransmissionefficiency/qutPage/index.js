/**
 * 功  能：有效传输率
 * 创建人：吴建伟
 * 创建时间：2019.08.12
 */
import React, { Component } from 'react';
import {
  Card,
  Table,
  DatePicker,
  Progress,
  Row,
  Popover,
  Col,
  Icon,
  Badge,
  Modal,
  Input,
  Button,
  Form,
  Select,
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import Link from 'umi/link';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import SdlTable from '@/components/SdlTable';
import DatePickerTool from '@/components/RangePicker/DatePickerTool';
import { router } from 'umi';
import styles from '../style.less';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import EnterpriseModel from '../components/enterpriseModel';

const { Search } = Input;
const { MonthPicker } = DatePicker;
const { Option } = Select;
const monthFormat = 'YYYY-MM';

const pageUrl = {
  updateState: 'newtransmissionefficiency/updateState',
  getData: 'newtransmissionefficiency/getQutletData',
};
const content = <div>当有效传输率未到达90%时判定为未达标</div>;
@connect(({ loading, newtransmissionefficiency }) => ({
  priseList: newtransmissionefficiency.priseList,
  exloading: loading.effects['newtransmissionefficiency/ExportData'],
  loading: loading.effects[pageUrl.getData],
  total: newtransmissionefficiency.qutleTotal,
  tableDatas: newtransmissionefficiency.qutleTableDatas,
  queryPar: newtransmissionefficiency.qutletQueryPar,
  entName: newtransmissionefficiency.entName,
  pageSize: newtransmissionefficiency.pageSize,
  pageIndex: newtransmissionefficiency.pageIndex,
}))
@Form.create()
export default class EntTransmissionEfficiency extends Component {
  constructor(props) {
    super(props);

    this.state = {
      beginTime: moment(new Date()).subtract(1, 'months'),
      endTime: moment(new Date()),
      EnterpriseCode: '',
      EnterpriseName: '',
      visible: false,
      eName: '',
      regions: '',
      effectiveVisible: false,
      effectiveLoading: false,
    };
  }

  componentWillMount() {
    this.initData();
  }
  initData = () => {
    const { dispatch, location } = this.props;

    this.updateQueryState({
      RegionCode: location.query.RegionCode,
    });

    dispatch({
      //获取企业列表
      type: 'newtransmissionefficiency/getEntByRegion',
      payload: { RegionCode: location.query.RegionCode },
    });

    this.getTableData();
  };
  updateQueryState = payload => {
    const { queryPar, dispatch } = this.props;

    dispatch({
      type: pageUrl.updateState,
      payload: { qutletQueryPar: { ...queryPar, ...payload } },
    });
  };

  getTableData = () => {
    const { dispatch, queryPar } = this.props;
    dispatch({
      type: pageUrl.getData,
      payload: { ...queryPar },
    });
  };

  handleTableChange = (pagination, filters, sorter) => {
    if (sorter.order) {
      this.updateQueryState({
        // transmissionEffectiveRate: sorter.order,
        pageIndex: pagination.current,
        pageSize: pagination.pageSize,
      });
    } else {
      this.updateQueryState({
        // transmissionEffectiveRate: 'ascend',
        pageIndex: pagination.current,
        pageSize: pagination.pageSize,
      });
    }
    this.getTableData(pagination.current);
  };

  children = () => {
    const { priseList } = this.props;

    const selectList = [];
    if (priseList.length > 0) {
      priseList.map(item => {
        selectList.push(
          <Option key={item.key} value={item.value}>
            {item.title}
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

  changeRegion = value => {
    this.updateQueryState({
      RegionCode: value,
    });
  };

  //创建并获取模板
  Template = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'newtransmissionefficiency/ExportData',
      payload: {
        callback: data => {
          downloadFile(data);
        },
      },
    });
  };
  dateCallback = date => {
    // console.log(date[0].format("YYYY-MM-DD"))
    this.updateQueryState({
      beginTime: date[0].format('YYYY-MM-DD HH:mm:ss'),
      endTime: date[1].format('YYYY-MM-DD HH:mm:ss'),
    });
  };
  //查询事件
  queryClick = () => {
    this.getTableData();
  };

  //手工生成有效传输效率数据
  exportData = () => {
    this.setState({ effectiveVisible: true });
  };
  effectiveOk = () => {
    alert('it is ok');
  };

  priseClick = text => {
    //企业下有效传输效率
    const {
      dispatch,
      queryPar: { RegionCode, PollutantType, beginTime, endTime },
      entName,
    } = this.props;

    let priseQueryPar = {
      beginTime: beginTime,
      endTime: endTime,
      PollutantType: PollutantType,
      RegionCode: RegionCode,
      EntCode: '',
      // PageIndex: 4,
      // PageSize: 5
    };

    this.setState({ visible: true }, () => {
      dispatch({
        type: pageUrl.updateState,
        payload: {
          entName: `${text}（${moment(beginTime).format('YYYY/MM/DD')} - ${moment(endTime).format(
            'YYYY/MM/DD',
          )}） `,
        },
      });
      dispatch({
        type: 'newtransmissionefficiency/getTransmissionEfficiencyForEnt',
        payload: { ...priseQueryPar },
      });
    });
  };
  render() {
    const { eName } = this.state;
    const {
      exloading,
      queryPar: { PollutantType, beginTime, endTime },
      entName,
    } = this.props;
    const columns = [
      {
        title: <span style={{ fontWeight: 'bold' }}>行政区</span>,
        dataIndex: 'RegionName',
        key: 'RegionName',
        // width: '20%',
        align: 'center',
        render: (text, record) => {
          return <Link to={{ pathname: '', query: {} }} />;
        },
      },
      {
        title: <span style={{ fontWeight: 'bold' }}>考核企业名称</span>,
        dataIndex: 'EnterpriseName',
        key: 'EnterpriseName',
        align: 'center',
        render: (text, record) => {
          return (
            <a href="#" onClick={this.priseClick.bind(this, text)}>
              {text}
            </a>
          );
        },
      },
      {
        title: <span style={{ fontWeight: 'bold' }}>考核监测点数</span>,
        dataIndex: 'CountPoint',
        key: 'CountPoint',
        sorter: (a, b) => a.CountPoint - b.CountEnt,
        // width: '20%',
        align: 'center',
        render: (text, record) => text,
      },
      {
        title: <span style={{ fontWeight: 'bold' }}>有效率</span>,
        dataIndex: 'EffectiveRate',
        key: 'EffectiveRate',
        // width: '10%',
        align: 'center',
        render: (text, record) => {
          if (record.IsStop) {
            return <span>停运</span>;
          }
          if (record.AvgEffectiveRate <= text) {
            return <span>{`${(parseFloat(text) * 100).toFixed(2)}%`}</span>;
          }
          const content = (
            <span>
              <Icon type="warning" style={{ color: '#EEC900' }} />
              平均值{`${(parseFloat(record.AvgEffectiveRate) * 100).toFixed(2)}%`}
            </span>
          );
          return (
            <Popover content={content} trigger="hover">
              <span className={styles.avgtext}>
                <Badge className={styles.warningdata} status="warning" />
                {`${(parseFloat(text) * 100).toFixed(2)}%`}
              </span>{' '}
            </Popover>
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
          if (record.IsStop) {
            return <span>停运</span>;
          }
          if (record.AvgTransmissionRate <= text) {
            return <span>{`${(parseFloat(text) * 100).toFixed(2)}%`}</span>;
          }
          const content = (
            <span>
              <Icon type="warning" style={{ color: '#EEC900' }} />
              平均值{`${(parseFloat(record.AvgTransmissionRate) * 100).toFixed(2)}%`}
            </span>
          );
          return (
            <Popover content={content} trigger="hover">
              <span className={styles.avgtext}>
                <Badge className={styles.warningdata} status="warning" />
                {`${(parseFloat(text) * 100).toFixed(2)}%`}
              </span>{' '}
            </Popover>
          );
        },
      },
      ,
      {
        title: <span style={{ fontWeight: 'bold' }}>有效传输率</span>,
        dataIndex: 'TransmissionEffectiveRate',
        key: 'TransmissionEffectiveRate',
        sorter: (a, b) => a.TransmissionEffectiveRate - b.TransmissionEffectiveRate,
        render: (text, record) => {
          if (record.IsStop) {
            return <span>停运</span>;
          }
          // 红色：#f5222d 绿色：#52c41a
          const percent = (parseFloat(text) * 100).toFixed(2);
          if (percent >= 90) {
            return (
              <div>
                <Progress
                  successPercent={percent}
                  percent={percent - 0}
                  size="small"
                  format={percent => <span style={{ color: 'black' }}>{percent}%</span>}
                />
              </div>
            );
          }
          return (
            <div>
              <Progress
                successPercent={0}
                percent={percent - 0}
                status="exception"
                size="small"
                format={percent => <span style={{ color: 'black' }}>{percent}%</span>}
              />
            </div>
          );
        },
      },
    ];

    return (
      <BreadcrumbWrapper title="有效传输率">
        <Card
          bordered={false}
          title={
            <>
              <Form layout="inline">
                <Form.Item>
                  时间选择：
                  {/* <DatePickerTool defaultValue={this.state.beginTime} picker="month" allowClear={false} callback={this.onDateChange} /> */}
                  <RangePicker_
                    dateValue={[moment(beginTime), moment(endTime)]}
                    format="YYYY-MM-DD"
                    callback={(dates, dataType) => this.dateCallback(dates, dataType)}
                    allowClear={false}
                  />
                </Form.Item>
                <Form.Item>
                  <Select
                    placeholder="请选择企业类型"
                    onChange={this.typeChange}
                    value={PollutantType}
                    style={{ width: 200, marginLeft: 10 }}
                  >
                    <Option value="">全部</Option>
                    <Option value="1">废水</Option>
                    <Option value="2">废气</Option>
                  </Select>
                </Form.Item>
                <Form.Item>
                  <Select
                    allowClear
                    placeholder="企业列表"
                    onChange={this.changeRegion}
                    value={this.props.RegionCode ? this.props.RegionCode : undefined}
                    style={{ width: 200, marginLeft: 10 }}
                  >
                    {this.children()}
                  </Select>
                </Form.Item>
                <Form.Item>
                  <Button type="primary" onClick={this.queryClick}>
                    查询
                  </Button>
                  <Button style={{ margin: '0 5px' }} onClick={this.Template} loading={exloading}>
                    <Icon type="export" />
                    导出
                  </Button>
                  <Button
                    onClick={() => {
                      this.props.history.go(-1);
                    }}
                  >
                    <Icon type="rollback" />
                    返回
                  </Button>
                </Form.Item>
              </Form>
              <div style={{ paddingBottom: 10 }}>
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
                  ≤90%未达标
                </span>
              </div>
            </>
          }
        >
          <>
            <SdlTable
              rowKey={(record, index) => `complete${index}`}
              loading={this.props.loading}
              columns={columns}
              bordered={false}
              onChange={this.handleTableChange}
              dataSource={this.props.tableDatas}
              // scroll={{ y: 'calc(100vh - 450px)' }}
              // scroll={{ y: 550 }}
              pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                sorter: true,
                total: this.props.total,
                pageSize: this.props.pageSize,
                current: this.props.pageIndex,
                pageSizeOptions: ['10', '20', '30', '40', '50'],
              }}
            />
            <Modal
              title="企业下传输有效效率"
              visible={this.state.visible}
              footer={null}
              width={'90%'}
              onCancel={() => {
                this.setState({ visible: false });
              }}
            >
              <EnterpriseModel />
            </Modal>
          </>
        </Card>
        {/* </div> */}
      </BreadcrumbWrapper>
    );
  }
}
