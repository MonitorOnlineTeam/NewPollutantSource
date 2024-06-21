/**
 * 功  能：异常买模型识别 模型库管理  数据接入
 * 创建人：jab
 * 创建时间：2024.06
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Spin, Form, Typography, Badge, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker } from 'antd';
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
import styles from "../../styles.less"
import Cookie from 'js-cookie';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
const { Option } = Select;

const namespace = 'ModelBaseManage'


const dvaPropsData = ({ loading, ModelBaseManage, global, }) => ({
    tableDatas: ModelBaseManage.dataAccessDatas,
    tableTotal: ModelBaseManage.dataAccessTotal,
    tableLoading: loading.effects[`${namespace}/ExportCarList`],
    configInfo: global.configInfo,
    exportLoading: loading.effects[`${namespace}/ExportCarList`],
})


const Index = (props) => {



    const [form] = Form.useForm();





    const { tableDatas, tableLoading, } = props;



    useEffect(() => {
        handleChange();

    }, []);

    let columns = (title) => [
        {
            title: '参数类型',
            dataIndex: 'CarNum',
            key: 'CarNum',
            align: 'center',
            width: 140,
            ellipsis: true,
        },
        {
            title: '清洗成功',
            dataIndex: 'VehicleType',
            key: 'VehicleType',
            align: 'center',
            width: 120,
            ellipsis: true,
        },
        {
            title: '清洗异常',
            dataIndex: 'BuyDate',
            key: 'BuyDate',
            align: 'center',
            width: 120,
            ellipsis: true,
            render: (text, record) => {
                return text > 0 ? <span className='red' onClick={() => logQuery(record, title)}>{text}</span> : <span style={{ cursor: 'pointer' }} className='red' onClick={() => logQuery(record, title)}>11111</span>
            }
        },
        {
            title: '备注',
            dataIndex: 'Status',
            key: 'Status',
            align: 'center',
            ellipsis: true,
            render: (text, record) => {
                const textArr = text?.spllt(',')
                return textArr ? <>  {textArr[0]&&<Button type='primary'>{textArr[0]}</Button>}    {textArr[1]&&<Button  type='primary'>{textArr[1]}</Button>}</> : text
            }
        },
    ];
    let columns2 = [
        {
            title: '企业',
            dataIndex: 'CarNum',
            key: 'CarNum',
            align: 'center',
            ellipsis: true,
        },
        {
            title: '排放口',
            dataIndex: 'VehicleType',
            key: 'VehicleType',
            align: 'center',
            ellipsis: true,
        },
        {
            title: '数据缺失率',
            dataIndex: 'BuyDate',
            key: 'BuyDate',
            align: 'center',
            ellipsis: true,
        },
        {
            title: '缺失数据',
            dataIndex: 'Status',
            key: 'Status',
            align: 'center',
            ellipsis: true,
        },
        {
            title: '应传数据',
            dataIndex: 'Status',
            key: 'Status',
            align: 'center',
            ellipsis: true,
        },
    ];
    const logCommonCol = [
        {
            title: '企业',
            dataIndex: 'CarNum',
            key: 'CarNum',
            align: 'center',
            ellipsis: true,
        },
        {
            title: '排放口',
            dataIndex: 'VehicleType',
            key: 'VehicleType',
            align: 'center',
            ellipsis: true,
        },
        {
            title: '参数',
            dataIndex: 'VehicleType',
            key: 'VehicleType',
            align: 'center',
            ellipsis: true,
        },
        {
            title: '原始数据',
            dataIndex: 'CarNum',
            key: 'CarNum',
            align: 'center',
            ellipsis: true,
        },
        {
            title: '清洗数据',
            dataIndex: 'CarNum',
            key: 'CarNum',
            align: 'center',
            ellipsis: true,
        },
        {
            title: '备注',
            dataIndex: 'CarNum',
            key: 'CarNum',
            align: 'center',
            ellipsis: true,
            
        },
    ]
  
    const [logVisible, setLogVisible] = useState(false)
    const [logTitle, setLogTitle] = useState()

    const logQuery = (record, title) => {
        setLogVisible(true)
        setLogTitle(title)
    }

    const missingDataChange = (value) => {
        console.log(value)
    }
    const handleChange = (values) => {  //查询

        props.dispatch({
            type: `${namespace}/GetAuditPhoto`,
            payload: { values },
        });
    }

    const typeStyle = { background: '#fafafa', padding: 4, borderRadius: 4, marginRight: 4 }
    const TitleComponents = ({ title, time, numData }) => {
        return <>
            <Row align='middle' justify='space-between'>
                <div style={{ fontSize: 18, fontWeight: 'bold' }}>{title}</div>
                <div>最近清洗时间：{time}</div>
            </Row>
            <Row style={{ margin: '8px 0' }}>
                {
                    numData.map(item => <div style={{ ...typeStyle }} >{item.label} <span style={{ color: item.label === '清洗失败' || item.label === '非法' ? '#f5222d' : '#d4ab32', fontWeight: 'bold', paddingLeft: 12 }}>{item.value}</span></div>)
                }
            </Row>
        </>
    }

    const searchComponents = () => {
        return <Form
            form={form}
            name="advanced_search"
            className={'ant-advanced-search-form'}
            layout='inline'
        >
            <Form.Item label='选择项目'>
                <Select
                    defaultValue="lucy"
                    style={{ width: 200 }}
                    onChange={handleChange}
                    placeholder='内蒙数据同步'
                    allowClear
                    options={[
                        {
                            value: '1',
                            label: 'Not Identified',
                        },
                        {
                            value: '2',
                            label: 'Closed',
                        },
                    ]}
                />
            </Form.Item>
        </Form>
    }
    const obj1 = {
        '企业信息清洗': { time: '2024-06-17 13:13:00', numData: [{ label: '清洗企业数量', value: 198 }, { label: '入库数量', value: 198 }], data: [1],logTitle:'企业日志' },
        '备案参数': { time: '2024-06-17 13:13:00', numData: [{ label: '清洗企业数量', value: 198 }, { label: '入库备案参数', value: 198 }, { label: '清洗失败', value: 98 }], data: [],logTitle:'排放口/备案参数日志'  },
        '监测数据': { time: '2024-06-17 13:13:00', numData: [{ label: '清洗数据', value: 198 }, { label: '非法', value: 198 }], data: [] },
    }
    const obj2 = {
        '排放口信息清洗': { time: '2024-06-17 13:13:00', numData: [{ label: '清洗排放口数量', value: 198 }, { label: '入库排放口数量', value: 198 }], data: [],logTitle:'排放口/备案参数日志' },
        '污染物': { time: '2024-06-17 13:13:00', numData: [{ label: '清洗排放口数量', value: 198 }, { label: '入库污染物数量', value: 198 }, { label: '清洗失败', value: 98 }], data: [],logTitle:'污染物缺失/排放标准缺失' },
        '排放标准': { time: '2024-06-17 13:13:00', numData: [{ label: '清洗排放标准数量', value: 198 }, { label: '入库排放标准', value: 198 }, { label: '清洗失败', value: 98 }], data: [],logTitle:'污染物缺失/排放标准缺失' },
    }
    const dischargeOutletType = [
        { label: '废气排放口', value: 80 }, { label: '废气非排放口', value: 80 }, { label: '废水排放口', value: 80 },
        { label: '废水非排放口', value: 80 }, { label: '常规焚烧炉CEMS排放口', value: 80 }, { label: '关联排放口', value: 80 },
    ]
    const logObj = {
        '企业日志': { columns:logCommonCol.filter(item=>item.title!='排放口'),data:[] },
        '排放口/备案参数日志': { columns:logCommonCol, data:[] },
        '污染物缺失/排放标准缺失': {  columns:logCommonCol.filter(item=>item.title=='企业' || item.title=='排放口'),data:[] },
    }

    return (
        <div className={`${styles.dataCleaningSty}`}>
            <BreadcrumbWrapper >
                <Card className='queryCriterTitleSty' bodyStyle={{ padding: '8px 24px' }}>{searchComponents()}</Card>
                <Row style={{ marginTop: 12, height: 'calc(100vh - 180px)', overflowY: 'auto' }}>
                    <Col span={12} style={{ paddingRight: 6 }}>
                        {
                            Object.keys(obj1).map(item => {
                                return <Card style={{ marginBottom: 12 }}>
                                    <TitleComponents title={item} time={obj1[item].time} numData={obj1[item].numData} />
                                    {item == '监测数据' && <Row align='middle' style={{ marginBottom: 8 }}><div style={{ paddingRight: 12 }}>数据缺失超过<span><InputNumber style={{ width: 80, margin: '0 4px' }} defaultValue={80} onChange={missingDataChange} />%</span></div> <div>排放口统计<span>{120}%</span></div></Row>}
                                    <SdlTable
                                        loading={tableLoading}
                                        bordered
                                        dataSource={obj1[item].data}
                                        columns={item == '监测数据' ? columns2 : columns(obj1[item].logTitle)}
                                        scroll={{ y: 'hidden' }}
                                        rowClassName={null}
                                        pagination={false}
                                    />
                                </Card>
                            })
                        }
                    </Col>
                    <Col span={12} style={{ paddingLeft: 6 }}>
                        {
                            Object.keys(obj2).map(item => {
                                return <Card style={{ marginBottom: 12 }}>
                                    <TitleComponents title={item} time={obj2[item].time} numData={obj2[item].numData} />
                                    {item == '排放口信息清洗' &&
                                        <Row style={{ marginBottom: 8 }}>
                                            {dischargeOutletType.map(item => {
                                                return <div style={{ ...typeStyle, textAlign: 'center' }}>
                                                    <div><Badge color="#fa8c16" text={item.value} /></div>
                                                    <div>{item.label}</div>
                                                </div>
                                            })}

                                        </Row>


                                    }
                                    <SdlTable
                                        loading={tableLoading}
                                        bordered
                                        dataSource={obj2[item].data}
                                        columns={columns(item)}
                                        scroll={{ y: 'hidden' }}
                                        rowClassName={null}
                                        pagination={false}
                                    />
                                </Card>
                            })
                        }
                    </Col>
                </Row>
                <Modal
                    visible={logVisible}
                    title={logTitle}
                    onCancel={() => { setLogVisible(false) }}
                    destroyOnClose
                    footer={null}
                    width={700}
                >
                    <SdlTable
                        loading={tableLoading}
                        bordered
                        dataSource={logObj[logTitle]?.data}
                        columns={logObj[logTitle]?.columns}
                        scroll={{ y: 'hidden' }}
                        rowClassName={null}
                        pagination={false}
                    />
                </Modal>
            </BreadcrumbWrapper>
        </div>
    );
};
export default connect(dvaPropsData)(Index);