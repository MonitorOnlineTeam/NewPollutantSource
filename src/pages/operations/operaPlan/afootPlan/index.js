/**
 * 功  能：预测性维护 运维计划  进行中计划
 * 创建人：jab
 * 创建时间：2024.04
 */
import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Table, Tabs, Input, InputNumber, Popconfirm,Upload, Checkbox, Spin, Form, Popover, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Space, Radio } from 'antd';
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


import { init, use } from 'echarts';

const { Option } = Select;

const namespace = 'operaPlan'



const dvaPropsData = ({ loading, operaPlan, global, }) => ({
    tableLoading: loading.effects[`${namespace}/GetAuditPhoto`],
    tableDatas: operaPlan.formulateTableDatas,
    tableTotal: operaPlan.formulateTableTotal,
    queryPar: operaPlan.formulateQueryPar,
    exportLoading: loading.effects[`${namespace}/GetAuditPhoto`],
    configInfo: global.configInfo,
})

const Index = (props) => {



    const [form] = Form.useForm();

    const [form2] = Form.useForm();





    const { tableDatas, tableTotal, tableLoading, queryPar, exportLoading, } = props;

    const [pointType, setPointType] = useState('2')


    useEffect(() => {

    }, []);

    const initData = () => {
        props.dispatch({
            type: `${namespace}/GetQuestionList`,
            payload: {
            }
        });
    }





    const operateCol = [{
        title: '操作',
        fixed: 'right',
        ellipsis: true,
        width: 260,
        render: (text, record, index) => {
            return (<Fragment>
                <Space>
                    <a onClick={() => { editPlan(record) }}> 编辑计划</a>
                    <Popconfirm title="确认要删除这条计划吗？" onConfirm={() => { delPlan(record) }} > <a onClick={() => { delPlan(record) }}> 删除计划</a></Popconfirm>
                    <a onClick={() => { viewPlan(record) }}>查看计划</a>
                    <a onClick={() => { pauseOpenTerminPlan(record,'暂停计划') }}> 暂停计划</a>
                
                </Space>
                <br />
                <Space>
                    <a onClick={() => { pauseOpenTerminPlan(record,'开启计划') }}> 开启计划</a>
                    <Popconfirm title="您确定运维已完结？" onConfirm={() => { completionPlan(record) }} > <a> 完结计划</a></Popconfirm>
                    <a onClick={() => { pauseOpenTerminPlan(record,'异常终止',true) }}> 异常终止</a>
                </Space>
            </Fragment>
            );

        }
    }]
    const [editPlanVisible, setEditPlanVisible] = useState(false)

    const editPlan = (record) => {
        setEditPlanVisible(true)
    }

    const [viewPlanVisible, setViewPlanVisible] = useState(false)
    const viewPlan = (record)=>{
        setViewPlanVisible(true)
    }

    const delPlan = (record) => {
        props.dispatch({
            type: `${namespace}/ExportQuestionList`,
            payload: queryPar,
        });
    }

    const [switchPlanVisible, setSwitchPlanVisible] = useState(false)
    const [switchPlanTitle, setSwitchPlanTitle] = useState()
    const [isTermin, setIsTermin] = useState(false)
    const pauseOpenTerminPlan = (record,title,termin) => { //暂停计划、开启计划、异常终止
        setSwitchPlanVisible(true)
        setSwitchPlanTitle()
        setIsTermin(termin)
        form2.resetFields();
        setFiles(cuid())
    }
    const completionPlan = (record) => { //完结计划
        setSwitchPlanVisible(true)
        setFiles(cuid())
    }






    const saveBasicInfo = (values) => {
        console.log(values)

    }



    const switchPlanSubmit = async () => {  //开启、暂停、终止计划提交

        try {
            const values = await form2.validateFields();
            props.dispatch({
                type: `${namespace}/GetQuestionList`,
                payload: {
                    ...values,
                },

            });
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    }

 


    const extensionPlan = () =>{ //延长计划
      alert('延长计划')
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
              if(info.file?.response?.IsSuccess){
                form2.setFieldsValue({ [name]: files })
                message.success(`${info.file.name} 上传成功`);
              }else{
                message.error(info.file?.response?.Message)
              }
              setFileList(fileList)
          } else if (info.file.status === 'error' || info.file.status === 'removed') {
            form2.setFieldsValue({[name]:fileList && fileList[0] ? files : undefined})//有上传成功的取前面的uid 没有则表示没有上传成功的图片
            if(info.file.status === 'error'){
              message.error(`${info.file.name} ${info.file && info.file.response && info.file.response.Message ? info.file.response.Message : '上传失败'}`);
            }else{
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
          let imageListIndex = 0,imgList=[];
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
                <OperationPlanQuery operateCol={operateCol} />
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
                                    <DatePicker style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name='endTime' label='计划结束日期' rules={[{ required: true, message: '请选择计划结束日期！' }]}>
                                    <DatePicker style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col span={24} >
                                <Form.Item name='remark' label='备注'>
                                    <Input.TextArea placeholder='请输入' />
                                </Form.Item>

                            </Col>
                        </Row>
                        <Row justify='end' >
                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={tableLoading}>
                                    保存
                                </Button>
                            </Form.Item>
                        </Row>
                    </Form>
                    <TitleComponents simpleSty text='运维计划内容' />
                    <PlanList type={2}  extensionPlan={extensionPlan}/>
                </Modal>
                <ViewPlanModal
                    visible={viewPlanVisible}
                    onCancel={() => { setViewPlanVisible(false) }}
                />
                <Modal
                    visible={switchPlanVisible}
                    title={switchPlanTitle}
                    onCancel={() => { setSwitchPlanVisible(false);form2.resetFields() }}
                    destroyOnClose
                    width={'60%'}
                    mask={false}
                    footer={null}
                >
                    <Form
                        form={form2}
                        className={'ant-advanced-search-form'}
                        labelCol={{flex:'52px'}}
                    >

                        <Form.Item label='备注' name='remark' rules={[{ required: true, message: '请输入备注！' }]}>
                            <Input.TextArea placeholder='请输入' />
                        </Form.Item>
                        <Form.Item label='附件' name='files'>
                            <Upload {...uploadProps('files')} style={{ width: '100%' }}>
                                <div>
                                    <PlusOutlined />
                                    <div className="ant-upload-text">上传</div>
                                </div>
                            </Upload>
                        </Form.Item>
                        <Row justify='end'>
                        <Form.Item>
                            <Space>
                            <Button onClick={()=>{setSwitchPlanVisible(false);form2.resetFields()}}>取消</Button>
                            <Button type='primary' htmlType='submit' onClick={switchPlanSubmit}>提交</Button>
                            </Space>
                        </Form.Item>
                        </Row>
                    </Form>
                   {!isTermin&&<RecordList/>}
                </Modal>
            </BreadcrumbWrapper>
        </div>
    );
};
export default connect(dvaPropsData)(Index);