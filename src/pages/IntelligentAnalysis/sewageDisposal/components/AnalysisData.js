/**
 * 功  能：统计分析 流量对比分析
 * 创建人：jab
 * 创建时间：2020 10
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
  message,
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import Link from 'umi/link';

import SdlTable from '@/components/SdlTable';
import DatePickerTool from '@/components/RangePicker/DatePickerTool';
import { router } from 'umi';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import { downloadFile, GetDataType, toDecimal3,interceptTwo } from '@/utils/utils';
import ButtonGroup_ from '@/components/ButtonGroup'
import ReactEcharts from 'echarts-for-react';
import { blue, red } from '@ant-design/colors';
import PageLoading from '@/components/PageLoading'
const { Search } = Input;
const { MonthPicker } = DatePicker;
const { Option } = Select;
const { RangePicker } = DatePicker;
const monthFormat = 'YYYY-MM';

const pageUrl = {
  updateState: 'removalFlowRate/updateState',
  getData: 'removalFlowRate/getSewageHistoryList',
};
@connect(({ loading, removalFlowRate, autoForm }) => ({
  priseList: removalFlowRate.priseList,
  exloading: removalFlowRate.exloading,
  loading: removalFlowRate.loading,
  total: removalFlowRate.total,
  tableDatas: removalFlowRate.tableDatas,
  queryPar: removalFlowRate.queryPar,
  regionList: autoForm.regionList,
  attentionList: removalFlowRate.attentionList,
  pointName: removalFlowRate.pointName,
  chartExport: removalFlowRate.chartExport,
  chartImport: removalFlowRate.chartImport,
  chartTime: removalFlowRate.chartTime,
  entName: removalFlowRate.entName,
}))
@Form.create()
export default class EntTransmissionEfficiency extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };

    this.columns = [
      {
        title: '监测时间',
        dataIndex: 'MonitorTime',
        key: 'MonitorTime',
        align: 'center',
        render: (text, record) => {
          return <span>{moment(text).format('YYYY-MM-DD HH:mm')}</span>;
        },
      },
      {
        title: '监测点名称',
        dataIndex: 'pointName',
        key: 'pointName',
        align: 'center',
        render: (text, record) => {
          return <span>{this.props.pointName}</span>;
        },
      },
      {
        title: '进水口',
        width: 400,
        children: [
          {
            title: '浓度(mg/L)',
            dataIndex: 'importValue',
            key: 'importValue',
            width: 200,
            align: 'center',
            render: (text, record) => {
              return <span>{text !== undefined && text != '-' ? toDecimal3(text) : "-"}</span>;
            },
          },
          {
            title: '是否停运',
            dataIndex: 'importStop',
            key: 'importStop',
            align: 'center',
            render: (text, record) => {
              return text == 0 ? "否" : text == 1 ? '是' : text;
            },
            width: 200,

          },
        ],
      },
      {
        title: '出水口',
        width: 400,
        children: [
          {
            title: '浓度(mg/L)',
            dataIndex: 'exportValue',
            key: 'exportValue',
            width: 200,
            align: 'center',
            render: (text, record) => {
              return <span>{text !== undefined && text != '-' ? toDecimal3(text) : "-"}</span>;
            },
          },
          {
            title: '是否停运',
            dataIndex: 'exportStop',
            key: 'exportStop',
            width: 200,
            align: 'center',
            render: (text, record) => {
              return text == 0 ? "否" : text == 1 ? '是' : text;
            },
          },
        ],
      },
      {
        title: '去除率(%)',
        dataIndex: 'removalRate',
        key: 'removalRate',
        align: 'center',
        render: (text, record) => {
          return <span>{text&&text!='-'?`${interceptTwo(text)}%` : '-'}</span>;
        },
      },
    ]
  }

  componentDidMount() {
    this.initData();
  }
  initData = () => {
    const { dispatch, location } = this.props;

    sessionStorage.setItem("pointName", 'COD')
    sessionStorage.setItem("entName", '')

    // dispatch({ type: 'autoForm/getRegions', payload: { RegionCode: '', PointMark: '2', }, });  //获取行政区列表


    dispatch({ type: 'removalFlowRate/getAttentionDegreeList', payload: { RegionCode: '' }, });//获取关注列表
    this.child.onDataTypeChange('hour')
    dispatch({
      type: 'removalFlowRate/getEntByRegion',
      payload: { RegionCode: '' },
      callback: (code) => {
        this.updateQueryState({
          beginTime: moment().subtract(1, 'day').format('YYYY-MM-DD HH:00:00'),
          endTime: moment().format('YYYY-MM-DD HH:59:59'),
          AttentionCode: '',
          EntCode: '',
          RegionCode: '',
          dataType: 'HourData',
          PollutantCode: '011',
        });
        setTimeout(() => {
          this.getTableData();
        });
      }

    });//获取企业列表


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



  children = () => { //企业列表
    const { priseList } = this.props;

    const selectList = [];
    if (priseList.length > 0) {
      priseList.map(item => {
        selectList.push(
          <Option key={item.EntCode} value={item.EntCode} title={item.EntName}>
            {item.EntName}
          </Option>,
        );
      });
      return selectList;
    }
  };

  typeChange = value => {
    this.updateQueryState({
      PollutantCode: value,
    });
  };

  changeRegion = (value) => { //行政区事件

    this.updateQueryState({
      RegionCode: value,
    });
  };
  changeAttent = (value) => {
    this.updateQueryState({
      AttentionCode: value,
    });
  }
  changeEnt = (value, data) => { //企业事件
    this.updateQueryState({
      EntCode: value,
    });
    // data&&data.props? sessionStorage.setItem("entName", data.props.title) : null;

  }

  changePoll = (e) => { //污染物改变事件
    this.updateQueryState({
      PollutantCode: e.target.value,
    });
    const pollType = {
      '011': 'COD',
      '060': '氨氮',
      '101': '总磷',
      '065': '总氮'
    }
    sessionStorage.setItem("pointName", pollType[e.target.value])
  }
  //创建并获取模板   导出
  template = () => {
    const { dispatch, queryPar } = this.props;
    dispatch({
      type: 'removalFlowRate/exportSewageHistoryList',
      payload: { ...queryPar },
      callback: data => {
        downloadFile(`/upload${data}`);
      },
    });
  };
  //查询事件
  queryClick = () => {


    const { pointName, dispatch, queryPar: { EntCode } } = this.props;

    if (EntCode) {
      this.getTableData();
      dispatch({
        type: pageUrl.updateState,
        payload: { pointName: sessionStorage.getItem("pointName"), entName: sessionStorage.getItem("entName") },
      });
    } else {
      message.warning('污水处理厂名称不能为空')
    }

  };


  regchildren = () => {
    const { regionList } = this.props;
    const selectList = [];
    if (regionList.length > 0) {
      regionList[0].children.map(item => {
        selectList.push(
          <Option key={item.key} value={item.value}>
            {item.title}
          </Option>,
        );
      });
      return selectList;
    }
  }
  attentchildren = () => {
    const { attentionList } = this.props;
    const selectList = [];
    if (attentionList.length > 0) {
      attentionList.map(item => {
        selectList.push(
          <Option key={item.AttentionCode} value={item.AttentionCode}>
            {item.AttentionName}
          </Option>,
        );
      });
      return selectList;
    }
  }

  /** 数据类型切换 */
  _handleDateTypeChange = e => {
    this.child.onDataTypeChange(e.target.value === 'HourData' ? 'hour' : 'day')
  }
  dateChange = (date, dataType) => {
    this.updateQueryState({
      dataType: GetDataType(dataType),
      beginTime: date[0].format('YYYY-MM-DD HH:mm:ss'),
      endTime: date[1].format('YYYY-MM-DD HH:mm:ss'),
    });
  }
  dateOk = () => {

  }
  getChartData = () => {
    const { pointName, chartExport, chartImport, chartTime, entName } = this.props;
    const legend = []
    const series = []
    var Import = chartImport.filter(item => item != '-');
    var Export = chartExport.filter(item => item != '-');
    if (Import.length > 0) {
      legend.push(`进水口-${pointName}`)
      series.push({
        name: `进水口-${pointName}`,
        type: 'line',
        data: Import
      })
    }
    if (Export.length > 0) {
      legend.push(`出水口-${pointName}`)
      series.push({
        name: `出水口-${pointName}`,
        type: 'line',
        data: Export
      })
    }
    return {
      color: [blue[5], red[5]],
      // title:{
      //   text:entName,//图表标题文本内
      //   textStyle:{//标题内容的样式
      //     fontSize:14//主题文字字体大小，默认为18px
      //   },
      //   left:'center',
      //   top:30
      // },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: legend,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: 80,
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: chartTime
      },
      yAxis: [
        {
          name: '浓度值（mg/L）',
          type: 'value',
        }
      ],
      series: series
    };
  }

  onRef1 = (ref) => {
    this.child = ref;
  }
  onChange3 = (e) => {
    console.log(e)
  }
  render() {
    const {
      exloading,
      loading,
      queryPar: { beginTime, endTime, EntCode, RegionCode, AttentionCode, dataType, PollutantCode },
    } = this.props;
    const { TabPane } = Tabs;
    return (
      <Card
        bordered={false}
        title={
          <>
            <Form layout="inline">

              <Row>
                <Form.Item label=''>
                  <Select
                    showSearch
                    allowClear
                    optionFilterProp="children"
                    placeholder="污水处理厂名称"
                    onChange={this.changeEnt}
                    value={EntCode ? EntCode : undefined}
                    style={{ width: 300 }}
                  >
                    {this.children()}
                  </Select>
                </Form.Item>
                <Form.Item label=''>
                  <Radio.Group value={dataType} style={{ marginRight: 10 }} onChange={(e) => this._handleDateTypeChange(e)}>
                    <Radio.Button value="HourData">小时</Radio.Button>
                    <Radio.Button value="DayData">日均</Radio.Button>
                  </Radio.Group>
                </Form.Item>
                <Form.Item>
                  <RangePicker_ allowClear={false} onRef={this.onRef1} dataType={dataType === 'HourData' ? 'hour' : 'day'} style={{ minWidth: '200px', marginRight: '10px' }} dateValue={[moment(beginTime), moment(endTime)]}
                    callback={(dates, dataType) => this.dateChange(dates, dataType)} />
                </Form.Item>



              </Row>
              <Row>

                <Form.Item label='监测因子'>

                  <Radio.Group onChange={this.changePoll} value={PollutantCode}>
                    <Radio value='011'>COD</Radio>
                    <Radio value='060'>氨氮</Radio>
                    <Radio value='101'>总磷</Radio>
                    <Radio value='065'>总氮</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item>
                  <Button type="primary" onClick={this.queryClick}>
                    查询
                  </Button>
                  <Button
                    style={{ margin: '0 5px' }}
                    icon={<ExportOutlined />}
                    onClick={this.template}
                    loading={exloading}
                  >
                    导出
                  </Button>
                  <span style={{ color: 'red', marginLeft: 20, fontSize: 12 }}>"是否停运"列显示 - ,表示没有这个监测点</span>
                </Form.Item>
              </Row>
            </Form>
          </>
        }
      >
        <div id='removalFlowRate'>
          <Tabs>
            <TabPane tab="变化趋势" key="1"   >
              {loading ?
                <PageLoading />
                :
                <ReactEcharts
                  option={this.getChartData()}
                  className="echarts-for-echarts"
                  theme="my_theme"
                  style={{ height: "calc(100vh - 300px)" }}
                />

              }
            </TabPane>
            <TabPane tab="数据详情" key="2">
              <SdlTable
                rowKey={(record, index) => `complete${index}`}
                loading={loading}
                columns={this.columns}
                // bordered={false}
                dataSource={this.props.tableDatas}
                // style ={{height:"calc(100vh - 300px)"}} 
                // pagination={{
                  // showSizeChanger: true,
                  // showQuickJumper: true,
                  // sorter: true,
                  // total: this.props.total,
                  //defaultPageSize: 20
                  // pageSize: PageSize,
                  // current: PageIndex,
                  // pageSizeOptions: ['10', '20', '30', '40', '50'],
                // }}
              />
            </TabPane>
          </Tabs>
        </div>
      </Card>
    );
  }
}
