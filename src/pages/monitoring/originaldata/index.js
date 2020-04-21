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
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import SdlTable from '@/components/SdlTable';
import styles from './index.less';
import NavigationTree from '@/components/NavigationTree'
import RangePicker_ from '@/components/RangePicker/NewRangePicker'

@connect(({ loading, originalData }) => ({
    loading: loading.effects['originalData/getOriginalData'],
    tableDatas: originalData.tableDatas,
    total: originalData.total,
    pageIndex: originalData.pageIndex,
    pageSize: originalData.pageSize,
    dgimn:originalData.dgimn
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
        // const {
        //     dispatch,
        // } = this.props;

        // dispatch({
        //     type: 'originalData/updateState',
        //     payload: {
        //         dgimn: "51052216080301",
        //     },
        // })
        // dispatch({
        //     type: 'originalData/getOriginalData',
        //     payload: {},
        // });
    }

    /** 切换时间 */
    _handleDateChange = (date, dateString) => {
        if (date) {
            this.props.dispatch({
                type: 'originalData/updateState',
                payload: {
                    beginTime: date[0]? date[0].format('YYYY-MM-DD HH:mm:ss'):null,
                    endTime:  date[1]? date[1].format('YYYY-MM-DD HH:mm:ss'):null
                },
            });
            this.setState({
                rangeDate: date,
            });
            if(this.props.dgimn)
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
                pageIndex: 1,
                pageSize: 20,
                total: 0,
            },
        })
        setTimeout(() => {
            this.reloaddatalist();
        }, 0);
    }

    // 分页页数change
    onTableChange(current, pageSize) {
        this.props.dispatch({
            type: 'originalData/updateState',
            payload: {
                pageIndex: current,
                pageSize,
            },
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
                width: '18%',
                align: 'center',
            },
            {
                title: '原始数据包值',
                dataIndex: 'OriginalValue',
                key: 'OriginalValue',
                width: '80%',
                align: 'left',
            },
        ];

        return (<SdlTable
            rowKey={(record, index) => `complete${index}`}
            dataSource={tableDatas}
            columns={columns}
            loading={loading}
        //    scroll={{ y: 'calc(100vh - 410px)' }}
            pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                pageSize,
                current: pageIndex,
                onChange: this.onTableChange,
                onShowSizeChange: this.onTableChange,
                pageSizeOptions: ['10', '20', '30', '40'],
                total,
            }}
        />);
    }

    render() {
        return (
            <div id="originaldata">
                <BreadcrumbWrapper>
                    <div className={styles.cardTitle}>
                        <NavigationTree domId="#originaldata" choice={false} onItemClick={value => {
                            if (value.length > 0 && !value[0].IsEnt) {
                                this.changeDgimn(value[0].key)
                            }
                        }} />
                        <Card
                            extra={
                                <div>
                                    <RangePicker_ style={{ width: 350, textAlign: 'left', marginRight: 10 }} 
                                     dateValue={this.state.rangeDate} format={this.state.format}
                                     callback={this._handleDateChange}
                                 //    onChange={this._handleDateChange} 
                                     showTime={this.state.format}/>
                                </div>
                            }
                            className="contentContainer"
                            style={{ width: '100%' }}
                        >
                            {this.loaddata()}
                        </Card>
                    </div>
                </BreadcrumbWrapper>
            </div>
        );
    }
}
export default Index;
