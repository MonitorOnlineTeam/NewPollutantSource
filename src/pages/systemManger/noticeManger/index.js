/**
 * 功  能：问题管理
 * 创建人：jab
 * 创建时间：2022.09
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Tag, Spin, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import NumTips from '@/components/NumTips'
import styles from "./style.less"
import Cookie from 'js-cookie';
import { Resizable,ResizableBox } from 'react-resizable';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import RoleList from '@/components/RoleList'
import OperationCompanyList from '@/components/OperationCompanyList'

const { TextArea } = Input;
const { Option } = Select;

const namespace = 'noticeManger'


// 自定义文字大小
let fontSize = ['12px', '14px', '16px', '18px','20px', '24px', '36px']
Quill.imports['attributors/style/size'].whitelist = fontSize;
Quill.register(Quill.imports['attributors/style/size']);



const dvaPropsData = ({ loading, noticeManger }) => ({
  tableDatas: noticeManger.tableDatas,
  pointDatas: noticeManger.pointDatas,
  tableLoading: loading.effects[`${namespace}/getNoticeContentList`],
  tableTotal: noticeManger.tableTotal,
  loadingConfirm: loading.effects[`${namespace}/addOrUpdNoticeContent`],
  delLoading: loading.effects[`${namespace}/deleteNoticeContent`],
})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
    getNoticeContentList: (payload) => { //列表
      dispatch({
        type: `${namespace}/getNoticeContentList`,
        payload: payload,
      })
    },
    addOrUpdNoticeContent: (payload, callback) => { // 添加 or 修改
      dispatch({
        type: `${namespace}/addOrUpdNoticeContent`,
        payload: payload,
        callback: callback
      })

    },
    deleteNoticeContent: (payload, callback) => { //删除
      dispatch({
        type: `${namespace}/deleteNoticeContent`,
        payload: payload,
        callback: callback
      })
    },
  }
}


const Index = (props) => {

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],
      ['link', 'image'],
  
      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],                         // text direction
  
      // [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown 默认字体
      [{ 'size': fontSize }], // 文字大小自定义
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  
      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean']                                         // remove formatting button
    ]
  }

  const [form] = Form.useForm();
  const [form2] = Form.useForm();





  const [fromVisible, setFromVisible] = useState(false)

  const [type, setType] = useState('add')




  const { tableDatas, tableTotal, tableLoading, loadingConfirm,delLoading, } = props;
  useEffect(() => {
    onFinish();  
  }, []);

  const columns = [
    {
      title: '公告标题',
      dataIndex: 'NoticeTitle',
      key: 'NoticeTitle',
      align: 'center',
    },
    {
      title: '生效时间',
      dataIndex: 'BeginTime',
      key: 'BeginTime',
      align: 'center',
      render: (text, record) => { 
        return text ? moment(text).format('YYYY-MM-DD 00:00:00') : undefined;
    }
    },
    {
      title: '失效时间',
      dataIndex: 'EndTime',
      key: 'EndTime',
      align: 'center',
      render: (text, record) => { 
          return text ? moment(text).format('YYYY-MM-DD 23:59:59') : undefined;
      }
    },
    {
      title: '公告状态',
      dataIndex: 'Status',
      key: 'Status',
      align: 'center',
      render: (text, record) => {
        if (text === '显示') {
          return <span><Tag color="green">显示</Tag></span>;
        }
        if (text === '不显示') {
          return <span><Tag color="red">不显示</Tag></span>;
        }
        if (text === '置顶') {
          return <span><Tag color="blue">置顶</Tag></span>;
        }
      },
    },
    {
      title: '查看公告单位',
      dataIndex: 'Company',
      key: 'Company',
      align: 'center',
    },
    {
      title: '查看公告角色',
      dataIndex: 'Role',
      key: 'Role',
      align: 'center',
    },
    {
      title: '发布人',
      dataIndex: 'CreatUserName',
      key: 'CreatUserName',
      align: 'center',
    },
    {
      title: '发布时间',
      dataIndex: 'CreateTime',
      key: 'CreateTime',
      align: 'center',
    },
    {
      title: <span>操作</span>,
      dataIndex: 'x',
      key: 'x',
      align: 'center',
      width: 180,
      render: (text, record) => {
        return <span>
          <Fragment><Tooltip title="编辑"> <a onClick={() => { edit(record) }} ><EditIcon /></a> </Tooltip><Divider type="vertical" /> </Fragment>
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


  const edit =  (record) => {
    setFromVisible(true)
    setType('edit')
    console.log(record)
    form2.resetFields();
    form2.setFieldsValue({
        ...record,
        Role:record.RoleID? record.RoleID.split(',') : [],
        Company:record.CompanyID? record.CompanyID.split(',') : [],     
        Status:record.StatusID,
        BeginTime: record.BeginTime&&moment(record.BeginTime),
        EndTime:record.EndTime&&moment(record.EndTime),
      })

  };
  const detail = (data) => {

    router.push({ pathname: '/systemManger/noticeManger/detail', query: { data: JSON.stringify(data) } })
  }

  const add = () => {
    setFromVisible(true)
    setType('add')
    form2.resetFields();
  };

  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const onFinish = async (pageIndexs, pageSizes) => {  //查询


    try {
      const values = await form.validateFields();
      pageIndexs && typeof pageIndexs === "number" ? setPageIndex(pageIndexs) : setPageIndex(1); //除分页和编辑  每次查询页码重置为第一页
      props.getNoticeContentList({
        ...values,
        pageIndex: pageIndexs && typeof pageIndexs === "number" ? pageIndexs : 1,
        pageSize: pageSizes ? pageSizes : pageSize,
        beginTime: values.time && moment(values.time[0]).format('YYYY-MM-DD HH:mm:ss'),
        endTime: values.time && moment(values.time[1]).format('YYYY-MM-DD HH:mm:ss'),
        company:values.company?values.company.toString() : '',
        role:values.role?values.role.toString() : '',
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }

  
  const onModalOk = async () => { //添加 or 编辑弹框


    try {
      const values = await form2.validateFields();//触发校验

      const contentVal = values.Content.replaceAll(/<p>|[</p>]/g, '').trim();
      if ((!contentVal) || contentVal === 'br') {
        message.warning('请输入公告内容')
        return;
      }

      props.addOrUpdNoticeContent({
        ...values,
        BeginTime: values.BeginTime && moment(values.BeginTime).format('YYYY-MM-DD HH:mm:ss'),
        EndTime: values.EndTime && moment(values.EndTime).format('YYYY-MM-DD HH:mm:ss'),
        Company:values.Company?values.Company.toString() : '',
        Role:values.Role?values.Role.toString() : '',
      }, () => {
        setFromVisible(false)
        onFinish()
      })


    } catch (errInfo) {
      console.log('错误信息:', errInfo);
    }
  }

  const del = async (record) => {
    const values = await form.validateFields();
    props.deleteNoticeContent({ ID: record.ID }, () => {
      setPageIndex(1)
      props.getNoticeContentList({
        pageIndex: 1,
        pageSize: pageSize,
        ...values,
      })
    })
  };
  const onAddEditValuesChange = (hangedValues, allValues) => { //添加修改时
    
 
  }
  const startDisabledDate = (current) => {
    const time = form2.getFieldValue('EndTime')
    return time && current && current > moment(time).startOf('day');
  }
  const endDisabledDate = (current) => {
    const time = form2.getFieldValue('BeginTime')
    return time && current && current < moment(time).endOf('day');
  }


  const handleTableChange = async (PageIndex, PageSize) => { //分页
    setPageSize(PageSize)
    setPageIndex(PageIndex)
    onFinish(PageIndex, PageSize)
  }


  const searchComponents = () => {
    return <Form
      form={form}
      name="advanced_search"
      className={styles['ant-advanced-search-form']}
      onFinish={onFinish}
    >
      <Row>
        <Form.Item label="公告标题" name="title"  >
          <Input placeholder='请输入' allowClear style={{ width: 200 }} />
        </Form.Item>
        <Form.Item label="发布时间" name="time" style={{ margin: '0 8px' }}>
          <RangePicker allowClear style={{ width: 350 }} showTime={{
            defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
          }} />
        </Form.Item>
        <Form.Item label="公告状态" name="status"  >
          <Select placeholder='请输入' allowClear style={{ width: 200 }}>
            <Option value={1}>显示</Option>
            <Option value={2}>不显示</Option>
            <Option value={3}>置顶</Option>
          </Select>
        </Form.Item>
      </Row>
      <Row>
        <Form.Item label="查看公告单位" name="company"  >
          <OperationCompanyList style={{ width: 200 }} mode='multiple'/>
        </Form.Item>
        <Form.Item label="查看公告角色" name="role" style={{ margin: '0 8px' }}>
          <RoleList  style={{ width: 350 }} mode='multiple'/>
        </Form.Item>
        <Form.Item style={{ marginLeft: 30 }}>
          <Button type="primary" htmlType='submit' style={{ marginRight: 8 }}>
            查询
     </Button>
          <Button onClick={() => { form.resetFields() }} style={{ marginRight: 8 }}>
            重置
     </Button>
          <Button onClick={() => { add() }} >
            添加
     </Button>
        </Form.Item>
      </Row>
    </Form>
  }
  return (
    <div className={styles.equipmentManufacturListSty}>
      <BreadcrumbWrapper>
        <Card title={searchComponents()}>
          <SdlTable
            loading={tableLoading || delLoading}
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
      </BreadcrumbWrapper>

      <Modal
        title={type === 'add' ? '添加' : '编辑'}
        visible={fromVisible}
        onOk={onModalOk}
        confirmLoading={loadingConfirm}
        onCancel={() => { setFromVisible(false) }}
        className={styles.fromModal}
        destroyOnClose
      >
        <Form
          name="basic"
          form={form2}
          initialValues={{
            Status: 1
          }}
          onValuesChange={onAddEditValuesChange}
        >
          <Row>
            <Col span={24}>
              <Form.Item name="ID" hidden>
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="发布标题" name="NoticeTitle" rules={[{ required: true, }]} >
                <TextArea showCount maxLength={50} rows={1} placeholder='请输入' />
              </Form.Item>
            </Col>

            <Col span={24}>
            <ResizableBox 
                  height={260} 
                  axis = {'y'}
                  minConstraints={['100%', 120]}
                  className={'resizable_quill_sty'}
                > 
              <Form.Item label='公告内容' name="Content" rules={[{ required: true, message: '请输入公告内容' }]}>
                <ReactQuill theme="snow" modules={modules}  />
              </Form.Item> 
              </ResizableBox>
            </Col>
            <Col span={24}>
              <Form.Item label="公告状态" name="Status" rules={[{ required: true, }]}>
                <Radio.Group>
                  <Radio value={1}>显示</Radio>
                  <Radio value={2}>不显示</Radio>
                  <Radio value={3}>置顶</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="查看公告单位" name="Company" rules={[{ required: true, message: '请选择公告单位' }]}>
                <OperationCompanyList  mode='multiple'/>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="查看公告角色" name="Role" rules={[{ required: true, message: '请选择公告角色' }]}>
                <RoleList  mode='multiple' />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="生效时间" name="BeginTime" rules={[{ required: true, message: '请选择生效时间' }]} >
                <DatePicker allowClear disabledDate={startDisabledDate} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="失效时间" name="EndTime" rules={[{ required: true, message: '请选择失效时间' }]}>
                <DatePicker allowClear disabledDate={endDisabledDate}/>
              </Form.Item>
            </Col>

          </Row>



        </Form>
      </Modal>
    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);