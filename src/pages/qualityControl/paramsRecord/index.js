/*
 * @Author: Jiaqi
 * @Date: 2019-11-18 16:11:36
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2019-11-19 13:48:10
 * @desc: 质控参数记录页面
 */
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import NavigationTree from '@/components/NavigationTree'
import { Form, Card, DatePicker, Row, Col, Select, Button } from 'antd'
import SdlTable from '@/components/SdlTable'
import { connect } from 'dva'

const FormItem = Form.Item;
const {Option} = Select;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const dataSource = [
  {
    key: '1',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号',
  },
  {
    key: '2',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号',
  },
];

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '住址',
    dataIndex: 'address',
    key: 'address',
  },
];


@connect(({ loading, qualityControl }) => ({
  paramsRecordForm: qualityControl.paramsRecordForm,
}))
@Form.create({
  mapPropsToFields(props) {
    return {
      time: Form.createFormField(props.paramsRecordForm.time),
      param: Form.createFormField(props.paramsRecordForm.param),
      status: Form.createFormField(props.paramsRecordForm.status),
    };
  },
  onFieldsChange(props, fields) {
    props.dispatch({
      type: 'qualityControl/updateState',
      payload: {
        paramsRecordForm: {
          ...props.paramsRecordForm,
          ...fields,
        },
      },
    })
  },
})
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this._SELF_ = {
      formItemLayout: {
        labelCol: {
          span: 6,
        },
        wrapperCol: {
          span: 16,
        },
      },
    }
  }

  // 分页
  onTableChange = (current, pageSize) => {
    this.props.dispatch({
      type: 'report/updateState',
      payload: {
        paramsRecordForm: {
          ...this.props.paramsRecordForm,
          current,
        },
      },
    });
    setTimeout(() => {
      // 获取表格数据
    }, 0);
  }

  render() {
    const { form: { getFieldDecorator }, paramsRecordForm } = this.props;
    const { formItemLayout } = this._SELF_;
    return (
      <>
        <NavigationTree QCAUse="1" onItemClick={value => {
          this.setState({
            initLoadSuccess: true,
          })
          if (value.length > 0 && !value[0].IsEnt && value[0].QCAType == '2') {
            console.log('123123=', value[0])
            this.setState({
              QCAMN: value[0].key,
            })
          }
        }} />
        <div id="contentWrapper">
          <PageHeaderWrapper>
            <Card className="contentContainer">
              <Form {...formItemLayout}>
                <Row>
                  <Col span={8}>
                    <Form.Item label="时间">
                      {getFieldDecorator('time')(
                        <RangePicker />,
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="参数">
                      {getFieldDecorator('param')(
                        <Select placeholder="请选择参数">
                          <Option key="1"></Option>
                        </Select>,
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="状态">
                      {getFieldDecorator('status')(
                        <Select placeholder="请选择状态">
                          <Option key="1">正常</Option>
                          <Option key="0">异常</Option>
                        </Select>,
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={4} style={{ marginTop: 4 }}>
                    <Button type="primary" style={{ marginRight: 10 }}>查询</Button>
                    <Button>重置</Button>
                  </Col>
                </Row>
              </Form>
              <SdlTable
                dataSource={dataSource}
                columns={columns}
                pagination={{
                  // showSizeChanger: true,
                  showQuickJumper: true,
                  pageSize: paramsRecordForm.pageSize,
                  current: paramsRecordForm.current,
                  onChange: this.onTableChange,
                  total: paramsRecordForm.total,
                }}
              />
            </Card>
          </PageHeaderWrapper>
        </div>
      </>
    );
  }
}

export default index;
