import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import {
  Card,
  Col,
  Row,
  Button,
  Space,
  Select,
  DatePicker,
  message,
  Tag,
  Radio,
  Empty,
  Timeline,
  Modal,
  Dropdown,
  Menu,
  Popconfirm,
  Spin,
} from 'antd';
import { EllipsisOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import styles from '../styles.less';
import moment from 'moment';
import FromsModal from '../Forms/FromsModal';

const manualList = [
  {
    label: '应收账款催收',
    value: 11,
    img: '/cuishou.png',
  },
  {
    label: '现场工作',
    value: 8,
    img: '/xianchang.png',
  },
  {
    label: '部门内其他工作事项',
    value: 9,
    img: '/nei.png',
  },
  {
    label: '支持其他部门工作',
    value: 10,
    img: '/qita.png',
  },
];
const CONFIGID = 'T_Bas_PortableInstrument';
const dvaPropsData = ({ loading, wordSupervision }) => ({
  todoList: wordSupervision.todoList,
  messageList: wordSupervision.messageList,
  todoListLoading: loading.effects['wordSupervision/GetToDoDailyWorks'],
  messageListLoading: loading.effects['wordSupervision/GetWorkBenchMsg'],
});

const Workbench = props => {
  const { todoList, messageList, todoListLoading, messageListLoading } = props;
  const [currentTodoItem, setCurrentTodoItem] = useState({});
  const [formsModalVisible, setFormsModalVisible] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  // 加载工作台和我的消息数据
  const loadData = () => {
    GetToDoDailyWorks();
    GetWorkBenchMsg();
  };

  // 获取工作台待办
  const GetToDoDailyWorks = () => {
    props.dispatch({
      type: 'wordSupervision/GetToDoDailyWorks',
      payload: {
        type: '',
      },
    });
  };

  // 获取工作台消息
  const GetWorkBenchMsg = () => {
    props.dispatch({
      type: 'wordSupervision/GetWorkBenchMsg',
      payload: {},
    });
  };

  // 结束任务
  const endTask = todoItem => {
    if (todoItem.qualify !== 1) {
      message.error('完成任务后，才能结束此关闭！');
      return;
    }
    props.dispatch({
      type: 'wordSupervision/endTask',
      payload: {
        id: todoItem.ID,
        taskType: todoItem.TaskType,
      },
      callback: () => {
        loadData();
      },
    });
  };

  // 手动申请任务
  const manualTask = value => {
    const type = props.location.query.type;
    props.dispatch({
      type: 'wordSupervision/manualTask',
      payload: {
        taskType: value,
        type: type,
      },
      callback: () => {
        loadData();
      },
    });
  };

  // 任务点击
  const onTodoItemClick = todoItem => {
    switch (todoItem.TaskType) {
      // 现场检查
      case 1:
      case 2:
        onInspectionInfo(todoItem);
        break;
      default:
        setCurrentTodoItem(todoItem);
        setFormsModalVisible(true);
        // props.dispatch({
        //   type: 'wordSupervision/updateState',
        //   payload: {
        //     formsModalVisible: true,
        //   },
        // });
        break;
    }
  };

  // 现场检查弹窗说明
  const onInspectionInfo = todoItem => {
    const { standMNNum, overMNNum, standPersonNum, overPersonNum, BeginTime, EndTime } = todoItem;
    let content = (
      <ul className={styles.inspectionInfo}>
        <li>
          <span>任务类型：</span>现场检查任务。
        </li>
        <li>
          <span>任务有效期：</span>
          {moment(BeginTime).format('YYYY-MM-DD')} 至 {moment(EndTime).format('YYYY-MM-DD')}。
        </li>
        <li>
          <span>任务要求：</span>需覆盖{standMNNum}个监测点，{standPersonNum}名运维人员。
        </li>
        <li>
          <span>完成情况：</span>已覆盖{overMNNum}个检测点，{overPersonNum}名运维人员。
        </li>
        <li>
          <span>填写位置：</span>请跳转到
          <a href="/operations/siteInspector" target="_blank">
            {' '}
            “监督核查/现场监督核查/系统设施核查”{' '}
          </a>
          页面中填写。
        </li>
      </ul>
    );
    Modal.info({
      title: '运维现场检查任务',
      content: content,
      onOk() {
        console.log('OK');
      },
    });
  };

  // 渲染待办列表
  const renderTodoList = () => {
    return todoList.map(item => {
      const menu = (
        <Menu
          onClick={e => {
            if (e.key === '1') {
              // 转发任务
            } else {
              // 结束任务
              endTask(item);
            }
          }}
        >
          {item.TaskFrom === 2 && <Menu.Item key="1">转发任务</Menu.Item>}
          <Menu.Item key="2">结束任务</Menu.Item>
        </Menu>
      );
      return (
        <Row key={item.ID} className={styles.listItem}>
          <Col flex="1" className={styles.taskName} onClick={() => onTodoItemClick(item)}>
            {item.TaskContent}
          </Col>
          <Col flex="100px">{item.CreateUser}</Col>
          <Col flex="100px">{moment(item.CreateTime).format('YYYY-MM-DD')}</Col>
          <Col flex="40px" style={{ textAlign: 'right', cursor: 'pointer' }}>
            <Dropdown placement="bottomLeft" overlay={menu}>
              <EllipsisOutlined />
            </Dropdown>
          </Col>
        </Row>
      );
    });
  };

  // 渲染消息时间轴
  const renderMessageTimeLine = () => {
    return messageList.map(item => {
      const date = moment(item.CreateTime).format('MM月DD日 HH:ss');
      return <Timeline.Item label={date}>{item.Title}</Timeline.Item>;
    });
  };

  return (
    <BreadcrumbWrapper>
      <div className={styles.workbench}>
        <div className={styles.leftWrapper}>
          <div className={styles.topWrapper}>
            <div className={styles.taskListWrapper}>
              <Card
                style={{ height: '100%' }}
                bodyStyle={{ padding: 0, display: 'flex', flexDirection: 'column', height: '100%' }}
              >
                {/* 待办任务列表 */}
                <div className={styles.taskList}>
                  <div className={styles.title}>日常监管待办</div>

                  <div className={styles.content}>
                    <Spin spinning={todoListLoading}>{renderTodoList()}</Spin>
                  </div>
                </div>
                {/* 手工申请 */}
                <div className={styles.manualList}>
                  <div className={styles.title}>手工申请</div>
                  <Row
                    gutter={32}
                    className={styles.content}
                    // style={{ height: '100%', width: '100%' }}
                  >
                    {manualList.map(item => {
                      return (
                        <Col span={6}>
                          <Popconfirm
                            title={`确认申请${item.label}任务单？`}
                            onConfirm={e => {
                              manualTask(item.value);
                            }}
                            okText="是"
                            cancelText="否"
                          >
                            <div className={styles.manualItem}>
                              <img src={item.img} />
                              <p>{item.label}</p>
                            </div>
                          </Popconfirm>
                        </Col>
                      );
                    })}
                  </Row>
                </div>
              </Card>
            </div>
          </div>
          <Row gutter={[16, 16]} className={styles.bottomWrapper}>
            <Col flex="1">
              <Card
                style={{ height: '100%' }}
                bodyStyle={{
                  padding: 0,
                  height: '100%',
                }}
              >
                {/* 预留 */}
                <div className={styles.title}>预留</div>
                <div>
                  <Empty style={{ marginTop: '30px' }} />
                </div>
              </Card>
            </Col>
            <Col flex="1">
              <Card
                style={{ height: '100%' }}
                bodyStyle={{
                  padding: 0,
                  height: '100%',
                }}
              >
                {/* 预留 */}
                <div className={styles.title}>预留</div>
                <div>
                  <Empty style={{ marginTop: '30px' }} />
                </div>
              </Card>
            </Col>
          </Row>
        </div>
        <div className={styles.rightWrapper}>
          <div className={styles.infoWrapper}>
            <Card bodyStyle={{ padding: 0 }} style={{ height: '100%' }}>
              <div className={styles.title}>我的消息</div>
              <div className={styles.content}>
                <Spin spinning={messageListLoading}>
                  <Timeline mode={'left'} className={styles.messageTimeLine}>
                    {renderMessageTimeLine()}
                    {/* <Timeline.Item label={'03月01日 00:00'}>Create a services</Timeline.Item>
                  <Timeline.Item label={'03月01日 00:00'}>Create a services</Timeline.Item>
                  <Timeline.Item label={'03月01日 00:00'}>Create a services</Timeline.Item>
                  <Timeline.Item label={'03月01日 00:00'}>Create a services</Timeline.Item>
                  */}
                  </Timeline>
                </Spin>
              </div>
            </Card>
          </div>
        </div>

        {/* <Row gutter={[16, 16]}></Row> */}
      </div>
      <FromsModal
        visible={formsModalVisible}
        onCancel={() => {
          setFormsModalVisible(false);
        }}
        taskInfo={currentTodoItem}
      />
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(Workbench);
