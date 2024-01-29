/*
 * @Author: jab
 * @Date: 2024-01-29
 * @Description：待核查任务 已核查任务
 */

import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Form, Card, Spin, Button, Space, Select, Badge, Tooltip, Input, Radio, Modal, Row, message, Popover, Table, Collapse, Cascader, Upload, Col,Tabs, } from 'antd';
import styles from '../../../styles.less';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import SdlTable from '@/components/SdlTable';
import moment from 'moment';
import { DetailIcon } from '@/utils/icon';
import { router } from 'umi';
import { PlusOutlined, RollbackOutlined } from '@ant-design/icons';
import Cookie from 'js-cookie';

import { API } from '@config/API';


const textStyle = {
    width: '100%',
    display: 'inline-block',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
};

const dvaPropsData = ({ loading, AbnormalIdentifyModel }) => ({
    verificationTaskData: AbnormalIdentifyModel.verificationTaskData,
    queryLoading: loading.effects['AbnormalIdentifyModel/GetWaitCheckDatas'],

});

const Index = props => {
    const [form] = Form.useForm();


    const {
        dispatch,
        queryLoading,
        verificationTaskData,
        history,
    } = props;
    let id = history?.location?.query?.id
    const [dataSource, setDataSource] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        props.dispatch({
            type: 'AbnormalIdentifyModel/updateState',
            payload: { verificationTaskData: { ...verificationTaskData, type: 2 } },
          });
        // onFinish(pageIndex, pageSize);
    }, []);



    const getColumns = () => {
        return [
            {
                title: '编号',
                dataIndex: 'index',
                key: 'index',
                width: 80,
                ellipsis: true,
                render: (text, record, index) => {
                    return (
                        (pageIndex - 1) * pageSize + index + 1
                    );
                },
            },
            {
                title: '企业',
                dataIndex: 'EntName',
                key: 'EntName',
                width: 200,
                ellipsis: true,
            },
            {
                title: '排口',
                dataIndex: 'PointName',
                key: 'PointName',
                width: 200,
                ellipsis: true,
            },
            {
                title: '行业',
                dataIndex: 'Industry',
                key: 'Industry',
                width: 120,
                ellipsis: true,
            },
            {
                title: '发现线索时间',
                dataIndex: 'ClueTime',
                key: 'ClueTime',
                width: 180,
                ellipsis: true,
            },
            {
                title: '场景类别',
                dataIndex: 'WarningName',
                key: 'WarningName',
                width: 180,
                ellipsis: true,
            },
            {
                title: '线索内容',
                dataIndex: 'WarningContent',
                key: 'WarningContent',
                width: 240,
                ellipsis: true,
                render: (text, record) => {
                    return (
                        <Tooltip title={text}>
                            <span style={textStyle}>{text}</span>
                        </Tooltip>
                    );
                },
            },
            {
                title: '操作',
                key: 'handle',
                width: 100,
                render: (text, record) => {
                    return (
                        <Tooltip title="查看">
                            <a
                                onClick={e => {
                                    let scrollTop = 0;
                                    let el = document.querySelector('.ant-table-body');
                                    el ? (scrollTop = el.scrollTop) : '';
                                    props.dispatch({
                                        type: 'AbnormalIdentifyModel/updateState',
                                        payload: {
                                            generateVerificationTakeData: {
                                                ...generateVerificationTakeData,
                                                scrollTop: scrollTop,
                                            },
                                        },
                                    });
                                    const data = { type: 2 }
                                    router.push(
                                        `/AbnormalIdentifyModel/ClueAnalysis/GenerateVerificationTake/Detail?data=${data}`
                                    );
                                }}
                            >
                                <DetailIcon />
                            </a>
                        </Tooltip>
                    );
                },
            },
        ];
    };


    // 查询数据
    const onFinish = (pageIndex, pageSize) => {
        const values = form.getFieldsValue();
        props.dispatch({
            type: 'AbnormalIdentifyModel/GetWaitCheckDatas',
            payload: {
                ...values,
                date: undefined,
                beginTime: values.date ? values.date[0].format('YYYY-MM-DD HH:mm:ss') : undefined,
                endTime: values.date ? values.date[1].format('YYYY-MM-DD HH:mm:ss') : undefined,
                pageIndex: pageIndex,
                pageSize: pageSize
            },
            callback: res => {
                setDataSource(res.Datas);
                setTotal(res.Total);
                // 设置滚动条高度，定位到点击详情的行号
                // let currentForm = warningForm[modelNumber];
                // let el = document.querySelector(`[data-row-key="rowKey"]`);
                // let tableBody = document.querySelector('.ant-table-body');
                // console.log('el', el);
                // if (tableBody) {
                //   el ? (tableBody.scrollTop = currentForm.scrollTop) : (tableBody.scrollTop = 0);
                // }
            },
        });
    };


    // 分页
    const onTableChange = (current, pageSize) => {
        props.dispatch({
            type: 'AbnormalIdentifyModel/updateState',
            payload: {
                generateVerificationTakeData: {
                    ...generateVerificationTakeData,
                    pageSize: pageSize,
                    pageIndex: current,
                    scrollTop: 0,
                },
            },
        });
        onFinish(current, pageSize);
    };


    return (<div className={styles.verificationTaskDetailWrapper}>
        <BreadcrumbWrapper>
            <Card style={{ paddingBottom: 24 }}>
                <Row align='middle'>
                    <span style={{ fontSize: 18, fontWeight: 'bold' }}><img width='28' height='28' src='/programme.png' style={{ marginRight: 12 }} />方案：{'XXX核查方案'}</span>
                    <Button style={{ marginLeft: 16 }} onClick={() => {
                        history.go(-1);
                    }} ><RollbackOutlined />返回上级</Button>
                </Row>
                <Form style={{ paddingLeft: 40, paddingTop: 12 }}>
                    <Row>

                        <Form.Item label="创建人" style={{ paddingRight: 188 }}>
                        </Form.Item>

                        <Form.Item label="企业" >

                        </Form.Item>

                    </Row>
                    <Row>
                        <Form.Item label="创建时间" style={{ paddingRight: 188 }}>

                        </Form.Item>
                        <Form.Item label="排口">

                        </Form.Item>
                    </Row>
                    <Row>
                        <Form.Item label="是否核查" style={{ paddingRight: 188 }}>
                            <Space>
                            </Space>
                        </Form.Item>
                        <Form.Item label="场景类型">
                            <Space>
                            </Space>
                        </Form.Item>
                    </Row>
                    <div style={{ position: 'absolute', top: 80, right: 60, textAlign: 'right' }}>
                        <div>状态</div>
                        <div style={{ fontSize: 18 }}>待核查</div>
                    </div>
                </Form>

            </Card>
            <Tabs>
                <Tabs.TabPane tab={'详情'} key={1}>
                <Card
                title={<span style={{ fontWeight: 'bold' }}>线索详情</span>}
            >
                <SdlTable
                    rowKey={(record, index) => `${index}`}
                    align="center"
                    columns={getColumns()}
                    dataSource={dataSource}
                    loading={queryLoading}
                    scroll={{ y: 'calc(100vh - 410px)' }}
                    pagination={false}

                />
            </Card>
            <Card
                title={<span style={{ fontWeight: 'bold' }}>方案及核查信息</span>}
                style={{ marginTop: 8 }}
            >
            </Card>
                </Tabs.TabPane>

            </Tabs>

        </BreadcrumbWrapper>
    </div>
    );
};

export default connect(dvaPropsData)(Index);
