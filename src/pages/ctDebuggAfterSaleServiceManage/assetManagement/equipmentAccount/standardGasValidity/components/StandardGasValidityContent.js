/*
 * @Author: JiaQi 
 * @Date: 2024-04-07 17:29:36 
 * @Last Modified by:   JiaQi 
 * @Last Modified time: 2024-04-07 17:29:36 
 * @Description:  标气有效期页面内容
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Form,
  Card,
  Input,
  Button,
  Popconfirm,
  Select,
  Space,
  Row,
  Col,
  message,
  Divider,
  Tooltip,
  DatePicker,
  Modal,
} from 'antd';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import moment from 'moment';
import SdlTable from '@/components/SdlTable';
import { DeleteOutlined, ExportOutlined } from '@ant-design/icons';
// import AllViewModal from './AllViewModal';
import { EditIcon, DetailIcon, DelIcon } from '@/utils/icon';
import ImportFile from './ImportFile';
// import styles from '../../index.less';

const { TextArea } = Input;

const dvaPropsData = ({ loading }) => ({
  queryLoading: loading.effects[`standardGasValidity/GetStandardAirList`],
  exportLoading: loading.effects[`standardGasValidity/ExportStandardAir`],
  saveLoading: loading.effects['standardGasValidity/UpdateOrAddStandardAir'],
});

const StandardGasValidityContent = props => {
  const [form] = Form.useForm();
  const [form1] = Form.useForm();

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [tableTotal, setTableTotal] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [isAllViewModalOpen, setIsAllViewModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addOrEditModalOpen, setAddOrEditModalOpen] = useState(false);
  const [currentID, setCurrentID] = useState();
  const [isView, setIsView] = useState(false);

  const { isAll, queryLoading, saveLoading, dispatch, exportLoading,isWorkBench } = props;

  useEffect(() => {
    getTableDataSource();
  }, []);

  // 获取请求参数
  const getParams = () => {
    const values = form.getFieldsValue();
    return {
      ...values,
      time: undefined,
      beginTime: values.time
        ? values.time[0].startOf('day').format('YYYY-MM-DD HH:mm:ss')
        : undefined,
      endTime: values.time ? values.time[1].endOf('day').format('YYYY-MM-DD HH:mm:ss') : undefined,
      dataType: isAll  ? 1 : '0',
    };
  };

  // 获取表格数据
  const getTableDataSource = (_pageIndex, _pageSize) => {
    const body = getParams();
    dispatch({
      type: 'standardGasValidity/GetStandardAirList',
      payload: {
        ...body,
        pageIndex: _pageIndex || pageIndex,
        pageSize: _pageSize || pageSize,
        gasID:props.id
      },
      callback: res => {
        setDataSource(res.Datas);
        setTableTotal(res.Total);
      },
    });
  };

  // 删除
  const onDelete = id => {
    dispatch({
      type: 'standardGasValidity/DeleteStandardAir',
      payload: {
        ID: id,
      },
      callback: res => {
        handleTableChange(1, 20);
      },
    });
  };

  // 导出
  const onExport = () => {
    const body = getParams();
    dispatch({
      type: 'standardGasValidity/ExportStandardAir',
      payload: {
        ...body,
        // isExport: 1,
      },
    });
  };

  const getColumns = () => {
    let columns = [
      {
        title: '序号',
        align: 'center',
        fixed: 'left',
        ellipsis: true,
        render: (text, record, index) => {
          return index + 1 + (pageIndex - 1) * pageSize;
        },
      },
      {
        title: '项目编号',
        dataIndex: 'SerchCode',
        key: 'SerchCode',
        fixed: 'left',
        ellipsis: true,
      },
      {
        title: '项目名称',
        dataIndex: 'ProjectName',
        key: 'ProjectName',
        ellipsis: true,
        fixed: 'left',
        width: 200,
      },
      {
        title: '最终用户单位',
        dataIndex: 'CustomEnt',
        key: 'CustomEnt',
        ellipsis: true,
        width: 200,
      },
      {
        title: '项目所在省',
        dataIndex: 'Province',
        key: 'Province',
        ellipsis: true,
      },
      {
        title: '提供服务大区',
        dataIndex: 'Region',
        key: 'Region',
        ellipsis: true,
        width: 200,
      },
      {
        title: '物料编码',
        dataIndex: 'MaterialCode',
        key: 'MaterialCode',
        ellipsis: true,
      },
      {
        title: '标气名称',
        dataIndex: 'GasName',
        key: 'GasName',
        ellipsis: true,
        width: 220,
      },
      {
        title: '规格型号',
        dataIndex: 'Specification',
        key: 'Specification',
        ellipsis: true,
      },
      {
        title: '有效期',
        dataIndex: 'ValidDate',
        key: 'ValidDate',
        ellipsis: true,
        width: 200,
        render: (text, record) => {
          return text ? moment(text).format('YYYY-MM-DD') : '-';
        },
      },
      {
        title: '标气厂家',
        dataIndex: 'AirFactory',
        key: 'AirFactory',
        ellipsis: true,
        width: 200,
      },
      {
        title: '创建人',
        dataIndex: 'CreatUserName',
        key: 'CreatUserName',
        ellipsis: true,
      },
      {
        title: '创建时间',
        dataIndex: 'CreateDate',
        key: 'CreateDate',
        ellipsis: true,
        width: 200,
      },
      {
        title: '操作',
        dataIndex: 'handle',
        align: 'center',
        fixed: 'right',
        width: 120,
        ellipsis: true,
        render: (text, record) => {
          return (
            <>
              <Tooltip title="编辑">
                <a
                  onClick={() => {
                    setCurrentID(record.ID);
                    // onAddOrEdit(record.ID);
                    form1.setFieldsValue({
                      ...record,
                      ValidDate: moment(record.ValidDate),
                    });
                    setAddOrEditModalOpen(true);
                  }}
                >
                  <EditIcon />
                </a>
              </Tooltip>
              <Divider type="vertical" />
              <Tooltip title="删除">
                <Popconfirm
                  placement="left"
                  title="确定要删除吗？"
                  onConfirm={() => onDelete(record.ID)}
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
      },
    ];

    // 查看全部过滤掉操作列和“离开现场时间”
    if (isAll) {
      columns = columns.filter(
        item => item.dataIndex !== 'handle' && item.dataIndex !== 'LeaveDate',
      );
    }
    if(isWorkBench){ //工作台弹框
      columns = columns.filter(
        item => item.dataIndex !== 'CreatUserName' && item.dataIndex !== 'CreateDate',
      );
    }

    return columns;
  };

  //分页
  const handleTableChange = async (PageIndex, PageSize) => {
    setPageSize(PageSize);
    setPageIndex(PageIndex);
    getTableDataSource(PageIndex, PageSize);
  };

  // 搜索组件
  const SearchComponents = () => {
    return (
      <div>
        <Form
          id="searchForm"
          form={form}
          // layout="inline"
          initialValues={
            {
              // time: [moment().startOf('month'), moment()],
            }
          }
          autoComplete="off"
          labelCol={{
            flex: '110px',
          }}
          wrapperCol={{
            flex: 1,
          }}
        >
          <Row align="middle">
            <Col span={8}>
              <Form.Item name="serchCode" label="项目编号">
                <Input placeholder="请输入" allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="materialCode" label="物料编码">
                <Input placeholder="请输入" allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="gasName" label="标气名称">
                <Input placeholder="请输入" allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="time" label="有效期">
                <RangePicker_ style={{ width: '100%' }} format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="airFactory" label="标气厂家">
                <Input placeholder="请输入" allowClear />
              </Form.Item>
            </Col>
            <Form.Item>
              <Space style={{ marginLeft: 10 }}>
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
                <Button
                  onClick={() => {
                    form.resetFields();
                    getTableDataSource(1, 20);
                  }}
                >
                  重置
                </Button>
                {!isAll && (
                  <Button
                    type="primary"
                    loading={queryLoading}
                    onClick={() => {
                      setIsView(false);
                      setCurrentID();
                      setAddOrEditModalOpen(true);
                      form1.resetFields();
                    }}
                  >
                    添加
                  </Button>
                )}
                <ImportFile
                  onSuccess={() => {
                    getTableDataSource(1, 20);
                  }}
                />
                <Button
                  type="primary"
                  icon={<ExportOutlined />}
                  loading={exportLoading}
                  onClick={() => {
                    onExport();
                  }}
                >
                  导出
                </Button>
                {/* {!isAll && (
                <Button
                  type="primary"
                  // icon={<ExportOutlined />}
                  onClick={() => {
                    setIsAllViewModalOpen(true);
                  }}
                >
                  已发出提醒记录
                </Button>
              )} */}
              </Space>
            </Form.Item>
          </Row>
        </Form>
      </div>
    );
  };

  // 保存添加或编辑
  const onAddOrEdit = () => {
    form1.validateFields().then(values => {
      console.log('values', values);
      // return;
      dispatch({
        type: 'standardGasValidity/UpdateOrAddStandardAir',
        payload: {
          id: currentID,
          ...values,
          ValidDate: values.ValidDate.format('YYYY-MM-DD HH:mm:ss'),
        },
        callback: res => {
          message.success('操作成功！');
          if (currentID) {
            setAddOrEditModalOpen(false);
          }
          form1.setFieldsValue({
            MaterialCode: undefined,
            GasName: undefined,
            Specification: undefined,
            ValidDate: undefined,
            AirFactory: undefined,
          });
          getTableDataSource();
        },
      });
    });
  };

  const getPageContent = () => {
    return (
      <Card bordered={isAll ? false : true} title={!isWorkBench&&<SearchComponents />}>
        <SdlTable
          loading={queryLoading}
          align="center"
          dataSource={dataSource}
          columns={getColumns()}
          pagination={{
            total: tableTotal,
            pageSize: pageSize,
            current: pageIndex,
            showSizeChanger: true,
            showQuickJumper: true,
            onChange: handleTableChange,
          }}
        />
        {/* <AllViewModal
          isModalOpen={isAllViewModalOpen}
          onCancel={() => {
            setIsAllViewModalOpen(false);
          }}
        /> */}
        {/* 添加、编辑弹窗 */}
        <Modal
          title={currentID ? '编辑' : '添加'}
          visible={addOrEditModalOpen}
          width={600}
          destroyOnClose
          confirmLoading={saveLoading}
          onOk={() => {
            onAddOrEdit();
          }}
          onCancel={() => {
            setAddOrEditModalOpen(false);
          }}
        >
          <Form
            // className={styles.hotPhoneForm}
            form={form1}
            layout="horizontal"
            initialValues={{}}
            labelCol={{
              flex: '160px',
            }}
            wrapperCol={{
              flex: '300px',
            }}
            requiredMark={isView ? false : true}
          >
            <Form.Item
              name="SerchCode"
              label="项目编号"
              rules={[
                {
                  required: true,
                  message: '请填写项目编号！',
                },
              ]}
            >
              <Input placeholder="请输入" allowClear />
            </Form.Item>
            <Form.Item
              name="MaterialCode"
              label="物料编码"
              rules={[
                {
                  required: true,
                  message: '请填写物料编码！',
                },
              ]}
            >
              <Input placeholder="请输入" allowClear />
            </Form.Item>
            <Form.Item
              name="GasName"
              label="标气名称"
              rules={[
                {
                  required: true,
                  message: '请填写标气名称！',
                },
              ]}
            >
              <Input placeholder="请输入" allowClear />
            </Form.Item>
            <Form.Item
              name="AirFactory"
              label="标气厂家"
              rules={[
                {
                  required: true,
                  message: '请填写标气厂家！',
                },
              ]}
            >
              <Input placeholder="请输入" allowClear />
            </Form.Item>
            <Form.Item
              name="Specification"
              label="规格型号"
              rules={[
                {
                  required: true,
                  message: '请填写规格型号！',
                },
              ]}
            >
              <Input placeholder="请输入" allowClear />
            </Form.Item>
            <Form.Item
              name="ValidDate"
              label="有效期"
              rules={[
                {
                  required: true,
                  message: '请选择有效期！',
                },
              ]}
            >
              <DatePicker placeholder="请选择" style={{ width: '100%' }} allowClear />
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    );
  };

  return getPageContent();
};

export default connect(dvaPropsData)(StandardGasValidityContent);
