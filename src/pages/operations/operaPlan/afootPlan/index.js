/**
 * 功  能：预测性维护 运维计划  进行中计划
 * 创建人：jab
 * 创建时间：2024.04
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Spin, Form, Popover, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Space, Radio } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, ProfileOutlined, AmazonCircleFilled, } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import SdlCascader from '@/pages/AutoFormManager/SdlCascader'
import styles from "../styles.less"
import Cookie from 'js-cookie';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import CheckPhoto from '@/components/CheckPhoto';
import { permissionButton } from '@/utils/utils';

const { Option } = Select;

const namespace = 'operaPlan'




const dvaPropsData = ({ loading, operaPlan, global, }) => ({
    tableLoading: loading.effects[`${namespace}/GetAuditPhoto`],
    tableDatas: operaPlan.tableDatas,
    tableTotal: operaPlan.tableTotal,
    queryPar: operaPlan.queryPar,
    exportLoading: loading.effects[`${namespace}/GetAuditPhoto`],
    configInfo: global.configInfo,
})

const Index = (props) => {



    const [form] = Form.useForm();






    const { queryPar, tableDatas, tableTotal, tableLoading, exportLoading } = props;





    useEffect(() => {
        onFinish(pageIndex, pageSize);

    }, []);



    const columns = [
        {
            title: '序号',
            ellipsis: true,
            render: (text, record, index) => {
                return (index + 1) + (pageIndex - 1) * pageSize;
            }
        },
        {
            title: '计划编号',
            dataIndex: 'projectCode',
            key: 'projectCode',
            ellipsis: true,
        },
        {
            title: '合同编号',
            dataIndex: 'projectCode',
            key: 'projectCode',
            ellipsis: true,
        },
        {
            title: '合同名称',
            dataIndex: 'projectName',
            key: 'projectName',
            ellipsis: true,
        },
        {
            title: '污染源企业',
            dataIndex: 'remark',
            key: 'remark',
            width: 150,
            ellipsis: true,
        },
        {
            title: '运维单位',
            dataIndex: 'dd',
            key: 'dd',
            width: 90,
            ellipsis: true,
        },
        {
            title: '点位类别',
            dataIndex: 'problemStatusName',
            key: 'problemStatusName',
            ellipsis: true,
        },
        {
            title: '计划起始日期',
            dataIndex: 'solveUserName',
            key: 'solveUserName',
            ellipsis: true,
        },
        {
            title: '计划结束日期',
            dataIndex: 'problemTime',
            key: 'problemTime',
            ellipsis: true,
        },
        {
            title: '备注',
            dataIndex: 'problemTime',
            key: 'problemTime',
            ellipsis: true,
        },
        {
            title: '状态',
            dataIndex: 'dd',
            key: 'dd',
            ellipsis: true,
        },
        {
            title: '创建人',
            dataIndex: 'createUserName',
            key: 'createUserName',
            ellipsis: true,
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            ellipsis: true,
        },
        {
            title: '提交人',
            dataIndex: 'createUserName',
            key: 'createUserName',
            ellipsis: true,
        },
        {
            title: '操作',
            fixed: 'right',
            width: 160,
            ellipsis: true,
            render: (text, record, index) => {
                return (
                    <Fragment>
                        <Space>
                        <a onClick={() => { detail(record) }}> 编辑计划</a>
                        <Popconfirm title="确认要删除这条计划吗?" onConfirm={() => { }} > <a onClick={() => { detail(record) }}> 删除计划</a></Popconfirm>
                        <a onClick={() => { detail(record) }}> 查看计划</a>
                        {record.status==1?
                        <a onClick={() => { detail(record) }}> 暂停计划</a>
                        :
                        <a onClick={() => { detail(record) }}> 开启计划</a>
                         }
                        <a onClick={() => { detail(record) }}> 完结计划</a>
                        <a onClick={() => { detail(record) }}> 异常终止</a>
                        </Space>
                    </Fragment>
                );

            }
        },
    ];



    const [detailVisible, setDetailVisible] = useState(false)
    const [detailData, setDetailData] = useState({})

    const detail = (record) => {
        setDetailVisible(true)
        setDetailData(record)
    }
    const exportData = () => {
        props.dispatch({
            type: `${namespace}/ExportQuestionList`,
            payload: queryPar,
        });
    };


    const onFinish = async (PageIndex, PageSize, queryPar) => {  //查询

        try {
            const values = await form.validateFields();
            const par = queryPar ? { ...queryPar, PageIndex: PageIndex, PageSize: PageSize, } : {
                ...values,
                beginTime: values.time && moment(values.time[0]).format('YYYY-MM-DD 00:00:00'),
                endTime: values.time && moment(values.time[1]).format('YYYY-MM-DD 23:59:59'),
                time: undefined,
                pageIndex: PageIndex,
                pageSize: PageSize,
            }
            props.dispatch({
                type: `${namespace}/GetQuestionList`,
                payload: {
                    ...par,
                },

            });
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    }
    const [pageIndex, setPageIndex] = useState(1)
    const [pageSize, setPageSize] = useState(20)
    const handleTableChange = async (PageIndex, PageSize) => { //分页
        setPageSize(PageSize)
        setPageIndex(PageIndex)
        onFinish(PageIndex, PageSize, queryPar)
    }




    const searchComponents = () => {

        const resetData = () => { setPageIndex(1); setPageSize(20); onFinish(1, 20) }
        return <Form
            form={form}
            name="advanced_search"
            className={'ant-advanced-search-form'}
            onFinish={() => { resetData() }}
        >
            <Row align='middle'>
                <Col span={8}>
                    <Form.Item name='projectCode' label='合同编号' >
                        <Input placeholder="请输入" allowClear />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name='projectName' label='运维单位' className='form_label_width_97'>
                        <Input placeholder="请输入" allowClear />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name='itemCode' label='污染源企业'>
                        <Input placeholder="请输入" allowClear />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name='itemCode' label='点位类型'>
                        <Radio.Group>
                            <Radio value={''}>全部</Radio>
                            <Radio value={1}>废气</Radio>
                            <Radio value={2}>废水</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name='time' label='计划起止日期'>
                        <RangePicker_ style={{ width: '100%' }} format="YYYY-MM-DD" />
                    </Form.Item>
                </Col>
                <Col span={8} >
                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit" loading={tableLoading}>
                                查询
           </Button>
                            <Button loading={tableLoading} onClick={() => { form.resetFields(); resetData() }}  >
                                重置
         </Button>
                            <Button icon={<ExportOutlined />} loading={exportLoading} onClick={() => { exportData() }}>
                                导出
         </Button>
                        </Space>
                    </Form.Item>

                </Col>
            </Row>
        </Form>
    }

    return (
        <div className={`queryCriterTitleSty ${styles.formulateOperaTaskSty}`}>
            <BreadcrumbWrapper>
                <Card title={searchComponents()}>
                    <SdlTable
                        resizable
                        loading={tableLoading}
                        bordered
                        dataSource={tableDatas}
                        columns={columns}
                        align='center'
                        pagination={{
                            total: tableTotal,
                            pageSize: pageSize,
                            current: pageIndex,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            onChange: handleTableChange,
                        }}
                    />
                </Card>
                <Modal
                    visible={detailVisible}
                    title={'部件更换详情'}
                    onCancel={() => { setDetailVisible(false) }}
                    destroyOnClose
                    wrapClassName={`spreadOverModal detailModalFormTextSty ${styles.detailModalSty}`}
                    mask={false}
                    footer={null}
                >
                </Modal>
            </BreadcrumbWrapper>
        </div>
    );
};
export default connect(dvaPropsData)(Index);