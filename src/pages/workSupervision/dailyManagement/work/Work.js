/*
 * @Author: JiaQi
 * @Date: 2023-04-23 09:38:17
 * @Last Modified by: JiaQi
 * @Last Modified time: 2024-05-10 10:32:03
 * @Description：部门内其他工作事项
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
} from 'antd';
import moment from 'moment';
import SdlTable from '@/components/SdlTable';
import { DelIcon, EditIcon } from '@/utils/icon';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import HandleWorkModal from './HandleWorkModal';
import RecordModal from './RecordModal';

const contentList = [
  { name: '技术问题', value: '1' },
  { name: '配合检查', value: '2' },
  { name: '其他工作', value: '3' },
];

const WorkTypeText = {
  1: '现场工作记录',
  2: '部门内其他工作记录',
  3: '支持其他部门工作记录',
};

const dvaPropsData = ({ loading, wordSupervision }) => ({
  queryLoading: loading.effects['wordSupervision/GetOtherWorkList'],
  exportLoading: loading.effects['wordSupervision/exportTaskRecord'],
});

const Work = props => {
  const [form] = Form.useForm();
  const { WorkType, CTOperation, queryLoading, exportLoading, mode } = props;
  const [dataSource, setDataSource] = useState([]);
  const [editData, setEditData] = useState({});
  const [handleWorkModalOpen, setHandleWorkModalOpen] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [tableTotal, setTableTotal] = useState(0);
  const [recordModalOpen, setRecordModalOpen] = useState(false);

  useEffect(() => {
    onFinish();
  }, []);

  // 获取请求参数
  const getParams = values => {
    const beginTime = values.date
      ? moment(values.date[0]).format('YYYY-MM-DD HH:mm:ss')
      : undefined;
    const endTime = values.date ? moment(values.date[1]).format('YYYY-MM-DD 23:59:59') : undefined;

    return {
      BeginTime: beginTime,
      EndTime: endTime,
      CTOperation: CTOperation,
      WorkType: WorkType,
      flag: mode !== 'record',
    };
  };

  // 查询数据
  const onFinish = async (_pageIndex, _pageSize) => {
    const values = await form.validateFields();
    const body = getParams(values);

    props.dispatch({
      type: 'wordSupervision/GetOtherWorkList',
      payload: {
        ...body,
        pageIndex: _pageIndex || pageIndex,
        pageSize: _pageSize || pageSize,
      },
      callback: res => {
        setDataSource(res.Datas);
        setTableTotal(res.Total);
      },
    });
  };

  // 导出
  const onExport = async () => {
    const values = await form.validateFields();
    const body = getParams(values);
    props.dispatch({
      type: 'wordSupervision/exportTaskRecord',
      payload: {
        ...body,
        apiName: 'ExportOtherWorkList',
      },
    });
  };

  // 删除
  const onDelete = ID => {
    props.dispatch({
      type: 'wordSupervision/DeleteOtherWork',
      payload: { ID },
      callback: res => {
        handleTableChange(1, 20);
      },
    });
  };

  //
  const onEdit = record => {
    setEditData(record);
    setHandleWorkModalOpen(true);
  };

  // 获取列头
  const getColumns = () => {
    let columns = [
      {
        title: '序号',
        // dataIndex: 'index',
        // key: 'index',
        // render: (text, record, index) => {
        //   return index + 1;
        // },
      },
      {
        title: '姓名',
        dataIndex: 'User_Name',
        key: 'User_Name',
      },
      {
        title: '工作时间',
        dataIndex: 'WorkTime',
        key: 'WorkTime',
        sorter: (a, b) => moment(a.WorkTime).valueOf() - moment(b.WorkTime).valueOf(),
        render: (text, record) => {
          return moment(text).format('YYYY-MM-DD');
        },
      },
      {
        title: '内容项',
        dataIndex: 'Content',
        key: 'Content',
      },
      {
        title: '工作结果',
        dataIndex: 'WorkResults',
        key: 'WorkResults',
        render: (text, record) => {
          if (text === 1) {
            return <Tag color="success">完成</Tag>;
          } else {
            return <Tag color="error">未完成</Tag>;
          }
        },
      },
      {
        title: '内容描述',
        dataIndex: 'ContentDes',
        key: 'ContentDes',
        width: 200,
        ellipsis: true,
      },
    ];

    // if (flag === 'oneself') {
    if (mode !== 'record') {
      columns.push({
        title: '操作',
        dataIndex: 'handle',
        key: 'handle',
        render: (text, record) => {
          return (
            <>
              <Tooltip title="编辑">
                <a
                  onClick={() => {
                    onEdit(record);
                  }}
                >
                  <EditIcon />
                </a>
              </Tooltip>
              <Divider type="vertical" />
              <Tooltip title="删除">
                <Popconfirm
                  placement="left"
                  title="确认是否删除?"
                  onConfirm={() => {
                    onDelete(record.ID);
                  }}
                  okText="是"
                  cancelText="否"
                >
                  <a>
                    <DelIcon />
                  </a>
                </Popconfirm>
              </Tooltip>
            </>
          );
        },
      });
    }

    return columns;
  };

  //分页
  const handleTableChange = async (PageIndex, PageSize) => {
    setPageSize(PageSize);
    setPageIndex(PageIndex);
    onFinish(PageIndex, PageSize);
  };

  return (
    <Card
      bordered={mode !== 'record' ? true : false}
      title={
        <Form
          name="basic"
          form={form}
          layout="inline"
          // style={{ padding: '10px 0 20px' }}
          initialValues={{
            workResults: null,
          }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Space wrap>
            <Form.Item label="工作时间" name="date">
              <RangePicker_ allowClear={false} />
            </Form.Item>
            <Form.Item label="内容项" name="workContent">
              {WorkType == '1' ? (
                <Select placeholder="请选择内容项" style={{ width: '200px' }}>
                  {contentList.map(item => {
                    return (
                      <Option value={item.value} key={item.value}>
                        {item.name}
                      </Option>
                    );
                  })}
                </Select>
              ) : (
                <Input placeholder="内容项" allowClear />
              )}
            </Form.Item>
            <Form.Item label="工作结果" name="workResults">
              <Radio.Group>
                <Radio value={null}>全部</Radio>
                <Radio value={1}>完成</Radio>
                <Radio value={0}>未完成</Radio>
              </Radio.Group>
            </Form.Item>
            <Space>
              <Button
                type="primary"
                onClick={() => handleTableChange(1, 20)}
                loading={queryLoading}
              >
                查询
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  form.resetFields();
                  handleTableChange(1, 20);
                }}
              >
                重置
              </Button>

              {mode !== 'record' && [
                <Button
                  type="primary"
                  onClick={() => {
                    setHandleWorkModalOpen(true);
                    setEditData({});
                  }}
                >
                  添加
                </Button>,
                <Button
                  type="primary"
                  onClick={() => {
                    setRecordModalOpen(true);
                  }}
                >
                  {WorkTypeText[WorkType]}
                </Button>,
              ]}
              <Button loading={exportLoading} onClick={() => onExport()}>
                导出
              </Button>
            </Space>
          </Space>
        </Form>
      }
      style={{ marginTop: -8 }}
    >
      <SdlTable
        loading={queryLoading}
        align="center"
        columns={getColumns()}
        dataSource={dataSource}
        pagination={{
          total: tableTotal,
          pageSize: pageSize,
          current: pageIndex,
          showSizeChanger: true,
          showQuickJumper: true,
          onChange: handleTableChange,
        }}
      />

      <HandleWorkModal
        open={handleWorkModalOpen}
        editData={editData}
        WorkType={WorkType}
        CTOperation={CTOperation}
        onCancel={() => {
          setHandleWorkModalOpen(false);
        }}
        onSubmitCallback={() => {
          onFinish();
        }}
      />
      {recordModalOpen && (
        <RecordModal
          title={WorkTypeText[WorkType]}
          open={recordModalOpen}
          WorkType={WorkType}
          CTOperation={CTOperation}
          onCancel={() => {
            setRecordModalOpen(false);
          }}
        />
      )}
    </Card>
  );
};

export default connect(dvaPropsData)(Work);
