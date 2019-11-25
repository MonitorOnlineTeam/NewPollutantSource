/*
 * @Author: xpy
 * @Date: 2019-11-20 16:11:36
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2019-11-25 11:39:54
 * @desc: 质控状态记录页面
 */
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import NavigationTree from '@/components/NavigationTree'
import { Form, Card, DatePicker, Row, Col, Select, Button, Radio, Popover, Icon } from 'antd'
import SdlTable from '@/components/SdlTable'
import { connect } from 'dva'
import { LegendIcon } from '@/utils/icon';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

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
    title: '指标名称',
    dataIndex: 'Name',
    key: 'Name',
  },
  {
    title: '指标指标状态',
    dataIndex: 'Value',
    key: 'Value',
  },
];


@connect(({ loading, qualityControl }) => ({
  statusRecordForm: qualityControl.statusRecordForm,
  QCAStatusNameList: qualityControl.QCAStatusNameList,
  QCAStatusList: qualityControl.QCAStatusList,
  loading: loading.effects['qualityControl/QCAStatusByDGIMN'],
}))
@Form.create({
  mapPropsToFields(props) {
    return {
      time: Form.createFormField(props.statusRecordForm.time),
      DataTempletCode: Form.createFormField(props.statusRecordForm.DataTempletCode),
      status: Form.createFormField(props.statusRecordForm.status),
    };
  },
  onFieldsChange(props, fields) {
    props.dispatch({
      type: 'qualityControl/updateState',
      payload: {
        statusRecordForm: {
          ...props.statusRecordForm,
          ...fields,
        },
      },
    })
  },
})
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      DGIMN: '',
    };
    this._SELF_ = {
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
    this.props.dispatch({
      type: 'qualityControl/QCAStatusName',
    })
  }

  // 分页
  onTableChange = (current, pageSize) => {
    this.props.dispatch({
      type: 'report/updateState',
      payload: {
        statusRecordForm: {
          ...this.props.statusRecordForm,
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
    // 查询表格数据
    this.props.dispatch({
      type: 'qualityControl/updateState',
      payload: {
        paramsRecordForm: {
          ...this.props.paramsRecordForm,
          current: 1,
        },
      },
    })
    setTimeout(() => {
      this.getTableData();
    }, 0);
  }

  // 获取表格数据
  getTableData = () => {
    const { DGIMN } = this.state;
    if (DGIMN) {
      this.props.dispatch({
        type: 'qualityControl/QCAStatusByDGIMN',
        payload: {
          DGIMN,
        },
      })
    }
  }

  /** 时间控件 */
  RPOnChange = (date, dateString) => {
    console.log(dateString);
  }

  RPOnOk = () => {
    console.log('21edafadsfafasdf');
  }

  render() {
    const { form: { getFieldDecorator }, QCAStatusList, loading, QCAStatusNameList } = this.props;
    const { formItemLayout } = this._SELF_;
    const { showType } = this.state;
    return (
      <>
        <NavigationTree onItemClick={value => {
          if (value.length > 0 && !value[0].IsEnt && value[0].key) {
            this.setState({
              DGIMN: value[0].key,
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
                        {getFieldDecorator('time', {
                          initialValue: [moment().startOf("day"), moment()]
                        })(
                          <RangePicker
                            showTime={{
                              hideDisabledOptions: true,
                              defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                            }}
                            allowClear={false}
                            format="YYYY-MM-DD HH:mm:ss"
                            showToday
                            onChange={this.RPOnChange}
                            onOk={this.RPOnOk}
                          />,
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={7}>
                      <Form.Item style={{ width: '100%', marginBottom: 0 }}>
                        {getFieldDecorator('DataTempletCode')(
                          <Select mode="multiple" allowClear placeholder="请选择参数">
                            {
                              QCAStatusNameList.map(item => <Option key={item.Code}>{item.Name}</Option>)
                            }
                          </Select>,
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={5}>
                      <Form.Item style={{ width: '100%', marginBottom: 0 }}>
                        {getFieldDecorator('status')(
                          <Select allowClear placeholder="请选择状态">
                            <Option key="1">正常</Option>
                            <Option key="0">异常</Option>
                          </Select>,
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              }
            >
              {
                showType === 'data' && <SdlTable
                  dataSource={QCAStatusList}
                  columns={columns}
                  loading={loading}
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
          </PageHeaderWrapper>
        </div>
      </>
    );
  }
}

export default Index;
