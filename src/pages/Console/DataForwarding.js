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
import QuestionTooltip from "@/components/QuestionTooltip"

const { TextArea } = Input;
const { confirm } = Modal;

@connect(({ console, loading }) => ({
  loading: loading.effects['console/RestartTransmit'],
  entAndPointList: console.entAndPointList,
  allPointList: console.allPointList,
  agreementList: console.agreementList,
  // serverSetList: console.serverSetList,
  // transferConfig: console.transferConfig,
}))
class DataForwarding extends PureComponent {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      selectRow: {},
      dataSource: [],
      currentDGIMNList: [],
      columns: [
        {
          title: '名称',
          dataIndex: 'transmitName',
          key: 'transmitName',
          width: 180,
          render: (text) => {
            return text || '-'
          }
        },
        {
          title: '转发IP',
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
          dataIndex: 'anayticeDisplayName',
          key: 'anayticeDisplayName',
          width: 200,
        },
        {
          title: '运行情况',
          dataIndex: 'runStatus',
          key: 'runStatus',
          render: (text, record) => {
            return this.getStatus(text, record.statusMessage);
          },
        },
        {
          title: '运行时长',
          dataIndex: 'runTimeLong',
          key: 'runTimeLong',
          render: (text) => {
            return text || '-'
          }
        },
        {
          title: '转发数据量',
          dataIndex: 'dgimNs',
          key: 'dgimNs',
          render: (text) => {
            return <Tooltip title="点击查看绑定排口">
              <a onClick={() => this.ondgimNsOpen(text)}>
                {text ? text.length : '0'}
              </a>
            </Tooltip>
            return <a>{text.length}</a>
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
                    this.onRestart(record.clientKey);
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
                    isOpen: true
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
      type: 'console/GetTransmitSet',
      callback: (res) => {
        let dataSource = res;
        this.setState({
          dataSource: dataSource,
        })
      }
    })
  }

  ondgimNsOpen = (data) => {
    let DGIMNList = [];
    data.map(item => {
      let current = this.props.allPointList.find(itm => itm.dgimn === item) || {};
      if (current.dgimn) {
        DGIMNList.push(`${current.entName} - ${current.title}`)
      } else {
        DGIMNList.push(item)
      }
    })
    this.setState({ isOpen2: true, currentDGIMNList: DGIMNList })
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

  // 重启
  onRestart = (clientKey) => {
    this.props.dispatch({
      type: 'console/RestartTransmit',
      payload: {
        clientKey: clientKey || ''
      },
      callback: () => {
        this.getPageData();
      }
    })
  }


  // 行删除
  delRowData = (index) => {
    let newData = [...this.state.dataSource];
    newData.splice(index, 1);
    this.setState({
      _dataSource: newData
    }, () => {
      this.update();
    })
  }

  // 更新采集数据
  update = (restartParam) => {
    let that = this;
    console.log('dataSource', this.state._dataSource)
    // return;
    this.props.dispatch({
      type: "console/ModifyTransmitSet",
      payload: {
        socketMonitorClient: this.state._dataSource
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
        数据转发
        <div style={{ marginTop: 10 }}>
          <Space>
            <Button type='primary' onClick={() => {
              this.setState({ isOpen: true });
            }}>添加</Button>
          </Space>
        </div>
      </div>
    </>
  }

  // 关闭弹窗
  onCloseModal = () => {
    this.setState({
      isOpen: false,
      isOpen2: false,
      currentDGIMNList: [],
      selectRow: {},
    })
  }

  onSubmitForm = () => {
    this.formRef.current.validateFields().then((values) => {
      console.log("values=", values)
      const { selectRow, selectIndex, dataSource } = this.state;
      let restartParam = '';
      let _dataSource = [...dataSource];
      // 编辑
      if (Object.keys(selectRow).length) {
        _dataSource[selectIndex] = values;
        restartParam = values.clientKey;
      } else {
        // 添加
        _dataSource.push(values);
        restartParam = '';
      }
      this.setState({
        _dataSource: [
          ..._dataSource,
        ]
      }, () => {
        this.update(restartParam);
      })
    })
  }

  render() {
    const {
      columns, dataSource, isOpen, isOpen2, selectRow, currentDGIMNList
    } = this.state;
    const { loading, agreementList, entAndPointList } = this.props;
    const CardTitle = this.getCardTitle;

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
      <Spin spinning={!!loading}>
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
          <SdlTable dataSource={dataSource} columns={columns} />
        </Card>
        <Modal title="数据转发"
          maskClosable={false}
          destroyOnClose
          visible={isOpen}
          onOk={this.onSubmitForm}
          onCancel={this.onCloseModal}
        >
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
              label="名称"
              name="transmitName"
              rules={[{ required: true, message: '请输入名称!' }]}
            >
              <Input placeholder="请输入名称" style={{ height: 32 }} />
            </Form.Item>
            <Form.Item
              label={
                <span>
                  唯一标识
                  <QuestionTooltip content="唯一标识，不能重复（clientKey），" />
                </span>
              }
              name="clientKey"
              rules={[{ required: true, message: '请输入clientKey!' }]}
            >
              <Input placeholder="请输入名称" style={{ height: 32 }} />
            </Form.Item>
            <Form.Item
              label="转发地址"
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
                  <Input placeholder="IP" style={{ height: 32 }} />
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
                  <Input style={{ height: 32 }} placeholder="端口" />
                </Form.Item>
              </Input.Group>
            </Form.Item>
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
              label="关联排口"
              name="dgimNs"
              rules={[{ required: true, message: '关联排口!' }]}
            >
              <TreeSelect {...tProps} />
            </Form.Item>
          </Form>
        </Modal>
        <Modal title="查看排口"
          maskClosable={false}
          destroyOnClose visible={isOpen2} footer={false} onCancel={this.onCloseModal}>
          <List
            bordered
            dataSource={currentDGIMNList}
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

export default DataForwarding;