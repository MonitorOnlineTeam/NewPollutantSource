import React, { PureComponent } from 'react';
import { Card, Form, Input, Button, Space, Tooltip, Popconfirm, Modal, Row, Col, Tag, InputNumber, Divider, Select } from 'antd'
import SdlTable from '@/components/SdlTable'
import { DelIcon, EditIcon } from '@/utils/icon'
import { PlusOutlined, RollbackOutlined } from '@ant-design/icons'
import { connect } from 'dva'
import SdlMap from '@/pages/AutoFormManager/SdlMap';

const { TextArea } = Input;
const { Option } = Select;
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};


@connect(({ loading, emergency }) => ({
  dictionaryList: emergency.dictionaryList,
  loading: loading.effects["emergency/getTableList"],
}))
class Point extends PureComponent {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      ParamType: undefined,
      ParamName: '',
      isModalVisible: false,
      dataSource: [],
      editData: {},
      hasEdit: false,
    };
    this._SELF_ = {
      KEY: 'RelationCode',
      TYPE: 14,
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
          title: '监测点名称',
          dataIndex: 'EmerPointName',
          key: 'EmerPointName',
        },
        {
          title: '经度',
          dataIndex: 'Longitude',
          key: 'Longitude',
        },
        {
          title: '纬度',
          dataIndex: 'Latitude',
          key: 'Latitude',
        },
        {
          title: '描述',
          dataIndex: 'Describe',
          key: 'Describe',
        },
        {
          title: '监测状态',
          dataIndex: 'MonitorStatus',
          key: 'MonitorStatus',
          render: (text, record) => {
            return text === 1 ? <Tag color="success">正常</Tag> : <Tag color="error">终止监测</Tag>
          }
        },
        {
          title: '终止时间',
          dataIndex: 'EndTime',
          key: 'EndTime',
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
    const { ParamType, ParamName } = this.state;
    this.props.dispatch({
      type: 'emergency/getTableList',
      payload: {
        ParamName,
        ParamType,
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
          Point: {
            ...values,
            MonitorStatus: 1,
            EmerPointCode: this.state.editData.EmerPointCode
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

    let Longitude = this.formRef.current ? this.formRef.current.getFieldValue('Longitude') : '';
    let Latitude = this.formRef.current ? this.formRef.current.getFieldValue('Latitude') : '';
    const title = hasEdit ? '编辑监测点' : '新增监测点';

    return (
      <Card bordered={false} title="监测布点" style={{ margin: 0 }} extra={
        <Button icon={<RollbackOutlined />} onClick={() => history.go(-1)}>返回</Button>
      }>
        <Row
          style={{ marginTop: 10, marginBottom: 20 }}
        >
          <Space align="baseline" size={40}>
            <div>
              监测点名称：
              <Input style={{ width: 200 }} placeholder='请输入监测点名称' onChange={(e) => {
                this.setState({ ParamName: e.target.value })
              }} />
            </div>
            <div>
              监测状态：
              <Select defaultValue={null} style={{ width: 180 }} onChange={(value) => {
                this.setState({ ParamType: value })
              }}>
                <Option value={null}>全部</Option>
                <Option value={1}>正常</Option>
                <Option value={2}>终止监测</Option>
              </Select>
            </div>
          </Space>
          <Space align="baseline" style={{ marginLeft: 10 }}>
            <Button type="primary" onClick={this.getTableList}>查询</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => this.setState({ isModalVisible: true, editData: {}, hasEdit: false })}>新增</Button>
          </Space>
        </Row>
        <SdlTable rowKey={(record) => record[this._SELF_.KEY]} loading={{ spinning: loading, delay: 200 }} columns={columns} dataSource={dataSource} />
        <Modal
          title={title}
          visible={isModalVisible}
          onOk={this.onAddSubmit}
          width={'60vw'}
          destroyOnClose
          onCancel={this.onCancel}
        >
          <Form
            {...layout}
            ref={this.formRef}
            initialValues={{
              ...editData
            }}
          >
            <Row>
              <Col span={24}>
                <Form.Item
                  name="EmerPointName"
                  label="监测点名称"
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}
                  rules={[{ required: true, message: '请填写因子编码!' }]}
                >
                  <Input placeholder="请填写因子编码" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="Longitude"
                  label="经度"
                  rules={[{ required: true, message: '请输入经度!' }]}
                >
                  <SdlMap
                    onOk={map => {
                      this.formRef.current.setFieldsValue({ Longitude: map.longitude, Latitude: map.latitude });
                    }}
                    longitude={Longitude}
                    latitude={Latitude}
                    path={undefined}
                    handleMarker
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="Latitude"
                  label="纬度"
                  rules={[{ required: true, message: '请输入纬度!' }]}
                >
                  <SdlMap
                    onOk={map => {
                      this.formRef.current.setFieldsValue({ Longitude: map.longitude, Latitude: map.latitude });
                    }}
                    longitude={Longitude}
                    latitude={Latitude}
                    path={undefined}
                    handleMarker
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="Describe"
                  label="描述"
                  labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}
                >
                  <TextArea />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </Card >
    );
  }
}

export default Point;