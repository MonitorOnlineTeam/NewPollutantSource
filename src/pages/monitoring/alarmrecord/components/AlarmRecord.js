import React, { Component } from 'react';
import moment from 'moment';
import { formatMoment, handleFormData } from '@/utils/utils';
import {
  Card,
  Spin,
  Button,
  Modal,
  Form,
  message,
  Badge,
  Icon,
  Row,
  Col,
  Input,
} from 'antd';
import { connect } from 'dva';
import cuid from 'cuid';
import RangePicker_ from '@/components/RangePicker/NewRangePicker'
import PollutantSelect from '@/components/PollutantSelect'
import SdlTable from '@/components/SdlTable'
import SdlForm from '@/pages/AutoFormManager/SdlForm';
import SdlDatePicker from '@/pages/AutoFormManager/SdlDatePicker';

import Cookie from 'js-cookie';
import Styles from './index.less';

const FormItem = Form.Item;
/**
 * 报警记录
 * xpy 2019.07.26
 */
@connect(({ loading, alarmrecord }) => ({
  pollutantlist: alarmrecord.pollutantlist,
  isloading: loading.effects['alarmrecord/querypollutantlist'],
  dataloading: loading.effects['alarmrecord/queryoverdatalist'],
  data: alarmrecord.overdata,
  total: alarmrecord.overtotal,
  overdataparams: alarmrecord.overdataparams,
  btnisloading: loading.effects['alarmrecord/AddExceptionVerify'],
}))
@Form.create()
class AlarmRecord extends Component {
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
    };
  }

  componentDidMount() {
    const { DGIMN, firsttime, lasttime, initLoadData } = this.props;
    if (initLoadData) {
      let {
        overdataparams,
      } = this.props;
      overdataparams = {
        ...overdataparams,
        DGIMN,
        beginTime: firsttime ? moment(firsttime).format('YYYY-MM-DD HH:mm:ss') : this.state.firsttime.format('YYYY-MM-DD HH:mm:ss'),
        endTime: lasttime ? moment(lasttime).format('YYYY-MM-DD HH:mm:ss') : this.state.lasttime.format('YYYY-MM-DD HH:mm:ss'),
      }
      console.log('firsttime=', firsttime);
      console.log('lasttime=', lasttime);
      console.log('this.props.DGIMN=', this.props.DGIMN);
      if (firsttime && lasttime) {
        this.setState({
          rangeDate: [firsttime, lasttime],
        })
      } else {
        this.setState({
          rangeDate: this.state.rangeDate,
        })
      }

      this.changeDgimn(this.props.DGIMN, overdataparams)
    }
  }

  componentWillReceiveProps = nextProps => {
    const { DGIMN, lasttime, firsttime } = this.props;
    if (nextProps.lasttime !== undefined && nextProps.firsttime !== undefined) {
      // 如果传入参数有变化，则重新加载数据
      if (nextProps.DGIMN !== DGIMN || moment(nextProps.lasttime).format('YYYY-MM-DD HH:mm:ss') !==
        moment(lasttime).format('YYYY-MM-DD HH:mm:ss') ||
        moment(nextProps.firsttime).format('YYYY-MM-DD HH:mm:ss') !== moment(firsttime).format('YYYY-MM-DD HH:mm:ss')) {
        let {
          overdataparams,
        } = this.props;
        overdataparams = {
          ...overdataparams,
          pageIndex: 1,
          pageSize: 20,
          DGIMN: nextProps.DGIMN,
          beginTime: moment(nextProps.firsttime).format('YYYY-MM-DD HH:mm:ss'),
          endTime: moment(nextProps.lasttime).format('YYYY-MM-DD HH:mm:ss'),
        }
        this.setState({
          rangeDate: [nextProps.firsttime, nextProps.lasttime],
        })
        if (nextProps.DGIMN !== '') {
          this.changeDgimn(nextProps.DGIMN, overdataparams);
        }
      }
    } else {
      // 如果传入参数有变化，则重新加载数据
      if (nextProps.DGIMN !== DGIMN) {
        const { rangeDate } = this.state;
        let {
          overdataparams,
        } = this.props;
        overdataparams = {
          ...overdataparams,
          DGIMN: nextProps.DGIMN,
          beginTime: moment(rangeDate[0]).format('YYYY-MM-DD HH:mm:ss'),
          endTime: moment(rangeDate[1]).format('YYYY-MM-DD HH:mm:ss'),
        }
        if (nextProps.DGIMN !== '') {
          this.changeDgimn(nextProps.DGIMN, overdataparams);
        }
      }
    }
  }

  /** 切换排口 */
  changeDgimn = (dgimn, params) => {
    this.setState({
      selectDisplay: true,
      selectedRowKeys: [],
    })
    const {
      dispatch,
    } = this.props;
    params = {
      ...params,
      pollutantCode: '',
      pageIndex: 1,
      pageSize: 20,
    }
    dispatch({
      type: 'alarmrecord/updateState',
      payload: {
        overdataparams: params,
      },
    })
    this.getpointpollutants(dgimn);
  }

  /** 获取污染物 */
  getpointpollutants = dgimn => {
    this.props.dispatch({
      type: 'alarmrecord/querypollutantlist',
      payload: {
        overdata: false,
        dgimn,
      },
    })
  };

  /** 时间更改 */
  _handleDateChange = (date, dateString) => {
    let { overdataparams } = this.props;
    overdataparams = {
      ...overdataparams,
      beginTime: date[0] && formatMoment(date[0]),
      endTime: date[0] && formatMoment(date[1]),
      pageIndex: 1,
      pageSize: 20,
    }
    this.setState({
      rangeDate: date,
    })
    if (overdataparams.DGIMN !== null && overdataparams.DGIMN !== '') {
      this.reloaddatalist(overdataparams);
    }
  };


  /** 如果是数据列表则没有选择污染物，而是展示全部污染物 */
  getpollutantSelect = () => {
    const { pollutantlist } = this.props;
    return (<PollutantSelect
      optionDatas={pollutantlist}
      allpollutant
      style={{ width: 150, marginRight: 10 }}
      onChange={this.ChangePollutant}
      placeholder="请选择污染物"
    />);
  }

  /**切换污染物 */
  ChangePollutant = (value, selectedOptions) => {
    let {
      overdataparams,
    } = this.props;
    if (value === -1) {
      value = null;
    }
    overdataparams = {
      ...overdataparams,
      pollutantCode: value,
      pageIndex: 1,
      pageSize: 20,
    }
    this.reloaddatalist(overdataparams);
  };


  /** 分页 */
  pageIndexChange = (page, pageSize) => {
    const { overdataparams } = this.props;
    overdataparams.pageIndex = page;
    this.reloaddatalist(overdataparams);
  }

  /** 刷新数据 */
  reloaddatalist = overdataparams => {
    const { dispatch } = this.props;
    dispatch({
      type: 'alarmrecord/updateState',
      payload: {
        overdataparams,
      },
    })
    dispatch({
      type: 'alarmrecord/queryoverdatalist',
      payload: {
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

  /** 分页 */
  onShowSizeChange = (pageIndex, pageSize) => {
    let { overdataparams } = this.props;
    overdataparams = {
      ...overdataparams,
      pageIndex,
      pageSize,
    }
    this.reloaddatalist(overdataparams);
  }

  onChange = (pageIndex, pageSize) => {
    let { overdataparams } = this.props;
    overdataparams = {
      ...overdataparams,
      pageIndex,
      pageSize,
    }
    this.reloaddatalist(overdataparams);
  }

  /** 保存核实单 */
  handleOk = e => {
    const { dispatch, form, overdataparams, DGIMN, EntCode } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
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
    const { selectedRowKeys } = this.state;
    const { dataHeight } = this.props;
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
    const columns = [{
      title: '报警时间',
      dataIndex: 'FirstTime',
      align: 'center',
      width: 160,
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
    // {
    //   title: '报警值',
    //   dataIndex: 'AlarmValue',
    //   key: 'AlarmValue',

    // },
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
      // filters: [{
      //   text: '未核实',
      //   value: '0',
      // },
      // {
      //   text: '已核实',
      //   value: '1',
      // },
      // ],
      // onFilter: (value, record) => record.State.indexOf(value) === 0,
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
    } = this.props;
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
    // if (isloading) {
    //   return (<Spin
    //     style={{
    //       width: '100%',
    //       height:'calc(100vh/2)',
    //       display: 'flex',
    //       alignItems: 'center',
    //       justifyContent: 'center',
    //     }}
    //     size="large"
    //   />);
    // }
    return (
      <div className={Styles.check}>
        <Card
          extra={
            <div>
              {!this.props.isloading && this.state.selectDisplay && this.getpollutantSelect()}
              <RangePicker_ style={{ width: 350, textAlign: 'left', marginRight: 10, marginTop: 5 }}
                dataType="minute"
                dateValue={this.state.rangeDate}
                callback={dates => this._handleDateChange(dates)}
              />
              <Button style={{ marginTop: 5 }} onClick={this.BtnVerify}><Icon type="setting" theme="twoTone" />处置</Button>
            </div>
          }

        >
          <SdlTable
            loading={this.props.dataloading}
            columns={columns}
            dataSource={this.props.data}
            rowKey="ID"
            rowSelection={rowSelection}
            pagination={
              {
                size: 'small',
                // showSizeChanger: true,
                showQuickJumper: true,
                total: this.props.total,
                pageSize: 20, // this.props.overdataparams.pageSize,
                current: this.props.overdataparams.pageIndex,
                onChange: this.onChange,
                onShowSizeChange: this.onShowSizeChange,
                pageSizeOptions: ['10', '20', '30', '40', '50', '100', '200', '400', '500', '1000'],
              }
            }
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
    );
  }
}
export default AlarmRecord;
