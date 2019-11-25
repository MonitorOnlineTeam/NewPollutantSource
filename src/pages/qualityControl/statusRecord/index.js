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
    const firsttime = moment(new Date()).format('YYYY-MM-DD 00:00:00');
    const lasttime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    this.state = {
        DGIMN: '',
        rangeDate: [firsttime, lasttime],
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

  componentWillReceiveProps = nextProps => {
    const { DGIMN } = this.props;
    if (nextProps.DGIMN !== DGIMN) {
      this.changeDgimn(DGIMN);
    }
  }

  /** 切换排口 */
    changeDgimn=dgimn => {
        this.setState({
            DGIMN: dgimn,
        })
         const {
        dispatch,
      } = this.props;
       dispatch({
         type: 'report/updateState',
         payload: {
           statusRecordForm: {
             ...this.props.statusRecordForm,
             DGIMN: dgimn,
           },
         },
       });
       setTimeout(() => {
         // 获取表格数据
         this.getTableData();
       }, 0);
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
    return (
      <>
        <NavigationTree QCAUse="1" onItemClick={value => {
          this.setState({
            initLoadSuccess: true,
          })
          if (value.length > 0 && !value[0].IsEnt && value[0].QCAType == '2') {
            this.setState({
              DGIMN: value[0].key,
            }, () => {
             this.changeDgimn(value[0].key);
            })
          }
        }} />
        <div id="contentWrapper">
          <PageHeaderWrapper>
            <Card className="contentContainer"
              title={
                <Form>
                  <Row gutter={48}>
                    <Col span={7}>
                      <Form.Item style={{ width: '100%', marginBottom: 0 }}>
                        {getFieldDecorator('time', {
                          initialValue: [moment().startOf('day'), moment()],
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
                          <Select mode="multiple" maxTagTextLength={10} maxTagCount={2} maxTagPlaceholder="..." allowClear placeholder="请选择指标名称">
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
                            <Option key="1"><span><LegendIcon style={{ color: '#34c066' }} />正常</span></Option>
                            <Option key="0"><span><LegendIcon style={{ color: '#e94' }} />异常</span></Option>
                          </Select>,
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={3}>
                      <Button type="primary" style={{ marginRight: 10 }} onClick={this.onSearch}>查询</Button>
                    </Col>
                  </Row>
                </Form>
              }
            >
            <SdlTable
                  dataSource={QCAStatusList}
                  columns={columns}
                  loading={loading}
                />
            </Card>
          </PageHeaderWrapper>
        </div>
      </>
    );
  }
}

export default Index;
