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




const dvaPropsData = ({ loading, supervisionManager, global, common }) => ({
  tableDatas:cruxParSupervisionRectifica.parameterQuestionDetailList,
  tableLoading: loading.effects[`${namespace}/getKeyParameterQuestionDetailList`],

})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
    getKeyParameterQuestionDetailList: (payload, callback) => {//详情
      dispatch({
        type: `${namespace}/getKeyParameterQuestionDetailList`,
        payload: payload,
        callback: callback,
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


  const { tableDatas,tableLoading, id, pollutantType, type, } = props;

  const [form] = Form.useForm();

  const [infoData, seInfoList] = useState(null)

  useEffect(() => {
    props.getKeyParameterQuestionList({ id: id })
  }, []);

  const TitleComponents = (props) => {
    return <div style={{ display: 'inline-block', fontWeight: 'bold', padding: '2px 4px', marginBottom: 16, borderBottom: '1px solid rgba(0,0,0,.1)' }}>{props.text}</div>

  }
  const [filesList, setFilesList] = useState([{
    uid: '-1',
    name: 'image.png',
    status: 'done',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  },]);
  const [fileVisible, setFileVisible] = useState(false)

  const getAttachmentData = (fileInfo) => {
    setFileVisible(true)
    // const fileList = [];
    // if (fileInfo) {
    //   fileInfo.split(',').map(item,index => {
    //     if (!item.IsDelete) {
    //       fileList.push({ name: item, url: item, status: 'done',  uid: index, })
    //     }
    //   })
    // }
    // setFilesList(fileList)
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
      dataIndex: 'ContentItem',
      key: 'ContentItem',
      align: 'center',
      width: 200,
    },
    {
      title: '核查整改次数',
      dataIndex: 'ContentItem',
      key: 'ContentItem',
      align: 'center',
      width: 200,
    },
    {
      title: `核查问题描述`,
      dataIndex: 'Inspector',
      key: 'Inspector',
      align: 'center',
      width: 200,
    },
    {
      title: '核查问题照片附件',
      dataIndex: 'Attachments',
      key: 'Attachments',
      align: 'center',
      width: 170,
      render: (text, record) => {
        return <div>
          <a onClick={() => { getAttachmentData(text) }}>查看附件</a>
        </div>
      },
    },
    {
      title: `核查问题提交时间`,
      dataIndex: 'Inspector',
      key: 'Inspector',
      align: 'center',
      width: 200,
    },
    {
      title: `整改/申诉描述`,
      dataIndex: 'Inspector',
      key: 'Inspector',
      align: 'center',
      width: 200,
    },
    {
      title: `整改/申诉照片附件`,
      dataIndex: 'Inspector',
      key: 'Inspector',
      align: 'center',
      width: 200,
      render: (text, record) => {
        return <div>
          <a onClick={() => { getAttachmentData(text) }}>查看附件</a>
        </div>
      },
    },
    {
      title: `整改/申诉提交时间`,
      dataIndex: 'Inspector',
      key: 'Inspector',
      align: 'center',
      width: 200,
    },
    {
      title: `状态`,
      dataIndex: 'Inspector',
      key: 'Inspector',
      align: 'center',
      width: 100,
      render: (text, record) => {
        return text === '待下发' ? <span style={{ color: '#f5222d' }}>{text}</span> : <span>{text}</span>
      }
    },
    {
      title: '操作',
      dataIndex: 'Inspector',
      key: 'Inspector',
      align: 'center',
      fixed: 'right',
      width: 150,
      render: (text, record) => {
        return (<>
          <Popconfirm title={text==1? "确定要整改通过？" : "确定要申诉通过？"} placement="left" onConfirm={() => reject(record)} okText="是" cancelText="否">
           <a> {text==1? '整改通过' : '申诉通过'} </a>
          </Popconfirm>
          <Divider type="vertical" />
          <a onClick={() => { pass(record,text) }}>   
           <a> {text==1? '整改驳回' : '申诉驳回'} </a>       
            </a>
        </>
        )
      }

    }
  ]
  const [passVisible, setPassVisible] = useState(false)
  const [passTitle,setPassTitle] = useState(null)
  const pass = (record,type) => {
    setPassVisible(true)
    type==1? setPassTitle('整改通过') :  setPassTitle('申诉通过')
  }
  const reject = (record) => {

  }



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

  const [filesCuid, setFilesCuid] = useState(cuid())
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
        form.setFieldsValue({ File: filesCuid })
        setFilesList2(fileList)
        message.success(`${info.file.name} 上传成功`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败`);
        setFilesList2(fileList)
      } else if (info.file.status === 'removed') { //删除状态
        form.setFieldsValue({ File: filesCuid })
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
  const passOK = async () => {
    try {
      const values = await form.validateFields();
      props.getInspectorOperationManageList({
        ...values,
      }, () => {

      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }

  if (type == 2) {
    columns = columns.filter(item => item.title != '操作')
  }

  return (
    <div className={'passDetail'} >
      <div style={{ fontSize: 16, padding: 6, textAlign: 'center', fontWeight: 'bold' }}>运维督查表</div>
        <Form>
          <div style={{padding:'8px 0'}}> 
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
                 {infoData && moment(infoData.checkTime).format('YYYY-MM-DD')}
                </Form.Item>
              </Col >
            </Row>
          </div>
        </Form>

        <div className={'passDetail'}>
          <SdlTable
            dataSource={tableDatas}
            columns={columns}
            pagination={false}
            loading={tableLoading}
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
        title={passTitle}
        visible={passVisible}
        onOk={() => { passOK }}
        destroyOnClose
        onCancel={() => { setPassVisible(false) }}
        width={'50%'}
        wrapClassName={styles.passOKSty}
      >
        <Form
          name="basics"
          form={form}
        >

          <Form.Item
            label="核查状态"
            name="aa"
            rules={[{ required: true, message: '请选择核查状态' }]}
          >
            <Radio.Group>
              <Radio value={1}>已通过</Radio>
              <Radio value={2}>未通过</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="核查问题描述"
            name="bb"
            rules={[{ required: true, message: '请输入核查问题描述' }]}
          >
            <TextArea placeholder='请输入' rows={4} />
          </Form.Item>
          <Form.Item
            label="核查问题照片附件"
            name="file"
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