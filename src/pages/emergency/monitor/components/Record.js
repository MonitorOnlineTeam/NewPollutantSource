import React, { PureComponent } from 'react';
import { Card, Form, Input, Button, Space, Tooltip, Popconfirm, Modal, Row, Col, Tag, InputNumber, Divider, Select, DatePicker } from 'antd'
import SdlTable from '@/components/SdlTable'
import { DelIcon, EditIcon } from '@/utils/icon'
import { PlusOutlined } from '@ant-design/icons'
import { connect } from 'dva'
import RecordInner from './RecordInner'
import moment from 'moment'

const { RangePicker } = DatePicker
const { TextArea } = Input;
const { Option } = Select;
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 },
};


@connect(({ loading, emergency }) => ({
  dictionaryList: emergency.dictionaryList,
  loading: loading.effects["emergency/getTableList"],
}))
class Record extends PureComponent {
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
      monitorList: [],
    };
    this._SELF_ = {
      KEY: 'Id',
      TYPE: 15,
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
          title: '采样时间',
          dataIndex: 'MonitorTime',
          key: 'MonitorTime',
        },
        {
          title: '采样人',
          dataIndex: 'SamplingPerson',
          key: 'SamplingPerson',
        },
        {
          title: '采样量',
          dataIndex: 'SamplingNum',
          key: 'SamplingNum',
        },
        {
          title: '操作',
          key: 'handle',
          render: (text, record) => {
            return <>
              <Tooltip title="编辑">
                <a onClick={() => {
                  this.setState({ isModalVisible: true, hasEdit: true, editData: record, RealDataList: record.RealDataList })
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
      ],

    }
  }

  componentDidMount() {
    this.getTableList();
    this.getMonitorList();
  }


  // 获取监测点数据
  getMonitorList = () => {
    this.props.dispatch({
      type: 'emergency/getTableList',
      payload: {
        AlarmInfoCode: this.props.AlarmInfoCode,
        Type: 14,
      },
      callback: (res) => {
        this.setState({
          monitorList: res
        })
      }
    })
  }

  // 获取table数据
  getTableList = () => {
    const { ParamBegin, ParamEnd, ParamName } = this.state;
    this.props.dispatch({
      type: 'emergency/getTableList',
      payload: {
        ParamName,
        ParamBegin: ParamBegin ? moment(ParamBegin).format('YYYY-MM-DD 00:00:00') : undefined,
        ParamEnd: ParamEnd ? moment(ParamEnd).format('YYYY-MM-DD 23:59:59') : undefined,
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
          EmergencyData: {
            Id: this.state.hasEdit ? this.state.editData.Id : undefined,
            ...values,
            MonitorTime: moment(values.MonitorTime).format('YYYY-MM-DD HH:mm:ss'),
            RealDataList: this.state.RealDataList,
            AlarmInfoCode: this.props.AlarmInfoCode,
          },
          AlarmInfoCode: this.props.AlarmInfoCode,
          RecordType: this.state.hasEdit ? 'upd' : 'add',
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
    const { isModalVisible, dataSource, editData, hasEdit, monitorList } = this.state;
    const { dictionaryList, loading } = this.props;

    let Longitude = this.formRef.current ? this.formRef.current.getFieldValue('Longitude') : '';
    let Latitude = this.formRef.current ? this.formRef.current.getFieldValue('Latitude') : '';
    const title = hasEdit ? '编辑采样记录' : '新增采样记录';

    return (
      <Card bordered={false} title="监测布点" style={{ margin: 0 }}>
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
              采样时间：
              <RangePicker allowClear style={{ width: 300 }} onChange={(date, dataString) => {
                if (date) {
                  this.setState({ ParamBegin: date[0], ParamEnd: date[1] })
                } else {
                  this.setState({ ParamBegin: undefined, ParamEnd: undefined })
                }
              }} />
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
              ...editData,
              MonitorTime: moment(editData.MonitorTime)
            }}
          >
            {/* <Row gutter={[0, 12]}> */}
            <Row>
              <Col span={12}>
                <Form.Item
                  name="DataGatherCode"
                  label="监测点"
                  rules={[{ required: true, message: '请填写监测点!' }]}
                >
                  <Select placeholder="请选择监测点">
                    {
                      monitorList.map(item => {
                        return <Option value={item.EmerPointCode} key={item.EmerPointCode}>{item.EmerPointName}</Option>
                      })
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="SamplingPerson"
                  label="采样人"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="MonitorTime"
                  label="采样时间"
                  rules={[{ required: true, message: '请填写采样时间!' }]}
                >
                  <DatePicker showTime style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="SamplingNum"
                  label="采样量"
                >
                  <InputNumber style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
            <RecordInner editData={editData.AlarmInfoCode ? editData : null} AlarmInfoCode={this.props.AlarmInfoCode} onOk={(data) => {
              this.setState({
                RealDataList: data
              })
            }} />
          </Form>
        </Modal>
      </Card >
    );
  }
}

export default Record;