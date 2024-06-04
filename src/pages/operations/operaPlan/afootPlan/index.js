/**
 * 功  能：预测性维护 运维计划  进行中计划
 * 创建人：jab
 * 创建时间：2024.04
 */
import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Table, Tabs, Input, InputNumber, Popconfirm, Upload, Checkbox, Spin, Form, Popover, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Space, Radio } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, ProfileOutlined, AmazonCircleFilled, NodeCollapseOutlined, } from '@ant-design/icons';
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
import TitleComponents from '@/components/TitleComponents'
import ProjectNum from '@/components/ProjectNum'
import EntAtmoList from '@/components/EntAtmoList';
import OperationCompanyList from '@/components/OperationCompanyList'
import PlanList from '../components/PlanList'
import OperationPlanQuery from '../components/OperationPlanQuery'
import RecordList from '../components/RecordList'
import ViewPlanModal from '../components/ViewPlanModal'
import { API } from '@config/API';
import config from '@/config';
import cuid from 'cuid';
import AdjustExtendPlanModal from '../components/AdjustExtendPlanModal';


import { init, use, setCanvasCreator } from 'echarts';

const { Option } = Select;

const namespace = 'operaPlan'



const dvaPropsData = ({ loading, operaPlan, global, }) => ({
    operationPlanInfo: operaPlan.operationPlanInfo,
    updOperationPlanLoading: loading.effects[`${namespace}/UpdOperationPlan`],
    updOperationPlanStatusLoaidng: loading.effects[`${namespace}/UpdOperationPlanStatus`],
})

const Index = (props) => {



    const [form] = Form.useForm();

    const [form2] = Form.useForm();





    const { operationPlanInfo, updOperationPlanLoading, updOperationPlanStatusLoaidng, } = props;




    useEffect(() => {

    }, []);






    const operateCol = [{
        title: '操作',
        fixed: 'right',
        ellipsis: true,
        width: 200,
        render: (text, record, index) => {
            const startPauseTitle = record.status == '暂停' ? '开启计划' : '暂停计划'
            return (<Fragment>
                <Space>
                    <a onClick={() => { editPlan(record) }}> 编辑计划</a>
                    <Popconfirm title="确认要删除这条计划吗？" onConfirm={() => { delPlan(record) }} > <a> 删除计划</a></Popconfirm>
                    <a onClick={() => { viewPlan(record) }}>查看计划</a>
                </Space>
                <br />
                <Space>
                    <a onClick={() => { pauseOpenTerminPlan(record, startPauseTitle, record.status == '暂停' ? 1 : 2) }}> {startPauseTitle}</a>
                    <Popconfirm title="您确定运维已完结？" onConfirm={() => { completionPlan(record, 4) }} > <a> 完结计划</a></Popconfirm>
                    <a onClick={() => { pauseOpenTerminPlan(record, '异常终止', 3) }}> 异常终止</a>
                </Space>
            </Fragment>
            );

        }
    }]
    const [editPlanVisible, setEditPlanVisible] = useState(false)
    const [entCode, setEntCode] = useState()
    const [pointType, setPointType] = useState()

    const editPlan = (record) => {
        setEditPlanVisible(true)
        form.setFieldsValue({ beginTime: record.beginTime && moment(record.beginTime), endTime: record.endTime && moment(record.endTime), remark: record.remark, id: record.ID })
        props.dispatch({
            type: `${namespace}/updateState`,
            payload: { operationPlanInfoRefreshType: 1, operationPlanInfoRefreshId: record.ID },
        });
        setEntCode(record.entCode)
        setPointType(record.pollutantType == '废气' ? 2 : 1)
    }

    const [viewPlanVisible, setViewPlanVisible] = useState(false)
    const viewPlan = (record) => {
        setViewPlanVisible(true)
        setEntCode(record.entCode)
        props.dispatch({
            type: `${namespace}/updateState`,
            payload: { operationPlanInfoRefreshId: record.ID },
        });
        setPointType(record.pollutantType == '废气' ? 2 : 1)
    }

    const delPlan = (record) => {
        props.dispatch({
            type: `${namespace}/DeleteOperationPlan`,
            payload: { id: record.ID },
            callback: () => {
                props.dispatch({
                    type: `${namespace}/updateState`,
                    payload: { operationPlanQueryRefreshType: 1 },
                });
            }
        });
    }

    const [switchPlanVisible, setSwitchPlanVisible] = useState(false)
    const [switchPlanTitle, setSwitchPlanTitle] = useState()
    const pauseOpenTerminPlan = (record, title, status) => { //暂停计划、开启计划、异常终止
        setSwitchPlanVisible(true)
        setSwitchPlanTitle(title)
        form2.setFieldsValue({ id: record.ID, status: status })
        setFiles(cuid())
        setRefresh(!refresh)
    }



    const [refresh, setRefresh] = useState(false)

    const updOperationPlanReauest = (values, callback) => {
        props.dispatch({
            type: `${namespace}/UpdOperationPlanStatus`,
            payload: {
                ...values,
                type: values.status
            },
            callback: () => {
                callback && callback()
                props.dispatch({
                    type: `${namespace}/updateState`,
                    payload: { operationPlanQueryRefreshType: 1 },
                });
            }
        });
    }
    const restData = () => {
        form2.resetFields()
        setFileList([])
        setFiles(cuid())
    }
    const switchPlanSubmit = (values) => {  //开启、暂停、终止计划提交
        updOperationPlanReauest(values, () => {
            setSwitchPlanVisible(false)
            restData()
        })

    }


    const completionPlan = (record, status) => { //完结计划
        updOperationPlanReauest({ id: record.ID, status: status }, () => {
            restData()
        })
    }



    const saveBasicInfo = (values) => {
        props.dispatch({
            type: `${namespace}/UpdOperationPlan`,
            payload: { ...values, beginTime: values.beginTime && moment(values.beginTime).format('YYYY-MM-DD 00:00:00'), endTime: values.endTime && moment(values.endTime).format('YYYY-MM-DD 23:59:59') },
            callback: (res) => {
                props.dispatch({
                    type: `${namespace}/updateState`,
                    payload: {operationPlanInfoRefreshId:res.Datas, operationPlanQueryRefreshType: 1 },
                });
            }
        });
    }






    const [extensVisible, setExtensVisible] = useState(false)
    const extensionPlan = () => { //延长计划
        setExtensVisible(true)
    }
    const [files, setFiles] = useState()
    const [fileList, setFileList] = useState([])
    const uploadProps = (name) => {
        return { // 核查问题照片附件 上传
            action: API.UploadApi.UploadPicture,
            headers: { Cookie: null, Authorization: "Bearer " + Cookie.get(config.cookieName) },
            accept: 'image/*',
            listType: 'picture-card',
            data: {
                FileUuid: files,
                FileActualType: '0',
            },
            beforeUpload: (file) => {
                const fileType = file?.type; //获取文件类型 type  image/*
                if (!(/^image/g.test(fileType))) {
                    message.error(`请上传图片格式文件!`);
                    return false;
                }
            },
            onChange(info) {
                const fileList = [];
                info.fileList.map(item => {
                    if (item.response && item.response.IsSuccess) { //刚上传的
                        fileList.push({ ...item, url: `/${item.response.Datas}`, })
                    } else if (!item.response) {
                        fileList.push({ ...item })
                    }
                })
                if (info.file.status == 'uploading') {
                    setFileList(fileList)
                }
                if (info.file.status === 'done') {
                    if (info.file?.response?.IsSuccess) {
                        form2.setFieldsValue({ [name]: files })
                        message.success(`${info.file.name} 上传成功`);
                    } else {
                        message.error(info.file?.response?.Message)
                    }
                    setFileList(fileList)
                } else if (info.file.status === 'error' || info.file.status === 'removed') {
                    form2.setFieldsValue({ [name]: fileList && fileList[0] ? files : undefined })//有上传成功的取前面的uid 没有则表示没有上传成功的图片
                    if (info.file.status === 'error') {
                        message.error(`${info.file.name} ${info.file && info.file.response && info.file.response.Message ? info.file.response.Message : '上传失败'}`);
                    } else {
                        setFileList(fileList)
                    }
                }
            },
            onRemove: (file) => {
                if (!file.error) {
                    props.dispatch({
                        type: "autoForm/deleteAttach",
                        payload: {
                            Guid: file.response && file.response.Datas ? file.response.Datas : file.uid,
                        }
                    })
                }

            },
            onPreview: file => { //预览
                setIsImageViewOpen(true);
                let imageListIndex = 0, imgList = [];
                fileList.map((item, index) => {
                    if (item.uid === file.uid) {
                        imageListIndex = index;
                    }
                    imgList.push(`${item.url}`)
                });
                setImageIndex(imageListIndex);
                setImageList(imgList);
            },
            fileList: fileList
        }

    }
    return (
        <div>
            <BreadcrumbWrapper>
                <OperationPlanQuery planType={2} operateCol={operateCol} />
                <Modal
                    visible={editPlanVisible}
                    title={'编辑计划'}
                    onCancel={() => { setEditPlanVisible(false) }}
                    destroyOnClose
                    wrapClassName={`spreadOverModal ${styles.formulateModalSty}`}
                    mask={false}
                    footer={null}
                >
                    <Form
                        form={form}
                        name="advanced_search_formulate"
                        className={'ant-advanced-search-form'}
                        onFinish={saveBasicInfo}
                        labelCol={{ flex: '108px' }}
                    >
                        <TitleComponents simpleSty text='基本信息' />
                        <Row align='middle' justify='space-between'>
                            <Col span={12}>
                                <Form.Item name='beginTime' label='计划起始日期' rules={[{ required: true, message: '请选择计划起始日期！' }]}>
                                    <DatePicker style={{ width: '100%' }} disabledDate={(current) => current && form.getFieldValue('endTime') && current > form.getFieldValue('endTime').startOf('day')} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name='endTime' label='计划结束日期' rules={[{ required: true, message: '请选择计划结束日期！' }]}>
                                    <DatePicker style={{ width: '100%' }} disabledDate={(current) => current && form.getFieldValue('beginTime') && current < form.getFieldValue('beginTime').endOf('day')} />
                                </Form.Item>
                            </Col>
                            <Col span={24} >
                                <Form.Item name='remark' label='备注'>
                                    <Input.TextArea placeholder='请输入' allowClear />
                                </Form.Item>

                            </Col>
                            <Form.Item name='id' hidden> </Form.Item>
                        </Row>
                        <Row justify='end' >
                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={updOperationPlanLoading}>
                                    保存
                                </Button>
                            </Form.Item>
                        </Row>
                    </Form>
                    <TitleComponents simpleSty text='运维计划内容' />
                    <PlanList type={2} pointType={pointType} entCode={entCode} extensionPlan={extensionPlan} />
                </Modal>
                <AdjustExtendPlanModal
                    visible={extensVisible}
                    title='延长计划'
                    type={2}
                    onCancel={() => { setExtensVisible(false); }}
                    pointType={pointType}
                    adjustPointList={{xjPointList:operationPlanInfo?.filter(item=>item.RecordType==1 || item.RecordType==7), jzPointList:operationPlanInfo?.filter(item=>item.RecordType==3 || item.RecordType==9)}}
             />
                <ViewPlanModal
                    visible={viewPlanVisible}
                    onCancel={() => { setViewPlanVisible(false) }}
                    pointType={pointType}
                    entCode={entCode}
                />
                <Modal
                    visible={switchPlanVisible}
                    title={switchPlanTitle}
                    onCancel={() => { setSwitchPlanVisible(false); restData(); setRefresh(false) }}
                    destroyOnClose
                    width={'60%'}
                    footer={null}
                >
                    <Form
                        form={form2}
                        className={'ant-advanced-search-form'}
                        labelCol={{ flex: '52px' }}
                        onFinish={switchPlanSubmit}
                    >

                        <Form.Item label='备注' name='remark' rules={[{ required: true, message: '请输入备注！' }]}>
                            <Input.TextArea placeholder='请输入' allowClear />
                        </Form.Item>
                        <Form.Item label='附件' name='file'>
                            <Upload {...uploadProps('file')} style={{ width: '100%' }}>
                                <div>
                                    <PlusOutlined />
                                    <div className="ant-upload-text">上传</div>
                                </div>
                            </Upload>
                        </Form.Item>
                        <Form.Item name='id' hidden></Form.Item>
                        <Form.Item name='status' hidden></Form.Item>
                        <Row justify='end'>
                            <Form.Item>
                                <Space>
                                    <Button onClick={() => { setSwitchPlanVisible(false); form2.resetFields() }}>取消</Button>
                                    <Button type='primary' htmlType='submit' loading={updOperationPlanStatusLoaidng}>提交</Button>
                                </Space>
                            </Form.Item>
                        </Row>
                    </Form>
                    {switchPlanTitle != '异常终止' && <RecordList id={form2.getFieldValue('id')} status={form2.getFieldValue('status')} refresh={refresh} />}
                </Modal>
            </BreadcrumbWrapper>
        </div>
    );
};
export default connect(dvaPropsData)(Index);