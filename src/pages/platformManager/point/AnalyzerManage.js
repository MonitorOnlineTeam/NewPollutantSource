
import React, { Component } from 'react';
import { Card, Form, Row, Col, Input, Select, Button, Table, Cascader, InputNumber, Divider, message, Icon, TimePicker, DatePicker } from 'antd';
import { connect } from 'dva';
import PageLoading from '@/components/PageLoading'
import _ from 'lodash';
import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;


@Form.create()
@connect(({ loading, point }) => ({
  CemsList: point.CemsList,
  MainInstrumentName: point.MainInstrumentName,
  TestComponent: point.TestComponent,
  qualityControlTableData: point.qualityControlTableData,
  btnloading: loading.effects['point/AddAnalyzer'],
  loading: loading.effects['point/GetAnalyzerListByDGIMN'],
}))
class AnalyzerManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      expandedRowKeys: [],
    };
    this._SELF_ = {
      DGIMN: this.props.DGIMN,
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
    console.log(this.props.DGIMN);
    this.props.dispatch({ type: 'point/GetChildCems' })
    this.props.dispatch({ type: 'point/GetMainInstrumentName' })
    this.props.dispatch({ type: 'point/GetComponent' })
    if (this.props.DGIMN) {
      this.props.dispatch({
        type: 'point/GetAnalyzerListByDGIMN',
        payload: {
          DGIMN: this.props.DGIMN,
        },
      })
    }
  }


  componentWillReceiveProps(nextProps) {
    console.log(this.props.qualityControlTableData);
    if (this.props.qualityControlTableData !== nextProps.qualityControlTableData) {
      this.setState({
        dataSource: nextProps.qualityControlTableData,
      })
    }
  }


 /** 添加主表Cem */
 handleAdd = () => {
  const { dataSource } = this.state;
  if (dataSource.length === 3) {
    return;
  }
  const key = dataSource.length + 1;
  dataSource.push({
    key,
    Type: undefined,
    Manufacturer: undefined,
    ManufacturerCode: undefined,
    Component: [],
  })
  this.setState({ dataSource })
}

/** 添加子表 */
handleAddChild = index => {
  const { dataSource } = this.state;
  const key = dataSource[index].Component.length + 1;
  dataSource[index].Component.push({
    key: Math.floor(Math.random() * 65535),
    Name: undefined,
    AnalyzerCode: undefined,
    DeviceModel: undefined,
    Manufacturer: undefined,
    ManufacturerAbbreviation: undefined,
    TestComponent: undefined,
    AnalyzerPrinciple: undefined,
    AnalyzerRangeMin: undefined,
    AnalyzerRangeMax: undefined,
    MeasurementUnit: undefined,
    Slope: undefined,
    Intercept: undefined,
  })
  this.setState({ dataSource })
}

/** 主表值改变 */
changeMainTable = (key, value, index) => {
  const tempDataSource = this.state.dataSource;

  tempDataSource[index][key] = value;
  this.setState({
    dataSource: tempDataSource,
  })
}

/** 子表值改变 */
changeChildTable = (parentIndex, key, value, index) => {
  const tempDataSource = this.state.dataSource;
  tempDataSource[parentIndex].Component[index][key] = value;
  this.setState({
    dataSource: tempDataSource,
  })
}

/** 保存 */
onSubmitForm = () => {
  this.props.form.validateFields((err, fieldsValue) => {
    if (err) {
      return;
    }

    const {
      dataSource,
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
    })
    if (!isErr) {
      const postData = {
        DGIMN: this.props.DGIMN,
        MainTable: dataSource,
      }
      console.log('postData=', postData)
      // return;
      this.props.dispatch({
        type: 'point/AddAnalyzer',
        payload: postData,
      })
    } else {
      message.error('请添加标气');
    }
  })
}

expandedRowRender = (record, index, indent, expanded) => {
  const { dataSource } = this.state;
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
      title: '名称',
      dataIndex: 'Name',
      width: 150,
      render: (text, record, idx) => <FormItem style={{ marginBottom: '0', width: '100%' }}>
          {this.props.form.getFieldDecorator(`Name${record.key}`, {
            rules: [
              { required: true, message: '请选择' },
            ],
            initialValue: text || undefined,
          })(
            <Select style={{ width: '100%' }} onChange={value => {
              this.changeChildTable(index, 'Name', value, idx);
            }}>
              {
                this.props.MainInstrumentName.map(item => <Option disabled={this.state.dataSource[index].Component.find(itm => itm.Name === item.ChildID)} key={item.ChildID} value={item.ChildID}>{item.Name}</Option>)
              }
            </Select>,
          )}
        </FormItem>,
    },
    {
      title: '编码',
      dataIndex: 'AnalyzerCode',
      width: 150,
      render: (text, record, idx) => <FormItem style={{ marginBottom: '0' }}>
          {this.props.form.getFieldDecorator(`AnalyzerCode${record.key}`, {
            rules: [
              { required: true, message: '请输入编码' },
            ],
            initialValue: text || undefined,
          })(
            <Input
              onChange={e => { this.changeChildTable(index, 'AnalyzerCode', e.target.value, idx) }}
            />,
          )}
        </FormItem>,
    },
    {
      title: '型号',
      dataIndex: 'DeviceModel',
      width: 150,
      render: (text, record, idx) => <FormItem style={{ marginBottom: '0' }}>
          {this.props.form.getFieldDecorator(`DeviceModel${record.key}`, {
            rules: [
              { required: true, message: '请输入型号' },
            ],
            initialValue: text || undefined,
          })(
            <Input
              onChange={e => { this.changeChildTable(index, 'DeviceModel', e.target.value, idx) }}
            />,
          )}
        </FormItem>,
    },
    {
      title: '制造商',
      dataIndex: 'Manufacturer',
      width: 200,
      render: (text, record, idx) => <FormItem style={{ marginBottom: '0' }}>
          {this.props.form.getFieldDecorator(`Manufacturer${record.key}`, {
            rules: [
              { required: true, message: '请填写制造商' },
            ],
            initialValue: text || undefined,
          })(
            <Input onChange={e => { this.changeChildTable(index, 'Manufacturer', e.target.value, idx) }} />,
          )}
        </FormItem>,
    },
    {
      title: '制造商简称',
      dataIndex: 'ManufacturerAbbreviation',
      width: 250,
      render: (text, record, idx) => <FormItem style={{ marginBottom: '0' }}>
          {this.props.form.getFieldDecorator(`ManufacturerAbbreviation${record.key}`, {
            initialValue: text || undefined,
          })(
            <Input onChange={e => { this.changeChildTable(index, 'ManufacturerAbbreviation', e.target.value, idx) }} />,
          )}
        </FormItem>,
    },
    {
      title: '测试项目',
      dataIndex: 'TestComponent',
      width: 150,
      render: (text, record, idx) => <FormItem style={{ marginBottom: '0', width: '100%' }}>
          {this.props.form.getFieldDecorator(`TestComponent${record.key}`, {
            rules: [
              { required: true, message: '请选择测试项目' },
            ],
            initialValue: text || undefined,
          })(
            <Select style={{ width: '100%' }} onChange={value => {
              this.changeChildTable(index, 'TestComponent', value, idx);
            }}>
              {
                this.props.TestComponent.map(item => <Option disabled={this.state.dataSource[index].Component.find(itm => itm.TestComponent === item.ChildID)} key={item.ChildID} value={item.ChildID}>{item.Name}</Option>)
              }
            </Select>,
          )}
        </FormItem>,
    },
    {
      title: '分析仪原理',
      dataIndex: 'AnalyzerPrinciple',
      width: 150,
      render: (text, record, idx) => <FormItem style={{ marginBottom: '0' }}>
          {this.props.form.getFieldDecorator(`AnalyzerPrinciple${record.key}`, {
            initialValue: text || undefined,
          })(
            <Input onChange={e => { this.changeChildTable(index, 'AnalyzerPrinciple', e.target.value, idx) }} />,
          )}
        </FormItem>,
    },
    {
      title: '最小量程',
      dataIndex: 'AnalyzerRangeMin',
      width: 150,
      render: (text, record, idx) => <FormItem style={{ marginBottom: '0' }}>
          {this.props.form.getFieldDecorator(`AnalyzerRangeMin${record.key}`, {
            initialValue: text || undefined,
          })(
            <InputNumber min={0} onChange={value => { this.changeChildTable(index, 'AnalyzerRangeMin', value, idx) }} />,
          )}
        </FormItem>,
    },
    {
      title: '最大量程',
      dataIndex: 'AnalyzerRangeMax',
      width: 150,
      render: (text, record, idx) => <FormItem style={{ marginBottom: '0' }}>
          {this.props.form.getFieldDecorator(`AnalyzerRangeMax${record.key}`, {
            initialValue: text || undefined,
          })(
            <InputNumber min={0} onChange={value => { this.changeChildTable(index, 'AnalyzerRangeMax', value, idx) }} />,
          )}
        </FormItem>,
    },
    {
      title: '单位',
      dataIndex: 'MeasurementUnit',
      width: 150,
      render: (text, record, idx) => <FormItem style={{ marginBottom: '0' }}>
          {this.props.form.getFieldDecorator(`MeasurementUnit${record.key}`, {
            initialValue: text || undefined,
          })(
            <Input onChange={e => { this.changeChildTable(index, 'MeasurementUnit', e.target.value, idx) }} />,
          )}
        </FormItem>,
    },
    {
      title: '斜率',
      dataIndex: 'Slope',
      width: 150,
      render: (text, record, idx) => <FormItem style={{ marginBottom: '0' }}>
          {this.props.form.getFieldDecorator(`Slope${record.key}`, {
            initialValue: text || undefined,
          })(
            <InputNumber min={0} onChange={value => { this.changeChildTable(index, 'Slope', value, idx) }} />,
          )}
        </FormItem>,
    },
    {
      title: '截距',
      dataIndex: 'Intercept',
      width: 150,
      render: (text, record, idx) => <FormItem style={{ marginBottom: '0' }}>
          {this.props.form.getFieldDecorator(`Intercept${record.key}`, {
            initialValue: text || undefined,
          })(
            <InputNumber min={0} onChange={value => { this.changeChildTable(index, 'Intercept', value, idx) }} />,
          )}
        </FormItem>,
    },
  ];
  let props = {};
  if (!dataSource[index].Component.length) {
    props = {
      locale: {
        emptyText: <div className={styles.addContent} onClick={() => { this.handleAddChild(index) }}>
          <Icon type="plus" /> 添加
        </div>,
      },
    };
  } else {
    props = {
      footer: () => <div className={styles.addContent} onClick={() => { this.handleAddChild(index) }}>
          <Icon type="plus" /> 添加
      </div>,
    };
  }
  const scrollXWidth = columns.map(col => col.width || 150).reduce((prev, curr) => prev + curr, 0);
  this._SELF_.scrollXWidth = scrollXWidth;
  return <Table
    {...props}
    rowKey={record => record.key}
    columns={columns}
    dataSource={dataSource[index].Component}
    scroll={{ x: scrollXWidth }}
    pagination={false}
    bordered={false}
    size="samll"
  />;
}

  render() {
    const { dataSource, expandedRowKeys } = this.state;
    const { formItemLayout, id, title, scrollXWidth } = this._SELF_;
    const { form: { getFieldDecorator }, qualityControlFormData, loading } = this.props;
    const columns = [
      {
        title: '操作',
        // fixed: 'left',
        width: '10%',
        render: (text, record, idx) => <a onClick={() => {
            const tempDataSource = this.state.dataSource;
            tempDataSource.splice(idx, 1);
            this.setState({
              dataSource: [...tempDataSource],
            })
          }}>删除</a>,
      },
      {
        title: 'Cem名称',
        dataIndex: 'Type',
        width: '20%',
        render: (text, record, idx) => <FormItem style={{ marginBottom: '0', width: '100%' }}>
            {getFieldDecorator(`Type${record.key}`, {
              rules: [
                { required: true, message: '请选择Cem名称' },
              ],
              initialValue: text || undefined,
            })(
              <Select style={{ width: '100%' }} onChange={value => {
                this.changeMainTable('Type', value, idx);
              }}>
                {
                  this.props.CemsList.map(item => <Option disabled={this.state.dataSource.find(itm => itm.Type == item.ChildID)} key={item.ChildID} value={item.ChildID}>{item.Name}</Option>)
                }
              </Select>,
            )}
          </FormItem>,
      },
      {
        title: '供应商',
        dataIndex: 'Manufacturer',
        render: (text, record, idx) => <FormItem style={{ marginBottom: '0' }}>
            {getFieldDecorator(`Manufacturer${record.key}`, {
              rules: [
                { required: true, message: '请填写供应商' },
              ],
              initialValue: text || undefined,
            })(
                <Input
                  onChange={e => { this.changeMainTable('Manufacturer', e.target.value, idx) }}
                />,
            )}
          </FormItem>,
      },
      {
        title: '供应商编码',
        dataIndex: 'ManufacturerCode',
        width: '20%',
        render: (text, record, idx) => <FormItem style={{ marginBottom: '0' }}>
            {getFieldDecorator(`ManufacturerCode${record.key}`, {
              rules: [
                { required: true, message: '请填写供应商编码' },
              ],
              initialValue: text || undefined,
            })(
                <Input
                  onChange={e => { this.changeMainTable('ManufacturerCode', e.target.value, idx) }}
                />,
            )}
          </FormItem>,
      },
    ];
    if (loading) {
      return <PageLoading />
    }
    return (
      <div>
        <Card
              title=
              {<Button onClick={this.handleAdd} type="primary">
              添加
              </Button>}
              type="inner"
              bordered={false}
            >
              <Table
                rowKey={record => record.key}
                expandedRowKeys={expandedRowKeys}
                defaultExpandAllRows={!!id}
                columns={columns}
                dataSource={dataSource}
                scroll={{ x: 300 }}
                expandedRowRender={this.expandedRowRender}
                defaultExpandAllRows
                onExpand={(expanded, record) => {
                  if (expanded) {
                    this.setState({
                      expandedRowKeys: [
                        ...expandedRowKeys,
                        record.key,
                      ],
                    })
                  } else {
                    const rowKeys = _.remove(expandedRowKeys, n => n !== record.key);
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
               <Row>
            <Divider orientation="right">
              <Button type="primary" loading={this.props.btnloading} onClick={this.onSubmitForm}>保存</Button>
            </Divider>
          </Row>
        </Card>
      </div>
    );
  }
}

export default AnalyzerManage;
