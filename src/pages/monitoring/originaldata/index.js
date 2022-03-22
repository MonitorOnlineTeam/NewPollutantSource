/*
 * @desc: 原始数据包
 * @Author: JianWei
 * @Date: 2019.07.31
 */

import React, { Component, Fragment } from 'react';
import moment from 'moment';
import ReactEcharts from 'echarts-for-react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
    Button,
    Input,
    Card,
    Row,
    Col,
    Table,
    Spin,
    Tooltip,
    Select,
    Modal,
    Tag,
    Divider,
    Dropdown,
    Menu,
    Popconfirm,
    message,
    Empty,
    Switch,
} from 'antd';
import { PointIcon } from '@/utils/icon'
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'
import styles from './index.less';
import NavigationTree from '@/components/NavigationTree'
import OriginaldataContent from './OriginaldataContent'

@connect(({ loading, originalData }) => ({
}))

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

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

    render() {
        return (
            <div id="originaldata">
                <BreadcrumbWrapper>
                    <div className={styles.cardTitle}>
                        <NavigationTree runState='1' domId="#originaldata" choice={false} onItemClick={value => {
                            console.log('value', value);
                            if (value.length > 0 && !value[0].IsEnt) {
                                this.changeDgimn(value[0].key)
                            }
                        }} />
                        <OriginaldataContent />
                    </div>
                </BreadcrumbWrapper>
            </div>
        );
    }
}
export default Index;
