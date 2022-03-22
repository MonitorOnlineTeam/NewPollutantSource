import React, { PureComponent } from 'react';
import { Card, Form, Input, Button, Space, Tooltip, DatePicker, Popconfirm, Modal, Row, Col, Select, InputNumber, Divider } from 'antd'
import SdlTable from '@/components/SdlTable'
import { DelIcon, EditIcon } from '@/utils/icon'
import { PlusOutlined } from '@ant-design/icons'
import { connect } from 'dva'
import Cookie from 'js-cookie';
import moment from 'moment'

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 },
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
      TYPE: 12,
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
          title: '快报时间',
          dataIndex: 'NewsTime',
          key: 'NewsTime',
        },
        {
          title: '死亡人数（人）',
          dataIndex: 'DeathNum',
          key: 'DeathNum',
        },
        {
          title: '重伤人数（人）',
          dataIndex: 'SeriousInjury',
          key: 'SeriousInjury',
        },
        {
          title: '轻伤人数（人）',
          dataIndex: 'MinorWound',
          key: 'MinorWound',
        },
        {
          title: '经济损失（万）',
          dataIndex: 'EconomicLoss',
          key: 'EconomicLoss',
        },
        {
          title: '目前处理情况',
          dataIndex: 'NewsCondition',
          key: 'NewsCondition',
          width: 300,
        },
        {
          title: '快报人',
          dataIndex: 'NewsPerson',
          key: 'NewsPerson',
        },
        {
          title: '状态',
          dataIndex: 'UpperLimit',
          key: 'UpperLimit',
          render: (text, record) => {
            return <span>已上报</span>
          }
        },
        // {
        //   title: '操作',
        //   key: 'handle',
        //   render: (text, record) => {
        //     return <>
        //       <Tooltip title="编辑">
        //         <a onClick={() => {
        //           this.setState({ isModalVisible: true, hasEdit: true, editData: record })
        //         }}><EditIcon /></a>
        //       </Tooltip>
        //       <Divider type="vertical" />
        //       <Tooltip title="删除">
        //         <Popconfirm
        //           placement="left"
        //           title="确认是否删除?"
        //           onConfirm={() => {
        //             this.onDelete(record);
        //           }}
        //           okText="是"
        //           cancelText="否">
        //           <a href="#"><DelIcon /></a>
        //         </Popconfirm>
        //       </Tooltip>
        //     </>
        //   }
        // },
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
        ParamBegin: this.state.ParamBegin ? moment(this.state.ParamBegin).format('YYYY-MM-DD 00:00:00') : undefined,
        ParamEnd: this.state.ParamEnd ? moment(this.state.ParamEnd).format('YYYY-MM-DD 23:59:59') : undefined,
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
          ExpressNews: {
            ...values,
            NewsTime: moment(values.NewsTime)
            // SamplingCode: this.state.editData.SamplingCode
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

    const title = '快报信息';

    return (
      <Card bodyStyle={{ paddingBottom: 20, paddingTop: 10, overflow: 'auto', height: 'calc(100vh - 200px)' }} title="现场调查信息" extra={
        <Space>
          <Button onClick={() => history.back()}>返回</Button>
        </Space>
      }>
        <Row
          style={{ marginTop: 10, marginBottom: 20 }}
        >
          <Space align="baseline" size={40}>
            <div>
              报告人：
              <Input allowClear style={{ width: 200 }} placeholder='请输入报告人' onChange={(e) => {
                this.setState({ ParamName: e.target.value })
              }} />
            </div>
            <div>
              报告人：
              <RangePicker allowClear style={{ width: 300 }} onChange={(date, dataString) => {
                if(date) {
                  this.setState({ ParamBegin: date[0], ParamEnd: date[1] })
                }else{
                  this.setState({ ParamBegin: undefined, ParamEnd: undefined })
                }
              }} />
            </div>
          </Space>
          <Space align="baseline" style={{ marginLeft: 10 }}>
            <Button type="primary" onClick={this.getTableList}>查询</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => this.setState({ isModalVisible: true, editData: {}, hasEdit: false })}>添加</Button>
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
            // name="global_state"
            {...layout}
            // layout='inline'
            ref={this.formRef}
            // onFinish={this.onFinish}
            initialValues={{
              DeathNum: 0,
              SeriousInjury: 0,
              MinorWound: 0,
              EconomicLoss: 0,
              NewsPerson: JSON.parse(Cookie.get('currentUser')).UserName,
              NewsTime: moment().format("YYYY-MM-DD HH:mm:ss"),
            }}
          >
            <Row>发                              
              <Col span={12}>
                <Form.Item
                  name="DeathNum"
                  label="死亡（人）"
                  rules={[{ required: true, message: '死亡人数不能为空!' }]}
                >
                  <InputNumber placeholder="请输入死亡（人）" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="SeriousInjury"
                  label="重伤（人）"
                  rules={[{ required: true, message: '重伤人不能为空!' }]}
                >
                  <InputNumber placeholder="请填写重伤（人）" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="MinorWound"
                  label="轻伤（人）"
                  rules={[{ required: true, message: '轻伤人不能为空!' }]}
                >
                  <InputNumber placeholder="请填写轻伤（人）" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="EconomicLoss"
                  label="经济损失（万）"
                  rules={[{ required: true, message: '经济损失不能为空!' }]}
                >
                  <InputNumber placeholder="请填写经济损失（万）" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="NewsPerson"
                  label="快报人"
                  rules={[{ required: true, message: '快报人不能为空!' }]}
                >
                  <Input placeholder="请填写快报人" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="NewsTime"
                  label="快报时间"
                  rules={[{ required: true, message: '请填写标准值上限!' }]}
                >
                  {/* <DatePicker showTime /> */}
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 19 }}
                  name="NewsCondition"
                  label="目前处理情况"
                  rules={[{ required: true, message: '请填写目前处理情况!' }]}
                >
                  <TextArea placeholder="请填写目前处理情况" style={{ width: '100%' }} />
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