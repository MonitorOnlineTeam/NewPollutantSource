/**
 * 功  能：督查管理
 * 创建人：jab
 * 创建时间：2022.04.25
 */
import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Table, Input, InputNumber, Upload, Popconfirm, Form, Tabs, Typography, Card, Button, Select, Progress, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Spin } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, QuestionCircleOutlined, ProfileOutlined, EditOutlined } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import { getBase64, } from '@/utils/utils';
import styles from "./style.less"
import Cookie from 'js-cookie';
import cuid from 'cuid';
import Lightbox from "react-image-lightbox-rotate";
import "react-image-lightbox/style.css";
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;


const namespace = 'cruxParSupervisionRectifica'




const dvaPropsData = ({ loading, cruxParSupervisionRectifica, global, common }) => ({
  tableDatas: cruxParSupervisionRectifica.parameterQuestionDetailList,
  tableLoading: loading.effects[`${namespace}/getKeyParameterQuestionDetailList`],
  saveLoading: loading.effects[`${namespace}/updateKeyParameterQuestionStatus`],

  
})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
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
    getKeyParameterQuestionDetailList: (payload, callback) => {//详情
      dispatch({
        type: `${namespace}/getKeyParameterQuestionDetailList`,
        payload: payload,
        callback: callback,
      })
    },
    updateKeyParameterQuestionStatus: (payload, callback) => { //通过或驳回关键参数核查整改
      dispatch({
        type: `${namespace}/updateKeyParameterQuestionStatus`,
        payload: payload,
        callback: callback
      })
    },
  }
}




const Index = (props) => {


  const { tableDatas, tableLoading, id, pollutantType, type,infoData, } = props;

  const [form] = Form.useForm();


  useEffect(() => {
    props.getKeyParameterQuestionDetailList({ id: id })
  }, []);

  const TitleComponents = (props) => {
    return <div style={{ display: 'inline-block', fontWeight: 'bold', padding: '2px 4px', marginBottom: 16, borderBottom: '1px solid rgba(0,0,0,.1)' }}>{props.text}</div>

  }
  const [filesList, setFilesList] = useState([]);
  const [fileVisible, setFileVisible] = useState(false)

  const getAttachmentData = (fileInfo) => {
    setFileVisible(true)
    const fileList = [];
    fileInfo.map((item, index) => {
      if (!item.IsDelete) {
        fileList.push({ name: item.FileActualName, url: `/upload/${item.FileName}`, status: 'done', uid: item.GUID, })
      }
    })
    setFilesList(fileList)
  }
  const rowSpanFun = (value, record) => {
    let obj = {
      children: <div>{value}</div>,
      props: { rowSpan: record.Count },
    };
    return obj;
  }
  let columns = [
    {
      title: '序号',
      align: 'center',
      width: 80,
      render: (text, record, index) => {
        return index + 1
      }
    },
    {
      title: '核查项',
      dataIndex: 'typeName',
      key: 'typeName',
      align: 'center',
      width: 200,
    },
    {
      title: '核查整改次数',
      dataIndex: 'aaaa',
      key: 'aaaa',
      align: 'center',
      width: 100,
      render: (text, record, index) => rowSpanFun(text, record)
    },
    {
      title: `核查问题描述`,
      dataIndex: 'checkReamrk',
      key: 'checkReamrk',
      align: 'center',
      width: 200,
    },
    {
      title: '核查问题照片附件',
      dataIndex: 'checkFileList',
      key: 'checkFileList',
      align: 'center',
      width: 140,
      render: (text, record) => {
        return <div>
               {text && text[0] && <a onClick={() => { getAttachmentData(text) }}>查看附件</a>}
               </div>
      },
    },
    {
      title: `核查问题提交时间`,
      dataIndex: 'questionTime',
      key: 'questionTime',
      align: 'center',
      width: 150,
    },
    {
      title: `整改/申诉描述`,
      dataIndex: 'remark',
      key: 'remark',
      align: 'center',
    },
    {
      title: `整改/申诉照片附件`,
      dataIndex: 'fileList',
      key: 'fileList',
      align: 'center',
      width: 140,
      render: (text, record) => {
        return <div>
               {text && text[0] && <a onClick={() => { getAttachmentData(text) }}>查看附件</a>}
               </div>
      },
    },
    {
      title: `整改/申诉提交时间`,
      dataIndex: 'createTime',
      key: 'createTime',
      align: 'center',
      width: 150,
    },
    {
      title: `状态`,
      dataIndex: 'checkStatusName',
      key: 'checkStatusName',
      align: 'center',
      width: 100,
      render: (text, record) => {
        return <span style={{ color: text == '整改未通过' || text == '申诉未通过' ? '#f5222d' : text == '已整改' || text == '审核通过' ? '#52c41a' : '' }}>{text}</span>
      }
    },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      dataIndex: 'checkStatusName',
      key: 'checkStatusName',
      width: 150,
      render: (text, record) => {
        return (
        <div>{(text == '已整改' || text == '申诉中') &&
         <>
          <Popconfirm title={text == '已整改' ? "确定要整改通过？" : "确定要申诉通过？"} placement="left" onConfirm={() => pass(record, text == '已整改' ? '整改驳回' : '申诉驳回')} okText="是" cancelText="否">
            <a> {text == '已整改' ? '整改通过' : '申诉通过'} </a>
          </Popconfirm>
          <Divider type="vertical" />
          <a onClick={() => { reject(record, text == '已整改' ? '整改驳回' : '申诉驳回') }}>
            <a> {text == '已整改' ? '整改驳回' : '申诉驳回'} </a>
          </a>
        </>
        }</div>
        )
      }

    }
  ]


  const [previewVisible, setPreviewVisible] = useState(false)
  const [photoIndex, setPhotoIndex] = useState(0); //预览附件Index
  const [imgUrlList, setImgUrlList] = useState([]);//预览附件列表
  const [previewTitle, setPreviewTitle] = useState([]);//预览附件名称

  const onPreviewImg = (file, type) => {
    const imageList = type == 1 ? filesList : filesList2
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
      setImgUrlList(imgData)
    }
    setPhotoIndex(imageListIndex)
    setPreviewVisible(true)
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
  }
  const uploadProps = { //查看照片附件  运维人员提交
    accept: 'image/*',
    listType: "picture-card",
    onPreview: async file => { //预览
      onPreviewImg(file, 1)
    },
    fileList: filesList,
    showUploadList: { showRemoveIcon: false },
  };

  const filesCuid = form.getFieldValue('checkFile') ? form.getFieldValue('checkFile') : cuid()
  const [filesList2, setFilesList2] = useState([])

  const uploadProps2 = { // 核查问题照片附件 上传
    action: '/api/rest/PollutantSourceApi/UploadApi/PostFiles',
    listType: "picture-card",
    accept: 'image/*',
    data: {
      FileUuid: filesCuid,
      FileActualType: '0',
    },
    beforeUpload: (file) => {
      const fileType = file?.type; //获取文件类型 type  image/*
      if (!(/^image/g.test(fileType))) {
        message.error(`请上传图片格式文件!`);
        return;
      }
    },
    onChange(info) {
      const fileList = info.fileList.map(item => {
        if (item.response && item.response.IsSuccess) { //刚上传的
          return { ...item, url: `/upload/${item.response.Datas}`, }
        } else {
          return { ...item }
        }
      })

      if (info.file.status == 'uploading') {
        setFilesList2(fileList)
      }
      if (info.file.status === 'done') {
        form.setFieldsValue({ checkFile: filesCuid })
        setFilesList2(fileList)
        message.success(`${info.file.name} 上传成功`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败`);
        setFilesList2(fileList)
      } else if (info.file.status === 'removed') { //删除状态
        form.setFieldsValue({ checkFile: filesCuid })
        setFilesList2(fileList)
      }
    },
    onRemove: (file) => {
      if (!file.error) {
        props.deleteAttach(file)
      }

    },
    onPreview: file => { //预览
      onPreviewImg(file, 2)
    },
    fileList: filesList2
  };
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );
  const auditStatus = {
    '整改通过': 3,
    '整改驳回': 4,
    '申诉通过': 6,
    '申诉驳回': 7,
  }
  const [passLoading,setPassLoading ] = useState(false)
  const pass = (record,status) => { //整改或申诉通过
    setPassLoading(true)
    props.updateKeyParameterQuestionStatus({
      id: record.id,
      checkResult : record.checkStatus,
      AuditStatus:auditStatus[status],
    }, (isSuccess) => {
      setPassLoading(false)
      isSuccess && props.getKeyParameterQuestionDetailList({ id: id })
    })
  }

  const [rejectVisible, setRejectVisible] = useState(false)
  const [rejectTitle, setRejectTitle] = useState(null)
  const reject = (record,status) => { //驳回弹框
    setRejectVisible(true)
    record.status == 1 ? setRejectTitle('整改驳回') : setRejectTitle('申诉驳回')
    form.setFieldsValue({
      checkRemark: record.checkReamrk,
      checkResult: record.checkStatus,
      id: record.id,
      AuditStatus:auditStatus[status],
    })
    /*附件 */
    setFilesList2([])
    if (record.checkFileList && record.checkFileList[0]) {
      const fileList2 = [];
      record.checkFileList.map((item, index) => {
        if (!item.IsDelete) {
          fileList2.push({ name: item.FileActualName, url: `/upload/${item.FileName}`, status: 'done', uid: item.GUID, })
        }
      })
      setFilesList2(fileList2)
      form.setFieldsValue({ checkFile: record.checkFileList[0].FileUuid, })
    } else {
      form.setFieldsValue({ checkFile: undefined, })
    }
  }
  const jectOk = async () => {//整改或申诉通过 
    try {
      const values = await form.validateFields();
      props.updateKeyParameterQuestionStatus({
        ...values,
      }, (isSuccess) => {
        if(isSuccess){
          setRejectVisible(false)
          props.getKeyParameterQuestionDetailList({ id: id })
        }
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }

  if (type == 2) {
    columns = columns.filter(item => item.title != '操作')
  }

  return (
    <div>
      <Form>
        <div style={{ padding: '8px 0' }}>
          <Row>
            <Col span={12}>
              <Form.Item label="企业名称" >
                {infoData && infoData.entName}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label='监测点名称' >
                {infoData && infoData.pointName}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="运维人员"   >
                {infoData && infoData.operationUserName}
              </Form.Item>
            </Col >
            <Col span={12}>
              <Form.Item label="提交时间" >
                {infoData && infoData.createTime}
              </Form.Item>
            </Col >
            <Col span={12}>
              <Form.Item label="核查人员"   >
                {infoData && infoData.checkUserName}
              </Form.Item>
            </Col >
            <Col span={12}>
              <Form.Item label="核查日期" >
                {infoData && infoData.checkTime}
              </Form.Item>
            </Col >
          </Row>
        </div>
      </Form>

      <div>
        <SdlTable
          dataSource={tableDatas}
          columns={columns}
          pagination={false}
          loading={tableLoading || passLoading}
          scroll={{y: 'hidden',}}
        />

      </div>
      <Modal
        title='查看附件'
        visible={fileVisible}
        footer={null}
        destroyOnClose
        onCancel={() => { setFileVisible(false) }}
        width={'50%'}
      >
        <Upload {...uploadProps} style={{ width: '100%' }} />
      </Modal>
      {previewVisible && <Lightbox
        mainSrc={imgUrlList[photoIndex]}
        nextSrc={imgUrlList[(photoIndex + 1) % imgUrlList.length]}
        prevSrc={imgUrlList[(photoIndex + imgUrlList.length - 1) % imgUrlList.length]}
        onCloseRequest={() => setPreviewVisible(false)}
        onPreMovePrevRequest={() =>
          setPhotoIndex((photoIndex + imgUrlList.length - 1) % imgUrlList.length)
        }
        onPreMoveNextRequest={() =>
          setPhotoIndex((photoIndex + 1) % imgUrlList.length)
        }
      />}
      <Modal
        title={rejectTitle}
        visible={rejectVisible}
        onOk={() => { jectOk() }}
        destroyOnClose
        onCancel={() => { setRejectVisible(false) }}
        width={'50%'}
        wrapClassName={styles.rejectSty}
        confirmLoading={props.saveLoading}
      >
        <Form
          name="basics"
          form={form}
        >
          <Form.Item name="id" hidden >
            <Input />
          </Form.Item>
          <Form.Item name="checkResult" hidden >
            <Input />
          </Form.Item>
          <Form.Item name="AuditStatus" hidden >
            <Input />
          </Form.Item>
          <Form.Item
            label="核查问题描述"
            name="checkRemark"
            rules={[{ required: true, message: '请输入核查问题描述' }]}
          >
            <TextArea placeholder='请输入' rows={4} />
          </Form.Item>
          <Form.Item
            label="核查问题照片附件"
            name="checkFile"
          >
            <Upload
              {...uploadProps2}
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>上传</div>
              </div>
            </Upload>
          </Form.Item>
        </Form>

      </Modal>
    </div>

  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);