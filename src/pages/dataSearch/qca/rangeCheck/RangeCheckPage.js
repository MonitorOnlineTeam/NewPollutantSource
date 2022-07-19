import React, { PureComponent } from 'react';
import { Card, Tabs, Spin, Form, DatePicker, Row, Col, Button, Space, Input, Select, Modal, Tag, Tooltip } from "antd";
import SdlTable from '@/components/SdlTable'
import { connect } from "dva"
import moment from "moment"
import QuestionTooltip from "@/components/QuestionTooltip"
import RangeCheckChart from "./RangeCheckChart"
import CheckModal from "../components/CheckModal"
import _ from "lodash"

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const Option = Select.Option;
const workMode = {
  "1": "定时", "2": "远程", 3: "现场"
}

@connect(({ qcaCheck, loading }) => ({
  rangeCheckTableData: qcaCheck.rangeCheckTableData,
  rangeCheck24TableData: qcaCheck.rangeCheck24TableData,
  pollutantList: qcaCheck.pollutantList,
  checkModalVisible: qcaCheck.checkModalVisible,
  tableLoading: loading.effects['qcaCheck/getRangeDataList'],
  exportLoading: loading.effects['qcaCheck/qcaCheckExport'],
}))
class RangeCheckPage extends PureComponent {
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
            return <Tooltip title={record.FlagName}>
              <a style={{ color: "#7b7b7b" }}>无效</a>
            </Tooltip>
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
        render: (text, record) => {
          return this.getFlagText(text, record)
        }
      },
      {
        title: '量程范围',
        dataIndex: 'SpanValue',
      },
      {
        title: <span>
          相对误差（%）
          <QuestionTooltip content="在仪器未进行维修、保养或调节的前提下，CEMS 按规定的时间运行后通入量程校准 气体，仪器的读数与量程校准气体初始测量值之间的偏差相对于满量程的百分比。（测量浓度-标准浓度）/量程范围*100%（参考75标准中示值误差计算公式）" />
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
      // {
      //   title: '结束时间',
      //   dataIndex: 'EndTime',
      // },
      {
        title: '合格情况',
        dataIndex: 'Result',
        render: (text, record, index) => {
          if (text == 2) {
            return <Tooltip title={record.FlagName}>
              <a style={{ color: "#7b7b7b" }}>无效</a>
            </Tooltip>
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
        render: (text, record) => {
          return this.getFlagText(text, record)
        }
      },
      {
        title: '24小时前测量浓度',
        dataIndex: 'Check',
        width: 150,
        render: (text, record) => {
          return this.getFlagText(text, record, true)
        }
      },
      {
        title: '量程范围',
        dataIndex: 'SpanValue',
      },
      {
        title: <span>
          相对误差（%）
          <QuestionTooltip content="在仪器未进行维修、保养或调节的前提下，CEMS 按规定的时间运行后通入量程校准 气体，仪器的读数与量程校准气体初始测量值之间的偏差相对于24小时前的量程核查读数的百分比。（测量浓度-24小时前量程核查浓度）/量程范围*100%（参考75标准中示值误差计算公式）" />
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
    const { location } = this.props;
    if (location && location.query.type === 'alarm') { //从报警信息页面跳转
      this.formRef.current.setFieldsValue({ PollutantCode: [location.query.code] })
      this.formRef.current.setFieldsValue({ time: [moment(location.query.startTime), moment(location.query.endTime)] })
      this.getTableDataSource();
    }
  }

  componentDidUpdate(prevProps, prevState) {

    const { location } = this.props;

    if (location && location.query.type === 'alarm') { //从报警信息页面跳转
      // debugger
      // this.formRef.current.setFieldsValue({ PollutantCode: [location.query.code] })
      // this.formRef.current.setFieldsValue({ time: [moment(location.query.startTime), moment(location.query.endTime)] })
      // this.getTableDataSource();
    } else {
      if (prevProps.pollutantList !== this.props.pollutantList) {
        let pollutantList = this.props.pollutantList.map(item => item.PollutantCode);
        if (this.props.pointType === "1") {
          let intersection = _.intersection(pollutantList, ["011", "060"])
          // 废水
          this.formRef.current.setFieldsValue({ PollutantCode: intersection })
        } else {
          let intersection = _.intersection(pollutantList, ["a21002", "a19001", "a21026", "a05001", 'a05002', 'a05003'])
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

  getFlagText = (text, record, is24) => {
    let WorkMode = '', workModeLabel = '';
    let recordWorkMode = is24 ? record.WorkMode24 : record.WorkMode;
    let PersonName = is24 ? record.PersonName24 : record.PersonName;
    if (recordWorkMode === 2) { WorkMode = 'rd'; workModeLabel = '远程质控' };
    if (recordWorkMode === 3) { WorkMode = 'hd'; workModeLabel = '现场质控' }
    return recordWorkMode ? <Tooltip title={<div style={{ color: "#fff", fontWeight: 500 }}>
      <p>{workModeLabel}</p>
      <p>质控人：{PersonName}</p>
    </div>}>
      {text}
      <span style={{ marginLeft: 10, fontWeight: 600 }}>{WorkMode}</span>
    </Tooltip> : text
  }

  // 获取污染物类型
  getPollutantList = () => {
    this.props.dispatch({
      type: "qcaCheck/getPollutantListByDgimn",
      payload: {
        DGIMNs: this.props.DGIMN
      }
    })
  }

  // 获取表格数据
  getTableDataSource = () => {
    const { DGIMN } = this.props;
    const fieldsValue = this.formRef.current.getFieldsValue();
    this.props.dispatch({
      type: "qcaCheck/getRangeDataList",
      payload: {
        beginTime: fieldsValue["time"] ? fieldsValue["time"][0].format('YYYY-MM-DD HH:mm:ss') : "",
        endTime: fieldsValue["time"] ? fieldsValue["time"][1].format('YYYY-MM-DD HH:mm:ss') : "",
        DGIMN: DGIMN,
        PollutantCode: fieldsValue["PollutantCode"]
      }
    })
  }

  // 导出
  onExport = () => {
    const { DGIMN } = this.props;
    const fieldsValue = this.formRef.current.getFieldsValue();
    this.props.dispatch({
      type: "qcaCheck/qcaCheckExport",
      payload: {
        beginTime: fieldsValue["time"] ? fieldsValue["time"][0].format('YYYY-MM-DD HH:mm:ss') : "",
        endTime: fieldsValue["time"] ? fieldsValue["time"][1].format('YYYY-MM-DD HH:mm:ss') : "",
        DGIMN: DGIMN,
        PollutantCode: fieldsValue["PollutantCode"],
        exportType: "exportRangeDataList"
      }
    })
  }


  render() {
    const { columns, columns24 } = this._SELF_;
    const { currentRowData } = this.state;
    const { checkModalVisible, exportLoading, DGIMN, rangeCheckTableData, rangeCheck24TableData, pollutantList, tableLoading, pointName } = this.props;
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
        {/* <Spin spinning={tableLoading}> */}
        <Tabs type="card">
          <TabPane tab="量程核查" key="1">
            <SdlTable loading={tableLoading} dataSource={rangeCheckTableData} columns={columns}
              onRow={record => {
                return {
                  onClick: event => {
                    if (record.Result == 2) {
                      return;
                    }
                    this.setState({
                      currentRowData: record
                    })
                    this.props.dispatch({
                      type: "qcaCheck/updateState",
                      payload: {
                        checkModalVisible: true
                      }
                    })
                  }, // 点击行
                };
              }}
            />
          </TabPane>
          <TabPane tab="24小时量程漂移" key="2">
            <SdlTable loading={tableLoading} dataSource={rangeCheck24TableData} columns={columns24} />
          </TabPane>
          <TabPane tab="24小时量程漂移图表" key="3">
            <RangeCheckChart pollutantCodeList={pollutantCodeList} />
          </TabPane>
        </Tabs>
        {/* </Spin> */}
        {/* 详情弹窗 */}
        {checkModalVisible && <CheckModal QCAType="3102" DGIMN={DGIMN} currentRowData={currentRowData} pointName={pointName} />}
      </Card>
    );
  }
}
export default RangeCheckPage;
