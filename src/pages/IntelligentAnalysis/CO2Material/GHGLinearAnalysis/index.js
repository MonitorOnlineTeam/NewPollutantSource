import React, { PureComponent } from 'react';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'
import { Card, Divider, Space, Select, DatePicker, Button, Empty, Spin } from 'antd'
import { connect } from 'dva'
import ReactEcharts from 'echarts-for-react';
import moment from 'moment'

const { RangePicker } = DatePicker;

@connect(({ loading, CO2Material }) => ({
  loading: loading.effects['CO2Material/getCO2LinearAnalysis'],
  entList: CO2Material.entList,
  CO2LinearAnalysisData: CO2Material.CO2LinearAnalysisData,
}))
class index extends PureComponent {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      year: moment(),
      time: [moment(), moment()],
    };
  }

  componentDidMount() {
    this.getAllEnterprise();
  }

  _dispatch = (type, payload, callback) => {
    this.props.dispatch({
      type: type,
      payload: payload || {},
      callback: callback
    })
  }

  // 获取所有企业
  getAllEnterprise = () => {
    this._dispatch('CO2Material/getAllEnterprise', {}, (res) => {
      this.setState({
        entCode: res[0].EntCode
      }, () => {
        this.getEchartsData()
      })
    })
  }

  // 获取图表数据
  getEchartsData = () => {
    const { entCode, time } = this.state;
    this._dispatch('CO2Material/getCO2LinearAnalysis', {
      EntCode: entCode,
      BeginTime: time[0].startOf('month').format('YYYY-MM-DD HH:mm:ss'),
      EndTime: time[1].endOf('month').format('YYYY-MM-DD HH:mm:ss'),
    })
  }

  linearCheckOption = () => {
    const { CO2LinearAnalysisData } = this.props;
    const { currentRowData } = this.state;
    let markLineOpt = {
      animation: false,
      label: {
        formatter: CO2LinearAnalysisData.formula,
        align: 'right'
      },
      lineStyle: {
        type: 'solid'
      },
      tooltip: {
        formatter: CO2LinearAnalysisData.formula,
      },
      data: [[{
        coord: CO2LinearAnalysisData.coordMin,
        symbol: 'none'
      }, {
        coord: CO2LinearAnalysisData.coordMax,
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
        left: '2%',
        right: '100px',
        bottom: '4%',
        // top: "2%",
        containLabel: true
      },
      tooltip: {
        // formatter: function (params, ticket, callback) {
        //   console.log('params=', params)
        //   return `测量浓度:    ${params.value[0]}${currentRowData.Unit} <br />标准气浓度:    ${params.value[1]}${currentRowData.Unit}`
        // }
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
      xAxis: [
        { name: `直测排放量(t)`, gridIndex: 0, min: CO2LinearAnalysisData.coordMin[0], max: CO2LinearAnalysisData.coordMax[0] },
      ],
      yAxis: [
        // { name: `核算排放量(t)`, gridIndex: 0, min: CO2LinearAnalysisData.coordMin[1] < 0 ? CO2LinearAnalysisData.coordMin[1] - 5 : CO2LinearAnalysisData.coordMin[1], max: CO2LinearAnalysisData.coordMax[1] + 5 },
        { name: `核算排放量(t)`, gridIndex: 0, min: CO2LinearAnalysisData.coordMin[1], max: CO2LinearAnalysisData.coordMax[1] },
      ],
      series: [
        {
          name: '测量浓度 标准气浓度',
          type: 'scatter',
          xAxisIndex: 0,
          yAxisIndex: 0,
          data: CO2LinearAnalysisData.linearData,
          markLine: markLineOpt
        },
      ]
    };

    return option;
  }


  render() {
    const { entList, loading, CO2LinearAnalysisData } = this.props;
    const { entCode, time } = this.state;

    return (
      <BreadcrumbWrapper>
        <Card>
          <Space size="large" align="baseline">
            <div>
              <div class="ant-form-item-label">
                <label title="企业">企业</label>
              </div>
              <Select value={entCode} style={{ width: 240 }} placeholder="请选择企业" onChange={(value) => {
                this.setState({ entCode: value }, () => {
                })
              }}>
                {
                  entList.map(item => {
                    return <Option key={item.EntCode} value={item.EntCode}>{item.EntName}</Option>
                  })
                }
              </Select>
            </div>
            <div>
              <div class="ant-form-item-label">
                <label title="时间">时间</label>
              </div>
              <RangePicker value={time} allowClear={false} picker="month" onChange={(date) => {
                this.setState({ time: date }, () => {
                  // this.getEchartsData();
                })
              }} />
            </div>
            <Button type="primary" loading={loading} onClick={this.getEchartsData}>查询</Button>
          </Space>
          <Divider style={{ marginBottom: 0 }} />
          <Spin spinning={loading}>
            {
              CO2LinearAnalysisData ? <ReactEcharts
                option={this.linearCheckOption()}
                lazyUpdate
                notMerge
                style={{ width: '100%', height: 'calc(100vh - 230px)', minHeight: '200px', marginTop: 20 }}
              /> :
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            }
          </Spin>
        </Card>
      </BreadcrumbWrapper>
    );
  }
}

export default index;