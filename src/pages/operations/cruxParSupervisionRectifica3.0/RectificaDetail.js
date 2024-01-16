/**
 * 功  能：督查管理
 * 创建人：jab
 * 创建时间：2022.04.25
 */
import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Table, Input, InputNumber, Upload, Popconfirm, Form, Tabs, Checkbox, Typography, Card, Button, Select, Progress, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Spin } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, QuestionCircleOutlined, ProfileOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
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
import { API } from '@config/API';
import config from '@/config';


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


  const { tableDatas, tableLoading, id, pollutantType, type, infoData, } = props;

  const [rangform] = Form.useForm();
  const [dataform] = Form.useForm();
  const [parform] = Form.useForm();
  const [rejectform] = Form.useForm();


  useEffect(() => {
    props.getKeyParameterQuestionDetailList({ id: id })
  }, []);

  const TitleComponents = (props) => {
    return <div style={{ display: 'inline-block', fontWeight: 'bold', padding: '2px 4px', marginBottom: 16, borderBottom: '1px solid rgba(0,0,0,.1)' }}>{props.text}</div>

  }
  const [filesList, setFilesList] = useState([]);

  const getAttachmentData = (fileInfo) => {
    setPreviewVisible(true)
    const fileList = [];
    fileInfo.map((item, index) => {
      if (!item.IsDelete) {
        fileList.push({ name: item.FileActualName, url: `/${item.FileName}`, status: 'done', uid: item.GUID, })
      }
    })
    setFilesList(fileList)
  }
  const rowSpanFun = (value, rowSpans) => {
    let obj = {
      children: <div>{value}</div>,
      props: { rowSpan: rowSpans || rowSpans === 0 ? rowSpans : value },
    };
    return obj;
  }
  const commonCol1 = [
    {
      title: '序号',
      align: 'center',
      dataIndex: 'level',
      key: 'level',
      render: (text, record, index) => {
        return rowSpanFun(text, record.count)
      }
    },
    {
      title: '监测参数',
      dataIndex: 'typeName',
      key: 'typeName',
      align: 'center',
      width: 200,
    },
  ]
  const commonCol2 = (type) => [
    {
      title: '手工修正结果',
      dataIndex: 'typeName',
      key: 'typeName',
      align: 'center',
      width: 120,
    },
    {
      title: '核查结果',
      dataIndex: 'typeName',
      key: 'typeName',
      align: 'center',
      width: 120,
    },
    {
      title: '运维人员备注',
      dataIndex: 'typeName',
      key: 'typeName',
      align: 'center',
      width: 120,
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
              <Popconfirm title={text == '已整改' ? "确定要整改通过？" : "确定要申诉通过？"} placement="left" onConfirm={() => pass(record, record.checkStatus)} okText="是" cancelText="否">
                <a> {text == '已整改' ? '整改通过' : '申诉通过'} </a>
              </Popconfirm>
              <Divider type="vertical" />
              <a onClick={() => { reject(record, record.checkStatus) }}>
                <a> {text == '已整改' ? '整改驳回' : '申诉驳回'} </a>
              </a>
            </>
          }</div>
        )
      }

    }
  ]
  let rangCol = [
    ...commonCol1,
    {
      title: '有无显示屏',
      dataIndex: 'count',
      key: 'count',
      align: 'center',
      width: 100,
    },
    {
      title: `分析仪量程`,
      dataIndex: 'checkReamrk',
      key: 'checkReamrk',
      align: 'center',
      width: 120,
      render: (text, record) => {
        return <div style={{ textAlign: 'left', whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: text }} ></div>
      },
    },
    {
      title: '分析仪量程照片',
      dataIndex: 'checkFileList',
      key: 'checkFileList',
      align: 'center',
      width: 120,
      render: (text, record) => {
        return <div>{text && text[0] && <a onClick={() => { getAttachmentData(text) }}>查看附件</a>}</div>
      },
    },
    {
      title: `DAS量程`,
      dataIndex: 'questionTime',
      key: 'questionTime',
      align: 'center',
      width: 120,
    },
    {
      title: 'DAS量程照片',
      dataIndex: 'checkFileList',
      key: 'checkFileList',
      align: 'center',
      width: 120,
      render: (text, record) => {
        return <div>{text && text[0] && <a onClick={() => { getAttachmentData(text) }}>查看附件</a>}</div>
      },
    },
    {
      title: `数采仪量程`,
      dataIndex: 'questionTime',
      key: 'questionTime',
      align: 'center',
      width: 120,
    },
    {
      title: '数采仪量程照片',
      dataIndex: 'checkFileList',
      key: 'checkFileList',
      align: 'center',
      width: 120,
      render: (text, record) => {
        return <div>{text && text[0] && <a onClick={() => { getAttachmentData(text) }}>查看附件</a>}</div>
      },
    },
    {
      title: `数采仪量程`,
      dataIndex: 'questionTime',
      key: 'questionTime',
      align: 'center',
      width: 120,
    },
    {
      title: '量程一致性(自动判断)',
      align: 'center',
      dataIndex: 'level',
      key: 'level',
      width: 150,
    },
    ...commonCol2(1),
  ]

  let dataCol = [
    ...commonCol1,
    {
      title: '浓度类型',
      dataIndex: 'count',
      key: 'count',
      align: 'center',
      width: 100,
    },
    {
      title: `分析仪示值`,
      dataIndex: 'checkReamrk',
      key: 'checkReamrk',
      align: 'center',
      width: 120,
      render: (text, record) => {
        return <div style={{ textAlign: 'left', whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: text }} ></div>
      },
    },
    {
      title: 'DAS示值',
      dataIndex: 'checkFileList',
      key: 'checkFileList',
      align: 'center',
      width: 120,
      render: (text, record) => {
        return <div>{text && text[0] && <a onClick={() => { getAttachmentData(text) }}>查看附件</a>}</div>
      },
    },
    {
      title: `数采仪实时数据`,
      dataIndex: 'questionTime',
      key: 'questionTime',
      align: 'center',
      width: 120,
    },
    {
      title: '附件',
      dataIndex: 'checkFileList',
      key: 'checkFileList',
      align: 'center',
      width: 120,
      render: (text, record) => {
        return <div>{text && text[0] && <a onClick={() => { getAttachmentData(text) }}>查看附件</a>}</div>
      },
    },
    {
      title: '量程一致性(自动判断)',
      align: 'center',
      dataIndex: 'level',
      key: 'level',
      width: 150,
    },
    ...commonCol2(1),
  ]
  let parCol = [
    ...commonCol1,
    {
      title: `仪表设定值`,
      dataIndex: 'checkReamrk',
      key: 'checkReamrk',
      align: 'center',
      width: 120,
    },
    {
      title: '仪表设定值照片',
      dataIndex: 'checkFileList',
      key: 'checkFileList',
      align: 'center',
      width: 120,
      render: (text, record) => {
        return <div>{text && text[0] && <a onClick={() => { getAttachmentData(text) }}>查看附件</a>}</div>
      },
    },
    {
      title: `数采仪设定值`,
      dataIndex: 'questionTime',
      key: 'questionTime',
      align: 'center',
      width: 120,
    },
    {
      title: '数采仪设定值照片',
      dataIndex: 'checkFileList',
      key: 'checkFileList',
      align: 'center',
      width: 120,
      render: (text, record) => {
        return <div>{text && text[0] && <a onClick={() => { getAttachmentData(text) }}>查看附件</a>}</div>
      },
    },
    {
      title: `溯源值`,
      dataIndex: 'questionTime',
      key: 'questionTime',
      align: 'center',
      width: 120,
    },
    {
      title: 'D溯源值照片',
      dataIndex: 'checkFileList',
      key: 'checkFileList',
      align: 'center',
      width: 120,
      render: (text, record) => {
        return <div>{text && text[0] && <a onClick={() => { getAttachmentData(text) }}>查看附件</a>}</div>
      },
    },

    ...commonCol2(1),
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
  /*数据一致性程照片 */
  const [dataFile, setDataFile] = useState() //数据一致性程照片
  const [dataFileList, setDataFileList] = useState([])

  /*量程一致性程照片 */
  const [analyzerFile, setAnalyzerFile] = useState() //分析仪照片
  const [analyzerFileList, setAnalyzerFileList] = useState([])

  const [dasRangeFile, setDasRangeFile] = useState() //das量程照片
  const [dasFileList, setDasFileList] = useState([])

  const [dataRangeFile, setDataRangeFile] = useState() //数采仪量程照片
  const [dataRangeFileList, setDataRangeFileList] = useState([])

  /*参数一致性程照片 */
  const [settingFilePar, setSettingFilePar] = useState() //仪表设定值照片
  const [settingFileCuidList, setSettingFileCuidList] = useState([])
  const [settingFileList, setSettingFileList] = useState([])

  const [dasFilePar, setDasFilePar] = useState() // DAS设定值照片
  const [dasFileCuidList, setDasFileCuidList] = useState([])

  const [dataSetFile, setDataSetFile] = useState() //数采仪设定值照片
  const [dataSetFileList, setDataSetFileList] = useState([])

  const [traceabilityFile, setTraceabilityFile] = useState() //溯源值照片
  const [traceabilityFileList, setTraceabilityFileList] = useState([])


  const filesCuid = rangform.getFieldValue('checkFile') ? rangform.getFieldValue('checkFile') : cuid()
  const [filesList2, setFilesList2] = useState([])

  const uploadProps = { // 核查问题照片附件 上传
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

      if (info.file.status == 'uploading') {
        setFilesList2(fileList)
      }
      if (info.file.status === 'done') {
        rangform.setFieldsValue({ checkFile: filesCuid })
        setFilesList2(fileList)
        message.success(`${info.file.name} 上传成功`);
      } else if (info.file.status === 'error') {
        rangform.setFieldsValue({ checkFile: fileList && fileList[0] ? filesCuid : undefined }) //有上传成功的取前面的uid 没有则表示没有上传成功的图片
        message.error(`${info.file.name}${info.file && info.file.response && info.file.response.Message ? info.file.response.Message : '上传失败'}`);
        setFilesList2(fileList)
      } else if (info.file.status === 'removed') { //删除状态
        rangform.setFieldsValue({ checkFile: fileList && fileList[0] ? filesCuid : undefined })
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
  const [passLoading, setPassLoading] = useState(false)
  const pass = (record, status) => { //整改或申诉通过
    setPassLoading(true)
    props.updateKeyParameterQuestionStatus({
      id: record.id,
      checkResult: 2,
      AuditStatus: status
    }, (isSuccess) => {
      setPassLoading(false)
      isSuccess && props.getKeyParameterQuestionDetailList({ id: id })
    })
  }

  const [rejectVisible, setRejectVisible] = useState(false)
  const [rejectTitle, setRejectTitle] = useState(null)
  const reject = (record, status) => { //驳回弹框
    setRejectVisible(true)
    record.checkStatusName == '已整改' ? setRejectTitle('整改驳回') : setRejectTitle('申诉驳回')
    form.resetFields();
    form.setFieldsValue({
      id: record.id,
      AuditStatus: status,
      checkResult: 1,
      // checkRemark: record.checkReamrk,
    })
    /*附件 */
    setFilesList2([])
    // if (record.checkFileList && record.checkFileList[0]) {
    //   const fileList2 = [];
    //   record.checkFileList.map((item, index) => {
    //     if (!item.IsDelete) {
    //       fileList2.push({ name: item.FileActualName, url: `/${item.FileName}`, status: 'done', uid: item.GUID, })
    //     }
    //   })
    //   setFilesList2(fileList2)
    //   form.setFieldsValue({ checkFile: record.checkFileList[0].FileUuid, })
    // } else {
    //   form.setFieldsValue({ checkFile: undefined, })
    // }
  }
  const jectOk = async () => {//整改或申诉通过 
    try {
      const values = await form2.validateFields();
      props.updateKeyParameterQuestionStatus({
        ...values,
      }, (isSuccess) => {
        if (isSuccess) {
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
  const manualOptions = [
    { label: '是', value: 1 },
    { label: '否', value: 2 },
    { label: '不适用', value: 3 },
    { label: '不规范', value: 4 },
  ]
  const [manualVal,setManualVal] = useState([])
  const onManualChange=(value,name)=>{
      // 如果选中的复选框数量为1，则更新selectedValue状态
    if (value?.length === 1) {
      rangform.setFieldsValue({[name]:value})
    }else{
      const selectVal = rangform.getFieldsValue()
      const val = selectVal[name]
      console.log(value,val)
    }
  }
  const [rectificationVisible, setRectificationVisible] = useState(true)
  const [rectificationTitle, setRectificationTitle] = useState(null)
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
        <Tabs defaultActiveKey="1">
          <TabPane tab="数据一致性核查" key="1">
            <SdlTable
              dataSource={tableDatas}
              columns={dataCol}
              pagination={false}
              loading={tableLoading || passLoading}
              scroll={{ y: 'hidden', }}
              rowClassName={null}
            />
          </TabPane>
          <TabPane tab="参数一致性核查" key="2">
            <SdlTable
              dataSource={tableDatas}
              columns={parCol}
              pagination={false}
              loading={tableLoading || passLoading}
              scroll={{ y: 'hidden', }}
              rowClassName={null}
            />
          </TabPane>
          <TabPane tab="量程一致性核查" key="3">
            <SdlTable
              dataSource={tableDatas}
              columns={rangCol}
              pagination={false}
              loading={tableLoading || passLoading}
              scroll={{ y: 'hidden', }}
              rowClassName={null}
            />
          </TabPane>
        </Tabs>
      </div>
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
        imageTitle={`${photoIndex + 1}/${imgUrlList.length}`}
      />}
      <Modal
        title={rectificationTitle}
        visible={rectificationVisible}
        onOk={() => { jectOk() }}
        destroyOnClose
        onCancel={() => { setRectificationVisible(false) }}
        width={'50%'}
        zIndex={100000}
        wrapClassName={styles.rectificationModelSty}
      >
        <Form
          name="basics1"
          form={rangform}
          className={'rangformSty'}
        >
          <Row>
            <Col span={12}>
              <Form.Item label="分析仪量程" name="ProjectName" >
                <Row>
                  <Form.Item name={`AnalyzerRang1`} >
                    <InputNumber placeholder='最小值' />
                  </Form.Item>
                  <span style={{ padding: '0 2px', marginBottom: 12 }}> - </span>
                  <Form.Item name={`AnalyzerRang2`} >
                    {/* onBlur={() => { isJudge(record, 1) }}  */}
                    <InputNumber placeholder='最大值' />
                  </Form.Item>
                  <Form.Item name={`AnalyzerUnit`} style={{ marginLeft: 5 }} >
                    <Select allowClear placeholder='单位列表'>
                      <Option value={1}>{1111}</Option>
                    </Select>
                  </Form.Item>
                </Row>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name='Files' label='分析仪照片'>
                <Upload {...uploadProps} style={{ width: '100%' }}>
                  <Button icon={<UploadOutlined />}>上传照片</Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="DAS量程" name="ProjectName" >
                <Row>
                  <Form.Item name={`AnalyzerRang1`} >
                    <InputNumber placeholder='最小值' />
                  </Form.Item>
                  <span style={{ padding: '0 2px', marginBottom: 12 }}> - </span>
                  <Form.Item name={`AnalyzerRang2`} >
                    <InputNumber placeholder='最大值' />
                  </Form.Item>
                  <Form.Item name={`AnalyzerUnit`} style={{ marginLeft: 5 }} >
                    <Select allowClear placeholder='单位列表'>
                      <Option value={1}>{1111}</Option>
                    </Select>
                  </Form.Item>
                </Row>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name='Files' label='DAS量程照片'>
                <Upload {...uploadProps} style={{ width: '100%' }}>
                  <Button icon={<UploadOutlined />}>上传照片</Button>
                </Upload>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="数采仪量程" name="ProjectName" >
                <Row>
                  <Form.Item name={`AnalyzerRang1`} >
                    <InputNumber placeholder='最小值' />
                  </Form.Item>
                  <span style={{ padding: '0 2px', marginBottom: 12 }}> - </span>
                  <Form.Item name={`AnalyzerRang2`} >
                    <InputNumber placeholder='最大值' />
                  </Form.Item>
                  <Form.Item name={`AnalyzerUnit`} style={{ marginLeft: 5 }} >
                    <Select allowClear placeholder='单位列表'>
                      <Option value={1}>{1111}</Option>
                    </Select>
                  </Form.Item>
                </Row>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name='Files' label='数采仪量程照片'>
                <Upload {...uploadProps} style={{ width: '100%' }}>
                  <Button icon={<UploadOutlined />}>上传照片</Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name={`Uniform`} label='一致性'>
                <Radio.Group disabled>
                  <Radio value={1}>是</Radio>
                  <Radio value={2}>否</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name={`RangCheck`} label='手工修正结果'>
                <Checkbox.Group options={manualOptions} value={manualVal} onChange={(val,e) => { onManualChange(val,'RangCheck', 1) }} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="备注"
                name="checkRemark"
                rules={[{ required: true, message: '请输入备注' }]}
              >
                <TextArea placeholder='请输入' rows={4} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="CreateUserID" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="deleteFlag" hidden>
            <Input />
          </Form.Item>
        </Form>

      </Modal>
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
          form={rejectform}
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
            label="备注"
            name="checkRemark"
            rules={[{ required: true, message: '请输入备注' }]}
          >
            <TextArea placeholder='请输入' rows={4} />
          </Form.Item>
        </Form>

      </Modal>
    </div>

  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);