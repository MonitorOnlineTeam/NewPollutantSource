import React, { Component } from 'react';
import {
  Card,
  Select,
  Form,
  Row,
  Input,
  Button,
  DatePicker, Icon, Tag, Col, Empty, Modal, Upload, message
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SdlTable from '@/components/SdlTable'

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const FormItem = Form.Item;
const { Option } = Select;
const dataSource = [];


// 车辆审批页面
@connect()
@Form.create()
class VehicleApprove extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.SELF = {
      formLayout: {
        labelCol: { span: 7 },
        wrapperCol: { span: 17 },
      },
      columns: [
        {
          title: '申请单编号',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '车辆名称',
          dataIndex: 'age',
          key: 'age',
        },
        {
          title: '车牌号',
          dataIndex: 'address',
          key: 'address',
        },
        {
          title: '申请人',
          dataIndex: 'address',
          key: 'address',
        },
        {
          title: '申请时间',
          dataIndex: 'address',
          key: 'address',
        },
        {
          title: '申请说明',
          dataIndex: 'address',
          key: 'address',
        },
        {
          title: '审批人',
          dataIndex: 'address',
          key: 'address',
        },
        {
          title: '审批时间',
          dataIndex: 'address',
          key: 'address',
        },
        {
          title: '审批状态',
          dataIndex: 'address',
          key: 'address',
        },
        {
          title: '操作',
          dataIndex: 'address',
          key: 'address',
        },
      ],
    }
  }
  render() {
    const { form: { getFieldDecorator } } = this.props;
    const { formLayout, columns } = this.SELF;
    return (
      <PageHeaderWrapper>
        <Card style={{ height: 'calc(100vh - 224px)' }}>
          <Form layout="inline" style={{ marginBottom: 20 }}>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={8} sm={24}>
                <FormItem {...formLayout} label="申请单编号" style={{ width: '100%' }}>
                  {getFieldDecorator("1", {
                  })(
                    <Input />
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem {...formLayout} label="车辆名称" style={{ width: '100%' }}>
                  {getFieldDecorator("2", {
                  })(
                    <Select>
                      <Option value="1">1</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem {...formLayout} label="车牌号" style={{ width: '100%' }}>
                  {getFieldDecorator("311", {
                  })(
                    <Select>
                      <Option value="1">1</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem {...formLayout} label="申请人" style={{ width: '100%' }}>
                  {getFieldDecorator("3", {
                  })(
                    <Select>
                      <Option value="1">1</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem {...formLayout} label="申请时间" style={{ width: '100%' }}>
                  {getFieldDecorator("4", {
                  })(
                    <RangePicker />
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem {...formLayout} label="审批状态" style={{ width: '100%' }}>
                  {getFieldDecorator("422", {
                  })(
                    <Select>
                      <Option value="1">1</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem {...formLayout} label="" style={{ width: '100%' }}>
                  <Button type="primary">查询</Button>
                </FormItem>
              </Col>
            </Row>
          </Form>
          <SdlTable
            dataSource={dataSource}
            columns={columns}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default VehicleApprove;