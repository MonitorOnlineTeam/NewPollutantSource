/*
 * @Author: xpy
 * @Date: 2019-11-20 16:11:36
 * @Last Modified by: xpy
 * @Last Modified time: 2019-11-20 13:48:10
 * @desc: 质控状态记录页面
 */
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import NavigationTree from '@/components/NavigationTree'
import { Form, Card, DatePicker, Row, Col, Select, Button, Badge } from 'antd'
import SdlTable from '@/components/SdlTable'
import { connect } from 'dva'

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const dataSource = [
  {
    key: '1',
    status: 1,
    time: '2019-08-01 02:00',
    name: 'PLC-锁芯状态',
    value: 0,
    address: '0为锁芯弹出，1为锁芯收回',
  },
  {
    key: '2',
    status: 0,
    time: '2019-08-01 02:00',
    name: 'PLC-锁芯状态',
    value: 0,
    address: '0为锁芯弹出，1为锁芯收回',
  },
];

const columns = [
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (text, record) => {
      if (text === 0) {
        return <span><Badge status="error" /></span>;
      }
      return <span><Badge status="success" /> </span>;
    },
    },
  {
    title: '时间',
    dataIndex: 'time',
    key: 'time',
  },
  {
    title: '指标名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '指标值',
    dataIndex: 'value',
    key: 'value',
  },
  {
    title: '指标说明',
    dataIndex: 'address',
    key: 'address',
  },
];


@connect(({
  loading,
  qualityControl,
}) => ({
  QCAStatusList: qualityControl.QCAStatusList,
  isloading: loading.effects['qualityControl/QCAStatusByDGIMN'],
  dataloading: loading.effects['qualityControl/QCAStatusName'],
  QCAStatusNameList: qualityControl.QCAStatusNameList,
}))
@Form.create()
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
        QCAMN: '',
    };
  }


  render() {
      const { formItemLayout } = {
        formItemLayout: {
          labelCol: {
            span: 6,
          },
          wrapperCol: {
            span: 16,
          },
        },
      }
     const { form: { getFieldDecorator } } = this.props;
    return (
        <>
        <NavigationTree QCAUse="1" onItemClick={value => {
          if (value.length > 0 && !value[0].IsEnt && value[0].QCAType == '2') {
            console.log('123123=', value)
            this.setState({
              QCAMN: value[0].key,
            })
          }
        }} />
        < div id = "contentWrapper" >
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
                    <Form.Item label="指标名称">
                      {getFieldDecorator('param')(
                        <Select placeholder="请选择指标名称">
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
              />
            </Card>
          </PageHeaderWrapper>
        </div>
      </>
    );
  }
}

export default Index;
