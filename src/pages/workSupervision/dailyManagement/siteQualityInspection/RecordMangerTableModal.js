/*
 * @Author: outman0611
 * @Date: 2024-12-18 15:10:07
 * @LastEditors: outman0611
 * @LastEditTime: 2024-12-23 16:26:15
 * @Description: 现场检查记录
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
import SiteQualityInspection from '@/pages/workSupervision/Forms/SiteQualityInspection';

const { TextArea } = Input;


const dvaPropsData = ({ loading, wordSupervision }) => ({
  exportLoading: loading.effects['wordSupervision/InsOrUpdOtherWork'],
  queryLoading: loading.effects['wordSupervision/InsOrUpdOtherWork'],
});

const RecordAndManagement = props => {
  const [form] = Form.useForm();
  const { open, onCancel, modalType, queryLoading, exportLoading, taskInfo } = props;

 

  useEffect(() => {
    form.setFieldsValue({
      ...editData,
      WorkTime: editData.WorkTime ? moment(editData.WorkTime) : undefined,
    });
  }, [editData]);


  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [tableTotal, setTableTotal] = useState(0);
  const [dataSource, setDataSource] = useState([1]);
  const [addData, setAddData] = useState({});
  const [editData, setEditData] = useState({});
  const [editDetailDataOpen, setEditDetailDataOpen] = useState(false);
  const [isEdit, setIsEdit] = useState();

  const onEdit = record => {
    setEditDetailDataOpen(true);
    setIsEdit(true)
    setEditData(record);

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
          } else {
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
                <Popconfirm placement="left" title="确认是否删除?" okText="是" cancelText="否"
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
  const handleTableChange =  (PageIndex, PageSize) => {
    setPageSize(PageSize);
    setPageIndex(PageIndex);
    getPageData(PageIndex, PageSize);
  };

  const onDelete = (id) => {
    // // 删除后重新加载当前页数据
    // const { current, pageSize } = pagination;
    // const newTotal = pagination.total - 1;
    // if ((current - 1) * pageSize + 1 > newTotal) {
    //   // 如果删除后剩余条目不足以填满当前页，则跳转到上一页或第一页
    //   setPagination((prevPagination) => ({
    //     ...prevPagination,
    //     current: Math.max(1, Math.ceil(newTotal / pageSize)),
    //     total: newTotal,
    //   }));
    // } else {
    //   // 否则保持在当前页并刷新数据
    //   setPagination((prevPagination) => ({
    //     ...prevPagination,
    //     total: newTotal,
    //   }));
    // }
    props.dispatch({
      type: 'wordSupervision/InsOrUpdOtherWork',
      payload: body,
      callback: () => {
        form.resetFields();
      },
    });
  }
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

  const data = taskInfo?.ID ? taskInfo : addData

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
      <div className='queryCriterTitleSty'>
        {taskInfo?.ID ?
        <>
          <Alert
            message={`任务类型：现场检查任务单，派发时间：${data.BeginTime} ，有效期：${data.EndTime} ，任务单派发频次1次/月，应至少股改监测点${data.standVisitNum || 0}个，服务人员${data.standVisitNum || 0}人`}
            type="info"
            showIcon
            style={{ marginRight: 30 }}
          />
          <Button onClick={()=>{
            setEditDetailDataOpen(true)
            setEditData({DailyTaskID: data.ID,RegionalArea:data.largeCode });
            }}>添加</Button>
          </>
          :
          modalType == 2 && <SearchComponents />
        }


      </div>
      <SdlTable
        loading={queryLoading}
        align="center"
        columns={getColumns()}
        dataSource={dataSource}
        scroll={{ x: 840 }}
        pagination={
          !taskInfo.ID
            ? {
              total: tableTotal,
              pageSize: pageSize,
              current: pageIndex,
              showSizeChanger: true,
              showQuickJumper: true,
              onChange: handleTableChange,
            }
            : false
        }
      />
    </Modal>
    <Modal
          centered
          open={editDetailDataOpen}
          footer={null}
          wrapClassName="spreadOverModal noTitleSty"
          mask={false}
          destroyOnClose
          onCancel={() => setEditDetailDataOpen(false)}
        >
          <SiteQualityInspection
            taskInfo={taskInfo}
            editData={editData}
            isEdit={isEdit}
            onCancel={() => {
              setEditDetailDataOpen(false);
            }}
            onSubmitCallback={() => {
              getPageData();
            }}
          />
        </Modal>
  </>
  );
};
RecordAndManagement.defaultProps = {
  taskInfo: {},
};

export default connect(dvaPropsData)(RecordAndManagement);
