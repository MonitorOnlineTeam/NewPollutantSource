
/**
 * 功  能：首页
 * 创建人：贾安波
 * 创建时间：2020.10
 */
import React, { Component } from 'react';
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
  Modal,
  Input,
  Button,
  Form,
  Select,
  Tabs,
  Radio,
  Checkbox,
  message,
  Skeleton,
  Avatar,
  Dropdown,
  Menu
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import Link from 'umi/link';
import styles from '../style.less'
import ReactEcharts from 'echarts-for-react';
import ScrollTable from './ScrollTable'
import DetailsModal_WJQ from "./DetailsModal_WJQ"
import AlarmCard from './AlarmCard'
import ExceedDataAlarm from '@/pages/dataSearch/exceedDataAlarmRecord/exceedDataAlarmModal'
import ExceedData from '@/pages/dataSearch/exceedData/exceedDataModal'
const { Meta } = Card;
const { TabPane } = Tabs;
const pageUrl = {
  updateState: 'home/updateState',
  getData: 'home/getOverDataRate',
};
@connect(({ loading, home, autoForm }) => ({
  pointStatusLoading: home.pointStatusLoading,
  dataQueryPar: home.dataQueryPar,
  wasteGasStatusList: home.wasteGasStatusList,
  overWasteGasLoading: home.overWasteGasLoading,
  overWasteGasList: home.overWasteGasList,
  alarmResponseList: home.alarmResponseList,
  alarmResponseLoading: home.alarmResponseLoading,
  gasOverListPar: home.gasOverListPar
}))
@Form.create()
export default class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      gasOverListPar: {
        PollutantType: "2",
        BeginTime: moment().add('day', -7).format('YYYY-MM-DD 00:00:00'),
        EndTime: moment().format('YYYY-MM-DD 23:59:59'),
        pollutantCode: '01',
        DataType: 'HourData'
      },
      OverVisible: false,
      gasAlarmVisible: false,
      gasExceedVisible: false,
      pollutantType:'2'
    }
  }
  componentDidMount() {

    this.initData()
  }

  componentDidUpdate() {

  }
  overWasteGas = () => {
    this.setState({ gasExceedVisible: true })
  }
  initData = () => {
    const { dataQueryPar, dispatch } = this.props;
    let pointStatusPar = { ...dataQueryPar, PollutantType: 2 };
    dispatch({ type: 'home/getPointStatusList', 
    payload: { ...pointStatusPar,DataType: "HourData", BeginTime: moment().add('hour', -1).format('YYYY-MM-DD HH:00:00'),
    EndTime: moment().format('YYYY-MM-DD 23:59:59'), }, });//监测点状态
    dispatch({ type: 'home/getAlarmResponse', payload: { ...dataQueryPar, BeginTime: moment().add('day', -7).format('YYYY-MM-DD 00:00:00'), EndTime: moment().format('YYYY-MM-DD 23:59:59'), } });//数据报警响应


    const { gasOverListPar } = this.state;
    this.getTableData(gasOverListPar);
  }

  getTableData = (par) => {
    const { dispatch } = this.props;
    dispatch({ type: 'home/getOverList', payload: { ...par }, });//超标监测点
  }

  btnChange = (e) => {

    const { gasOverListPar } = this.state;

    let parData = { ...gasOverListPar, DataType: e.target.value }

    this.setState({ gasOverListPar: parData }, () => {
      this.getTableData(parData);
    })
  }
  cardTitle1 = () => {
    const { wasteGasStatusList } = this.props;
    return <Row type='flex' justify='space-between'>
      <span style={{ color: '#fff' }}>废气监测点</span>
      <span
        style={{ color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
        onClick={() => this.onPointStatusClick(undefined)}
      >
        {`${wasteGasStatusList.totalCount ? wasteGasStatusList.totalCount : 0}个`}
      </span>
    </Row>
  }
  cardTitle2 = () => {
    const ButtonGroup = Button.Group;
    return <Row type='flex' align="middle" justify='space-between'>
      <span style={{ cursor: 'pointer' }} onClick={this.overWasteGas}>近七日超标废气监测点</span>
      <Radio.Group defaultValue={"HourData"} onChange={this.btnChange} size='small'>
        <Radio.Button value="HourData">小时</Radio.Button>
        <Radio.Button value="DayData">日均</Radio.Button>
      </Radio.Group>
      <Tabs defaultActiveKey="01" onChange={this.tabCallback1}>
        <TabPane tab="烟尘" key="01">
        </TabPane>
        <TabPane tab="二氧化硫" key="02">
        </TabPane>
        <TabPane tab="氮氧化物" key="03">
        </TabPane>
      </Tabs>

    </Row>
  }


  tabCallback1 = (value) => {
    const { gasOverListPar } = this.state;

    let parData = { ...gasOverListPar, pollutantCode: value }

    this.setState({ gasOverListPar: parData }, () => {
      this.getTableData(parData);
    })
  }

  percentage = (data) => {
    return `${data}%`
  }
  // getChartData = (type) => {

  //   const { alarmResponseList } = this.props;
  //   let color1 = ["#42dab8", "#7ef1d7"],
  //     color2 = ["#fdcb31", '#fde290'],
  //     color3 = ['#5169c5', '#889be2']
  //   let option = {
  //     tooltip: {
  //       show: false,
  //       trigger: 'item',
  //       formatter: "{a} <br/>{b}: {c} ({d}%)"
  //     },
  //     color: type == 1 ? color1 : type == 2 ? color2 : color3,
  //     title: {
  //       text: type == 1 ? this.percentage(alarmResponseList.operationRate) : type == 2 ? this.percentage(alarmResponseList.exceptionRate) : this.percentage(alarmResponseList.missRate),
  //       left: "center",
  //       top: "42%",
  //       textStyle: {
  //         color: type == 1 ? color1[1] : type == 2 ? color2[1] : color3[1],
  //         fontSize: 16,
  //         align: "center",
  //         fontWeight: 400
  //       }
  //     },
  //     series: [
  //       {
  //         name: type == 1 ? '数据超标报警核实率' : type == 2 ? '数据异常报警响应率' : '数据缺失报警响应率',
  //         type: 'pie',
  //         // center: ['50%', '50%'],
  //         radius: ['50%', '70%'],
  //         avoidLabelOverlap: false,
  //         label: {
  //           normal: {
  //             show: false,
  //             position: 'center'
  //           },

  //         },

  //         data: [
  //           { value: type == 1 ? alarmResponseList.operationRate : type == 2 ? alarmResponseList.exceptionRate : alarmResponseList.missRate, name: '已完成' },
  //           { value: type == 1 ? (100 - alarmResponseList.operationRate) : type == 2 ? (100 - alarmResponseList.exceptionRate) : (100 - alarmResponseList.missRate), name: '未完成' },

  //         ]
  //       }
  //     ]
  //   };
  //   return option;
  // }

  // 监测点状态点击事件
  onPointStatusClick = (type, stopStatus) => {
    if (type == 1) {
      this.setState({
        gasAlarmVisible: true
      })
    } else {
      this.setState({
        clicktStatus: type,
        stopStatus: stopStatus,
        visible_WJQ: true,
        time: undefined
      })
    }

  }

  render() {
    const {
      pointStatusLoading,
      wasteGasStatusList,
      overWasteGasLoading,
      overWasteGasList,
      alarmResponseLoading,
    } = this.props;

    const { clicktStatus, stopStatus, visible_WJQ, ECXYLTime, currentTabKey, gasAlarmVisible, pollutantType, gasOverListPar, gasExceedVisible } = this.state;

    return (
      <div style={{ width: '100%' }} className={`${styles.wasteWaterPoint} ${styles.wasteGasPoint}`}  >
        <Row type='flex' justify='space-between' >

          <Col span={6}>
            <Card title={this.cardTitle1()} className={`${styles.wasteWateCard} ${styles.wasteGasCard}`} bordered={false} >
              <Skeleton loading={pointStatusLoading} active paragraph={{ rows: 5 }}>
                <ul className={styles.listSty}>
                  <li><Row type='flex' justify='space-between'><div><img src='/chaobiaobaojing.png' />超标报警</div> <span style={{ background: '#f25fc7' }} onClick={() => this.onPointStatusClick(1)} className={styles.colorBlock}>{wasteGasStatusList.alarmCount}</span></Row></li>
                  <li><Row type='flex' justify='space-between'><div><img src='/chaobiao.png' />超标</div> <span onClick={() => this.onPointStatusClick(2)} style={{ background: '#f0565d' }} className={styles.colorBlock}>{wasteGasStatusList.overCount}</span></Row></li>
                  <li><Row type='flex' justify='space-between'><div><img src='/lixian.png' />离线</div> <span onClick={() => this.onPointStatusClick(0)} style={{ background: '#bdc4cc' }} className={styles.colorBlock}>{wasteGasStatusList.unLine}</span></Row></li>
                  <li><Row type='flex' justify='space-between'><div><img src='/guzhang.png' />异常</div> <span onClick={() => this.onPointStatusClick(3)} style={{ background: '#f5a86a' }} className={styles.colorBlock}>{wasteGasStatusList.exceptionCount}</span></Row></li>
                  <li><Row type='flex' justify='space-between'><div><img src='/tingyun.png' />停运</div> <span onClick={() => this.onPointStatusClick(4)} style={{ background: '#40474e' }} className={styles.colorBlock}>{wasteGasStatusList.stopCount}</span></Row></li>
                </ul>
              </Skeleton>
            </Card>
          </Col>
          <Col span={12} className={styles.sevenCard}>
            <Card title={this.cardTitle2()} bordered={false} >
              <Skeleton loading={overWasteGasLoading} active paragraph={{ rows: 5 }}>
                <ScrollTable type='wasteGas' data={overWasteGasList} column={['师市', '企业名称', '监测点名称', '最大超标倍数']} />
              </Skeleton>
            </Card>
          </Col>
          <Col span={6}>


            <AlarmCard />
            {/* <Skeleton loading={alarmResponseLoading} active paragraph={{ rows: 5 }}>
                <Row type='flex' align='middle' justify='space-between'>
                  <Col span={8} align='middle'>
                    <ReactEcharts
                      option={this.getChartData(1)}
                      className="echarts-for-echarts"
                      theme="my_theme"
                      style={{ width: '100%', height: 120 }}
                    />
                    <div>
                      <div className={styles.title1}>核实率</div>
                      <div className={styles.title2}>数据超标报警</div>
                    </div>
                  </Col>
                  <Col span={8} align='middle'>
                    <ReactEcharts
                      option={this.getChartData(2)}
                      className="echarts-for-echarts"
                      theme="my_theme"
                      onEvents={{
                        click: (event) => {
                          let time = currentTabKey === '1' ? [moment().subtract(7, "days").startOf("day"), moment().endOf("day")] : [moment().subtract(30, "days").startOf("day"), moment().endOf("day")]
                          // 响应率
                          this.setState({
                            ECXYLTime: time,
                            visible_WJQ: true
                          })
                        }
                      }}
                      style={{ width: '100%', height: 120 }}
                    />
                    <div>
                      <div className={styles.title1}>响应率</div>
                      <div className={styles.title2}>数据异常报警</div>
                    </div>
                  </Col>
                  <Col span={8} align='middle'>
                    <ReactEcharts
                      option={this.getChartData(3)}
                      className="echarts-for-echarts"
                      theme="my_theme"
                      style={{ width: '100%', height: 122 }}
                    />
                    <div>
                      <div className={styles.title1}>响应率</div>
                      <div className={styles.title2}>数据缺失报警</div>
                    </div>
                  </Col>
                </Row>
              </Skeleton> */}

          </Col>
        </Row>
        {/**超标报警*/}
        {gasAlarmVisible ? <ExceedDataAlarm
          dateTime={[moment().subtract(1, "hour").startOf("hour"),
          moment()]} alarmType={pollutantType} alarmVisible={gasAlarmVisible} alarmCancle={() => {
            this.setState({ gasAlarmVisible: false });
          }} /> : null}
        {/**近七日废气超标监测点*/}
        {gasExceedVisible ? <ExceedData exceedTime={[moment().add('day', -7).startOf(), moment()]} exceedVisible={gasExceedVisible} exceedDataType={gasOverListPar.DataType == 'HourData' ? 'Hour' : 'Day'} exceedPollutant={gasOverListPar.pollutantCode} 
         exceedType={gasOverListPar.PollutantType} exceedCancle={() => {
          this.setState({ gasExceedVisible: false });
        }} /> : null}
        {
          visible_WJQ && <DetailsModal_WJQ time={ECXYLTime} status={clicktStatus} stopStatus={stopStatus} defaultPollutantCode={2} onCancel={() => {
            this.setState({
              visible_WJQ: false
            })
          }} />
        }
      </div>
    );
  }
}
