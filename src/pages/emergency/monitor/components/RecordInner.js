import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Card, Form, Input, Button, Space, Tooltip, Popconfirm, Modal, Row, Col, Tag, InputNumber, Divider, Select, DatePicker } from 'antd'
import SdlTable from '@/components/SdlTable'
import { DelIcon, EditIcon } from '@/utils/icon'
import { connect } from 'dva'

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 },
};
@connect(({ loading, emergency }) => ({
  dictionaryList: emergency.dictionaryList,
}))
class RecordInner extends PureComponent {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      divisorList: [],
      dataSource: this.props.editData ? this.props.editData.RealDataList : [],
    };
    this._SELF_ = {
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
          title: '因子编码',
          dataIndex: 'PollutantCode',
          key: 'PollutantCode',
        },
        // {
        //   title: '因子名称',
        //   dataIndex: 'PollutantCode',
        //   key: 'PollutantName',
        //   render: (text, record) => {
        //     let filterItem = this.state.divisorList.find(item => item.SamplingPolCode == text);
        //     if (filterItem) {
        //       return filterItem.SamplingName ? filterItem.SamplingName : '-'
        //     } else {
        //       return '-'
        //     }
        //   }
        // },
        {
          title: '监测值',
          dataIndex: 'MonitorValue',
          key: 'MonitorValue',
        },
        {
          title: '是否超标',
          dataIndex: 'IsOver',
          key: 'IsOver',
          render: (text, record) => {
            return text == 1 ? <Tag color="error">超标</Tag> : <Tag color="success">未超标</Tag>
          }
        },
        {
          title: '操作',
          key: 'handle',
          render: (text, record, index) => {
            return <>
              <Tooltip title="删除">
                <Popconfirm
                  placement="left"
                  title="确认是否删除?"
                  onConfirm={() => {
                    let _dataSource = [...this.state.dataSource];
                    _dataSource.splice(index, 1);
                    this.setState({
                      dataSource: _dataSource
                    }, () => {
                      this.props.onOk && this.props.onOk(this.state.dataSource);
                    })
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
    this.getDivisorList();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.editData !== this.props.editData) {
      this.setState({
        editData: this.props.editData,
        dataSource: this.props.editData.RealDataList
      })
    }
  }

  // 获取因子数据
  getDivisorList = () => {
    this.props.dispatch({
      type: 'emergency/getTableList',
      payload: {
        AlarmInfoCode: this.props.AlarmInfoCode,
        Type: 13,
      },
      callback: (res) => {
        this.setState({
          divisorList: res
        })
      }
    })
  }

  onCancel = () => {
    this.setState({ isModalVisible: false })
  }

  // 保存
  onAddSubmit = () => {
    this.formRef.current.validateFields().then((values) => {
      let RealDataList = [...this.state.dataSource];
      RealDataList.push(values)
      this.setState({ isModalVisible: false, dataSource: RealDataList },
        () => {
          this.props.onOk && this.props.onOk(this.state.dataSource);
        })
    })
  }

  render() {
    const { columns } = this._SELF_;
    const { isModalVisible, divisorList, dataSource, editData } = this.state;
    const { dictionaryList } = this.props;
    console.log('this.props=', this.props)
    console.log('this.state=', this.state)
    let title = "新增";
    return (
      <Card
        type="inner"
        size="small"
        bordered={false}
        style={{ marginTop: 10 }}
        extra={<Button type="primary" onClick={() => this.setState({ isModalVisible: true, editData: {}, hasEdit: false })}>添加</Button>}
        title="监测数据"
      >
        <SdlTable columns={columns} dataSource={dataSource} pagination={false} />
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
              // ...editData
            }}
          >
            <Row>
              <Col span={12}>
                <Form.Item
                  name="PollutantCode"
                  label="因子"
                  rules={[{ required: true, message: '请选择因子!' }]}
                >
                  <Select placeholder="请选择因子">
                    {
                      divisorList.map(item => {
                        return <Option value={item.SamplingPolCode} key={item.SamplingPolCode}>{item.SamplingName}</Option>
                      })
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="MonitorValue"
                  label="监测值"
                  rules={[{ required: true, message: '请填写监测值!' }]}
                >
                  <Input placeholder="请输入监测值" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="IsOver"
                  label="是否超标"
                >
                  <Select placeholder="是否超标">
                    <Option value={1} key={1}>是</Option>
                    <Option value={0} key={0}>否</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </Card>
    );
  }
}

export default RecordInner;