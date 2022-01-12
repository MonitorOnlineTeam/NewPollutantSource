import React, { PureComponent } from 'react';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'
import { Card, Form, Empty, Space, Select, DatePicker, Button, Divider } from 'antd'
import { connect } from 'dva'
import ReactEcharts from 'echarts-for-react';
import SdlTable from '@/components/SdlTable'
import moment from 'moment'


@connect(({ loading, CO2Material }) => ({
  tableLoading: loading.effects['CO2Material/getEchartsItemTableDataSource'],
  entList: CO2Material.entList,
  GHGTableData: CO2Material.GHGTableData,
  GHGEchartsData: CO2Material.GHGEchartsData,
  GHGChartData: CO2Material.GHGChartData,
}))
class index extends PureComponent {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      year: moment(),
      month: moment().get('month') + 1,
    };

    this.CONST = {
      columns: [
        {
          title: '时间',
          dataIndex: 'date',
          key: 'date',
          render: (text) => {
            return text ? moment(text).format('YYYY-MM-DD') : '-';
          }
        },
        {
          title: '排放量(t)',
          dataIndex: 'sumValue',
          key: 'sumValue',
        },
      ]
    }
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
    this._dispatch('CO2Material/getGHGEchartsData', {
      EntCode: entCode,
      Year: year.format('YYYY')
    }, (res) => {
      this.onEchartsItemClick()
    })
  }

  onChartClick = (opt) => {
    console.log('opt=', opt)
    let month = opt.dataIndex + 1;
    this.setState({
      month
    }, () => {
      this.onEchartsItemClick();
    })
  }

  // 获取柱状图详细数据
  onEchartsItemClick = () => {
    const { entCode, year, month } = this.state;
    this._dispatch('CO2Material/getEchartsItemTableDataSource', {
      EntCode: entCode,
      Year: year.format('YYYY'),
      month: month
    })
  }

  //
  getOption = () => {
    const { GHGEchartsData } = this.props;
    let option = {
      color: ['rgb(91,176,255)', '#fac858', '#fc8452', '#91cc75'],
      grid: {
        left: '40',
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
            let params0 = "", params1 = "", params2 = "", params3 = "";
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
            if (params[2]) {
              params2 = `${params[2].marker}
${params[2].seriesName} ：${params[2].value}（t）<br />`
            }

            if (params[3]) {
              params3 = `${params[3].marker}
${params[3].seriesName} ：${params[3].value}（t）<br />`
            }
            return params0 + params1 + params2 + params3;
          }
        }
        // formatter: (params, ticket, callback) => {
        //   let param = params[0]
        //   let format = `${param.name}<br />${param.marker}${param.value}（t）`
        //   return format
        // }
      },
      xAxis: {

        // name: '排放量(t)',
        type: 'category',
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        axisTick: {
          show: false
        },
      },
      yAxis: {
        type: 'value',
        name: '二氧化碳排放当量(tCO₂e)',
        // splitLine: {
        //   show: true,
        //   lineStyle: {
        //     type: 'dashed'
        //   }
        // },
      },
      series: [{
        name: '配额总量',
        data: GHGEchartsData.quota,
        // stack: '排放量',
        type: 'bar',
        // emphasis: {
        //   focus: 'series'
        // },
        // label: {
        //   show: true,
        //   position: 'inside'
        // },
      },
      {
        name: '直测消耗',
        data: GHGEchartsData.use,
        // stack: '排放量',
        type: 'bar',
        // emphasis: {
        //   focus: 'series'
        // },
        // label: {
        //   show: true,
        //   position: 'inside'
        // },
      },
      {
        name: '核算消耗',
        data: GHGEchartsData.buse,
        // stack: '排放量',
        type: 'bar',
        // emphasis: {
        //   focus: 'series'
        // },
        // label: {
        //   show: true,
        //   position: 'left'
        // },
      },
      {
        name: '剩余配额',
        data: GHGEchartsData.profit,
        type: 'bar',
        // emphasis: {
        //   focus: 'series'
        // },
        // label: {
        //   show: true,
        //   position: 'inside'
        // },
        itemStyle: {
          color: (params) => {
            const index = params.dataIndex;
            if (params.data < GHGEchartsData.quota[index] * 0.1) {
              return 'red'
            }
            return '#91cc75'
          }
        }
      }]
    };
    return option;
  }

  getPieOption = () => {
    const { GHGChartData } = this.props;
    let option = {
      title: {
        // text: 'Referer of a Website',
        // subtext: 'Fake Data',
        // left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'right'
      },
      series: [
        {
          // name: 'Access From',
          type: 'pie',
          radius: '50%',
          // data: [
          //   { value: 1048, name: 'Search Engine' },
          //   { value: 735, name: 'Direct' },
          //   { value: 580, name: 'Email' },
          //   { value: 484, name: 'Union Ads' },
          //   { value: 300, name: 'Video Ads' }
          // ],
          data: GHGChartData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
    return option;
  }

  render() {
    const { entList, GHGTableData, GHGChartData, tableLoading } = this.props;
    const { entCode, year, month } = this.state;
    const { columns } = this.CONST;

    let titleTime = `${year.format('YYYY')}年${month}月`

    return (
      <BreadcrumbWrapper>
        <Card>
          {/*  */}
          {/* <Divider style={{ marginBottom: 0 }} /> */}
          <div style={{ display: "flex" }}>
            <div style={{ flex: 1 }}>
              <Form
                ref={this.formRef}
                initialValues={{
                  // time: [moment().subtract(29, 'days'), moment()],
                }}
              // onFieldsChange={(changedFields, allFields) => {
              //   console.log('changedFields=', changedFields)
              //   console.log('allFieldss=', allFields)
              // }}
              >
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
                  <Button type="primary" loading={tableLoading} onClick={this.getEchartsData}>查询</Button>
                </Space>
              </Form>
              <Divider />
              <ReactEcharts
                option={this.getOption()}
                lazyUpdate
                notMerge
                onEvents={{ 'click': this.onChartClick }}
                style={{ width: '100%', height: 'calc(100vh - 230px)', minHeight: '200px', marginTop: 20 }}
              />
            </div>
            <div style={{ width: 400, marginTop: -28 }}>
              <Card title={`排放量企业统计 - ${titleTime}`}>
                {
                  !GHGChartData.length && !GHGTableData.length ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> : ""
                }
                {
                  GHGTableData.length ? <ReactEcharts
                    option={this.getPieOption()}
                    lazyUpdate
                    notMerge
                    onEvents={{ 'click': this.onChartClick }}
                    style={{ width: '100%', minHeight: '200px', marginTop: 20 }}
                  /> : ''
                }
                {
                  GHGTableData.length ? <SdlTable
                    loading={tableLoading}
                    rowKey={(record, index) => index}
                    columns={columns}
                    dataSource={GHGTableData}
                    scroll={{ y: 'calc(100vh - 640px)' }}
                  /> : ''
                }
              </Card>
            </div>
          </div>
        </Card>
      </BreadcrumbWrapper>
    );
  }
}

export default index;
