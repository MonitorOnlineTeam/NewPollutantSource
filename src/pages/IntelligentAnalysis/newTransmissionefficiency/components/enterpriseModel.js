/**
 * 功  能：有效传输率
 * 创建人：吴建伟
 * 创建时间：2018.12.08
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
  Button,
  Modal,
  message,
  Form,
} from 'antd';
import moment from 'moment';
import styles from '../style.less';
import { connect } from 'dva';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import SdlTable from '@/components/SdlTable';
import { onlyOneEnt } from '@/config';
import RangePicker_ from '@/components/RangePicker';

const FormItem = Form.Item;
const { MonthPicker } = DatePicker;
const monthFormat = 'YYYY-MM';
const pageUrl = {
  updateState: 'newtransmissionefficiency/updateState',
  getData: 'newtransmissionefficiency/getTransmissionEfficiencyForEnt',
};
@Form.create()
@connect(({ loading, newtransmissionefficiency }) => ({
  loading: loading.effects[pageUrl.getData],
  total: newtransmissionefficiency.priseTotal,
  tableDatas: newtransmissionefficiency.priseTableDatas,
  entName: newtransmissionefficiency.entName,
  queryPar: newtransmissionefficiency.priseQueryPar,
}))
export default class enterpriseEfficiency extends Component {
  constructor(props) {
    super(props);

    this.state = {
      datetimes: [],
    };
  }

  componentWillMount() {
    // this.getTableData();
  }

  updateState = payload => {
    this.props.dispatch({
      type: pageUrl.updateState,
      payload,
    });
  };

  // getTableData = () => {
  //     const { queryPar } = this.props;
  //         this.props.dispatch({
  //             type: pageUrl.getData,
  //             payload: {...queryPar },
  //         });

  // }

  // handleTableChange = (pagination, filters, sorter) => {
  //     if (sorter.order) {
  //         this.updateState({
  //             transmissionEffectiveRate: sorter.order,
  //             pageIndex: pagination.current,
  //             pageSize: pagination.pageSize,
  //         });
  //     } else {
  //         this.updateState({
  //             transmissionEffectiveRate: 'ascend',
  //             pageIndex: pagination.current,
  //             pageSize: pagination.pageSize,
  //         });
  //     }
  //     this.getTableData(pagination.current);
  // }

  render() {
    const { getFieldDecorator } = this.props.form;
    const columns = [
      {
        title: <span style={{ fontWeight: 'bold' }}>排口类型</span>,
        dataIndex: 'PollutantTypeName',
        key: 'PollutantTypeName',
        align: 'center',
        render: (text, record) => text,
      },
      {
        title: <span style={{ fontWeight: 'bold' }}>排口名称</span>,
        dataIndex: 'PointName',
        key: 'PointName',
        align: 'center',
        render: (text, record) => text,
      },
      {
        title: <span style={{ fontWeight: 'bold' }}>应传个数</span>,
        dataIndex: 'ShouldNumber',
        key: 'ShouldNumber',
        align: 'center',
        render: (text, record) => {
          if (record.IsStop) {
            return <span className={styles.normaldata}>停运</span>;
          }

          return text;
        },
      },
      {
        title: <span style={{ fontWeight: 'bold' }}>实传个数</span>,
        dataIndex: 'TransmissionNumber',
        key: 'TransmissionNumber',
        align: 'center',
        render: (text, record) => {
          if (record.IsStop) {
            return <span className={styles.normaldata}>停运</span>;
          }
          if (record.AvgTransmissionNumber <= text) {
            return <span className={styles.normaldata}>{text}</span>;
          }
          const content = (
            <span>
              <Icon type="warning" style={{ color: '#EEC900' }} />
              平均值{record.AvgTransmissionNumber}
            </span>
          );
          return (
            // <Popover content={content} trigger="hover">
            <span className={styles.avgtext}>
              {/* {' '} */}
              <Badge className={styles.warningdata} status="warning" />
              {text}
            </span>
            // {' '}
            // </Popover>
          );
        },
      },
      {
        title: <span style={{ fontWeight: 'bold' }}>有效个数</span>,
        dataIndex: 'TransmissionNumber',
        key: 'TransmissionNumber',
        align: 'center',
        render: (text, record) => {
          if (record.IsStop) {
            return <span className={styles.normaldata}>停运</span>;
          }
          if (record.AvgEffectiveNumber <= text) {
            return <span className={styles.normaldata}>{text}</span>;
          }
          const content = (
            <span>
              <Icon type="warning" style={{ color: '#EEC900' }} />
              平均值{record.AvgEffectiveNumber}
            </span>
          );
          return (
            // <Popover content={content} trigger="hover">
            <span className={styles.avgtext}>
              <Badge className={styles.warningdata} status="warning" />
              {text}
            </span>
            // {' '}
            // </Popover>
          );
        },
      },
      {
        title: <span style={{ fontWeight: 'bold' }}>传输率</span>,
        dataIndex: 'TransmissionRate',
        key: 'TransmissionRate',
        align: 'center',
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
              <Icon type="warning" style={{ color: '#EEC900' }} />
              平均值{`${(parseFloat(record.AvgTransmissionRate) * 100).toFixed(2)}%`}
            </span>
          );
          return (
            // <Popover content={content} trigger="hover">
            <span className={styles.avgtext}>
              <Badge className={styles.warningdata} status="warning" />
              {`${(parseFloat(text) * 100).toFixed(2)}%`}
            </span>
            // {' '}
            // </Popover>
          );
        },
      },
      {
        title: <span style={{ fontWeight: 'bold' }}>有效率</span>,
        dataIndex: 'EffectiveRate',
        key: 'EffectiveRate',
        align: 'center',
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
              <Icon type="warning" style={{ color: '#EEC900' }} />
              平均值{`${(parseFloat(record.AvgEffectiveRate) * 100).toFixed(2)}%`}
            </span>
          );
          return (
            // <Popover content={content} trigger="hover">
            <span className={styles.avgtext}>
              <Badge className={styles.warningdata} status="warning" />
              {`${(parseFloat(text) * 100).toFixed(2)}%`}
            </span>
            // {' '}
            // </Popover>
          );
        },
      },
      {
        title: <span style={{ fontWeight: 'bold' }}>有效传输率</span>,
        dataIndex: 'TransmissionEffectiveRate',
        key: 'TransmissionEffectiveRate',
        align: 'center',
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
      },
    ];
    return (
      <div>
        <Row className={styles.cardTitle}>
          <Card
            title={<div style={{ marginBottom: 20 }}>{this.props.entName}</div>}
            bordered={false}
            style={{ height: 'auto' }}
            extra={
              <div style={{ marginBottom: 20 }}>
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
                    marginLeft: 35,
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
              // onChange={this.handleTableChange}
              scroll={{ x: null }}
              size="small" // small middle
              dataSource={this.props.tableDatas}
              pagination={{
                showSizeChanger: false,
                showQuickJumper: false,
                // defaultPageSize:20
              }}
            />
          </Card>
        </Row>
      </div>
    );
  }
}
