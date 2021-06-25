import React, { PureComponent } from 'react';
import { Card, Form, Input, Button, Space, Tooltip, Popconfirm, Modal, Row, Col, Select, InputNumber, Divider } from 'antd'
import SdlTable from '@/components/SdlTable'
import { DelIcon, EditIcon } from '@/utils/icon'
import { PlusOutlined } from '@ant-design/icons'
import { connect } from 'dva'

const { Option } = Select;
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};


@connect(({ loading, emergency }) => ({
  dictionaryList: emergency.dictionaryList,
  loading: loading.effects["emergency/getTableList"],
}))
class Factor extends PureComponent {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      ParamName: '',
      isModalVisible: false,
      dataSource: [],
      editData: {},
      hasEdit: false,
    };
    this._SELF_ = {
      KEY: 'RelationCode',
      TYPE: 13,
      columns: [
        {
          title: '序号',
          key: 'index',
          width: 60,
          render: (text, record, index) => {
            return index + 1;
          }
        },
        {
          title: '监测类型',
          dataIndex: 'MonitorTypeName',
          key: 'MonitorTypeName',
        },
        {
          title: '因子名称',
          dataIndex: 'SamplingName',
          key: 'SamplingName',
        },
        {
          title: '单位',
          dataIndex: 'Unit',
          key: 'Unit',
        },
        {
          title: '超高值',
          dataIndex: 'HighValue',
          key: 'HighValue',
        },
        {
          title: '标准值',
          dataIndex: 'UpperLimit',
          key: 'UpperLimit',
        },
        {
          title: '操作',
          key: 'handle',
          render: (text, record) => {
            return <>
              <Tooltip title="编辑">
                <a onClick={() => {
                  this.setState({ isModalVisible: true, hasEdit: true, editData: record })
                }}><EditIcon /></a>
              </Tooltip>
              <Divider type="vertical" />
              <Tooltip title="删除">
                <Popconfirm
                  placement="left"
                  title="确认是否删除?"
                  onConfirm={() => {
                    this.onDelete(record);
                  }}
                  okText="是"
                  cancelText="否">
                  <a href="#"><DelIcon /></a>
                </Popconfirm>
              </Tooltip>
            </>
          }
        },
      ]
    }
  }

  componentDidMount() {
    this.getTableList();
  }

  // 获取table数据
  getTableList = () => {
    this.props.dispatch({
      type: 'emergency/getTableList',
      payload: {
        ParamName: this.state.ParamName,
        AlarmInfoCode: this.props.AlarmInfoCode,
        Type: this._SELF_.TYPE,
      },
      callback: (res) => {
        this.setState({
          dataSource: res
        })
      }
    })
  }

  // 删除
  onDelete = (record) => {
    this.props.dispatch({
      type: 'emergency/delRecord',
      payload: {
        RelationCode: record[this._SELF_.KEY],
        Type: this._SELF_.TYPE
      }
    }).then(() => {
      this.getTableList();
    })
  }

  onSearch = () => {

  }

  onCancel = () => {
    this.setState({ isModalVisible: false })
  }

  // 保存
  onAddSubmit = () => {
    this.formRef.current.validateFields().then((values) => {
      this.props.dispatch({
        type: 'emergency/saveSamplingData',
        payload: {
          Sampling: {
            ...values,
            SamplingCode: this.state.editData.SamplingCode
          },
          AlarmInfoCode: this.props.AlarmInfoCode,
          Type: this._SELF_.TYPE,
        }
      }).then(() => {
        this.getTableList();
        this.setState({ isModalVisible: false })
      })
    })
  }

  render() {
    const { columns, KEY } = this._SELF_;
    const { isModalVisible, dataSource, editData, hasEdit } = this.state;
    const { dictionaryList, loading } = this.props;

    const title = hasEdit ? '编辑因子' : '新增因子';

    return (
      <Card bordered={false} title="采样因子" style={{ margin: 0 }}>
        <Row
          style={{ marginTop: 10, marginBottom: 20 }}
        >
          <Space align="baseline" size={40}>
            <div>
              因子名称：
              <Input allowClear style={{ width: 200 }} placeholder='请输入因子名称' onChange={(e) => {
                this.setState({ ParamName: e.target.value })
              }} />
            </div>
          </Space>
          <Space align="baseline" style={{ marginLeft: 10 }}>
            <Button type="primary"  onClick={this.getTableList}>查询</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => this.setState({ isModalVisible: true, editData: {}, hasEdit: false })}>新增</Button>
          </Space>
        </Row>
        <SdlTable rowKey={(record) => record[this._SELF_.KEY]} loading={{spinning: loading, delay: 200}} columns={columns} dataSource={dataSource} />
        <Modal
          title={title}
          visible={isModalVisible}
          onOk={this.onAddSubmit}
          width={'60vw'}
          destroyOnClose
          onCancel={this.onCancel}
        >
          <Form
            // name="global_state"
            {...layout}
            // layout='inline'
            ref={this.formRef}
            // onFinish={this.onFinish}
            initialValues={{
              ...editData
            }}
          >
            <Row>
              <Col span={12}>
                <Form.Item
                  name="SamplingName"
                  label="因子名称"
                  rules={[{ required: true, message: '请输入因子名称!' }]}
                >
                  <Input placeholder="请输入因子名称" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="SamplingPolCode"
                  label="因子编码"
                  rules={[{ required: true, message: '请填写因子编码!' }]}
                >
                  <Input placeholder="请填写因子编码" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="MonitorType"
                  label="监测类型"
                  rules={[{ required: true, message: '请选择监测类型!' }]}
                >
                  <Select placeholder="请选择监测类型">
                    {
                      dictionaryList.MonitorType.map(item => {
                        return <Option value={item.MonitorTypeCode} key={item.MonitorTypeCode}>{item.MonitorTypeName}</Option>
                      })
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="Unit"
                  label="单位"
                >
                  <Input placeholder="请填写单位" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="UpperLimit"
                  label="标准值上限值"
                  rules={[{ required: true, message: '请填写标准值上限!' }]}
                >
                  <InputNumber placeholder="请填写标准值上限" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="LowerLimit"
                  label="标准值下限值"
                  rules={[{ required: true, message: '请填写标准值下限!' }]}
                >
                  <InputNumber placeholder="请填写标准值下限" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="HighValue"
                  label="超高值"
                  rules={[{ required: true, message: '请填写超高值!' }]}
                >
                  <InputNumber placeholder="请填写超高值" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </Card >
    );
  }
}

export default Factor;