/*
 * @Author: Jiaqi 
 * @Date: 2020-03-27 15:20:58 
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2020-04-04 08:45:33
 * @Desc: 季度有效数据捕集率页面
 */
import React, { Component } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
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
  Select,
  Input
} from 'antd';
import moment from 'moment';
import { connect } from "dva"
import SdlTable from '@/components/SdlTable';
import YearPicker from '@/components/YearPicker';
import styles from './index.less';

const { MonthPicker } = DatePicker;
const InputGroup = Input.Group;
const { Option } = Select;

const currMonth = new Date().getMonth();

@connect(({
  loading,
  transmissionefficiency
}) => ({
  loading: loading.effects["transmissionefficiency/getEntData"],
  total: transmissionefficiency.total,
  pageSize: transmissionefficiency.pageSize,
  pageIndex: transmissionefficiency.pageIndex,
  tableDatas: transmissionefficiency.enttableDatas,
}))
class QuartDataCaptureRate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      yearValue: moment(),
      currQuarter: Math.floor((currMonth % 3 == 0 ? (currMonth / 3) : (currMonth / 3 + 1))),
      columns: [
        {
          title: "企业名称",
          dataIndex: 'EnterpriseName',
        },
        {
          title: "应捕集个数",
          dataIndex: 'ShouldNumber',
        },
        {
          title: "实捕集个数",
          dataIndex: 'TransmissionNumber',
        },
        {
          title: "有效个数",
          dataIndex: 'EffectiveNumber',
        },
        {
          title: "有效数据捕集率",
          dataIndex: 'TransmissionEffectiveRate',
          key: 'TransmissionEffectiveRate',
          // sorter: true,
          render: (text, record) => {
            // 红色：#f5222d 绿色：#52c41a
            const percent = (parseFloat(text) * 100).toFixed(2);
            const status = percent >= 90 ? "" : "exception"
            return (
              <div className={styles["progress-box"]}>
                <Progress
                  successPercent={0}
                  percent={percent - 0}
                  status={status}
                  size="small"
                  format={percent => (<span style={{ color: 'black' }}>{percent}%</span>)}
                />
              </div>
            );
          }
        },
      ]
    };
  }

  componentDidMount() {
    this.getTableData()
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.props.dispatch({
      type: "transmissionefficiency/updateState",
      payload: {
        // transmissionEffectiveRate: sorter.order || "ascend",
        pageIndex: pagination.current,
        pageSize: pagination.pageSize
      }
    })
    this.getTableData(pagination.current);
  }

  getTableData = (pageIndex = 1) => {
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
    this.props.dispatch({
      type: "transmissionefficiency/getEntData",
      payload: {
        pageIndex: pageIndex,
        BeginTime,
        EndTime,
      },
    });
  }

  render() {
    const { columns, dataSource, yearValue, currQuarter } = this.state;
    const { tableDatas, loading } = this.props;
    return (
      <BreadcrumbWrapper>
        {/* <div className="contentContainer"> */}
        <Card
          bordered={false}
          extra={
            <div style={{display: 'flex', alignItems: 'center'}}>
              <div style={{
                width: 20,
                height: 9,
                backgroundColor: '#52c41a',
                display: 'inline-block',
                borderRadius: '20%',
                cursor: 'pointer',
                marginRight: 3
              }} /> <span style={{ cursor: 'pointer' }}> 有效数据捕集率达标</span>
              <div style={{
                width: 20,
                height: 9,
                backgroundColor: '#f5222d',
                display: 'inline-block',
                borderRadius: '20%',
                cursor: 'pointer',
                marginLeft: 60,
                marginRight: 3
              }} /><span style={{ cursor: 'pointer' }}> 有效数据捕集率未达标</span>

              <span style={{ color: '#b3b3b3', marginLeft: 20 }}>
                时间选择：
                  </span>
              <div style={{ display: 'inline-block' }}>
                <InputGroup compact>
                  <YearPicker
                    allowClear={false}
                    // style={{ width: '100%' }}
                    value={yearValue}
                    _onPanelChange={v => {
                      this.setState({
                        yearValue: v
                      }, () => {
                        this.getTableData(this.props.pageIdex)
                      })
                      // this.props.form.setFieldsValue({ ReportTime: v });
                    }}
                  />
                  <Select value={currQuarter} onChange={(value) => {
                    this.setState({
                      currQuarter: value
                    }, () => {
                      this.getTableData(this.props.pageIdex)
                    })
                  }}>
                    <Option value={1}>第一季度</Option>
                    <Option value={2}>第二季度</Option>
                    <Option value={3}>第三季度</Option>
                    <Option value={4}>第四季度</Option>
                  </Select>
                </InputGroup>
              </div>
            </div>
          }
        >
          <SdlTable
            loading={loading}
            columns={columns}
            bordered={false}
            onChange={this.handleTableChange}
            dataSource={tableDatas}
            // scroll={{ y: 'calc(100vh - 450px)' }}
            pagination={{
              // showSizeChanger: true,
              // showQuickJumper: true,
              sorter: true,
              'total': this.props.total,
              'pageSize': this.props.pageSize,
              'current': this.props.pageIndex,
              // pageSizeOptions: ['10', '20', '30', '40', '50']
            }}
          />
        </Card>
        {/* </div> */}
      </BreadcrumbWrapper>
    );
  }
}

export default QuartDataCaptureRate;