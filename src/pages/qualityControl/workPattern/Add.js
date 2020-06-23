/*
 * @Author: Jiaqi
 * @Date: 2019-11-07 11:34:17
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2020-06-13 13:41:17
 * @desc: 添加标准库
 */
import React, { Component } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import { Card, Form, Row, Col, Input, Select, Button, Table, Cascader, InputNumber, Divider, message, Icon, TimePicker, DatePicker } from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import moment from 'moment';
import SdlTable from '@/components/SdlTable'
import PageLoading from '@/components/PageLoading'
import styles from '../instrumentManage/index.less';

const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;

@Form.create()
@connect(({ loading, qualityControl }) => ({
  entAndPointList: qualityControl.entAndPointList,
  standardGasList: qualityControl.standardGasList,
  qualityControlFormData: qualityControl.qualityControlFormData,
  qualityControlTableData: qualityControl.qualityControlTableData,
  QCAGasRelation: qualityControl.QCAGasRelation,
  workPatternEditData: qualityControl.workPatternEditData,
  loading: loading.effects['qualityControl/getWorkPatternEditData'],
  addBtnLoading: loading.effects['qualityControl/workPatternAdd'],
  editBtnLoading: loading.effects['qualityControl/workModelUps']
}))
class AddInstrument extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      dataSourceR: [],
      expandedRowKeys: [],
      unit: 'mg/m3',
    };
    this._SELF_ = {
      modelName: props.match.params.modelName,
      MNHallList: [1, 2, 3, 4], // 排口通道
      title: props.match.params.modelName ? '编辑工作模式' : '添加工作模式',
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
    const { n2Code, modelName } = this._SELF_;
    // 获取标气列表
    this.props.dispatch({
      type: 'qualityControl/getStandardGas',
      payload: {
        QCAMN: '',
      },
    });
    if (modelName) {
      this.props.dispatch({
        type: 'qualityControl/getWorkPatternEditData',
        payload: {
          ModelName: modelName,
        }
      })
    }
    // const {  } = this.props;
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
    if (this.props.qualityControlTableData !== nextProps.qualityControlTableData) {
      this.setState({
        dataSource: nextProps.qualityControlTableData,
      })
    }
    if (this.props.QCAGasRelation !== nextProps.QCAGasRelation) {
      this.setState({
        dataSourceR: nextProps.QCAGasRelation,
      })
    }

    if (this.props.workPatternEditData !== nextProps.workPatternEditData) {
      this.props.form.setFieldsValue({ "ModelName": nextProps.match.params.modelName })
      let dataSource = nextProps.workPatternEditData.map(item => {
        return {
          ...item,
          key: Math.floor(Math.random() * 65535),
          unit: (item.StandardGasCode === "03" || item.StandardGasCode === "02") ? "mg/m3" : "%"
        }
      })
      this.setState({
        dataSource
      })
    }
  }

  changeStandardGasData = (key, value, index) => {
    const tempDataSource = this.state.dataSource;
    console.log('tempDataSource=', tempDataSource)
    debugger
    tempDataSource[index][key] = value;
    this.setState({
      dataSource: tempDataSource,
    })
  }

  // 提交保存
  onSubmitForm = () => {
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      const { modelName } = this._SELF_;
      let paramsData = this.state.dataSource.map(item => {
        return {
          ...item,
          ModelName: fieldsValue.ModelName
        }
      })
      if (modelName) {
        this.props.dispatch({
          type: 'qualityControl/workModelUps',
          payload: {
            ModelName: modelName,
            ModelList: paramsData
          }
        })
      } else {
        this.props.dispatch({
          type: 'qualityControl/workPatternAdd',
          payload: {
            paramsData
          }
        })
      }
    })
  }

  selectAfter = (idx, value) => <Select defaultValue={`${value}`} onChange={value => {
    this.changeStandardGasData('DateType', value, idx)
  }}>
    <Option value="0">天</Option>
    <Option value="1">小时</Option>
  </Select>

  // 嵌套表格
  expandedRowRender = (record, index, indent, expanded) => {
    const { dataSource } = this.state;
    const { n2Code } = this._SELF_;
    const columns = [
      {
        title: '操作',
        // fixed: 'left',
        width: 80,
        render: (text, record, idx) => <a onClick={() => {
          const tempDataSource = this.state.dataSource;
          tempDataSource.splice(idx, 1);
          this.setState({
            dataSource: [...tempDataSource],
          })
        }}>删除</a>,
      },
      {
        title: '标气名称',
        dataIndex: 'StandardGasCode',
        width: 200,
        render: (text, record, idx) => <FormItem style={{ marginBottom: '0', width: '100%' }}>
          {this.props.form.getFieldDecorator(`StandardGasCode${record.key}`, {
            rules: [
              { required: true, message: '请选择标气名称' },
            ],
            initialValue: text || undefined,
          })(
            <Select style={{ width: '100%' }} onChange={value => {
              this.changeStandardGasData('StandardGasCode', value, idx);
              let defaultValue;
              // const unit;
              switch (value) {
                case '02':
                  defaultValue = '100';
                  record.unit = 'mg/m3'
                  break;
                case '03':
                  defaultValue = '200';
                  record.unit = 'mg/m3'
                  break;
                case 'P':
                  defaultValue = undefined;
                  record.unit = '%'
                  break;
                default:
                  defaultValue = undefined;
                  record.unit = '%'
                  break;
              }
              // this.setState({
              //   unit: unit
              // })
              const StandardGasName = value == "P" ? "空气" : this.props.standardGasList.find(item => item.PollutantCode == value).PollutantName;
              // 设置满量程值
              this.changeStandardGasData('Range', defaultValue, idx);
              // 设置标气名称
              this.changeStandardGasData('StandardGasName', StandardGasName, idx);
              if(value=="P")
              {
                this.changeStandardGasData('StabilizationTime', 0, idx);
              }
            }}>
              {
                this.props.standardGasList.filter(item => item.PollutantCode !== "065").map(item =>
                  <Option
                    // disabled={this.state.dataSource.find(itm => itm.StandardGasCode == item.PollutantCode)}
                    key={item.PollutantCode}
                    value={item.PollutantCode}
                  >
                    {item.PollutantName}
                  </Option>)
              }
              {
                <Option
                  // disabled={this.state.dataSource.find(itm => itm.StandardGasCode == item.PollutantCode)}
                  key={"P"}
                  value={"P"}
                >
                  {"空气"}
                </Option>
              }
            </Select>,
          )}
        </FormItem>,
      },
      {
        title: '配比气浓度',
        dataIndex: 'StandardValue',
        width: 180,
        render: (text, record, idx) => {
          if (record.StandardGasCode === n2Code||record.StandardGasCode==="P") {
            return '-'
          }
          return <FormItem style={{ marginBottom: '0' }}>
            {this.props.form.getFieldDecorator(`StandardValue${record.key}`, {
              rules: [
                { required: true, message: '请输入配比气浓度' },
              ],
              initialValue: text || undefined,
            })(
              <InputNumber
                // formatter={value => `${value}${record.unit}`}
                // parser={value => value.replace(`${record.unit}`, '')}
                min={0}
                onChange={value => { this.changeStandardGasData('StandardValue', value, idx) }}
              />,
            )}
            &nbsp;{record.unit}
          </FormItem>
        },
      },
      {
        title: '总流量设定值',
        dataIndex: 'TotalFlowSetVal',
        width: 180,
        render: (text, record, idx) =>{
          if (record.StandardGasCode === "P") {
            return '-'
          }
          <FormItem style={{ marginBottom: '0' }}>
          {this.props.form.getFieldDecorator(`TotalFlowSetVal${record.key}`, {
            rules: [
              { required: true, message: '请输入总流量设定值' },
            ],
            initialValue: text || undefined,
          })(
            <InputNumber
              // formatter={value => `${value}${record.unit}`}
              // parser={value => value.replace(`${record.unit}`, '')}
              min={0}
              onChange={value => { this.changeStandardGasData('TotalFlowSetVal', value, idx) }}
            />,
          )}
        </FormItem>},
      },
      {
        title: '满量程值',
        dataIndex: 'Range',
        width: 140,
        render: (text, record, idx) => {
          if (record.StandardGasCode === n2Code) {
            return '-'
          }
          return text ? <FormItem style={{ marginBottom: '0' }}>
            {this.props.form.getFieldDecorator(`Range${record.key}`, {
              rules: [
                { required: true, message: '请填写满量程值' },
              ],
              initialValue: text || undefined,
            })(
              // <InputNumber min={0} formatter={value => `${value}μmol/mol`} parser={value => value.replace('μmol/mol', '')}/>
              <InputNumber min={0} onChange={value => { this.changeStandardGasData('Range', value, idx) }} />,
            )}
          </FormItem> : '-'
        },
      },
      {
        title: '通气时间',
        dataIndex: 'VentilationTime',
        width: 100,
        render: (text, record, idx) => {
          if (record.StandardGasCode === n2Code ) {
            return '-'
          }
          let i = 0;
          const timeList = [];
          while (i < 60) {
            timeList.push(<Option key={i + 1}>{i + 1}分钟</Option>)
            i++;
          }
          return <FormItem style={{ marginBottom: '0' }}>
            {this.props.form.getFieldDecorator(`VentilationTime${record.key}`, {
              rules: [
                { required: true, message: '请选择通气时间' },
              ],
              initialValue: text ? `${text}` : '3',
            })(
              <Select
                onChange={value => { this.changeStandardGasData('VentilationTime', value, idx) }}
              >
                {
                  timeList.map(item => item)
                }
              </Select>,
            )}
          </FormItem>
        },
      },
      {
        title: '稳定时间',
        dataIndex: 'StabilizationTime',
        width: 100,
        render: (text, record, idx) => {
          if (record.StandardGasCode === n2Code|| record.StandardGasCode === "P") {
            return '-'
          }
          let i = 0;
          const timeList = [];
          while (i < 60) {
            timeList.push(<Option key={i + 1}>{i + 1}分钟</Option>)
            i++;
          }
          return <FormItem style={{ marginBottom: '0' }}>
            {this.props.form.getFieldDecorator(`StabilizationTime${record.key}`, {
              rules: [
                { required: true, message: '请选择稳定时间' },
              ],
              initialValue: text ? `${text}` : '3',
            })(
              <Select
                onChange={value => { this.changeStandardGasData('StabilizationTime', value, idx) }}
              >
                {
                  timeList.map(item => item)
                }
              </Select>,
            )}
          </FormItem>
        },
      },
      {
        title: '质控周期',
        dataIndex: 'Cycle',
        width: 360,
        render: (text, record, idx) => {
          if (record.StandardGasCode === n2Code) {
            return '-'
          }
          const { DateType, Cycle, Hour, Minutes } = this.state.dataSource[idx];
          return <FormItem style={{ marginBottom: '6px' }}>
            {this.props.form.getFieldDecorator(`Cycle${record.key}`, {
              rules: [
                { required: true, message: '请输入质控周期' },
              ],
              initialValue: text || undefined,
            })(
              <InputGroup compact>
                <Input
                  style={{ width: '50%' }}
                  defaultValue={text ? `${text}` : undefined}
                  addonBefore="周期:"
                  addonAfter={this.selectAfter(idx, DateType)}
                  onChange={e => {
                    this.changeStandardGasData('Cycle', e.target.value, idx)
                  }}
                />
                {
                  DateType == '0' ? <>
                    <TimePicker format="HH:mm" defaultValue={(Hour != undefined && Minutes != undefined) ? moment(`${Hour}:${Minutes}`, 'HH:mm') : undefined} onChange={(time, timeString) => {
                      if (time && timeString) {
                        const hour = timeString.split(':')[0];
                        const minutes = timeString.split(':')[1];
                        this.changeStandardGasData('Hour', hour, idx)
                        this.changeStandardGasData('Minutes', minutes, idx)
                        this.setState({
                          predictTime: timeString,
                        })
                      }
                    }} />
                    {
                      (!this._SELF_.modelName && text && Hour && Minutes) ?
                        <div style={{ position: 'absolute', bottom: -18, left: 0, width: '100%', fontSize: 12, color: 'rgba(0, 0, 0, 0.6)' }}>
                          <Icon type="info-circle" style={{ marginRight: 6 }} />
                          预计下次质控时间：{`${moment().add(text, 'day').format('YYYY-MM-DD')} ${Hour}:${Minutes}:00`}
                        </div> : null
                    }
                  </>
                    : <>
                      <TimePicker format="mm" defaultValue={(Minutes != undefined) ? moment(`${Minutes}`, 'mm') : undefined} onChange={(time, timeString) => {
                        if (time && timeString) {
                          this.changeStandardGasData('Hour', undefined, idx)
                          this.changeStandardGasData('Minutes', timeString, idx)
                          this.setState({
                            predictTime: timeString,
                          })
                        }
                      }} />
                      {
                        (!this._SELF_.modelName && text && Minutes) ?
                          <div style={{ position: 'absolute', bottom: -18, left: 0, width: '100%', fontSize: 12, color: 'rgba(0, 0, 0, 0.6)' }}>
                            <Icon type="info-circle" style={{ marginRight: 6 }} />
                            预计下次质控时间：{`${moment().add(text, 'hours').format('YYYY-MM-DD HH')}:${Minutes}:00`}
                          </div> : null
                      }
                    </>
                }
              </InputGroup>,
            )}
          </FormItem>
        },
      },
    ];
    const data = [];
    let props = {};
    // if (!dataSource[index].Component.length) {
    if (!dataSource.length) {
      props = {
        locale: {
          emptyText: <div className={styles.addContent} onClick={() => { this.addStandardGas() }}>
            <Icon type="plus" /> 添加标气
          </div>,
        },
      };
    } else {
      props = {
        footer: () => <div className={styles.addContent} onClick={() => { this.addStandardGas() }}>
          <Icon type="plus" /> 添加标气
        </div>,
      };
    }
    const scrollXWidth = columns.map(col => col.width || 150).reduce((prev, curr) => prev + curr, 0);
    this._SELF_.scrollXWidth = scrollXWidth;
    return <Table
      {...props}
      rowKey={record => record.key}
      columns={columns}
      dataSource={dataSource}
      scroll={{ x: scrollXWidth }}
      pagination={false}
      bordered={false}
      size="middle"
    />;
  }

  // 添加标气
  addStandardGas = () => {
    const { dataSource } = this.state;
    const key = dataSource;
    dataSource.push({
      // key: `${index}${key}`,
      key: Math.floor(Math.random() * 65535),
      StandardGasCode: undefined, // 标气code
      Range: undefined, // 满量程值
      StandardValue: undefined, // 标准值
      TotalFlowSetVal: undefined, // 总流量设定值
      Cycle: undefined, // 周期数
      DateType: 0, // 周期类型(0:天 1:小时)
      Hour: undefined, // 小时
      Minutes: undefined, // 分钟
      StabilizationTime: '3', // 稳定时间
      VentilationTime: '5', // 通气时间
      // ExpirationDate: undefined, // 过期时间
      // Concentration: undefined, // 气瓶浓度
      unit: 'mg/m3',
      // GasInitPower: undefined, // 标气初始压力
    })
    this.setState({ dataSource })
  }

  render() {
    const { columns, dataSource, expandedRowKeys, dataSourceR } = this.state;
    const { formItemLayout, modelName, title, scrollXWidth, n2Code } = this._SELF_;
    const { form: { getFieldDecorator, getFieldValue }, qualityControlFormData, loading, addBtnLoading, editBtnLoading } = this.props;
    let locale = {};
    if (loading) {
      return <PageLoading />
    }
    return (
      <BreadcrumbWrapper title={title}>
        <Card>
          <Form>
            <Row>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="工作模式">
                  {getFieldDecorator('ModelName', {
                    rules: [{
                      required: true,
                      message: '请填写工作模式!',
                    }],
                    initialValue: modelName
                  })(
                    <Input placeholder="请填写工作模式" />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Card
              // style={{ marginTop: 16 }}
              type="inner"
              title="关联污染物"
              bordered={false}
            >
              {this.expandedRowRender()}
            </Card>
          </Form>
          <Row>
            <Divider orientation="right">
              <Button type="primary" loading={modelName ? editBtnLoading : addBtnLoading} onClick={this.onSubmitForm}>保存</Button>
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
