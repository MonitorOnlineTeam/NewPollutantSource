/*
 * @Author: Jiaqi 
 * @Date: 2019-11-07 11:34:17 
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2019-11-08 14:37:45
 * @desc: 添加标准库
 */
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Form, Row, Col, Input, Select, Button, Table, Cascader, InputNumber, Divider, message, Icon } from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable';
import SdlTable from '@/components/SdlTable'
import PageLoading from '@/components/PageLoading'
import styles from './index.less';

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
class AddInstrument extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      expandedRowKeys: [],
      columns: [
        {
          title: '排口',
          dataIndex: 'DGIMN',
          render: (text, record, index) => {
            return <FormItem style={{ marginBottom: '0' }}>
              {this.props.form.getFieldDecorator('DGIMN' + record.key, {
                rules: [
                  { required: true, message: '请输入排口' },
                ],
                initialValue: record.DGIMNArr || text
              })(
                <Cascader
                  style={{ width: "70%" }}
                  fieldNames={{ label: 'title', value: 'key', children: 'children' }}
                  showSearch={true}
                  // disabled={this.state.dataSource[index].find(item => item.DGIMN == )}
                  options={this.props.entAndPointList}
                  onChange={(value, selectedOptions) => {
                    // console.log("")
                    // console.log("12321323=",this.state.dataSource.find(item => item.DGIMN ==value));
                    this.changeDataSource(value[1], index, "DGIMN")
                  }}
                  placeholder="请选择排口"
                />
              )}
            </FormItem>
          }
        },
        {
          title: '排口通道',
          dataIndex: 'MNHall',
          render: (text, record, index) => {
            return <FormItem style={{ marginBottom: '0' }}>
              {this.props.form.getFieldDecorator('MNHall' + record.key, {
                rules: [
                  { required: true, message: '请输入排口通道' },
                ],
                initialValue: text
              })(
                // <InputNumber min={0}/>
                <Select onChange={(value) => { this.changeDataSource(value, index, "MNHall") }} >
                  {
                    this._SELF_.MNHallList.map(item => {
                      return <Option disabled={this.state.dataSource.find(itm => itm.MNHall == item)} key={item}>{item}</Option>
                    })
                  }
                </Select>
              )}
            </FormItem>
          }
        },
        {
          title: '操作',
          render: (text, record, index) => {
            return <a onClick={() => {
              let tempDataSource = this.state.dataSource;
              tempDataSource.splice(index, 1);
              this.setState({
                dataSource: [...tempDataSource]
              })
            }}>删除</a>
          }
        },
      ]
    };
    this._SELF_ = {
      id: props.match.params.id,
      MNHallList: [1, 2, 3, 4], // 排口通道
      title: props.match.params.id ? "编辑质控仪" : "添加质控仪",
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
    this.props.dispatch({ type: "qualityControl/getStandardGas" });
    // 获取编辑数据
    if (this._SELF_.id) {
      this.props.dispatch({
        type: "qualityControl/getQualityControlData",
        payload: {
          ID: this._SELF_.id
        }
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.qualityControlTableData !== nextProps.qualityControlTableData) {
      this.setState({
        dataSource: nextProps.qualityControlTableData
      })
    }
  }

  changeDataSource = (value, index, key) => {
    let dataSource = [...this.state.dataSource];
    // const key = value.currentTarget.id.replace(/\d+/g,'');
    dataSource[index][key] = value;
    this.setState({ dataSource })
  }

  changeStandardGasData = (parentIndex, key, value, index) => {
    let tempDataSource = this.state.dataSource;
    if (key === "OffsetValue1") {
      tempDataSource[parentIndex]["Component"][index]["OffsetValue"][0] = value;
    }
    if (key === "OffsetValue2") {
      tempDataSource[parentIndex]["Component"][index]["OffsetValue"][1] = value;
    }

    tempDataSource[parentIndex]["Component"][index][key] = value;
    this.setState({
      dataSource: tempDataSource
    })
  }

  // 提交保存
  onSubmitForm = () => {
    this.props.form.validateFields((err, fieldsValue) => {
      console.log("dataSource=", this.state.dataSource)
      if (err) {
        return;
      }

      let dataSource = this.state.dataSource;
      let isErr = false;
      dataSource.map(item => {
        if (!item.Component.length) {
          this.setState({
            expandedRowKeys: [
              ...this.state.expandedRowKeys,
              item.key
            ]
          })
          isErr = true;
        }
      })

      if (!isErr) {
        let postData = {
          "Info": {
            "ID": this._SELF_.id ? this._SELF_.id : undefined,
            "QCAMN": fieldsValue.QCAMN,
            "Productor": fieldsValue.Productor,
            "Address": fieldsValue.Address,
            "CameraNO": fieldsValue.CameraNO,
            "CameraAppId": fieldsValue.CameraAppId,
            "CameraSecret": fieldsValue.CameraSecret,
          },
          Relation: dataSource
        }
        console.log("postData=", postData)
        // return;
        this.props.dispatch({
          type: "qualityControl/addQualityControl",
          payload: postData
        })
      } else {
        message.error("请添加标气");
      }
    })
  }

  // 添加污染物
  handleAdd = () => {
    let dataSource = this.state.dataSource;
    if (dataSource.length === 4) {
      message.error("最多只能关联4个排口")
      return;
    }
    let key = dataSource.length + 1;
    dataSource.push({
      key: key,
      DGIMN: undefined,
      MNHall: undefined,
      Component: []
    })
    this.setState({ dataSource })
  }

  // 嵌套表格
  expandedRowRender = (record, index, indent, expanded) => {
    // console.log('record=', record)
    // console.log('index=', index)
    // console.log('indent=', indent)
    // console.log('expanded=', expanded)
    let dataSource = this.state.dataSource;
    const columns = [
      {
        title: '标气',
        dataIndex: 'StandardGas',
        width: 300,
        render: (text, record, idx) => {
          return <FormItem style={{ marginBottom: '0', width: '100%' }}>
            {this.props.form.getFieldDecorator('StandardGas' + record.key, {
              rules: [
                { required: true, message: '请输入排口通道' },
              ],
              initialValue: text ? text : undefined
            })(
              <Select style={{ width: '100%' }} onChange={(value) => {
                this.changeStandardGasData(index, "StandardGas", value, idx)
              }}>
                {
                  this.props.standardGasList.map(item => {
                    return <Option disabled={this.state.dataSource[index]["Component"].find(itm => itm.StandardGas == item.PollutantCode)} key={item.PollutantCode} value={item.PollutantCode}>{item.PollutantName}</Option>
                  })
                }
              </Select>
            )}
          </FormItem>
        }
      },
      {
        title: '标准值',
        dataIndex: 'StandardValue',
        render: (text, record, idx) => {
          return <FormItem style={{ marginBottom: '0' }}>
            {this.props.form.getFieldDecorator('StandardValue' + record.key, {
              rules: [
                { required: true, message: '请输入标准值' },
              ],
              initialValue: text ? text : undefined
            })(
              <InputNumber min={0} onChange={(value) => { this.changeStandardGasData(index, "StandardValue", value, idx) }} />
            )}
          </FormItem>
        }
      },
      {
        title: '偏移范围',
        dataIndex: 'OffsetValue',
        width: 300,
        render: (text, record, idx) => {
          return <FormItem style={{ marginBottom: '0' }}>
            {this.props.form.getFieldDecorator('OffsetValue' + record.key, {
              rules: [
                { required: true, message: '请输入偏移范围' },
              ],
              initialValue: text ? text : undefined
            })(
              <>
                <InputNumber defaultValue={text[0]} min={0} onChange={(value) => {
                  this.changeStandardGasData(index, "OffsetValue1", value, idx)
                }} />
                <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>-</span>
                <InputNumber defaultValue={text[1]} min={0} onChange={(value) => {
                  this.changeStandardGasData(index, "OffsetValue2", value, idx)
                }} />
              </>
            )}
          </FormItem>
        }
      },
      {
        title: '校验周期',
        dataIndex: 'Cycle',
        render: (text, record, idx) => {
          return <FormItem style={{ marginBottom: '0' }}>
            {this.props.form.getFieldDecorator('Cycle' + record.key, {
              rules: [
                { required: true, message: '请输入校验周期' },
              ],
              initialValue: text ? text : undefined
            })(
              <InputNumber min={0} onChange={(value) => { this.changeStandardGasData(index, "Cycle", value, idx) }} />
            )}
          </FormItem>
        }
      },
      {
        title: '操作',
        render: (text, record, idx) => {
          return <a onClick={() => {
            let tempDataSource = this.state.dataSource;
            tempDataSource[index]["Component"].splice(idx, 1);
            this.setState({
              dataSource: [...tempDataSource]
            })
          }}>删除</a>
        }
      },
    ];
    const data = [];
    // for (let i = 0; i < 3; ++i) {
    //   data.push({
    //     key: i,
    //     date: '2014-12-24 23:12:00',
    //     name: 'This is production name',
    //     upgradeNum: 'Upgraded: 56',
    //   });
    // }
    let props = {};
    if (!dataSource[index]["Component"].length) {
      props = {
        locale: {
          emptyText: <div className={styles.addContent} onClick={() => { this.addStandardGas(index) }}>
            <Icon type="plus" /> 添加标气
          </div>
        }
      };
    } else {
      props = {
        footer: () => {
          return <div className={styles.addContent} onClick={() => { this.addStandardGas(index) }}>
            <Icon type="plus" /> 添加标气
        </div>
        }
      };
    }
    console.log("index==========", index)
    console.log("dataSource------", dataSource)
    return <Table
      {...props}
      rowKey={record => record.key}
      columns={columns}
      dataSource={dataSource[index]["Component"]}
      pagination={false}
      bordered={false}
      size="middle"
    />;
  }

  // 添加标气
  addStandardGas = (index) => {
    console.log("index=", index)
    let dataSource = this.state.dataSource;
    let key = dataSource[index]["Component"].length + 1;
    dataSource[index]["Component"].push({
      key: `${index}${key}`,
      StandardGas: undefined,
      StandardValue: undefined,
      OffsetValue: [],
      Cycle: undefined,
    })
    this.setState({ dataSource })
  }

  render() {
    const { columns, dataSource, expandedRowKeys } = this.state;
    const { formItemLayout, id, title } = this._SELF_;
    const { form: { getFieldDecorator }, qualityControlFormData, loading } = this.props;
    if (loading) {
      return <PageLoading />
    }
    return (
      <PageHeaderWrapper title={title}>
        <Card>
          <Form>
            <Row>
              <Col span={12}>
                <Form.Item  {...formItemLayout} label="质控仪编号">
                  {getFieldDecorator('QCAMN', {
                    rules: [{
                      required: true,
                      message: '请填写质控仪编号!',
                    },],
                    initialValue: qualityControlFormData.QCAMN
                  })(
                    <Input placeholder="请填写质控仪编号" />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="生产厂家">
                  {getFieldDecorator('Productor', {
                    rules: [{
                      required: true,
                      message: '请填写生产厂家!',
                    },],
                    initialValue: qualityControlFormData.Productor
                  })(
                    <Input placeholder="请填写生产厂家" />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="地址">
                  {getFieldDecorator('Address', {
                    rules: [{
                      required: true,
                      message: '请填写地址!',
                    },],
                    initialValue: qualityControlFormData.Address
                  })(
                    <Input placeholder="请填写地址" />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="摄像头序列号">
                  {getFieldDecorator('CameraNO', {
                    rules: [{
                      required: true,
                      message: '请填写摄像头序列号!',
                    },],
                    initialValue: qualityControlFormData.CameraNO
                  })(
                    <Input placeholder="请填写摄像头序列号" />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="摄像头AppId">
                  {getFieldDecorator('CameraAppId', {
                    rules: [{
                      required: true,
                      message: '请填写摄像头AppId!',
                    },],
                    initialValue: qualityControlFormData.CameraAppId
                  })(
                    <Input placeholder="请填写摄像头AppId" />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="摄像头Secret">
                  {getFieldDecorator('CameraSecret', {
                    rules: [{
                      required: true,
                      message: '请填写摄像头Secret!',
                    },],
                    initialValue: qualityControlFormData.CameraSecret
                  })(
                    <Input placeholder="请填写摄像头Secret" />
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
                expandedRowKeys={expandedRowKeys}
                defaultExpandAllRows={id ? true : false}
                columns={columns}
                dataSource={dataSource}
                expandedRowRender={this.expandedRowRender}
                onExpand={(expanded, record) => {
                  if (expanded) {
                    this.setState({
                      expandedRowKeys: [
                        ...expandedRowKeys,
                        record.key
                      ]
                    })
                  } else {
                    let rowKeys = _.remove(expandedRowKeys, function (n) {
                      return n != record.key;
                    });
                    console.log("rowKeys=", rowKeys)
                    this.setState({
                      expandedRowKeys: [
                        ...rowKeys
                      ]
                    })
                  }
                }}
                expandedRows={(expandedRows) => {
                  console.log('expandedRows=', expandedRows)
                }}
                bordered={false}
                pagination={false}
                size="middle"
              />
            </Card>
          </Form>
          <Row>
            <Divider orientation="right">
              <Button type="primary" onClick={this.onSubmitForm}>保存</Button>
              <Button
                style={{ marginLeft: 8 }}
                onClick={() => {
                  history.go(-1);
                }}
              >返回</Button>
            </Divider>
          </Row>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default AddInstrument;