import React, { Component } from 'react';
import moment from 'moment';
import { Form, Icon as LegacyIcon } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { ProfileOutlined } from '@ant-design/icons';
import {
    Card,
    Spin,
    Select,
    Input,
    Button,
    Tooltip,
    Modal,
    Steps,
    Pagination,
    Empty,
    Row,
    Col,
} from 'antd';
import { connect } from 'dva';
import RangePicker_ from '@/components/RangePicker/NewRangePicker'
import { DetailIcon } from '@/utils/icon'
import {
  routerRedux,
} from 'dva/router';
import AlermIndex from './AlermIndex'
import ExceptionAlarm from '@/components/ExceptionAlarm/ExceptionAlarm';
import Style from './index.less';
/**
 * 指挥调度组件
 * xpy 2020.02.11
 */
const FormItem = Form.Item;
const { Step } = Steps;
@connect(({ loading, operations }) => ({
    dataloading: loading.effects['operations/getcommanddispatchreport'],
    total: operations.total,
    queryparams: operations.queryparams,
    datatable: operations.datatable,
}))
@Form.create()
class Dispatchreport extends Component {
    constructor(props) {
        super(props);
        this.formLayout = {
            labelCol: {
              span: 5,
            },
            wrapperCol: {
              span: 16,
            },
          };
        this.state = {
            rangeDate: [],
            format: 'YYYY-MM-DD HH:mm',
            selectvalue: '',
            UserName: '',
            dgimn: '',
            expand: false,
            Rvisible: false,
            Evisible: false,
            btime: '',
            etime: '',
            ID: '',
            EID: '',
            PID: '',
        };
         this.handleExpand = this.handleExpand.bind(this);
         this.resetForm = this.resetForm.bind(this);
         this.Detail = this.Detail.bind(this);
    }

    componentDidMount() {
        this.props.initLoadData && this.changeDgimn(this.props.DGIMN)
    }

    /** dgimn改變時候切換數據源 */
    componentWillReceiveProps = nextProps => {
        if (nextProps.DGIMN !== this.props.DGIMN) {
            this.changeDgimn(nextProps.DGIMN);
        }
    }

    // 步骤
    StepsList = StepsList => {
        const returnStepList = [];
        StepsList.map(item => {
                returnStepList.push(
                    <>
                        <Card.Grid style={{ width: '100%', marginTop: '10px', overflowX: 'scroll' }} >
                            <div className={this.CommandDispatchType('style', item.CommandDispatchType)}></div>
                            <div style={{ float: 'left', marginLeft: '5px', width: '95%' }}>
                                <div style={{ width: '100%', marginBottom: '5px', overflow: 'hidden', lineHeight: '24px' }}>
                <div style={{ width: '95%', float: 'left', fontWeight: 'bolder' }}><span>{this.CommandDispatchType('', item.CommandDispatchType)}</span><span style={{ fontSize: '10px', color: '#8c8c8c', marginLeft: '10px' }}>{item.CreateTime}</span></div>
                                    <div style={{ float: 'right' }}><Button type="primary" icon={<ProfileOutlined />} size="small" onClick={this.Detail.bind(this, item.TaskId, item.Flag, item.FirstTime, item.EndTime, item.EID, item.PID)}>详情</Button></div>
                                </div>
                                <div style={{ width: '100%', marginBottom: '5px', overflow: 'hidden' }}>
                                    <div style={{ width: '100%', fontWeight: 'bold', fontSize: '12px' }}>{item.Remark}</div>
                                </div>
                                <Steps size="small" status="process">{this.TaskLogList(item.Steplist)}</Steps>
                            </div>
                        </Card.Grid>

                    </>,
                );
            });
        return returnStepList;
    }

    // 步骤条
    TaskLogList = TaskLogList => {
        const returnStepList = [];
            TaskLogList.map(item => {
                returnStepList.push(
                    <Step
                        status={item.Status == 1 ? 'finish' : 'wait'}
                        title={item.TaskStatusText}
                        description={this.description(item)}
                        icon={<LegacyIcon type={
                            this.showIcon(item.TaskStatusText)
                        }
                        />}
                    />,
                );
            });
        return returnStepList;
    }

    //图标
    showIcon = TaskStatusText => {
        switch (TaskStatusText) {
            case '待执行': return 'minus-circle';
            case '进行中': return 'clock-circle';
            case '已完成': return 'check-circle';
            case '待审核': return 'exclamation-circle';
            case '审核通过': return 'check-square';
            case '驳回': return 'close-circle';
            case '待调整': return 'warning';
            case '已调整': return 'check-square';
            case '超标报警': return 'bell';
            case '异常报警': return 'exclamation-circle-o';
            case '系统关闭': return 'poweroff';
            case '缺失数据报警':return 'question-circle-o';
            default: return 'schedule';
        }
    }


    // 步骤条描述
    description = item => (
                <div style={{ fontSize: '10' }} className={Style.hidpage}>
                    <div style={{ marginTop: 5 }}>
                        {item.Remark}
                    </div>
                    <div style={{ marginTop: 5 }}>
                        {item.CreateUserName}
                    </div>
                    <div style={{ marginTop: 5 }}>
                        {item.CreateTime == '0001-01-01 00:00:00' ? '' : item.CreateTime}
                    </div>

                </div>
            )

    // 派单类型图标
    CommandDispatchType = (type, item) => {
        if (type == 'style') {
            switch (item) {
                case '1': return Style.imgstyle1;
                case '2': return Style.imgstyle2;
                case '3': return Style.imgstyle3;
                case '4': return Style.imgstyle4;
                case '5': return Style.imgstyle5;
                default: return '';
            }
        } else {
            switch (item) {
                case '1': return '例行派单';
                case '2': return '异常报警';
                case '3': return '人工派单';
                case '4': return '超标报警';
                case '5': return '缺失数据报警';
                default: return '';
            }
        }
    }

    /** 切换任务类型 */
    SelectOnChange=value => {
        debugger;
        if (value === undefined) {
            this.setState({
            selectvalue: '',
            })
        } else {
        this.setState({
            selectvalue: value,
        })
        }
    }

    /** 人员姓名变化事件 */
    InoutOnChange=e => {
        this.setState({
            UserName: e.target.value,
        })
    }

    /** 切换时间 */
    _handleDateChange = (date, dateString) => {
        debugger;
       if (date && date.length > 0 && date[0]) {
        this.setState({ rangeDate: date });
       } else {
           this.setState({ rangeDate: [undefined, undefined] });
       }
    };

    /** 展开折叠 */
    handleExpand=() => {
      this.setState({
        expand: !this.state.expand,
      });
    }

     /** 重置form */
     resetForm=() => {
        this.props.form.resetFields();
     }

    /** 后台请求数据 */
    reloaddatalist = queryparams => {
        const {
            dispatch,
        } = this.props;
        dispatch({
            type: 'operations/updateState',
            payload: {
                queryparams,
            },
        })
        dispatch({
            type: 'operations/getcommanddispatchreport',
            payload: {},
        });
    }

    /** 切换排口 */
    changeDgimn = dgimn => {
        this.setState({
            dgimn,
        })
        const {
            dispatch, queryparams,
        } = this.props;
        const { rangeDate, selectvalue, UserName } = this.state;
        dispatch({
            type: 'operations/updateState',
            payload: {
                queryparams: {
                    ...queryparams,
                    DGIMN: dgimn,
                    BTime: rangeDate.length > 0 && rangeDate[0] != undefined ? rangeDate[0].format('YYYY-MM-DD HH:mm:ss') : '',
                    ETime: rangeDate.length > 0 && rangeDate[1] != undefined ? rangeDate[1].format('YYYY-MM-DD HH:mm:ss') : '',
                    CommandDispatchType: selectvalue,
                    UserID: UserName,
                    pageIndex: 1,
                },
            },
        })
         dispatch({
           type: 'operations/getcommanddispatchreport',
           payload: {},
         });
    }

    /** 分页 */
    onShowSizeChange = (pageIndex, pageSize) => {
        const {
            dispatch, queryparams,
        } = this.props;
        dispatch({
            type: 'operations/updateState',
            payload: {
                queryparams: {
                    ...queryparams,
                    pageIndex,
                    pageSize,
                },
            },
        })
         dispatch({
           type: 'operations/getcommanddispatchreport',
           payload: {},
         });
    }

    onChange = (pageIndex, pageSize) => {
        const {
            dispatch, queryparams,
        } = this.props;
        dispatch({
            type: 'operations/updateState',
            payload: {
                queryparams: {
                    ...queryparams,
                    pageIndex,
                    pageSize,
                },
            },
        })
         dispatch({
           type: 'operations/getcommanddispatchreport',
           payload: {},
         });
    }

    /** 详情 */
    Detail=(TaskId, Type, btime, etime, EID, PID) => {
        this.setState({
            ID: TaskId,
            EID,
            PID,
        })
        const DGIMN = this.state.dgimn;
          if (Type == 1) {
              this.props.dispatch(routerRedux.push(`/operations/CommandDispatchReport/details/${TaskId}/${DGIMN}`));
          }
          if (Type == 3) {
              this.setState({
                  Rvisible: true,
                  btime,
                  etime,
              })
          }
          if (Type == 2) {
            this.setState({
              Evisible: true,
               btime,
               etime,
            })
          }
    }

    /** 查询按钮 */
    Search=() => {
        const {
            dispatch, queryparams,
        } = this.props;
        const { rangeDate, dgimn, selectvalue, UserName } = this.state;

        dispatch({
            type: 'operations/updateState',
            payload: {
                queryparams: {
                    ...queryparams,
                    DGIMN: dgimn,
                    BTime: rangeDate.length > 0 && rangeDate[0] != undefined ? rangeDate[0].format('YYYY-MM-DD HH:mm:ss') : '',
                    ETime: rangeDate.length > 0 && rangeDate[1] != undefined ? rangeDate[1].format('YYYY-MM-DD HH:mm:ss') : '',
                    CommandDispatchType: selectvalue,
                    UserID: UserName,
                    pageIndex: 1,
                },
            },
        })
         dispatch({
           type: 'operations/getcommanddispatchreport',
           payload: {},
         });
    }

      // 取消Model
      onCancel = () => {
        this.setState({
          Rvisible: false,
        });
      }

      // 取消Model
      onCancel1 = () => {
        this.setState({
          Evisible: false,
        });
      }
    /** 渲染数据展示 */

    loaddata = () => {

    }


    render() {
        const { dataloading, datatable } = this.props;

        console.log('datatable', datatable);
        const columns = [
            {
            title: '调度类别',
            dataIndex: 'CommandDispatchType',
            key: 'CommandDispatchType',
            width: '5%',
            align: 'center',
            render: (text, record) => {
              if (text === '1') {
                return <span>例行派单</span>;
              }
              if (text === '2') {
                 return <span>异常报警</span>;
              }
              if (text === '3') {
                  return <span>人工派单</span>;
              }
              if (text === '5') {
                return <span>缺失数据报警</span>;
            }
              return <span> 超标报警</span>;
            },
            },
            {
              title: 'ddddd',
              dataIndex: 'Steplist',
              key: 'Steplist',
              align: 'left',
              render: (text, record) => <Steps status="process">{this.TaskLogList(record.Steplist)}</Steps>,
            },
            {
                title: '操作',
                key: 'action',
                 width: '5%',
                 align: 'center',
                render: (text, record, index) => (
                    <span>
                     <Tooltip title="详情">
                        <a onClick={() => {
                           this.Detail(record.TaskId, record.Flag, record.FirstTime, record.EndTime)
                        }}><DetailIcon/></a>
                        </Tooltip>
                    </span>
                ),
            },
        ];
         const { getFieldDecorator } = this.props.form;
        const {
          Option,
        } = Select;
        const { queryparams } = this.props;
        console.log('queryparams', queryparams);
        return (
            <div style={{ background: '#ECECEC' }}>
                <Card
                bordered={false}
                extra={
                    <Row gutter={16} style={{ width: '800px' }}>
                        <Col xl={{ span: 6 }} lg={{ span: 12 }} md={{ span: 12 }} sm={{ md: 24 }} xs={{ md: 24 }}>
                            <Select
                                    onChange={this.SelectOnChange}
                                    placeholder="调度类别"
                                    allowClear
                                    style={{ width: '100%' }}
                                >
                                    <Option value="1">例行派单</Option>
                                    <Option value="2">异常报警</Option>
                                    <Option value="3">人工派单</Option>
                                    <Option value="4">超标报警</Option>
                                    <Option value="5">缺失数据报警</Option>
                            </Select>
                        </Col>
                        <Col xl={{ span: 11 }} lg={{ span: 12 }} md={{ span: 12 }} sm={{ md: 24 }} xs={{ md: 24 }}>
                            <RangePicker_
                                    style={{ width: '100%' }}
                                    dateValue={this.state.rangeDate} format={this.state.format}
                                    callback={this._handleDateChange} allowClear showTime={this.state.format} />
                        </Col>
                        <Col xl={{ span: 4 }} lg={{ span: 12 }} md={{ span: 12 }} sm={{ md: 24 }} xs={{ md: 24 }}>
                            <Input placeholder="人员姓名" style={{ width: '100%' }} allowClear onChange={this.InoutOnChange}/>
                        </Col>
                        <Col xl={{ span: 2 }} lg={{ span: 12 }} md={{ span: 12 }} sm={{ md: 24 }} xs={{ md: 24 }}>
                            <Button
                                    onClick={() => {
                                        this.Search();
                                    }}
                                    type="primary"
                                    htmlType="submit"
                                >
                                    查询
                            </Button>
                        </Col>
                    </Row>
                }
                >
                    <div className={Style.Content}>
                        {
                        dataloading && <Spin
                            style={{
                            width: '100%',
                            height: 'calc(100vh/2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            }}
                            size="large"
                        />
                        }
                        {
                            !dataloading && (datatable.length ?
                            <>
                                <div className={Style.Item}>
                                {this.StepsList(datatable)}
                                </div>
                                <div style={{ width: '100%', marginTop: 30 }}>
                                <Pagination
                                    style={{ float: 'right' }}
                                    size="small"
                                    showSizeChanger
                                    showQuickJumper
                                    total= {queryparams.total}
                                    pageSize= {queryparams.pageSize}
                                    current= {queryparams.pageIndex}
                                    onChange={this.onChange}
                                    onShowSizeChange={this.onShowSizeChange}
                                />
                                </div>
                            </> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />)
                        }

                    </div>
                    <Modal
                    destroyOnClose="true"
                    visible={this.state.Rvisible}
                    title="报警记录"
                    width="90%"
                    footer={null}
                    onCancel={this.onCancel}
                    >
                     <AlermIndex ID={this.state.ID} EID={this.state.EID} PID={this.state.PID}/>
                    </Modal>
                    <Modal
                    destroyOnClose="true"
                    visible={this.state.Evisible}
                    title="异常记录"
                    width="70%"
                    footer={null}
                    onCancel={this.onCancel1}
                    >
                     <ExceptionAlarm
                      initLoadData DGIMN={this.state.dgimn} Types="1" firsttime={this.state.btime}
                        lasttime={this.state.etime}/>
                    </Modal>
                    </Card>
            </div >
        );
    }
}
export default Dispatchreport;
