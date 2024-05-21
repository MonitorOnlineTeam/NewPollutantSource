/**
/**
 * 功  能：统计量变化趋势
 * 创建人：贾安波
 * 创建时间：2019.10.19
 */
import React, { Component } from 'react';
import { ExportOutlined } from '@ant-design/icons';
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
  Spin,
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import Link from 'umi/link';
import webConfig from '@public/webConfig';
import SdlTable from '@/components/SdlTable';
import DatePickerTool from '@/components/RangePicker/DatePickerTool';
import { router } from 'umi';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import { downloadFile, GetDataType, toDecimal3 } from '@/utils/utils';
import ButtonGroup_ from '@/components/ButtonGroup'
import ReactEcharts from 'echarts-for-react';
import { blue, red, green, gold, purple, grey, magenta } from '@ant-design/colors';
import PageLoading from '@/components/PageLoading'
import { EnumPropellingAlarmSourceType } from '@/utils/enum';



const { Search } = Input;
const { MonthPicker } = DatePicker;
const { Option } = Select;
const { RangePicker } = DatePicker;
const defaultSelectPollutantCode = webConfig.defaultSelectPollutantCode;
const monthFormat = 'YYYY-MM';
const dateFormat = 'YYYY-MM-DD HH:00:00';
const pageUrl = {
  updateState: 'densityContrastModel/updateState',
  getData: 'densityContrastModel/getAreaDensityContrast',
};
@connect(({ loading, densityContrastModel, autoForm }) => ({
  exloading: densityContrastModel.exloading,
  loading: densityContrastModel.loading,
  total: densityContrastModel.total,
  tableDatas: densityContrastModel.tableDatas,
  queryPar: densityContrastModel.queryPar,
  column: densityContrastModel.column,
  chartTime: densityContrastModel.timeList,
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
    this.queryClick();
  };


  updateQueryState = payload => {
    const { queryPar, dispatch } = this.props;
    dispatch({
      type: pageUrl.updateState,
      payload: { queryPar: { ...queryPar, ...payload } },
    });
  };

  getTableData = () => {
    const { dispatch, queryPar } = this.props;
    dispatch({
      type: pageUrl.getData,
      payload: { ...queryPar },
    });
  };

  //创建并获取模板   导出
  template = () => {
    const { dispatch, queryPar } = this.props;
    dispatch({
      type: 'densityContrastModel/exportSewageHistoryList',
      payload: { ...queryPar },
      callback: data => {
        downloadFile(`/upload${data}`);
      },
    });
  };
  // //查询事件
  queryClick = () => {
    const { pointName, dispatch, queryPar: { DGIMN, PollutantList, EntCode } } = this.props;
    this.getTableData();
  };
  ondateChange = (value, dateString) => {
    const { queryPar, dispatch } = this.props;
    if(queryPar.DataType=="HourData")
    {
      this.updateQueryState({
       BeginTime: moment(dateString,'YYYY-MM-DD').startOf('day').format('YYYY-MM-DD 00:00:00'),
       EndTime: moment(dateString,'YYYY-MM-DD').endOf('day').format('YYYY-MM-DD 23:59:59'),
      });
    }else {
      this.updateQueryState({
       BeginTime: moment(dateString,'YYYY-MM-DD').startOf('month').format('YYYY-MM-DD 00:00:00'),
       EndTime: moment(dateString,'YYYY-MM-DD').endOf('month').format('YYYY-MM-DD 00:00:00'),
      });
    }
  };
 
  /** 数据类型切换 */
  _handleDateTypeChange = e => {
    const { queryPar, dispatch } = this.props;
    if(e.target.value=="HourData")
    {
      this.updateQueryState({
       BeginTime: moment(queryPar.BeginTime,'YYYY-MM-DD').startOf('day').format('YYYY-MM-DD 00:00:00'),
       EndTime: moment(queryPar.EndTime,'YYYY-MM-DD').endOf('day').format('YYYY-MM-DD 23:59:59'),
       DataType: e.target.value
      });
    }else {
      this.updateQueryState({
       BeginTime: moment(queryPar.BeginTime,'YYYY-MM-DD').startOf('month').format('YYYY-MM-DD 00:00:00'),
       EndTime: moment(queryPar.EndTime,'YYYY-MM-DD').endOf('month').format('YYYY-MM-DD 00:00:00'),
       DataType: e.target.value
      });
    }

  }


  getChartData = () => {
    const { chartExport, chartImport, chartTime, entName, PollutantList, column,tableDatas } = this.props;
    let pollSelect = [], pollName = []
    if (column.length > 0) {
      column.map(item => {
        var valuedata=[]
        
        tableDatas.map(t=>{
          valuedata.push(t[item.ID+"_monitorValue"]);
        })
  
        pollSelect.push({ name: `${item.BranchFactoryName
        }`, type: 'line', data: valuedata
      })
        pollName.push(`${item.BranchFactoryName
        }`)
      })
    }

    return {
      // darkMode: true,
      backgroundColor: 'transparent',
      color: [blue[5], red[5], green[5], gold[5], purple[5], grey[5], magenta[5]],
      title: {
        // text:entName,//图表标题文本内
        textStyle: {//标题内容的样式
          fontSize: 14//主题文字字体大小，默认为18px
        },
        left: 'center',
        top: 30
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: pollName,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: 80,
        containLabel: true
      },
      toolbox: {
        right: 20,
        feature: {
          saveAsImage: {
            show: true,
            //  emphasis:{iconStyle:{textPadding: [0, 10, 0, 0]}}
          }
        },
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: chartTime
      },
      yAxis: [
        {
          //name: '浓度值',
          type: 'value',
        }
      ],
      series: pollSelect
    };
  }
 

  render() {
    const {
      exloading,
      loading,
      queryPar: { RegionCode, EntCode, PollutantType, AttentionCode, beginTime, endTime, DataType, PollutantList, DGIMN },
      column,
      EntList,
      PointList,
      pointLoading
    } = this.props;

    return (
      <Card
        bordered={false}
        title={
          <>
            <Form layout="inline">
              <Row>
                <Form.Item>
                  <Radio.Group defaultValue="HourData" onChange={this._handleDateTypeChange}>
                    <Radio.Button value="HourData">小时</Radio.Button>
                    <Radio.Button value="DayData">日均</Radio.Button>
                  </Radio.Group>
                </Form.Item>
                <Form.Item >
                <DatePicker onChange={this.ondateChange} defaultValue={moment().subtract(0, 'day')}/>
                </Form.Item>
                <Form.Item>
                  <Button type="primary" onClick={this.queryClick}>
                    查询
                  </Button>
                  <Button
                     style={{ margin: '0 5px' }}
                     icon={<ExportOutlined />}
                     onClick={this.template}
                     //loading={exloading}
                   >
                     导出
                   </Button>
                </Form.Item>
              </Row> 
            </Form>
          </>
        }
      >
        <div id='emissionsChange'>
           <ReactEcharts
            option={this.getChartData()}
            className="echarts-for-echarts"
            style={{ height: "calc(100vh - 350px)", paddingTop: 10 }}
          /> 
        </div>
      </Card>
    );
  }
}
