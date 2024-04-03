/*
 * @Author: JiaQi
 * @Date: 2024-04-02 11:09:09
 * @Last Modified by: JiaQi
 * @Last Modified time: 2024-04-03 16:05:17
 * @Description:  客户投诉解决页面内容
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
  Radio,
} from 'antd';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import moment from 'moment';
import SdlTable from '@/components/SdlTable';
import { DeleteOutlined, ExportOutlined, SelectOutlined } from '@ant-design/icons';
import AllViewModal from './AllViewModal';
import { EditIcon, DetailIcon, DelIcon } from '@/utils/icon';
import styles from '../../index.less';
import AddOrEditModal from './AddOrEditModal';
import ViewModal from './ViewModal';
import Dispose from './Dispose';

const { TextArea } = Input;

const dvaPropsData = ({ loading, common }) => ({
  largeRegionList: common.largeRegionList,
  provinceAllList: common.provinceList,
  queryLoading: loading.effects[`customer/GetCustomerComplaintsList`],
  exportLoading: loading.effects[`customer/ExportCustomerComplaints`],
});

const HandleComplaintsContentPage = props => {
  const [form] = Form.useForm();
  const [form1] = Form.useForm();

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [tableTotal, setTableTotal] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [isAllViewModalOpen, setIsAllViewModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [addOrEditModalOpen, setAddOrEditModalOpen] = useState(false);
  const [currentID, setCurrentID] = useState();
  const [provinceList, setProvinceList] = useState([]); // 大区、省份列表
  const [disposeModalOpen, setDisposeModalOpen] = useState(false);

  const { isAll, queryLoading, dispatch, exportLoading, largeRegionList, provinceAllList } = props;

  useEffect(() => {
    getLargeRegion();
    getTableDataSource();
  }, []);

  useEffect(() => {
    setProvinceList(provinceAllList);
  }, [provinceAllList]);

  // 获取大区及省份
  const getLargeRegion = () => {
    dispatch({
      type: 'common/getLargeRegion',
      payload: {},
    });
  };

  // 获取请求参数
  const getParams = () => {
    const values = form.getFieldsValue();
    return {
      ...values,
      time: undefined,
      btime: values.time ? values.time[0].startOf('day').format('YYYY-MM-DD HH:mm:ss') : undefined,
      etime: values.time ? values.time[1].endOf('day').format('YYYY-MM-DD HH:mm:ss') : undefined,
      allData: isAll ? 1 : 0,
    };
  };

  // 获取表格数据
  const getTableDataSource = (_pageIndex, _pageSize) => {
    const body = getParams();
    dispatch({
      type: 'customer/GetCustomerComplaintsList',
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

  // 删除
  const onDelete = id => {
    dispatch({
      type: 'customer/DeleteCustomerComplaints',
      payload: {
        id: id,
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
      type: 'customer/ExportCustomerComplaints',
      payload: {
        ...body,
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
        title: '大区名称',
        dataIndex: 'ServiceAreaName',
        key: 'ServiceAreaName',
        ellipsis: true,
      },
      {
        title: '省份',
        dataIndex: 'ProvinceName',
        key: 'ProvinceName',
        ellipsis: true,
      },
      {
        title: '项目编号',
        dataIndex: 'ProjectCode',
        key: 'ProjectCode',
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
        title: '投诉信息录入人',
        dataIndex: 'CreateUserName',
        key: 'CreateUserName',
        ellipsis: true,
      },
      {
        title: '投诉信息录入时间',
        dataIndex: 'CreateTime',
        key: 'CreateTime',
        ellipsis: true,
      },
      {
        title: '接收投诉日期',
        dataIndex: 'ReceiveComplaintDate',
        key: 'ReceiveComplaintDate',
        ellipsis: true,
        width: 220,
      },
      {
        title: '被投诉人',
        dataIndex: 'Complainant',
        key: 'Complainant',
        ellipsis: true,
      },
      {
        title: '投诉单位名称',
        dataIndex: 'ComplaintCompanyName',
        key: 'ComplaintCompanyName',
        ellipsis: true,
      },
      {
        title: '投诉客户名称',
        dataIndex: 'ComplaintCustomerName',
        key: 'ComplaintCustomerName',
        ellipsis: true,
      },
      {
        title: '投诉客户联系方式',
        dataIndex: 'ComplaintCustomerPhone',
        key: 'ComplaintCustomerPhone',
        ellipsis: true,
      },
      {
        title: '投诉方式',
        dataIndex: 'ComplaintMethods',
        key: 'ComplaintMethods',
        ellipsis: true,
      },
      {
        title: '投诉问题内容',
        dataIndex: 'ProblemDescription',
        key: 'ProblemDescription',
        ellipsis: true,
        width: 220,
      },
      {
        title: '解决状态',
        dataIndex: 'ResolutionStatusName',
        key: 'ResolutionStatusName',
        ellipsis: true,
        render: (text, record) => {
          if (record.ResolutionStatus === '1') {
            return <span style={{ color: 'red' }}>{text}</span>;
          }
          return text;
        },
      },
      {
        title: '处理人',
        dataIndex: 'ProcessedByName',
        key: 'ProcessedByName',
        ellipsis: true,
      },
      {
        title: '处理结果',
        dataIndex: 'ProcessingResults',
        key: 'ProcessingResults',
        ellipsis: true,
        width: 220,
      },
      {
        title: '扣款金额',
        dataIndex: 'DeductionAmount',
        key: 'DeductionAmount',
        ellipsis: true,
      },
      {
        title: '纠正预防措施',
        dataIndex: 'PreventiveMeasure',
        key: 'PreventiveMeasure',
        ellipsis: true,
      },
      {
        title: '人员考核',
        dataIndex: 'PersonnelAssessment',
        key: 'PersonnelAssessment',
        ellipsis: true,
      },
      {
        title: '处理时间',
        dataIndex: 'ProcessingTime',
        key: 'ProcessingTime',
        ellipsis: true,
      },
      {
        title: '状态',
        dataIndex: 'StatusName',
        key: 'StatusName',
        ellipsis: true,
      },
      {
        title: '操作',
        dataIndex: 'handle',
        align: 'center',
        fixed: 'right',
        width: 150,
        ellipsis: true,
        render: (text, record) => {
          console.log('isAll', isAll);
          return (
            <>
              {record.IsEidtOrDel && !isAll && (
                <>
                  <Tooltip title="编辑">
                    <a
                      onClick={() => {
                        setCurrentID(record.ID);
                        // onAddOrEdit(record.ID);
                        form1.setFieldsValue({
                          ...record,
                          ProcessingCompletion: moment(record.ProcessingCompletion),
                          RecipientDate: moment(record.RecipientDate),
                        });
                        setAddOrEditModalOpen(true);
                      }}
                    >
                      <EditIcon />
                    </a>
                  </Tooltip>
                  <Divider type="vertical" />
                </>
              )}
              <Tooltip title="详情">
                <a
                  onClick={() => {
                    setCurrentID(record.ID);
                    setViewModalOpen(true);
                  }}
                >
                  <DetailIcon />
                </a>
              </Tooltip>
              {record.IsEidtOrDel && !isAll && (
                <>
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
              )}
              {record.IsProcessing && !isAll && (
                <>
                  <Divider type="vertical" />
                  <Tooltip title="处理">
                    <a
                      onClick={() => {
                        setCurrentID(record.ID);
                        setDisposeModalOpen(true);
                      }}
                    >
                      <SelectOutlined style={{ fontSize: 16 }} />
                    </a>
                  </Tooltip>
                </>
              )}
            </>
          );
        },
      },
    ];

    // 查看全部过滤掉“状态”
    if (isAll) {
      columns = columns.filter(item => item.dataIndex !== 'StatusName');
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
          initialValues={{
            resolutionStatus: null,
          }}
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
              <Form.Item name="serviceAreaCode" label="大区名称">
                <Select
                  placeholder="请选择大区名称"
                  style={{ width: '100%' }}
                  allowClear
                  onChange={(value, option) => {
                    if (value) {
                      setProvinceList(option['data-childList']);
                    } else {
                      setProvinceList(provinceAllList);
                    }
                    form.setFieldsValue({ province: undefined });
                  }}
                >
                  {largeRegionList.map(item => {
                    return (
                      <Option value={item.ID} key={item.ID} data-childList={item.ChildList}>
                        {item.LargeRegion}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="province" label="省份">
                <Select placeholder="请选择省份" style={{ width: '100%' }} allowClear>
                  {provinceList.map(item => {
                    return (
                      <Option value={item.RegionCode} key={item.RegionCode}>
                        {item.RegionName}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="projectCode" label="项目编号">
                <Input placeholder="请输入" allowClear />
              </Form.Item>
            </Col>
            {isAll && (
              <Col span={8}>
                <Form.Item name="createUserName" label="投诉信息录入人">
                  <Input placeholder="请输入" allowClear />
                </Form.Item>
              </Col>
            )}
            <Col span={8}>
              <Form.Item name="time" label="接收投诉日期">
                <RangePicker_ style={{ width: '100%' }} format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
            {isAll && (
              <Col span={8}>
                <Form.Item name="resolutionStatus" label="解决状态">
                  <Radio.Group>
                    <Radio value={null}>全部</Radio>
                    <Radio value={1}>待解决</Radio>
                    <Radio value={2}>已解决</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            )}
            <Col span={16}>
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
                        setCurrentID();
                        setAddOrEditModalOpen(true);
                        form1.resetFields();
                      }}
                    >
                      登记
                    </Button>
                  )}
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
                  {!isAll && (
                    <Button
                      type="primary"
                      // icon={<ExportOutlined />}
                      onClick={() => {
                        setIsAllViewModalOpen(true);
                      }}
                    >
                      查看全部
                    </Button>
                  )}
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    );
  };

  const getPageContent = () => {
    return (
      <Card bordered={isAll ? false : true} title={<SearchComponents />}>
        <SdlTable
          loading={queryLoading}
          align="center"
          resizable
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
        {/* 查看全部 */}
        <AllViewModal
          isModalOpen={isAllViewModalOpen}
          onCancel={() => {
            setIsAllViewModalOpen(false);
          }}
        />
        {/* 添加、编辑弹窗 */}
        {addOrEditModalOpen && (
          <AddOrEditModal
            isModalOpen={addOrEditModalOpen}
            largeRegionList={largeRegionList}
            ID={currentID}
            onSuccessCallback={() => {
              setAddOrEditModalOpen(false);
              getTableDataSource();
            }}
            onCancel={() => {
              setAddOrEditModalOpen(false);
            }}
          />
        )}

        {/* 查看详情 */}
        {viewModalOpen && (
          <ViewModal
            id={currentID}
            isModalOpen={viewModalOpen}
            onCancel={() => {
              setViewModalOpen(false);
            }}
          />
        )}
        {/* 投诉处理 */}
        {disposeModalOpen && (
          <Dispose
            id={currentID}
            isModalOpen={disposeModalOpen}
            onCancel={() => {
              setDisposeModalOpen(false);
            }}
            reloadPageData={() => {
              getTableDataSource();
            }}
          />
        )}
      </Card>
    );
  };

  return getPageContent();
};

export default connect(dvaPropsData)(HandleComplaintsContentPage);
