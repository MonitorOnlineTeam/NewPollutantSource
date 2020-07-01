/*
 * @Author: Jiaqi
 * @Date: 2019-11-18 16:11:36
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2019-11-27 10:24:37
 * @desc: 质控参数记录页面
 */
import React, { Component } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import NavigationTree from '@/components/NavigationTree'
import { Form, Card, DatePicker, Row, Col, Select, Button, Radio, Popover, Icon } from 'antd'
import SdlTable from '@/components/SdlTable'
import { connect } from 'dva'
import { LegendIcon } from '@/utils/icon';
import ReactEcharts from 'echarts-for-react';
import moment from "moment";

const FormItem = Form.Item;
const { Option } = Select;
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
        text: <span><LegendIcon style={{ color: '#34c066' }} />正常</span>,
        value: 1,
      },
      {
        text: <span><LegendIcon style={{ color: '#e94' }} />异常</span>,
        value: 0,
      },
    ],
    onFilter: (value, record) => record.Flag === value,
    render: (value, record, index) => {
      if (record.Flag == 1) {
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
    dataIndex: 'RealValue',
    key: 'RealValue',
  },
];


@connect(({ loading, qualityControl }) => ({
  paramsRecordForm: qualityControl.paramsRecordForm,
  paramsTableData: qualityControl.paramsTableData,
  paramsChartData: qualityControl.paramsChartData,
  paramsList: qualityControl.paramsList,
  loading: loading.effects['qualityControl/getParamsTableData'],
}))
@Form.create({
  mapPropsToFields(props) {
    return {
      BeginTime: Form.createFormField(props.paramsRecordForm.BeginTime),
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
          ...fields,
        },
      },
    })
  },
})
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showType: 'data',
      defaultTime: moment().add(-1, "hour"),
    };
    this._SELF_ = {
      isChangeDate: false,
      formItemLayout: {
        labelCol: {
          span: 6,
        },
        wrapperCol: {
          span: 16,
        },
      },
    }
  }

  componentDidMount() {
    // this.getTableData()
    this.props.dispatch({
      type: 'qualityControl/getParamsList',
    })
  }

  // 分页
  onTableChange = (current, pageSize) => {
    this.props.dispatch({
      type: 'qualityControl/updateState',
      payload: {
        paramsRecordForm: {
          ...this.props.paramsRecordForm,
          pageSize,
          current,
        },
      },
    });
    setTimeout(() => {
      // 获取表格数据
      this.getTableData();
    }, 0);
  }

  // 查询
  onSearch = () => {
    const { showType } = this.state;
    this.setState({
      defaultTime: moment().add(-1, "hour"),
    })
    let _payload = {};
    if (!this._SELF_.isChangeDate) {
      this.props.form.setFieldsValue({ BeginTime: moment().add(-1, "hour") })
      _payload.BeginTime = { value: moment().add(-1, "hour") }
    }
    if (showType === 'data') {
      // 查询表格数据
      this.props.dispatch({
        type: 'qualityControl/updateState',
        payload: {
          paramsRecordForm: {
            ...this.props.paramsRecordForm,
            ..._payload,
            current: 1,
          },
        },
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
    if (DGIMN) {
      this.props.dispatch({
        type: "qualityControl/getParamsTableData",
        payload: {
          DGIMN: DGIMN
        }
      })
    }
  }

  // 获取图表数据
  getChartData = () => {
    const { DGIMN } = this.state;
    if (DGIMN) {
      this.props.dispatch({
        type: "qualityControl/getParamsChartData",
        payload: {
          DGIMN: DGIMN
        }
      })
    }
  }

  // 图表配置项
  lightOption = () => {
    const { paramsChartData } = this.props;
    console.log('paramsChartData=', paramsChartData)
    return {
      // title: {
      //   text: '折线图堆叠'
      // },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: paramsChartData.legendList,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      dataZoom: [{
        type: 'inside',
        start: 0,
        end: 20
      }, {
        start: 0,
        end: 10,
        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '80%',
        handleStyle: {
          color: '#fff',
          shadowBlur: 3,
          shadowColor: 'rgba(0, 0, 0, 0.6)',
          shadowOffsetX: 2,
          shadowOffsetY: 2
        }
      }],
      // toolbox: {
      //   feature: {
      //     saveAsImage: {}
      //   }
      // },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: paramsChartData.TimeList,
      },
      yAxis: {
        type: 'value',
      },
      series: paramsChartData.DataList,
    };
  }

  // 分页页数change
  onShowSizeChange = (current, pageSize) => {
    this.props.dispatch({
      type: 'qualityControl/updateState',
      payload: {
        paramsRecordForm: {
          ...this.props.paramsRecordForm,
          pageSize,
          current: 1,
        },
      },
    });
    setTimeout(() => {
      // 获取表格数据
      this.getTableData();
    }, 0);
  }

  render() {
    const { form: { getFieldDecorator }, paramsRecordForm, paramsTableData, loading, paramsList } = this.props;
    const { formItemLayout } = this._SELF_;
    const { showType, defaultTime } = this.state;
    return (
      <>
        <NavigationTree QCAUse="1" onItemClick={value => {
          if (value.length > 0 && !value[0].IsEnt && value[0].key) {
            this.setState({
              DGIMN: value[0].key,
            }, () => {
              this.onSearch()
            })
          }
        }} />
        <div id="contentWrapper">
          <BreadcrumbWrapper>
            <Card className="contentContainer"
              title={
                <Form>
                  {/* <Row gutter={16}> */}
                  <Row gutter={16}>
                    {/* <Col span={2}></Col> */}
                    <Col span={5}>
                      <Form.Item style={{ width: '100%', marginBottom: 0 }}>
                        {getFieldDecorator('BeginTime', {
                          initialValue: defaultTime,
                        })(
                          // <RangePicker allowClear={false} format={"YYYY-MM-DD HH:mm:ss"} />,
                          <DatePicker showTime allowClear={false} placeholder="监控时间" format={"YYYY-MM-DD HH:mm:ss"} onChange={(date) => {
                            this._SELF_.isChangeDate = true;
                          }} />
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={9}>
                      <Form.Item style={{ width: '100%', marginBottom: 0 }}>
                        {getFieldDecorator('DataTempletCode')(
                          <Select mode="multiple" allowClear placeholder="请选择参数">
                            {
                              paramsList.map(item => <Option key={item.Code}>{item.Name}</Option>)
                            }
                          </Select>,
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
                      <Button type="primary" loading={loading} style={{ marginRight: 10 }} onClick={this.onSearch}>查询</Button>
                      <Radio.Group value={showType} onChange={e => {
                        this.setState({
                          showType: e.target.value,
                        })
                        e.target.value === 'data' ? this.onSearch() : this.getChartData()
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
                showType === 'data' && <SdlTable
                  dataSource={paramsTableData}
                  columns={columns}
                  loading={loading}
                  //     scroll={{ y: 'calc(100vh - 410px)' }}
                  pagination={{
                    showSizeChanger: true,
                    onShowSizeChange: this.onShowSizeChange,
                    showQuickJumper: true,
                    pageSize: paramsRecordForm.pageSize,
                    current: paramsRecordForm.current,
                    onChange: this.onTableChange,
                    total: paramsRecordForm.total,
                  }}
                />
              }
              {
                showType === 'chart' && <ReactEcharts
                  theme="light"
                  // option={() => { this.lightOption() }}
                  option={this.lightOption()}
                  lazyUpdate
                  notMerge
                  id="rightLine"
                  onEvents={{
                    click: this.onChartClick,
                  }}
                  style={{ width: '100%', height: 'calc(100vh - 340px)', minHeight: '200px' }}
                />
              }

            </Card>
          </BreadcrumbWrapper>
        </div>
      </>
    );
  }
}

export default index;
