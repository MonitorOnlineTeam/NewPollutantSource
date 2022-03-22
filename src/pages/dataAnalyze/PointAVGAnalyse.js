/*
 * @Author: Jiaqi 
 * @Date: 2021-12-08 15:02:58 
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2021-12-08 15:26:14
 * @Desc: 站点平局值对比分析
 */

import React, { Component } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import moment from 'moment';
import { connect } from 'dva';
import {
  Spin, Card, Row, Col, DatePicker, Button, message
} from 'antd'
import { Form } from '@ant-design/compatible';
import { ExportOutlined } from '@ant-design/icons';
import YearPicker from '@/components/YearPicker';
import SdlTable from '@/components/SdlTable'

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

@connect(({ loading, dataAnalyze }) => ({
  compareWaterTableData: dataAnalyze.compareWaterTableData,
  pollutantList: dataAnalyze.pollutantList,
  loading: loading.effects["dataAnalyze/getCompareWater"],
  // exportLoading: loading.effects["dataAnalyze/exportCompositeyoyRangeData"],
}))
class PointAVGAnalyse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: [moment().subtract(8, "day"), moment().subtract(1, 'days')],
      reportType: props.match.params.reportType,
      format: props.match.params.reportType === "month" ? "YYYY-MM" : "YYYY",
      columns: [],
    };
    this._SELF_ = {
      formLayout: {
        labelCol: { span: 7 },
        wrapperCol: { span: 17 },
      },
    }
  }

  componentDidMount() {
    this.getPollutantList();
    this.getPageData()
  }

  // 获取污染物
  getPollutantList = () => {
    this.props.dispatch({
      type: 'dataAnalyze/getPollutantList',
      payload: {
        // DGIMN: this.state.DGIMN,
        PollutantType: '6',
        Type: "1"
      },
      callback: (res) => {
        let columns = res.map(item => {
          return {
            title: item.PollutantName,
            dataIndex: item.PollutantCode,
            width: 120,
            render: (text, record) => {
              // return text !== undefined ? text : '-'
              return text !== null && text !== undefined ? text : '-'
            }
          }
        })
        this.setState({
          columns: [
            {
              title: '排口名称',
              width: 300,
              dataIndex: 'DGIMN',
            },
            ...columns
          ]
        })
      }
    })
  }

  componentWillReceiveProps(nextProps) {

  }

  getPageData = () => {
    const time = this.state.time;
    this.props.dispatch({
      type: "dataAnalyze/getCompareWater",
      payload: {
        BeginTime: moment(time[0]).format("YYYY-MM-DD 00:00:00"),
        EndTime: moment(time[1]).format("YYYY-MM-DD 00:00:00"),
      }
    })
  }

  // 导出
  exportReport = () => {
    const time = this.state.time;
    this.props.dispatch({
      type: "dataAnalyze/exportCompositeyoyRangeData",
      payload: {
        BeginTime: moment(time[0]).format("YYYY-MM-DD 00:00:00"),
        EndTime: moment(time[1]).format("YYYY-MM-DD 00:00:00"),
      }
    })
  }

  render() {
    const { compareWaterTableData, loading, exportLoading, pollutantList } = this.props;
    const { formLayout } = this._SELF_;
    // const { time } = this.state;
    const { time, columns } = this.state;

    // console.log('columns=', columns)

    // let pollutantColumns = pollutantList.map(item => {
    //   return {
    //     title: item.PollutantName,
    //     dataIndex: item.PollutantCode,
    //     // width: 80,
    //     render: (text, record) => {
    //       return text !== null && text !== undefined ? text : '-'
    //     }
    //   }
    // })
    // let columns = [
    //   {
    //     title: '排口名称',
    //     width: 300,
    //     dataIndex: 'DGIMN',
    //   },
    //   ...pollutantColumns
    // ]

    return (
      <BreadcrumbWrapper>
        <Spin spinning={loading} delay={500}>
          <Card className="contentContainer">
            <Form style={{ marginBottom: 20 }}>
              <Row>
                <Col>
                  <FormItem label="统计时间" style={{ width: '100%' }}>
                    <RangePicker value={time} onChange={(dates, dateString) => {
                      console.log("fields11=", moment(dates[0]).format("YYYY-MM-DD HH:mm:ss"))
                      console.log("fields22=", moment(dates[1]).format("YYYY-MM-DD HH:mm:ss"))
                      if (dates[0].year() === dates[1].year()) {
                        this.setState({
                          time: dates
                        })
                      } else {
                        message.error("请选择一年内的时间")
                      }
                    }} />
                  </FormItem>
                </Col>
                <Col>
                  <FormItem label="" style={{ width: '100%' }}>
                    <Button
                      type="primary"
                      style={{ margin: '0 10px' }}
                      loading={loading}
                      onClick={() => {
                        this.getPageData();
                      }}
                    >
                      生成统计
                    </Button>
                    {/* <Button loading={exportLoading} onClick={this.exportReport}>
                      <ExportOutlined />
                      导出
                    </Button> */}
                  </FormItem>
                </Col>
              </Row>
            </Form>
            <SdlTable columns={columns} dataSource={compareWaterTableData} pagination={false} defaultWidth={100} />
            {/* scroll={{ x: 2600,y: 'calc(100vh - 380px)' }} */}
          </Card>
        </Spin>
      </BreadcrumbWrapper>
    );
  }
}

export default PointAVGAnalyse;