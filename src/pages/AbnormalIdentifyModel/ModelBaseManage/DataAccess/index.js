/**
 * 功  能：异常买模型识别 模型库管理  数据接入
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
import SdlCascader from '@/pages/AutoFormManager/SdlCascader'
import styles from "../../styles.less"
import Cookie from 'js-cookie';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
const { Option } = Select;

const namespace = 'ModelBaseManage'


const dvaPropsData = ({ loading, ModelBaseManage, global, }) => ({
    tableDatas: ModelBaseManage.dataAccessDatas,
    tableLoading: loading.effects[`${namespace}/GetProjectMonitorDataList`],
    updProjectMonitorDataLoading: loading.effects[`${namespace}/UpdProjectMonitorData`],
    configInfo: global.configInfo,
})


const Index = (props) => {



    const [form] = Form.useForm();
    const [form2] = Form.useForm();


    const [startExecuLoading, setStartExecuLoading] = useState({})



    const { tableDatas, tableLoading, } = props;


   

    useEffect(() => {
        handleChange(1);

    }, []);


    let columns = [
        {
            title: '项目名称',
            dataIndex: 'ProjectName',
            key: 'ProjectName',
            align: 'center',
            ellipsis: true,
        },
        {
            title: '任务名称',
            dataIndex: 'TaskName',
            key: 'TaskName',
            align: 'center',
            ellipsis: true,
        },
        {
            title: '接入方式',
            dataIndex: 'AccessMethod',
            key: 'AccessMethod',
            align: 'center',
            ellipsis: true,
        },
        {
            title: '执行方式',
            dataIndex: 'ImplementType',
            key: 'ImplementType',
            align: 'center',
            ellipsis: true,
            width: 140,
            render: (text, record, index) => {
                return <Row justify='center' align='middle' style={{ cursor: 'pointer' }} onClick={() => executionMethod(record)}><div style={{ width: '60px' }}>{text == 1 ? '单次' : '每周一次'}</div> <CaretDownOutlined /></Row>
            }
        },
        {
            title: '执行状态',
            dataIndex: 'Status',
            key: 'Status',
            align: 'center',
            ellipsis: true,
            render: (text, record, index) => {
                const colorObj = {
                    1: {color:'#52c41a',text:`执行成功${record.SuccessCount? `，接入数据${record.SuccessCount}条`: ''  }`},
                    2: {color:'#fa8c16',text:`执行中`},
                    3: {color:'#f5222d',text:`执行失败，查看日志`},
                    
                }
                return <Badge color={colorObj[text]?.color} text={colorObj[text]?.text} />
            }
        },
        {
            title: '最近接入时间',
            dataIndex: 'LastExecutionDate',
            key: 'LastExecutionDate',
            align: 'center',
            ellipsis: true,
        },
        {
            title: '操作',
            align: 'center',
            fixed: 'right',
            width: 100,
            ellipsis: true,
            render: (text, record,index) => {
                return (record.TaskCode == 6 ?
                    <a onClick={() => { setStartExecuVisible(true); setStartExecuTitle(`${record.ProjectName} - 开始执行（接入小时数据）`) }}>开始执行</a>
                    :
                    <Popconfirm visible={startConfirmVisible && index == startConfirmIndex} placement="left" title={'确定要开始执行？'}   
                      okButtonProps={{
                        loading: startExecuLoading[record.TaskCode],
                      }} 
                      onConfirm={() => startExecuConfirm(1,record)} okText="开始执行" >
                        <a onClick={() => { setStartConfirmVisible(true);setStartConfirmIndex(index)}}>开始执行</a>
                    </Popconfirm>
                );

            }
        },
    ];


    const [row, setRow] = useState({})

    const executionMethod = (record) => {
        setExecutionMethodVisible(true)
        setExecutionMethodTitle(record.ProjectName)
        form.setFieldsValue({ ImplementType: record.ImplementType })
    }

    const [startExecuVisible, setStartExecuVisible] = useState(false)
    const [startExecuTitle, setStartExecuTitle] = useState('')
    const [startConfirmVisible, setStartConfirmVisible] = useState(false)
    const [startConfirmIndex, setStartConfirmIndex] = useState(-1)

    const startExecuConfirm = async (type, record) => {
       
        let par = {}

        if(type == 1){
            par = { projectType : 1}
        }else{
            const values = await form2.validateFields();
            par = { 
                projectType : 1,
                BeginTime:values.time?.[0]&&moment(values.time[0]).format("YYYY-MM-DD HH:mm:ss"),
                EndTime:values.time?.[1]&&moment(values.time[1]).format("YYYY-MM-DD HH:mm:ss"),
            }
        }
        
        const objRequest = {
            '1': 'AccessEntInfoList',
            '2': 'AccessPointInfoList',
            '3': 'AccessParamInfoList',
            '4': 'AccessEmissionStandardList',
            '5': 'AccessMonitorPollutantList',
            '6': 'AccessHourData',
        }
        const code = record?.TaskCode
        setStartExecuLoading({...startExecuLoading,[code]:true})
        props.dispatch({
            type: `${namespace}/${objRequest[code]}`,
            payload: { ...par },
            callback:(isSuccess)=>{
                setStartExecuLoading({...startExecuLoading,code:false})
                if(isSuccess){
                    handleChange(1);
                    setStartConfirmVisible(false)
                }
            }
        });

    }

    const handleChange = (values) => {  //查询

        props.dispatch({
            type: `${namespace}/GetProjectMonitorDataList`,
            payload: { projectType: values },
        });
    }


    const [executionMethodVisible, setExecutionMethodVisible] = useState(false)
    const [executionMethodTitle, setExecutionMethodTitle] = useState()
    const executionMethodOK = async () => {
        const values = await form.validateFields();
        props.dispatch({
            type: `${namespace}/UpdProjectMonitorData`,
            payload: {
                ...values,
                ID: row.ID,
                FirstDate:values.FirstDate&&moment(values.FirstDate).format("YYYY-MM-DD HH:mm:ss"),
                BeginTime:values.time?.[0]&&moment(values.time[0]).format("YYYY-MM-DD HH:mm:ss"),
                EndTime:values.time?.[1]&&moment(values.time[1]).format("YYYY-MM-DD HH:mm:ss"),
                time:undefined
            },
            callback: res => {
                setExecutionMethodVisible(false);
                handleChange(1);
            },
        });
    };

    const searchComponents = () => {
        return <Form
            form={form}
            name="advanced_search"
            className={'ant-advanced-search-form'}
            layout='inline'
        >
            <Form.Item label='选择项目'>
                <Select
                    defaultValue="1"
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
                    destroyOnClose
                    confirmLoading={props.updProjectMonitorDataLoading}
                    onOk={executionMethodOK}
                >
                    <Form
                        name="dataAccess"
                        form={form}
                        labelCol={{ flex: row.TaskCode == 6 ? '180px' : '112px' }}
                    >
                        <Form.Item label={row.TaskCode == 6 ? '执行方式（接入小时数据）' : '执行方式'} name="ImplementType">
                            <Radio.Group>
                                <Radio value={1}>单次执行</Radio>
                                <Radio value={2}>周期执行</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="周期" name="DataCycle" >
                            <InputNumber placeholder='请输入' style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item label="首次执行时间" name="FirstDate">
                            <DatePicker
                                showTime
                                format="YYYY-MM-DD HH:mm"
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                        <Form.Item label="首次执行时间段" name="time">
                            <RangePicker_ format="YYYY-MM-DD" style={{ width: '100%' }} />
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    visible={startExecuVisible}
                    title={startExecuTitle}
                    onCancel={() => { setStartExecuVisible(false); form2.resetFields() }}
                    destroyOnClose
                    confirmLoading={startExecuLoading[row.TaskCode]}
                    footer={[
                        <Button type="primary" onClick={() => startExecuConfirm(2,row)}>
                            开始执行
                        </Button>,
                    ]}
                >
                    <Form
                        name="modal"
                        form={form2}
                    >
                        <Form.Item label="接入数据时间" name="time">
                            <RangePicker_ format="YYYY-MM-DD" style={{ width: '100%' }} />
                        </Form.Item>
                    </Form>
                </Modal>
            </BreadcrumbWrapper>
        </div >
    );
};
export default connect(dvaPropsData)(Index);