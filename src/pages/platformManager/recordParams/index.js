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
  Popover,
  Typography,
  message,
  Row,
  Radio,
  Badge,
} from 'antd';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import EntAtmoList from '@/components/EntAtmoList';
import SdlTable from '@/components/SdlTable';
import { API } from '@config/API';
import moment from 'moment';
import EquipmentParmars from '@/pages/platformManager/equipmentParmars/ContentPages.js';
import { convertTextByConfig } from '@/utils/utils';

const { Text, Link } = Typography;

const dvaPropsData = ({ loading, AbnormalIdentifyModel }) => ({});

const RecordParams = props => {
  const [form] = Form.useForm();
  const [form2] = Form.useForm();

  const { dispatch, pointListLoading } = props;
  const [dataSource, setDataSource] = useState([]);
  const [pointList, setPointList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState({});
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);

  useEffect(() => {
    getPageData(1, 20);
  }, []);

  // 获取页面数据
  const getPageData = (_pageIndex, _pageSize, _sortField, _order) => {
    const values = form.getFieldsValue();
    setLoading(true);
    dispatch({
      type: 'AbnormalIdentifyModel/GenericPostRequest',
      url: API.AbnormalIdentifyModel.GetParamCheckList,
      payload: {
        ...values,
        pageIndex: _pageIndex || pageIndex,
        pageSize: _pageSize || pageSize,
      },
      callback: res => {
        setDataSource(res.Datas);
        setLoading(false);
        setTotal(res.Total);
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
        title: convertTextByConfig('企业'),
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
        title: '烟道截面积(m³)',
        dataIndex: 'flueCoefficient',
        key: 'flueCoefficient',
        render: (text, row) => {
          let _text = text || '-';
          if (row.flueCoefficientStr) {
            return (
              <Popover content={<Badge status="warning" text={row.flueCoefficientStr} />}>
                <span style={{ color: '#ff4d4f' }}>{_text}</span>
              </Popover>
            );
          }
          return _text;
        },
      },
      {
        title: '当地大气压(Pa)',
        dataIndex: 'atmos',
        key: 'atmos',
        render: (text, row) => {
          let _text = text || '-';
          if (row.atmosStr) {
            return (
              <Popover content={<Badge status="warning" text={row.atmosStr} />}>
                <span style={{ color: '#ff4d4f' }}>{_text}</span>
              </Popover>
            );
          }
          return _text;
        },
      },
      {
        title: '基准氧含量(%)',
        dataIndex: 'airCoefficient',
        key: 'airCoefficient',
        render: (text, row) => {
          let _text = text || '-';
          if (row.airCoefficientStr) {
            return (
              <Popover content={<Badge status="warning" text={row.airCoefficientStr} />}>
                <span style={{ color: '#ff4d4f' }}>{_text}</span>
              </Popover>
            );
          }
          return _text;
        },
      },
      {
        title: '操作',
        dataIndex: 'handle',
        key: 'handle',
        ellipsis: true,
        render: (text, record) => {
          return (
            <a
              onClick={() => {
                setIsModalOpen(true);
                setCurrentRow(record);
              }}
            >
              配置
            </a>
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
            <Form.Item label={convertTextByConfig("企业")} name="EntCode">
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
        title={`${currentRow.entName} - ${currentRow.pointName}`}
        wrapClassName="spreadOverModal"
        destroyOnClose
        open={isModalOpen}
        footer={false}
        å
        onCancel={() => setIsModalOpen(false)}
        bodyStyle={{ padding: 0 }}
      >
        <EquipmentParmars DGIMN={currentRow.DGIMN} type={'smoke'} />
      </Modal>
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(RecordParams);
