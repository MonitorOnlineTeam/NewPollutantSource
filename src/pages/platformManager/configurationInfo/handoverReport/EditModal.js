/**
 * 功  能：交接和报告 编辑组件
 * 创建人：jab
 * 创建时间：2023.10.08
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Card, Button, Radio, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Checkbox, Upload } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, UploadOutlined, } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import SdlCascader from '@/pages/AutoFormManager/SdlCascader'
import styles from "./style.less"
import Cookie from 'js-cookie';
import cuid from 'cuid';
import ImageView from '@/components/ImageView';
import OperationCompanyList from '@/components/OperationCompanyList';
import { permissionButton } from '@/utils/utils';
import { API } from '@config/API';
import config from '@/config';

const { Option } = Select;

const namespace = 'handoverReport'




const dvaPropsData = ({ loading, handoverReport, global, }) => ({
    loadingConfirm: loading.effects[`${namespace}/addOrUpdProjectReportInfo`],
})

const dvaDispatch = (dispatch) => {
    return {
        updateState: (payload) => {
            dispatch({
                type: `${namespace}/updateState`,
                payload: payload,
            })
        },
        addOrUpdProjectReportInfo: (payload, callback) => { //修改 or 添加
            dispatch({
                type: `${namespace}/addOrUpdProjectReportInfo`,
                payload: payload,
                callback: callback
            })

        },
        deleteProjectInfo: (payload, callback) => { //删除
            dispatch({
                type: `${namespace}/deleteProjectInfo`,
                payload: payload,
                callback: callback
            })
        },
        deleteAttach: (file) => { //删除照片
            dispatch({
                type: "autoForm/deleteAttach",
                payload: {
                    Guid: file.response && file.response.Datas ? file.response.Datas : file.uid,
                }
            })
        },
    }
}
const Index = (props) => {



    const [form2] = Form.useForm();









    const { record, loadingConfirm, } = props;

    const [editPermis, setPermisEdit] = useState(false)
    useEffect(() => {
        props.visible && initData()

    }, [props.visible]);

    const initData = () => {
        form2.resetFields();
        setFilesList1([])
        if (record.ReceiveFile && record.ReceiveFile[0] && record.ReceiveFile != '待上传') { //运维接收-运维交接单 照片
            const fileList = []
            record.ReceiveFile.map(item => {
                if (!item.IsDelete) {
                    fileList.push({
                        uid: item.GUID,
                        name: item.FileName,
                        status: 'done',
                        url: `${config.uploadPrefix}/${item.FileName}`,
                    })
                }
            })
            setFilesList1(fileList)
        }
        setFilesList2([])
        if (record.TransferFile && record.TransferFile[0] && record.TransferFile != '待上传') { //运维移交-运维交接单 照片
            const fileList = []
            record.TransferFile.map(item => {
                if (!item.IsDelete) {
                    fileList.push({
                        uid: item.GUID,
                        name: item.FileName,
                        status: 'done',
                        url: `${config.uploadPrefix}/${item.FileName}`,
                    })
                }
            })
            setFilesList2(fileList)
        }
        setFilesList3([])
        if (record.PerformanceFile && record.PerformanceFile[0] && record.PerformanceFile != '待上传') { //运维合同履约完成报告 照片
            const fileList = []
            record.PerformanceFile.map(item => {
                if (!item.IsDelete) {
                    fileList.push({
                        uid: item.GUID,
                        name: item.FileName,
                        status: 'done',
                        url: `${config.uploadPrefix}/${item.FileName}`,
                    })
                }
            })
            setFilesList3(fileList)
        }
        try {
            form2.setFieldsValue({
                remark: record.Remark,
                status: record.Status,
                id: record.ID,
                projectID: record.ProjectID,
                performanceFile: record.PerformanceFile == '待上传' || !record.PerformanceFile ? cuid() : record.PerformanceFile?.[0]?.FileUuid,
                receiveFile: record.ReceiveFile == '待上传' || !record.ReceiveFile ? cuid() : record.ReceiveFile?.[0]?.FileUuid,
                transferFile: record.TransferFile == '待上传' || !record.TransferFile ? cuid() : record.TransferFile?.[0]?.FileUuid,
                EndStatus: record.EndStatus,
            })



        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    }

    const [filesList, setFilesList] = useState([]);
    const [fileVisible, setFileVisible] = useState(false)
    const [fileTitle, setFileTitle] = useState()

    const getAttachmentData = (fileInfo, title) => {
        setFileVisible(true)
        setFileTitle(title)
        const fileList = [];
        fileInfo.map((item, index) => {
            if (!item.IsDelete) {
                fileList.push({ name: item.FileName, url: `${config.uploadPrefix}/${item.FileName}`, status: 'done', uid: item.GUID, })
            }
        })
        setFilesList(fileList)
    }
    const uploadProps = {
        accept: 'image/*',
        listType: "picture-card",
        onPreview: async file => { //预览
            onPreviewImg(file, filesList)
        },
        fileList: filesList,
        showUploadList: { showRemoveIcon: false },
    };
    const [isOpen, setIsOpen] = useState(false);
    const [imageIndex, setImageIndex] = useState();
    const [imageList, setImageList] = useState([]);
    const onPreviewImg = (file, filesList) => {
        setIsOpen(true)
        const imageList = filesList
        let imageListIndex = 0;
        imageList.map((item, index) => {
            if (item.uid === file.uid) {
                imageListIndex = index;
            }
        });
        if (imageList && imageList[0]) {
            //拼接放大的图片地址列表
            const imgData = [];
            imageList.map((item, key) => {
                imgData.push(item.url)
            })
            setImageList(imgData)
        }
        setImageIndex(imageListIndex)
    }

    const onModalOk = async () => { //添加 or 编辑弹框

        try {
            const values = await form2.validateFields();//触发校验
            props.addOrUpdProjectReportInfo({
                ...values,
            }, () => {
                props.onCancel()
                props.onFinish&&props.onFinish()
            })


        } catch (errInfo) {
            console.log('错误信息:', errInfo);
        }
    }
    const [filesList1, setFilesList1] = useState([])
    const [filesList2, setFilesList2] = useState([])
    const [filesList3, setFilesList3] = useState([])

    const uploadProps2 = (fileName) => {
        const filesCuid = form2.getFieldValue([fileName])
        return { //照片附件 上传
            action: API.UploadApi.UploadPicture,
            headers: { Cookie: null, Authorization: "Bearer " + Cookie.get(config.cookieName) },
            accept: 'image/*',
            data: {
                FileUuid: filesCuid,
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
                if (info.file.status == 'uploading' || info.file.status === 'done') {
                    form2.setFieldsValue({ [fileName]: filesCuid })
                    fileName == 'receiveFile' ? setFilesList1(fileList) : fileName == 'transferFile' ? setFilesList2(fileList) : setFilesList3(fileList)
                }
                if (info.file.status === 'done') {
                    message.success(`${info.file.name} 上传成功`);
                } else if (info.file.status === 'removed' || info.file.status === 'error') {
                    form2.setFieldsValue({ [fileName]: fileList && fileList[0] ? filesCuid : undefined }) //有上传成功的取前面的uid 没有则表示没有上传成功的图片
                    fileName == 'receiveFile' ? setFilesList1(fileList) : fileName == 'transferFile' ? setFilesList2(fileList) : setFilesList3(fileList)
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name}${info.file && info.file.response && info.file.response.Message ? info.file.response.Message : '上传失败'}`);

                }
            },
            onRemove: (file) => {
                if (!file.error) {
                    props.deleteAttach(file)
                }

            },
            onPreview: file => { //预览
                const fileList = fileName == 'receiveFile' ? filesList1 : fileName == 'transferFile' ? filesList2 : filesList3
                onPreviewImg(file, fileList)
            },
            fileList: fileName == 'receiveFile' ? filesList1 : fileName == 'transferFile' ? filesList2 : filesList3

        }
    }

    return (
        <div className={styles.handoverReportSty}>

            <Modal
                title={props.title}
                visible={props.visible}
                onOk={onModalOk}
                confirmLoading={!!loadingConfirm}
                onCancel={() => { props.onCancel() }}
                className={styles.formModal}
                destroyOnClose
            >
                <Form
                    name="basic"
                    form={form2}
                >
                    <Form.Item label="项目接收状态" name="status" rules={[{ required: true, message: '请选择项目接收状态！' }]}>
                        <Radio.Group>
                            <Radio value="1">续签</Radio>
                            <Radio value="2">新签</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="运维接收-运维交接单" name="receiveFile" >
                        <Upload {...uploadProps2('receiveFile')} accept='image/*'>
                            <Button icon={<UploadOutlined />}>上传照片</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item label="项目结束状态" name="EndStatus" >
                        <Radio.Group>
                            <Radio value="1">续签</Radio>
                            <Radio value="2">不续签</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="运维移交-运维交接单" name="transferFile" >
                        <Upload {...uploadProps2('transferFile')} accept='image/*'>
                            <Button icon={<UploadOutlined />}>上传照片</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item label="运维合同履约完成报告" name="performanceFile" >
                        <Upload {...uploadProps2('performanceFile')} accept='image/*'>
                            <Button icon={<UploadOutlined />}>上传照片</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item label="备注" name="remark" >
                        <Input.TextArea placeholder='请输入' />
                    </Form.Item>
                    <Form.Item name="id" hidden>
                        <Input />
                    </Form.Item>
                    <Form.Item name="projectID" hidden>
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Row style={{ color: '#f5222d' }}>
                            <span style={{ paddingRight: 12 }}>注：</span>
                            <ol type="1" style={{ listStyle: 'auto' }}>
                                <li>在合同执行开始日期的前后7天内上传运维接收-运维交接单；如果项目接收状态是续签则无需上传；</li>
                                <li>在合同执行结束日期的前后7天内上传运维移交-运维交接单，如果项目被续签则无需上传；</li>
                                <li>在合同执行结束日期的前后15天内上传运维合同履约完成报告；</li>
                            </ol>
                        </Row>
                    </Form.Item>
                </Form>
            </Modal>
            {/* 查看附件弹窗 */}
            <ImageView
                isOpen={isOpen}
                images={imageList?.length ? imageList : []}
                imageIndex={imageIndex}
                onCloseRequest={() => {
                    setIsOpen(false);
                }}
            />
        </div>
    );
};
export default connect(dvaPropsData, dvaDispatch)(Index);