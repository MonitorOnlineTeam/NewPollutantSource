/*
 * @Author: Jiaqi
 * @Date: 2019-11-07 11:34:17
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2019-12-05 14:11:18
 * @desc: 添加标准库
 */
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Form, Row, Col, Input, Select, Button, Table, Cascader, InputNumber, Divider, message, Icon, TimePicker, DatePicker } from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import moment from 'moment';
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable';
import SdlTable from '@/components/SdlTable'
import PageLoading from '@/components/PageLoading'
import styles from './index.less';

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
  Sloading: loading.effects['qualityControl/getStandardGas'],
  loading: loading.effects['qualityControl/getQualityControlData'],
}))
class AddInstrument extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      dataSourceR: [],
      expandedRowKeys: [],
      unit: 'mg/m3',
      columns: [
        {
          title: '排口',
          dataIndex: 'DGIMN',
          render: (text, record, index) => <FormItem style={{ marginBottom: '0' }}>
              {this.props.form.getFieldDecorator(`DGIMN${record.key}`, {
                rules: [
                  { required: true, message: '请输入排口' },
                ],
                initialValue: record.DGIMNArr || text,
              })(
                <Cascader
                  style={{ width: '70%' }}
                  fieldNames={{ label: 'title', value: 'key', children: 'children' }}
                  showSearch
                  // disabled={this.state.dataSource[index].find(item => item.DGIMN == )}
                  options={this.props.entAndPointList}
                  onChange={(value, selectedOptions) => {
                    this.changeDataSource(value[1], index, 'DGIMN')
                  }}
                  placeholder="请选择排口"
                />,
              )}
            </FormItem>,
        },
        {
          title: '排口通道',
          dataIndex: 'MNHall',
          render: (text, record, index) => <FormItem style={{ marginBottom: '0' }}>
              {this.props.form.getFieldDecorator(`MNHall${record.key}`, {
                rules: [
                  { required: true, message: '请输入排口通道' },
                ],
                initialValue: text,
              })(
                // <InputNumber min={0}/>
                <Select onChange={value => { this.changeDataSource(value, index, 'MNHall') }} >
                  {
                    this._SELF_.MNHallList.map(item => <Option disabled={this.state.dataSource.find(itm => itm.MNHall == item)} key={item}>{item}</Option>)
                  }
                </Select>,
              )}
            </FormItem>,
        },
        {
          title: '操作',
          render: (text, record, index) => <a onClick={() => {
              const tempDataSource = this.state.dataSource;
              tempDataSource.splice(index, 1);
              this.setState({
                dataSource: [...tempDataSource],
              })
            }}>删除</a>,
        },
      ],
    };
    this._SELF_ = {
      id: props.match.params.id,
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
    const { n2Code } = this._SELF_;
    // 获取企业及排口
    this.props.dispatch({ type: 'qualityControl/getEntAndPointList' })
    // 获取标气列表
    this.props.dispatch({
      type: 'qualityControl/getStandardGas',
       payload: {
          QCAMN: '',
         },
         callback: standardGasList => {
           if (!this._SELF_.id) {
           const dataSourceR = [];
           standardGasList.map(item => {
             dataSourceR.push({
               // key: `${index}${key}`,
               key: Math.floor(Math.random() * 655321),
               StandardGasCode: item.PollutantCode,
               ExpirationDate: undefined,
               Concentration: undefined,
               unit: item.PollutantCode === "s01" ? "%" : 'mg/m3',
               GasInitPower: undefined,
             })
           })
           this.setState({
             dataSourceR,
           })
          }
         },
        });
    // 获取编辑数据
    if (this._SELF_.id) {
      this.props.dispatch({
        type: 'qualityControl/getQualityControlData',
        payload: {
          ID: this._SELF_.id,
        },
      })
    } else {
      const { dataSourceR } = this.state;
       this.props.standardGasList.map(item => {
         dataSourceR.push({
           // key: `${index}${key}`,
           key: Math.floor(Math.random() * 655321),
           StandardGasCode: item.PollutantCode, // 标气code
           ExpirationDate: undefined, // 过期时间
           Concentration: undefined, // 气瓶浓度
           unit: item.PollutantCode === "s01" ? "%" : 'mg/m3',
           GasInitPower: undefined, // 标气初始压力
         })
       })
       this.setState({
         dataSourceR,
       })
    }
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
  }

  changeDataSource = (value, index, key) => {
    const dataSource = [...this.state.dataSource];
    // const key = value.currentTarget.id.replace(/\d+/g,'');
    dataSource[index][key] = value;
    this.setState({ dataSource })
  }

  changeStandardGasData = (parentIndex, key, value, index) => {
    const tempDataSource = this.state.dataSource;
    // if (key === "OffsetValue1") {
    //   tempDataSource[parentIndex]["Component"][index]["OffsetValue"][0] = value;
    // }
    // if (key === "OffsetValue2") {
    //   tempDataSource[parentIndex]["Component"][index]["OffsetValue"][1] = value;
    // }

    tempDataSource[parentIndex].Component[index][key] = value;
    this.setState({
      dataSource: tempDataSource,
    })
  }

  changeStandardGasDataR = (key, value, index) => {
    const tempDataSource = this.state.dataSourceR;

    tempDataSource[index][key] = value;
    this.setState({
      dataSourceR: tempDataSource,
    })
  }

  // 提交保存
  onSubmitForm = () => {
    console.log('dataSourceErr=', this.state.dataSource)
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }

      const {
        dataSource,
        dataSourceR,
      } = this.state;
      let isErr = false;
      dataSource.map(item => {
        if (!item.Component.length) {
          this.setState({
            expandedRowKeys: [
              ...this.state.expandedRowKeys,
              item.key,
            ],
          })
          isErr = true;
        }
        if (item.DGIMN.indexOf('/') > 0) {
          item.DGIMN = item.DGIMNArr[1];
        }
        // 处理氮气
        item.Component = item.Component.map(itm => {
          if (itm.StandardGasCode === '065') {
            return {
              GasInitPower: itm.GasInitPower,
              ExpirationDate: itm.ExpirationDate,
            }
          }
            return itm
        })
      })
      const QCAGasVolume = [];
      const QCAGasRelation = [];
      debugger;
      if (dataSourceR.length > 0) {
         isErr = false;

         const { QCAMN } = fieldsValue;
         dataSourceR.map(item => {
           const arr = {
             QCAMN,
             StandardGasCode: item.StandardGasCode,
             VolumeValue: (item.GasInitPower * 8 * 10/1000).toFixed(4),
           }
           const arr1 = {
             QCAMN,
             StandardGasCode: item.StandardGasCode,
             ExpirationDate: item.ExpirationDate,
             Concentration: item.Concentration,
             GasInitPower: item.GasInitPower,
           }
           QCAGasVolume.push(arr);
           QCAGasRelation.push(arr1);
         })
      } else {
        isErr = true;
      }
      console.log('QCAGasVolume=', QCAGasVolume);
      console.log('QCAGasRelation=', QCAGasRelation);
      console.log('isErr', isErr);
      // return;
      if (!isErr) {
        const postData = {
          Info: {
            ID: this._SELF_.id ? this._SELF_.id : undefined,
            QCAMN: fieldsValue.QCAMN,
            QCAName: fieldsValue.QCAName,
            Productor: fieldsValue.Productor,
            Address: fieldsValue.Address,
            CameraNO: fieldsValue.CameraNO,
            // "CameraAppId": fieldsValue.CameraAppId,
            // "CameraSecret": fieldsValue.CameraSecret,
          },
          Relation: dataSource,
          QCAGasVolume,
          QCAGasRelation,
        }
        console.log('postData=', postData)
        // return;
        this.props.dispatch({
          type: 'qualityControl/addQualityControl',
          payload: postData,
        })
      } else {
        message.error('请添加标气');
      }
    })
  }

  // 添加污染物
  handleAdd = () => {
    const { dataSource } = this.state;
    if (dataSource.length === 4) {
      message.error('最多只能关联4个排口')
      return;
    }
    const key = dataSource.length + 1;
    dataSource.push({
      key,
      DGIMN: undefined,
      MNHall: undefined,
      Component: [],
    })
    this.setState({ dataSource })
  }

  selectAfter = (index, idx, value) => <Select defaultValue={`${value}`} onChange={value => {
      this.changeStandardGasData(index, 'DateType', value, idx)
    }}>
      <Option value="0">天</Option>
      <Option value="1">小时</Option>
    </Select>

  // 嵌套表格
  expandedRowRender = (record, index, indent, expanded) => {
    // console.log('record=', record)
    // console.log('index=', index)
    // console.log('indent=', indent)
    // console.log('expanded=', expanded)

    const { dataSource } = this.state;
    const { n2Code } = this._SELF_;
    const columns = [
      {
        title: '操作',
        // fixed: 'left',
        width: 80,
        render: (text, record, idx) => <a onClick={() => {
            const tempDataSource = this.state.dataSource;
            tempDataSource[index].Component.splice(idx, 1);
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
                this.changeStandardGasData(index, 'StandardGasCode', value, idx);
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
                  default:
                    defaultValue = undefined;
                    record.unit = '%'
                    break;
                }
                // this.setState({
                //   unit: unit
                // })
                const StandardGasName = this.props.standardGasList.find(item => item.PollutantCode == value).PollutantName;
                // 设置满量程值
                this.changeStandardGasData(index, 'Range', defaultValue, idx);
                // 设置标气名称
                this.changeStandardGasData(index, 'StandardGasName', StandardGasName, idx);
              }}>
                {
                  this.props.standardGasList.map(item => <Option disabled={this.state.dataSource[index].Component.find(itm => itm.StandardGasCode == item.PollutantCode)} key={item.PollutantCode} value={item.PollutantCode}>{item.PollutantName}</Option>)
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
          if (record.StandardGasCode === n2Code) {
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
                onChange={value => { this.changeStandardGasData(index, 'StandardValue', value, idx) }}
              />,
            )}
            &nbsp;{record.unit}
          </FormItem>
        },
      },
      // {
      //   title: '偏移范围',
      //   dataIndex: 'OffsetValue',
      //   width: 300,
      //   render: (text, record, idx) => {
      //     return <FormItem style={{ marginBottom: '0' }}>
      //       {this.props.form.getFieldDecorator('OffsetValue' + record.key, {
      //         rules: [
      //           { required: true, message: '请输入偏移范围' },
      //         ],
      //         initialValue: text ? text : undefined
      //       })(
      //         <>
      //           <InputNumber defaultValue={text[0]} min={0} onChange={(value) => {
      //             this.changeStandardGasData(index, "OffsetValue1", value, idx)
      //           }} />
      //           <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>-</span>
      //           <InputNumber defaultValue={text[1]} min={0} onChange={(value) => {
      //             this.changeStandardGasData(index, "OffsetValue2", value, idx)
      //           }} />
      //         </>
      //       )}
      //     </FormItem>
      //   }
      // },
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
              <InputNumber min={0} onChange={value => { this.changeStandardGasData(index, 'Range', value, idx) }} />,
            )}
          </FormItem> : '-'
        },
      },
      {
        title: '稳定时间',
        dataIndex: 'StabilizationTime',
        width: 100,
        render: (text, record, idx) => {
          if (record.StandardGasCode === n2Code) {
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
                onChange={value => { this.changeStandardGasData(index, 'StabilizationTime', value, idx) }}
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
          const { DateType, Cycle, Hour, Minutes } = this.state.dataSource[index].Component[idx];
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
                  addonAfter={this.selectAfter(index, idx, DateType)}
                  onChange={e => {
                    this.changeStandardGasData(index, 'Cycle', e.target.value, idx)
                  }}
                />
                {
                  DateType == '0' ? <>
                    <TimePicker format="HH:mm" defaultValue={(Hour != undefined && Minutes != undefined) ? moment(`${Hour}:${Minutes}`, 'HH:mm') : undefined} onChange={(time, timeString) => {
                      if (time && timeString) {
                        const hour = timeString.split(':')[0];
                        const minutes = timeString.split(':')[1];
                        this.changeStandardGasData(index, 'Hour', hour, idx)
                        this.changeStandardGasData(index, 'Minutes', minutes, idx)
                        this.setState({
                          predictTime: timeString,
                        })
                      }
                    }} />
                    {
                      (!this._SELF_.id && text && Hour && Minutes) ?
                        <div style={{ position: 'absolute', bottom: -18, left: 0, width: '100%', fontSize: 12, color: 'rgba(0, 0, 0, 0.6)' }}>
                          <Icon type="info-circle" style={{ marginRight: 6 }} />
                          预计下次质控时间：{`${moment().add(text, 'day').format('YYYY-MM-DD')} ${Hour}:${Minutes}:00`}
                        </div> : null
                    }
                  </>
                    : <>
                      <TimePicker format="mm" defaultValue={(Minutes != undefined) ? moment(`${Minutes}`, 'mm') : undefined} onChange={(time, timeString) => {
                        if (time && timeString) {
                          this.changeStandardGasData(index, 'Hour', undefined, idx)
                          this.changeStandardGasData(index, 'Minutes', timeString, idx)
                          this.setState({
                            predictTime: timeString,
                          })
                        }
                      }} />
                      {
                        (!this._SELF_.id && text && Minutes) ?
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
      // {
      //   title: '气瓶标气浓度',
      //   dataIndex: 'Concentration',
      //   width: 180,
      //   render: (text, record, idx) => {
      //     if (record.StandardGasCode === n2Code) {
      //       return "-"
      //     }
      //     return <FormItem style={{ marginBottom: '0' }}>
      //       {this.props.form.getFieldDecorator('Concentration' + record.key, {
      //         rules: [
      //           { required: true, message: '请填写气瓶标气浓度' },
      //         ],
      //         initialValue: text ? text : undefined
      //       })(
      //         <InputNumber
      //           // formatter={value => `${value}${record.unit}`}
      //           // parser={value => value.replace(`${record.unit}`, '')}
      //           min={0}
      //           onChange={(value) => { this.changeStandardGasData(index, "Concentration", value, idx) }}
      //         />
      //       )}
      //       &nbsp;{record.unit}
      //     </FormItem>
      //   }
      // },
      // {
      //   title: '标气初始压力',
      //   dataIndex: 'GasInitPower',
      //   width: 140,
      //   render: (text, record, idx) => {
      //     return <FormItem style={{ marginBottom: '0' }}>
      //       {this.props.form.getFieldDecorator('GasInitPower' + record.key, {
      //         rules: [
      //           { required: true, message: '请填写标气初始压力' },
      //         ],
      //         initialValue: text ? text : undefined
      //       })(
      //         <>
      //           <InputNumber
      //             // formatter={value => `${value}mpa`}
      //             // parser={value => value.replace("mpa", '')}
      //             min={0}
      //             onChange={(value) => { this.changeStandardGasData(index, "GasInitPower", value, idx) }}
      //           />
      //           &nbsp;mpa
      //         </>
      //       )}
      //     </FormItem>
      //   }
      // },
      // {
      //   title: '过期时间',
      //   dataIndex: 'ExpirationDate',
      //   width: 140,
      //   render: (text, record, idx) => {
      //     return <FormItem style={{ marginBottom: '0' }}>
      //       {this.props.form.getFieldDecorator('ExpirationDate' + record.key, {
      //         rules: [
      //           { required: true, message: '请选择过期时间' },
      //         ],
      //         initialValue: text ? moment(text) : undefined
      //       })(
      //         <DatePicker format={'YYYY-MM-DD'} onChange={(date, dataString) => {
      //           if (date && dataString) {
      //             this.changeStandardGasData(index, "ExpirationDate", `${dataString} 00:00:00`, idx)
      //           }
      //         }} />
      //       )}
      //     </FormItem>
      //   }
      // },

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
    if (!dataSource[index].Component.length) {
      props = {
        locale: {
          emptyText: <div className={styles.addContent} onClick={() => { this.addStandardGas(index) }}>
            <Icon type="plus" /> 添加标气
          </div>,
        },
      };
    } else {
      props = {
        footer: () => <div className={styles.addContent} onClick={() => { this.addStandardGas(index) }}>
            <Icon type="plus" /> 添加标气
        </div>,
      };
    }
    console.log('index==========', index)
    console.log('dataSource------', dataSource)
    const scrollXWidth = columns.map(col => col.width || 150).reduce((prev, curr) => prev + curr, 0);
    this._SELF_.scrollXWidth = scrollXWidth;
    console.log('scrollXWidth=', scrollXWidth)
    return <Table
      {...props}
      rowKey={record => record.key}
      columns={columns}
      dataSource={dataSource[index].Component}
      scroll={{ x: scrollXWidth }}
      pagination={false}
      bordered={false}
      size="middle"
    />;
  }

  // 添加标气
  addStandardGas = index => {
    const { dataSource } = this.state;
    const key = dataSource[index].Component.length + 1;
    dataSource[index].Component.push({
      // key: `${index}${key}`,
      key: Math.floor(Math.random() * 65535),
      StandardGasCode: undefined, // 标气code
      Range: undefined, // 满量程值
      StandardValue: undefined, // 标准值
      Cycle: undefined, // 周期数
      DateType: 0, // 周期类型(0:天 1:小时)
      Hour: undefined, // 小时
      Minutes: undefined, // 分钟
      StabilizationTime: '3', // 稳定时间
      // ExpirationDate: undefined, // 过期时间
      // Concentration: undefined, // 气瓶浓度
      unit: 'mg/m3',
      // GasInitPower: undefined, // 标气初始压力
    })
    this.setState({ dataSource })
  }

  addStandardGasR = () => {
    const { dataSourceR } = this.state;
    dataSourceR.push({
      // key: `${index}${key}`,
      key: Math.floor(Math.random() * 655321),
      StandardGasCode: undefined, // 标气code
      ExpirationDate: undefined, // 过期时间
      Concentration: undefined, // 气瓶浓度
      unit: 'mg/m3',
      GasInitPower: undefined, // 标气初始压力
    })
    this.setState({ dataSourceR })
  }

  render() {
    const { columns, dataSource, expandedRowKeys, dataSourceR } = this.state;
    const { formItemLayout, id, title, scrollXWidth, n2Code } = this._SELF_;
    const { form: { getFieldDecorator }, qualityControlFormData, loading } = this.props;
    const columnsR = [
      {
        title: '操作',
        // fixed: 'left',
        width: 80,
        render: (text, record, idx) => <a onClick={() => {
            const tempDataSource = this.state.dataSourceR;
            tempDataSource.splice(idx, 1);
            this.setState({
              dataSourceR: [...tempDataSource],
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
                this.changeStandardGasDataR('StandardGasCode', value, idx);
                switch (value) {
                  case '02':
                    record.unit = 'mg/m3'
                    break;
                  case '03':
                    record.unit = 'mg/m3'
                    break;
                  default:
                    record.unit = '%'
                    break;
                }
              }}>
                {
                  this.props.standardGasList.map(item => <Option disabled={this.state.dataSourceR.find(itm => itm.StandardGasCode == item.PollutantCode)} key={item.PollutantCode} value={item.PollutantCode}>{item.PollutantName}</Option>)
                }
              </Select>,
            )}
          </FormItem>,
      },
      {
        title: '气瓶标气浓度',
        dataIndex: 'Concentration',
        width: 180,
        render: (text, record, idx) => {
          if (record.StandardGasCode === n2Code) {
            return '-'
          }
          return <FormItem style={{ marginBottom: '0' }}>
            {this.props.form.getFieldDecorator(`Concentration${record.key}`, {
              rules: [
                { required: true, message: '请填写气瓶标气浓度' },
              ],
              initialValue: text || undefined,
            })(
                <InputNumber
                  min={0}
                  onChange={value => { this.changeStandardGasDataR('Concentration', value, idx) }}
                />,
            )} &nbsp;{record.unit}
          </FormItem>
        },
      },
      {
        title: '标气初始压力',
        dataIndex: 'GasInitPower',
        width: 140,
        render: (text, record, idx) => <FormItem style={{ marginBottom: '0' }}>
            {this.props.form.getFieldDecorator(`GasInitPower${record.key}`, {
              rules: [
                { required: true, message: '请填写标气初始压力' },
              ],
              initialValue: text || undefined,
            })(
                <InputNumber
                  // formatter={value => `${value}mpa`}
                  // parser={value => value.replace("mpa", '')}
                  min={0}
                  onChange={value => { this.changeStandardGasDataR('GasInitPower', value, idx) }}
                />,
            )}&nbsp;mpa
          </FormItem>,
      },
      {
        title: '过期时间',
        dataIndex: 'ExpirationDate',
        width: 140,
        render: (text, record, idx) => <FormItem style={{ marginBottom: '0' }}>
            {this.props.form.getFieldDecorator(`ExpirationDate${record.key}`, {
              rules: [
                { required: true, message: '请选择过期时间' },
              ],
              initialValue: text ? moment(text) : undefined,
            })(
              <DatePicker format="YYYY-MM-DD" onChange={(date, dataString) => {
                if (date && dataString) {
                  this.changeStandardGasDataR('ExpirationDate', `${dataString} 00:00:00`, idx)
                }
              }} />,
            )}
          </FormItem>,
      },

    ];
    let locale = {};
    if (!dataSourceR.length) {
      locale = {
        locale: {
          emptyText: <div className={styles.addContent} onClick={() => { this.addStandardGasR() }}>
            <Icon type="plus" /> 添加标气
          </div>,
        },
      };
    } else {
      locale = {
        footer: () => <div className={styles.addContent} onClick={() => { this.addStandardGasR() }}>
            <Icon type="plus" /> 添加标气
        </div>,
      };
    }
    if (loading) {
      return <PageLoading />
    }
    return (
      <PageHeaderWrapper title={title}>
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
              <Col span={12}>
                <Form.Item {...formItemLayout} label="摄像头序列号">
                  {getFieldDecorator('CameraNO', {
                    rules: [{
                      required: true,
                      message: '请填写摄像头序列号!',
                    }],
                    initialValue: qualityControlFormData.CameraNO,
                  })(
                    <Input placeholder="请填写摄像头序列号" />,
                  )}
                </Form.Item>
              </Col>
              {/* <Col span={12}>
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
              </Col> */}
            </Row>
            <Card
              // style={{ marginTop: 16 }}
              type="inner"
              title="关联标气维护"
              bordered={false}
            >
              <Table
                rowKey={record => record.key}
                columns={columnsR}
                dataSource={dataSourceR}
                scroll={{ x: 300 }}
                bordered={false}
                pagination={false}
                size="middle"
                {...locale}
              />
            </Card>
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
                defaultExpandAllRows={!!id}
                columns={columns}
                dataSource={dataSource}
                scroll={{ x: 300 }}
                expandedRowRender={this.expandedRowRender}
                onExpand={(expanded, record) => {
                  if (expanded) {
                    this.setState({
                      expandedRowKeys: [
                        ...expandedRowKeys,
                        record.key,
                      ],
                    })
                  } else {
                    const rowKeys = _.remove(expandedRowKeys, n => n != record.key);
                    console.log('rowKeys=', rowKeys)
                    this.setState({
                      expandedRowKeys: [
                        ...rowKeys,
                      ],
                    })
                  }
                }}
                expandedRows={expandedRows => {
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
