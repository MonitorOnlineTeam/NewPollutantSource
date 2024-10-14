/**
 * 功  车辆统计
 * 创建人：jab
 * 创建时间：2024.07.26
 */
import React, { useState, useEffect, Fragment, useRef, useMemo } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Card, Button, Select, message, Skeleton, Row, Col, Tooltip, Divider, Modal, DatePicker, Popover, Radio, Space } from 'antd';
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
import VehicleManager from '@/pages/ctDebuggAfterSaleServiceManage/generalManager/vehicleManager'

import moment from 'moment'
const { Option } = Select;

const namespace = 'resourceOverview'




const dvaPropsData = ({ loading, resourceOverview }) => ({
    tableLoading: loading.effects[`${namespace}/GetCarStatistics`],
    exportLoading: loading.effects[`${namespace}/ExportCarStatistics`],
})


const Index = (props) => {


    const [form] = Form.useForm();

    const echartsRef = useRef(null);





    const { tableLoading, exportLoading, carPollType, carPollTypeList, } = props;

    const [tableDatas, setTableDatas] = useState({})
    const [queryPar, setQueryPar] = useState({})

    const [industry, setIndustry] = useState()

    useEffect(() => {
        setIndustry(carPollType)
    }, [carPollType]);

    useEffect(() => {
        industry && onFinish()
    }, [industry]);


   const colSpanFun = (text,record) =>{
    return  {
        children: text,
        props: { colSpan: record.UseDepartment === '合计' ? 0 : 1 },
      };
   }
    const columns = [
        {
            title: '序号',
            render: (text, record, index) => {
                return index + 1
            },
        },
        {
            title: '使用部门',
            dataIndex: 'UseDepartment',
            key: 'UseDepartment',
            align: 'center',
            width: 'auto',
            render: (text, record, index) => {
                return {
                    children: text,
                    props: { colSpan: text === '合计' ? 3 : 1 },
                };
            },
        },
        {
            title: '所属大区',
            dataIndex: 'RegionName',
            key: 'RegionName',
            align: 'center',
            width: 'auto',
            render: (text, record, index) => colSpanFun(text,record),
        },
        {
            title: '所属行业',
            dataIndex: 'Industry',
            key: 'Industry',
            align: 'center',
            width: 'auto',
            render: (text, record, index) => colSpanFun(text,record),
        },
        {
            title: '车辆数量',
            dataIndex: 'Num',
            key: 'Num',
            align: 'center',
            width: 'auto',
            sorter: (a, b) => {
                if (a.UseDepartment !== '合计' && b.UseDepartment !== '合计') {
                    return a.Num - b.Num;
                }
            },
            render: (text, record, index) => {
                return <a onClick={() => viewAll(record)}>{text}</a>
            },
        },

    ]
    const [visible, setVisible] = useState(false)
    const [modalTitle, setModalTitle] = useState()
    const [useDepartment, setUseDepartment] = useState()

    const viewAll = (record) => {
        setVisible(true)
        setModalTitle(`${record.UseDepartment} - 车辆统计`)
        setUseDepartment(record.UseDepartment=='合计'? '' : record.UseDepartment)
    }
    const getOption = () => {
        const xData = [], yData = [];
        tableDatas?.SList?.map(item => {
            if (item.UseDepartment != '合计') {
                xData.push(item.RegionName)
                yData.push(item.Num)
            }
        })
        return {
            color: ['#28CBFA'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                top: 32,
                left: 38,
                right: 0,
                bottom: 30,
            },

            xAxis: [
                {
                    type: 'category',
                    data: xData,
                    axisLine: {
                        lineStyle: {
                            color: '#E7E7E7'  // 修改 x 轴的轴线颜色
                        }
                    },
                    axisLabel: {
                        interval: 0,
                        rotate: 0, // 或者其他角度
                        textStyle: {
                            color: '#333'  // 修改 x 轴刻度文字的颜色
                        }
                    },
                    axisTick: { //刻度
                        show: false,
                    },
                    axisPointer: {
                        type: 'shadow'
                    },
                }

            ],
            yAxis: [
                {
                    name: '车辆数（辆）',
                    nameTextStyle: {
                        color: '#333'  // 设置名称颜色为 '#333'
                    },
                    type: 'value',
                    minInterval: 1,
                    splitLine: { //网格线
                        lineStyle: { //分割线
                            color: "#E7E7E7",
                            width: 1,
                            type: "dashed" //dotted：虚线 solid:实线
                        }
                    },
                    axisLine: {
                        show: false,
                    },
                    axisLabel: {
                        lineStyle: {
                            color: '#333',
                            width: 1
                        },
                        textStyle: {
                            color: '#333'
                        }
                    },
                }
            ],
            series: [
                {
                    name: '监测点个数',
                    type: 'bar',
                    barWidth: '60%',
                    barMaxWidth: 48,
                    data: yData,
                    label: {
                        show: true,
                        position: 'top',
                        textStyle: {
                            color: '#333'
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: (params) => {
                                return '#64b0fd'
                            }
                        }
                    }
                }
            ]
        };
    }
    const onFinish = () => {
        const values = form.getFieldsValue()
        const par = { ...values, industry: industry }
        props.dispatch({
            type: `${namespace}/GetCarStatistics`,
            payload: par,
            callback: (res) => {
                setTableDatas(res)
                setQueryPar(par)
            }
        });
    };
    const exports = () => {
        props.dispatch({
            type: `${namespace}/ExportCarStatistics`,
            payload: {
                ...queryPar,
            },
        });
    }


    const onChange = (e) => {
        form.resetFields();
        setIndustry(e.target.value)
    };


    const searchComponents = () => {
        return <div style={{ paddingBottom: 8 }}>
            <Radio.Group value={industry} onChange={onChange} >
                {carPollTypeList?.map(item => <Radio.Button value={item.PollutantName}>{item.PollutantName}</Radio.Button>)}
            </Radio.Group>
        </div>
    }
    const searchComponents2 = () => {
        return <Form
            name="advanced_search"
            form={form}
            layout='inline'
            onFinish={onFinish}>
            <Form.Item name='department' label='使用部门'>
                <Input placeholder='请输入' allowClear />
            </Form.Item>
            <Form.Item>
                <Space>
                    <Button loading={tableLoading} type='primary' htmlType='submit'>
                        查询
                    </Button>
                    <Button htmlType='reset'>
                        重置
                    </Button>
                    <Button icon={<ExportOutlined />} loading={exportLoading} onClick={() => { exports() }}>
                        导出
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    }
    const echartsComponents = useMemo(() => {
        return <ReactEcharts
            option={getOption()}
            style={{ width: '100%', height: 280, }}
            theme="my_theme"
            ref={echartsRef}
        />
    }, [tableLoading])
    return (<>
        <Card size='small' bordered={false}>
            <div> {searchComponents()} </div>
            {tableLoading ? <Skeleton active paragraph={{ rows: 7 }} style={{ padding: '14px 0' }} /> : echartsComponents}
            <div style={{ paddingBottom: 8 }}> {searchComponents2()} </div>
            <SdlTable
                loading={tableLoading}
                bordered
                size='small'
                scroll={{ x: 580 }}
                dataSource={tableDatas?.rtnList}
                columns={columns}
            />
        </Card>
        <Modal
            visible={visible}
            title={modalTitle}
            onCancel={() => { setVisible(false) }}
            footer={null}
            destroyOnClose
            wrapClassName={`spreadOverModal`}
            mask={false}
            bodyStyle={{ padding: 0 }}
        >
            <VehicleManager useDepartment={useDepartment} isModal />
        </Modal>
    </>
    );
};
export default connect(dvaPropsData)(Index);