
/**
 * 功  能：首页
 * 创建人：贾安波
 * 创建时间：2020.10
 */
import React, { Component } from 'react';
import { CaretRightOutlined } from '@ant-design/icons';
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
  Modal,
  Input,
  Button,
  Select,
  Tabs,
  Radio,
  Checkbox,
  message,
  Skeleton,
  Avatar,
  Dropdown,
  Menu,
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import Link from 'umi/link';
import styles from '../style.less'
import ReactEcharts from 'echarts-for-react';
import ScrollTable from './ScrollTable'
import DetailsModal_WJQ from "./DetailsModal_WJQ"
import ExceedData from '@/pages/dataSearch/exceedData/exceedDataModal'
import ExceedDataAlarm from '@/pages/dataSearch/exceedDataAlarmRecord/exceedDataAlarmModal'

import EntWorkOrderModal from '@/pages/IntelligentAnalysis/operationWorkStatis/entWorkOrderStatistics/EntWorkOrderModal'

import AirWorkOrderStatisticsModal from '@/pages/IntelligentAnalysis/operationalWorkOrder/airWorkOrderStatistics/AirWorkOrderStatisticsModal'
const { Meta } = Card;
const { TabPane } = Tabs;
const pageUrl = {
  updateState: 'home/updateState',
  getData: 'home/getOverDataRate',
};
@connect(({ loading, home, autoForm }) => ({
  pointStatusLoading: home.pointStatusLoading,
  wasteWaterTable: home.wasteWaterTable,
  dataQueryPar: home.dataQueryPar,
  pointStatusList: home.pointStatusList,
  overWasteWaterLoading: home.overWasteWaterLoading,
  overWasteWaterList: home.overWasteWaterList,
  workOrderList: home.workOrderList,
  workOrderLoading: home.workOrderLoading,
  gasOverListPar: home.gasOverListPar
}))
@Form.create()
export default class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      overListPar: {
        PollutantType: "1",
        BeginTime: moment().add('day', -7).format('YYYY-MM-DD 00:00:00'),
        EndTime: moment().format('YYYY-MM-DD 23:59:59'),
        pollutantCode: '011',
        DataType: 'HourData'
      },
      pollutantType: '1',
      exceedVisible: false,
      waterAlarmVisible: false,
      orderModalVisible: false,
      airWorkOrderVisible: false
    }

  }

  componentDidMount() {

    this.initData()



  }
  componentDidUpdate() {

  }
  initData = () => {
    const { dispatch, dataQueryPar } = this.props;

    let pointStatusPar = { ...dataQueryPar, PollutantType: 1, };
    dispatch({ type: 'home/getPointStatusList', 
    payload: { ...pointStatusPar,DataType: "HourData", BeginTime: moment().add('hour', -1).format('YYYY-MM-DD HH:00:00'),
    EndTime: moment().format('YYYY-MM-DD 23:59:59'), }, });//监测点状态

    dispatch({
      type: 'home/getOperationWorkOrderList', payload: {
        ...pointStatusPar,
        BeginTime: moment().add('day', -30).format('YYYY-MM-DD 00:00:00'),
        EndTime: moment().format('YYYY-MM-DD 23:59:59'),
      },
    });//运维工单统计

    const { overListPar } = this.state;


    this.getTableData(overListPar);
  }

  getTableData = (par) => {
    const { dispatch } = this.props;
    dispatch({ type: 'home/getOverList', payload: { ...par }, });//超标监测点
  }

  tabCallback1 = (value) => {

    const { overListPar } = this.state;

    let parData = { ...overListPar, pollutantCode: value }

    this.setState({ overListPar: parData }, () => {
      this.getTableData(parData);
    })


  }
  tabCallback2 = (value) => {
    const { dispatch, dataQueryPar } = this.props;
    this.setState({ pollutantType: value })
    let parData = {
      ...dataQueryPar, PollutantType: value, BeginTime: moment().add('day', -30).format('YYYY-MM-DD 00:00:00'),
      EndTime: moment().format('YYYY-MM-DD 23:59:59'),
    };

    dispatch({ type: 'home/getOperationWorkOrderList', payload: { ...parData }, });//运维工单统计
  }

  btnChange = (e) => {

    const { overListPar } = this.state;

    let parData = { ...overListPar, DataType: e.target.value }

    this.setState({ overListPar: parData }, () => {
      this.getTableData(parData);
    })
  }
  cardTitle1 = () => {
    const { pointStatusList } = this.props;
    return <Row type='flex' justify='space-between'>
      <span style={{ color: '#fff' }}>废水监测点</span>
      <span
        style={{ color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
        onClick={() => this.onPointStatusClick(undefined)}
      >
        {`${pointStatusList.totalCount ? pointStatusList.totalCount : 0}个`}
      </span>
    </Row>
  }
  cardTitle2 = () => {
    const ButtonGroup = Button.Group;
    return (
      <Row type='flex' align="middle" justify='space-between'>
        <span style={{ cursor: 'pointer' }} onClick={this.overWasteWater}>
          近七日超标废水监测点
          <CaretRightOutlined style={{fontSize:14,paddingLeft:3}} /> 
          </span>
        <Radio.Group defaultValue={"HourData"} onChange={this.btnChange} size='small'>
          <Radio.Button value="HourData">小时</Radio.Button>
          <Radio.Button value="DayData">日均</Radio.Button>
        </Radio.Group>
        <Tabs defaultActiveKey="1" onChange={this.tabCallback1}>
          <TabPane tab="COD" key="011">
          </TabPane>
          <TabPane tab="氨氮" key="060">
          </TabPane>
          <TabPane tab="总磷" key="101">
          </TabPane>
          <TabPane tab="总氮" key="065">
          </TabPane>
          <TabPane tab="PH值" key="001">
          </TabPane>
        </Tabs>

      </Row>
    );
  }
  cardTitle3 = () => {
    return (
      <Row type='flex' align="middle" justify='space-between'>
        <span style={{ cursor: 'pointer' }} onClick={this.workOrder}>
          近30日运维工单统计
          <CaretRightOutlined style={{fontSize:14,paddingLeft:3}} />
          </span>
        <Tabs defaultActiveKey="1" onChange={this.tabCallback2}>
          <TabPane tab="废水" key="1">
          </TabPane>
          <TabPane tab="废气" key="2">
          </TabPane>
          <TabPane tab="空气站" key="5">
          </TabPane>
        </Tabs>

      </Row>
    );
  }
  workOrder = () => {
    const { pollutantType } = this.state;

    if (pollutantType == '5') {
      this.setState({
        airWorkOrderVisible: true
      })
    } else {
      this.setState({
        orderModalVisible: true
      })
    }

  }
  // 监测点状态点击事件
  onPointStatusClick = (type, stopStatus) => {
    if (type == 1) {
      this.setState({
        waterAlarmVisible: true
      })
    } else {
      this.setState({
        clicktStatus: type,
        stopStatus: stopStatus,
        visible_WJQ: true
      })
    }
  }

  getChartData = () => {
    const { workOrderList } = this.props;
    const { pollutantType } = this.state;
    let color = ['#64b0fd', '#9d6ff1', '#42dab8']
    let option = {
      color: ['#64b0fd', '#9d6ff1', '#42dab8'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      legend: {
        data: ['完成工单'],
        right: 0,
        bottom: 0,
        icon: 'rect',
        itemWidth: 20,//图例的宽度
        itemHeight: 10,//图例的高度
        textStyle: {//图例文字的样式
          color: '#333',
        }
      },
      grid: {
        top: 20,
        left: 0,
        right: 20,
        bottom: 30,
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        show: false,//不显示坐标轴线、坐标轴刻度线和坐标轴上的文字
      },
      yAxis: {
        type: 'category',
        data: pollutantType == '5' ? ['维修维护', '质控', '巡检'] : ['校验测试', '维修维护', '校准', '巡检'],
        // show:false,//不显示坐标轴线、坐标轴刻度线和坐标轴上的文字
        axisTick: {
          show: false//不显示坐标轴刻度线
        },
        axisLine: {
          show: false,//不显示坐标轴线
        },
        // boundaryGap: true,
        axisLabel: {
          // show: false,//不显示坐标轴上的文字
          margin: 50, //刻度与轴线之间的距离
        },
      },
      series: [
        {
          name: '完成工单',
          type: 'bar',
          stack: '总量',
          barWidth: 25,//柱子宽度
          label: {
            show: true,
            position: 'left',
            textStyle: {
              color: color[0],
            },
            formatter: (params) => {
              if (params.value === 0) { return "" } else { return params.value }
            }
          },
          data: pollutantType == '5' ?
            [workOrderList.maintenanceRepairComplete, workOrderList.qualityControlComplete, workOrderList.onSiteInspectionComplete]
            :
            [workOrderList.verificationTestComplete, workOrderList.maintenanceRepairComplete, workOrderList.calibrationComplete, workOrderList.onSiteInspectionComplete]
          ,
        },
        // {
        //   name: '未完成',
        //   type: 'bar',
        //   stack: '总量',
        //   barWidth: 25,//柱子宽度
        //   label: {
        //     show: true,
        //     position: 'right',
        //     textStyle: {
        //       color: color[1],
        //     },
        //     formatter: (params) => {
        //       if (params.value === 0) { return "" } else { return params.value }
        //     }
        //   },

        //   position: 'right',
        //   data: pollutantType == '5' ?
        //     [workOrderList.maintenanceRepairUnfinished, workOrderList.qualityControlUnfinished, workOrderList.onSiteInspectionUnfinished]
        //     :
        //     [workOrderList.verificationTestUnfinished, workOrderList.maintenanceRepairUnfinished, workOrderList.calibrationUnfinished, workOrderList.onSiteInspectionUnfinished]
        // },

      ]
    };

    return option;
  }
  overWasteWater = () => {
    this.setState({ exceedVisible: true })
  }
  render() {
    const {
      pointStatusLoading,
      wasteWaterTable,
      overWasteWaterLoading,
      overWasteWaterList,
      workOrderLoading,

    } = this.props;

    const { clicktStatus, stopStatus, visible_WJQ, overListPar, waterAlarmVisible, pollutantType, airWorkOrderVisible, exceedVisible, orderModalVisible } = this.state;
    const { pointStatusList } = this.props;
    return (
      <div style={{ width: '100%' }} className={styles.wasteWaterPoint}  >
        <Row type='flex' justify='space-between' >

          <Col span={6}>
            <Card title={this.cardTitle1()} className={styles.wasteWateCard} bordered={false} >
              <Skeleton loading={pointStatusLoading} active paragraph={{ rows: 5 }} >
                <ul className={styles.listSty}>
                  <li><Row type='flex' justify='space-between'><div><img src='/chaobiaobaojing.png' />超标报警</div> <span onClick={() => this.onPointStatusClick(1)} style={{ background: '#f25fc7' }} className={styles.colorBlock}>{pointStatusList.alarmCount}</span></Row></li>
                  <li><Row type='flex' justify='space-between'><div><img src='/chaobiao.png' />超标</div> <span onClick={() => this.onPointStatusClick(2)} style={{ background: '#f0565d' }} className={styles.colorBlock}>{pointStatusList.overCount}</span></Row></li>
                  <li><Row type='flex' justify='space-between'><div><img src='/lixian.png' />离线</div> <span onClick={() => this.onPointStatusClick(0)} style={{ background: '#bdc4cc' }} className={styles.colorBlock}>{pointStatusList.unLine}</span></Row></li>
                  <li><Row type='flex' justify='space-between'><div><img src='/guzhang.png' />异常</div> <span onClick={() => this.onPointStatusClick(3)} style={{ background: '#f5a86a' }} className={styles.colorBlock}>{pointStatusList.exceptionCount}</span></Row></li>
                  <li><Row type='flex' justify='space-between'><div><img src='/tingyun.png' />停运</div> <span onClick={() => this.onPointStatusClick(4)} style={{ background: '#40474e' }} className={styles.colorBlock}>{pointStatusList.stopCount}</span></Row></li>
                </ul>
              </Skeleton>
            </Card>
          </Col>
          <Col span={12} className={styles.sevenCard}>
            <Card title={this.cardTitle2()} bordered={false} >
              <Skeleton loading={overWasteWaterLoading} active paragraph={{ rows: 5 }}>
                <ScrollTable type='wasteWater' data={overWasteWaterList} column={['师市', '企业名称', '监测点名称', '最大超标倍数']} />
              </Skeleton>
            </Card>
          </Col>
          <Col span={6}>
            <Card title={this.cardTitle3()} className={styles.workOrderStatCard} bordered={false} >
              <Skeleton loading={workOrderLoading} active paragraph={{ rows: 5 }}>
                <ReactEcharts
                  option={this.getChartData()}
                  className="echarts-for-echarts"
                  theme="my_theme"
                  style={{ height: 214 }}
                />
              </Skeleton>
            </Card>
          </Col>
        </Row>
        {orderModalVisible ?
          <EntWorkOrderModal
            showModal={orderModalVisible}
            onCloseListener={() => { this.setState({ orderModalVisible: false }) }}
            pollutantTypeCode={pollutantType}
          /> : null}
        {airWorkOrderVisible ? <AirWorkOrderStatisticsModal airWorkOrderVisible={airWorkOrderVisible} airWorkOrderCancelFun={() => { this.setState({ airWorkOrderVisible: false }) }} /> : null}
        {/**近七日废水超标监测点*/}
        {exceedVisible ? <ExceedData exceedDataType={overListPar.DataType == 'HourData' ? 'Hour' : 'Day'} exceedPollutant={overListPar.pollutantCode} exceedTime={[moment().add('day', -7).startOf(), moment()]} exceedVisible={exceedVisible} exceedType={overListPar.PollutantType} exceedCancle={() => {
          this.setState({ exceedVisible: false });
        }} /> : null}
        {/**超标报警*/}
        {waterAlarmVisible ? <ExceedDataAlarm
          dateTime={[moment().subtract(1, "hour").startOf("hour"),
          moment()]} alarmType={pollutantType} alarmVisible={waterAlarmVisible} alarmCancle={() => {
            this.setState({ waterAlarmVisible: false });
          }} /> : null}
        {
          visible_WJQ && <DetailsModal_WJQ status={clicktStatus} stopStatus={stopStatus} defaultPollutantCode={1} onCancel={() => {
            this.setState({
              visible_WJQ: false
            })
          }} />
        }
      </div>
    );
  }
}
