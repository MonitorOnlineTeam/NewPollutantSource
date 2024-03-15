/**
 * 功  能：交接和报告
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
import {  API } from '@config/API';
import config from '@/config';

const { Option } = Select;

const namespace = 'handoverReport'




const dvaPropsData = ({ loading, handoverReport, global, }) => ({
  tableDatas: handoverReport.tableDatas,
  tableLoading: loading.effects[`${namespace}/getProjectReportList`],
  tableTotal: handoverReport.tableTotal,
  queryPar: handoverReport.queryPar,
  loadingConfirm: loading.effects[`${namespace}/addOrUpdProjectReportInfo`],
  exportLoading: loading.effects[`${namespace}/exportProjectReportList`],
  permisBtnTip:global.permisBtnTip,
})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
    getProjectReportList: (payload) => { //交接和报告列表
      dispatch({
        type: `${namespace}/getProjectReportList`,
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
    getParametersInfo: (payload) => { //下拉列表测量参数
      dispatch({
        type: `${namespace}/getParametersInfo`,
        payload: payload
      })
    },
    deleteProjectInfo: (payload, callback) => { //删除
      dispatch({
        type: `${namespace}/deleteProjectInfo`,
        payload: payload,
        callback: callback
      })
    },
    exportProjectReportList: (payload) => { //导出
      dispatch({
        type: `${namespace}/exportProjectReportList`,
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
  }
}
const Index = (props) => {



  const [form] = Form.useForm();
  const [form2] = Form.useForm();




  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState(20)




  const { tableDatas, tableTotal, loadingConfirm, tableLoading, exportLoading, queryPar, } = props;

  const [editPermis,setPermisEdit] = useState(false)
  useEffect(() => {
    const buttonList = permissionButton(props.match.path)
    buttonList.map(item=>{
      switch (item){
        case 'editAuthority': setPermisEdit(true); break;
      }
    })
    onFinish(pageIndex, pageSize);

  }, []);

  let columns = [
    {
      title: '序号',
      align: 'center',
      render: (text, record, index) => {
        return (index + 1) + (pageIndex - 1) * pageSize;
      }
    },
    {
      title: '项目名称',
      dataIndex: 'ProjectName',
      key: 'ProjectName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '项目编号',
      dataIndex: 'ProjectCode',
      key: 'ProjectCode',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '运维合同起始日期',
      dataIndex: 'BeginTime',
      key: 'BeginTime',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '运维合同结束日期',
      dataIndex: 'EndTime',
      key: 'EndTime',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '项目接收状态',
      dataIndex: 'StatusName',
      key: 'StatusName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '运维接收-运维交接单',
      dataIndex: 'ReceiveFile',
      key: 'ReceiveFile',
      align: 'center',
      width:150,
      ellipsis: true,
      render: (text, record, index) => {
        return text == '待上传' ?
          <span className='red'>待上传</span> :
          <div>
            {text && text[0] && <a onClick={() => { getAttachmentData(text, `${record.ProjectCode}-运维接收-运维交接单`) }}>查看附件</a>}
          </div>
      }
    },
    {
      title: '项目结束状态',
      dataIndex: 'EndStatusName',
      key: 'EndStatusName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '运维移交-运维交接单',
      dataIndex: 'TransferFile',
      key: 'TransferFile',
      align: 'center',
      width:150,
      ellipsis: true,
      render: (text, record, index) => {
        return text == '待上传' ?
          <span className='red'>待上传</span> :
          <div>
            {text && text[0] && <a onClick={() => { getAttachmentData(text, `${record.ProjectCode}-运维移交-运维交接单`) }}>查看附件</a>}
          </div>
      }
    },
    {
      title: '运维合同履约完成报告',
      dataIndex: 'PerformanceFile',
      key: 'PerformanceFile',
      align: 'center',
      width:150,
      ellipsis: true,
      render: (text, record, index) => {
        return text == '待上传' ?
          <span className='red'>待上传</span> :
          <div>
            {text && text[0] && <a onClick={() => { getAttachmentData(text, `${record.ProjectCode}-运维合同履约完成报告`) }}>查看附件</a>}
          </div>
      }
    },
    {
      title: '备注',
      dataIndex: 'Remark',
      key: 'Remark',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '操作人',
      dataIndex: 'OperationUser',
      key:'OperationUser',
      align:'center',
      ellipsis: true,
    },
    {
      title: '操作时间',
      dataIndex: 'OperationTime',
      key:'OperationTime',
      align:'center',
      ellipsis: true,
    },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      width: 100,
      ellipsis: true,
      render: (text, record) => {
        return <Fragment>
          <Tooltip title={'编辑'}> <a onClick={() => { edit(record) }} ><EditIcon /></a> </Tooltip>
        </Fragment>


      }
    },
  ];

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
  const onPreviewImg = (file,filesList) => {
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
  const [formVisible, setFormVisible] = useState(false)
  const [title, setTitle] = useState()

  const edit = async (record) => {
    setFormVisible(true)
    setTitle(`${record.ProjectCode}-编辑`)
    form2.resetFields();
    setFilesList1([])
    if(record.ReceiveFile&&record.ReceiveFile[0]&&record.ReceiveFile!='待上传'){ //运维接收-运维交接单 照片
      const fileList =[]
      record.ReceiveFile.map(item=>{
        if(!item.IsDelete){
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
    if(record.TransferFile&&record.TransferFile[0]&&record.TransferFile!='待上传'){ //运维移交-运维交接单 照片
      const fileList =[]
      record.TransferFile.map(item=>{
        if(!item.IsDelete){
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
    if(record.PerformanceFile&&record.PerformanceFile[0]&&record.PerformanceFile!='待上传'){ //运维合同履约完成报告 照片
      const fileList =[]
      record.PerformanceFile.map(item=>{
        if(!item.IsDelete){
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
        remark:record.Remark,
        status:record.Status,
        id: record.ID,
        projectID: record.ProjectID,
        performanceFile: record.PerformanceFile == '待上传' || !record.PerformanceFile ? cuid() : record.PerformanceFile?.[0]?.FileUuid,
        receiveFile: record.ReceiveFile == '待上传' || !record.ReceiveFile ? cuid() : record.ReceiveFile?.[0]?.FileUuid,
        transferFile: record.TransferFile == '待上传' || !record.TransferFile ? cuid() : record.TransferFile?.[0]?.FileUuid,
        EndStatus:record.EndStatus,
      })



    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const exports = async () => {
    const values = await form.validateFields();
    props.exportProjectReportList({
      ...values,
      status: values.status ? 1 : '',
    })
  };


  const onFinish = async (pageIndexs, pageSizes, par) => {  //查询

    try {
      const values = await form.validateFields();
      props.getProjectReportList(par ? { ...par, pageIndex: pageIndexs, pageSize: pageSizes, } : {
        ...values,
        status: values.status ? 1 : '',
        pageIndex: pageIndexs,
        pageSize: pageSizes,
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  const onModalOk = async () => { //添加 or 编辑弹框

    try {
      const values = await form2.validateFields();//触发校验
      props.addOrUpdProjectReportInfo({
        ...values,
      }, () => {
        setFormVisible(false)
        onFinish(pageIndex, pageSize)
      })


    } catch (errInfo) {
      console.log('错误信息:', errInfo);
    }
  }
  const handleTableChange = (PageIndex, PageSize) => { //分页
    setPageSize(PageSize)
    setPageIndex(PageIndex)
    onFinish(PageIndex, PageSize, queryPar)
  }

  const [filesList1, setFilesList1] = useState([])
  const [filesList2, setFilesList2] = useState([])
  const [filesList3, setFilesList3] = useState([])

  const uploadProps2 = (fileName) => {
    const filesCuid = form2.getFieldValue([fileName])
    return { //照片附件 上传
      action: API.UploadApi.UploadPicture,
      headers: {Cookie:null, Authorization: "Bearer " + Cookie.get(config.cookieName)},
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
          fileName == 'receiveFile' ? setFilesList1(fileList) : fileName == 'transferFile' ? setFilesList2(fileList) : setFilesList3(fileList)
        }
        if (info.file.status === 'done') {
          form2.setFieldsValue({ [fileName]: filesCuid })
          fileName == 'receiveFile' ? setFilesList1(fileList) : fileName == 'transferFile' ? setFilesList2(fileList) : setFilesList3(fileList)
          message.success(`${info.file.name} 上传成功`);
        } else if (info.file.status === 'error') {
          form2.setFieldsValue({ [fileName]: fileList && fileList[0] ? filesCuid : undefined }) //有上传成功的取前面的uid 没有则表示没有上传成功的图片
          fileName == 'receiveFile' ? setFilesList1(fileList) : fileName == 'transferFile' ? setFilesList2(fileList) : setFilesList3(fileList)
          message.error(`${info.file.name}${info.file && info.file.response && info.file.response.Message ? info.file.response.Message : '上传失败'}`);
        } else if (info.file.status === 'removed') { //删除状态
          form2.setFieldsValue({ [fileName]: fileList && fileList[0] ? filesCuid : undefined })
          fileName == 'receiveFile' ? setFilesList1(fileList) : fileName == 'transferFile' ? setFilesList2(fileList) : setFilesList3(fileList)

        }
      },
      onRemove: (file) => {
        if (!file.error) {
          props.deleteAttach(file)
        }

      },
      onPreview: file => { //预览
        const fileList =  fileName == 'receiveFile' ? filesList1 : fileName == 'transferFile' ? filesList2 : filesList3
        onPreviewImg(file, fileList)
      },
      fileList: fileName == 'receiveFile' ? filesList1 : fileName == 'transferFile' ? filesList2 : filesList3

    }
  }
  const searchComponents = () => {
    return <Form
      form={form}
      name="advanced_search"
      className={styles['ant-advanced-search-form']}
      onFinish={() => { setPageIndex(1); onFinish(1, pageSize) }}
      layout='inline'
    >
      <Form.Item name='projectName' label='项目名称'>
        <Input placeholder="请输入项目名称" allowClear />
      </Form.Item>
      <Form.Item name='projectCode' label='项目编号' >
        <Input placeholder="请输入项目编号" allowClear />
      </Form.Item>
      <Form.Item name='status' valuePropName="checked" label='交接和报告上传状态'>
        <Checkbox className={styles.commitmentSty}>
          待上传
            </Checkbox>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={tableLoading}>
          查询
         </Button>
        <Button style={{ margin: '0 8px', }} onClick={() => { form.resetFields(); }}  >
          重置
         </Button>
        <Button icon={<ExportOutlined />} loading={exportLoading} onClick={() => { exports() }}>
          导出
         </Button>
      </Form.Item>
    </Form>
  }
  return (
    <div className={styles.handoverReportSty}>
      <BreadcrumbWrapper>
        <Card title={searchComponents()}>
          <SdlTable
            resizable
            loading={tableLoading}
            bordered
            dataSource={tableDatas}
            columns={editPermis? columns : columns.filter(item=>item.title!='操作')  }
            scroll={{ y:'calc(100vh - 288px)' }}
            pagination={{
              total: tableTotal,
              pageSize: pageSize,
              current: pageIndex,
              showSizeChanger: true,
              showQuickJumper: true,
              onChange: handleTableChange,
            }}
          />
        </Card>
      </BreadcrumbWrapper>

      <Modal
        title={title}
        visible={formVisible}
        onOk={onModalOk}
        confirmLoading={loadingConfirm}
        onCancel={() => { setFormVisible(false) }}
        className={styles.formModal}
        destroyOnClose
      >
        <Form
          name="basic"
          form={form2}
        >
         <Form.Item label="项目接收状态" name="status" >
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
            <ol type="1" style={{ listStyle: 'auto',}}>
              <li>在合同执行开始日期的前后7天内上传运维接收-运维交接单；</li>
              <li>在合同执行结束日期的前后7天内上传运维移交-运维交接单，如果项目被续签则无需上传；</li>
              <li>在合同执行结束日期的前后15天内上传运维合同履约完成报告；</li>
            </ol>
          </Row>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={fileTitle}
        visible={fileVisible}
        footer={null}
        destroyOnClose
        onCancel={() => { setFileVisible(false) }}
        width={'50%'}
      >
        <Upload {...uploadProps} style={{ width: '100%' }} />
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