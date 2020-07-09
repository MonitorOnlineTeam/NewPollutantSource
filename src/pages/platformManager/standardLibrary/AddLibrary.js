/*
 * @Author: Jiaqi
 * @Date: 2019-11-05 17:18:32
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2019-11-08 11:26:10
 * @desc: 标准库管理
 */
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
  Table,
  Card,
  Tag,
  Collapse,
  Divider,
  Row,
  Col,
  Button,
  Input,
  InputNumber,
  Select,
  Switch,
  Popconfirm,
  message,
  Upload,
} from 'antd';
import NavigationTree from '@/components/NavigationTree';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import { connect } from 'dva';
import SdlTable from '@/components/SdlTable';
import SdlUpload from '@/pages/AutoFormManager/SdlUpload';
import SelectPollutantType from '@/components/SelectPollutantType';
import cuid from 'cuid';
import config from '@/config';

@Form.create()
@connect(({ common, loading, standardLibraryManager, autoForm }) => {
  return {
    pollutantTypelist: common.pollutantTypelist,
    pollutantCode: common.pollutantCode,
    libraryEditData: standardLibraryManager.libraryEditData,
    fileList: autoForm.fileList,
  };
})
class AddLibrary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      libraryId: props.match.params.id,
      dataSource: [],
      cuid: props.match.params.cuid !== 'null' ? props.match.params.cuid : cuid(),
      fileList: [],
      columns: [
        {
          title: '污染物编号',
          dataIndex: 'PollutantCode',
          width: 120,
        },
        {
          title: '污染物名称',
          dataIndex: 'PollutantName',
          render: (text, record, index) => {
            return (
              // <Form.Item style={{ marginBottom: '0' }}>
              //   {this.props.form.getFieldDecorator('PollutantName' + index, {
              //     rules: [{
              //       required: true,
              //       message: '请选择标准库类型!',
              //     }],
              //     initialValue: text ? text : undefined
              //   })(
              <Select
                value={text || record.PollutantCode}
                onChange={value => {
                  this.changeDataSource(value, index, 'PollutantName');
                }}
              >
                {this.props.pollutantCode.map(item => {
                  return (
                    <Option
                      key={item.field}
                      disabled={this.state.dataSource.find(
                        itm => itm.PollutantName == item.field || itm.PollutantCode == item.field,
                      )}
                    >
                      {item.name}
                    </Option>
                  );
                })}
              </Select>
              //   )}
              // </Form.Item>
            );
          },
        },
        {
          title: '污染物类型',
          dataIndex: 'PollutantType',
          render: (text, record, index) => {
            if (text) {
              // this.props.pollutantTypelist.map(item => {
              //   if (item.pollutantTypeCode == text) {
              //     return item.pollutantTypeName
              //   }
              // })
              return this.props.pollutantTypelist.filter(item => item.pollutantTypeCode == text)[0]
                .pollutantTypeName;
            }
            // return "";
          },
        },
        {
          title: '上限',
          dataIndex: 'UpperLimit',
          render: (text, record, index) => {
            return (
              // <Form.Item>
              //   {this.props.form.getFieldDecorator('UpperLimit' + index, {
              //     initialValue: text ? text : undefined
              //   })(
              <InputNumber
                value={text}
                min={0}
                max={10000}
                step={0.1}
                onChange={value => {
                  this.changeDataSource(value, index, 'UpperLimit');
                }}
              />
              //   )}
              // </Form.Item>
            );
          },
        },
        {
          title: '下限',
          dataIndex: 'LowerLimit',
          render: (text, record, index) => {
            return (
              // <Form.Item>
              //   {this.props.form.getFieldDecorator('LowerLimit' + index, {
              //     initialValue: text ? text : undefined
              //   })(
              <InputNumber
                value={text}
                min={0}
                max={10000}
                step={0.1}
                onChange={value => {
                  this.changeDataSource(value, index, 'LowerLimit');
                }}
              />
              //   )}
              // </Form.Item>
            );
          },
        },
        {
          title: '报警类型',
          dataIndex: 'AlarmType',
          render: (text, record, index) => {
            return (
              // <Form.Item>
              //   {this.props.form.getFieldDecorator('AlarmType' + index, {
              //     rules: [{
              //       required: true,
              //       message: '请选择报警类型!',
              //     }],
              //     initialValue: text ? text : undefined
              //   })(
              <Select
                value={text != null ? `${text}` : undefined}
                onChange={value => {
                  this.changeDataSource(value, index, 'AlarmType');
                }}
              >
                <Option value="0">无报警</Option>
                <Option value="1">上限报警</Option>
                <Option value="2">下限报警</Option>
                <Option value="3">区间报警</Option>
              </Select>
              //   )}
              // </Form.Item>
            );
          },
        },
        {
          title: '操作',
          dataIndex: 'operation',
          render: (text, record, index) =>
            this.state.dataSource.length >= 1 ? (
              <Popconfirm title="确定删除此污染物?" onConfirm={() => this.handleDelete(index)}>
                <a>删除</a>
              </Popconfirm>
            ) : null,
        },
      ],
      count: 2,
    };
    this._SELF_ = {
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
      uploadFormItemLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
      },
      title: props.match.params.id ? '编辑标准库' : '添加标准库',
    };
  }

  componentDidMount() {
    const id = this.state.libraryId;
    const cuid = this.state.cuid;
    if (id) {
      this.props.dispatch({
        type: 'standardLibraryManager/getEditData',
        payload: {
          id: id,
        },
      });
      if (cuid) {
        // this.props.form.setFieldsValue({ cuid: cuid })
        this.props.dispatch({
          type: 'autoForm/getAttachmentList',
          payload: {
            FileUuid: cuid,
          },
        });
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.libraryEditData !== nextProps.libraryEditData) {
      this.setState({ dataSource: nextProps.libraryEditData.StandardLibraryPollutantData });
    }
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'standardLibraryManager/updateState',
      payload: {
        libraryEditData: [],
      },
    });
  }

  changeDataSource = (value, index, key) => {
    let dataSource = [...this.state.dataSource];
    // const key = value.currentTarget.id.replace(/\d+/g,'');
    dataSource[index][key] = value;
    if (key === 'PollutantName') {
      dataSource[index]['PollutantCode'] = value;
    }
    this.setState({ dataSource });
  };

  // 添加污染物
  handleAdd = () => {
    let dataSource = this.state.dataSource;
    const pollutantType = this.props.form.getFieldValue('PollutantType');
    if (!pollutantType) {
      message.error('请先选择污染物类型');
      return;
    }
    const type = this.props.pollutantTypelist.filter(
      item => item.pollutantTypeCode == pollutantType,
    )[0];
    const key = dataSource.length + 1;
    dataSource.push({
      key: key,
      PollutantCode: null,
      PollutantName: null,
      Type: type.pollutantTypeCode ? type.pollutantTypeCode : null,
      UpperLimit: null,
      AlarmType: null,
    });
    this.setState({ dataSource });
  };

  // 删除污染物
  handleDelete = index => {
    let tempDataSource = this.state.dataSource;
    tempDataSource.splice(index, 1);
    let newId = this.state.id;
    this.setState({
      id: ++newId,
    });
    this.setState({
      dataSource: [...tempDataSource],
    });
  };

  submitForm = () => {
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      let isErr = false;
      this.state.dataSource.map(item => {
        if (item.PollutantCode == null || item.PollutantCode == undefined) {
          message.error('请选择污染物');
          isErr = true;
          return;
        }
        if (item.AlarmType == null || item.AlarmType == undefined) {
          message.error('请选择报警类型');
          isErr = true;
          return;
        }
      });
      if (!isErr) {
        let payload = {
          AttachmentID: this.state.cuid,
          Name: fieldsValue.Name,
          IsUsed: fieldsValue.IsUsed ? 1 : 0,
          Type: fieldsValue.Type,
          PollutantType: fieldsValue.PollutantType,
          StandardLibraryPollutantData: this.state.dataSource,
        };
        let actionType = 'standardLibraryManager/addLibrary';

        if (this.state.libraryId) {
          // 编辑
          payload.Guid = this.state.libraryId;
          actionType = 'standardLibraryManager/updateLibrary';
        }

        this.props.dispatch({
          type: actionType,
          payload: {
            ...payload,
          },
        });
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator, setFieldsValue },
      libraryEditData,
    } = this.props;
    const { formItemLayout, title, uploadFormItemLayout } = this._SELF_;
    const { dataSource, columns, cuid, fileList } = this.state;

    return (
      <BreadcrumbWrapper title={title}>
        <Card title="标准库维护" className="contentContainer">
          <Form {...formItemLayout}>
            <Row>
              <Col span={12}>
                <Form.Item label="标准库名称">
                  {getFieldDecorator('Name', {
                    rules: [
                      {
                        required: true,
                        message: '请填写标准库名称!',
                      },
                    ],
                    initialValue: libraryEditData.Name,
                  })(<Input placeholder="请填写标准库名称" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="标准库类型">
                  {getFieldDecorator('Type', {
                    rules: [
                      {
                        required: true,
                        message: '请选择标准库类型',
                      },
                    ],
                    initialValue: libraryEditData.Type ? libraryEditData.Type + '' : undefined,
                  })(
                    <Select placeholder="请选择标准库类型">
                      <Option value="1">国标</Option>
                      <Option value="2">地标</Option>
                      <Option value="3">行标</Option>
                    </Select>,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item label="污染物类型">
                  {getFieldDecorator('PollutantType', {
                    rules: [
                      {
                        required: true,
                        message: '请选择污染物类型!',
                      },
                    ],
                    initialValue: libraryEditData.PollutantType,
                  })(
                    <SelectPollutantType
                      onChange={value => {
                        this.props.dispatch({
                          type: 'common/getAllPollutantCode',
                          payload: {
                            pollutantTypes: value,
                          },
                        });
                      }}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="启用状态">
                  {getFieldDecorator('IsUsed', {
                    initialValue: !!libraryEditData.IsUsed,
                    valuePropName: 'checked',
                  })(<Switch />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item {...uploadFormItemLayout} label="附件">
                  {getFieldDecorator('AttachmentID', {
                    // initialValue: libraryEditData.IsUsed,
                    // valuePropName: 'checked',
                  })(
                    <SdlUpload
                      fileList={this.props.fileList}
                      cuid={cuid}
                      uploadSuccess={cuid => {
                        // setFieldsValue({ cuid: cuid })
                        this.setState({
                          cuid: cuid,
                        });
                      }}
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Card
              // style={{ marginTop: 16 }}
              type="inner"
              title="污染物维护"
              bordered={false}
            >
              <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
                添加
              </Button>
              <SdlTable
                rowKey={record => record.index || record.Guid}
                bordered
                dataSource={dataSource}
                columns={columns}
                refresh={this.state.id}
                // scroll={{ y: "calc(100vh - 790px)" }}
                pagination={false}
              />
            </Card>
            <Row>
              <Divider orientation="right">
                <Button type="primary" onClick={this.submitForm}>
                  保存
                </Button>
                <Button
                  style={{ marginLeft: 8 }}
                  onClick={() => {
                    history.go(-1);
                  }}
                >
                  返回
                </Button>
              </Divider>
            </Row>
          </Form>
        </Card>
      </BreadcrumbWrapper>
    );
  }
}

export default AddLibrary;
