/**
 * 功能：分析平台报告
 * 创建人：jab
 * 创建时间：2022.11
 */
import React, { useState, useEffect, Fragment, useRef, useMemo } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Popover, Radio } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, RollbackOutlined } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import RangePicker_ from '@/components/RangePicker/NewRangePicker'
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import ReactEcharts from 'echarts-for-react';
import PageLoading from '@/components/PageLoading'
import moment from 'moment'
import { Item } from 'gg-editor';

const { Option } = Select;

const namespace = 'dataquery'




const dvaPropsData = ({ loading, newestHome }) => ({
    exportloading: loading.effects['dataquery/exportNetworkingRateForPoint'],
})

const dvaDispatch = (dispatch) => {
    return {
        updateState: (payload) => { //更新参数
            dispatch({
                type: `${namespace}/updateState`,
                payload: { ...payload },
            })
        },
        updateState: (payload) => { //导出
            dispatch({
                type: `${namespace}/updateState`,
                payload: { ...payload },
            })
        },
    }
}
const Index = (props) => {


    const [form] = Form.useForm();



    const { exportloading,} = props;

    useEffect(() => {
    }, []);





    const exports = () => {

    }









    return (
        <BreadcrumbWrapper>
            <Card>
                <Form layout="inline"  form={form} initialValues={{time:moment()}}>
                    <Form.Item name='time'>
                        <DatePicker picker="month" allowClear={false}/>
                    </Form.Item>
                    <Form.Item>
                        <Button
                            icon={<ExportOutlined />}
                            onClick={exports}
                            loading={exportloading}
                        >
                            导出
                </Button>
                    </Form.Item>
                </Form>
            </Card>
        </BreadcrumbWrapper>

    );
};
export default connect(dvaPropsData, dvaDispatch)(Index);