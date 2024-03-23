/*
 * @Author: JiaQi
 * @Date: 2024-03-22 15:41:16
 * @Last Modified by: JiaQi
 * @Last Modified time: 2024-03-23 14:33:50
 * @Description:  服务报告抽查 - 抽查页面
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Form,
  Modal,
  Input,
  Button,
  Tabs,
  Select,
  Space,
  Steps,
  Row,
  message,
  Divider,
  Descriptions,
  Upload,
  Radio,
  Result,
} from 'antd';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import moment from 'moment';
import SdlTable from '@/components/SdlTable';
import styles from '../index.less';
import ImageView from '@/components/ImageView';
import SdlUpload from '@/pages/AutoFormManager/SdlUpload';
import cuid from 'cuid';

const { Step } = Steps;
const { TextArea } = Input;

const dvaPropsData = ({ loading }) => ({
  queryLoading: loading.effects[`reportSpotCheck/GetServiceReportList`],
});

const SpotCheckPage = props => {
  const [form] = Form.useForm();
  const [form1] = Form.useForm();

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [tableTotal, setTableTotal] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [stepCurrent, setStepCurrent] = useState(0);
  const [serviceReportData, setServiceReportData] = useState([]);
  const [isImageViewOpen, setIsImageViewOpen] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [imageList, setImageList] = useState([]);
  // const [uid, setUid] = useState(cuid());
  const [currentNum, setCurrentNum] = useState();

  const { dispatch, queryLoading, isModalOpen, onCancel, reloadPageData } = props;

  useEffect(() => {
    getTableDataSource();
  }, []);

  // 获取表格数据
  const getTableDataSource = (_pageIndex, _pageSize) => {
    const values = form.getFieldsValue();
    console.log('values', values);
    let body = {
      ...values,
      time: undefined,
      // outBeginTime: values.time[0].startOf('day').format('YYYY-MM-DD HH:mm:ss'),
      // outEndTime: values.time[1].endOf('day').format('YYYY-MM-DD HH:mm:ss'),
    };
    dispatch({
      type: 'reportSpotCheck/GetServiceReportList',
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

  // 获取服务详情
  const GetSingleServiceReport = id => {
    dispatch({
      type: 'reportSpotCheck/GetSingleServiceReport',
      payload: {
        id,
      },
      callback: res => {
        setServiceReportData(res.Datas);
      },
    });
  };

  // 添加服务抽查报告
  const AddCheckServiceReport = () => {
    form1.validateFields().then(values => {
      console.log('values', values);
      // return;
      dispatch({
        type: 'reportSpotCheck/AddCheckServiceReport',
        payload: {
          num: currentNum,
          ...values,
        },
        callback: res => {
          setStepCurrent(3);
        },
      }).catch(errorInfo => {
        message.warning('请输入完整的数据');
        return;
      });
    });
  };

  // 再次抽查
  const onSpotCheckAgain = () => {
    getTableDataSource(1, 20);
    setStepCurrent(0);
    // 重新加载数据列表
    reloadPageData();
  };

  //分页
  const handleTableChange = async (PageIndex, PageSize) => {
    setPageSize(PageSize);
    setPageIndex(PageIndex);
    getTableDataSource(PageIndex, PageSize);
  };

  let columns = [
    {
      title: '序号',
      align: 'center',
      ellipsis: true,
      render: (text, record, index) => {
        return index + 1 + (pageIndex - 1) * pageSize;
      },
    },
    {
      title: '派工单号',
      dataIndex: 'Num',
      key: 'Num',
      ellipsis: true,
    },
    {
      title: '合同编号',
      dataIndex: 'ProjectID',
      key: 'ProjectID',
      ellipsis: true,
      width: 200,
    },
    {
      title: '立项号',
      dataIndex: 'ItemCode',
      key: 'ItemCode',
      ellipsis: true,
    },
    {
      title: '项目名称',
      dataIndex: 'ProjectName',
      key: 'ProjectName',
      ellipsis: true,
      width: 200,
    },
    {
      title: '工程助理',
      dataIndex: 'AssistantName',
      key: 'AssistantName',
      ellipsis: true,
    },
    {
      title: '服务工程师',
      dataIndex: 'WorkerName',
      key: 'WorkerName',
      ellipsis: true,
    },
    {
      title: '服务申请人',
      dataIndex: 'ApplicantUserName',
      key: 'ApplicantUserName',
      ellipsis: true,
    },
    {
      title: '下单日期',
      dataIndex: 'OrderDate',
      key: 'OrderDate',
      ellipsis: true,
      width: 180,
    },
    {
      title: '项目所属行业',
      dataIndex: 'Industry',
      key: 'Industry',
      ellipsis: true,
      width: 180,
    },
    {
      title: '流程状态',
      dataIndex: 'StatusName',
      key: 'StatusName',
      ellipsis: true,
      width: 180,
    },
    {
      title: '任务状态',
      dataIndex: 'TaskStatusName',
      key: 'TaskStatusName',
      ellipsis: true,
    },
    {
      title: '提交人',
      dataIndex: 'CommitUserName',
      key: 'CommitUserName',
      ellipsis: true,
    },
    {
      title: '提交时间',
      dataIndex: 'CommitDate',
      key: 'CommitDate',
      ellipsis: true,
    },
    {
      title: '操作',
      dataIndex: 'handle',
      align: 'center',
      fixed: 'right',
      width: 60,
      ellipsis: true,
      render: (text, record) => {
        return (
          <a
            onClick={() => {
              setStepCurrent(1);
              setCurrentNum(record.Num);
              GetSingleServiceReport(record.ID);
            }}
          >
            下一步
          </a>
        );
      },
    },
  ];

  // 查看图片
  const ViewUploadComponents = ({ fileList }) => {
    console.log('fileList', fileList);
    return (
      <>
        <Upload
          // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          listType="picture-card"
          showUploadList={{ showPreviewIcon: true, showRemoveIcon: false }}
          fileList={fileList}
          onPreview={file => {
            setIsImageViewOpen(true);
            setImageIndex(file.uid);
            setImageList(fileList.map(item => item.url));
          }}
        >
          {/* {fileList.length >= 8 ? null : uploadButton} */}
        </Upload>
      </>
    );
  };

  // 第一步内容
  const getStep1Content = () => {
    return (
      <div>
        <Form
          id="searchForm"
          form={form}
          initialValues={{
            time: [
              moment().startOf('month'),
              moment()
                // .add(-1, 'day')
                .endOf('day'),
            ],
          }}
          autoComplete="off"
          style={{ marginBottom: 10 }}
          // labelCol={{ span: 5 }}
          // wrapperCol={{ span: 18 }}
          // labelCol={{
          //   flex: '90px',
          // }}
          // wrapperCol={{
          //   flex: 1,
          // }}
        >
          <Space size={30} align="middle">
            <Form.Item name="time" label="离开现场时间">
              <RangePicker_ style={{ width: '100%' }} format="YYYY-MM-DD" allowClear={false} />
            </Form.Item>
            <Form.Item name="num" label="派工单号">
              <Input placeholder="请输入" allowClear />
            </Form.Item>
            <Form.Item name="projectCode" label="合同编号">
              <Input placeholder="请输入" allowClear />
            </Form.Item>
            <Form.Item name="itemCode" label="立项号">
              <Input placeholder="请输入" allowClear />
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={queryLoading}
              onClick={() => {
                getTableDataSource(1, 20);
              }}
            >
              查询
            </Button>
          </Space>
        </Form>
        <SdlTable
          loading={queryLoading}
          align="center"
          dataSource={dataSource}
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
      </div>
    );
  };

  // 第二步内容
  const getStep2Content = () => {
    return (
      <div style={{ marginTop: 20 }}>
        {/* <TitleComponents text="基础信息-发起人填写" /> */}
        {serviceReportData.map(item => {
          let serviceData = item.ServiceList[0];
          let fileList = serviceData.FileList;
          let imgList = fileList.ImgList.map((img, index) => {
            return {
              uid: index,
              status: 'done',
              url: `/${img}`,
            };
          });
          return (
            <Descriptions title={item.ServiceName}>
              <Descriptions.Item label="验收服务报告照片">
                <ViewUploadComponents fileList={imgList} />
              </Descriptions.Item>
              <Descriptions.Item label="照片上传日期">{serviceData.CreateTime}</Descriptions.Item>
              <Descriptions.Item label="备注">{serviceData.Remark || '-'}</Descriptions.Item>
            </Descriptions>
          );
        })}
        <Row justify="center">
          <Space>
            <Button onClick={() => setStepCurrent(0)}>上一步</Button>
            <Button type="primary" onClick={() => setStepCurrent(2)}>
              下一步
            </Button>
          </Space>
        </Row>
        {/* 查看附件弹窗 */}
        <ImageView
          isOpen={isImageViewOpen}
          images={imageList}
          imageIndex={imageIndex}
          onCloseRequest={() => {
            setIsImageViewOpen(false);
          }}
        />
      </div>
    );
  };

  // 第三步内容
  const getStep3Content = () => {
    return (
      <>
        <Form
          id="searchForm"
          form={form1}
          initialValues={{
            checkResult: 0,
          }}
          autoComplete="off"
          style={{ marginBottom: 10 }}
          // labelCol={{ span: 5 }}
          // wrapperCol={{ span: 18 }}
          labelCol={{
            flex: '90px',
          }}
          wrapperCol={{
            flex: 1,
          }}
        >
          <Form.Item
            name="checkResult"
            label="抽查结果"
            rules={[
              {
                required: true,
                message: '不能为空！',
              },
            ]}
          >
            <Radio.Group>
              <Radio value={0}>合格</Radio>
              <Radio value={1}>不合格</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="remark"
            label="备注"
            rules={[
              {
                required: true,
                message: '备注不能为空！',
              },
            ]}
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="attachment"
            label="附件照片"
            rules={[
              {
                required: true,
                message: '备注不能为空！',
              },
            ]}
          >
            <SdlUpload
              accept="image/*"
              cuid={cuid()}
              uploadSuccess={id => {
                form1.setFieldsValue({ attachment: id });
              }}
            />
          </Form.Item>
        </Form>
        <Row justify="center">
          <Space>
            <Button onClick={() => setStepCurrent(1)}>上一步</Button>
            <Button type="primary" onClick={() => AddCheckServiceReport(3)}>
              下一步
            </Button>
          </Space>
        </Row>
      </>
    );
  };

  // 第四步内容
  const getStep4Content = () => {
    return (
      <Result
        status="success"
        title="操作完成!"
        extra={[
          <Button type="primary" onClick={() => onSpotCheckAgain()}>
            再次抽查
          </Button>,
        ]}
      />
    );
  };

  const TitleComponents = props => {
    return (
      <div
        style={{
          display: 'inline-block',
          fontWeight: 'bold',
          marginTop: 4,
          padding: '2px 0',
          marginBottom: 12,
          borderBottom: '1px solid rgba(0,0,0,.1)',
        }}
      >
        {props.text}
      </div>
    );
  };

  const renderStepContent = () => {
    switch (stepCurrent) {
      case 0:
        return getStep1Content();
      case 1:
        return getStep2Content();
      case 2:
        return getStep3Content();
      case 3:
        return getStep4Content();
    }
  };

  return (
    <Modal
      title={`服务报告抽查`}
      wrapClassName="spreadOverModal"
      visible={isModalOpen}
      destroyOnClose
      footer={[]}
      onCancel={() => {
        onCancel();
      }}
    >
      <Row justify="center" className={styles.stepsWrapper}>
        <Steps current={stepCurrent} style={{ width: '70%' }}>
          <Step title="查询服务报告" />
          <Step title="查看服务报告" />
          <Step title="提交抽查结果" />
          <Step title="完成" />
        </Steps>
      </Row>
      <div className={styles.stepsContent}>{renderStepContent()}</div>
    </Modal>
  );
};

export default connect(dvaPropsData)(SpotCheckPage);
