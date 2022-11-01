import React, { PureComponent } from 'react'
import { Card, Row, Col, Button, Modal, Form, InputNumber, Input, Select, Radio, message, Popconfirm, Tooltip, Divider } from 'antd';
import { PlusOutlined, PlaySquareOutlined, VideoCameraOutlined } from '@ant-design/icons'
import SdlTable from '@/components/SdlTable'
import SdlMap from '@/pages/AutoFormManager/SdlMap';
import { connect } from 'dva'
import { DelIcon, EditIcon } from '@/utils/icon'
import LiveVideo from '@/components/Video/LiveVideo'

const VideoType = [{
  key: '萤石云',
  value: 1,
}, {
  key: '乐橙云',
  value: 2,
}, {
  key: '私有云',
  value: 3,
}, {
  key: '海康网站',
  value: 4,
}, {
  key: '大华网站',
  value: 5,
}]

@connect(({ loading, video }) => ({
  // validateLoading: loading.effects['video/validateVideo'],
  tableLoading: loading.effects['video/getVideoList'],
  modalLoading: loading.effects['video/AddVideoDevice', 'video/validateVideo'],
  videoManagerList: video.videoManagerList,
  videoManagerEditData: video.videoManagerEditData,
}))
class PageContent extends PureComponent {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      InputType: 1,
      isModalOpen: false,
      editData: {},
      currentVideo: {},
    };

    this.SELF = {
      columns1: [
        {
          title: '摄像头名称',
          dataIndex: 'VedioCamera_Name',
          key: 'VedioCamera_Name',
        },
        {
          title: '摄像头序列号',
          dataIndex: 'VedioCamera_No',
          key: 'VedioCamera_No',
        },
        {
          title: '接入方式',
          dataIndex: 'InputType',
          key: 'InputType',
          render: (text) => {
            let current = VideoType.find(item => item.value === text);
            return current.key;
          }
        },
        {
          title: '是否显示云台',
          dataIndex: 'IsShowControl',
          key: 'IsShowControl',
          render: (text) => {
            return text === 1 ? '是' : '否'
          }
        },
        {
          title: '通道号',
          dataIndex: 'ChannelNo',
          key: 'ChannelNo',
        },
        {
          title: '经度',
          dataIndex: 'Latitude',
          key: 'Latitude',
        },
        {
          title: '纬度',
          dataIndex: 'Longitude',
          key: 'Longitude',
        },
        {
          title: '操作',
          key: 'handle',
          render: (text, record) => {
            return <>
              <Tooltip title="编辑">
                <a onClick={() => this.getEditData(record.VedioCamera_ID)}><EditIcon /></a>
              </Tooltip>
              <Divider type="vertical" />
              <Tooltip title="删除">
                <Popconfirm
                  placement="left"
                  title="确认是否删除?"
                  onConfirm={() => {
                    this.DeleteVideoDeviceOne(record.VedioCamera_ID);
                  }}
                  okText="是"
                  cancelText="否">
                  <a href="#"><DelIcon /></a>
                </Popconfirm>
              </Tooltip>
              <Divider type="vertical" />
              <Tooltip title="播放">
                <a onClick={() => this.onPreview(record)}>
                  <VideoCameraOutlined />
                </a>
              </Tooltip>
            </>
          }
        },
      ],
      columns2: [
        {
          title: '摄像头名称',
          dataIndex: 'VedioCamera_Name',
          key: 'VedioCamera_Name',
        },
        {
          title: '序列号',
          dataIndex: 'VedioCamera_No',
          key: 'VedioCamera_No',
        },
        {
          title: '接入方式',
          dataIndex: 'InputType',
          key: 'InputType',
          render: (text) => {
            let current = VideoType.find(item => item.value === text);
            return current.key;
          }
        },
        {
          title: '是否显示云台',
          dataIndex: 'IsShowControl',
          key: 'IsShowControl',
          render: (text) => {
            return text === 1 ? '是' : '否'
          }
        },
        {
          title: '通道号',
          dataIndex: 'ChannelNo',
          key: 'ChannelNo',
        },
        {
          title: 'IP',
          dataIndex: 'IP',
          key: 'IP',
        },
        {
          title: '端口',
          dataIndex: 'Device_Port',
          key: 'Device_Port',
        },
        {
          title: '用户名',
          dataIndex: 'User_Name',
          key: 'User_Name',
        },
        {
          title: '用户密码',
          dataIndex: 'User_Pwd',
          key: 'User_Pwd',
        },
        {
          title: '经度',
          dataIndex: 'Latitude',
          key: 'Latitude',
        },
        {
          title: '纬度',
          dataIndex: 'Longitude',
          key: 'Longitude',
        },
        {
          title: '操作',
          key: 'handle',
          render: (text, record) => {
            return <>
              <Tooltip title="编辑">
                <a onClick={() => this.getEditData(record.VedioCamera_ID)}><EditIcon /></a>
              </Tooltip>
              <Divider type="vertical" />
              <Tooltip title="删除">
                <Popconfirm
                  placement="left"
                  title="确认是否删除?"
                  onConfirm={() => {
                    this.DeleteVideoDeviceOne(record.VedioCamera_ID);
                  }}
                  okText="是"
                  cancelText="否">
                  <a href="#"><DelIcon /></a>
                </Popconfirm>
              </Tooltip>
              <Divider type="vertical" />
              <Tooltip title="播放">
                <a onClick={() => this.onPreview(record)}>
                  <PlaySquareOutlined />
                </a>
              </Tooltip>
            </>
          }
        }
      ]
    }
  }

  componentDidMount() {
    this.getVideoList();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.videoManagerEditData !== prevProps.videoManagerEditData) {
      this.setState({
        InputType: this.props.videoManagerEditData.InputType,
        editData: this.props.videoManagerEditData,
        isModalOpen: true
      })
    }

    if (this.props.DGIMN !== prevProps.DGIMN) {
      this.getVideoList();
    }
  }

  // 表单提交
  onSubmit = () => {
    this.formRef.current.validateFields().then((values) => {
      console.log("values=", values)
      if (values.InputType === 1 || values.InputType === 2) {
        this.validateVideo(values)
      } else {
        this.onAddOrUpdate(values)
      }
    })
  }

  // 验证序列号是否正确
  validateVideo = (values) => {
    this.props.dispatch({
      type: 'video/validateVideo',
      payload: {
        Type: values.InputType === 1 ? 'ysy' : 'lecheng',
        SerialNumber: values.VedioCamera_No,
        Appkey: values.AppKey,
        Secret: values.AppSecret,
        Dgimn: this.props.Dgimn,
        ChannelNo: values.ChannelNo,
      },
      callback: () => {
        this.onAddOrUpdate(values);
      }
    })
  }

  // 添加或更新视频设备
  onAddOrUpdate = (values) => {
    let isEdit = this.state.editData.VedioCamera_ID;
    let actionType = isEdit ? 'video/UpdateVideoDeviceOne' : 'video/AddVideoDevice';
    this.props.dispatch({
      type: actionType,
      payload: {
        DGIMN: this.props.DGIMN,
        IsShowHomePage: values.IsShowHomePage,
        Data: {
          VedioCamera_ID: this.state.editData.VedioCamera_ID,
          ...values,
        }
      },
      callback: () => {
        message.success('保存成功！');
        this.onCloseModal();
        this.getVideoList();
      }
    })
  }

  // 获取摄像头列表
  getVideoList = () => {
    this.props.dispatch({
      type: 'video/getVideoList',
      payload: {
        DGIMN: this.props.DGIMN,
        Type: "manager"
      }
    })
  }

  // 删除
  DeleteVideoDeviceOne = (VideoId) => {
    this.props.dispatch({
      type: 'video/DeleteVideoDeviceOne',
      payload: {
        DGIMN: this.props.DGIMN,
        VideoId: VideoId,
        Type: "manager"
      },
      callback: () => {
        this.getVideoList();
      }
    })
  }

  // 弹窗关闭
  onCloseModal = () => {
    this.setState({
      isModalOpen: false,
      isPreviewModalOpen: false
    })
  }

  // 获取单个设备信息
  getEditData = (VideoId) => {
    // this.setState({ isModalOpen: true })
    this.props.dispatch({
      type: 'video/GetVideoDeviceOne',
      payload: {
        DGIMN: this.props.DGIMN,
        VideoId: VideoId,
        Type: "manager"
      }
    })
  }

  renderFormItem = () => {
    const { InputType } = this.state;
    // 萤石云 AND 乐橙云
    if (InputType === 1 || InputType === 2) {
      return <>
        <Col span={12}>
          <Form.Item
            label="AppKey"
            name="AppKey"
            rules={[
              {
                required: true,
                message: '请输入AppKey!',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="AppSecret"
            name="AppSecret"
            rules={[
              {
                required: true,
                message: '请输入AppSecret!',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="摄像头序列号"
            name="VedioCamera_No"
            rules={[
              {
                required: true,
                message: '请输入摄像头序列号!',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="摄像头厂商"
            name="Productor"
            rules={[
              {
                required: true,
                message: '请选择摄像头厂商!',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            label="是否显示在首页"
            name="IsShowHomePage"
            labelCol={{
              span: 4,
            }}
            wrapperCol={{
              span: 20,
            }}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Radio.Group>
              <Radio value={1}>是</Radio>
              <Radio value={0}>否</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>

      </>
    }

    // 私有云
    if (InputType === 3) {
      return <>
        {/* <Col span={12}>
          <Form.Item
            label="IP"
            name="IP"
            rules={[
              {
                required: true,
                message: '请输入IP!',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="端口"
            name="Device_Port"
            rules={[
              {
                required: true,
                message: '请输入端口!',
              },
            ]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col> */}
        <Col span={12}>
          <Form.Item
            label="序列号"
            name="VedioCamera_No"
            rules={[
              {
                required: true,
                message: '请输入序列号!',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="是否显示在首页"
            name="IsShowHomePage"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Radio.Group>
              <Radio value={1}>是</Radio>
              <Radio value={0}>否</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
      </>
    }

    // IE海康和IE大华
    if (InputType === 4 || InputType === 5) {
      return <>
        <Col span={12}>
          <Form.Item
            label="IP"
            name="IP"
            rules={[
              {
                required: true,
                message: '请输入IP!',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="端口"
            name="Device_Port"
            rules={[
              {
                required: true,
                message: '请输入端口!',
              },
            ]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="用户名称"
            name="User_Name"
            rules={[
              {
                required: true,
                message: '请输入用户名称!',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="用户密码"
            name="User_Pwd"
            rules={[
              {
                required: true,
                message: '请输入用户密码!',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        {
          InputType === 5 && <Col span={24}>
            <Form.Item
              label="RTSP端口"
              name="RTSPPort"
              labelCol={{
                span: 4,
              }}
              wrapperCol={{
                span: 20,
              }}
              rules={[
                {
                  required: true,
                  message: '请输入RTSP端口!',
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        }
      </>
    }
  }

  // 预览视频
  onPreview = (record) => {
    this.setState({
      isPreviewModalOpen: true,
      currentVideo: record
    })
  }

  render() {
    const { validateLoading, videoManagerList, modalLoading, tableLoading } = this.props;
    const { isModalOpen, editData, isPreviewModalOpen, currentVideo } = this.state;
    const { columns1, columns2 } = this.SELF;
    let Longitude = "", Latitude = "", InputType = 1;
    if (this.formRef.current) {
      const fieldsValue = this.formRef.current.getFieldsValue();
      Longitude = fieldsValue.Longitude;
      Latitude = fieldsValue.Latitude;
      InputType = fieldsValue.InputType;
    }
    console.log('InputType=', InputType);
    return (
      <>
        <Card>
          <Row style={{ marginBottom: 10 }}>
            <Button type='primary' icon={<PlusOutlined />} onClick={() => this.setState({ isModalOpen: true, editData: {} })}>添加</Button>
          </Row>
          {videoManagerList.one.length ?
            <SdlTable rowKey="VedioCamera_ID" loading={tableLoading} style={{ marginBottom: 10 }} dataSource={videoManagerList.one} columns={columns1} /> :
            <SdlTable rowKey="VedioCamera_ID" loading={tableLoading} dataSource={videoManagerList.two} columns={columns2} />}
        </Card>
        <Modal
          width="800px"
          title="摄像头管理"
          visible={isModalOpen}
          onOk={this.onSubmit}
          onCancel={this.onCloseModal}
          confirmLoading={modalLoading}
          destroyOnClose
          maskClosable={false}
        >
          <Form
            name="basic"
            ref={this.formRef}
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            initialValues={{
              InputType: 1,
              RTSPPort: 80,
              IsShowControl: 0,
              IsShowHomePage: 0,
              ...editData,
            }}
            // onFinish={onFinish}
            // onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Row>
              <Col span={12}>
                <Form.Item
                  label="接入方式"
                  name="InputType"
                  rules={[
                    {
                      required: true,
                      message: '请选择接入方式!',
                    },
                  ]}
                >
                  <Select placeholder="请选择接入方式" onChange={(value) => this.setState({ InputType: value })}>
                    {
                      VideoType.map(item => {
                        return <Option value={item.value}>{item.key}</Option>
                      })
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="是否显示云台"
                  name="IsShowControl"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Radio.Group>
                    <Radio value={1}>是</Radio>
                    <Radio value={0}>否</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="视频设备名称"
                  name="VedioCamera_Name"
                  rules={[
                    {
                      required: true,
                      message: '请输入视频设备名称!',
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="摄像头通道号"
                  name="ChannelNo"
                  rules={[
                    {
                      required: true,
                      message: '请输入摄像头通道号!',
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              {this.renderFormItem()}
              <Col span={12}>
                <Form.Item
                  label="经度"
                  name="Latitude"
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
                  label="纬度"
                  name="Longitude"
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
                  label="摄像头位置"
                  name="VedioCamera_Position"
                  labelCol={{
                    span: 4,
                  }}
                  wrapperCol={{
                    span: 20,
                  }}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
        <Modal
          width="800px"
          title="视频预览"
          visible={isPreviewModalOpen}
          onCancel={this.onCloseModal}
          destroyOnClose
          maskClosable={false}
          footer={null}
          bodyStyle={{ height: '70vh', padding: 10 }}
        >
          <LiveVideo videoInfo={currentVideo} />
        </Modal>
      </>
    );
  }
}

export default PageContent;