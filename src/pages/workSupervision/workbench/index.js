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
  Pagination,
} from 'antd';
import { EllipsisOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import styles from '../styles.less';
import moment from 'moment';
import FromsModal from '../Forms/FromsModal';
import SuperviseRectification from '@/pages/operations/superviseRectification'
import SuperviseRectificationDetail from '@/pages/operations/superviseRectification/Detail';
import superviseRectificaSty from '@/pages/operations/superviseRectification/style.less';

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
const dvaPropsData = ({ loading, wordSupervision,global }) => ({
  todoList: wordSupervision.todoList,
  messageList: wordSupervision.messageList,
  managerList: wordSupervision.managerList,
  TYPE: wordSupervision.TYPE,
  todoListLoading: loading.effects['wordSupervision/GetToDoDailyWorks'] || false,
  messageListLoading: loading.effects['wordSupervision/GetWorkBenchMsg'],
  operaServiceList: wordSupervision.operaServiceList,
  operaServiceLoading: loading.effects['wordSupervision/GetStagingInspectorRectificationList'],
  workAlarmPushLoading: loading.effects['wordSupervision/GetWorkAlarmPushList'],
  workAlarmPushList: wordSupervision.workAlarmPushList,
  workAlarmTotal: wordSupervision.workAlarmTotal,
  configInfo: global.configInfo,
});

const Workbench = props => {
  const { TYPE, todoList, messageList, managerList, todoListLoading, messageListLoading, operaServiceLoading, operaServiceList,configInfo,workAlarmPushLoading,workAlarmPushList,workAlarmTotal, } = props;
  const [currentTodoItem, setCurrentTodoItem] = useState({});
  const [formsModalVisible, setFormsModalVisible] = useState(false);
  const [forwardingTaskVisible, setForwardingTaskVisible] = useState(false);
  const [forwardingUserId, setForwardingUserId] = useState('');

  // const type = props.location.query.type;
  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (props.location.query?.type) {
      props.dispatch({
        type: 'wordSupervision/updateState',
        payload: {
          TYPE: props.location.query.type,
        },
      });
      loadData();
    }
  }, [props.location.query.type]);

  // 加载工作台和我的消息数据 运维服务列表
  const loadData = () => {
    // GetToDoDailyWorks();
    GetWorkBenchMsg();
    GetStagingInspectorRectificationList()
    // GetWorkAlarmPushList(dataAlarmVal)
  };

  // 获取工作台待办
  const GetToDoDailyWorks = () => {
    props.dispatch({
      type: 'wordSupervision/GetToDoDailyWorks',
      payload: {
        type: props.location.query.type,
      },
    });
  };

  // 获取工作台消息
  const GetWorkBenchMsg = () => {
    props.dispatch({
      type: 'wordSupervision/GetWorkBenchMsg',
      payload: {
        // type: TYPE,
      },
    });
  };

  // 结束任务
  const endTask = todoItem => {
    if (todoItem.qualify !== 1) {
      message.error('完成任务后，才能结束此任务！');
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
    props.dispatch({
      type: 'wordSupervision/manualTask',
      payload: {
        taskType: value,
        type: TYPE,
      },
      callback: () => {
        loadData();
      },
    });
  };

  //获取运维服务列表
  const GetStagingInspectorRectificationList = () => {
    props.dispatch({
      type: 'wordSupervision/GetStagingInspectorRectificationList',
      payload: { pageIndex: 1, pageSize: 9999 },
      callback:(total)=>{
        operaServiceBtnList.splice(0,1,{name: `监督核查（${total}）`, value: 1 })
      }
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
    const {
      standMNNum,
      overMNNum,
      standPersonNum,
      overPersonNum,
      BeginTime,
      EndTime,
      qualify,
    } = todoItem;
    let content = (
      <div>
        {/* <Tag color="error">未达标</Tag> */}
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
            <span>完成情况：</span>已覆盖{overMNNum}个监测点，{overPersonNum}名运维人员。
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
      </div>
    );
    Modal.info({
      title: (
        <div>
          运维现场检查任务{' '}
          {qualify === 1 ? (
            <Tag style={{ marginLeft: 10 }} color="success">
              达标
            </Tag>
          ) : (
              <Tag style={{ marginLeft: 10 }} color="error">
                未达标
              </Tag>
            )}
        </div>
      ),
      content: content,
      onOk() {
        console.log('OK');
      },
    });
  };

  // 显示转发弹窗，获取可转发的经理列表
  const onShowForwardingModal = item => {
    //     regional：大区经理
    // province：省区经理
    props.dispatch({
      type: 'wordSupervision/GetManagerByType',
      payload: {
        type: TYPE ? 'regional' : 'province',
      },
      callback: res => {
        setCurrentTodoItem(item);
        setForwardingTaskVisible(true);
      },
    });
  };

  // 转发任务
  const onForwardingTask = () => {
    if (!forwardingUserId) {
      message.error('请选择要转发的经理！');
      return;
    }
    props.dispatch({
      type: 'wordSupervision/RetransmissionTasks',
      payload: {
        ID: currentTodoItem.ID,
        User_ID: forwardingUserId,
      },
      callback: res => {
        setForwardingTaskVisible(false);
      },
    });
  };

  // 渲染待办列表
  const renderTodoList = () => {
    if (!todoList.length) {
      return <Empty style={{ marginTop: '30px' }} />;
    }
    return todoList.map(item => {
      const menu = (
        <Menu
          onClick={e => {
            if (e.key === '1') {
              // 转发任务
              onShowForwardingModal(item);
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
          <Col flex="200px">
            <span className={styles.ellipsis} title={item.CreateUser}>
              {item.CreateUser}
            </span>
          </Col>
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
      const date = moment(item.CreateTime).format('MM月DD日 HH:mm');
      return <Timeline.Item label={date}>{item.Title}</Timeline.Item>;
    });
  };
  const [superviseRectificaVisible, setSuperviseRectificaVisible] = useState(false)
  const [superviseRectificaDetailVisible, setSuperviseRectificaDetailVisible] = useState(false)
  const [superviseRectificaDetailId, setSuperviseRectificaDetailId] = useState()


  const operaServiceClick = (id) => {
    setSuperviseRectificaDetailVisible(true)
    setSuperviseRectificaDetailId(id)
  }

  const dataAlarmTypeChange = (val) => {
    setDataAlarmVal(val)
    setAlarmPageIndex(1)
    GetWorkAlarmPushList(val,1)
  }
  const [selectMyVal, setSelectMyVal] = useState(1)
  const [selectOperaVal, setSelectOperaVal] = useState(1)

  const [operaServiceBtnList, setOperaServiceBtnList] = useState([{ name: '监督核查', value: 1 }])
  const [myRemindBtnList, setMyBtnRemindList] = useState([{ name: '数据报警', value: 1 },])
  const btnComponents = (data, val, callBack) => {
    return <div className={styles.selectBtnSty}>
      {data.map(item => {
        return <div className={item.value == val ? 'btnItemActive' : 'btnItem'} onClick={() => callBack(item.value)}>{item.name}</div>
      })}
    </div>
  }
  const [dataAlarmTypeList, setDataAlarmTypeList] = useState([{ name: '全部', value: '' }, { name: '待处理', value: 1 }, { name: '已处理', value: 2 }])
  const [dataAlarmVal, setDataAlarmVal] = useState('')
  const [allClose, setAllClose] = useState(1)

  const btnSquareComponents = (data, val, callBack) => {
    return <div className={styles.selectSquareBtnSty}>
      {data.map(item => {
        return <div className={item.value == val ? 'btnItemActive' : 'btnItem'} onClick={() => callBack(item.value)}>{item.name}</div>
      })}
    </div>
  }

    //获取数据报警
 const GetWorkAlarmPushList = (status,pageIndex,pageSize,) =>{
  props.dispatch({
    type: 'wordSupervision/GetWorkAlarmPushList',
    payload: {status:status, pageIndex:pageIndex?pageIndex: alarmPageIndex, pageSize:pageSize?pageSize : alarmPageSize },
    callback:(total)=>{
      myRemindBtnList.splice(0,1,{name: `数据报警（${total}）`, value: 1 })
    }
  });
 }
  const delAlarm = (item) =>{ //删除报警
    props.dispatch({
      type: 'wordSupervision/UpdateWorkPushStatus',
      payload: {
        alarmID: item.alarmID,
      },
      callback: res => {
        GetWorkAlarmPushList(dataAlarmVal)
      },
    });
  }
  const closeAllAlarmChange = () => { //关闭全部报警
    props.dispatch({
      type: 'wordSupervision/UpdateWorkPushStatus',
      payload: {
        alarmID: '',
      },
      callback: res => {
        setAlarmPageIndex(1)
        GetWorkAlarmPushList(dataAlarmVal,1)
      },
    });
  }
  const [alarmPageIndex,setAlarmPageIndex] = useState(1)
  const [alarmPageSize,setAlarmPageSize] = useState(10)
  const alarmPageChange = (pageIndex,pageSize) =>{
   setAlarmPageIndex(pageIndex)
   setAlarmPageSize(pageSize)
   GetWorkAlarmPushList(dataAlarmVal,pageIndex,pageSize)
  }
  return (
    <div className={styles.workbenchBreadSty}>
      <BreadcrumbWrapper>
        <div className={styles.workbench}>
          <div className={styles.leftWrapper}>
           {!configInfo.IsShowProjectRegion&&<div className={styles.topWrapper}>
              <div className={styles.taskListWrapper}>
                <Card
                  style={{ height: '100%' }}
                  bodyStyle={{ padding: 0, display: 'flex', flexDirection: 'column', height: '100%' }}
                >
                  {/* 手工申请 */}
                  <div className={styles.title}>日常监督</div>
                  {/* <div className={styles.manualList}>
                    <Row
                      gutter={32}
                      className={styles.content}
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
                              <div className={styles.manualItem} style={{ backgroundImage: `url(${item.img})` }}>
                                <p>{item.label}</p>
                              </div>
                            </Popconfirm>
                          </Col>
                        );
                      })}
                    </Row>
                  </div> */}
                  {/* 待办任务列表 */}
                  <div className={styles.taskList}>
                    <div className={styles.content} style={{ textAlign: 'center' }}>
                      <Spin spinning={todoListLoading}>{renderTodoList()}</Spin>
                      {/* <Spin spinning={true}>{renderTodoList()}</Spin> */}
                    </div>
                  </div>
                </Card>
              </div>
            </div>}
            <Row className={`${styles.bottomWrapper}`}>
              <Col flex="1" span={24} style={{ height: 360 }}>
                <Card
                  style={{ height: '100%' }}
                  bodyStyle={{
                    padding: 0,
                    height: '100%',
                  }}
                >
                  {/* 运维服务 */}
                  <Row justify='space-between'>
                    <div className={styles.title}>运维服务</div>
                    <img title='更多' style={{ height: '100%', paddingRight: 16, cursor: 'pointer' }} src="/more.png" onClick={() => setSuperviseRectificaVisible(true)} />
                  </Row>
                  {btnComponents(operaServiceBtnList, selectOperaVal, (val) => { setSelectOperaVal(val) })}
                  <div className={styles.operaServiceSty} style={{ padding: '0 24px 0 16px' }}>
                    <Spin spinning={operaServiceLoading}>
                      {operaServiceList?.length ? operaServiceList.map(item =>
                        (<Row justify='space-between' style={{ paddingBottom: 18, cursor: 'pointer' }} onClick={() => { operaServiceClick(item.ID) }}>
                          <Col style={{ width: 'calc(100% - 146px)' }} className='textOverflow' title={item.EntNamePointName}>{item.EntNamePointName}</Col>
                          <Col>{item.Time}</Col>
                        </Row>)
                      ) :
                        <Empty style={{ marginTop: '30px' }} />}
                    </Spin>
                  </div>
                </Card>
              </Col>
            </Row>
            {/* 我的提醒 */}
            <Row className={`${styles.myRemindSty}`}>
              <Col flex="1" span={24} style={{ height: 380 }}>
                <Card
                  style={{ height: '100%' }}
                  bodyStyle={{
                    padding: 0,
                    height: '100%',
                  }}
                >

                <div className={styles.title}>预留我的提醒</div>
                  <Empty style={{ marginTop: '30px' }} />
                {/* <Row justify='space-between'>
                    {btnComponents(myRemindBtnList, selectMyVal, (val) => { setSelectMyVal(val) })}
                    {workAlarmTotal&&btnSquareComponents(dataAlarmTypeList, dataAlarmVal, (val) => { dataAlarmTypeChange(val) })}
                  </Row>
                  <div className={'dataAlarmSty'} style={{ padding: '0 24px 0 16px' }}>
                    <Spin spinning={workAlarmPushLoading}>
                      {workAlarmPushList?.length ? workAlarmPushList.map(item =>
                        (<Row justify='space-between' style={{ paddingBottom: 12, cursor: 'pointer' }}>
                          <Col style={{paddingTop:4}}><img src='/work_alarm.png'/></Col>
                          <Col style={{width:'calc(100% - 100px)'}}>
                            <div>{item.message}</div>
                            <div className='statusSty' style={{color:'#666',fontSize:13,paddingTop:4}}><span>报警生成时间：{item.alarmCreateTime}</span>
                            {item.alarmType==0 || item.alarmType==12 ? 
                            <><Tag color={item.status==3? "success" : "warning"}>{item.status==3?'已响应':'待响应'}</Tag>{item.status==3&&<><span>响应人{item.userName}</span> <span>响应时间：{item.responseTime}</span></>}</>
                            :
                            <><Tag color={item.status==3? "success" : "warning"}>{item.status==3?'已响应':'待响应'}</Tag>{item.status==3&&<><span>核实人：{item.userName}</span> <span>核实时间：{item.responseTime}</span></>}</>}
                            
                            </div>
                          </Col>
                          <Col>
                          <Popconfirm placement="left" title={'确定要删除这条报警吗？'} onConfirm={()=>delAlarm(item)} okText="是" cancelText="否">
                            <a>删除</a>
                          </Popconfirm>
                          </Col>
                        </Row>)
                      )
                        :
                        <Empty style={{ marginTop: '30px' }} />}
                    </Spin>
                  </div>
                  {workAlarmTotal?<Row justify='space-between'  style={{ paddingTop: 12 }}>
                   <Popconfirm placement="topLeft" title={'确定要关闭全部报警吗？'} onConfirm={()=>closeAllAlarmChange()} okText="是" cancelText="否">
                    <div>{btnSquareComponents([{ name: '关闭全部', value: 1 }], allClose, () => {  })}</div>
                    </Popconfirm>
                    <Pagination
                      size="small"
                      style={{paddingRight:12}}
                      showSizeChanger
                      showQuickJumper
                      total={workAlarmTotal}
                      current={alarmPageIndex}
                      pageSize={alarmPageSize}
                      onChange={alarmPageChange}
                    />
                  </Row> : null}*/}
                </Card>
              </Col>
            </Row> 
          </div>
          <div className={styles.rightWrapper}>
            <div className={styles.quickNavWrapper}>
              <Card style={{ height: '100%' }} bodyStyle={{ padding: 0, height: '100%', }} >
                <Row justify='space-between'>
                  <div className={styles.title}>预留快捷导航</div>
                  <img title='更多' style={{ height: '100%', paddingRight: 16, cursor: 'pointer' }} src="/more.png" onClick={()=>{}} />
                </Row>
                <div className={styles.operaServiceSty} style={{ padding: '6px 24px 4px 16px' }}>
                 <Empty style={{ marginTop: '30px' }} />
                </div>
              </Card>
            </div>
            <div className={styles.infoWrapper}>
              <Card bodyStyle={{ padding: 0, height: '100%' }} style={{ height: '100%' }}>
                <div className={styles.title}>我的消息</div>
                <div
                  className={styles.content}
                  style={{ height: 'calc(100% - 44px)', overflowY: 'auto' }}
                >
                  <Spin spinning={messageListLoading}>
                    {messageList.length ? (
                      <Timeline mode={'left'} className={styles.messageTimeLine}>
                        {renderMessageTimeLine()}
                      </Timeline>
                    ) : (
                        <Empty style={{ marginTop: '30px' }} />
                      )}
                  </Spin>
                </div>
              </Card>
            </div>
          </div>

          {/* <Row gutter={[16, 16]}></Row> */}
        </div>
        {/* 转发任务 */}
        <Modal
          title="转发任务单"
          visible={forwardingTaskVisible}
          onOk={() => onForwardingTask()}
          onCancel={() => setForwardingTaskVisible(false)}
        >
          <label style={{ fontSize: 14 }}>
            将任务单转发至：
          <Select
              style={{ marginLeft: 10, width: 200 }}
              placeholder="请选择转发人"
              onChange={value => {
                setForwardingUserId(value);
              }}
            >
              {managerList.map(item => {
                return (
                  <Option value={item.User_ID} key={item.User_ID}>
                    {item.User_Name}
                  </Option>
                );
              })}
            </Select>
          </label>
        </Modal>
        <FromsModal
          visible={formsModalVisible}
          onCancel={() => {
            setFormsModalVisible(false);
          }}
          taskInfo={currentTodoItem}
        />
        <Modal
          centered
          visible={superviseRectificaVisible}
          title={'运维服务'}
          footer={null}
          wrapClassName="spreadOverModal"
          destroyOnClose
          onCancel={() => setSuperviseRectificaVisible(false)}
        >
          <SuperviseRectification hideBreadcrumb match={{ path: '/operations/superviseRectification' }} />
        </Modal>
        <Modal //详情
          visible={superviseRectificaDetailVisible}
          title={'详情'}
          footer={null}
          wrapClassName='spreadOverModal'
          className={superviseRectificaSty.fromModal}
          onCancel={() => { setSuperviseRectificaDetailVisible(false); GetStagingInspectorRectificationList() }}
          destroyOnClose
        >
          <SuperviseRectificationDetail ID={superviseRectificaDetailId} />
        </Modal>
      </BreadcrumbWrapper>
    </div>
  );
};

export default connect(dvaPropsData)(Workbench);
