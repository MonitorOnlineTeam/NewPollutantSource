import React, { PureComponent } from 'react'
import {
  Card, Button, Popconfirm, Tooltip,
  Tag, Divider, Space, Modal, Form, Input, Select,
  Radio, InputNumber, Spin, List, Badge, TreeSelect
} from 'antd'
import SdlTable from '@/components/SdlTable'
import {
  ExclamationCircleOutlined, MinusCircleOutlined, SyncOutlined, CloseCircleOutlined,
  PauseCircleOutlined, PlayCircleOutlined, RetweetOutlined, ReloadOutlined
} from '@ant-design/icons'
import { EditIcon, DetailIcon, DelIcon } from '@/utils/icon'
import { CONST } from '@/utils/console-utils';
import { connect } from 'dva'

const { TextArea } = Input;
const { confirm } = Modal;

@connect(({ console, loading }) => ({
  restartLoading: loading.effects['console/RestartCollect'],
  entAndPointList: console.entAndPointList,
  agreementList: console.agreementList,
  DGIMNList: console.DGIMNList,
  DGIMNListSearchLoading: loading.effects['console/GetRemotePoint'],
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
          title: '协议名称',
          dataIndex: 'anayticeDisplayName',
          key: 'anayticeDisplayName',
          width: 200,
        },
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
          width: 200,
          render: (text, record) => {
            if (record.collectClients && record.collectClients.length) {
              return <div>
                <Tooltip title="点击查看连接详情">
                  <Tag color="processing"
                    onClick={() =>
                      this.setState({ isConnectModalOpen: true, currentAddress: record.ip + '-' + record.port, collectClients: record.collectClients })
                    }
                  >连接数：{record.collectClients.length}</Tag>
                </Tooltip>
                <Tag color="#108ee9"
                  onClick={() => {
                    this.setState({
                      isDGIMNListModalOpen: true,
                      currentAddress: record.ip + '-' + record.port,
                    }, () => {
                      this.GetRemotePoint()
                    })
                  }}
                >查看排口</Tag>
                {/* <Button size='small' type='primary' style={{ marginLeft: 40 }}>查看排口</Button> */}
              </div>
            }
            return <Tag color="processing">连接数：0</Tag>
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
              <Tooltip title="重启">
                <Popconfirm
                  placement="left"
                  title="确认是否重启?"
                  onConfirm={() => {
                    this.onRestart(`${record.ip}-${record.port}`);
                  }}
                  okText="是"
                  cancelText="否">
                  <a>
                    <ReloadOutlined style={{ fontSize: 14 }} />
                  </a>
                </Popconfirm>
              </Tooltip>
              <Divider type="vertical" />
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
          dataIndex: 'points',
          key: 'points',
          // width: 200,
          ellipsis: true,
          render: (text, record) => {
            let content = <div>
              {
                text.map(item => {
                  let value = item.dgmin;
                  if (item.entName && item.pointCode) {
                    value = item.entName + "-" + item.pointName
                  }
                  return <Tag>{value}</Tag>
                })
              }
            </div>;
            if (text && text.length) {
              return <Tooltip title={content}>
                {content}
              </Tooltip>
            }
            return '-'
          },
        },
        {
          title: '操作',
          width: 80,
          render: (text, record, index) => {
            return <>

              <Tooltip title="编辑">
                <a onClick={() => {
                  let selectRow = record;
                  selectRow.devicecode = record.points.map(item => item.dgmin)
                  console.log('record', record)
                  this.setState({
                    selectRow: selectRow,
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
      ],
      columns3: [
        {
          title: '企业',
          dataIndex: 'entName',
          key: 'entName',
          render: (text) => {
            return text || '-'
          }
        },
        {
          title: '污染物类型',
          dataIndex: 'pollutantName',
          key: 'pollutantName',
          render: (text) => {
            return text || '-'
          }
        },
        {
          title: '排口',
          dataIndex: 'pointName',
          key: 'pointName',
          render: (text) => {
            return text || '-'
          }
        },
        {
          title: 'DGIMN',
          dataIndex: 'dgmin',
          key: 'dgmin',
          render: (text) => {
            return text || '-'
          }
        },
        {
          title: '链接地址',
          dataIndex: 'remoteEndPoint',
          key: 'remoteEndPoint',
        },
      ]
    };
  }

  componentDidMount() {
    this.getPageData();
    this.getPointList();
    this.getAnayticeList();
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

  // 获取连接数详情
  GetRemotePoint = (values = {}) => {
    this.props.dispatch({
      type: 'console/GetRemotePoint',
      payload: {
        localEndPoint: this.state.currentAddress,
        // remoteEndPoint: this.state.remoteEndPoint,
        pointName: values.pointName,
        entName: values.entName,
        dgmin: values.dgmin,
      }
    })
  }

  // 重启
  onRestart = (restartParam) => {
    console.log('restartParam', restartParam)
    // return;
    this.props.dispatch({
      type: 'console/RestartCollect',
      payload: {
        LocalEndPoint: restartParam || ""
      },
      callback: () => {
        this.getPageData();
      }
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
  updateConsulConfig = (restartParam) => {
    let that = this;
    console.log('this.state.serverSetList', this.state.serverSetList)
    console.log('this.state.transferConfig', this.state.transferConfig)
    // return;
    let _transferConfig = this.state.transferConfig.map(item => {
      return {
        ...item,
        points: undefined,
        devicecode: item.points.map(i => i.dgmin)
      }
    })

    let _serverSetList = this.state.serverSetList.map(item => {
      delete item.collectClients;
      return {
        "ip": item.ip,
        "port": item.port,
        "anayticeName": item.anayticeName,
        "isTransmit": item.isTransmit,
        "isAnswer": item.isAnswer
      };
    })

    console.log('_serverSetList', _serverSetList)
    console.log('_transferConfig', _transferConfig)
    // return;
    this.props.dispatch({
      type: "console/UpdateConsulConfig",
      payload: {
        monitorServerSetting: _serverSetList,
        transferConfig: _transferConfig,
        crcVerification: false,
      },
      callback: (res) => {
        this.onCloseModal();
        confirm({
          title: '操作成功，是否重启？',
          icon: <ExclamationCircleOutlined />,
          content: '修改后，重启才会生效！',
          onOk() {
            that.onRestart(restartParam);
          },
          onCancel() {
          },
        });
      }
    })
  }

  // 获取排口信息
  getPointList = () => {
    this.props.dispatch({
      type: 'console/GetPoint',
      payload: {}
    })
  }

  // 获取协议
  getAnayticeList = () => {
    this.props.dispatch({
      type: 'console/GetAnayticeList',
      payload: {}
    })
  }

  getStatus = (status, desc) => {
    let el = '';
    switch (status) {
      // case 1:
      //   el = <Tag icon={<MinusCircleOutlined />} color="default">
      //     停止
      //   </Tag>
      //   break;
      case 0:
        el = <Tag icon={<SyncOutlined spin />} color="processing">
          正常
        </Tag>
        break;
      case 1:
        el = <Tag icon={<ExclamationCircleOutlined />} color="warning">
          异常
        </Tag>
        break;
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
      let restartParam = undefined;
      let _serverSetList = [...serverSetList];
      // 编辑
      if (Object.keys(selectRow).length) {
        restartParam = `${values.ip}-${values.port}`
        _serverSetList[selectIndex] = values;
      } else {
        // 添加
        restartParam = undefined;
        _serverSetList.push(values);
      }
      this.setState({
        serverSetList: [
          ..._serverSetList,
        ]
      }, () => {
        this.updateConsulConfig(restartParam);
      })
    })
  }

  onSubmitForm2 = () => {
    this.formRef.current.validateFields().then((values) => {
      console.log("values=", values);
      const { selectRow, selectIndex, transferConfig } = this.state;
      let _transferConfig = [...transferConfig];
      // 编辑
      if (Object.keys(selectRow).length) {
        _transferConfig[selectIndex] = values;
      } else {
        // 添加
        _transferConfig.push(values);
      }
      console.log('_transferConfig=', _transferConfig)
      // return;
      this.setState({
        transferConfig: [
          ..._transferConfig,
        ]
      }, () => {
        this.updateConsulConfig();
      })
    })
  }

  // 链接详情搜索
  onDGIMNListSearch = () => {
    const fieldsValues = this.formRef.current.getFieldsValue();
    console.log('fieldsValues', fieldsValues)
    this.GetRemotePoint(fieldsValues);
  }

  render() {
    const {
      columns, columns2, columns3, isSocketModalOpen, isConnectModalOpen, isProtocolModalOpen, isDGIMNListModalOpen,
      selectRow, serverSetList, transferConfig, isRestartVisible, collectClients
    } = this.state;
    const { entAndPointList, agreementList, restartLoading, DGIMNList, DGIMNListSearchLoading } = this.props;
    const CardTitle = this.getCardTitle;
    const CardTitle2 = this.getCardTitle2;

    const tProps = {
      treeData: entAndPointList,
      // treeNodeLabelProp: "",
      treeDefaultExpandAll: true,
      treeCheckable: true,
      treeNodeFilterProp: "title",
      placeholder: '请选择站点！',
      style: {
        width: '100%',
      },
    };

    return (
      <Spin spinning={!!restartLoading}>
        <Popconfirm
          title="确认是否重启?"
          onConfirm={() => this.onRestart()}
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
            {/* <Form.Item
              label="名称"
              name="anayticeName"
              rules={[{ required: true, message: '请输入名称!' }]}
            >
              <Input placeholder="请输入名称" style={{ height: 32 }} />
            </Form.Item> */}
            <Form.Item
              label="协议"
              name="anayticeName"
              rules={[{ required: true, message: '请选择协议!' }]}
            >
              <Select placeholder="请选择协议">
                {
                  agreementList.map(item => {
                    return <Select.Option value={item.value} key={item.value}>{item.key}</Select.Option>
                  })
                }
              </Select>
            </Form.Item>
            <Form.Item
              label="Socket地址"
            >
              <Input.Group compact>
                <Form.Item
                  // label="IP"
                  name="ip"
                  rules={[{ required: true, message: '请输入ip!' }]}
                  // noStyle
                  style={{
                    display: 'inline-block',
                    width: 'calc(70%)',
                    marginBottom: 0
                  }}
                >
                  <Input placeholder="IP" style={{ height: 32, }} />
                </Form.Item>
                <Form.Item
                  // label="端口"
                  // noStyle
                  name="port"
                  rules={[{ required: true, message: '请输入端口!' }]}
                  style={{
                    display: 'inline-block',
                    width: 'calc(30%)',
                    marginBottom: 0
                  }}
                >
                  <InputNumber style={{ height: 32, width: '100%' }} placeholder="端口" />
                </Form.Item>
              </Input.Group>
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
              <TreeSelect {...tProps} />
              {/* 
              <Select placeholder="请选择关联排口" mode="tags">
              </Select> */}
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="连接详情"
          // width={'80vw'}
          maskClosable={false}
          destroyOnClose visible={isConnectModalOpen}
          footer={false}
          onCancel={this.onCloseModal}
        >
          <List
            bordered
            dataSource={collectClients}
            renderItem={(item, index) => (
              <List.Item>
                <Badge status="processing" text={item.remoteEndPoint} />
                {/* <Tooltip title="点击查看排口详情">
                  <a onClick={() => {
                    this.setState({ isDGIMNListModalOpen: true, remoteEndPoint: item.remoteEndPoint }, () => {
                      this.GetRemotePoint()
                    })
                  }}>排口数量：{item.remotePoints.length}</a>
                </Tooltip> */}
              </List.Item>
            )}
          />
        </Modal>
        <Modal
          title="查看排口"
          width={'80vw'}
          maskClosable={false}
          destroyOnClose
          visible={isDGIMNListModalOpen}
          footer={false}
          onCancel={() => {
            this.setState({
              isDGIMNListModalOpen: false
            })
          }}
        >
          <Form
            name="dgimnDetails"
            ref={this.formRef}
            layout="inline"
            style={{ marginBottom: 20 }}
          >
            <Form.Item
              label="企业名称"
              name="entName"
            >
              <Input style={{ width: 200, height: 32 }} allowClear placeholder="请输入企业名称" />
            </Form.Item>
            <Form.Item
              label="排口名称"
              name="pointName"
            >
              <Input style={{ width: 200, height: 32 }} allowClear placeholder="请输入排口名称" />
            </Form.Item>
            <Form.Item
              label="DGIMN"
              name="dgmin"
            >
              <Input style={{ width: 200, height: 32 }} allowClear placeholder="请输入MN号" />
            </Form.Item>
            <Form.Item>
              <Button type='primary' loading={DGIMNListSearchLoading} onClick={this.onDGIMNListSearch}>查询</Button>
            </Form.Item>
          </Form>
          <Divider />
          <SdlTable loading={DGIMNListSearchLoading} defaultWidth={200} dataSource={DGIMNList} columns={columns3} />
          {/* <List
            bordered
            dataSource={collectClients}
            renderItem={(item, index) => (
              <List.Item>
                <Badge status="processing" text={item} />
              </List.Item>
            )}
          /> */}

        </Modal>
      </Spin>
    );
  }
}

export default Collect;