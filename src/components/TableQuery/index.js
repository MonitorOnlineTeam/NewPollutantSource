import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Table, Form, Row, Col, Button, Input, Select, Space, message } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';

const QueryTable = ({
  columns,
  queryConfig = [],
  fetchData,
  initialValues = {},
  defaultPageSize = 10,
  bordered = true,
  extra,
}) => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: defaultPageSize,
    total: 0,
  });

  // 暴露给外部的方法
  const internalRef = useRef({
    loadData: () => {},
    getParams: () => ({}),
  });

  // 统一数据获取方法
  const loadData = useCallback(
    async (params = {}) => {
      setLoading(true);
      try {
        const { current, pageSize } = pagination;
        const queryParams = {
          ...form.getFieldsValue(),
          pageNum: params.current || current,
          pageSize: params.pageSize || pageSize,
          ...params,
        };

        const res = await fetchData(queryParams);
        setData(res.list || []);
        setPagination(prev => ({
          ...prev,
          current: queryParams.pageNum,
          total: res.total || 0,
        }));

        // 更新ref方法
        internalRef.current.getParams = () => queryParams;
      } catch (error) {
        console.error('数据加载失败:', error);
        message.error(error.message || '数据加载失败');
      } finally {
        setLoading(false);
      }
    },
    [fetchData, pagination, form]
  );

  // 初始化ref方法
  internalRef.current.loadData = loadData;

  // 初始化加载
  useEffect(() => {
    loadData({ current: 1 });
  }, []);

  // 查询（重置到第一页）
  const handleSearch = useCallback(() => {
    loadData({ current: 1 });
  }, [loadData]);

  // 重置
  const handleReset = useCallback(() => {
    form.resetFields();
    loadData({ current: 1, ...initialValues });
  }, [form, loadData, initialValues]);

  // 删除后修正页码
  const handleAfterDelete = useCallback(() => {
    const { current, total, pageSize } = pagination;
    const maxPage = Math.ceil((total - 1) / pageSize) || 1;
    loadData({ current: current > maxPage ? maxPage : current });
  }, [pagination, loadData]);

  // 分页变化
  const handleTableChange = useCallback(
    (newPagination) => {
      setPagination(newPagination);
      loadData({
        current: newPagination.current,
        pageSize: newPagination.pageSize,
      });
    },
    [loadData]
  );

  // 渲染表单项
  const renderFormItem = (item) => {
    switch (item.type) {
      case 'input':
        return <Input placeholder={`请输入${item.label}`} {...item.props} />;
      case 'select':
        return (
          <Select
            placeholder={`请选择${item.label}`}
            options={item.options}
            {...item.props}
          />
        );
      case 'date':
        return <DatePicker style={{ width: '100%' }} {...item.props} />;
      case 'rangePicker':
        return <DatePicker.RangePicker style={{ width: '100%' }} {...item.props} />;
      case 'custom':
        return item.render(form);
      default:
        return null;
    }
  };

  return (
    <div className="query-table-container">
      {/* 查询表单 */}
      <Form form={form} initialValues={initialValues}>
        <Row gutter={16} style={{ marginBottom: 16 }}>
          {queryConfig.map((item) => (
            <Col key={item.name} span={item.span || 6}>
              <Form.Item name={item.name} label={item.label}>
                {renderFormItem(item)}
              </Form.Item>
            </Col>
          ))}
          <Col>
            <Space>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={handleSearch}
                loading={loading}
              >
                查询
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleReset}
                loading={loading}
              >
                重置
              </Button>
              {extra}
            </Space>
          </Col>
        </Row>
      </Form>

      {/* 表格区域 */}
      <Table
        bordered={bordered}
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey={(record) => record.id || record.key}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`,
          pageSizeOptions: ['10', '20', '50'],
        }}
        onChange={handleTableChange}
      />
    </div>
  );
};

// 添加forwardRef支持
export default React.forwardRef((props, ref) => {
  const componentRef = useRef();
  React.useImperativeHandle(ref, () => ({
    reload: (params) => componentRef.current.loadData(params),
    getParams: () => componentRef.current.getParams(),
    form: componentRef.current.form,
  }));
  return <QueryTable ref={componentRef} {...props} />;
});