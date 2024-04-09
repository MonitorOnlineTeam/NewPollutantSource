/**
 * 功  能：设备安装审核 设备安装规范性  审核组件
 * 创建人：jab
 * 创建时间：2024.04
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Upload, Popconfirm, Radio,Result, Steps, Image, Form, Tag, Skeleton, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Spin, Empty } from 'antd';
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, ProfileOutlined, AmazonCircleFilled, AuditOutlined, } from '@ant-design/icons';
import { connect } from "dva";
const { RangePicker } = DatePicker;
import Cookie from 'js-cookie';
import config from '@/config';
import ImageView from '@/components/ImageView';
import ViewPhotos from './ViewPhotos';
import HandlingSugges from './HandlingSugges';


import { API } from '@config/API';
import cuid from 'cuid';
import styles from "../style.less"
const { Step } = Steps;
const namespace = 'installaEquipment'

const dvaPropsData = ({ loading, installaEquipment, global, }) => ({
  auditPhotoLoading: loading.effects[`${namespace}/GetAuditPhoto`],
  addAuditInfoLoading: loading.effects[`${namespace}/AddAuditInfo`],
  configInfo: global.configInfo,
})

const Index = (props) => {



  const [form2] = Form.useForm();



  const { addAuditInfoLoading,visible,title, data} = props;
 
  const [isImageViewOpen, setIsImageViewOpen] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [imageList, setImageList] = useState([]);



  useEffect(() => {
    if(visible){
    const row = data
    SetCurrent(0)
    props.dispatch({
      type: `${namespace}/GetAuditPhoto`,
      payload: {
        systemModelId: row.Col1,
        dispatchId: row.DispatchId,
        pointId: row.PointId,
        equipmentAuditId: row.EquipmentAuditId,
      }
    });
  }
  }, [visible]);





  const [files, setFiles] = useState(cuid()) 
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
  const ExamineComponents = () => {
    return <div style={{padding:'14px 18px 0 18px'}}>
      <Form
      form={form2}
      name="advanced_search2"
      className={'ant-advanced-search-form2'}
    >
      <Form.Item name='auditResults' label='审核结果'  rules={[{ required: true, message: '请选择审核结果！' }]}>
        <Radio.Group>
          <Radio value={1}>优秀</Radio>
          <Radio value={2}>合格</Radio>
          <Radio value={3}>不合格</Radio>
          <Radio value={4}>无照片</Radio>
          <Radio value={5}>/</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item name='opinion' label='审核意见' rules={[{ required: true, message: '请输入审核意见！' }]}>
        <Input.TextArea rows={2} placeholder="请输入" allowClear />
      </Form.Item>
      <Form.Item name='auditFiles' label='附件'>
        <Upload {...uploadProps('auditFiles')} style={{ width: '100%' }}>
          <div>
            <PlusOutlined />
            <div className="ant-upload-text">上传</div>
          </div>
        </Upload>
      </Form.Item>
    </Form>
     <HandlingSugges type={2}/>
      </div>
  }



  const steps = ['安装照片', '审核', '完成']
  const [current, SetCurrent] = useState(0)

  const saveNext = async () => { //下一步
    switch (current) {
      case 0: //安装照片
        SetCurrent(current + 1)
        break;
      case 1: //审核
      const values = await form2.validateFields();
      const par = {
          ...values,
          systemModelId: data.Col1,
          dispatchId: data.DispatchId,
          pointId: data.PointId,
          equipmentAuditId: data.EquipmentAuditId,
          workerID:data.WorkerID,
          projectCode: data.ProjectCode,
          itemCode:  data.ItemCode,
          entName:  data.EntName,
          pointName:  data.PointName,
      }
      props.dispatch({
        type: `${namespace}/AddAuditInfo`,
        payload: {
         ...par
        },
        callback:()=>{
          SetCurrent(current + 1)
        }
      });  
        break;
      case 2: //完成
        setExamineVisible(false)
        break;
      default:
        SetCurrent(0)
        break;
    }
  }
  const prev = () =>{ //上一步
    SetCurrent(current - 1)
  }
  const CompleteComponents = ()=>{
    return  <Result
    status="success"
    title="审核完成"
  />
  }
  return (
    <div className={styles.installaEquipmentSty}>
          <Modal
            visible={visible}
            title={title}
            onCancel={() => { props.onCancel()}}
            destroyOnClose
            mask={false}
            wrapClassName={`spreadOverModal ${styles.modalSty2}`}
            footer={<div className="steps-action">
              {current > 0 && current != steps.length - 1 && (
                <Button
                  onClick={() => prev()}
                >
                  上一步
                </Button>
              )}
              {current <= steps.length - 1 && (
                <Button type="primary" loading={current==1? addAuditInfoLoading : false} onClick={() => saveNext()}>
                  {current < steps.length - 1 ? '下一步' : '完成'}
                </Button>
              )}
            </div>}
          >
            <Steps current={current}>
              {steps.map(item => <Step title={item} />)}
            </Steps>
              <div style={{marginTop:12}}>{current==0? <ViewPhotos /> : current==1 ? <ExamineComponents />  : <CompleteComponents /> } </div>
          </Modal>
                  {/* 查看照片弹窗 */}
        <ImageView
          isOpen={isImageViewOpen}
          images={imageList?.length ? imageList : []}
          imageIndex={imageIndex}
          onCloseRequest={() => {
            setIsImageViewOpen(false);
          }}
          />
    </div>
  );
};
export default connect(dvaPropsData)(Index);