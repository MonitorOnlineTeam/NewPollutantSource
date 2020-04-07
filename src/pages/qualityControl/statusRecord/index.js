/*
 * @Author: xpy
 * @Date: 2019-11-20 16:11:36
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2019-11-25 11:39:54
 * @desc: 质控状态记录页面
 */
import React, { Component } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
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
    dataIndex: 'Flag',
    key: 'Flag',
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
    render: (text, record) => {
      if (record.getPointName) {
        return `${record.getPointName} - ${text}`
      }
      return text
    }
  },
  {
    title: '指标状态',
    dataIndex: 'StateName',
    key: 'StateName',
  },
];


@connect(({ loading, qualityControl }) => ({
  statusRecordForm: qualityControl.statusRecordForm,
  QCAStatusNameList: qualityControl.QCAStatusNameList,
  QCAStatusList: qualityControl.QCAStatusList,
  loading: loading.effects['qualityControl/QCAStatusByDGIMN'],
}))
@Form.create()
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
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

  /** 切换排口 */
  changeDgimn = QCAMN => {
    const {
      dispatch,
    } = this.props;
    dispatch({
      type: 'qualityControl/updateState',
      payload: {
        statusRecordForm: {
          ...this.props.statusRecordForm,
          QCAMN: QCAMN,
        },
      },
    });
    setTimeout(() => {
      // 获取表格数据
      this.getTableData();
    }, 0);
  }

  // 获取表格数据
  getTableData = () => {
    this.props.dispatch({
      type: 'qualityControl/QCAStatusByDGIMN',

    })
  }

  // 分页
  onTableChange = (pageIndex, pageSize) => {
    this.props.dispatch({
      type: 'qualityControl/updateState',
      payload: {
        statusRecordForm: {
          ...this.props.statusRecordForm,
          current: pageIndex,
          pageSize: pageSize,
        },
      },
    });
    // 获取表格数据
    this.getTableData();
  }

  //日期改变事件
  dateChange = (dataMoment, dateString) => {
    // if (dateString.length === 2) {
    this.props.dispatch({
      type: 'qualityControl/updateState',
      payload: {
        statusRecordForm: {
          ...this.props.statusRecordForm,
          BeginTime: dateString,
          EndTime: moment().format("YYYY-MM-DD HH:mm:ss"),
        },
      },
    });
    // }
  }

  //参数改变事件
  selectChange = (values) => {
    if (values) {
      let DataTempletCode = [];
      values.map((item) => {
        DataTempletCode.push(item)
      })
      this.props.dispatch({
        type: 'qualityControl/updateState',
        payload: {
          statusRecordForm: {
            ...this.props.statusRecordForm,
            DataTempletCode
          },
        },
      });
    }
  }

  render() {
    const { form: { getFieldDecorator }, QCAStatusList, loading, QCAStatusNameList, statusRecordForm } = this.props;
    let defaultValue = moment(statusRecordForm.BeginTime);
    let selectValues = [];
    if (statusRecordForm.DataTempletCode) {
      statusRecordForm.DataTempletCode.map((item) => {
        selectValues.push(item)
      })
    }
    return (
      <>
        <NavigationTree QCAUse="1" onItemClick={value => {
          if (value.length > 0 && !value[0].IsEnt && value[0].QCAType == '2') {
            this.changeDgimn(value[0].key);
          }
        }} />
        <div id="contentWrapper">
          <BreadcrumbWrapper>
            <Card className="contentContainer"
              title={
                <Form>
                  <Row gutter={16}>
                    <Col span={4}></Col>
                    <Col span={7}>
                      <Form.Item>
                        {getFieldDecorator('time', {
                          initialValue: defaultValue
                        })(
                          // <RangePicker
                          //   style={{ width: '100%', marginBottom: 0 }}
                          //   allowClear={false}
                          //   format="YYYY-MM-DD HH:mm:ss"
                          //   onChange={this.dateChange}
                          // />,
                          <DatePicker showTime allowClear={false} placeholder="监控时间" onChange={this.dateChange} />
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={7}>
                      <Form.Item style={{ width: '100%', marginBottom: 0 }}>
                        {getFieldDecorator('DataTempletCode', {
                          initialValue: selectValues
                        })(
                          <Select mode="multiple" maxTagTextLength={10} maxTagCount={2} maxTagPlaceholder="..." allowClear placeholder="请选择指标名称" onChange={this.selectChange}>
                            {
                              QCAStatusNameList.map(item => <Option key={item.Code}>{item.Name}</Option>)
                            }
                          </Select>,
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={6} style={{ marginTop: 4 }}>
                      <Button type="primary" style={{ marginRight: 10 }} onClick={() => {
                        this.props.dispatch({
                          type: 'qualityControl/updateState',
                          payload: {
                            statusRecordForm: {
                              ...this.props.statusRecordForm,
                              BeginTime: moment().add(-1, "hour").format('YYYY-MM-DD HH:mm:ss'),
                            }
                          }
                        })
                        setTimeout(() => {
                          this.getTableData()
                        }, 0)
                      }}>查询</Button>
                    </Col>
                  </Row>
                </Form>
              }
            >
              <SdlTable
                dataSource={QCAStatusList}
                columns={columns}
                loading={loading}
                scroll={{ y: 'calc(100vh - 450px)' }}
                pagination={{
                  showSizeChanger: true,
                  showQuickJumper: true,
                  pageSizeOptions: ['10', '20', '30', '40', '50'],
                  pageSize: statusRecordForm.pageSize,
                  current: statusRecordForm.current,
                  onChange: this.onTableChange,
                  onShowSizeChange: this.onTableChange,
                  total: statusRecordForm.total,
                }}
              />
            </Card>
          </BreadcrumbWrapper>
        </div>
      </>
    );
  }
}

export default Index;
