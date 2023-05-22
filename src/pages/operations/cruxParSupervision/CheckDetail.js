/**
 * 功  能：关键参数督查
 * 创建人：jab
 * 创建时间：2023.02.05
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


const namespace = 'cruxParSupervision'




const dvaPropsData = ({ loading, cruxParSupervision, global, common }) => ({
  tableLoading: loading.effects[`${namespace}/getKeyParameterCheckDetailList`] || loading.effects[`${namespace}/deleteKeyParameterItemCheck`] || false,
  checkSaveLoading: loading.effects[`${namespace}/checkItemKeyParameter`],
  tableDatas: cruxParSupervision.checkDetailData,
  editCheckTime: cruxParSupervision.editCheckTime,
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
    getKeyParameterCheckDetailList: (payload) => {//获取关键参数核查列表详情
      dispatch({
        type: `${namespace}/getKeyParameterCheckDetailList`,
        payload: payload,
      })
    },
    checkItemKeyParameter: (payload,callback) => { //核查
      dispatch({
        type: `${namespace}/checkItemKeyParameter`,
        payload: payload,
        callback: callback
      })
    },
    deleteKeyParameterItemCheck: (payload,callback) => { //清除关键参数核查项
      dispatch({
        type: `${namespace}/deleteKeyParameterItemCheck`,
        payload: payload,
        callback: callback
      })
    },
  }
}




const Index = (props) => {

  const { tableDatas,tableLoading, id, pollutantType, type, checkSaveLoading,infoData,} = props;

  const [form] = Form.useForm();

  useEffect(() => {
    props.getKeyParameterCheckDetailList({ id: id })
    props.updateState({editCheckTime:infoData&&infoData.checkTime? moment(infoData.checkTime) : moment() })  
  }, []);

  const TitleComponents = (props) => {
    return <div style={{ display: 'inline-block', fontWeight: 'bold', padding: '2px 4px', marginBottom: 16, borderBottom: '1px solid rgba(0,0,0,.1)' }}>{props.text}</div>

  }
  const [filesList, setFilesList] = useState([]);
  const [fileVisible, setFileVisible] = useState(false)

  const getAttachmentData = (fileInfo) => {
    setFileVisible(true)
    const fileList = [];
      fileInfo.map((item,index) => { 
        if (!item.IsDelete) {
          fileList.push({ name: item.FileActualName, url: `/upload/${item.FileName}`, status: 'done',  uid: item.GUID, })
        }
      })
    setFilesList(fileList)
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
      title: '备注(运维人员提交)',
      dataIndex: 'remark',
      key: 'remark',
      align: 'center',
      width: 200,
    },
    {
      title: '照片附件(运维人员提交)',
      dataIndex: 'fileList',
      key: 'fileList',
      align: 'center',
      width: 170,
      render: (text, record) => {
        return <div>
         {text&&text[0]&&<a onClick={() => { getAttachmentData(text) }}>查看附件</a>}
        </div>
      },
    },
    {
      title: `核查状态`,
      dataIndex: 'checkStatusName',
      key: 'checkStatusName',
      align: 'center',
      width: 200,
      render: (text, record) => {
        return  <span style={{ color: text === '未通过' ? '#f5222d' : text === '已通过' ? '#52c41a' : ''}}>{text}</span> 
      }
    },
    {
      title: `核查问题描述`,
      dataIndex: 'checkReamrk',
      key: 'checkReamrk',
      align: 'center',
      width: 200,
    },
    {
      title: `核查问题照片附件`,
      dataIndex: 'checkFileList',
      key: 'checkFileList',
      align: 'center',
      width: 200,
      render: (text, record) => {
        return <div>
          {text&&text[0]&&<a onClick={() => { getAttachmentData(text) }}>查看附件</a>}
        </div>
      },
    },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      width: 150,
      render: (text, record) => {
        return (<>
          <a onClick={() => { check(record) }}> 核查  </a>
          <Divider type="vertical" />
          <Popconfirm title="确定要清除此条核查记录？" placement="left" onConfirm={() => clear(record)} okText="是" cancelText="否">
            <a>
              清除
                </a>
          </Popconfirm>
        </>
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
        return false;
      }
    },
    onChange(info) {
      
      const fileList = [];
      info.fileList.map(item => {
        if (item.response && item.response.IsSuccess) { //刚上传的
          fileList.push({ ...item, url: `/upload/${item.response.Datas}`, })
        } else if(!item.response ){
          fileList.push({ ...item})
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
        form.setFieldsValue({ checkFile:fileList&&fileList[0]?  filesCuid : undefined }) //有上传成功的取前面的uid 没有则表示没有上传成功的图片
        setFilesList2(fileList)
        message.error(`${info.file.name}${info.file&&info.file.response&&info.file.response.Message? info.file.response.Message : '上传失败'}`);
      } else if (info.file.status === 'removed') { //删除状态
        form.setFieldsValue({ checkFile:fileList&&fileList[0]?  filesCuid : undefined }) 
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
  const clear = (record) => {
    props.deleteKeyParameterItemCheck({id: record.id}, (isSuccess) => {
      isSuccess&&props.getKeyParameterCheckDetailList({ id: id })
    })
  }

  const [checkVisible, setCheckVisible] = useState(false)
  const [checkTitle, setCheckTitle] = useState()

  const check = (record) => {
    setCheckVisible(true)
    form.setFieldsValue({
      checkResult:record.checkStatus,
      checkRemark:record.checkReamrk,
      id:record.id,
      typeID:record.typeID,
    })
    setCheckResultVal(record.checkStatus)
    setCheckTitle(record.typeName)
    /*附件 */
    setFilesList2([])
    if(record.checkFileList && record.checkFileList[0]){
     const fileList2 = [];
     record.checkFileList.map((item,index) => { 
      if (!item.IsDelete) {
        fileList2.push({ name: item.FileActualName, url: `/upload/${item.FileName}`, status: 'done',  uid: item.GUID, })
      }
    })
    setFilesList2(fileList2)
    form.setFieldsValue({ checkFile:record.checkFileList[0].FileUuid,})
    }else{
    form.setFieldsValue({ checkFile:undefined,})
   }
  }

  const checkOK = async () => { //核查保存
    try {
      const values = await form.validateFields();
      props.checkItemKeyParameter({
        ...values,
      }, (isSuccess) => {
        if(isSuccess){
          setCheckVisible(false)
          props.getKeyParameterCheckDetailList({ id: id })
        }
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }

  if (type == 2) {
    columns = columns.filter(item => item.title != '操作')
  }
  const [checkResultVal,setCheckResultVal] = useState()
  useEffect(() => {
    form.validateFields(['checkRemark']);
  }, [checkResultVal]);
 
  return (
    <div className={'checkDetail'} >
      {/* <div style={{ fontSize: 16, padding: 6, textAlign: 'center', fontWeight: 'bold' }}>{type==1? '核查':'详情'}</div> */}
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
                  {type == 1 ? <DatePicker 
                  allowClear={false}
                  defaultValue={infoData&&infoData.checkTime? moment(infoData.checkTime) : moment()}
                  onChange={(date, dateString) => {
                     props.updateState({editCheckTime:date })  
                  }} />
                    :
                    <div>{infoData&&infoData.checkTime&& moment(infoData.checkTime).format('YYYY-MM-DD')}</div>
                  }
                </Form.Item>
              </Col >
            </Row>
          </div>
        </Form>
        <SdlTable
            resizable
            bordered
            dataSource={tableDatas}
            loading={tableLoading}
            columns={columns}
            scroll={{y: 'hidden',}}
            pagination={false}
          />
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
        imageTitle={`${photoIndex+1}/${imgUrlList.length}`}
      />}
      <Modal
        title={checkTitle}
        visible={checkVisible}
        onOk={() => { checkOK() }}
        destroyOnClose
        onCancel={() => { setCheckVisible(false) }}
        width={'50%'}
        wrapClassName={styles.checkOKSty}
        confirmLoading={checkSaveLoading}
      >
        <Form
          name="basics"
          form={form}
          initialValues={{checkResult:3}}
        >
          <Form.Item name="typeID" hidden >
            <Input />
          </Form.Item>
          <Form.Item name="id" hidden >
            <Input />
          </Form.Item>
          <Form.Item
            label="核查状态"
            name="checkResult"
            rules={[{ required:true, message: '请选择核查状态' }]}
          >
            <Radio.Group onChange={(e)=>{setCheckResultVal(e.target.value)}}>
              <Radio value={2}>已通过</Radio>
              <Radio value={3}>未通过</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="核查问题描述"
            name="checkRemark"
            rules={[{ required: checkResultVal==3? true : false, message: '请输入核查问题描述' }]}
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