/*
 * @Author: Jiaqi 
 * @Date: 2019-11-18 16:11:36 
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2019-11-20 17:14:30
 * @desc: 质控参数记录页面
 */
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import NavigationTree from '@/components/NavigationTree'
import { Form, Card, DatePicker, Row, Col, Select, Button, Radio, Popover, Icon } from 'antd'
import SdlTable from '@/components/SdlTable'
import { connect } from "dva"
import { LegendIcon } from '@/utils/icon';
import ReactEcharts from 'echarts-for-react';

const FormItem = Form.Item;
const Option = Select.Option;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

const columns = [
  {
    title: '状态',
    dataIndex: 'flag',
    key: 'flag',
    width: 70,
    align: 'center',
    filters: [
      {
        text: <span><LegendIcon style={{ color: "#34c066" }} />正常</span>,
        value: 1,
      },
      {
        text: <span><LegendIcon style={{ color: "#e94" }} />异常</span>,
        value: 0,
      },
    ],
    onFilter: (value, record) => record.flag === value,
    render: (value, record, index) => {
      if (value) {
        return <img style={{ width: 14 }} src="/gisnormal.png" />
      }
      return <img style={{ width: 14 }} src="/gisexception.png" />
    },
  },
  {
    title: '监控时间',
    dataIndex: 'MonitorTime',
    key: 'MonitorTime',
  },
  {
    title: '参数名称',
    dataIndex: 'Name',
    key: 'Name',
  },
  {
    title: '参数值',
    dataIndex: 'Value',
    key: 'Value',
  },
];




@connect(({ loading, qualityControl }) => ({
  paramsRecordForm: qualityControl.paramsRecordForm,
  paramsTableData: qualityControl.paramsTableData,
  paramsChartData: qualityControl.paramsChartData,
  paramsList: qualityControl.paramsList,
  loading: loading.effects["qualityControl/getParamsTableData"],
}))
@Form.create({
  mapPropsToFields(props) {
    return {
      time: Form.createFormField(props.paramsRecordForm.time),
      DataTempletCode: Form.createFormField(props.paramsRecordForm.DataTempletCode),
      // status: Form.createFormField(props.paramsRecordForm.status),
    };
  },
  onFieldsChange(props, fields) {
    props.dispatch({
      type: 'qualityControl/updateState',
      payload: {
        paramsRecordForm: {
          ...props.paramsRecordForm,
          ...fields
        }
      }
    })
  },
})
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showType: "data",
    };
    this._SELF_ = {
      formItemLayout: {
        labelCol: {
          span: 6,
        },
        wrapperCol: {
          span: 16,
        },
      }
    }
  }

  componentDidMount() {
    // this.getTableData()
    this.props.dispatch({
      type: "qualityControl/getParamsList"
    })
  }

  // 分页
  onTableChange = (current, pageSize) => {
    this.props.dispatch({
      type: 'report/updateState',
      payload: {
        paramsRecordForm: {
          ...this.props.paramsRecordForm,
          current,
        }
      }
    });
    setTimeout(() => {
      // 获取表格数据
      this.getTableData();
    }, 0);
  }

  // 查询
  onSearch = () => {
    const { showType } = this.state;
    if (showType === "data") {
      // 查询表格数据
      this.props.dispatch({
        type: 'qualityControl/updateState',
        payload: {
          paramsRecordForm: {
            ...this.props.paramsRecordForm,
            current: 1,
          }
        }
      })
      setTimeout(() => {
        // 获取表格数据
        this.getTableData();
      }, 0);
    } else {
      // 查询图表数据
      this.getChartData()
    }
  }

  // 获取表格数据
  getTableData = () => {
    const { DGIMN } = this.state;
    if (DGIMN)
      this.props.dispatch({
        type: "qualityControl/getParamsTableData",
        payload: {
          DGIMN: DGIMN
        }
      })
  }

  // 获取图表数据
  getChartData = () => {
    const { DGIMN } = this.state;
    if (DGIMN)
      this.props.dispatch({
        type: "qualityControl/getParamsChartData",
        payload: {
          DGIMN: DGIMN
        }
      })
  }

  // 图表配置项
  lightOption = () => {
    const { paramsChartData } = this.props;
    console.log("paramsChartData=",paramsChartData)
    return {
      // title: {
      //   text: '折线图堆叠'
      // },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: paramsChartData.legendList
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      // toolbox: {
      //   feature: {
      //     saveAsImage: {}
      //   }
      // },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: paramsChartData.TimeList
      },
      yAxis: {
        type: 'value'
      },
      series: paramsChartData.DataList
    };

  }

  render() {
    const { form: { getFieldDecorator }, paramsRecordForm, paramsTableData, loading, paramsList } = this.props;
    const { formItemLayout } = this._SELF_;
    const { showType } = this.state;
    return (
      <>
        <NavigationTree onItemClick={value => {
          if (value.length > 0 && !value[0].IsEnt && value[0].key) {
            this.setState({
              DGIMN: value[0].key
            }, () => {
              this.onSearch()
            })
          }
        }} />
        <div id="contentWrapper">
          <PageHeaderWrapper>
            <Card className="contentContainer"
              title={
                <Form>
                  <Row gutter={16}>
                    <Col span={4}></Col>
                    <Col span={7}>
                      <Form.Item style={{ width: '100%', marginBottom: 0 }}>
                        {getFieldDecorator('time')(
                          <RangePicker />
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={7}>
                      <Form.Item style={{ width: '100%', marginBottom: 0 }}>
                        {getFieldDecorator('DataTempletCode')(
                          <Select mode="multiple" allowClear placeholder="请选择参数">
                            {
                              paramsList.map(item => {
                                return <Option key={item.Code}>{item.Name}</Option>
                              })
                            }
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                    {/* <Col span={5}>
                      <Form.Item style={{ width: '100%', marginBottom: 0 }}>
                        {getFieldDecorator('status')(
                          <Select allowClear placeholder="请选择状态">
                            <Option key="1">正常</Option>
                            <Option key="0">异常</Option>
                          </Select>
                        )}
                      </Form.Item>
                    </Col> */}
                    <Col span={6} style={{ marginTop: 4 }}>
                      <Button type="primary" style={{ marginRight: 10 }} onClick={this.onSearch}>查询</Button>
                      <Radio.Group value={showType} onChange={(e) => {
                        this.setState({
                          showType: e.target.value
                        })
                        e.target.value === "data" ? this.onSearch() : this.getChartData()
                      }}>
                        <Radio.Button value="data" key="data">数据</Radio.Button>
                        <Radio.Button value="chart" key="chart">图表</Radio.Button>
                      </Radio.Group>
                    </Col>
                  </Row>
                </Form>
              }
            >
              {
                showType === "data" && <SdlTable
                  dataSource={paramsTableData}
                  columns={columns}
                  loading={loading}
                  pagination={{
                    // showSizeChanger: true,
                    showQuickJumper: true,
                    pageSize: paramsRecordForm.pageSize,
                    current: paramsRecordForm.current,
                    onChange: this.onTableChange,
                    total: paramsRecordForm.total
                  }}
                />
              }
              {
                showType === "chart" && <ReactEcharts
                  theme="light"
                  // option={() => { this.lightOption() }}
                  option={this.lightOption()}
                  lazyUpdate
                  notMerge
                  id="rightLine"
                  onEvents={{
                    'click': this.onChartClick,
                  }}
                  style={{ width: '100%', height: 'calc(100vh - 340px)', minHeight: '200px' }}
                />
              }

            </Card>
          </PageHeaderWrapper>
        </div>
      </>
    );
  }
}

export default index;