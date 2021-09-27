/*
 * @Author: Jiaqi
 * @Date: 2019-11-07 11:34:17
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2020-06-13 13:52:41
 * @desc: 添加标准库
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
  Modal,
  Button,
  Table,
  Cascader,
  Divider,
  message,
} from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import PageLoading from '@/components/PageLoading'

const FormItem = Form.Item;

@Form.create()
@connect(({ loading, qualityControl }) => ({
  entAndPointList: qualityControl.entAndPointList,
  standardGasList: qualityControl.standardGasList,
  qualityControlFormData: qualityControl.qualityControlFormData,
  qualityControlTableData: qualityControl.qualityControlTableData,
  QCAGasRelation: qualityControl.QCAGasRelation,
  workPatternList: qualityControl.workPatternList,
  Sloading: loading.effects['qualityControl/getStandardGas'],
  loading: loading.effects['qualityControl/getQualityControlData'],
  btnloading: loading.effects['qualityControl/addQualityControl'],
}))
class AddInstrument extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      expandedRowKeys: [],
      entAndPointList: [],
      unit: 'mg/m3',
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
            // console.log('record.DGIMNArr=',record.DGIMNArr)
            return <FormItem style={{ marginBottom: '0' }}>
              {this.props.form.getFieldDecorator(`DGIMN${record.key}`, {
                rules: [
                  { required: true, message: '请输入排口' },
                ],
                initialValue: record.DGIMNArr || text,
              })(
                <Cascader
                  style={{ width: '70%' }}
                  showSearch
                  // disabled={!this.state.entAndPointList.length}
                  options={this.state.entAndPointList}
                  fieldNames={this.state.entAndPointList.length ? { label: 'title', value: 'key', children: 'children' } : { label: 'label', value: 'value', children: 'children' }}
                  onChange={(value, selectedOptions) => {
                    if (this.state.entAndPointList && this.state.entAndPointList.length) {
                      console.log('value=', value)
                      const dataSource = [...this.state.dataSource];
                      dataSource[index]['DGIMN'] = value[1];
                      dataSource[index]['DGIMNArr'] = value;
                      this.setState({ dataSource }, () => {
                        this.handleCascaderDisable(this.state.entAndPointList)
                      });
                    }
                  }}
                  placeholder="请选择排口"
                />,
              )}
            </FormItem>
          }
        },
        {
          title: '操作',
          render: (text, record, index) => {
            const that = this;
            return (
              <>
                <a onClick={() => {
                  // 删除时disabled重置为false
                  const tempEntAndPointList = this.state.entAndPointList;
                  tempEntAndPointList.map(item => {
                    item.children.map(child => {
                      if (child.key === record.DGIMN) {
                        child.disabled = false;
                      }
                    })
                  })
                  const tempDataSource = this.state.dataSource;
                  tempDataSource.splice(index, 1);
                  this.setState({
                    dataSource: [...tempDataSource],
                    entAndPointList: tempEntAndPointList
                  })
                }}>删除</a>
              </>
            )
          }
        },
      ],
    };
    this._SELF_ = {
      id: props.match.params.id,
      QCAMN: props.match.params.QCAMN,
      MNHallList: [1, 2, 3, 4], // 排口通道
      title: props.match.params.id ? '编辑质控仪' : '添加质控仪',
      n2Code: '065', // 氮气code
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
    this.props.dispatch({
      type: 'qualityControl/getEntAndPointList',
      payload: {
        QCAInfo: this._SELF_.id ? "2" : "1",
        QCAMN: this._SELF_.QCAMN
      },
      callback: (res) => {
        // 获取编辑数据
        if (this._SELF_.id) {
          this.props.dispatch({
            type: 'qualityControl/getQualityControlData',
            payload: {
              ID: this._SELF_.id,
            },
          })
        }
      }
    })
    // 获取编辑数据
    // if (this._SELF_.id) {
    //   this.props.dispatch({
    //     type: 'qualityControl/getQualityControlData',
    //     payload: {
    //       ID: this._SELF_.id,
    //     },
    //   })
    // } else {
    // }

  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'qualityControl/updateState',
      payload: {
        qualityControlFormData: {},
      },
    })
  }

  componentWillReceiveProps(nextProps) {
    // 编辑页面
    if (this.props.qualityControlTableData !== nextProps.qualityControlTableData) {
      this.setState({
        dataSource: nextProps.qualityControlTableData,
      }, () => {
        // 禁用选中项，不能选择相同排口
        this.handleCascaderDisable(nextProps.entAndPointList)
      })
    }

    // 添加页面
    if (this.props.entAndPointList !== nextProps.entAndPointList && !this._SELF_.id) {
      this.setState({
        entAndPointList: nextProps.entAndPointList
      })
    }
  }

  // 禁用选中项，不能选择相同排口
  handleCascaderDisable = (entAndPointList) => {
    let tempEntAndPointList = entAndPointList;
    tempEntAndPointList.map(item => {
      if (this.state.dataSource.find(itm => itm.DGIMNArr && itm.DGIMNArr[0] === item.key)) {
        item.children.map(child => {
          if (this.state.dataSource.find(itm => itm.DGIMNArr && itm.DGIMNArr[1] === child.key)) {
            child.disabled = true
          } else {
            child.disabled = false
          }
        })
      }
    })
    this.setState({
      entAndPointList: tempEntAndPointList
    })
  }

  // 提交保存
  onSubmitForm = () => {
    console.log('dataSourceErr=', this.state.dataSource)
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      const { dataSource } = this.state;
      dataSource.map(item => {
        if (item.DGIMN.indexOf('/') > 0) {
          item.DGIMN = item.DGIMNArr[1];
          // delete item.DGIMNArr;
        }
      })

      const postData = {
        Info: {
          ID: this._SELF_.id ? this._SELF_.id : undefined,
          QCAMN: fieldsValue.QCAMN,
          QCAName: fieldsValue.QCAName,
          Productor: fieldsValue.Productor,
          Address: fieldsValue.Address,
        },
        Relation: dataSource,
      }
      console.log('postData=', postData)
      // return;
      this.props.dispatch({
        type: 'qualityControl/addQualityControl',
        payload: postData,
      })
    })
  }

  // 添加污染物
  handleAdd = () => {
    const { dataSource } = this.state;
    if (dataSource.length === 5) {
      message.error('最多只能关联5个排口')
      return;
    }
    const key = dataSource.length + 1;
    dataSource.push({
      key,
      DGIMN: undefined,
      MNHall: undefined,
    })
    this.setState({ dataSource: [...dataSource] })
  }

  render() {
    const { columns, dataSource } = this.state;
    const { formItemLayout, id, title } = this._SELF_;
    const { form: { getFieldDecorator }, qualityControlFormData, loading } = this.props;

    if (loading) {
      return <PageLoading />
    }
    return (
      <BreadcrumbWrapper title={title}>
        <Card>
          <Form>
            <Row>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="质控仪编号">
                  {getFieldDecorator('QCAMN', {
                    rules: [{
                      required: true,
                      message: '请填写质控仪编号!',
                    }],
                    initialValue: qualityControlFormData.QCAMN,
                  })(
                    <Input placeholder="请填写质控仪编号" />,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="质控仪名称">
                  {getFieldDecorator('QCAName', {
                    rules: [{
                      required: true,
                      message: '请填写质控仪名称!',
                    }],
                    initialValue: qualityControlFormData.QCAName,
                  })(
                    <Input placeholder="请填写质控仪名称" />,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="生产厂家">
                  {getFieldDecorator('Productor', {
                    rules: [{
                      required: true,
                      message: '请填写生产厂家!',
                    }],
                    initialValue: qualityControlFormData.Productor,
                  })(
                    <Input placeholder="请填写生产厂家" />,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="地址">
                  {getFieldDecorator('Address', {
                    rules: [{
                      required: true,
                      message: '请填写地址!',
                    }],
                    initialValue: qualityControlFormData.Address,
                  })(
                    <Input placeholder="请填写地址" />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Card
              // style={{ marginTop: 16 }}
              type="inner"
              title="关联排口维护"
              bordered={false}
            >
              <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
                添加排口
              </Button>
              <Table
                rowKey={record => record.key}
                columns={columns}
                dataSource={dataSource}
                scroll={{ x: 300 }}
                bordered={false}
                pagination={false}
                size="middle"
              />
            </Card>
          </Form>
          <Row>
            <Divider orientation="right">
              <Button type="primary" loading={this.props.btnloading} onClick={this.onSubmitForm}>保存</Button>
              <Button
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

export default AddInstrument;
