/**
 * 功  能：核查整改详情
 * 创建人：jab
 * 创建时间：2022.11.24
 */
import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm,Upload, Form, Tabs, Typography, Card, Button, Select, Progress, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Spin } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, QuestionCircleOutlined, ProfileOutlined, EditOutlined } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import { getAttachmentArrDataSource } from '@/utils/utils';
import styles from "./style.less"
import Cookie from 'js-cookie';
import AttachmentView from '@/components/AttachmentView'
import cuid from 'cuid';
import Lightbox from "react-image-lightbox-rotate";
import {  API } from '@config/API';
import config from '@/config';
import { uploadPrefix } from '@/config'

const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;


const namespace = 'superviseRectification'




const dvaPropsData = ({ loading, superviseRectification, global, common }) => ({
  detailLoading: loading.effects[`${namespace}/getInspectorRectificationView`],
  passLoading: loading.effects[`${namespace}/updateRectificationStatus`] || false,
  saveLoading: loading.effects[`${namespace}/rejectInspectorRectificationInfo`],
})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
    getInspectorRectificationView: (payload, callback) => {//获取单个督查表实体
      dispatch({
        type: `${namespace}/getInspectorRectificationView`,
        payload: payload,
        callback: callback,
      })

    },
    updateRectificationStatus: (payload, callback) => { //整改通过或申述通过 
      dispatch({
        type: `${namespace}/updateRectificationStatus`,
        payload: payload,
        callback: callback
      })
    },
    rejectInspectorRectificationInfo: (payload, callback) => { //整改驳回或申述驳回 
      dispatch({
        type: `${namespace}/rejectInspectorRectificationInfo`,
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


  const { detailLoading, ID, pollutantType, statusLoading,saveLoading,passLoading, } = props;

  const [operationInfoList, setOperationInfoList] = useState({})
  const [infoList, seInfoList] = useState(null) 
  const [form] = Form.useForm();

  useEffect(() => {
    initData();
  }, []);
    
  const initData = (isRectificat) =>{
    props.getInspectorRectificationView({ ID: ID }, (data) => {
      
      const principleProblemData =  getData(data.PrincipleProblemList)
      const importanProblemData  =  getData(data.importanProblemList)
      const commonlyProblemData  =  getData(data.CommonlyProblemList)
      setOperationInfoList({...data,CommonlyProblemList:commonlyProblemData,PrincipleProblemList:principleProblemData,importanProblemList:importanProblemData})
      !isRectificat&&seInfoList(data.Info && data.Info[0] ? data.Info[0] : null)
    })
  }
  const getData = (data) =>{
    const datas = [];
    if(data&&data[0]){
     data.map((item,index)=>{
      if(item.DataList&&item.DataList[0]){
         item.DataList.map((item2,index2)=>{
          datas.push({
             ...item,
             ...item2,
             SerialNum:index + 1,
             DataList:undefined,
             count:index2==0? item.DataList.length : 0
          })
        })
      }
    })
  }
    return datas;
  }

  const userCookie = Cookie.get('currentUser');
  let userId = '';
  if (userCookie) {
    userId = JSON.parse(userCookie).User_ID;
  }
  const TitleComponents = (props) => {
    return <div style={{ display: 'inline-block', fontWeight: 'bold', padding: '2px 4px', marginBottom: 16, borderBottom: '1px solid rgba(0,0,0,.1)' }}>{props.text}</div>

  }
  const getAttachmentDataSource = (fileInfo) => {
    const fileList = [];
    if (fileInfo) {
      fileInfo.split(',').map(item => {
        if (!item.IsDelete) {
          fileList.push({ name: `${item}`, attach: `/${item}` })
        }
      })
    }
    return fileList;
  }
  const pass =  (record,type) => { //整改或申诉通过
    props.updateRectificationStatus({
      ID: record.Id,
      Status:type,
    }, (isSuccess) => {
      isSuccess &&  initData('rectificat');
    })
  }

  const [rejectVisible, setRejectVisible] = useState(false)
  const [rejectTitle, setRejectTitle] = useState(null)
  const reject = (record,type) => { //驳回弹框
    setRejectVisible(true)
    record.StatusName == '已整改'? setRejectTitle(`整改驳回`) : setRejectTitle(`申诉驳回`)
    form.resetFields();
    setFilesList2([])
    form.setFieldsValue({
      ID: record.Id,
      InspectorType:type,
    })
 
  }
  const jectOk = async () => {//整改或申诉通过 
    try {
      const values = await form.validateFields();
      props.rejectInspectorRectificationInfo({
        ...values,
      }, (isSuccess) => {
        if(isSuccess){
          setRejectVisible(false)
          isSuccess &&  initData('rectificat');
        }
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }

  const rowSpanFun = (value,rowSpans) => {
    let obj = {
      children: value,
      props: { rowSpan: rowSpans || rowSpans===0 ?rowSpans :value  },
    };
    return obj;
  }
  const supervisionCol = (data,totalData) => [{
    title: <span style={{ fontWeight: 'bold', fontSize: 14 }}>
      {data[0].Title}
    </span>,
    align: 'center',
    children: [
      {
        title: '序号',
        align: 'center',
        dataIndex:'SerialNum',
        key: 'SerialNum',
        width:60,
        render: (text, record, index) => {
          return rowSpanFun(text,record.count)
        }
      },
      {
        title: '督查内容',
        dataIndex: 'ContentItem',
        key: 'ContentItem',
        align: 'center',
        width: 'auto',
        render: (text, record, index) => {
          return rowSpanFun(<div style={{ textAlign: "left" }}>{text}</div>,record.count)
        }
      },
      {
        title: '问题/驳回描述',
        dataIndex: 'InspectorProblem',
        key: 'InspectorProblem',
        align: 'center',
        width: 'auto',
        render: (text, record) => {
          return <div style={{ textAlign: "left" }}>{text}</div>
        },
      },
      {
        title: '问题/驳回附件',
        dataIndex: 'InspectorAttachment',
        key: 'InspectorAttachment',
        align: 'center',
        width: 'auto',
        render: (text, record) => {
          const attachmentDataSource = getAttachmentDataSource(text);
          return <div>
            {text && <AttachmentView noDataNoShow dataSource={attachmentDataSource} />}
          </div>
        },
      },
      {
        title: '整改/申诉描述',
        dataIndex: 'RectificationDescribe',
        key: 'RectificationDescribe',
        align: 'center',
        width: 'auto',
        render: (text, record) => {
          return <div style={{ textAlign: "left" }}>{text}</div>
        },
      },
      {
        title: '整改/申诉附件',
        dataIndex: 'RectificationAttachment',
        key: 'RectificationAttachment',
        align: 'center',
        width: 'auto',
        render: (text, record) => {
          const attachmentDataSource = getAttachmentDataSource(text);
          return <div>
            {text && <AttachmentView noDataNoShow dataSource={attachmentDataSource} />}
          </div>
        },
      },
      {
        title: '整改状态',
        dataIndex: 'StatusName',
        key: 'StatusName',
        align: 'center',
        width: 150,
      },
      {
        title: '整改日期',
        dataIndex: 'RectificationDateTime',
        key: 'RectificationDateTime',
        align: 'center',
        width: 'auto',
      },
      {
        title: <span>操作</span>,
        dataIndex: 'Status',
        key:'Status',
        align: 'center',
        fixed: 'right',
        width: 146,
        ellipsis: true,
        render: (text, record) => {  // 1已整改  8整改通过(省区经理) 5申诉中
           const provincialManager = totalData?.Info?.length ?  totalData.Info[0].ProvincialManager :''
           const inspector = totalData?.Info?.length ?  totalData.Info[0].Inspector :''

           if((text == 1 && userId == provincialManager) || (text == 8 && userId==inspector || (text == 5 && userId==inspector))){
            return <div>
               <Popconfirm title={text == 1 || text == 8 ? "确定要整改通过？" : "确定要申诉通过？"} placement="left" onConfirm={() => pass(record,text==8 ? 3 :  text == 1 ?  8 : 6)} okText="是" cancelText="否">
              <a style={{paddingRight:6}}> {text == 1 || text == 8 ? '整改通过' : '申诉通过'} </a>
            </Popconfirm>
               <a  onClick={() => { reject(record ,text==1 || text == 8  ? 1 :  2) }}> { text == 1 || text== 8  ? '整改驳回' : '申诉驳回'} </a>
            </div>
           }
          // return (
          // <div>{(text == '已整改' || text == '申诉中') &&
          //  <>
          //   <Popconfirm title={text == '已整改' ? "确定要整改通过？" : "确定要申诉通过？"} placement="left" onConfirm={() => pass(record,text == '已整改' ? 3 : 6 )} okText="是" cancelText="否">
          //     <a style={{paddingRight:6}}> {text == '已整改' ? '整改通过' : '申诉通过'} </a>
          //   </Popconfirm>
          //   <a onClick={() => { reject(record, text == '已整改' ? 1 : 2) }}>
          //     <a> {text == '已整改' ? '整改驳回' : '申诉驳回'} </a>
          //   </a>
          // </>
          // }</div>
          // )
        }
      },
    ]
  }
  ]

  // const supervisionCol2 = [ {
  //   title: <span style={{fontWeight:'bold',fontSize:14}}>
  //     {operationInfoList.importanProblemList&&operationInfoList.importanProblemList[0]&&operationInfoList.importanProblemList[0].Title}
  //   </span>,
  //   align: 'center',
  //   children:[
  //     {
  //       title: '序号',
  //       align: 'center',
  //       width:100,
  //       render:(text,record,index)=>{
  //        return index+1
  //       }
  //    },
  //   {
  //     title: '督查内容',
  //     dataIndex: 'ContentItem',
  //     key: 'ContentItem',
  //     align: 'center',
  //     width:380,
  //     render: (text, record) => {
  //       return <div style={{textAlign:"left"}}>{text}</div>
  //     },
  //   },
  //   {
  //     title: `扣分`,
  //     dataIndex: 'Inspector',
  //     key: 'Inspector',
  //     align: 'center',
  //     width:200,
  //   },
  //   {
  //     title: '说明',
  //     dataIndex: 'Remark',
  //     key: 'Remark',
  //     align: 'center',
  //     render: (text, record) => {
  //       return <div style={{textAlign:"left"}}>{text}</div>
  //     },
  //    },
  //    {
  //     title: '附件',
  //     dataIndex: 'Attachments',
  //     key: 'Attachments',
  //     align: 'center',
  //     width:120,
  //     render: (text, record) => {
  //       const attachmentDataSource = getAttachmentDataSource(text);
  //       return   <div>
  //          {text&&<AttachmentView noDataNoShow dataSource={attachmentDataSource} />}
  //     </div>
  //     },
  //   },
  //   ]
  //   }]

  //   const supervisionCol3 = [{
  //     title: <span style={{fontWeight:'bold',fontSize:14}}>{operationInfoList.CommonlyProblemList&&operationInfoList.CommonlyProblemList[0]&&operationInfoList.CommonlyProblemList[0].Title}</span>,
  //     align: 'center',
  //     children:[ 
  //       {
  //         title: '序号',
  //         align: 'center',
  //         width:100,
  //         render:(text,record,index)=>{
  //          return index+1
  //         }
  //      },
  //     {
  //       title: '督查内容',
  //       dataIndex: 'ContentItem',
  //       key: 'ContentItem',
  //       align: 'center',
  //       width:380,
  //       render: (text, record) => {
  //         return <div style={{textAlign:"left"}}>{text}</div>
  //       },
  //     },
  //     {
  //       title: `扣分`,
  //       dataIndex: 'Inspector',
  //       key: 'Inspector',
  //       align: 'center',
  //       width:200,
  //     },
  //     {
  //       title: '说明',
  //       dataIndex: 'Remark',
  //       key: 'Remark',
  //       align: 'center',
  //       render: (text, record) => {
  //         return <div style={{textAlign:"left"}}>{text}</div>
  //       },
  //     },
  //     {
  //       title: '附件',
  //       dataIndex: 'Attachments',
  //       key: 'Attachments',
  //       align: 'center',
  //       width:120,
  //       render: (text, record) => {
  //         const attachmentDataSource = getAttachmentDataSource(text);
  //         return   <div>
  //            {text&&<AttachmentView noDataNoShow  dataSource={attachmentDataSource} />}
  //       </div>
  //       },
  //     },
  //   ]
  //     }]
  // const supervisionCol4 = [
  //   {
  //     align: 'center',
  //     width: 480,
  //     render: (text, record, index) => {
  //       return index == 0 ? '总分' : '评价'
  //     },
  //   },
  //   {
  //     key: 'Sort',
  //     render: (text, record, index) => {
  //       if (index == 0) {
  //         return <div>{infoList && infoList.TotalScore} </div>
  //       } else {
  //         return {
  //           children: <div>{infoList && infoList.Evaluate} </div>,
  //           props: { colSpan: 3 },
  //         };
  //       }

  //     }
  //   },
  //   {
  //     key: 'Sort',
  //     align: 'center',
  //     render: (text, record, index) => {
  //       const obj = {
  //         children: '附件',
  //         props: {},
  //       };
  //       if (index === 1) {
  //         obj.props.colSpan = 0;
  //       }
  //       return obj;
  //     }
  //   },
  //   {
  //     key: 'Sort',
  //     render: (text, record, index) => {
  //       const attachmentDataSource = getAttachmentArrDataSource(infoList && infoList.FilesList);
  //       const obj = {
  //         children: <div>
  //           <AttachmentView noDataNoShow style={{ marginTop: 10 }} dataSource={attachmentDataSource} />
  //         </div>,
  //         props: {},
  //       };
  //       if (index === 1) {
  //         obj.props.colSpan = 0;
  //       }
  //       return obj;
  //     }
  //   },
  // ]
  const [previewVisible, setPreviewVisible] = useState(false)
  const [photoIndex, setPhotoIndex] = useState(0); //预览附件Index
  const [imgUrlList, setImgUrlList] = useState([]);//预览附件列表
  const [previewTitle, setPreviewTitle] = useState([]);//预览附件名称

  const onPreviewImg = (file) => {
    const imageList =  filesList2
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
  const filesCuid = form.getFieldValue('InspectorAttachment') ? form.getFieldValue('InspectorAttachment') : cuid()
  const [filesList2, setFilesList2] = useState([])

  const uploadProps2 = { // 核查问题照片附件 上传
    action: API.UploadApi.UploadPicture,
    headers: {Cookie:null, Authorization: "Bearer " + Cookie.get(config.cookieName)},
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
          fileList.push({ ...item, url: `${uploadPrefix}/${item.response.Datas}`, })
        } else if(!item.response ){
          fileList.push({ ...item})
        }
      })

      if (info.file.status == 'uploading') {
        setFilesList2(fileList)
      }
      if (info.file.status === 'done') {
        form.setFieldsValue({ InspectorAttachment: filesCuid })
        setFilesList2(fileList)
        message.success(`${info.file.name} 上传成功`);
      } else if (info.file.status === 'error') {
        form.setFieldsValue({ InspectorAttachment:fileList&&fileList[0]?  filesCuid : undefined }) //有上传成功的取前面的uid 没有则表示没有上传成功的图片
        message.error(`${info.file.name}${info.file&&info.file.response&&info.file.response.Message? info.file.response.Message : '上传失败'}`);
        setFilesList2(fileList)
      } else if (info.file.status === 'removed') { //删除状态
        form.setFieldsValue({ InspectorAttachment:fileList&&fileList[0]?  filesCuid : undefined }) 
        setFilesList2(fileList)
      }
    },
    onRemove: (file) => {
      if (!file.error) {
        props.deleteAttach(file)
      }

    },
    onPreview: file => { //预览
      onPreviewImg(file)
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
  return (
    <div className={'detail'} >
      <div style={{ fontSize: 16, padding: 6, textAlign: 'center', fontWeight: 'bold' }}>核查整改详情</div>

      <Spin spinning={detailLoading  || passLoading}>

        <Form
          name="basics"
        >

          <div className={'essentialInfoSty'}>
            <TitleComponents text='基本信息' />
            <Row style={{padding:'0 20%'}}>
              <Col span={12}>
                <Form.Item label="企业名称" >
                  {infoList && infoList.EntName}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='行政区'>
                  {infoList && infoList.RegionName}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='点位名称' >
                  {infoList && infoList.PointName}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='督查类别' >
                  {infoList && infoList.InspectorTypeName}
                </Form.Item>
              </Col>


              <Col span={12}>
                <Form.Item label="督查人员"   >
                  {infoList && infoList.InspectorName}
                </Form.Item>
              </Col >
              <Col span={12}>
                <Form.Item label="督查日期" >
                  {infoList && infoList.InspectorDate}

                </Form.Item>
              </Col >
              <Col span={12}>
                <Form.Item label="运维人员"  >
                  {infoList && infoList.OperationUserName}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="得分"  >
                  {infoList && infoList.TotalScore}
                </Form.Item>
              </Col>
              <Col span={12}>
               <Form.Item label="省区经理"  >
               {infoList&&infoList.ProvincialManagerName}
               </Form.Item>
            </Col>
            </Row>
          </div>

        </Form>

        <div className={'supervisionDetailSty'}>
          <TitleComponents text='督查内容' />
          {!operationInfoList.PrincipleProblemList && !operationInfoList.importanProblemList && !operationInfoList.CommonlyProblemList ?

            <Table
              bordered
              dataSource={[]}
              columns={[]}
              pagination={false}
              locale={{ emptyText: '暂无模板数据' }}
            />
            :
            <>
              {operationInfoList.PrincipleProblemList && operationInfoList.PrincipleProblemList[0] && <Table
                bordered
                dataSource={operationInfoList.PrincipleProblemList}
                columns={supervisionCol(operationInfoList.PrincipleProblemList,operationInfoList)}
                rowClassName="editable-row"
                pagination={false}
                scroll={{x: 1100}}
              />}
              {operationInfoList.importanProblemList && operationInfoList.importanProblemList[0] && <Table
                bordered
                dataSource={operationInfoList.importanProblemList}
                columns={supervisionCol(operationInfoList.importanProblemList,operationInfoList)}
                rowClassName="editable-row"
                className="impTableSty"
                pagination={false}
                scroll={{x: 1100}}
              />}
              {operationInfoList.CommonlyProblemList && operationInfoList.CommonlyProblemList[0] && <> <Table
                bordered
                dataSource={operationInfoList.CommonlyProblemList}
                columns={supervisionCol(operationInfoList.CommonlyProblemList,operationInfoList)}
                rowClassName="editable-row"
                pagination={false}
                className={'commonlyTableSty'}
                scroll={{x: 1100}}
              /></>}
              {/* <Table
                bordered
                dataSource={[{ Sort: 1 }, { Sort: 2 }]}
                columns={supervisionCol4}
                className="summaryTableSty"
                pagination={false}
              /> */}
            </>
          }

        </div>

      </Spin>
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
          <Form.Item name="ID" hidden >
            <Input />
          </Form.Item>
          <Form.Item name="InspectorType" hidden >
            <Input />
          </Form.Item>
          {/* <Form.Item name="AuditStatus" hidden >
            <Input />
          </Form.Item> */}
          <Form.Item
            label="核查问题描述"
            name="InspectorProblem"
            rules={[{ required: true, message: '请输入核查问题描述' }]}
          >
            <TextArea placeholder='请输入' rows={4} />
          </Form.Item>
          <Form.Item
            label="核查问题照片附件"
            name="InspectorAttachment"
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
    </div>

  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);