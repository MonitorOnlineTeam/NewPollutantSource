import React, { PureComponent } from 'react';
import { Card, Tabs, Spin, Form, DatePicker, Row, Col, Button, Space, Input, Select, Modal, Popconfirm, Tooltip, Divider } from "antd";
import SdlTable from '@/components/SdlTable'
import { connect } from "dva"
import moment from "moment"
import _ from "lodash"
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'
import DatabaseConnectionAdd from './DatabaseConnectionAdd'
import { EditIcon, DetailIcon, DelIcon } from '@/utils/icon'

const Option = Select.Option;

@connect(({ databasedata, loading }) => ({
  tableDatas: databasedata.tableDatas,
}))
class DatabaseConfig extends PureComponent {
  formRef = React.createRef();
  state = {

  }
  _SELF_ = {
    columns: [
      {
        title: '数据库Code',
        dataIndex: 'DB_KEY',
        width: '11%',
        align: 'center',
        editable: true,
      },
      {
        title: '数据库名',
        dataIndex: 'DB_NAME',
        width: '11%',
        align: 'center',
        editable: true,
      },
      {
        title: '连接地址',
        dataIndex: 'DB_IP',
        width: '11%',
        align: 'center',
        editable: true,
      },
      {
        title: '登录名',
        dataIndex: 'DB_USERNAME',
        width: '11%',
        align: 'center',
        editable: true,
      },
      {
        title: '数据库版本',
        dataIndex: 'DB_VERSION',
        width: '11%',
        align: 'center',
        editable: true,
      },
      {
        title: '中文描述',
        dataIndex: 'DB_MARK',
        width: '11%',
        align: 'center',
        editable: true,
      },
      {
        title: '登录密码',
        dataIndex: 'DB_PWD',
        width: '11%',
        align: 'center',
        editable: true,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width: '11%',
        align: 'center',
        editable: true,
        render: (test, record) => {
          return (
            <span>
              <DatabaseConnectionAdd reloadData={(e) => this.getTableDataSource(e)} type={1} record={record} />
              {/* <a style={{ paddingLeft: 10 }} >
                <Popconfirm title="确定要删除吗?" onConfirm={() => this.DeleteDatabase(record)} onCancel={this.cancel} okText="删除" cancelText="取消">
                  <a style={{ paddingLeft: 10 }}>删除</a>
                </Popconfirm>
              </a> */}
              <Divider type="vertical" />
              <Tooltip title="删除">
                <Popconfirm
                  placement="left"
                  title="确认是否删除?"
                  onConfirm={() => {
                    this.DeleteDatabase(record);
                  }}
                  okText="是"
                  cancelText="否">
                  <a href="#"><DelIcon /></a>
                </Popconfirm>
              </Tooltip>
            </span>
          )
        }
      }
    ],
  }

  componentDidMount() {
    this.getTableDataSource();
  }

  // 删除
  DeleteDatabase = (record) => {
    console.log(record.DB_KEY);
    this.props.dispatch({
      type: 'databasedata/DeleteDatabase',
      payload: {
        dbkey: record.DB_KEY,
      },
    }).then(() => {
      this.getTableDataSource()
    })
  }

  // 获取表格数据
  getTableDataSource = () => {
    const { DGIMN } = this.props;
    const fieldsValue = this.formRef.current.getFieldsValue();
    this.props.dispatch({
      type: "databasedata/GetDatabaseData",
      payload: {
        "DB": {
          "DB_KEY": fieldsValue.DB_KEY || "",
          "DB_NAME": fieldsValue.DB_NAME || "",
          "DB_VERSION": fieldsValue.DB_VERSION || "",
          "DB_IP": '',
          "DB_USERNAME": '',
          "DB_PWD": '',
          "DB_MARK": fieldsValue.DB_MARK || "",
        },
        "pageIndex": 1,
        "pageSize": 100000
      }
    })
  }

  // 重置表单
  _resetForm = () => {
    this.formRef.current.resetFields();
    setTimeout(() => {
      this.getTableDataSource();
    }, 0);
    // this.props.resetForm();
  }


  render() {
    const { columns } = this._SELF_;
    const { currentRowData } = this.state;
    const { tableDatas } = this.props;
    return (
      <Card>
        <Form
          layout='inline'
          ref={this.formRef}
          style={{ marginBottom: 20 }}
          initialValues={{
          }}
        >
          <Form.Item
            name="DB_NAME"
            label="库名"
          >
            <Input placeholder="请输入库名" />
          </Form.Item>
          <Form.Item
            name="DB_KEY"
            label="数据库Code"
          >
            <Input placeholder="请输入数据库Code" />
          </Form.Item>
          <Form.Item
            name="DB_MARK"
            label="中文说明"
          >
            <Input placeholder="请输入中文说明" />
          </Form.Item>
          <Form.Item
            name="DB_VERSION"
            label="数据库类型"
          >
            <Select
              style={{ width: 150, marginRight: 10 }}
              allowClear
              defaultValue='all'
              placeholder="请选择数据库类型"
            >
              <Select.Option value="all">全部</Select.Option>
              <Select.Option value="SQLSERVER">SQLSERVER</Select.Option>
              <Select.Option value="ORACLE">ORACLE</Select.Option>
              <Select.Option value="MYSQL">MYSQL</Select.Option>
            </Select>
          </Form.Item>
          <Space align="baseline">
            <Button type="primary" onClick={this.getTableDataSource}>查询</Button>
            <Button type="primary" onClick={this._resetForm}>重置</Button>
          </Space>
        </Form>
        <Row style={{ marginBottom: 10 }}>
          <DatabaseConnectionAdd reloadData={(e) => this.getTableDataSource(e)} />
        </Row>
        <SdlTable dataSource={tableDatas} columns={columns} />
      </Card>
    );
  }
}
export default DatabaseConfig;
