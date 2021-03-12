/**
 * 功  能：
 * 创建人：
 * 创建时间：
 */
import React, { Component } from 'react';
import { WarningOutlined } from '@ant-design/icons';
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
  Button,
  Modal,
  message,
} from 'antd';
import moment from 'moment';
import styles from '../style.less';
import { connect } from 'dva';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import SdlTable from '@/components/SdlTable';
import { onlyOneEnt } from '@/config';
import RangePicker_ from '@/components/RangePicker';
import { interceptTwo } from '@/utils/utils';
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
  interceptTwo=(value)=>{
    const data = value.toString();
    const result = data.substring(0,data.indexOf(".")+3)
    return result;
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const columns = [
      {
        title: <span style={{ fontWeight: 'bold' }}>排口类型</span>,
        dataIndex: 'PollutantTypeName',
        key: 'PollutantTypeName',
        align: 'center',
        render: (text, record) => {
          return <span>{text}</span>
        },
      },
      {
        title: <span style={{ fontWeight: 'bold' }}>排口名称</span>,
        dataIndex: 'PointName',
        key: 'PointName',
        align: 'center',
        render: (text, record) => {
          return <span>{text}</span>
        },
      },
      {
        title: <span style={{ fontWeight: 'bold' }}>应传个数</span>,
        dataIndex: 'ShouldNumber',
        key: 'ShouldNumber',
        align: 'center',
        render: (text, record) => {
          if (record.ShouldNumber==0) {
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
          if (record.ShouldNumber==0) {
            return <span className={styles.normaldata}>停运</span>;
          }
          if (record.AvgTransmissionNumber <= text) {
            return <span className={styles.normaldata}>{text}</span>;
          }
          const content = (
            <span>
              <WarningOutlined style={{ color: '#EEC900' }} />
              平均值{record.AvgTransmissionNumber}
            </span>
          );
          return (
            // <Popover content={content} trigger="hover">
            <span className={styles.avgtext}>
              {/* {' '} */}
              {/* <Badge className={styles.warningdata} status="warning" /> */}
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
          if (record.ShouldNumber==0) {
            return <span className={styles.normaldata}>停运</span>;
          }
          if (record.AvgEffectiveNumber <= text) {
            return <span className={styles.normaldata}>{text}</span>;
          }
          // const content = (
          //   <span>
          //     <Icon type="warning" style={{ color: '#EEC900' }} />
          //     平均值{record.AvgEffectiveNumber}
          //   </span>
          // );
          return (
            // <Popover content={content} trigger="hover">
            <span className={styles.avgtext}>
              {/* <Badge className={styles.warningdata} status="warning" /> */}
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
          if (record.ShouldNumber==0) {
            return <span className={styles.normaldata}>停运</span>;
          }
          if (record.AvgTransmissionRate <= text) {
            return (
              <span className={styles.normaldata}>{`${interceptTwo(Number(text) * 100)}%`}</span>
            );
          }
          // const content = (
          //   <span>
          //     <Icon type="warning" style={{ color: '#EEC900' }} />
          //     平均值{`${(parseFloat(record.AvgTransmissionRate) * 100).toFixed(2)}%`}
          //   </span>
          // );
          return (
            // <Popover content={content} trigger="hover">
            <span className={styles.avgtext}>
              {/* <Badge className={styles.warningdata} status="warning" /> */}
              {`${interceptTwo(Number(text) * 100)}%`}
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
          if (record.ShouldNumber==0) {
            return <span className={styles.normaldata}>停运</span>;
          }
          if (record.AvgEffectiveRate <= text) {
            return (
              <span className={styles.normaldata}>{`${interceptTwo(Number(text) * 100)}%`}</span>
            );
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
        sorter: (a, b) => a.TransmissionEffectiveRate - b.TransmissionEffectiveRate,
        render: (text, record) => {
          if (record.ShouldNumber==0) {
            return <span className={styles.normaldata}>停运</span>;
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
                  style={{width:'80%'}}
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
                style={{width:'80%'}}
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
              // pagination={{
              //   showSizeChanger: false,
              //   showQuickJumper: false,
                // //defaultPageSize:20
              // }}
            />
          </Card>
        </Row>
      </div>
    );
  }
}
