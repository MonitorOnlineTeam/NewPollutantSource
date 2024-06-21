/**
 * 功  能：异常买模型识别 模型库管理  排放特征学习
 * 创建人：jab
 * 创建时间：2024.06
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Spin, Tabs, Descriptions, Form, Typography, Badge, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker } from 'antd';
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
import ReactEcharts from 'echarts-for-react';

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

    const [echarts1, setEcharts1] = useState();
    const [echarts2, setEcharts2] = useState();

    useEffect(() => {
        handleChange();

    }, []);

    let columns = [
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
                return textArr ? <>  {textArr[0] && <Button type='primary'>{textArr[0]}</Button>}    {textArr[1] && <Button type='primary'>{textArr[1]}</Button>}</> : text
            }
        },
    ];


    const handleChange = (values) => {  //查询

        props.dispatch({
            type: `${namespace}/GetAuditPhoto`,
            payload: { values },
        });
    }

    const TitleComponents = ({ title }) => {
        return <div style={{ display: 'inline-block', fontSize: 18, fontWeight: 'bold', padding: '0 12px 12px 0' }}>{title}</div>
    }
    const getOption = (data) => {
        let echarts = echarts2,
            colors = ['#5abffc', '#58cdfd', 'rgba(36,220,247,.4)'];
        let dataValue = data;
        if (echarts)
            return {
                title: {
                    text: `{v|${dataValue}}{unit|%}`,
                    x: 'center',
                    y: 'center',
                    textStyle: {
                        rich: {
                            v: { fontSize: 22, fontWeight: 'bold', color: colors[1] },
                            unit: { fontSize: 22, fontWeight: 'bold', color: colors[1] },
                        },
                    },
                },
                series: [
                    /** 内心圆 */
                    {
                        //内圆
                        type: 'pie',
                        radius: ['64%', '0%'],
                        center: ['50%', '50%'],
                        z: 1,
                        itemStyle: {
                            normal: {
                                color: new echarts.graphic.RadialGradient(
                                    0.5,
                                    0.5,
                                    0.5,
                                    [
                                        {
                                            offset: 0,
                                            color: 'transparent',
                                        },
                                        {
                                            offset: 0.5,
                                            color: 'transparent',
                                        },
                                        {
                                            offset: 1,
                                            color: 'transparent',
                                        },
                                    ],
                                    false,
                                ),
                                label: {
                                    show: false,
                                },
                                labelLine: {
                                    show: false,
                                },
                            },
                        },
                        hoverAnimation: false,
                        label: {
                            show: false,
                        },
                        tooltip: {
                            show: false,
                        },
                        data: [100],
                        animationType: 'scale',
                    },
                    /** 饼图 */
                    {
                        name: '已完成',
                        type: 'pie',
                        startAngle: 90,
                        z: 0,
                        label: {
                            position: 'center',
                        },
                        radius: ['64%', '52%'],
                        silent: true,
                        animation: false, // 关闭饼图动画
                        data: [
                            {
                                value: dataValue,
                                itemStyle: {
                                    color: {
                                        type: 'linear',
                                        x: 0,
                                        y: 0.2,
                                        x2: 1,
                                        y2: 0,
                                        colorStops: [
                                            { offset: 0, color: colors[0] },
                                            { offset: 1, color: colors[1] },
                                        ],
                                    },
                                },
                            },
                            {
                                name: '未完成',
                                value: 100 - dataValue,
                                label: { show: false },
                                itemStyle: { color: '#f0f2f5' },
                            },
                        ],
                    },
                    /** 饼图上刻度 */
                    {
                        type: 'gauge',
                        center: ['50%', '50%'],
                        // radius: ['56%', '44%'],
                        radius: '86%', // 错位调整此处

                        startAngle: 0,
                        endAngle: 360,
                        splitNumber: 16,
                        axisLine: { show: false },
                        splitLine: {
                            length: 12,
                            // length: '24%',
                            lineStyle: {
                                width: 3,
                                color: '#fff',
                            },
                        },
                        axisTick: { show: false },
                        axisLabel: { show: false },
                    },
                    {
                        type: 'pie',
                        name: '内层细圆环',
                        radius: ['70%', '72%'],
                        hoverAnimation: false,
                        clockWise: false,
                        itemStyle: {
                            normal: {
                                color: colors[2],
                            },
                        },
                        label: {
                            show: false,
                        },
                        data: [100],
                    },
                ],
            };

        return {};
    };
    const getOption2 = () => {

        return {
            colors: ['#5abffc'],
            grid: {
                left: 40,
                right: 0,
                bottom: 20,
                top: 10,
            },
            xAxis: {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                axisTick: { //刻度
                    show: false,
                },
                axisLine: {
                    lineStyle: {
                        color: '#E7E7E7'  // 修改 x 轴的轴线颜色
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: '#333'  // 修改 x 轴刻度文字的颜色
                    }
                },
            },
            yAxis: {
                type: 'value',
                axisTick: {
                    show: false,
                },
                splitLine: { //网格线
                    lineStyle: { //分割线
                        color: "#E7E7E7",
                        width: 1,
                        type: "dashed" //dotted：虚线 solid:实线
                    }
                },
            },

            series: [
                {
                    data: [120, 200, 150, 80, 70, 110, 130],
                    type: 'bar',
                    showBackground: true,
                    backgroundStyle: {
                      color: 'rgba(86, 182, 252, 0.05)',
                    },
                    itemStyle: {
                        color: {
                          x: 0, y: 0, x2: 0, y2: 1,
                          colorStops: [{
                            offset: 0, color: '#5abffc'  // 开始颜色
                          }, {
                            offset: 1, color: '#58cdfd'   // 结束颜色
                          }]
                        },
                      },
                    barMaxWidth: 40,
                    barWidth: '58%',
                }
            ]
        }
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

    return (
        <div className={`${styles.characteristicLearningSty}`}>
            <BreadcrumbWrapper >
                <Card className='queryCriterTitleSty' bodyStyle={{ padding: '8px 24px' }}>{searchComponents()}</Card>
                <Row style={{ marginTop: 12, height: 'calc(100vh - 180px)', overflowY: 'auto' }}>
                    <Col span={6} style={{ paddingRight: 6 }}>
                        <Card style={{ marginBottom: 12 }}>
                            <TitleComponents title='模型训练结果分析' />
                            <ReactEcharts
                                ref={echart => {
                                    echart && setEcharts1(echart.echarts);
                                }}
                                option={getOption(55)}
                                lazyUpdate={true}
                                style={{ height: '180px', width: '100%' }}
                            />
                            <Descriptions column={2}>
                                <Descriptions.Item label="成功训练排口">185</Descriptions.Item>
                                <Descriptions.Item label="失败训练排口">185</Descriptions.Item>
                                <Descriptions.Item label="最近训练时间">Hangzhou, Zhejiang</Descriptions.Item>
                            </Descriptions>
                        </Card>
                    </Col>
                    <Col span={18} style={{ paddingLeft: 6 }}>
                        <Card style={{ marginBottom: 12 }}>
                            <TitleComponents title='模型训练结果详情' />
                            <SdlTable
                                loading={tableLoading}
                                bordered
                                dataSource={[]}
                                columns={columns}
                                scroll={{ y: 'hidden' }}
                                rowClassName={null}
                                pagination={false}
                            />
                        </Card>
                    </Col>
                    {
                        ['波动范围', '振幅范围'].map(item => {
                            return <Col span={24}>
                                <Card style={{ marginBottom: 12 }}>
                                    <TitleComponents title={item} />
                                    <Tabs
                                        type='card'
                                        defaultActiveKey="1"
                                        size='small'
                                        items={new Array(3).fill(null).map((_, i) => {
                                            const id = String(i + 1);
                                            return {
                                                label: `Tab ${id}`,
                                                key: id,
                                                children:
                                                    <ReactEcharts
                                                        ref={echart => {
                                                            echart && setEcharts2(echart.echarts);
                                                        }}
                                                        option={getOption2()}
                                                        lazyUpdate={true}
                                                        style={{ height: '180px', width: '100%' }}
                                                    />,
                                            };
                                        })}
                                    />
                                </Card>
                            </Col>
                        })
                    }
                </Row>
                {/* <Modal
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
                </Modal> */}
            </BreadcrumbWrapper>
        </div>
    );
};
export default connect(dvaPropsData)(Index);