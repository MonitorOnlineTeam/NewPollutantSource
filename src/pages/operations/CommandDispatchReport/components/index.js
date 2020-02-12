import React, { Component } from 'react';
import moment from 'moment';
import {
    Card,
    Spin,
    Row, Col, Select, Input, Button, Tooltip,
} from 'antd';
import { connect } from 'dva';
import RangePicker_ from '@/components/RangePicker'
import SdlTable from '@/components/SdlTable'
import { DetailIcon } from '@/utils/icon'
import {
  routerRedux,
} from 'dva/router';

/**
 * 指挥调度组件
 * xpy 2020.02.11
 */
@connect(({ loading, operations }) => ({
    dataloading: loading.effects['operations/getcommanddispatchreport'],
    total: operations.total,
    queryparams: operations.queryparams,
    datatable: operations.datatable,
}))

class Dispatchreport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rangeDate: [],
            format: 'YYYY-MM-DD HH:mm:ss',
            selectvalue: '',
            UserName: '',
            dgimn: '',
        };
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


    /** 切换任务类型 */
    SelectOnChange=value => {
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
        console.log('date', date);
       if (date.length > 0) {
        this.setState({ rangeDate: date });
        let {
          queryparams,
        } = this.props;
        queryparams = {
            ...queryparams,
            BTime: date[0].format('YYYY-MM-DD HH:mm:ss'),
            ETime: date[1].format('YYYY-MM-DD HH:mm:ss'),
        }
       } else {
           this.setState({ rangeDate: [] });
       }
    };


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
            dispatch,
        } = this.props;
        let { queryparams } = this.props;
        const { rangeDate, selectvalue, UserName } = this.state;
        queryparams = {
            ...queryparams,
            DGIMN: dgimn,
            BTime: rangeDate.length > 0 ? rangeDate[0].format('YYYY-MM-DD HH:mm:ss') : '',
            ETime: rangeDate.length > 0 ? rangeDate[1].format('YYYY-MM-DD HH:mm:ss') : '',
            CommandDispatchType: selectvalue,
            UserID: UserName,
        }
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

    /** 详情 */
    Detail=(TaskId, Type) => {
        console.log(Type);
        const {
          DGIMN,
        } = this.state.dgimn;
          if (Type === 1) {
              this.props.dispatch(routerRedux.push(`/operations/calendar/details/${TaskId}/${DGIMN}`));
          }
    }

    /** 查询按钮 */
    Search=() => {
        const {
            dispatch,
        } = this.props;
        let { queryparams } = this.props;
        const { rangeDate, selectvalue, UserName, dgimn } = this.state;
        queryparams = {
            ...queryparams,
            DGIMN: dgimn,
            BTime: rangeDate.length > 0 ? rangeDate[0].format('YYYY-MM-DD HH:mm:ss') : '',
            ETime: rangeDate.length > 0 ? rangeDate[1].format('YYYY-MM-DD HH:mm:ss') : '',
            CommandDispatchType: selectvalue,
            UserID: UserName,
        }
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

    /** 渲染数据展示 */

    loaddata = () => {
        const { dataloading, datatable } = this.props;
        if (dataloading) {
            return (<Spin
                style={{
                    width: '100%',
                    height: 'calc(100vh - 400px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                size="large"
            />);
        }
        const columns = [
          {
            title: '时间',
            dataIndex: 'CreateTime',
            key: 'CreateTime',
            width: '15%',
            align: 'center',
          },
            {
            title: '调度类别',
            dataIndex: 'CommandDispatchType',
            key: 'CommandDispatchType',
            width: '10%',
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
              return <span> 超标报警</span>;
            },
            },
            {
              title: '人员姓名',
              dataIndex: 'UserName',
              key: 'UserName',
               width: '10%',
              align: 'center',
            },
            {
              title: '备注',
              dataIndex: 'Remark',
              key: 'Remark',
              align: 'center',
            },
            {
                title: '操作',
                key: 'action',
                 width: '10%',
                 align: 'center',
                render: (text, record, index) => (
                    <span>
                     <Tooltip title="详情">
                        <a onClick={() => {
                           this.Detail(record.TaskId, record.Flag)
                        }}><DetailIcon/></a>
                        </Tooltip>
                    </span>
                ),
            },
        ];
        return (
            <Card.Grid style={{ width: '100%', height: 'calc(100vh - 350px)', overflow: 'auto', ...this.props.style }}>
                <SdlTable
                    rowKey={(record, index) => `complete${index}`}
                    dataSource={datatable}
                    columns={columns}
                    Pagination={null}

                />
            </Card.Grid>
        );
    }


    render() {
        const {
          Option,
        } = Select;
        return (
            <div>
                <Card
                    title={
                        <div>
                            <Row>
                                <Col xs={24} sm={24} md={24} lg={24} xl={12} xxl={7}>
                                    <Select
                                        style={{ width: '80%', margin: '5px' }}
                                        placeholder="请选择"
                                        onChange={this.SelectOnChange}
                                        allowClear
                                    >
                                        <Option value="1">例行派单</Option>
                                        <Option value="2">异常报警</Option>
                                        <Option value="3">人工派单</Option>
                                        <Option value="4">超标报警</Option>
                                    </Select>
                                </Col>
                                <Col xs={24} sm={24} md={24} lg={24} xl={12} xxl={9}>
                                    <RangePicker_ style={{ width: '90%', margin: '5px', textAlign: 'left' }} dateValue={this.state.rangeDate} format={this.state.format} onChange={this._handleDateChange} allowClear showTime={this.state.format} />
                                </Col>
                                <Col xs={24} sm={24} md={24} lg={12} xl={18} xxl={5}>
                                    <Input style={{ width: '90%', margin: '5px' }} placeholder="人员姓名" allowClear onChange={this.InoutOnChange} />
                                </Col>
                                <Col xs={24} sm={24} md={24} lg={12} xl={6} xxl={3}>
                                    <Button type="primary" style={{ margin: '5px' }} onClick={this.Search}>查询</Button>
                                </Col>
                            </Row>
                        </div>
                    }
                >
                    {this.loaddata()}


                </Card>
            </div >
        );
    }
}
export default Dispatchreport;
