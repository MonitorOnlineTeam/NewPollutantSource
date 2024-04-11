/**
 * 功  能：技术专家系统 问题库
 * 创建人：jab
 * 创建时间：2024.04
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Upload, Popconfirm, Radio, Popover, Spin, Form, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownloadOutlined, UploadOutlined, ImportOutlined, ExportOutlined, ProfileOutlined, AmazonCircleFilled, } from '@ant-design/icons';
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
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
const { Option } = Select;
import { API } from '@config/API';
import config from '@/config';
const namespace = 'problemBase'




const dvaPropsData = ({ loading, problemBase, global, }) => ({
  configInfo: global.configInfo,
  tableLoading: loading.effects[`${namespace}/GetQuestionList`] || loading.effects[`${namespace}/DeleteQuestion`],
  tableDatas: problemBase.tableDatas,
  tableTotal: problemBase.tableTotal,
  queryPar: problemBase.queryPar,
  exportLoading: loading.effects[`${namespace}/ExportQuestion`],
  loadingConfirm: loading.effects[`${namespace}/AddOrUpdateQuestion`],
  questionTemplateLoading: loading.effects[`${namespace}/GetQuestionTemplate`],
})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
    GetQuestionList: (payload, callback) => { //列表
      dispatch({
        type: `${namespace}/GetQuestionList`,
        payload: payload,
        callback: callback,
      })
    },
    ExportQuestion: (payload) => { //导出
      dispatch({
        type: `${namespace}/ExportQuestion`,
        payload: payload,
      })
    },
    GetQuestionTemplate: (payload, callback) => { //获取模板
      dispatch({
        type: `${namespace}/GetQuestionTemplate`,
        payload: payload,
        callback: callback,
      })
    },
    ImportQuestion: (payload, callback) => { //导入
      dispatch({
        type: `${namespace}/ImportQuestion`,
        payload: payload,
        callback: callback,
      })
    },
    AddOrUpdateQuestion: (payload, callback) => { //添加修改
      dispatch({
        type: `${namespace}/AddOrUpdateQuestion`,
        payload: payload,
        callback: callback,
      })
    },
    DeleteQuestion: (payload, callback) => { //删除
      dispatch({
        type: `${namespace}/DeleteQuestion`,
        payload: payload,
        callback: callback,
      })
    },
    GetCodList: (payload, callback) => { //问题类别
      dispatch({
        type: `ctCommon/GetCodList`,
        payload: payload,
        callback: callback,
      })
    },

  }
}
const Index = (props) => {



  const [form] = Form.useForm();
  const [form2] = Form.useForm();

  const { queryPar, tableDatas, tableTotal, tableLoading, exportLoading, loadingConfirm, questionTemplateLoading, } = props;

  const [popVisible, setPopVisible] = useState(false);
  const [codList, setCodList] = useState([]) //问题类别
  const [codLoading, setCodLoading] = useState(true)

  useEffect(() => {
    props.GetCodList({ CodID: 57 }, (res) => {
      setCodList(res)
      setCodLoading(false)
    })
    onFinish(pageIndex, pageSize);

  }, []);

  let columns = [
    {
      title: '序号',
      align: 'center',
      ellipsis: true,
      render: (text, record, index) => {
        return (index + 1) + (pageIndex - 1) * pageSize;
      }
    },
    {
      title: '问题类别',
      dataIndex: 'QuestionTypeName',
      key: 'QuestionTypeName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '问题名称',
      dataIndex: 'QuestionName',
      key: 'QuestionName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '问题描述',
      dataIndex: 'QuestionDesc',
      key: 'QuestionDesc',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '问题解答',
      dataIndex: 'QuestionReply',
      key: 'QuestionReply',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '创建人',
      dataIndex: 'CreateUserName',
      key: 'CreateUserName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'CreateDate',
      key: 'CreateDate',
      align: 'center',
      ellipsis: true,
    },
    {
      title: <span>操作</span>,
      align: 'center',
      width: 180,
      render: (text, record) => {
        return <span>
          <Fragment><Tooltip title="编辑"> <a onClick={() => { addEdit(record, 'edit') }} ><EditIcon /></a> </Tooltip><Divider type="vertical" /> </Fragment>
          <Fragment><Tooltip title="详情"> <a onClick={() => { detail(record) }} ><DetailIcon /></a> </Tooltip><Divider type="vertical" /> </Fragment>
          <Fragment> <Tooltip title="删除">
            <Popconfirm title="确定要删除此条信息吗？" style={{ paddingRight: 5 }} onConfirm={() => { del(record) }} okText="是" cancelText="否">
              <a><DelIcon /></a>
            </Popconfirm>
          </Tooltip>
          </Fragment>
        </span>
      }
    },
  ];
  const [type, setType] = useState()
  const [fromVisible, setFromVisible] = useState(false)
  const addEdit = (record, type) => {
    setFromVisible(true)
    setType(type)
    form2.resetFields();
    type == 'edit' && form2.setFieldsValue({
      id:record.ID, 
      questionType:record.QuestionType=='0'? undefined : record.QuestionType, 
      questionName:record.QuestionName, 
      questionDesc:record.QuestionDesc, 
      questionReply:record.QuestionReply, 
    })
    setPopVisible(false)
  };
  const onModalOk = async () => { //添加 or 编辑弹框

    try {
      const values = await form2.validateFields();//触发校验
      props.AddOrUpdateQuestion({
        ...values,
      }, () => {
        if(type=='add'){
          form2.setFieldsValue({questionName:'',questionDesc:'',questionReply:''})
        }else{
           form2.resetFields();
           setFromVisible(false)
        }
          onFinish(pageIndex, pageSize)
      })

    } catch (errInfo) {
      console.log('错误信息:', errInfo);
    }
  }
  const del =  (record) => {
    props.DeleteQuestion({ id: record.ID }, () => {
      setPageIndex(1)
      onFinish(1,pageSize)
    })
  };
  const [detailVisible, setDetailVisible] = useState(false)
  const [detailTitle, setDetailTitle] = useState('详情')
  const [detailData, setDetailData] = useState({})

  const detail = (record) => {
    setDetailVisible(true)
    setDetailData(record)
    setPopVisible(false)
  }

  const exports = () => {
    props.ExportQuestion({
      ...queryPar,
      pageIndex: undefined,
      pageSize: undefined,
    })
  };


  const onFinish = async (PageIndex, PageSize, queryPar) => {  //查询

    try {
      const values = await form.validateFields();
      props.GetQuestionList(queryPar ? { ...queryPar, pageIndex: PageIndex, pageSize: PageSize } : {
        ...values,
        pageIndex: PageIndex,
        pageSize: PageSize,
      },()=>{
        setPopVisible(false)
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const handleTableChange = async (PageIndex, PageSize) => { //分页
    setPageSize(PageSize)
    setPageIndex(PageIndex)
    onFinish(PageIndex, PageSize, props.queryPar)
  }


  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  const uploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([file]);
      return false;
    },
    fileList,
  };
  const handleUpload = () => {
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append('files', file);
    });
    setUploading(true);
    fetch(API.TechExpertSystemApi.ImportQuestion, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: 'Bearer ' + Cookie.get(config.cookieName),
      },
    })
      .then((res) => res.json())
      .then((res) => {
          if (res.IsSuccess) {
            message.success('导入成功')
            setPopVisible(false)
            setPageIndex(1);
            setPageSize(20)
            onFinish(1,20)
          } else {
            message.error(`导入失败：${res.Message}`, 6);
          }
      })
      .catch(() => {
        setUploading(false);
      })
      .finally(() => {
        setUploading(false);
      });
  };

  const questionTemplate = ()=>{
    props.GetQuestionTemplate({})
  }
  const searchComponents = () => {
    return <Form
      form={form}
      name="advanced_search"
      className={'ant-advanced-search-form'}
      onFinish={() => { setPageIndex(1); setPageSize(20); onFinish(1, 20) }}
    >
      <Row align='middle'>
        <Col span={8}>
          <Spin spinning={codLoading} size='small' className='formItemSpinSty'>
            <Form.Item name='questionType' label='问题类别'>
              <Select placeholder='请选择' allowClear showSearch optionFilterProp="children">
                {codList.map(item => <Option key={item.BaseCode} value={item.BaseCode}>{item.BaseCnName}</Option>)}
              </Select>
            </Form.Item>
          </Spin>
        </Col>
        <Col span={8}>
          <Form.Item name='questionName' label='问题名称' >
            <Input placeholder="请输入" allowClear />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name='questionDesc' label='问题描述' >
            <Input placeholder="请输入" allowClear />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name='questionReply' label='问题解答' >
            <Input placeholder="请输入" allowClear />
          </Form.Item>
        </Col>
        <Col span={8} >
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={tableLoading}>
              查询
         </Button>
            <Button style={{ margin: '0 8px' }} loading={tableLoading} onClick={() => { form.resetFields(); setPageIndex(1); setPageSize(20); onFinish(1, 20) }}  >
              重置
          </Button>
            <Button type="primary" onClick={() => addEdit({}, 'add')} style={{ marginRight: 8 }} >
              添加
         </Button>
            <Popover visible={popVisible} placement='rightTop' title={'导入'} trigger="click"
              overlayStyle={{ width: 400 }}
              overlayClassName={styles.popSty}
              getPopupContainer={trigger => trigger.parentNode}
              content={
                <Form>
                  <Form.Item label="浏览">
                    <Upload
                      {...uploadProps}
                    >
                      <Button style={{ width: '100%'}}  icon={<UploadOutlined />}>上传</Button>
                    </Upload>
                  </Form.Item>
                  <Form.Item style={{  paddingLeft: 42 }}>
                    <Button style={{ width: '100%'}} icon={<DownloadOutlined />} onClick={questionTemplate} loading={questionTemplateLoading}>下载导入模板</Button>
                  </Form.Item>
                  <Row align='end'>
                    <Button onClick={() => { setPopVisible(false) }} style={{ marginRight: 8 }} >
                      取消
                </Button>
                    <Button type="primary"   disabled={fileList.length === 0}  onClick={()=>handleUpload()} loading={uploading}>
                    {uploading ? '上传中' : '确定'}
                  </Button>
                  </Row>
                </Form>
              }
            >
              <Button onClick={() => { setPopVisible(true);setFileList([]) }} icon={<ImportOutlined />} style={{ marginRight: 8 }}>
                导入
         </Button>
            </Popover>

            <Button icon={<ExportOutlined />} loading={exportLoading} style={{ marginRight: 8 }} onClick={() => { exports() }}>
              导出
         </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  }
  return (
    <div className={`queryCriterTitleSty ${styles.problemBaseSty}`}>
      <BreadcrumbWrapper>
        <Card title={searchComponents()}>
          <SdlTable
            resizable
            loading={tableLoading}
            bordered
            dataSource={tableDatas}
            columns={columns}
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
        <Modal
          title={type === 'add' ? '添加' : '编辑'}
          visible={fromVisible}
          onOk={onModalOk}
          confirmLoading={loadingConfirm}
          onCancel={() => { setFromVisible(false) }}
          destroyOnClose
          centered
          width={800}
        >
          <Form
            name="basic"
            form={form2}
          >
                <Form.Item name="id" hidden>
                  <Input />
                </Form.Item>
                <Spin spinning={codLoading} size='small' className='formItemSpinSty'>
                  <Form.Item name='questionType' label='问题类别' rules={[{ required: true, message: '请选择问题类别!' }]}>
                    <Select placeholder='请选择' allowClear showSearch optionFilterProp="children" >
                      {codList.map(item => <Option key={item.BaseCode} value={item.BaseCode}>{item.BaseCnName}</Option>)}
                    </Select>
                  </Form.Item>
                </Spin>
                <Form.Item label="问题名称" name="questionName" rules={[{ required: true, message: '请输入问题名称!' }]} >
                  <Input placeholder='请输入' allowClear/>
                </Form.Item>
                <Form.Item label="问题描述" name="questionDesc" rules={[{ required: true, message: '请输入问题描述!' }]}>
                  <Input.TextArea rows={4} placeholder='请输入' allowClear/>
                </Form.Item>
                <Form.Item label="问题解答" name="questionReply" rules={[{ required: true, message: '请输入问题解答!' }]}>
                  <Input.TextArea rows={4} placeholder='请输入' allowClear/>
                </Form.Item>
          </Form>
        </Modal>

        <Modal
          visible={detailVisible}
          title={detailTitle}
          onCancel={() => { setDetailVisible(false) }}
          footer={null}
          destroyOnClose
          wrapClassName={`detailModalFormTextSty`}
          width={'80%'}
          bodyStyle={{padding:24}}
        >
          <Form className='detailForm'>
            <Row>
              <Col span={12}>
                <Form.Item label='问题类别'>
                  {detailData?.QuestionTypeName}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='问题名称'>
                  {detailData?.QuestionName}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='问题描述'>
                  {detailData?.QuestionDesc}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='问题解答'>
                  {detailData?.QuestionReply}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='创建人'>
                  {detailData?.CreateUserName}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='创建时间'>
                  {detailData?.CreateDate}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </BreadcrumbWrapper>
    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);