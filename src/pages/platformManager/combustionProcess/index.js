import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Form,
  Divider,
  Modal,
  Card,
  Spin,
  Button,
  Space,
  Select,
  InputNumber,
  Typography,
  message,
  Row,
  Radio,
} from 'antd';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import EntAtmoList from '@/components/EntAtmoList';
import SdlTable from '@/components/SdlTable';
import { API } from '@config/API';
import moment from 'moment';
import AssistDataAnalysis from '@/pages/AbnormalIdentifyModel/AssistDataAnalysis';
import { InfoCircleOutlined } from '@ant-design/icons';
import SelectPmCemsSupplierModal from './SelectPmCemsSupplierModal';

const { Text, Link } = Typography;

const dvaPropsData = ({ loading, AbnormalIdentifyModel }) => ({
  queryLoading: loading.effects['AbnormalIdentifyModel/GetCheckedRectificationList'],
  pointListLoading: loading.effects['AbnormalIdentifyModel/GetNoFilterPointByEntCode'],
});

const CombustionProcess = props => {
  const [form] = Form.useForm();
  const [form2] = Form.useForm();

  const { dispatch, pointListLoading, queryLoading } = props;
  const [dataSource, setDataSource] = useState([]);
  const [pointList, setPointList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAutoModalOpen, setIsAutoModalOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState({});
  const [PmCemsSupplier, setPmCemsSupplier] = useState([]);
  const [qualityStatus, setQualityStatus] = useState();
  const [autoQualityStatus, setAutoQualityStatus] = useState(1);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);

  useEffect(() => {
    getPageData(1, 20);
    GetPmCemsSupplierCode();
  }, []);

  // 获取页面数据
  const getPageData = (_pageIndex, _pageSize, _sortField, _order) => {
    const values = form.getFieldsValue();
    setLoading(true);
    dispatch({
      type: 'AbnormalIdentifyModel/GenericPostRequest',
      url: API.AbnormalIdentifyModel.PmCemsSupplierList,
      payload: {
        ...values,
        // isComplete: values.isComplete || '1,2,3',
        pageIndex: _pageIndex || pageIndex,
        pageSize: _pageSize || pageSize,
        SortField: _sortField !== undefined ? _sortField : sortField,
        isDescending: _order !== undefined ? _order : order,
      },
      callback: res => {
        setDataSource(res.Datas);
        setLoading(false);
        setTotal(res.Total);
      },
    });
  };

  // 获取燃烧工艺
  const GetPmCemsSupplierCode = () => {
    dispatch({
      type: 'AbnormalIdentifyModel/GenericPostRequest',
      url: API.AbnormalIdentifyModel.GetPmCemsSupplierCode,
      payload: {},
      callback: res => {
        setPmCemsSupplier(res.Datas);
      },
    });
  };

  // 根据企业获取排口
  const getPointList = EntCode => {
    dispatch({
      type: 'AbnormalIdentifyModel/GetNoFilterPointByEntCode',
      payload: {
        EntCode,
      },
      callback: res => {
        setPointList(res);
      },
    });
  };

  // 提交配置
  const onFinish = async () => {
    const values = await form2.validateFields();
    props.dispatch({
      type: 'AbnormalIdentifyModel/GenericPostRequest',
      url: API.AbnormalIdentifyModel.UpdatePmCemsSupplier,
      payload: {
        ...values,
        dgimn: currentRow.DGIMN,
      },
      callback: () => {
        message.success('操作成功！');
        getPageData();
        setIsModalOpen(false);
        form2.resetFields();
      },
    });
  };

  // 自动配置
  const onAutoFinish = () => {
    props.dispatch({
      type: 'AbnormalIdentifyModel/GenericPostRequest',
      url: API.AbnormalIdentifyModel.AutoPmCemsSupplier,
      payload: {
        qualityStatus: autoQualityStatus,
      },
      callback: () => {
        message.success('操作成功！');
        getPageData();
        setIsAutoModalOpen(false);
      },
    });
  };

  const getColumns = () => {
    return [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        width: 60,
        ellipsis: true,
        render: (text, record, index) => {
          return (pageIndex - 1) * pageSize + index + 1;
        },
      },
      {
        title: '企业',
        dataIndex: 'entName',
        key: 'entName',
        width: 180,
        ellipsis: true,
      },
      {
        title: '排口',
        dataIndex: 'pointName',
        key: 'pointName',
        width: 180,
        ellipsis: true,
      },
      {
        title: '燃烧工艺',
        dataIndex: 'pmCemsSupplierName',
        key: 'pmCemsSupplierName',
        ellipsis: true,
        width: 280,
        render: text => {
          return text || '-';
        },
      },
      {
        title: '修改人',
        dataIndex: 'createUser',
        key: 'createUser',
        ellipsis: true,
        width: 140,
        sorter: (a, b) => a.createUser - b.createUser,
        render: text => {
          return text || '-';
        },
      },
      {
        title: '修改时间',
        dataIndex: 'createTime',
        key: 'createTime',
        ellipsis: true,
        width: 140,
        sorter: (a, b) => a.createTime - b.createTime,
        render: text => {
          return text || '-';
        },
      },
      {
        title: '操作',
        dataIndex: 'handle',
        key: 'handle',
        ellipsis: true,
        render: (text, record) => {
          return (
            <div>
              <a
                onClick={() => {
                  setIsDataModalOpen(true);
                  setCurrentRow(record);
                }}
              >
                数据
              </a>
              <Divider type="vertical" />
              <a
                onClick={() => {
                  setIsModalOpen(true);
                  setCurrentRow(record);
                  form2.setFieldsValue({
                    ...record,
                    qualityStatus: record.qualityStatus || 2,
                  });
                  setQualityStatus(record.qualityStatus);
                }}
              >
                配置
              </a>
            </div>
          );
        },
      },
    ];
  };

  // 分页
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortField, setSortField] = useState();
  const [order, setOrder] = useState();
  const onTableChange = (current, pageSize) => {
    setPageIndex(current);
    setPageSize(pageSize);
    getPageData(current, pageSize);
  };

  // 排序、分页
  const onTableChange2 = (pagination, filters, sorter) => {
    console.log('sorter', sorter);
    const { pageSize, current } = pagination;
    const { order } = sorter;
    setPageSize(pageSize);
    setPageIndex(current);
    let _order = order === 'ascend' ? 1 : order === 'descend' ? 2 : null;
    let field = order ? sorter.field : null;
    setSortField(field);
    setOrder(_order);
    getPageData(current, pageSize, field, _order);
  };

  return (
    <BreadcrumbWrapper>
      <Card
        bodyStyle={{
          padding: 12,
        }}
        title={
          <Form
            form={form}
            layout="inline"
            initialValues={{
              date: [moment().subtract(1, 'month'), moment()],
            }}
            autoComplete="off"
          >
            <Form.Item label="企业" name="EntCode">
              <EntAtmoList
                regionCode={form.getFieldValue('regionCode')}
                style={{ width: 200 }}
                onChange={value => {
                  if (!value) {
                    form.setFieldsValue({ DGIMN: undefined });
                    setPointList([]);
                  } else {
                    form.setFieldsValue({ DGIMN: undefined });
                    getPointList(value);
                  }
                }}
              />
            </Form.Item>
            <Spin spinning={!!pointListLoading} size="small" style={{ background: '#fff' }}>
              <Form.Item label="监测点" name="DGIMN">
                <Select
                  placeholder="请选择"
                  showSearch
                  allowClear
                  optionFilterProp="children"
                  style={{ width: 150 }}
                >
                  {pointList.map(item => {
                    return (
                      <Option key={item.DGIMN} value={item.DGIMN}>
                        {item.PointName}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Spin>
            <Form.Item label="燃烧工艺" name="pmCemsSupplier">
              <Select
                placeholder="请选择"
                style={{ width: 300 }}
                showSearch
                allowClear
                optionFilterProp="children"
              >
                {PmCemsSupplier.map(item => {
                  return (
                    <Option key={item.ID} value={item.ID}>
                      {item.Name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  loading={loading}
                  onClick={() => {
                    onTableChange(1, 20);
                  }}
                >
                  查询
                </Button>
                <Button
                  onClick={() => {
                    form.resetFields();
                    onTableChange(1, 20);
                  }}
                >
                  重置
                </Button>
                <Divider type="vertical" />
                <Button type="primary" onClick={() => setIsAutoModalOpen(true)}>
                  自动配置
                </Button>
              </Space>
            </Form.Item>
          </Form>
        }
      >
        <SdlTable
          resizable
          rowKey="ID"
          align="center"
          style={{ marginTop: 10 }}
          columns={getColumns()}
          dataSource={dataSource}
          loading={loading}
          // pagination={false}
          onChange={onTableChange2}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            pageSize: pageSize,
            current: pageIndex,
            // onChange: onTableChange,
            total: total,
          }}
        />
      </Card>
      <Modal
        title={`自动配置燃烧工艺`}
        open={isAutoModalOpen}
        onCancel={() => setIsAutoModalOpen(false)}
        onOk={() => {
          onAutoFinish();
        }}
        destroyOnClose
      >
        <Row align="middle" style={{ marginLeft: 20, marginBottom: 10 }}>
          重新选配模型:
          <Radio.Group
            style={{ marginLeft: 6 }}
            onChange={e => {
              setAutoQualityStatus(e.target.value);
            }}
            value={autoQualityStatus}
          >
            <Radio value={2}>是</Radio>
            <Radio value={1}>否</Radio>
          </Radio.Group>
        </Row>
        <Row align="middle" style={{ marginLeft: 20 }}>
          <Text type="danger">
            <InfoCircleOutlined style={{ marginRight: 4 }} />
            修改燃烧工艺后是否根据燃烧工艺自动修改点位关联模型
          </Text>
        </Row>
      </Modal>
      {isModalOpen && (
        <SelectPmCemsSupplierModal
          currentRow={currentRow}
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          onOk={() => {
            getPageData();
            setIsModalOpen(false);
          }}
        />
      )}

      {/* <Modal
        title={`选择燃烧工艺`}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => {
          onFinish();
        }}
        destroyOnClose
      >
        <Form
          form={form2}
          initialValues={{}}
          autoComplete="off"
          labelCol={{ flex: '120px' }}
          wrapperCol={{ flex: 1 }}
        >
          <Form.Item label="企业">
            <Text>{currentRow.entName}</Text>
          </Form.Item>
          <Form.Item label="排口">
            <Text>{currentRow.pointName}</Text>
          </Form.Item>
          <Form.Item
            label="燃烧工艺"
            name="pmCemsSupplier"
            rules={[
              {
                required: true,
                message: '不能为空',
              },
            ]}
          >
            <Select
              placeholder="请选择"
              showSearch
              allowClear
              optionFilterProp="children"
              // disabled={qualityStatus != 1}
            >
              {PmCemsSupplier.map(item => {
                return (
                  <Option key={item.ID} value={item.ID}>
                    {item.Name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            label="重新选配模型"
            name="qualityStatus"
            rules={[
              {
                required: true,
                message: '不能为空',
              },
            ]}
          >
            <Radio.Group
              onChange={e => {
                setQualityStatus(e.target.value);
              }}
            >
              <Radio value={2}>是</Radio>
              <Radio value={1}>否</Radio>
            </Radio.Group>
          </Form.Item>
          <Row align="middle" style={{ marginLeft: 20 }}>
            <Text type="danger">
              <InfoCircleOutlined style={{ marginRight: 4 }} />
              修改燃烧工艺后是否根据燃烧工艺自动修改点位关联模型
            </Text>
          </Row>
        </Form>
      </Modal> */}
      <Modal
        title={`${currentRow.entName} - ${currentRow.pointName}`}
        wrapClassName="spreadOverModal"
        destroyOnClose
        open={isDataModalOpen}
        footer={false}
        onCancel={() => setIsDataModalOpen(false)}
        bodyStyle={{ padding: 0 }}
      >
        <AssistDataAnalysis displayType="modal" DGIMN={currentRow.DGIMN} />
      </Modal>
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(CombustionProcess);
