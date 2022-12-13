/**
 * 功  能：问题管理
 * 创建人：jab
 * 创建时间：2022.09
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Tag, Spin, Typography, Card, Cascader, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio } from 'antd';
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
import { Resizable, ResizableBox } from 'react-resizable';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';


const { TextArea } = Input;
const { Option } = Select;

const namespace = 'problemManger'




const dvaPropsData = ({ loading, problemManger }) => ({
  tableDatas: problemManger.tableDatas,
  pointDatas: problemManger.pointDatas,
  tableLoading: loading.effects[`${namespace}/getQuestionDetialList`],
  tableTotal: problemManger.tableTotal,
  loadingConfirm: loading.effects[`${namespace}/addOrUpdQuestionDetial`],
  loadingQuestionType: loading.effects[`${namespace}/getQuestionType`],
  delLoading: loading.effects[`${namespace}/deleteQuestionDetial`],
})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
    getQuestionDetialList: (payload) => { //列表
      dispatch({
        type: `${namespace}/getQuestionDetialList`,
        payload: payload,
      })
    },
    addOrUpdQuestionDetial: (payload, callback) => { // 添加修改
      dispatch({
        type: `${namespace}/addOrUpdQuestionDetial`,
        payload: payload,
        callback: callback
      })

    },
    deleteQuestionDetial: (payload, callback) => { //删除
      dispatch({
        type: `${namespace}/deleteQuestionDetial`,
        payload: payload,
        callback: callback
      })
    },
    getQuestionType: (payload, callback) => { //问题类别
      dispatch({
        type: `${namespace}/getQuestionType`,
        payload: payload,
        callback: callback
      })
    },
  }
}
// 自定义文字大小
let fontSize = ['12px', '14px', '16px', '18px', '20px', '24px', '36px']
Quill.imports['attributors/style/size'].whitelist = fontSize;
Quill.register(Quill.imports['attributors/style/size']);


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

      // [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
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



  const isEditing = (record) => record.key === editingKey;

  const { tableDatas, tableTotal, tableLoading, loadingConfirm, loadingQuestionType, delLoading, } = props;

  // const [firstLevelList, setFirstLevelList] = useState([])
  const [questionTypeList, setQuestionTypeList] = useState([])
  useEffect(() => {
    onFinish();
    props.getQuestionType({}, (data) => {
      if (data) {
        const questionTypeData = getQuestionTypeData(data,[])
        setQuestionTypeList(questionTypeData)
      }
    })

  }, []);
  const getQuestionTypeData = (data, arr) => { //转换json树的key值
    if (data && data[0]) {
       data.map(item => {
        let obj = { 
          label: item.title, 
          value: item.type,
          children: item.children&&item.children[0]? getQuestionTypeData(item.children,[]) : []
        }
        arr.push(obj)
      })
      return arr;
    }
  }
  const columns = [
    {
      title: '编号',
      align: 'center',
      render: (text, record, index) => {
        return index + 1;
      }
    },
    {
      title: '问题名称',
      dataIndex: 'QuestionName',
      key: 'QuestionName',
      align: 'center',
    },
    {
      title: '类别',
      dataIndex: 'FirstLevel',
      key: 'FirstLevel',
      align: 'center',
    },
    {
      title: '问题状态',
      dataIndex: 'Status',
      key: 'Status',
      align: 'center',
      render: (text, record) => {
        return <span><Tag color={record.StatusID == 1 ? "blue" : "red"}>{text}</Tag></span>;
      },
    },
    {
      title: '维护人',
      dataIndex: 'CreateUserName',
      key: 'CreateUserName',
      align: 'center',
    },
    {
      title: '维护时间',
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


  const edit = async (record) => {
    setFromVisible(true)
    setType('edit')
    // const selectData = firstLevelList.filter(item => item.type == record.FirstLevelID)
    // selectData[0] && setSecondLevelList(selectData[0].children) //二级类别下拉列表赋值
    form2.resetFields();
    try {
      form2.setFieldsValue({
        ...record,
        FirstLevel: record.FirstLevelID ? record.FirstLevelID.split(',') : [],
        Status: record.StatusID,
        BeginTime: record.BeginTime && moment(record.BeginTime),
        EndTime: record.EndTime && moment(record.EndTime),
      })

    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };
  const detail = (data) => {

    router.push({ pathname: '/systemManger/problemManger/detail', query: { data: JSON.stringify(data) } })
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

      props.getQuestionDetialList({
        pageIndex: pageIndexs && typeof pageIndexs === "number" ? pageIndexs : 1,
        pageSize: pageSizes ? pageSizes : pageSize,
        ...values,
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
        message.warning('请输入问题描述')
        return;
      }
      props.addOrUpdQuestionDetial({
        ...values,
        FirstLevel:values.FirstLevel&&values.FirstLevel.toString(),
      }, () => {
        setFromVisible(false)
        type === 'add' ? onFinish() : onFinish(pageIndex)
      })


    } catch (errInfo) {
      console.log('错误信息:', errInfo);
    }
  }

  const del = async (record) => {
    const values = await form.validateFields();
    props.deleteQuestionDetial({ ID: record.ID }, () => {
      setPageIndex(1)
      props.getQuestionDetialList({
        pageIndex: 1,
        pageSize: pageSize,
        ...values,
      })
    })
  }
  const [secondLevelList, setSecondLevelList] = useState([])
  const onAddEditValuesChange = (hangedValues, allValues) => { //添加修改时
    // if (Object.keys(hangedValues).join() == 'FirstLevel') { //获取二级类别
    //   form2.setFieldsValue({ SecondLevel: undefined })
    //   const selectData = firstLevelList.filter(item => item.type == hangedValues.FirstLevel)
    //   selectData[0] && setSecondLevelList(selectData[0].children)
    // }
  }
  const handleTableChange = async (PageIndex, PageSize) => { //分页
    setPageSize(PageSize)
    setPageIndex(PageIndex)
    onFinish(PageIndex, PageSize)
  }
  const handleResize = (e, { size }) => {
    // console.log(size)
  };

  const searchComponents = () => {
    return <Form
      form={form}
      name="advanced_search"
      className={styles['ant-advanced-search-form']}
      layout='inline'
      onFinish={onFinish}
    >
      <Form.Item label="问题名称" name="QuestionName"  >
        <Input placeholder='请输入' allowClear style={{ width: 200 }} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType='submit' loading={tableLoading} style={{ marginRight: 8 }}>
          查询
     </Button>
        <Button onClick={() => { form.resetFields() }} style={{ marginRight: 8 }}>
          重置
     </Button>
        <Button onClick={() => { add() }} >
          添加
     </Button>
      </Form.Item>
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
              <Form.Item label="问题名称" name="QuestionName" rules={[{ required: true, }]} >
                <TextArea showCount maxLength={50} rows={1} placeholder='请输入' />
              </Form.Item>
            </Col>
            {/* <Col span={24}>
              <Spin size='small' spinning={loadingFirstLevel} style={{ top: -5 }}>
                <Form.Item label="一级类别" name="FirstLevel" rules={[{ required: true, message: '请选择一级类别' }]}>

                  <Select placeholder='请选择' allowClear >
                    {
                      firstLevelList[0] && firstLevelList.map(item => {
                        return <Option key={item.type} value={item.type}>{item.title}</Option>
                      })
                    }
                  </Select>
                </Form.Item>
              </Spin>
            </Col>
            <Col span={24}>
              <Form.Item label="二级类别" name="SecondLevel" rules={[{ required: true, message: '请选择二级类别' }]}>
                <Select placeholder='请选择' >
                  {
                    secondLevelList[0] && secondLevelList.map(item => {
                      return <Option key={item.type} value={item.type}>{item.title}</Option>
                    })
                  }
                </Select>
              </Form.Item>
            </Col> */}
            <Col span={24}>
              <Spin size='small' spinning={loadingQuestionType} style={{ top: -5 }}>
                <Form.Item label="类别" name="FirstLevel" rules={[{ required: true, message: '请选择二级类别' }]}>
                  <Cascader options={questionTypeList} />
                </Form.Item>
              </Spin>
            </Col>
            <Col span={24}>
              <ResizableBox
                height={260}
                axis={'y'}
                minConstraints={['100%', 120]}
                onResize={handleResize}
                className={'resizable_quill_sty'}
              >
                <Form.Item label="答案描述" name='Content' rules={[{ required: true, message: '请输入答案描述' }]}>
                  <ReactQuill theme="snow" modules={modules} />
                </Form.Item>
              </ResizableBox >
            </Col>
            <Col span={24}>
              <Form.Item label="问题状态" name="Status" >
                <Radio.Group>
                  <Radio value={1}>显示</Radio>
                  <Radio value={2}>不显示</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>



        </Form>
      </Modal>
    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);