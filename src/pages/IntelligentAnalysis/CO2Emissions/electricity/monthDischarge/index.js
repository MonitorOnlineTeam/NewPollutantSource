import React, { PureComponent } from 'react';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'
import { Card, Form, Divider, Space, Select, DatePicker, Button } from 'antd'
import { connect } from 'dva'
import ReactEcharts from 'echarts-for-react';
import moment from 'moment'

@connect(({ loading, CO2Material }) => ({
  loading: loading.effects['CO2Material/getCO2MonthDischarge'],
  entList: CO2Material.entList,
  monthDischargeData: CO2Material.monthDischargeData,
}))
class index extends PureComponent {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      year: moment(),
      month: moment().get('month') + 1,
    };
  }

  componentDidMount() {
    this.getAllEnterprise()
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
    const { entCode, year } = this.state;
    this._dispatch('CO2Material/getCO2MonthDischarge', {
      EntCode: entCode,
      Year: year.format('YYYY')
    }, (res) => {
    })
  }

  // 
  getOption = () => {
    const { monthDischargeData } = this.props;
    let option = {
      color: ['rgb(91,176,255)', '#fac858', '#91cc75'],
      grid: {
        left: '50',
        right: '4%',
        top: '8%',
        bottom: '4%',
        containLabel: true
      },
      legend: {

      },
      tooltip: {
        trigger: 'axis',
        confine: true,
        axisPointer: {
          type: 'shadow'
        },
        formatter: (params) => {
          if (params) {
            let params0 = "", params1 = "";
            if (params[0]) {
              params0 = `
              ${params[0].name}
              <br />
              ${params[0].marker}
              ${params[0].seriesName}：${params[0].value}（t）
              <br />`
            }
            if (params[1]) {
              params1 = `${params[1].marker}
${params[1].seriesName} ：${params[1].value}（t）
<br />`
            }
            return params0 + params1;
          }
        }
        // formatter: (params, ticket, callback) => {
        //   let param = params[0]
        //   let format = `${param.name}<br />${param.marker}${param.value}（t）`
        //   return format
        // }
      },
      xAxis: {
        type: 'category',
        axisTick: {
          show: false
        },
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      },
      yAxis: {
        name: '二氧化碳排放当量(tCO₂e)',
        type: 'value',

        // splitLine: {
        //   show: true,
        //   lineStyle: {
        //     type: 'dashed'
        //   }
        // },
      },
      series: [{
        name: '直测法',
        data: monthDischargeData.use,
        type: 'bar',
        label: {
          show: true,
          position: 'top'
        },
      },
      {
        name: '核算法',
        data: monthDischargeData.business,
        type: 'bar',
        label: {
          show: true,
          position: 'top'
        },
      },
      ]
    };
    return option;
  }

  render() {
    const { entList, loading } = this.props;
    const { entCode, year } = this.state;

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
                  // this.getEchartsData();
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
              <DatePicker value={year} allowClear={false} picker="year" onChange={(date) => {
                this.setState({ year: date }, () => {
                  // this.getEchartsData();
                })
              }} />
            </div>
            <Button type="primary" loading={loading} onClick={this.getEchartsData}>查询</Button>
          </Space>
          <Divider style={{ marginBottom: 0 }} />
          <ReactEcharts
            option={this.getOption()}
            lazyUpdate
            notMerge
            onEvents={{ 'click': this.onChartClick }}
            style={{ width: '100%', height: 'calc(100vh - 230px)', minHeight: '200px', marginTop: 20 }}
          />
        </Card>
      </BreadcrumbWrapper>
    );
  }
}

export default index;