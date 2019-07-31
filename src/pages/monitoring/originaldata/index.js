/*
 * @desc: 原始数据包
 * @Author: JianWei
 * @Date: 2019.07.31
 */

import React, { Component, Fragment } from 'react';
import moment from 'moment';
import ReactEcharts from 'echarts-for-react';
import {
    Button,
    Input,
    Card,
    Row,
    Col,
    Table,
    Form,
    Spin,
    Tooltip,
    Select, Modal, Tag, Divider, Dropdown, Icon, Menu, Popconfirm, message, Empty, Switch,
} from 'antd';
import { PointIcon } from '@/utils/icon'
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SdlTable from '@/components/SdlTable';
import styles from './index.less';
import NavigationTree from '@/components/NavigationTree'
import RangePicker_ from '@/components/RangePicker'

@connect(({ loading, originalData }) => ({
    loading: loading.effects['originalData/getOriginalData'],
    tableDatas: originalData.tableDatas,
    total: originalData.total,
    pageIndex: originalData.pageIndex,
    pageSize: originalData.pageSize
}))

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rangeDate: [moment().startOf('day'), moment(new Date())],
            format: 'YYYY-MM-DD HH:mm:ss',
        };
        this.onTableChange = this.onTableChange.bind(this);
    }

    /** 初始化加载 */
    componentDidMount() {
        const {
            dispatch,
        } = this.props;

        dispatch({
            type: 'originalData/updateState',
            payload: {
                dgimn: "51052216080301",
            },
        })
        dispatch({
            type: 'originalData/getOriginalData',
            payload: {},
        });
    }

    /** 切换时间 */
    _handleDateChange = (date, dateString) => {
        if (date) {
            this.props.dispatch({
                type: 'originalData/updateState',
                payload: {
                    beginTime: dateString[0],
                    endTime: dateString[1]
                }
            });
            this.setState({
                rangeDate: date
            });
            setTimeout(() => {
                this.reloaddatalist();
            }, 0);
        }
    };

    /** 后台请求数据 */
    reloaddatalist = e => {
        const {
            dispatch,
        } = this.props;

        dispatch({
            type: 'originalData/getOriginalData',
            payload: {},
        });
    }

    /** 切换排口 */
    changeDgimn = dgimn => {
        const {
            dispatch,
        } = this.props;
        
        dispatch({
            type: 'originalData/updateState',
            payload: {
                dgimn,
                pageIndex:1,
                pageSize:10,
                total:0
            },
        })
        setTimeout(() => {
            this.reloaddatalist();
        }, 0);
    }
    // 分页页数change
    onTableChange(current, pageSize) {
        debugger
        this.props.dispatch({
            type: 'originalData/updateState',
            payload: {
                pageIndex: current,
                pageSize: pageSize
            }
        });
        setTimeout(() => {
            this.reloaddatalist();
        }, 0);
    }
    /** 渲染数据展示 */

    loaddata = () => {
        const { loading, tableDatas, total, pageSize, pageIndex } = this.props;

        const columns = [
            {
                title: '发送时间',
                dataIndex: 'SendTime',
                key: 'SendTime',
                width: '15%',
                align: 'center'
            },
            {
                title: '原始数据包值',
                dataIndex: 'OriginalValue',
                key: 'OriginalValue',
                width: '80%',
                align: 'left'
            }
        ];

        return (<SdlTable
            rowKey={(record, index) => `complete${index}`}
            dataSource={tableDatas}
            columns={columns}
            loading={loading}
            scroll={{ y: 'calc(100vh - 410px)' }}
            pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                pageSize: pageSize,
                current: pageIndex,
                onChange: this.onTableChange,
                onShowSizeChange: this.onTableChange,
                pageSizeOptions: ['10', '20', '30', '40'],
                total: total
            }}
        />);
    }

    render() {
        return (
            <div id="alarmrecord">
                <PageHeaderWrapper>
                    <div className={styles.cardTitle}>
                        <NavigationTree domId="#alarmrecord" choice={false} onItemClick={value => {
                            if (value.length > 0 && !value[0].IsEnt) {
                                this.changeDgimn(value[0].key)
                            }
                        }} />
                        <Card
                            extra={
                                <div>
                                    <RangePicker_ style={{ width: 350, textAlign: 'left', marginRight: 10 }} dateValue={this.state.rangeDate} format={this.state.formats} onChange={this._handleDateChange} />
                                </div>
                            }
                            style={{ width: '100%', height: 'calc(100vh - 230px)' }}
                        >
                            {this.loaddata()}
                        </Card>
                    </div>
                </PageHeaderWrapper>
            </div>
        );
    }
}
export default Index;
