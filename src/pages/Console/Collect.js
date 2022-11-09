import React, { PureComponent } from 'react'
import {
  Card, Button, Popconfirm, Tooltip,
  Tag, Divider, Space, Modal, Form, Input, Select,
  Radio, InputNumber, Spin, List, Badge
} from 'antd'
import SdlTable from '@/components/SdlTable'
import {
  ExclamationCircleOutlined, MinusCircleOutlined, SyncOutlined, CloseCircleOutlined,
  PauseCircleOutlined, PlayCircleOutlined, RetweetOutlined
} from '@ant-design/icons'
import { EditIcon, DetailIcon, DelIcon } from '@/utils/icon'
import { CONST } from '@/utils/console-utils';
import { connect } from 'dva'

const { TextArea } = Input;
const { confirm } = Modal;

@connect(({ console, loading }) => ({
  restartLoading: loading.effects['console/RestartCollect'],
  // serverSetList: console.serverSetList,
  // transferConfig: console.transferConfig,
}))
class Collect extends PureComponent {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      serverSetList: [],
      collectClients: [],
      transferConfig: [],
      selectRow: {},
      isSocketModalOpen: false,
      isProtocolModalOpen: false,
      isConnectModalOpen: false,
      columns: [
        {
          title: 'IP',
          dataIndex: 'ip',
          key: 'ip',
        },
        {
          title: '端口',
          dataIndex: 'port',
          key: 'port',
        },
        {
          title: '协议',
          dataIndex: 'anayticeName',
          key: 'anayticeName',
          width: 200,
          render: (text, record) => {
            let anayticeName = CONST.agreement.find(item => item.value === text).key;
            return anayticeName;
          },
        },
        {
          title: '运行情况',
          dataIndex: 'serverStatus',
          key: 'serverStatus',
          render: (text, record) => {
            return this.getStatus(text, record.statusMessage);
          },
        },
        {
          title: '运行时长',
          dataIndex: 'runTimeLong',
          key: 'runTimeLong',

        },
        {
          title: '连接数',
          dataIndex: 'count',
          key: 'count',
          render: (text, record) => {
            if (record.collectClients && record.collectClients.length) {
              return <Tooltip title="点击查看连接详情">
                <a onClick={() => this.setState({ isConnectModalOpen: true, collectClients: record.collectClients })}>
                  {record.collectClients.length}
                </a>
              </Tooltip>
            }
            return 0;
          }
        },
        {
          title: '操作',
          render: (text, record, index) => {
            // if (record.status === 0) {
            //   return <Tooltip title='运行'>
            //     <a href="#">
            //       <PlayCircleOutlined style={{ fontSize: 18 }} />
            //     </a>
            //   </Tooltip>
            // } else {
            //   return <Tooltip title='停止'>
            //     <a href="#">
            //       <PauseCircleOutlined style={{ fontSize: 18 }} />
            //     </a>
            //   </Tooltip>
            // }
            return <>
              <Tooltip title="编辑">
                <a onClick={() => {
                  this.setState({
                    selectRow: record,
                    selectIndex: index,
                    isSocketModalOpen: true
                  })
                }}><EditIcon /></a>
              </Tooltip>
              <Divider type="vertical" />
              <Tooltip title="删除">
                <Popconfirm
                  placement="left"
                  title="确认是否删除?"
                  onConfirm={() => {
                    this.delRowData(index);
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
      columns2: [
        {
          title: '新协议',
          dataIndex: 'new',
          key: 'new',
          ellipsis: true,
          render: (text, record) => {
            let content = text.toString();
            return <div>
              <Tooltip title={content}>
                {content}
              </Tooltip>
            </div>
          }
        },
        {
          title: '旧协议',
          dataIndex: 'old',
          key: 'old',
          ellipsis: true,
          render: (text, record) => {
            let content = text.toString();
            return <Tooltip title={content}>
              {content}
            </Tooltip>
          }
        },
        {
          title: '关联的排口',
          dataIndex: 'devicecode',
          key: 'devicecode',
          // width: 200,
          ellipsis: true,
          render: (text, record) => {
            let content = text.toString();
            return <Tooltip title={content}>
              {content}
            </Tooltip>
          },
        },
        {
          title: '操作',
          width: 80,
          render: (text, record, index) => {
            return <>
              <Tooltip title="编辑">
                <a onClick={() => {
                  this.setState({
                    selectRow: record,
                    selectIndex: index,
                    isProtocolModalOpen: true
                  })
                }}><EditIcon /></a>
              </Tooltip>
              <Divider type="vertical" />
              <Tooltip title="删除">
                <Popconfirm
                  placement="left"
                  title="确认是否删除?"
                  onConfirm={() => {
                    this.delRowData2(index);
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
    };
  }

  componentDidMount() {
    this.getPageData();
  }

  // 获取页面数据
  getPageData = () => {
    this.props.dispatch({
      type: 'console/GetConsulConfig',
      callback: (res) => {
        let serverSetList = res.serverSetList;
        let transferConfig = res.transferConfig;
        this.setState({
          serverSetList, transferConfig
        })
      }
    })
  }

  // 重启
  onRestart = () => {
    this.props.dispatch({
      type: 'console/RestartCollect',
      callback: () => {
        this.getPageData();
      }
    })
  }

  // 获取企业和排口
  getEntAndPointList = () => {
    this.props.dispatch({
      type: "common/getEntAndPointList",
      payload: { "Status": [], "RunState": "1", "PollutantTypes": "1,2" }
    })
  }

  // 行删除
  delRowData = (index) => {
    let newData = [...this.state.serverSetList];
    newData.splice(index, 1);
    this.setState({
      serverSetList: newData
    }, () => {
      this.updateConsulConfig();
    })
  }

  // 行删除
  delRowData2 = (index) => {
    let newData = [...this.state.transferConfig];
    newData.splice(index, 1);
    this.setState({
      transferConfig: newData
    }, () => {
      this.updateConsulConfig();
    })
  }

  // 更新采集数据
  updateConsulConfig = () => {
    let that = this;
    this.props.dispatch({
      type: "console/UpdateConsulConfig",
      payload: {
        monitorServerSetting: this.state.serverSetList,
        transferConfig: this.state.transferConfig,
        crcVerification: false,
      },
      callback: (res) => {
        this.onCloseModal();
        confirm({
          title: '操作成功，是否重启？',
          icon: <ExclamationCircleOutlined />,
          content: '修改后，重启才会生效！',
          onOk() {
            that.onRestart();
          },
          onCancel() {
          },
        });
      }
    })
  }

  getStatus = (status, desc) => {
    let el = '';
    switch (status) {
      case 1:
        el = <Tag icon={<MinusCircleOutlined />} color="default">
          停止
        </Tag>
        break;
      case 0:
        el = <Tag icon={<SyncOutlined spin />} color="processing">
          正常
        </Tag>
        break;
      // case 2:
      //   el = <Tag icon={<ExclamationCircleOutlined />} color="warning">
      //     异常
      //   </Tag>
      //   break;
      // case 3:
      //   el = <Tag icon={<CloseCircleOutlined />} color="error">
      //     错误
      //   </Tag>
      //   break;
    }

    return <Tooltip title={desc}>
      {el}
    </Tooltip>
  }

  getCardTitle = () => {
    return <>
      <div className="ant-card-head-title" style={{ padding: 0 }}>
        Socket连接
        <div style={{ marginTop: 10 }}>
          <Space>
            <Button type='primary' onClick={() => {
              this.setState({ isSocketModalOpen: true });
            }}>添加</Button>
          </Space>
        </div>
      </div>
    </>
  }

  getCardTitle2 = () => {
    return <>
      <div className="ant-card-head-title" style={{ padding: 0 }}>
        新老协议转换
        <div style={{ marginTop: 10 }}>
          <Space>
            <Button type='primary' onClick={() => {
              this.setState({ isProtocolModalOpen: true });
            }}>添加</Button>
          </Space>
        </div>
      </div>
    </>
  }

  // 关闭弹窗
  onCloseModal = () => {
    this.setState({
      isSocketModalOpen: false,
      isProtocolModalOpen: false,
      isConnectModalOpen: false,
      selectRow: {},
    })
  }

  onSubmitForm = () => {
    this.formRef.current.validateFields().then((values) => {
      console.log("values=", values)
      const { selectRow, selectIndex, serverSetList } = this.state;
      let _serverSetList = [...serverSetList];
      // 编辑
      if (Object.keys(selectRow).length) {
        _serverSetList[selectIndex] = values;
      } else {
        // 添加
        _serverSetList.push(values);
      }
      this.setState({
        serverSetList: [
          ..._serverSetList,
        ]
      }, () => {
        this.updateConsulConfig();
      })
    })
  }

  onSubmitForm2 = () => {
    this.formRef.current.validateFields().then((values) => {
      console.log("values=", values);
      // return;
      const { selectRow, selectIndex, transferConfig } = this.state;
      let _transferConfig = [...transferConfig];
      // 编辑
      if (Object.keys(selectRow).length) {
        _transferConfig[selectIndex] = values;
      } else {
        // 添加
        _transferConfig.push(values);
      }
      this.setState({
        transferConfig: [
          ..._transferConfig,
        ]
      }, () => {
        this.updateConsulConfig();
      })
    })
  }

  render() {
    const {
      columns, columns2, isSocketModalOpen, isConnectModalOpen, isProtocolModalOpen,
      selectRow, serverSetList, transferConfig, isRestartVisible, collectClients
    } = this.state;
    const { restartLoading } = this.props;
    const CardTitle = this.getCardTitle;
    const CardTitle2 = this.getCardTitle2;

    console.log('restartLoading=', restartLoading)
    return (
      <Spin spinning={!!restartLoading}>
        <Popconfirm
          title="确认是否重启?"
          onConfirm={this.onRestart}
          okText="确认"
          cancelText="取消"
        >
          <Button type="primary" icon={<RetweetOutlined />} danger style={{ marginBottom: 16 }}>
            重启
          </Button>
        </Popconfirm>

        <Card title={<CardTitle />}>
          <SdlTable dataSource={serverSetList} columns={columns} />
        </Card>
        <Card title={<CardTitle2 />} style={{ marginTop: 16 }}>
          <SdlTable defaultWidth={200} dataSource={transferConfig} columns={columns2} />
        </Card>
        <Modal title="Socket连接"
          maskClosable={false}
          destroyOnClose visible={isSocketModalOpen} onOk={this.onSubmitForm} onCancel={this.onCloseModal}>
          <Form
            name="socket"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}
            ref={this.formRef}
            layout="horizontal"
            scrollToFirstError
            initialValues={selectRow}
          >
            <Form.Item
              label="IP"
              name="ip"
              rules={[{ required: true, message: '请输入ip!' }]}
            >
              <Input placeholder="请输入ip" maxLength={10} />
            </Form.Item>
            <Form.Item
              label="端口"
              name="port"
              rules={[{ required: true, message: '请输入端口!' }]}
            >
              <InputNumber style={{ width: '100%' }} placeholder="请输入端口" />
            </Form.Item>
            <Form.Item
              label="协议"
              name="anayticeName"
              rules={[{ required: true, message: '请选择协议!' }]}
            >
              <Select placeholder="请选择协议">
                {
                  CONST.agreement.map(item => {
                    return <Select.Option value={item.value} key={item.value}>{item.key}</Select.Option>
                  })
                }
              </Select>
            </Form.Item>
            <Form.Item
              label="是否应答"
              name="isAnswer"
              rules={[{ required: true }]}
            >
              <Radio.Group>
                <Radio key={1} value={true}>是</Radio>
                <Radio key={0} value={false}>否</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              label="是否转发"
              name="isTransmit"
              rules={[{ required: true }]}
            >
              <Radio.Group>
                <Radio key={1} value={true}>是</Radio>
                <Radio key={0} value={false}>否</Radio>
              </Radio.Group>
            </Form.Item>
          </Form>
        </Modal>
        {/* 新老协议转换 */}
        <Modal title="新老协议转换"
          maskClosable={false}
          destroyOnClose visible={isProtocolModalOpen} onOk={this.onSubmitForm2} onCancel={this.onCloseModal}>
          <Form
            name="protocol"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}
            ref={this.formRef}
            layout="horizontal"
            scrollToFirstError
            initialValues={{
              ...selectRow,
            }}
          >
            <Form.Item
              label="新协议"
              name="new"
              rules={[{ required: true, message: '请输入新协议!' }]}
            >
              <Select placeholder="请选择协议" mode="tags">
              </Select>
            </Form.Item>
            <Form.Item
              label="旧协议"
              name="old"
              rules={[{ required: true, message: '请输入旧协议!' }]}
            >
              <Select placeholder="请选择协议" mode="tags">
              </Select>
            </Form.Item>
            <Form.Item
              label="关联排口"
              name="devicecode"
              rules={[{ required: true, message: '关联排口!' }]}
            >
              <Select placeholder="请选择关联排口" mode="tags">
              </Select>
            </Form.Item>
          </Form>
        </Modal>
        <Modal title="连接详情"
          maskClosable={false}
          destroyOnClose visible={isConnectModalOpen} footer={false} onCancel={this.onCloseModal}>
          <List
            bordered
            dataSource={collectClients}
            renderItem={(item, index) => (
              <List.Item>
                <Badge status="processing" text={item} />
              </List.Item>
            )}
          />
        </Modal>
      </Spin>
    );
  }
}

export default Collect;