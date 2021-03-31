import React, { Component, useDebugValue } from 'react';
import moment from 'moment';
import { formatMoment, handleFormData } from '@/utils/utils';
import { EditOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
  Card,
  Spin,
  Button,
  Modal,
  message,
  Badge,
  Row,
  Col,
  Input,
  Select,
  Checkbox,
} from 'antd';
import { connect } from 'dva';
import cuid from 'cuid';
import RangePicker_ from '@/components/RangePicker/NewRangePicker'
import PollutantSelect from '@/components/PollutantSelect'
import SdlTable from '@/components/SdlTable'
import SdlForm from '@/pages/AutoFormManager/SdlForm';
import SdlDatePicker from '@/pages/AutoFormManager/SdlDatePicker';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';

import Cookie from 'js-cookie';
const { Option } = Select;
const FormItem = Form.Item;
const pageUrl = {
    getRegions: 'autoForm/getRegions',
    GetEntByRegion:'exceedDataAlarmModel/GetEntByRegion',
    GetPointByEntCode:'StopRecordModel/GetPointByEntCode',
}
/**
 * 报警记录
 * xpy 2019.07.26
 */
@connect(({ loading, alarmrecord,autoForm,exceedDataAlarmModel,StopRecordModel }) => ({
  pollutantlist: alarmrecord.pollutantlist,
  isloading: loading.effects['alarmrecord/querypollutantlist'],
  dataloading: loading.effects['alarmrecord/queryoverdatalist'],
  data: alarmrecord.overdata,
  total: alarmrecord.overtotal,
  overdataparams: alarmrecord.overdataparams,
  regionList: autoForm.regionList,
  entList: exceedDataAlarmModel.priseList,
  pointList:StopRecordModel.PointByEntList,
  divisorList: alarmrecord.divisorList,
  btnisloading: loading.effects['alarmrecord/AddExceptionVerify'],
}))
@Form.create()
class AlarmRecordList extends Component {
  constructor(props) {
    super(props);
    const firsttime = moment(new Date()).add(-1, 'month');
    const lasttime = moment(new Date());
    this.state = {
      rangeDate: [firsttime, lasttime],
      current: 1,
      pageSize: 20,
      // 参数改变让页面刷新
      firsttime,
      lasttime,
      selectDisplay: false,
      selectedRowKeys: [],
      visible: false,
      uid: cuid(),
      checkedValues: [],
    };
  }

  componentDidMount() {
    this.initData();
  }

  /**初始化查询条件 */
  initData = () => {
    //获取行政区列表
    this.props.dispatch({
        type: pageUrl.getRegions,
        payload: {
            PointMark: '2',
            RegionCode: ''
        },
    });
    this.props.dispatch({
        //获取企业列表
        type: pageUrl.GetEntByRegion,
        payload: { RegionCode: '' },
    });
    this.getPollutantByType(false,this.reloaddatalist());
};

  /**根据企业类型查询监测因子 */
  getPollutantByType = (reload,cb) => {
    this.props.dispatch({
      type: "alarmrecord/getPollutantByType",
      payload: {
        type: this.props.form.getFieldValue("PollutantType")
      },
      callback: (res) => {
        this.setState({ checkedValues: res.map(item => item.PollutantCode) }, () => {
          reload && this.props.form.setFieldsValue({ PollutantList: this.state.checkedValues })
        })
      }
    })
  }
  onCheckboxChange = (checkedValues) => {
    if (checkedValues.length < 1) {
      message.warning("最少勾选一个监测因子！")
      return;
    }
  }


  /** 时间更改 */
  _handleDateChange = (date, dateString) => {
    this.setState({
      rangeDate: date,
    })
  };

  /** 刷新数据 */
  reloaddatalist = () => {
      debugger;
    const { dispatch } = this.props;
    let values = this.props.form.getFieldsValue();
    console.log("values=", values)
    let beginTime, endTime;
    const{rangeDate}=this.state;
    if (rangeDate && rangeDate[0]) {
        beginTime = moment(rangeDate[0]).format("YYYY-MM-DD HH:MM:ss")
      }
      if (rangeDate && rangeDate[1]) {
        endTime = moment(rangeDate[1]).format("YYYY-MM-DD HH:MM:ss")
      }
    dispatch({
      type: 'alarmrecord/queryoverdatalist',
      payload: {
        PollutantCode:values.PollutantList.toString(),
        DGIMN:values.DGIMN,
        PollutantType:values.PollutantType,
        EntCode:values.EntCode,
        RegionCode:values.RegionCode,
        beginTime:beginTime,
        endTime:endTime,
      },
    });
  }

  /** 多选 */
  onSelectChange = selectedRowKeys => {
    this.setState({
      selectedRowKeys,
    });
  };

  /** 显示核实单 */
  BtnVerify = () => {
    const { form } = this.props;
    form.setFieldsValue({
      VerifyTime: moment(),
    })
    if (this.state.selectedRowKeys.length > 0) {
      this.setState({
        visible: true,
      });
    } else {
      message.error('请选择报警记录！')
    }
  }



  /** 保存核实单 */
  handleOk = e => {
    const { dispatch, form, overdataparams, DGIMN, EntCode } = this.props;
    form.validateFields((err, values) => {
      debugger;
      if (!err) {
        debugger;
        const formData = handleFormData(values, this.state.uid);
        formData.VerifyPerSon = formData.VerifyPerSon1;
        formData.VerifyTime = formData.VerifyTime1;
        formData.DGIMN = DGIMN;
        formData.EntCode = EntCode;
        dispatch({
          type: 'alarmrecord/AddExceptionVerify',
          payload: {
            ExceptionProcessingID: this.state.selectedRowKeys.toString(),
            configId: 'ExceptionVerify',
            FormData: formData,
            callback: result => {
              if (result.Datas) {
                this.reloaddatalist(overdataparams);
                this.setState({
                  visible: false,
                  selectedRowKeys: [],
                })
              } else {
                message.error(result.Message);
              }
            },
          },
        });
      }
    });
  };


  render() {
    const userCookie = Cookie.get('currentUser');
    const UserName = JSON.parse(userCookie).User_Name;
    const { selectedRowKeys,checkedValues } = this.state;
    const { dataHeight,divisorList,regionList,entList,pointList } = this.props;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      getCheckboxProps: record => ({
        disabled: record.State === '1', // Column configuration not to be checked
        name: record.State,
      }),
      hideDefaultSelections: true,
    };
    console.log('object')
    const columns = [
      {
        title: '行政区',
        width: 100,
        dataIndex: 'RegionName',
        key: 'RegionName',
        align: 'center',
      },
      {
        title: '企业名称',
        width: 100,
        dataIndex: 'EntName',
        key: 'EntName',
        align: 'left',
      },
      {
        title: '监测点名称',
        width: 100,
        dataIndex: 'PointName',
        key: 'PointName',
        align: 'center',
      },
      {
      title: '报警时间',
      dataIndex: 'FirstTime',
      align: 'center',
      width: 100,
      key: 'FirstTime',
    },
    {
      title: '报警类型',
      width: 100,
      dataIndex: 'AlarmTypeName',
      key: 'AlarmTypeName',
      align: 'center',
    },
    {
      title: '污染物',
      width: 100,
      dataIndex: 'PollutantName',
      key: 'PollutantName',
      align: 'center',
    },

    {
      title: '报警次数',
      width: 100,
      dataIndex: 'AlarmCount',
      key: 'AlarmCount',
      align: 'center',
    },
    {
      title: '处置状态',
      width: 100,
      dataIndex: 'State',
      key: 'State',
      align: 'center',
      render: (text, record) => {
        if (text === '0') {
          return <span> <Badge status="error" text="未处置" /> </span>;
        }
        return <span> <Badge status="default" text="已处置" /> </span>;
      },
    },
    {
      title: '报警信息',
      dataIndex: 'AlarmMsg',
      width: 350,
      key: 'AlarmMsg',

    },
    ];
    const {
      isloading,
      overdataparams,
      form,
      btnisloading,
      dataloading,
    } = this.props;
    let _regionList = regionList.length ? regionList[0].children : [];
    const {
      getFieldDecorator,
    } = this.props.form;
    const formLayout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 14,
      },
    };
    return (
      <BreadcrumbWrapper>
        <div>
          <Card>
          <Form layout="" style={{ marginBottom: 20 }}>
              <Row gutter={16}>
                <Col md={4}>
                  <FormItem {...formLayout} label="企业类型" style={{ width: '100%' }}>
                    {getFieldDecorator('PollutantType', {
                      initialValue: '1',
                    })(
                      <Select placeholder="请选择企业类型" onChange={(value) => {
                        this.setState({ pollutantType: value }, () => {
                          this.getPollutantByType(true)
                        })
                      }}>
                        <Option value="1">废水</Option>
                        <Option value="2">废气</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col md={7}>
                  <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label="日期查询" style={{ width: '100%' }}>
                      <RangePicker_ style={{ width: 350, textAlign: 'left', marginRight: 10, marginTop: 5 }}
                          dataType="minute"
                          dateValue={this.state.rangeDate}
                          callback={dates => this._handleDateChange(dates)}
                          allowClear={false}
                      />
                  </FormItem>
                </Col>
                <Col md={4}>
                  <FormItem {...formLayout} label="行政区" style={{ width: '100%' }}>
                    {getFieldDecorator('RegionCode', {
                    })(
                      <Select allowClear placeholder="请选择行政区">
                        {
                          _regionList.map(item => {
                            return <Option key={item.key} value={item.value}>
                              {item.title}
                            </Option>
                          })
                        }
                      </Select>,
                    )}
                  </FormItem>
                </Col>
                <Col md={5}>
                  <FormItem {...formLayout} label="企业" style={{ width: '100%' }}>
                    {getFieldDecorator('EntCode', {
                      initialValue: undefined,
                    })(
                      <Select allowClear placeholder="请选择企业"  onChange={(value) => {
                          //获取监测点
                          this.props.dispatch({
                              type: pageUrl.GetPointByEntCode,
                              payload: {
                                  EntCode:value
                              },
                          });
                          this.props.form.setFieldsValue({ DGIMN: undefined })
                      }}>
                        {
                          entList.map(item => {
                            return <Option key={item.EntCode} value={item.EntCode}>
                              {item.EntName}
                            </Option>
                          })
                        }
                      </Select>,
                    )}
                  </FormItem>
                </Col>
                <Col md={4}>
                  <FormItem {...formLayout} label="监测点" style={{ width: '100%' }}>
                    {getFieldDecorator('DGIMN', {
                    })(
                      <Select allowClear placeholder="请选择监测点">
                      {
                        pointList.map(item => {
                          return <Option key={item.DGIMN} value={item.DGIMN}>
                            {item.PointName}
                          </Option>
                        })
                      }
                    </Select>,
                    )}
                  </FormItem>
                </Col>

                <Col md={24} style={{ display: "flex", alignItems: "center", marginTop: 10 }}>
                  <div class="ant-form-item-label" style={{ width: '5.3%' }}>
                    <label for="RegionCode" class="" title="监测因子">监测因子</label>
                  </div>
                  {getFieldDecorator('PollutantList', {
                    initialValue: checkedValues,
                  })(
                    <Checkbox.Group style={{ maxWidth: "calc(100% - 5.3% - 168px)" }} onChange={this.onCheckboxChange}>
                      {
                        divisorList.map(item => {
                          return <Checkbox key={item.PollutantCode} value={item.PollutantCode}>{item.PollutantName}</Checkbox>
                        })
                      }
                    </Checkbox.Group>
                  )}
                  <Button loading={dataloading} type="primary" style={{ marginLeft: 10 }} onClick={()=>{
                      this.reloaddatalist()
                  }}>
                    查询
                        </Button>
                  <Button
                    style={{ margin: '0 5px' }}
                    type="danger"
                    icon={<EditOutlined />}
                    onClick={this.BtnVerify}
                  >
                    处置
                        </Button>
                </Col>
              </Row>
            </Form>
            <SdlTable
              loading={this.props.dataloading}
              columns={columns}
              dataSource={this.props.data}
              rowKey="ID"
              rowSelection={rowSelection}
              align="center"
              onRow={(record, index) => ({
                onClick: event => {
                  const { selectedRowKeys } = this.state;
                  let keys = selectedRowKeys;
                  if (selectedRowKeys.some(item => item === record.ID)) {
                    keys = keys.filter(item => item !== record.ID)
                  } else if (record.State !== '1') {
                    keys.push(record.ID);
                  }
                  this.setState({
                    selectedRowKeys: keys,
                  })
                },
              })}
            />

            <Modal
              title="处置单详情"
              visible={this.state.visible}
              destroyOnClose // 清除上次数据
              onOk={this.handleOk}
              confirmLoading={btnisloading}
              okText="保存"
              cancelText="关闭"
              onCancel={() => {
                this.setState({
                  visible: false,
                });
              }}
              width="50%"
            >
              <SdlForm configId="ExceptionVerify" form={this.props.form} hideBtns >
                <Row>
                  <Col span={12}>
                    <FormItem {...formLayout} label="处置人">
                      {getFieldDecorator('VerifyPerSon1', {
                        initialValue: UserName,
                        rules: [
                          {
                            required: true,
                            message: '处置人不能为空',
                          },
                        ],
                      })(
                        <Input></Input>,
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem {...formLayout} label="处置时间">
                      {getFieldDecorator('VerifyTime1', {
                        initialValue: moment(),
                        rules: [
                          {
                            required: true,
                            message: '处置时间不能为空',
                          },
                        ],
                      })(
                        <SdlDatePicker />,
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </SdlForm>
            </Modal>
          </Card>
        </div>
        </BreadcrumbWrapper>
    );
  }
}
export default AlarmRecordList;
