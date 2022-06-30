import React, { PureComponent } from 'react';
import { Card, Tabs, Form, DatePicker, Row, Col, Button, Space, Input, Select, Modal, Tag, Spin, Tooltip } from "antd";
import SdlTable from '@/components/SdlTable'
import { connect } from "dva"
import moment from "moment"
import QuestionTooltip from "@/components/QuestionTooltip"
import ReactEcharts from 'echarts-for-react';
import _ from 'lodash';

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
  valueList: qcaCheck.valueList,
  standValList: qcaCheck.standValList,
  timeList: qcaCheck.timeList,
  loading: loading.effects["qcaCheck/getqcaLogAndProcess"],
  tableLoading: loading.effects['qcaCheck/getResTimeCheckTableData'],
  exportLoading: loading.effects['qcaCheck/qcaCheckExport'],
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
      // {
      //   title: '结束时间',
      //   dataIndex: 'EndTime',
      // },
      {
        title: "合格情况",
        dataIndex: 'Result',
        render: (text, record, index) => {
          if (text == 2) {
            return <Tooltip title={record.FlagName}>
              <a style={{ color: "#7b7b7b" }}>无效</a>
            </Tooltip>
          }
          return <a style={{ color: text == 0 ? "#87d068" : "#f5222d" }} onClick={(e) => {
            this.setState({
              currentRowData: record,
              visible: true
            }, () => {
              this.getqcaLogAndProcess();
              this.getKeyParameterList();
            })
          }}>{text == 0 ? "合格" : "不合格"}</a>
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
            <QuestionTooltip content="通入气体到仪表读数产生变化的时间段，精确到秒" />
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
              <QuestionTooltip content="上述T1+T2之和" />
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
              <QuestionTooltip content="通入气体到仪表读数产生变化的时间段，精确到秒" />
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
            <QuestionTooltip content="上述T1+T2之和" />
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
              <QuestionTooltip content="通入气体到仪表读数产生变化的时间段，精确到秒" />
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
              <QuestionTooltip content="上述T1+T2之和" />
            </span>,
            dataIndex: 't33',
            width: 120,
            align: 'center',
          },
        ]
      },
      {
        // title: '平均值（s）',
        title: <span>
          平均值（s）
              <QuestionTooltip content=" 按照零气、高浓度标准气体、零气、中浓度(50%~60%的
          满量程值)标准气体、零气、低浓度(20%~30%的满量程值)标准气体的顺序 通入标准气体。若低浓度标准气体浓度高于排放限值，则还需通入浓度低于排放 限值的标准气体，完成超低排放改造后的火电污染源还应通入浓度低于超低排放 水平的标准气体。待显示浓度值稳定后读取测定结果。重复测定 3 次，取平均值" />
        </span>,
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
            return <span style={{ color: record.state !== 0 ? "#f5222d" : "" }}>{text} {record.unit}</span>
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

      const { location } = this.props;

      if (location && location.query.type === 'alarm') { //从报警信息页面跳转
        this.formRef.current.setFieldsValue({ PollutantCode: [location.query.code] })
        this.formRef.current.setFieldsValue({ time: [moment(location.query.startTime), moment(location.query.endTime)] })
        this.getTableDataSource();
      } else {
        let pollutantList = this.props.pollutantList.map(item => item.PollutantCode);
        if (this.props.pointType === "1") {
          let intersection = _.intersection(pollutantList, ["011", "060"])
          // 废水
          this.formRef.current.setFieldsValue({ PollutantCode: intersection })
        } else {
          let intersection = _.intersection(pollutantList, ["a21002", "a19001", "a21026", 'a05001', 'a05002', 'a05003'])
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
        beginTime: fieldsValue["time"] ? fieldsValue["time"][0].format('YYYY-MM-DD HH:mm:ss') : undefined,
        endTime: fieldsValue["time"] ? fieldsValue["time"][1].format('YYYY-MM-DD HH:mm:ss') : undefined,
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
        beginTime: fieldsValue["time"] ? fieldsValue["time"][0].format('YYYY-MM-DD HH:mm:ss') : undefined,
        endTime: fieldsValue["time"] ? fieldsValue["time"][1].format('YYYY-MM-DD HH:mm:ss') : undefined,
        DGIMN: DGIMN,
        PollutantCode: fieldsValue["PollutantCode"],
        exportType: "exportResponseDataList"
      }
    })
  }

  // 折线图配置项
  lineOption = () => {
    const { standValList, valueList, timeList, } = this.props;
    const { currentRowData } = this.state;
    let option = {
      color: ["#56f485", "#c23531"],
      legend: {
        data: ["测量浓度", "配比标气浓度"],
      },
      grid: {
        left: '10px',
        right: '10px',
        bottom: '10px',
        containLabel: true
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985',
          }
        },
        formatter: (params) => {
          if (params) {
            let params0 = "", params1 = "";
            if (params[0]) {
              params0 = `
              ${params[0].name}
              <br />
              ${params[0].marker}
              ${params[0].seriesName}：${params[0].value}${currentRowData.Unit ? currentRowData.Unit : ""}
              <br />`
            }
            if (params[1]) {
              params1 = `${params[1].marker}
${params[1].seriesName} ：${params[1].value} ${currentRowData.Unit ? currentRowData.Unit : ""}`
            }
            return params0 + params1;
          }
        }
      },
      toolbox: {
        show: true,
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          dataView: { readOnly: false },
          // magicType: {type: ['line', 'bar']},
          // restore: {},
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        data: timeList,
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed'
          }
        },
      },
      yAxis: [
        {
          type: 'value',
          name: currentRowData.Unit ? (currentRowData.Unit) : "",
        }
      ],
      dataZoom: [{
        type: 'inside',
        start: 0,
        end: 100
      }, {
        start: 0,
        end: 100,
        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '80%',
        handleStyle: {
          color: '#fff',
          shadowBlur: 3,
          shadowColor: 'rgba(0, 0, 0, 0.6)',
          shadowOffsetX: 2,
          shadowOffsetY: 2
        }
      }],
      series: [{
        name: '测量浓度',
        data: valueList,
        smooth: true,
        type: 'line',
      },
      {
        name: '配比标气浓度',
        data: standValList,
        smooth: true,
        type: 'line',
      },
      ]
    };

    return option;
  }



  render() {
    const { columns, paramsColumns, logColumns } = this._SELF_;
    const { currentRowData, visible } = this.state;
    const { resTimeCheckTableData, exportLoading, pollutantList, tableLoading, pointName, keyParameterList, qcaLogDataList, loading } = this.props;
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
              <Button type="primary" loading={exportLoading} onClick={this.onExport}>导出</Button>
            </Space>
          </Row>
        </Form>
        <SdlTable loading={tableLoading} dataSource={resTimeCheckTableData} columns={columns}
          onRow={record => {
            return {
              onClick: event => {
                if (record.Result == 2) {
                  return;
                }
                this.setState({
                  currentRowData: record,
                  visible: true
                }, () => {
                  this.getqcaLogAndProcess();
                  this.getKeyParameterList();
                })
              }, // 点击行
            };
          }}
        />
        {
          visible && <Modal
            title={`${currentRowData.PollutantName}响应时间核查详情【${pointName}】`}
            width={"80vw"}
            visible={visible}
            footer={false}
            onCancel={() => { this.setState({ visible: false }) }}
          >
            <Spin spinning={!!loading} delay={500}>
              <Space size={44} style={{ marginBottom: 24 }}>
                <span>质控结果：{currentRowData.Result == 0 ? <Tag color="green">合格</Tag> : <Tag color="red">不合格</Tag>}</span>
                <span>平均时间：{currentRowData.AvgTime}s</span>
                <span>技术要求：{currentRowData.standard}</span>
                <span>工作模式：{workMode[currentRowData.WorkMode]}</span>
                <span>质控时间：{currentRowData.MonitorTime}</span>
              </Space>
              <Tabs type="card">
                <TabPane tab="质控过程" key="1">
                  <ReactEcharts
                    option={this.lineOption()}
                    lazyUpdate
                    notMerge
                    id="rightLine"
                    style={{ width: '100%', height: 'calc(100vh - 430px)', minHeight: '300px' }}
                  />
                </TabPane>
                <TabPane tab="关键参数" key="2">
                  <SdlTable dataSource={keyParameterList} columns={paramsColumns} />
                </TabPane>
                <TabPane tab="质控日志" key="3">
                  <SdlTable dataSource={qcaLogDataList} columns={logColumns} />
                </TabPane>
              </Tabs>
            </Spin>
          </Modal>
        }
      </Card>
    );
  }
}
export default resTimeCheckPage;
