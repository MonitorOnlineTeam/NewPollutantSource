/*
 * @Author: Jiaqi 
 * @Date: 2019-11-05 17:18:32 
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2021-01-05 13:55:06
 * @desc: 标准库管理
 */
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
  Card,
  Row,
  Col,
  Button,
  Input,
  Select,
  message,
  TreeSelect,
  Descriptions,
  Divider,
  Popconfirm,
  Radio
} from 'antd';
import { PlusOutlined } from '@ant-design/icons'
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import { connect } from 'dva';
import SdlTable from '@/components/SdlTable'
import SdlUpload from '@/pages/AutoFormManager/SdlUpload'
import cuid from 'cuid';
import _ from 'lodash'
import { router } from 'umi'
import styles from '../index.less'

@Form.create()
@connect(({ common, loading, standardLibraryManager, autoForm }) => {
  return {
    // QCAPollutantList: common.QCAPollutantList,
    entAndPointList: common.entAndPointList,
    // libraryEditData: standardLibraryManager.libraryEditData,
    fileList: autoForm.fileList,
  }
})
class AddGas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOnly: props.location.query.isOnly,
      QCAPollutantList: [],
      editData: { DGIMNList: [] },
      entAndPointList: [],
      dataSource: [],
      ID: props.match.params.id,
      columns: [
        {
          title: '气瓶名称',
          dataIndex: 'Cylinder',
          width: 120
        },
        {
          title: '绑定气瓶',
          dataIndex: 'Components',
          render: (text, record, index) => {
            return (
              <Select mode="multiple" placeholder="请选择气瓶绑定" value={text ? text.split(',') : []} onChange={(value) => { this.changeDataSource(value, index, "Components") }} >
                {
                  this.state.QCAPollutantList.map(item => {
                    return <Option key={item.PollutantCode} disabled={this.state.dataSource.find((itm, idx) => {
                      if (itm) {
                        if (idx !== index) {
                          return itm.Components.split(',').includes(item.PollutantCode)
                        }
                      }
                    })}>{item.PollutantName}</Option>
                  })
                }
              </Select>
            )
          }
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
      title: props.match.params.id ? "气瓶标气管理 - 编辑" : "气瓶标气管理 - 添加"
    }
  }

  componentDidMount() {
    const ID = this.state.ID;
    if (ID) {
      this.props.dispatch({
        type: "qualityControl/getGasProInfo",
        payload: {
          ID: ID
        },
        callback: (res) => {
          this.setState({ dataSource: res.CylinderList, editData: res })
        }
      })
    }

    this.getQCAPollutantByDGIMN();
    this.getEntAndPointList();
  }


  // 获取质控污染物
  getQCAPollutantByDGIMN = () => {
    this.props.dispatch({
      type: 'common/getQCAPollutantByDGIMN',
      payload: {},
      callback: (res) => {
        this.setState({ QCAPollutantList: res })
      }
    })
  }

  // 获取质控标气方案关联排口，标识已经显示的排口
  getEntAndPointList = () => {
    this.props.dispatch({
      type: 'common/getEntAndPointList',
      payload: {
        "Status": [],
        "RunState": "1",
        "PollutantTypes": "2"
      },
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.entAndPointList !== prevProps.entAndPointList || this.state.editData.DGIMNList !== prevState.editData.DGIMNList) {
      let DGIMNList = this.state.editData.DGIMNList;
      let entAndPointList = this.props.entAndPointList.map(item => {
        if (item.children) {
          let children = item.children.map(child => {
            return {
              ...child, title: child.EntName + " - " + child.title, disabled: (!DGIMNList.includes(child.key) && child.QCAIsUsed) ? true : false,
            }
          })
          return { ...item, children }
        }
        return item
      })
      this.setState({
        entAndPointList
      })
    }
  }

  changeDataSource = (value, index, key) => {
    let dataSource = [...this.state.dataSource];
    dataSource[index][key] = value.toString();
    this.setState({ dataSource })
  }

  // 添加气瓶
  handleAdd = () => {
    let dataSource = _.cloneDeep(this.state.dataSource);
    const key = dataSource.length + 1;
    dataSource.push({
      key: key,
      Cylinder: '气瓶' + key,
      Components: ''
    })
    this.setState({ dataSource: [...dataSource] })
  }

  // 删除
  handleDelete = (index) => {
    let tempDataSource = _.cloneDeep(this.state.dataSource);
    tempDataSource.splice(index, 1);
    let newId = this.state.id;
    this.setState({
      id: ++newId,
    })
    this.setState({
      dataSource: [...tempDataSource]
    })
  }

  submitForm = () => {
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      const { dataSource, ID, isOnly } = this.state;
      if (!dataSource.length) {
        message.error('请添加气瓶！');
        return;
      }
      let isErr = false;
      dataSource.map(item => {
        if (item.Components == null || item.Components == undefined) {
          message.error("绑定气瓶不能为空！")
          isErr = true;
          return;
        }
      })
      if (!isErr) {
        let payload = {
          ID: ID,
          GasProName: fieldsValue.GasProName,
          DGIMNList: fieldsValue.DGIMNList,
          IsPollution: fieldsValue.IsPollution,
          CylinderList: dataSource
        }
        this.props.dispatch({
          type: 'qualityControl/AddOrUpdGasProInfo',
          payload: {
            ...payload
          },
          callback: () => {
            if (isOnly) {
              router.push({
                pathname: `/qualityControl/qcaManager/gasJoin/editGas/${ID}`,
                query: {
                  isOnly,
                  tabName: '气瓶标气管理 - 编辑',
                }
              })
            } else {
              router.push('/qualityControl/qcaManager/gasJoin')
            }
          }
        })
      }

    })
  }

  render() {
    const { form: { getFieldDecorator, setFieldsValue } } = this.props;
    const { formItemLayout, title, uploadFormItemLayout } = this._SELF_;
    const { dataSource, columns, entAndPointList, editData, ID, isOnly } = this.state;
    console.log('entAndPointList=', this.props);
    const tProps = {
      treeData: entAndPointList,
      // treeNodeLabelProp: "",
      // disabled: true,
      treeDefaultExpandAll: true,
      treeCheckable: true,
      treeNodeFilterProp: "title",
      placeholder: '请选择运维站点！',
      style: {
        width: '100%',
      },
    };
    return (
      <BreadcrumbWrapper title={title}>
        <Card className="contentContainer">
          <Form {...formItemLayout}>
            <Descriptions
              // bordered
              title='标气方案'
              extra={
                isOnly && ID && <Button icon={<PlusOutlined />} type="primary" ghost onClick={() => {
                  router.push('/qualityControl/qcaManager/gasJoin/addGas')
                }}>返回添加</Button>
              }
            >
              <div>
                <Col span={12}>
                  <Form.Item label="标气方案名称">
                    {getFieldDecorator('GasProName', {
                      rules: [{
                        required: true,
                        message: '请填写标气方案名称!',
                      },],
                      initialValue: editData.GasProName
                    })(
                      <Input placeholder="请填写标气方案名称" />
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="是否包含腐蚀气体">
                    {getFieldDecorator('IsPollution', {
                      rules: [{
                        required: true,
                        message: '请填写标气方案名称!',
                      },],
                      initialValue: editData.IsPollution || '0'
                    })(
                      <Radio.Group>
                        <Radio value={'1'}>是</Radio>
                        <Radio value={'0'}>否</Radio>
                      </Radio.Group>
                    )}
                  </Form.Item>
                </Col>
              </div>
            </Descriptions>
            <Divider />
            <Descriptions
              title="添加气瓶"
              className={styles.addBottle}
            >
              {/* <Card
              // style={{ marginTop: 16 }}
              type="inner"
              title="添加气瓶"
              bordered={false}
            > */}
              <div>
                <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
                  添加
                </Button>
                <SdlTable
                  rowKey={record => record.index || record.Guid}
                  bordered={false}
                  dataSource={dataSource}
                  columns={columns}
                  refresh={this.state.id}
                  // scroll={{ y: "calc(100vh - 790px)" }}
                  pagination={false}
                />
              </div>
            </Descriptions>
            {/* </Card> */}
            <Divider />
            <Descriptions
              title="关联排口"
            >
              {/* <Card
              // style={{ marginTop: 16 }}
              type="inner"
              title="关联排口"
              bordered={false}
            > */}
              <Row>
                <Col span={24}>
                  <Form.Item
                    label="关联排口"
                    labelCol={{ span: 3 }}
                    wrapperCol={{ span: 21 }}
                  >
                    {getFieldDecorator('DGIMNList', {
                      rules: [{
                        required: true,
                        message: '请选择关联的排口!',
                      },],
                      initialValue: editData.DGIMNList
                    })(
                      <TreeSelect {...tProps} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Descriptions>
            {/* </Card> */}
            <Row>
              <Divider orientation="right">
                <Button type="primary" onClick={this.submitForm}>保存</Button>
                {
                  !isOnly && <Button
                    style={{ marginLeft: 8 }}
                    onClick={() => {
                      history.go(-1);
                    }}
                  >返回</Button>
                }
              </Divider>
            </Row>
          </Form>
        </Card>
      </BreadcrumbWrapper>
    )
  }
}

export default AddGas;