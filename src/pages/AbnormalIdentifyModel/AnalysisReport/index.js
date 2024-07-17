/*
 * @Author: JiaQi
 * @Date: 2024-07-01 10:28:01
 * @Last Modified by: JiaQi
 * @Last Modified time: 2024-07-16 17:00:26
 * @Description:  异常数据分析报告
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  Modal,
  Input,
  Popconfirm,
  Space,
  Button,
  Divider,
  message,
  Upload,
  Tooltip,
} from 'antd';
import moment from 'moment';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import SdlTable from '@/components/SdlTable';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import { DownloadOutlined, DeleteOutlined, InboxOutlined } from '@ant-design/icons';
import { downloadFile } from '@/utils/utils';
import Cookie from 'js-cookie';
import cuid from 'cuid';
import { API } from '@config/API';
import config from '@/config';

const { Dragger } = Upload;

const dvaPropsData = ({ loading, dataModel }) => ({
  loading: loading.effects['AbnormalIdentifyModel/GetRegionReportList'],
  queryLoading: loading.effects['AbnormalIdentifyModel/GetRegionReportList'],
  createLoading: loading.effects['AbnormalIdentifyModel/createReport'],
  uploadLoading: loading.effects['AbnormalIdentifyModel/uploadReport'],
});

const AnalysisReport = props => {
  const [form] = Form.useForm();
  const [form1] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [handleType, setHandleType] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [uploadId, setUploadId] = useState(cuid());
  const [fileList, setFileList] = useState([]);

  const { dispatch, loading, queryLoading, createLoading, uploadLoading } = props;

  useEffect(() => {
    getReportList();
  }, []);

  // 获取报告列表
  const getReportList = () => {
    let values = form.getFieldsValue();
    dispatch({
      type: 'AbnormalIdentifyModel/GetRegionReportList',
      payload: {
        ...values,
      },
      callback: res => {
        setDataSource(res);
      },
    });
  };

  // 生成报告
  const createReport = () => {
    form1.validateFields().then(values => {
      dispatch({
        type: 'AbnormalIdentifyModel/createReport',
        payload: {
          ...values,
          time: undefined,
          beginTime: moment(values.time[0]).format('YYYY-MM-DD 00:00:00'),
          endTime: moment(values.time[1]).format('YYYY-MM-DD 23:59:59'),
        },
        callback: res => {
          message.success('生成报告成功!');
          onCancel();
          getReportList();
        },
      });
    });
  };

  // 上传报告
  const uploadReport = () => {
    if (!fileList.length) {
      message.error('请上传报告文件！');
      return;
    }
    form1.validateFields().then(values => {
      dispatch({
        type: 'AbnormalIdentifyModel/uploadReport',
        payload: {
          ...values,
          time: undefined,
          beginTime: moment(values.time[0]).format('YYYY-MM-DD 00:00:00'),
          endTime: moment(values.time[1]).format('YYYY-MM-DD 23:59:59'),
        },
        callback: res => {
          message.success('上传报告成功!');
          onCancel();
          getReportList();
        },
      });
    });
  };

  // 删除报告
  const onDelete = id => {
    dispatch({
      type: 'AbnormalIdentifyModel/DeleteModelReport',
      payload: {
        ReportGuid: id,
      },
      callback: res => {
        message.success('删除成功!');
        getReportList();
      },
    });
  };

  // 关闭弹窗，清空form
  const onCancel = () => {
    setIsModalOpen(false);
    form1.resetFields();
    setFileList([]);
    setUploadId(cuid());
  };

  const columns = [
    {
      title: '序号',
    },
    {
      title: '报告名称',
      dataIndex: 'ReportName',
      key: 'ReportName',
    },
    {
      title: '客户',
      dataIndex: 'CustomName',
      key: 'CustomName',
    },
    {
      title: '辖区',
      dataIndex: 'AreaName',
      key: 'AreaName',
    },
    {
      title: '分析时间',
      dataIndex: 'AnlysisTime',
      key: 'AnlysisTime',
    },
    {
      title: '生成方式',
      dataIndex: 'SourceType',
      key: 'SourceType',
    },
    {
      title: '生成时间',
      dataIndex: 'CreateTime',
      key: 'CreateTime',
      sorter: (a, b) => moment(a.CreateTime).valueOf() - moment(b.CreateTime).valueOf(),
    },
    {
      title: '操作',
      key: 'handle',
      render: (text, record) => {
        return (
          <div style={{ fontSize: 16 }}>
            <a>
              <Tooltip title="下载">
                <DownloadOutlined
                  onClick={() => {
                    downloadFile('/' + record?.Report?.ImgList[0]);
                  }}
                />
              </Tooltip>
            </a>
            <Divider type="vertical" />
            <a>
              <Popconfirm title="是否确认删除?" onConfirm={() => onDelete(record.ReportGuid)}>
                <Tooltip title="删除">
                  <DeleteOutlined />
                </Tooltip>
              </Popconfirm>
            </a>
          </div>
        );
      },
    },
  ];

  // const uploadFileListProps = {};
  // if (editData && editData.FilesList) {
  //   uploadFileListProps.fileList = fileList;
  // }
  const uploadProps = {
    name: 'file',
    accept: '.doc,.docx',
    multiple: true,
    action: API.UploadApi.UploadFiles,
    headers: {
      Authorization: 'Bearer ' + Cookie.get(config.cookieName),
    },
    data: {
      FileUuid: uploadId,
      FileActualType: '0',
    },
    style: { width: 400 },
    onChange(info) {
      const fileArr = [];
      info.fileList.forEach(file => {
        const { status, uid, name, response, url, percent } = file;

        if (status === 'done') {
          fileArr.push({
            uid: response?.Datas?.fNameList[0]
              ? response?.Datas?.fNameList[0].split('/').pop()
              : uid,
            name,
            status,
            url: '/' + response?.Datas?.fNameList[0] || url,
          });
          form1.setFieldValue('fileUuid', uploadId);
        } else if (status === 'uploading') {
          fileArr.push({
            uid,
            name,
            status,
            percent,
          });
        }
      });
      setFileList(fileArr);
    },
    onDrop(e) {},
    onRemove(file) {
      if (!file.error) {
        dispatch({
          type: 'autoForm/deleteAttach',
          payload: {
            // FileName: file.response && file.response.Datas ? file.response.Datas : file.name,
            Guid: file.response && file.response.Datas ? file.response.Datas : file.uid,
          },
        });
      }
    },
  };

  const getPageContent = () => {
    return (
      <Card
        bodyStyle={{}}
        title={
          <Form form={form} layout="inline" initialValues={{}}>
            <Form.Item name="reportName" label="报告名称">
              <Input placeholder="请输入报告名称" allowClear style={{ width: 200 }} />
            </Form.Item>
            <Form.Item label="辖区" name="regionName">
              <Input placeholder="请输入辖区" allowClear style={{ width: 200 }} />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" loading={queryLoading} onClick={getReportList}>
                  查询
                </Button>
                <Divider type="vertical" />
                <Button
                  type="primary"
                  onClick={() => {
                    setIsModalOpen(true);
                    setHandleType('create');
                  }}
                >
                  生成报告
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    setIsModalOpen(true);
                    setHandleType('upload');
                  }}
                >
                  上传报告
                </Button>
              </Space>
            </Form.Item>
          </Form>
        }
      >
        <SdlTable loading={loading} align="center" dataSource={dataSource} columns={columns} />

        <Modal
          title={handleType === 'create' ? '生成报告' : '上传报告'}
          width={800}
          destroyOnClose
          open={isModalOpen}
          onOk={handleType === 'create' ? createReport : uploadReport}
          // okText="生成"
          confirmLoading={handleType === 'create' ? createLoading : uploadLoading}
          onCancel={() => {
            onCancel();
          }}
        >
          <Form
            form={form1}
            labelCol={{
              flex: '200px',
            }}
            initialValues={{}}
          >
            <Form.Item
              name="reportName"
              label="报告名称"
              rules={[{ required: true, message: '请输入报告名称!' }]}
            >
              <Input placeholder="请输入报告名称" allowClear style={{ width: 400 }} />
            </Form.Item>
            <Form.Item
              label="辖区"
              name="regionName"
              rules={[{ required: true, message: '请输入辖区!' }]}
            >
              <Input placeholder="请输入辖区" allowClear style={{ width: 400 }} />
            </Form.Item>
            <Form.Item
              label="客户"
              name="customName"
              rules={[{ required: true, message: '请输入客户名称!' }]}
            >
              <Input placeholder="请输入客户名称" allowClear style={{ width: 400 }} />
            </Form.Item>
            <Form.Item
              label="时间"
              name="time"
              rules={[{ required: true, message: '请选择时间!' }]}
            >
              <RangePicker_
                // allowClear={false}
                // dataType="day"
                format="YYYY-MM-DD"
                style={{ width: 400 }}
              />
            </Form.Item>
            {handleType === 'upload' && (
              <Form.Item
                label="报告文件"
                name="fileUuid"
                rules={[{ required: true, message: '请上传报告文件!' }]}
              >
                <Dragger {...uploadProps}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">单击或拖动文件到此区域进行上传</p>
                  <p className="ant-upload-hint">文件扩展名：.doc/.docx</p>
                </Dragger>
              </Form.Item>
            )}
          </Form>
        </Modal>
      </Card>
    );
  };

  return <BreadcrumbWrapper>{getPageContent()}</BreadcrumbWrapper>;
};

export default connect(dvaPropsData)(AnalysisReport);
