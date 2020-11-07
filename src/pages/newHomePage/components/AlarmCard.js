
/**
 * 功  能：首页
 * 创建人：贾安波
 * 创建时间：2020.11
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
  Skeleton
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import Link from 'umi/link';

import SdlTable from '@/components/SdlTable';
import DatePickerTool from '@/components/RangePicker/DatePickerTool';
import { router } from 'umi';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import { downloadFile,GetDataType,toDecimal3,interceptTwo} from '@/utils/utils';
import ButtonGroup_ from '@/components/ButtonGroup'
import ReactEcharts from 'echarts-for-react';
import { blue,red,green,gold,grey} from '@ant-design/colors';
import PageLoading from '@/components/PageLoading'
import RegionList from '@/components/RegionList'
import EntAtmoList from '@/components/EntAtmoList'
import EntType from '@/components/EntType'
import AttentList from '@/components/AttentList'
import { EnumPropellingAlarmSourceType } from '@/utils/enum'

import styles from '../style.less'
const { Search } = Input;
const { MonthPicker } = DatePicker;
const { Option } = Select;
const { RangePicker } = DatePicker;
const monthFormat = 'YYYY-MM';

const pageUrl = {
  updateState: 'home/updateState',
  getData: 'home/getOverDataRate',
};
@connect(({ loading, home,autoForm }) => ({
    alarmResponseList: home.alarmResponseList,
    alarmResponseLoading: home.alarmResponseLoading,
}))
@Form.create()
export default class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {

    };
    
}

  componentDidMount() {
    this.initData();
  }
  initData = () => {
    let { dispatch } = this.props;
    dispatch({ type: 'home/getAlarmResponse', payload: {BeginTime: moment().add('day', -7).format('YYYY-MM-DD 00:00:00'), EndTime: moment().format('YYYY-MM-DD 23:59:59'), } });//数据报警响应
    
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
          // center: ['50%', '50%'],
          radius: ['50%', '70%'],
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
  render() {
    const {
        alarmResponseLoading
    } = this.props;


    return (
        <>
         <Skeleton loading={alarmResponseLoading} active paragraph={{ rows: 5 }}>

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
</Skeleton>

       </>
    );
  }
}
