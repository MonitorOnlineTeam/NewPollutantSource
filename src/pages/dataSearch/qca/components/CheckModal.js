import React, { PureComponent } from 'react';
import { Modal, Space, Tabs, Tag } from "antd";
import { connect } from "dva"
import ReactEcharts from 'echarts-for-react';
import SdlTable from "@/components/SdlTable"
import { QCATypes } from '@/utils/CONST'

const TabPane = Tabs.TabPane;

const workMode = { "1": "定时", "2": "远程", 3: "现场" }
// const QCATitle = { "1": "量程核查", "2": "盲样核查", "3": "零点核查", "4": "响应时间核查", "5": "线性核查" }

@connect(({ qcaCheck, loading }) => ({
  checkModalVisible: qcaCheck.checkModalVisible,
  keyParameterList: qcaCheck.keyParameterList,
  qcaLogDataList: qcaCheck.qcaLogDataList,
  valueList: qcaCheck.valueList,
  standValList: qcaCheck.standValList,
  timeList: qcaCheck.timeList,
}))
class CheckModal extends PureComponent {
  state = {}
  _SELF_ = {
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
    this.getKeyParameterList();
    this.getqcaLogAndProcess();


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

  // 获取质控过程和质控日志
  getqcaLogAndProcess = () => {
    const { currentRowData, DGIMN, QCAType } = this.props;
    this.props.dispatch({
      type: "qcaCheck/getqcaLogAndProcess",
      payload: {
        QCAType: QCAType,
        DGIMN: DGIMN,
        MonitorTime: currentRowData.MonitorTime,
        EndTime: currentRowData.EndTime,
        PollutantCode: currentRowData.PollutantCode,
      }
      // payload: { QCAType: QCAType, "DGIMN": "62020131jhdp02", "MonitorTime": "2020-08-20 23:01:00", "PollutantCode": "a21002" }
    })
  }


  // 获取关键参数接口
  getKeyParameterList = () => {
    const { currentRowData, DGIMN } = this.props;
    this.props.dispatch({
      type: "qcaCheck/getKeyParameterList",
      payload: {
        DGIMN: DGIMN,
        MonitorTime: currentRowData.MonitorTime,
        PollutantCode: currentRowData.PollutantCode,
      }
    })
  }

  render() {
    const { currentRowData = {}, qcaLogDataList, checkModalVisible, pointName, keyParameterList, QCAType } = this.props;
    const { paramsColumns, logColumns } = this._SELF_;
    return (
      <Modal
        title={`${currentRowData.PollutantName ? currentRowData.PollutantName : ""}${QCATypes[QCAType]}详情【${pointName}】`}
        width={"90vw"}
        visible={checkModalVisible}
        footer={false}
        onCancel={() => { this.props.dispatch({ type: "qcaCheck/updateState", payload: { checkModalVisible: false } }) }}
      >
        <Space size={44} style={{ marginBottom: 24 }}>
          <span>质控结果：{currentRowData.Result == 0 ? <Tag color="green">合格</Tag> : <Tag color="red">不合格</Tag>}</span>
          <span>标准气浓度：{currentRowData.StandardValue}{currentRowData.Unit}</span>
          <span>测量值：{currentRowData.Check}{currentRowData.Unit}</span>
          <span>量程范围：{currentRowData.SpanValue}{currentRowData.Unit}</span>
          <span>相对误差：{currentRowData.Offset}</span>
          <span>技术要求：{currentRowData.standard}</span>
          <span>工作模式：{workMode[currentRowData.WorkMode]}</span>
          <span>质控时间：{currentRowData.MonitorTime}</span>
        </Space>
        <Tabs type="card">
          <TabPane tab="质控过程" key="1">
            <ReactEcharts
              // theme="line"
              // option={() => { this.lightOption() }}
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
      </Modal>
    );
  }
}

export default CheckModal;