/*
 * @Author: JiaQi
 * @Date: 2023-04-23 09:54:18
 * @Last Modified by: JiaQi
 * @Last Modified time: 2024-05-23 16:21:11
 * @Description：现场检查记录
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  Input,
  Button,
  Space,
  Tooltip,
  Popconfirm,
  Radio,
  Tag,
  Divider,
  Select,
  Modal,
  Row,
  Col,
  DatePicker,
} from 'antd';
import moment from 'moment';
import SdlTable from '@/components/SdlTable';
import { DelIcon, DetailIcon, EditIcon } from '@/utils/icon';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import LargeRegionList from '@/components/largeRegionList';
const { TextArea } = Input;


const dvaPropsData = ({ loading, wordSupervision }) => ({
  exportLoading: loading.effects['wordSupervision/InsOrUpdOtherWork'],
  queryLoading: loading.effects['wordSupervision/InsOrUpdOtherWork'],
});

const HandleWorkModal = props => {
  const [form] = Form.useForm();
  const { open, onCancel, modalType, queryLoading, exportLoading } = props;


  useEffect(() => {
    form.setFieldsValue({
      ...editData,
      WorkTime: editData.WorkTime ? moment(editData.WorkTime) : undefined,
    });
  }, [editData]);

  const [editData, setEditData] = useState({});
  const onEdit = record => {
    setEditData(record);
    setHandleWorkModalOpen(true);
  };
  // 获取列头
  const getColumns = () => {
    const columns = [
      {
        title: '序号',
      },
      {
        title: '大区',
        dataIndex: 'User_Name',
        key: 'User_Name',
      },
      {
        title: '项目编号',
        dataIndex: 'WorkTime',
        key: 'WorkTime',
      },
      {
        title: '项目名称',
        dataIndex: 'WorkTime',
        key: 'WorkTime',
      },
      {
        title: '用户单位',
        dataIndex: 'ContentDes',
        key: 'ContentDes',
        ellipsis: true,
      },
      {
        title: '监测点位',
        dataIndex: 'ContentDes',
        key: 'ContentDes',
        ellipsis: true,
      },
      {
        title: '系统型号',
        dataIndex: 'ContentDes',
        key: 'ContentDes',
        ellipsis: true,
      },
      {
        title: '安装日期',
        dataIndex: 'ContentDes',
        key: 'ContentDes',
        ellipsis: true,
      },
      {
        title: '检查人员',
        dataIndex: 'ContentDes',
        key: 'ContentDes',
        ellipsis: true,
      },
      {
        title: '检查日期',
        dataIndex: 'ContentDes',
        key: 'ContentDes',
        ellipsis: true,
      },
      {
        title: '服务人员',
        dataIndex: 'ContentDes',
        key: 'ContentDes',
        ellipsis: true,
      },
      {
        title: '创建时间',
        dataIndex: 'ContentDes',
        key: 'ContentDes',
        ellipsis: true,
      },
      {
        title: '操作',
        render: (text, record) => {
          if (modalType == 1) {
            return <Tooltip title="编辑">
              <a onClick={() => { onEdit(record) }}   >
                <EditIcon />
              </a>
            </Tooltip>
          } else if (modalType == 2) {
            return <Tooltip title="详情">
              <a onClick={() => { onEdit(record) }}   >
                <DetailIcon />
              </a>
            </Tooltip>
          }else{
            return <>
           <Tooltip title="编辑">
              <a onClick={() => { onEdit(record) }}   >
                <EditIcon />
              </a>
            </Tooltip>
              <Divider type="vertical" />
              <Tooltip title="详情">
              <a onClick={() => { onEdit(record) }}   >
                <DetailIcon />
              </a>
            </Tooltip>
            <Divider type="vertical" />
              <Tooltip title="删除">
                <Popconfirm placement="left"  title="确认是否删除?" okText="是"   cancelText="否"
                  onConfirm={() => {
                    onDelete(record.ID);
                  }} 
                >
                  <a>
                    <DelIcon />
                  </a>
                </Popconfirm>
              </Tooltip>
            </>
          }
        }
      },
    ]


    return columns;
  };
  // 提交任务单
  const onFinish = async () => {
    const values = await form.validateFields();
    let body = {
      ...values,
      WorkTime: moment(values.WorkTime).format('YYYY-MM-DD HH:mm:ss'),
      ID: editData.ID,
      UserId: editData.UserId,
    };
    // return;
    props.dispatch({
      type: 'wordSupervision/InsOrUpdOtherWork',
      payload: body,
      callback: () => {
        onCancel();
        onSubmitCallback();
        form.resetFields();
      },
    });
  };
  //分页
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const handleTableChange = async (PageIndex, PageSize) => {
    setPageSize(PageSize);
    setPageIndex(PageIndex);
    onFinish(PageIndex, PageSize);
  };
  const SearchComponents = () => {
    return <Form
      name="basic"
      form={form}
      initialValues={{
        date: [moment().add(-1, 'months'), moment()],
      }}
      onFinish={onFinish}
      autoComplete="off"
      labelCol={{
        flex: '69px'
      }}
    >
      <Row>
        <Col span={6}>
          <LargeRegionList label='大区' />
        </Col>
        <Col span={6}>
          <Form.Item label="项目编号" name="aa">
            <Input placeholder='请选择' allowClear />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="项目名称" name="bb">
            <Input placeholder='请选择' allowClear />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="系统型号" name="cc">
            <Input placeholder='请选择' allowClear />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="用户单位" name="dd">
            <Input placeholder='请选择' allowClear />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="检查人员" name="ee">
            <Input placeholder='请选择' allowClear />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="检查时间" name="date">
            <RangePicker_ picker="day" format="YYYY-MM-DD" />
          </Form.Item>
        </Col>
        <Col>
          <Space>
            <Button
              type="primary"
              onClick={() => handleTableChange(1, 20)}
              loading={queryLoading}
            >
              查询
        </Button>
            <Button
              onClick={() => handleTableChange(1, 20)}
              loading={queryLoading}
            >
              重置
        </Button>
            <Button loading={exportLoading} onClick={() => onExport()}>
              导出
        </Button>
          </Space>
        </Col>
      </Row>
    </Form>
  }
  return (<>
    <Modal
      title={modalType == 1 ? '现场检查管理' : modalType == 2 ? '现场检查记录' : ''}
      wrapClassName={`spreadOverModal`}
      mask={false}
      footer={false}
      destroyOnClose
      open={open}
      onCancel={() => {
        onCancel && onCancel()
      }}
    >
      <div className='queryCriterTitleSty'><SearchComponents /></div>
      <SdlTable
        loading={queryLoading}
        align="center"
        columns={getColumns()}
        // dataSource={dataSource}
        scroll={{ x: 840 }}
        pagination={{
          // total: tableTotal,
          pageSize: pageSize,
          current: pageIndex,
          showSizeChanger: true,
          showQuickJumper: true,
          onChange: handleTableChange,
        }}
      />
    </Modal>
    <Modal
      title={editData.ID ? '编辑' : '添加'}
      width={800}
      open={false}
      destroyOnClose
      onOk={() => {
        onFinish();
      }}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
    >
      <Form
        form={form}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 16 }}
        initialValues={{}}
        // onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="工作时间"
          name="WorkTime"
          rules={[
            {
              required: true,
              message: '请选择工作时间！',
            },
          ]}
        >
          <DatePicker
            disabledDate={current => {
              return current && current > moment().endOf('day');
            }}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          label="工作结果"
          name="WorkResults"
          rules={[
            {
              required: true,
              message: '请选择工作结果！',
            },
          ]}
        >
          <Radio.Group>
            <Radio value={1}>完成</Radio>
            <Radio value={0}>未完成</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="内容描述" name="ContentDes">
          <TextArea rows={3} placeholder="请输入内容描述" />
        </Form.Item>
      </Form>
    </Modal>
  </>
  );
};

export default connect(dvaPropsData)(HandleWorkModal);
