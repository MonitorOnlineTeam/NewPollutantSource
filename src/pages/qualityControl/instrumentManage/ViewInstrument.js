/*
 * @Author: Jiaqi 
 * @Date: 2019-11-08 17:17:39 
 * @Last Modified by:   Jiaqi 
 * @Last Modified time: 2019-11-08 17:17:39 
 * @desc: 质控仪详情
 */
import React, { Component } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
  Card,
  Row,
  Col,
  Input,
  Select,
  Button,
  Table,
  Cascader,
  InputNumber,
  Divider,
  message,
} from 'antd';
import { connect } from 'dva';
import PageLoading from '@/components/PageLoading'
import moment from "moment"

const FormItem = Form.Item;
const Option = Select.Option;

@Form.create()
@connect(({ loading, qualityControl }) => ({
  entAndPointList: qualityControl.entAndPointList,
  standardGasList: qualityControl.standardGasList,
  qualityControlFormData: qualityControl.qualityControlFormData,
  qualityControlTableData: qualityControl.qualityControlTableData,
  loading: loading.effects["qualityControl/getQualityControlData"],
}))
class ViewInstrument extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      expandedRowKeys: [],
      columns: [
        {
          title: '序号',
          dataIndex: 'index',
          render: (text, record, index) => index + 1
        },
        {
          title: '排口',
          dataIndex: 'DGIMN',
          render: (text, record, index) => {
            return <Cascader
              defaultValue={record.DGIMNArr}
              style={{ width: "70%" }}
              fieldNames={{ label: 'title', value: 'key', children: 'children' }}
              showSearch={true}
              disabled={true}
              options={this.props.entAndPointList}
              placeholder="请选择排口"
            />
          }
        },
      ]
    };
    this._SELF_ = {
      id: props.match.params.id,
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
      },
    }
  }

  componentDidMount() {
    // 获取企业及排口
    this.props.dispatch({ type: "qualityControl/getEntAndPointList" })
    // 获取标气列表
    this.props.dispatch({ type: "qualityControl/getStandardGas", payload: { QCAMN: null } });
    // 获取编辑数据
    this.props.dispatch({
      type: "qualityControl/getQualityControlData",
      payload: {
        ID: this._SELF_.id
      }
    })
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: "qualityControl/updateState",
      payload: {
        qualityControlFormData: {}
      }
    })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.qualityControlTableData !== nextProps.qualityControlTableData) {
      this.setState({
        dataSource: nextProps.qualityControlTableData
      })
    }
  }


  render() {
    const { columns, dataSource, expandedRowKeys } = this.state;
    const { formItemLayout, id } = this._SELF_;
    const { qualityControlFormData, loading } = this.props;
    if (loading) {
      return <PageLoading />
    }
    return (
      <BreadcrumbWrapper title="质控仪详情">
        <Card>
          <Form layout='horizontal'>
            <Row>
              <Col span={12}>
                <Form.Item  {...formItemLayout} label="质控仪编号">
                  <p>{qualityControlFormData.QCAMN}</p>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item  {...formItemLayout} label="质控仪名称">
                  <p>{qualityControlFormData.QCAName}</p>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="生产厂家">
                  {qualityControlFormData.Productor}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="地址">
                  {qualityControlFormData.Address}
                </Form.Item>
              </Col>
            </Row>
            <Card
              style={{ marginTop: 16 }}
              type="inner"
              title="关联排口详情"
              bordered={false}
            >
              <Table
                rowKey={record => record.key}
                columns={columns}
                dataSource={dataSource}
                bordered={false}
                pagination={false}
                size="middle"
              />
            </Card>
          </Form>
          <Row>
            <Divider orientation="right">
              <Button
                type="primary"
                style={{ marginLeft: 8 }}
                onClick={() => {
                  history.go(-1);
                }}
              >返回</Button>
            </Divider>
          </Row>
        </Card>
      </BreadcrumbWrapper>
    );
  }
}

export default ViewInstrument;