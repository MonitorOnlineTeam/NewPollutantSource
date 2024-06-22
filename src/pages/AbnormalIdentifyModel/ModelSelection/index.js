/**
 * 功  能：异常买模型识别 模型库管理  模型选配
 * 创建人：jab
 * 创建时间：2024.06
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Badge, Spin, Form, Radio, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, ProfileOutlined, CaretDownOutlined, } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import EntAtmoList from '@/components/EntAtmoList';
import SdlCascader from '@/pages/AutoFormManager/SdlCascader'
import styles from "../../styles.less"
import Cookie from 'js-cookie';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
const { Option } = Select;

const namespace = 'ModelBaseManage'


const dvaPropsData = ({ loading, ModelBaseManage, global, }) => ({
    pointListLoading: loading.effects['common/getPointByEntCode'],
    tableDatas: ModelBaseManage.dataAccessDatas,
    tableLoading: loading.effects[`${namespace}/ExportCarList`],
    configInfo: global.configInfo,

})


const Index = (props) => {



    const [form] = Form.useForm();
    const [form2] = Form.useForm();





    const { tableDatas, tableLoading, } = props;



    useEffect(() => {
        handleChange();

    }, []);

    let columns = [
        {
            title: '项目名称',
            dataIndex: 'CarNum',
            key: 'CarNum',
            align: 'center',
            ellipsis: true,
        },
        {
            title: '任务名称',
            dataIndex: 'VehicleType',
            key: 'VehicleType',
            align: 'center',
            ellipsis: true,
        },
        {
            title: '接入方式',
            dataIndex: 'BuyDate',
            key: 'BuyDate',
            align: 'center',
            ellipsis: true,
        },
        {
            title: '执行方式',
            dataIndex: 'Status',
            key: 'Status',
            align: 'center',
            ellipsis: true,
            width: 140,
            render: (text, record, index) => {
                return <Row justify='center' align='middle' style={{ cursor: 'pointer' }} onClick={() => executionMethod(record)}><div style={{ width: '60px' }}>每周一次</div> <CaretDownOutlined /></Row>
            }
        },
        {
            title: '执行状态',
            dataIndex: 'CarClass',
            key: 'CarClass',
            align: 'center',
            ellipsis: true,
            render: (text, record, index) => {
                const colorObj = {
                    1: '#52c41a',
                    2: '#fa8c16',
                    3: '#f5222d',
                }
                return <Badge color="#f50" text={text} />
            }
        },
        {
            title: '最近接入时间',
            dataIndex: 'AssetStatus',
            key: 'AssetStatus',
            align: 'center',
            ellipsis: true,
        },
        {
            title: '操作',
            align: 'center',
            fixed: 'right',
            width: 100,
            ellipsis: true,
            render: (text, record) => {
                return (record ?
                    <a onClick={() => { setStartExecuVisible(true); setStartExecuTitle(`开始执行（接入小时数据）`) }}>开始执行</a>
                    :
                    <Popconfirm placement="left" title={'确定要开始执行？'} onConfirm={() => startExecuConfirm(1)} okText="开始执行" >
                        <a>开始执行</a>
                    </Popconfirm>
                );

            }
        },
    ];

    // 根据企业获取排口
    const [pointList, setPointList] = useState([]);
    const getPointList = (EntCode, callback) => {
        dispatch({
            type: 'common/getPointByEntCode',
            payload: {
                EntCode,
            },
            callback: res => {
                setPointList(res);
                callback && callback();
            },
        });
    };

    const [executionMethodVisible, setExecutionMethodVisible] = useState(false)
    const [executionMethodTitle, setExecutionMethodTitle] = useState()

    const [row, setRow] = useState({})

    const executionMethod = (record) => {
        setExecutionMethodVisible(true)
        setExecutionMethodTitle('1111')
    }

    const [startExecuVisible, setStartExecuVisible] = useState(false)
    const [startExecuTitle, setStartExecuTitle] = useState('')

    const startExecuConfirm = (type, record) => {
        console.log('开始执行')
    }

    const handleChange = (values) => {  //查询

        props.dispatch({
            type: `${namespace}/GetAuditPhoto`,
            payload: { values },
        });
    }



    const searchComponents = () => {
        return <Form
            form={form}
            name="advanced_search"
            className={'ant-advanced-search-form'}
            layout='inline'
            initialValues={{
                projectType : '1'
            }}
        >
            <Form.Item label='选择项目' name='projectType'>
                <Select
                    style={{ width: 200 }}
                    onChange={handleChange}
                    placeholder='内蒙数据同步'
                    options={[
                        {
                            value: '1',
                            label: '内蒙数据',
                        },
                    ]}
                />
                <Form.Item label="企业" name="entCode">
                    <EntAtmoList
                        style={{ width: 200 }}
                        onChange={value => {
                            if (!value) {
                                form.setFieldsValue({ dgimn: undefined });
                            } else {
                                form.setFieldsValue({ dgimn: undefined });
                                getPointList(value);
                            }
                        }}
                    />
                </Form.Item>
                <Spin spinning={!!pointListLoading} size="small">
                    <Form.Item label="监测点名称" name="dgimn">
                        <Select
                            placeholder="请选择"
                            showSearch
                            allowClear
                            optionFilterProp="children"
                            style={{ width: 150 }}
                        >
                            {pointList.map(item => {
                                return (
                                    <Option key={item.DGIMN} value={item.DGIMN}>
                                        {item.PointName}
                                    </Option>
                                );
                            })}
                        </Select>
                    </Form.Item>
                </Spin>
            </Form.Item>
        </Form>
    }
    return (
        <div className={`${styles.dataAccessSty} queryCriterTitleSty`}>
            <BreadcrumbWrapper >
                <Card title={searchComponents()}>
                    <SdlTable
                        onRow={record => ({
                            onClick: event => { setRow(record) },
                        })
                        }
                        loading={tableLoading}
                        bordered
                        dataSource={tableDatas}
                        columns={columns}
                        pagination={false}
                    />
                </Card>
                <Modal
                    visible={executionMethodVisible}
                    title={executionMethodTitle}
                    onCancel={() => { setExecutionMethodVisible(false); form.resetFields() }}
                    wrapClassName="spreadOverModal"
                    destroyOnClose
                >

                </Modal>
            </BreadcrumbWrapper>
        </div >
    );
};
export default connect(dvaPropsData)(Index);