
/**
 * 功  能：首页
 * 创建人：贾安波
 * 创建时间：2020.11
 */
import React, { Component, PureComponent } from 'react';
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
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import Link from 'umi/link';

import SdlTable from '@/components/SdlTable';
import DatePickerTool from '@/components/RangePicker/DatePickerTool';
import { router } from 'umi';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import { downloadFile, GetDataType, toDecimal3, interceptTwo } from '@/utils/utils';
import ButtonGroup_ from '@/components/ButtonGroup'
import ReactEcharts from 'echarts-for-react';
import { blue, red, green, gold, grey } from '@ant-design/colors';
import PageLoading from '@/components/PageLoading'
import RegionList from '@/components/RegionList'
import EntAtmoList from '@/components/EntAtmoList'
import EntType from '@/components/EntType'
import AttentList from '@/components/AttentList'
import { EnumPropellingAlarmSourceType } from '@/utils/enum'
import DetailsModal_WJQ from "./DetailsModal_WJQ"
import OverVerifyLstModal from '@/pages/IntelligentAnalysis/dataAlarm/overVerifyRate/components/OverVerifyLstModal'
import MissingDataRateModel from '../components/jumpPage/MissingDataRateModel'
import styles from '../style.less'
const { Search } = Input;
const { MonthPicker } = DatePicker;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs
const monthFormat = 'YYYY-MM';

const pageUrl = {
  updateState: 'home/updateState',
  getData: 'home/getOverDataRate',
};
@connect(({ loading, home, autoForm }) => ({
  alarmResponseList: home.alarmResponseList,
  alarmResponseLoading: home.alarmResponseLoading,
  dataQueryPar: home.dataQueryPar,
  hover1: home.hover1
}))
@Form.create()
export default class Index extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      OverVisible: false,
      TBeginTime: moment().subtract(7, "days").startOf("day"),
      TEndTime: moment().endOf("day"),
      OverVisible: false,
      currentTabKey: '1',
      popoverVisible: false,
      missingRateVisible: false,
      missDataTime: [moment().subtract(7, "days").startOf("day"), moment().endOf("day")]
    };

  }

  componentDidMount() {
    this.initData();
  }
  initData = () => {
    let { dispatch } = this.props;
    dispatch({ type: 'home/getAlarmResponse', payload: { BeginTime: moment().add('day', -7).format('YYYY-MM-DD 00:00:00'), EndTime: moment().format('YYYY-MM-DD 23:59:59'), } });//数据报警响应
  }
  percentage = (data) => {
    return `${data}%`
  }
  getChartData = (type) => {

    const { alarmResponseList } = this.props;
    let color1 = ["#42dab8", "#7ef1d7"],
      color2 = ["#fdcb31", '#fde290'],
      color3 = ['#5169c5', '#889be2']
    let option = {
      tooltip: {
        show: false,
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      color: type == 1 ? color1 : type == 2 ? color2 : color3,
      title: {
        text: type == 1 ? this.percentage(alarmResponseList.operationRate) : type == 2 ? this.percentage(alarmResponseList.exceptionRate) : this.percentage(alarmResponseList.missRate),
        left: "center",
        top: "42%",
        textStyle: {
          color: type == 1 ? color1[1] : type == 2 ? color2[1] : color3[1],
          fontSize: 16,
          align: "center",
          fontWeight: 400
        }
      },
      series: [
        {
          name: type == 1 ? '数据超标报警核实率' : type == 2 ? '数据异常报警响应率' : '数据缺失报警响应率',
          type: 'pie',
          radius: ['62%', '83%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              position: 'center'
            },

          },

          data: [
            { value: type == 1 ? alarmResponseList.operationRate : type == 2 ? alarmResponseList.exceptionRate : alarmResponseList.missRate, name: '已完成' },
            { value: type == 1 ? (100 - alarmResponseList.operationRate) : type == 2 ? (100 - alarmResponseList.exceptionRate) : (100 - alarmResponseList.missRate), name: '未完成' },

          ]
        }
      ]
    };
    return option;
  }
  tabCallback2 = (value) => {
    const { dispatch, dataQueryPar } = this.props;
    this.setState({ currentTabKey: value })
    let parData = {
      ...dataQueryPar,
      BeginTime: value == 1 ? moment().add('day', -7).format('YYYY-MM-DD 00:00:00') : moment().add('day', -30).format('YYYY-MM-DD 00:00:00'),
      EndTime: moment().format('YYYY-MM-DD 23:59:59'),
    };


    dispatch({ type: 'home/getAlarmResponse', payload: { ...parData } });//数据报警响应

  }
  cardTitle3 = () => {
    return <Row type='flex' align="middle" justify='space-between'>
      <span>数据报警响应统计</span>
      <Tabs defaultActiveKey="1" onChange={this.tabCallback2}>
        <TabPane tab="近7天" key="1">
        </TabPane>
        <TabPane tab="近30天" key="2">
        </TabPane>
      </Tabs>
    </Row>
  }
  onMouseOver1 = () => {
    // sessionStorage.setItem('hover1',true)
    const { dispatch } = this.props;
    dispatch({ type: pageUrl.updateState, payload: { hover1: true } })
  }
  onMouseOver2 = () => {
  }
  onMouseOut1 = () => {
    const { dispatch } = this.props;
    dispatch({ type: pageUrl.updateState, payload: { hover1: false } })

  }
  onMouseOut2 = () => {

  }
  content = () => {
    // const { hover1 } = this.props;
    return <div>
      <div><a onClick={this.entClick}>企业</a></div>
      <div style={{ paddingTop: 8 }}> <a onClick={this.airClick}>空气站</a></div>
    </div>
  }
  entClick = () => {
    this.setState({ type: 'ent' }, () => {
      this.setState({
        missingRateVisible: true,
        popoverVisible: false
      })
    })
  }
  airClick = () => {
    this.setState({ type: 'air' }, () => {
      this.setState({
        missingRateVisible: true,
        popoverVisible: false
      })
    })
  }
  onVisibleChange = () => {
    this.setState({
      popoverVisible: false
    })
  }
  // shouldComponentUpdate(nextProps, nextState) {
  // if(this.state.popoverVisible !=nextState.popoverVisible){
  //   return false
  // }
  // return true
  // }
  render() {
    const {
      alarmResponseLoading
    } = this.props;
    const { clicktStatus, missDataTime, stopStatus, missingRateVisible, visible_WJQ, ECXYLTime, currentTabKey, OverVisible, TBeginTime, TEndTime, type, popoverVisible } = this.state;

    return (
      <Card title={this.cardTitle3()} className={styles.alarmCard} bordered={false} >
        <Skeleton loading={alarmResponseLoading} active paragraph={{ rows: 4 }}>

          <Row type='flex' align='middle' justify='space-between'>
            <Col span={8} align='middle'>

              <ReactEcharts
                option={this.getChartData(1)}
                className="echarts-for-echarts"
                theme="my_theme"
                style={{ width: '100%', height: 120 }}
                // onEvents={{
                //   click: (event) => {
                //     let time = currentTabKey === '1' ? [moment().subtract(7, "days").startOf("day"), moment().endOf("day")] : [moment().subtract(30, "days").startOf("day"), moment().endOf("day")]
                //     // 响应率

                //     this.setState({
                //       TBeginTime: time[0],
                //       TEndTime: time[1],
                //       OverVisible: true,
                //     })

                //   }
                // }}
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
                // onEvents={{
                //   click: (event) => {
                //     let time = currentTabKey === '1' ? [moment().subtract(7, "days").startOf("day"), moment().endOf("day")] : [moment().subtract(30, "days").startOf("day"), moment().endOf("day")]
                //     // 响应率
                //     this.setState({
                //       ECXYLTime: time,
                //       visible_WJQ: true
                //     })
                //   }
                // }}
                style={{ width: '100%', height: 120 }}
              />
              <div>
                <div className={styles.title1}>响应率</div>
                <div className={styles.title2}>数据异常报警</div>
              </div>
            </Col>
            <Col span={8} align='middle'>
              <Popover onVisibleChange={this.onVisibleChange} visible={popoverVisible} placement="top" content={this.content()} title="选择类型" trigger="click">
                <ReactEcharts
                  option={this.getChartData(3)}
                  className="echarts-for-echarts"
                  theme="my_theme"
                  // onEvents={{
                  //   click: (event) => {
                  //     let time = currentTabKey === '1' ? [moment().subtract(7, "days").startOf("day"), moment().endOf("day")] : [moment().subtract(30, "days").startOf("day"), moment().endOf("day")]

                  //     // 响应率
                  //     this.setState({
                  //       missDataTime: time,

                  //     }, () => {
                  //       this.setState({ popoverVisible: true, })
                  //     })
                  //   }
                  // }}
                  style={{ width: '100%', height: 122 }}
                />
                <div>
                  <div className={styles.title1}>响应率</div>
                  <div className={styles.title2}>数据缺失报警</div>
                </div>
              </Popover>
            </Col>
          </Row>
        </Skeleton>
        {missingRateVisible ?
          <MissingDataRateModel type={type}
            time={missDataTime}
            missingRateVisible={missingRateVisible} missingRateCancel={() => {
              this.setState({ missingRateVisible: false })
            }} />
          : null}
        {/**超标报警核实率 */}
        {
          OverVisible ?
            <OverVerifyLstModal
              beginTime={TBeginTime}
              endTime={TEndTime}
              TVisible={OverVisible}
              TCancle={() => {
                this.setState({ OverVisible: false });
              }}
            /> : null}
        {
          visible_WJQ && <DetailsModal_WJQ time={ECXYLTime} onCancel={() => {
            this.setState({
              visible_WJQ: false
            })
          }} />
        }
      </Card>
    );
  }
}
