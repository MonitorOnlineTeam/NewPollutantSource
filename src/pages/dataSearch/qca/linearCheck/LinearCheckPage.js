import React, { PureComponent } from 'react';
import { Card, Tabs, Form, DatePicker, Row, Col, Button, Space, Input, Select, Modal, Tag, Spin } from "antd";
import SdlTable from '@/components/SdlTable'
import { connect } from "dva"
import moment from "moment"
import QuestionTooltip from "@/components/QuestionTooltip"
import ReactEcharts from 'echarts-for-react';

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const Option = Select.Option;

const workMode = { "1": "定时", "2": "远程", 3: "现场" }

@connect(({ qcaCheck, loading }) => ({
  linearCheckTableData: qcaCheck.linearCheckTableData,
  pollutantList: qcaCheck.pollutantList,
  keyParameterList: qcaCheck.keyParameterList,
  qcaLogDataList: qcaCheck.qcaLogDataList,
  valueList: qcaCheck.valueList,
  standValList: qcaCheck.standValList,
  timeList: qcaCheck.timeList,
  linearCheckChartData: qcaCheck.linearCheckChartData,
  loading: loading.effects["qcaCheck/getqcaLogAndProcess"],
  tableLoading: loading.effects['qcaCheck/getLinearDataList'],
}))
class LinearCheckPage extends PureComponent {
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
        title: '单位',
        dataIndex: 'Unit',
      },
      {
        title: '第一组',
        children: [
          {
            title: "标准气浓度",
            dataIndex: 'StandardValue1',
            width: 100,
            align: 'center',
          },
          {
            title: "测量浓度",
            dataIndex: 'Check1',
            width: 80,
            align: 'center',
          },
          {
            title: "量程范围",
            dataIndex: 'SpanValue1',
            width: 80,
            align: 'center',
          },
          {
            title: <span>
              相对误差（%）
              <QuestionTooltip content="测量浓度-标准浓度/量程范围*100%" />
            </span>,
            dataIndex: 'Offset1',
            width: 140,
            align: 'center',
          },
        ]
      },
      {
        title: '第二组',
        children: [
          {
            title: "标准气浓度",
            dataIndex: 'StandardValue2',
            width: 100,
            align: 'center',
          },
          {
            title: "测量浓度",
            dataIndex: 'Check2',
            width: 80,
            align: 'center',
          },
          {
            title: "量程范围",
            dataIndex: 'SpanValue2',
            width: 80,
            align: 'center',
          },
          {
            title: <span>
              相对误差（%）
              <QuestionTooltip content="测量浓度-标准浓度/量程范围*100%" />
            </span>,
            dataIndex: 'Offset2',
            width: 140,
            align: 'center',
          },
        ]
      },
      {
        title: '第三组',
        children: [
          {
            title: "标准气浓度",
            dataIndex: 'StandardValue3',
            width: 100,
            align: 'center',
          },
          {
            title: "测量浓度",
            dataIndex: 'Check3',
            width: 80,
            align: 'center',
          },
          {
            title: "量程范围",
            dataIndex: 'SpanValue3',
            width: 80,
            align: 'center',
          },
          {
            title: <span>
              相对误差（%）
              <QuestionTooltip content="测量浓度-标准浓度/量程范围*100%" />
            </span>,
            dataIndex: 'Offset3',
            width: 140,
            align: 'center',
          },
        ]
      },
      {
        title: '第四组',
        children: [
          {
            title: "标准气浓度",
            dataIndex: 'StandardValue4',
            width: 100,
            align: 'center',
          },
          {
            title: "测量浓度",
            dataIndex: 'Check4',
            width: 80,
            align: 'center',
          },
          {
            title: "量程范围",
            dataIndex: 'SpanValue4',
            width: 80,
            align: 'center',
          },
          {
            title: <span>
              相对误差（%）
              <QuestionTooltip content="测量浓度-标准浓度/量程范围*100%" />
            </span>,
            dataIndex: 'Offset4',
            width: 140,
            align: 'center',
          },
        ]
      },
      {
        title: <span>
          示值误差（%）
        <QuestionTooltip content="按照零气、高浓度标准气体、零气、中浓度(50%~60%的
          满量程值)标准气体、零气、低浓度(20%~30%的满量程值)标准气体的顺序 通入标准气体。若低浓度标准气体浓度高于排放限值，则还需通入浓度低于排放 限值的标准气体，完成超低排放改造后的火电污染源还应通入浓度低于超低排放 水平的标准气体。待显示浓度值稳定后读取测定结果。重复测定 3 次，取平均值" />
        </span>,
        width: 140,
        dataIndex: 'MaxOffset',
      },
      {
        title: '线性系数',
        dataIndex: 'Ratio',
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

      const {location} = this.props;
      
      if(location&&location.query.type==='alarm' ){ //从报警信息页面跳转
        this.formRef.current.setFieldsValue({ PollutantCode: [location.query.code] })
        this.formRef.current.setFieldsValue({ time: [moment(location.query.startTime),moment(location.query.endTime)] })
        this.getTableDataSource();
      }else{
      if (this.props.pointType === "1") {
        // 废水
        this.formRef.current.setFieldsValue({ PollutantCode: ["011", "060"] })
      } else {
        // 废气
        this.formRef.current.setFieldsValue({ PollutantCode: ["a21002", "a19001", "a21026"] })
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
        QCAType: "3104",
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
      type: "qcaCheck/getLinearDataList",
      payload: {
        beginTime: fieldsValue["time"][0].format('YYYY-MM-DD HH:mm:ss'),
        endTime: fieldsValue["time"][1].format('YYYY-MM-DD HH:mm:ss'),
        DGIMN: DGIMN,
        PollutantCode: fieldsValue["PollutantCode"]
      }
    })
  }

  // 线性系数图表配置
  linearCheckOption = () => {
    const { linearCheckChartData } = this.props;
    let markLineOpt = {
      animation: false,
      label: {
        formatter: linearCheckChartData.formatter,
        align: 'right'
      },
      lineStyle: {
        type: 'solid'
      },
      tooltip: {
        formatter: linearCheckChartData.formatter,
      },
      data: [[{
        coord: linearCheckChartData.coordMin,
        symbol: 'none'
      }, {
        coord: linearCheckChartData.coordMax,
        symbol: 'none'
      }]]
    };

    let option = {
      // title: {
      //   text: 'Anscombe\'s quartet',
      //   left: 'center',
      //   top: 0
      // },
      // grid: [
      //   { x: '7%', y: '7%', width: '38%', height: '38%' },
      // ],
      grid: {
        left: '60px',
        right: '120px',
        bottom: '2%',
        // top: "2%",
        containLabel: true
      },
      tooltip: {
        formatter: function (params, ticket, callback) {
          console.log('params=', params)
          return `测量浓度:    ${params.value[0]}mg/m³ <br />标准气浓度:    ${params.value[1]}mg/m³`
        }
      },
      xAxis: [
        { name: '测量浓度(mg/m³)', gridIndex: 0, min: linearCheckChartData.coordMin[0], max: linearCheckChartData.coordMax[0] },
      ],
      yAxis: [
        { name: '标准气浓度(mg/m³)', gridIndex: 0, min: linearCheckChartData.coordMin[1] < 0 ? linearCheckChartData.coordMin[1] - 5 : linearCheckChartData.coordMin[1], max: linearCheckChartData.coordMax[1] + 5 },
      ],
      series: [
        {
          name: 'I',
          type: 'scatter',
          xAxisIndex: 0,
          yAxisIndex: 0,
          data: linearCheckChartData.data,
          markLine: markLineOpt
        },
      ]
    };

    return option;
  }

  // 折线图配置项
  lineOption = () => {
    const { standValList, valueList, timeList, } = this.props;
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
          name: '',
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
    const { linearCheckTableData, pollutantList, tableLoading, pointName, keyParameterList, qcaLogDataList, loading } = this.props;
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
        <SdlTable loading={tableLoading} dataSource={linearCheckTableData} columns={columns} />
        {
          visible && <Modal
            destroyOnClose
            title={`${currentRowData.PollutantName}响应时间核查详情【${pointName}】`}
            width={"80vw"}
            visible={visible}
            footer={false}
            onCancel={() => { this.setState({ visible: false }) }}
          >
            <Spin spinning={!!loading} delay={500}>
              <Space size={44} style={{ marginBottom: 24 }}>
                <span>质控结果：{currentRowData.Result == 0 ? <Tag color="green">合格</Tag> : <Tag color="red">不合格</Tag>}</span>
                <span>线性系数：{currentRowData.Ratio}{currentRowData.Unit}</span>
                <span>示值误差：{currentRowData.MaxOffset}{currentRowData.Unit}</span>
                <span>标准要求：{currentRowData.standard}</span>
                <span>工作模式：{workMode[currentRowData.WorkMode]}</span>
                <span>质控时间：{currentRowData.MonitorTime}</span>
              </Space>
              <Tabs type="card">
                <TabPane tab="线性系数" key="1">
                  <ReactEcharts
                    option={this.linearCheckOption()}
                    lazyUpdate
                    notMerge
                    id="rightLine"
                    style={{ width: '100%', height: 'calc(100vh - 430px)', minHeight: '300px' }}
                  />
                </TabPane>
                <TabPane tab="质控过程" key="2">
                  <ReactEcharts
                    option={this.lineOption()}
                    lazyUpdate
                    notMerge
                    id="rightLine"
                    style={{ width: '100%', height: 'calc(100vh - 430px)', minHeight: '300px' }}
                  />
                </TabPane>
                <TabPane tab="关键参数" key="3">
                  <SdlTable dataSource={keyParameterList} columns={paramsColumns} />
                </TabPane>
                <TabPane tab="质控日志" key="4">
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
export default LinearCheckPage;