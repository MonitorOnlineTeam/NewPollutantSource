import React, { PureComponent } from 'react';
import { Card, Tabs, Spin, Form, DatePicker, Row, Col, Button, Space, Input, Select, Modal, Tag } from "antd";
import SdlTable from '@/components/SdlTable'
import { connect } from "dva"
import moment from "moment"
import QuestionTooltip from "@/components/QuestionTooltip"
import ZeroCheckChart from "./ZeroCheckChart"
import CheckModal from "../components/CheckModal"
import _ from "lodash"

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const Option = Select.Option;
const workMode = {
  "1": "定时", "2": "远程", 3: "现场"
}

@connect(({ qcaCheck, loading }) => ({
  zeroCheckTableData: qcaCheck.zeroCheckTableData,
  zeroCheck24TableData: qcaCheck.zeroCheck24TableData,
  pollutantList: qcaCheck.pollutantList,
  checkModalVisible: qcaCheck.checkModalVisible,
  tableLoading: loading.effects['qcaCheck/getZeroCheckTableData'],
  exportLoading: loading.effects['qcaCheck/qcaCheckExport'],
}))
class ZeroCheckPage extends PureComponent {
  formRef = React.createRef();
  state = {
    // entName: "",
    // DGIMN: "",
    pollutantCodes: [],
  }
  _SELF_ = {
    columns: [
      {
        title: '核查时间',
        dataIndex: 'MonitorTime',
      },
      // {
      //   title: '结束时间',
      //   dataIndex: 'EndTime',
      // },
      {
        title: '合格情况',
        dataIndex: 'Result',
        render: (text, record, index) => {
          if (text == 2) {
            return <a style={{ color: "#7b7b7b" }}>无效</a>
          }
          return <a style={{ color: text == 0 ? "#87d068" : "#f5222d" }} onClick={(e) => {
            this.setState({
              currentRowData: record
            })
            this.props.dispatch({
              type: "qcaCheck/updateState",
              payload: {
                checkModalVisible: true
              }
            })
          }}>{text == 0 ? "合格" : "不合格"}</a>
        }
      },
      {
        title: '监测项目',
        dataIndex: 'PollutantName',
      },
      {
        title: '单位',
        dataIndex: 'Unit',
      },
      {
        title: '标准气浓度',
        dataIndex: 'StandardValue',
      },
      {
        title: '测量浓度',
        dataIndex: 'Check',
      },
      {
        title: '量程范围',
        dataIndex: 'SpanValue',
      },
      {
        title: <span>
          相对误差（%）
      <QuestionTooltip content="在仪器未进行维修、保养或调节的前提下，CEMS 按规定的时间运行后通入零点气体，
仪器的读数与零点气体初始测量值之间的偏差相对于满量程的百分比。参考75标准，计算公式测量浓度-标准浓度/量程范围*100%" />
        </span>,
        dataIndex: 'Offset',
        width: 180,
      },
      {
        title: '技术要求',
        dataIndex: 'standard',
      },
    ],
    columns24: [
      {
        title: '核查时间',
        dataIndex: 'MonitorTime',
      },
      {
        title: '结束时间',
        dataIndex: 'EndTime',
      },
      {
        title: '合格情况',
        dataIndex: 'Result',
        render: (text, record, index) => {
          if (text == 2) {
            return <a style={{ color: "#7b7b7b" }}>无效</a>
          }
          return <a style={{ color: text == 0 ? "#87d068" : "#f5222d" }}>{text == 0 ? "合格" : "不合格"}</a>
        }
      },
      {
        title: '监测项目',
        dataIndex: 'PollutantName',
      },
      {
        title: '单位',
        dataIndex: 'Unit',
      },
      {
        title: '本次测量浓度',
        dataIndex: 'StandardValue',
      },
      {
        title: '24小时前测量浓度',
        dataIndex: 'Check',
        width: 150,
      },
      {
        title: '量程范围',
        dataIndex: 'SpanValue',
      },
      {
        title: <span>
          相对误差（%）
      <QuestionTooltip content="在仪器未进行维修、保养或调节的前提下，CEMS 按规定的时间运行后通入零点气体，
仪器的读数与24小时前测量值之间的偏差相对于满量程的百分比。参考75标准，计算公式本次测量浓度-24小时前的测量浓度/量程范围*100%" />
        </span>,
        dataIndex: 'Offset',
        width: 180,
      },
      {
        title: '技术要求',
        dataIndex: 'standard',
      },
    ]
  }

  componentDidMount() {
    this.getPollutantList();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.pollutantList !== this.props.pollutantList) {

      const { location } = this.props;

      if (location && location.query.type === 'alarm') { //从报警信息页面跳转
        this.formRef.current.setFieldsValue({ PollutantCode: location.query.code.split(",") })
        this.formRef.current.setFieldsValue({ time: [moment(location.query.startTime), moment(location.query.endTime)] })
        this.getTableDataSource();
      } else {
        let pollutantList = this.props.pollutantList.map(item => item.PollutantCode);
        if (this.props.pointType === "1") {
          let intersection = _.intersection(pollutantList, ["011", "060"])
          // 废水
          this.formRef.current.setFieldsValue({ PollutantCode: intersection })
        } else {
          let intersection = _.intersection(pollutantList, ["a21002", "a19001", "a21026"])
          // 废气
          this.formRef.current.setFieldsValue({ PollutantCode: intersection })
        }
        this.getTableDataSource();
      }

    }
    if (prevProps.DGIMN !== this.props.DGIMN) {
      this.getPollutantList();
    }
  }

  // 获取污染物类型
  getPollutantList = () => {
    this.props.dispatch({
      type: "qcaCheck/getPollutantListByDgimn",
      payload: {
        DGIMNs: this.props.DGIMN,
      }
    })
  }

  // 获取表格数据
  getTableDataSource = () => {
    const { DGIMN, location } = this.props;
    const fieldsValue = this.formRef.current.getFieldsValue();
    this.props.dispatch({
      type: "qcaCheck/getZeroCheckTableData",
      payload: {
        beginTime: fieldsValue["time"] ? fieldsValue["time"][0].format('YYYY-MM-DD HH:mm:ss') : undefined,
        endTime: fieldsValue["time"] ? fieldsValue["time"][1].format('YYYY-MM-DD HH:mm:ss') : undefined,
        DGIMN: DGIMN,
        PollutantCode: fieldsValue["PollutantCode"]
      }
    })
  }

  // 导出
  onExport = () => {
    const { DGIMN, location } = this.props;
    const fieldsValue = this.formRef.current.getFieldsValue();
    this.props.dispatch({
      type: "qcaCheck/qcaCheckExport",
      payload: {
        beginTime: fieldsValue["time"] ? fieldsValue["time"][0].format('YYYY-MM-DD HH:mm:ss') : undefined,
        endTime: fieldsValue["time"] ? fieldsValue["time"][1].format('YYYY-MM-DD HH:mm:ss') : undefined,
        DGIMN: DGIMN,
        PollutantCode: fieldsValue["PollutantCode"],
        exportType: "exportZeroDataList"
      }
    })
  }


  render() {
    const { columns, columns24 } = this._SELF_;
    const { currentRowData } = this.state;
    const { checkModalVisible, exportLoading, DGIMN, zeroCheckTableData, zeroCheck24TableData, pollutantList, tableLoading, pointName } = this.props;
    let pollutantCodeList = "";
    if (this.formRef.current) {
      pollutantCodeList = this.formRef.current.getFieldValue("PollutantCode")
    }
    return (
      <Card>
        <Form
          name="global_state"
          ref={this.formRef}
          initialValues={{
            time: [moment().subtract(29, 'days'), moment()],
          }}
        // onFieldsChange={(changedFields, allFields) => {
        //   console.log('changedFields=', changedFields)
        //   console.log('allFieldss=', allFields)
        // }}
        >
          <Row gutter={[24, 0]}>
            <Col span={10}>
              <Form.Item
                name="time"
                label="开始/结束时间"
              >
                <RangePicker showTime />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="PollutantCode"
                label="污染物"
              >
                <Select mode="multiple" placeholder="请选择污染物">
                  {
                    pollutantList.map(item => {
                      return <Option key={item.PollutantCode} value={item.PollutantCode}>{item.PollutantName}</Option>
                    })
                  }
                </Select>
              </Form.Item>
            </Col>
            <Space align="baseline">
              <Button type="primary" onClick={this.getTableDataSource}>查询</Button>
              <Button type="primary" loading={exportLoading} onClick={this.onExport}>导出</Button>
            </Space>
          </Row>
        </Form>
        <Spin spinning={tableLoading}>
          <Tabs type="card">
            <TabPane tab="零点核查" key="1">
              <SdlTable loading={tableLoading} dataSource={zeroCheckTableData} columns={columns} />
            </TabPane>
            <TabPane tab="24小时零点漂移" key="2">
              <SdlTable loading={tableLoading} dataSource={zeroCheck24TableData} columns={columns24} />
            </TabPane>
            <TabPane tab="24小时零点漂移图表" key="3">
              <ZeroCheckChart pollutantCodeList={pollutantCodeList} />
            </TabPane>
          </Tabs>
        </Spin>
        {/* 详情弹窗 */}
        {checkModalVisible && <CheckModal QCAType="3101" DGIMN={DGIMN} currentRowData={currentRowData} pointName={pointName} />}
      </Card>
    );
  }
}
export default ZeroCheckPage;