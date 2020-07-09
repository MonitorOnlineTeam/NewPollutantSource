/**
 * 功  能：有效传输率
 * 创建人：吴建伟
 * 创建时间：2019.08.12
 */
import React, { Component } from 'react';
import { QuestionCircleTwoTone, WarningOutlined } from '@ant-design/icons';
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
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import Link from 'umi/link';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import SdlTable from '@/components/SdlTable';
import DatePickerTool from '@/components/RangePicker/DatePickerTool';
import { router } from 'umi';
import PointIndex from './pointIndex';
import styles from './style.less';

const { Search } = Input;
const { MonthPicker } = DatePicker;
const monthFormat = 'YYYY-MM';

const pageUrl = {
  updateState: 'transmissionefficiency/updateState',
  getData: 'transmissionefficiency/getEntData',
};
const content = <div>当有效传输率未到达90%时判定为未达标</div>;
@connect(({ loading, transmissionefficiency }) => ({
  loading: loading.effects[pageUrl.getData],
  total: transmissionefficiency.entTotal,
  pageSize: transmissionefficiency.pageSize,
  pageIndex: transmissionefficiency.pageIndex,
  tableDatas: transmissionefficiency.enttableDatas,
}))
@Form.create()
export default class EntTransmissionEfficiency extends Component {
  constructor(props) {
    super(props);

    this.state = {
      beginTime: moment(moment().format('YYYY-MM')),
      endTime: '',
      EnterpriseCode: '',
      EnterpriseName: '',
      visible: false,
      eName: '',
    };
  }

  componentWillMount() {
    this.getTableData(1);
  }

  updateState = payload => {
    this.props.dispatch({
      type: pageUrl.updateState,
      payload,
    });
  };

  getTableData = pageIndex => {
    this.props.dispatch({
      type: pageUrl.getData,
      payload: {
        pageIndex,
      },
    });
  };

  handleTableChange = (pagination, filters, sorter) => {
    if (sorter.order) {
      this.updateState({
        transmissionEffectiveRate: sorter.order,
        pageIndex: pagination.current,
        pageSize: pagination.pageSize,
      });
    } else {
      this.updateState({
        transmissionEffectiveRate: 'ascend',
        pageIndex: pagination.current,
        pageSize: pagination.pageSize,
      });
    }
    this.getTableData(pagination.current);
  };

  onDateChange = (value, beginTime, endTime) => {
    this.updateState({
      beginTime,
      endTime,
    });
    this.getTableData(this.props.pageIndex);
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
    // onFilter: (value, record) =>
    //   record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    // onFilterDropdownVisibleChange: visible => {
    //   if (visible) {
    //     setTimeout(() => this.searchInput.select());
    //   }
    // },
  });

  // 企业
  enterpriseChange = value => {
    this.props.dispatch({
      type: pageUrl.getData,
      payload: {
        EnterpriseName: value,
      },
    });
  };

  enterpriseEnter = value => {
    this.props.dispatch({
      type: pageUrl.getData,
      payload: {
        EnterpriseName: value.target.value,
      },
    });
  };

  render() {
    const { eName } = this.state;
    const columns = [
      {
        title: <span style={{ fontWeight: 'bold' }}>企业名称</span>,
        dataIndex: 'EnterpriseName',
        key: 'EnterpriseName',
        width: '30%',
        align: 'left',
        render: (text, record) => text,
      },
      {
        title: <span style={{ fontWeight: 'bold' }}>传输率</span>,
        dataIndex: 'TransmissionRate',
        key: 'TransmissionRate',
        width: '15%',
        align: 'left',
        render: (text, record) => {
          if (record.IsStop) {
            return <span className={styles.normaldata}>停运</span>;
          }
          if (record.AvgTransmissionRate <= text) {
            return (
              <span className={styles.normaldata}>{`${(parseFloat(text) * 100).toFixed(2)}%`}</span>
            );
          }
          const content = (
            <span>
              <WarningOutlined style={{ color: '#EEC900' }} />
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
      {
        title: <span style={{ fontWeight: 'bold' }}>有效率</span>,
        dataIndex: 'EffectiveRate',
        key: 'EffectiveRate',
        width: '15%',
        align: 'left',
        sorter: (a, b) => a.EffectiveRate - b.EffectiveRate,
        render: (text, record) => {
          if (record.IsStop) {
            return <span className={styles.normaldata}>停运</span>;
          }
          if (record.AvgEffectiveRate <= text) {
            return (
              <span className={styles.normaldata}>{`${(parseFloat(text) * 100).toFixed(2)}%`}</span>
            );
          }
          const content = (
            <span>
              <WarningOutlined style={{ color: '#EEC900' }} />
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
        title: (
          <span style={{ fontWeight: 'bold' }}>
            有效传输率
            {/* <Popover content={content} >
                            <QuestionCircleOutlined style={{ color: '#1890FF', marginLeft: 2 }} />
                        </Popover> */}
          </span>
        ),
        dataIndex: 'TransmissionEffectiveRate',
        key: 'TransmissionEffectiveRate',
        // width: '250px',
        width: '30%',
        // align: 'center',
        sorter: true,
        render: (text, record) => {
          if (record.IsStop) {
            return <span className={styles.normaldata}>停运</span>;
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
        ...this.getColumnSearchProps('TransmissionEffectiveRate'),
      },
      {
        title: <span style={{ fontWeight: 'bold' }}>操作</span>,
        dataIndex: 'opt',
        key: 'opt',
        width: '10%',
        align: 'center',
        render: (text, record) => (
          <a
            onClick={() => {
              this.setState({
                visible: true,
                EnterpriseCode: record.EnterpriseCode,
                EnterpriseName: record.EnterpriseName,
              });
              // router.push({
              //     pathname: `/Intelligentanalysis/transmissionefficiency/point/${record.EnterpriseCode}/${record.EnterpriseName}`,
              //     query: {
              //         tabName: "有效传输率 - 详情"
              //     }
              // })
            }}
          >
            查看详情
          </a>
        ),
        // return (
        //     <Link to={`/Intelligentanalysis/transmissionefficiency/point/${record.EnterpriseCode}/${record.EnterpriseName}?tabName=`}> 查看详情 </Link>
        // );
      },
    ];
    return (
      <BreadcrumbWrapper title="有效传输率">
        {/* <div className="contentContainer"> */}
        <Card
          bordered={false}
          title={
            <Form layout="inline">
              <Form.Item>
                时间选择：
                <DatePickerTool
                  defaultValue={this.state.beginTime}
                  picker="month"
                  allowClear={false}
                  callback={this.onDateChange}
                />
              </Form.Item>
              <Form.Item>
                <Search
                  placeholder="企业名称"
                  allowClear
                  onSearch={value => this.enterpriseChange(value)}
                  onPressEnter={value => this.enterpriseEnter(value)}
                  style={{ width: 200, marginLeft: 10 }}
                />
              </Form.Item>
            </Form>
          }
          extra={
            <div>
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
              <span style={{ cursor: 'pointer' }}> 排口有效传输率达标</span>
              <div
                style={{
                  width: 20,
                  height: 9,
                  backgroundColor: '#f5222d',
                  display: 'inline-block',
                  borderRadius: '20%',
                  cursor: 'pointer',
                  marginLeft: 60,
                  marginRight: 3,
                }}
              />
              <span style={{ cursor: 'pointer' }}> 排口有效传输率未达标</span>
            </div>
          }
        >
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
            title="有效传输率 - 详情"
            destroyOnClose
            footer={[]}
            visible={this.state.visible}
            width="90%"
            // style={{ height: "90vh" }}
            onCancel={() => {
              this.setState({ visible: false });
            }}
          >
            <PointIndex
              entcode={this.state.EnterpriseCode}
              entname={this.state.EnterpriseName}
              beginTime={this.state.beginTime}
            ></PointIndex>
          </Modal>
        </Card>
        {/* </div> */}
      </BreadcrumbWrapper>
    );
  }
}
