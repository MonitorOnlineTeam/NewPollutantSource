import React, { PureComponent } from 'react';
import { Card, Tabs, Form, DatePicker, Row, Col, Button, Space, Input, Select, Modal, Tag } from "antd";
import SdlTable from '@/components/SdlTable'
import { connect } from "dva"
import moment from "moment"
import QuestionTooltip from "@/components/QuestionTooltip"

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const Option = Select.Option;
const workMode = {
  "1": "定时", "2": "远程", 3: "现场"
}

@connect(({ qcaCheck, loading }) => ({
  resTimeCheckTableData: qcaCheck.resTimeCheckTableData,
  pollutantList: qcaCheck.pollutantList,
  keyParameterList: qcaCheck.keyParameterList,
  qcaLogDataList: qcaCheck.qcaLogDataList,
  tableLoading: loading.effects['qcaCheck/getResTimeCheckTableData'],
}))
class resTimeCheckPage extends PureComponent {
  formRef = React.createRef();
  state = {
    // entName: "",
    // DGIMN: "",
    pollutantCodes: [],
    visible: false,
    currentRowData: {}
  }
  _SELF_ = {
    columns: [
      {
        title: '监测时间',
        dataIndex: 'MonitorTime',
      },
      {
        title: '结束时间',
        dataIndex: 'EndTime',
      },
      {
        title: "合格情况",
        dataIndex: 'Result',
        render: (text, record, index) => {
          if (text == 0) {
            return <a style={{ color: "#87d068" }} onClick={(e) => {
              this.setState({
                currentRowData: record,
                visible: true
              }, () => {
                this.getqcaLogAndProcess();
                this.getKeyParameterList();
              })
            }}>合格</a>
          }
          return <a style={{ color: "#f5222d" }} onClick={(e) => {
            this.setState({
              currentRowData: record,
              visible: true
            }, () => {
              this.getqcaLogAndProcess();
              this.getKeyParameterList();
            })

          }}>不合格</a>
        }
      },
      {
        title: '监测项目',
        dataIndex: 'PollutantName',
      },
      {
        title: '第一组（s）',
        children: [
          {
            title: <span>
              T1
            <QuestionTooltip content="通入气体到仪表读书产生变化的时间段，精确到秒" />
            </span>,
            dataIndex: 't11',
            width: 80,
            align: 'center',
          },
          {
            title: <span>
              T2
              <QuestionTooltip content="数值产生变化到分析仪数值上升至标准浓度标称值90%时的时间段，精确到秒" />
            </span>,
            dataIndex: 't12',
            width: 80,
            align: 'center',
          },
          {
            title: <span>
              T=T1+T2
              <QuestionTooltip content="按照零气、高浓度标准气体、零气、中浓度(50%~80%的
满量程值)标准气体、零气、低浓度(20%~30%的满量程值)标准气体的顺序 通入标准气体。若低浓度标准气体浓度高于排放限值，则还需通入浓度低于排放 限值的标准气体，完成超低排放改造后的火电污染源还应通入浓度低于超低排放 水平的标准气体。待显示浓度值稳定后读取测定结果。重复测定 3 次，取平均值" />
            </span>,
            dataIndex: 't13',
            width: 120,
            align: 'center',
          },
        ]
      },
      {
        title: '第二组（s）',
        children: [
          {
            title: <span>
              T1
              <QuestionTooltip content="通入气体到仪表读书产生变化的时间段，精确到秒" />
            </span>,
            dataIndex: 't21',
            width: 80,
            align: 'center',
          },
          {
            title: <span>
              T2
            <QuestionTooltip content="数值产生变化到分析仪数值上升至标准浓度标称值90%时的时间段，精确到秒" />
            </span>,
            dataIndex: 't22',
            width: 80,
            align: 'center',
          },
          {
            title: <span>
              T=T1+T2
            <QuestionTooltip content="按照零气、高浓度标准气体、零气、中浓度(50%~80%的
满量程值)标准气体、零气、低浓度(20%~30%的满量程值)标准气体的顺序 通入标准气体。若低浓度标准气体浓度高于排放限值，则还需通入浓度低于排放 限值的标准气体，完成超低排放改造后的火电污染源还应通入浓度低于超低排放 水平的标准气体。待显示浓度值稳定后读取测定结果。重复测定 3 次，取平均值" />
            </span>,
            dataIndex: 't23',
            width: 120,
            align: 'center',
          },
        ]
      },
      {
        title: '第三组（s）',
        children: [
          {
            title: <span>
              T1
              <QuestionTooltip content="通入气体到仪表读书产生变化的时间段，精确到秒" />
            </span>,
            dataIndex: 't31',
            width: 80,
            align: 'center',
          },
          {
            title: <span>
              T2
              <QuestionTooltip content="数值产生变化到分析仪数值上升至标准浓度标称值90%时的时间段，精确到秒" />
            </span>,
            dataIndex: 't32',
            width: 80,
            align: 'center',
          },
          {
            title: <span>
              T=T1+T2
              <QuestionTooltip content="按照零气、高浓度标准气体、零气、中浓度(50%~80%的
满量程值)标准气体、零气、低浓度(20%~30%的满量程值)标准气体的顺序 通入标准气体。若低浓度标准气体浓度高于排放限值，则还需通入浓度低于排放 限值的标准气体，完成超低排放改造后的火电污染源还应通入浓度低于超低排放 水平的标准气体。待显示浓度值稳定后读取测定结果。重复测定 3 次，取平均值" />
            </span>,
            dataIndex: 't33',
            width: 120,
            align: 'center',
          },
        ]
      },
      {
        title: '平均值（s）',
        dataIndex: 'AvgTime',
      },
      {
        title: '标准要求',
        dataIndex: 'standard',
      },
    ],
    paramsColumns: [
      {
        title: '序号',
        render: (text, record, index) => {
          return index + 1;
        }
      },
      {
        title: '分析仪参数名称',
        dataIndex: 'paramName',
      },
      {
        title: '参数值',
        dataIndex: 'value',
        render: (text, record, index) => {
          if (text !== "-") {
            return <span style={{ color: record.state !== 0 ? "#u39" : "" }}>{text} {record.unit}</span>
          }
          return text;
        }
      },
      {
        title: '备注',
        dataIndex: 'comment',
      },
    ],
    logColumns: [
      {
        title: '序号',
        render: (text, record, index) => {
          return index + 1;
        }
      },
      {
        title: '监测时间',
        dataIndex: 'Time',
      },
      {
        title: '日志',
        dataIndex: 'Msg',
      },
    ]
  }

  componentDidMount() {
    this.getPollutantList();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.pollutantList !== this.props.pollutantList) {
      if (this.props.pointType === "1") {
        // 废水
        this.formRef.current.setFieldsValue({ PollutantCode: ["011", "060"] })
      } else {
        // 废气
        this.formRef.current.setFieldsValue({ PollutantCode: ["a21002", "a19001", "a21026"] })
      }
      this.getTableDataSource();
    }
    if (prevProps.DGIMN !== this.props.DGIMN) {
      this.getPollutantList();
    }
  }

  // 获取质控过程和质控日志
  getqcaLogAndProcess = () => {
    const { DGIMN } = this.props;
    const { currentRowData } = this.state;
    this.props.dispatch({
      type: "qcaCheck/getqcaLogAndProcess",
      payload: {
        QCAType: "3103",
        DGIMN: DGIMN,
        MonitorTime: currentRowData.MonitorTime,
        EndTime: currentRowData.EndTime,
        PollutantCode: currentRowData.PollutantCode,
      }
      // payload: { QCAType: 4, "DGIMN": "62020131jhdp02", "MonitorTime": "2020-08-20 23:01:00", "PollutantCode": "a21002" }
    })
  }


  // 获取关键参数接口
  getKeyParameterList = () => {
    const { DGIMN } = this.props;
    const { currentRowData } = this.state;
    this.props.dispatch({
      type: "qcaCheck/getKeyParameterList",
      payload: {
        DGIMN: DGIMN,
        MonitorTime: currentRowData.MonitorTime,
        PollutantCode: currentRowData.PollutantCode,
      }
    })
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
      type: "qcaCheck/getResTimeCheckTableData",
      payload: {
        beginTime: fieldsValue["time"][0].format('YYYY-MM-DD HH:mm:ss'),
        endTime: fieldsValue["time"][1].format('YYYY-MM-DD HH:mm:ss'),
        DGIMN: DGIMN,
        PollutantCode: fieldsValue["PollutantCode"]
      }
    })
  }


  render() {
    const { columns, paramsColumns, logColumns } = this._SELF_;
    const { currentRowData, visible } = this.state;
    const { resTimeCheckTableData, pollutantList, tableLoading, pointName, keyParameterList, qcaLogDataList } = this.props;
    return (
      <Card>
        <Form
          name="global_state"
          ref={this.formRef}
          initialValues={{
            time: [moment().subtract(29, 'days'), moment()],
          }}
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
              <Button type="primary">导出</Button>
            </Space>
          </Row>
        </Form>
        <SdlTable loading={tableLoading} dataSource={resTimeCheckTableData} columns={columns} />
        {
          visible && <Modal
            title={`${currentRowData.PollutantName}响应时间核查详情【${pointName}】`}
            width={"80vw"}
            visible={visible}
            footer={false}
            onCancel={() => { this.setState({ visible: false }) }}
          >
            <Space size={44} style={{ marginBottom: 24 }}>
              <span>质控结果：{currentRowData.Result == 0 ? <Tag color="green">合格</Tag> : <Tag color="red">不合格</Tag>}</span>
              <span>平均时间：{currentRowData.AvgTime}s</span>
              <span>技术要求：{currentRowData.standard}</span>
              <span>工作模式：{workMode[currentRowData.WorkMode]}</span>
              <span>质控时间：{currentRowData.MonitorTime}</span>
            </Space>
            <Tabs type="card">
              <TabPane tab="关键参数" key="1">
                <SdlTable dataSource={keyParameterList} columns={paramsColumns} />
              </TabPane>
              <TabPane tab="质控日志" key="2">
                <SdlTable dataSource={qcaLogDataList} columns={logColumns} />
              </TabPane>
            </Tabs>
          </Modal>
        }
      </Card>
    );
  }
}
export default resTimeCheckPage;