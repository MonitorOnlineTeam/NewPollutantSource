import React, { PureComponent } from 'react'
import {
  Col, Divider, Row, Card, Table,
  Tooltip, Popconfirm, Button, Tag, Form,
  Input, Modal, InputNumber, Radio, Switch, Spin,
} from 'antd';
import { EditIcon, DetailIcon, DelIcon } from '@/utils/icon'
import { RetweetOutlined, MinusCircleOutlined, SyncOutlined, ReloadOutlined } from '@ant-design/icons'
import styles from './index.less'
import { connect } from 'dva';
import QuestionTooltip from "@/components/QuestionTooltip"


@connect(({ console, loading }) => ({
  loading: loading.effects['console/ModifyStatisTask', 'console/Restart'],
  // serverSetList: console.serverSetList,
  // transferConfig: console.transferConfig,
}))
class Crontab extends PureComponent {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      taskGroupDatas: [],
      taskAllDatas: [],
      selectRow: {},
      isModalOpen: false,
      columns: [
        {
          title: '任务名称',
          dataIndex: 'taskName',
          key: 'taskName',
          // align: 'center',
          width: 200,
          // ellipsis: true,
          render: (text, record) => {
            return <div>
              <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>
                <Tooltip title={text}>
                  {text}
                </Tooltip>
              </div>
            </div>
          }
        },
        {
          title: '运行状态',
          dataIndex: 'runStatus',
          key: 'runStatus',
          align: 'center',
          width: 100,
          render: (text, record) => {
            return this.getStatus(text, record.statusMessage);
          },
        },
        {
          title: '是否启用',
          dataIndex: 'switch',
          key: 'switch',
          align: 'center',
          width: 100,
          render: (text, record) => {
            return <Switch checkedChildren="启用" unCheckedChildren="关闭" checked={text} disabled />
          },
        },
        {
          title: '运行频率',
          dataIndex: 'timerSpan',
          key: 'timerSpan',
          width: 80,
          align: 'center',
        },
        {
          title: '运行次数',
          dataIndex: 'runCount',
          align: 'center',
          key: 'runCount',
          width: 80,
        },
        {
          title: '最后一次运行时间',
          dataIndex: 'lastRunTime',
          align: 'center',
          key: 'lastRunTime',
          width: 200,
        },
        {
          title: '操作',
          width: 80,
          fixed: 'right',
          align: 'center',
          render: (text, record, index) => {
            return <Tooltip title="重启">
              <Popconfirm
                placement="left"
                title="确认是否重启?"
                onConfirm={() => {
                  this.onRestart(record.taskCode);
                }}
                okText="是"
                cancelText="否">
                <a>
                  <ReloadOutlined style={{ fontSize: 14 }} />
                </a>
              </Popconfirm>
            </Tooltip>
            // return <>
            //   <Tooltip title="编辑">
            //     <a onClick={() => {
            //       console.log("record=", record)
            //       this.setState({
            //         selectRow: record,
            //         isModalOpen: true
            //       })
            //     }}><EditIcon /></a>
            //   </Tooltip>
            //   <Divider type="vertical" />
            //   <Tooltip title="删除">
            //     <Popconfirm
            //       placement="left"
            //       title="确认是否删除?"
            //       onConfirm={() => {
            //         this.delRowData(record.taskCode);
            //       }}
            //       okText="是"
            //       cancelText="否">
            //       <a href="#"><DelIcon /></a>
            //     </Popconfirm>
            //   </Tooltip>
            // </>
          }
        },
      ]
    };
  }

  componentDidMount() {
    this.getPageData();
  }

  getPageData = () => {
    this.props.dispatch({
      type: 'console/GetStatisSet',
      callback: (res) => {
        let taskAllDatas = [];
        res.map(item => {
          taskAllDatas = taskAllDatas.concat(item.taskList)
        })
        console.log("taskAllDatas=", taskAllDatas)
        this.setState({ taskGroupDatas: res, taskAllDatas })
      }
    })
  }

  // 是否启用状态更改
  onSwitchChange = (record) => {
    let _taskAllDatas = [...this.state.taskAllDatas];
    let index = _taskAllDatas.findIndex(item => item.taskCode !== record.taskCode);
    _taskAllDatas[index - 1].switch = checked;;
    this.setState({
      taskAllDatas: _taskAllDatas
    }, () => {
      this.ModifyStatisTask();
    })
  }

  // 更新定时任务配置
  ModifyStatisTask = () => {
    this.props.dispatch({
      type: 'console/ModifyStatisTask',
      payload: this.state.taskAllDatas,
      callback: (res) => {
        this.onCloseModal();
        this.onRestart();
      }
    })
  }

  // 重启
  onRestart = (TaskCode) => {
    this.props.dispatch({
      type: 'console/Restart',
      payload: {
        TaskCode
      },
      callback: () => {
        this.getPageData();
      }
    })
  }

  // 行删除
  delRowData = (taskCode) => {
    let _taskAllDatas = [...this.state.taskAllDatas];
    let newData = _taskAllDatas.filter(item => item.taskCode !== taskCode);
    this.setState({
      taskAllDatas: newData
    }, () => {
      this.ModifyStatisTask();
    })
  }

  getStatus = (status, desc) => {
    let el = '';
    switch (status) {
      case 1:
        el = <Tag color="error">
          异常
        </Tag>
        break;
      case 0:
        el = <Tag color="success">
          正常
        </Tag>
        break;
    }

    return <Tooltip title={desc}>
      {el}
    </Tooltip>
  }

  onSubmitForm = () => {
    this.formRef.current.validateFields().then((values) => {
      console.log("values=", values)
      let _taskAllDatas = [...this.state.taskAllDatas];
      let index = _taskAllDatas.findIndex(item => item.taskCode == values.taskCode);
      _taskAllDatas[index] = values;
      console.log("_taskAllDatas=", _taskAllDatas)
      this.setState({
        taskAllDatas: _taskAllDatas
      }, () => {
        this.ModifyStatisTask();
      })


      // "taskCode": "string",
      // "taskName": "string",
      // "timerSpan": 0,
      // "autoReset": true,
      // "switch": true

      // const { selectRow, selectIndex, serverSetList } = this.state;
      // let _serverSetList = [...serverSetList];
      // // 编辑
      // if (Object.keys(selectRow).length) {
      //   _serverSetList[selectIndex] = values;
      // } else {
      //   // 添加
      //   _serverSetList.push(values);
      // }
      // this.setState({
      //   serverSetList: [
      //     ..._serverSetList,
      //   ]
      // }, () => {
      //   this.updateConsulConfig();
      // })
    })
  }

  // 关闭弹窗
  onCloseModal = () => {
    this.setState({
      isModalOpen: false,
      selectRow: {},
    })
  }

  render() {
    const { taskGroupDatas, columns, isModalOpen, selectRow, loading } = this.state;
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
        <Row gutter={16}>
          {
            taskGroupDatas.map(item => {
              let title = `${item.groupName} - ${item.groupCode}`;
              return <Col className={styles["gutter-row"]} span={24}>
                <Card title={title}>
                  <Table
                    rowKey={'taskCode'}
                    size='small'
                    scroll={{ y: '300px' }}
                    dataSource={item.taskList}
                    columns={columns}
                    pagination={false}
                  />
                </Card>
              </Col>
            })
          }
        </Row>
        <Modal title="编辑"
          maskClosable={false}
          destroyOnClose visible={isModalOpen} onOk={this.onSubmitForm} onCancel={this.onCloseModal}>
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
              label="任务编码"
              name="taskCode"
              style={{ display: 'none' }}
              rules={[{ required: true, message: '请输入任务编码!' }]}
            >
              <Input placeholder="请输入任务编码" />
            </Form.Item>
            <Form.Item
              label="任务名称"
              name="taskName"
              rules={[{ required: true, message: '请输入任务名称!' }]}
            >
              <Input placeholder="请输入任务名称" />
            </Form.Item>
            <Form.Item
              // label="运转频率"
              label={
                <span>
                  运转频率
                  <QuestionTooltip content="多久执行一次" />
                </span>
              }
              name="timerSpan"
              rules={[{ required: true, message: '请输入运转频率!' }]}
            >
              <InputNumber style={{ width: '100%' }} placeholder="请输入运转频率" />
            </Form.Item>
            <Form.Item
              // label="autoReset"
              label={
                <span>
                  autoReset
                  <QuestionTooltip content="执行一次还是按照频率执行,true 按照频率一直执行,false只执行一次" />
                </span>
              }
              name="autoReset"
              rules={[{ required: true }]}
            >
              <Radio.Group>
                <Radio key={1} value={true}>是</Radio>
                <Radio key={0} value={false}>否</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              label="是否启用"
              name="switch"
              rules={[{ required: true }]}
            >
              <Switch checkedChildren="启用" unCheckedChildren="关闭" />
            </Form.Item>
          </Form>
        </Modal>
      </Spin>
    );
  }
}

export default Crontab;