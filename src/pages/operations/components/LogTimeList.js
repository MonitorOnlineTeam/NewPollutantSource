import React, { Component } from 'react';
import { ClockCircleOutlined } from '@ant-design/icons';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import {
  Card,
  Select,
  Timeline,
  Tag,
  Pagination,
  Empty,
  Modal,
  Upload,
  message,
  Spin,
  Radio,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { router } from 'umi';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import ViewImagesModal from './ViewImagesModal';
import NavigationTree from '@/components/NavigationTree';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import styles from '../index.less';
import config from '@/config';

const { Option } = Select;

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

@connect(({ operations, loading, common, operationform }) => ({
  recordTypeList: operations.recordTypeList,
  timeLineList: operations.timeLineList,
  timeLineTotal: operations.timeLineTotal,
  imageList: common.imageList,
  imageListVisible: common.imageListVisible,
  logForm: operations.logForm,
  loading: loading.effects['operations/getOperationLogList'],
  currentRecordType: operationform.currentRecordType,
  currentDate: operationform.currentDate,
  // mainSelectDate:operationform.mainSelectDate
}))
class LogTimeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentRecordType: '',
      dateValues: props.currentDate,
      current: 1,
      pageIndex: 10,
      previewVisible: false,
      previewImage: '',
      DGIMN: props.DGIMN,
      mainSelectValue: props.mainSelectValue,
      mainSelectDate: props.mainSelectDate,
    };
  }

  // static getDerivedStateFromProps(nextProps, preState) {
  //   console.log('nextProps=',nextProps)
  //   console.log('preState=',preState)
  //   if (nextProps.DGIMN !== preState.DGIMN) {
  //     return {
  //       ...preState,
  //       DGIMN: nextProps.DGIMN
  //     }
  //   }
  //   return { ...preState }
  // }

  componentDidMount() {
    this.getOperationLogList();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.DGIMN !== nextProps.DGIMN) {
      const flag = this.props.type != nextProps.type;
      this.setState(
        {
          DGIMN: nextProps.DGIMN,
        },
        () => {
          this.getOperationLogList(flag);
        },
      );
    }
    if (this.props.recordTypeList !== nextProps.recordTypeList) {
      this.setState({
        recordTypeList: [],
      });
    }

    if (this.props.mainSelectValue !== nextProps.mainSelectValue) {
      this.setState(
        {
          mainSelectValue: nextProps.mainSelectValue,
        },
        () => {
          this.onLogSelectChage(this.state.mainSelectValue);
        },
      );
    }
    if (this.props.currentDate !== nextProps.currentDate) {
      this.setState(
        {
          currentDate: nextProps.currentDate,
        },
        () => {
          this.onDateChange(this.state.currentDate);
        },
      );
    }
  }
  getStatusColor = status => {
    let color = '';
    switch (status) {
      case 0:
        // 超标
        color = '#ff4544';
        break;
      case 1:
        // 维修
        color = '';
        break;
      case 2:
        // 停机
        color = 'red';
        break;
      case 9:
        // 对勾
        color = '#52c41a';
        break;
      case 10:
        // 异常
        color = '#ff995b';
        break;

      default:
        break;
    }
    return color;
  };

  // 渲染时间轴
  renderTimeLineItem = () => {
    const timelineItems = [];
    console.log('typeiD', this.props.timeLineList);
    this.props.timeLineList.map(item => {
      timelineItems.push(
        <Timeline.Item
          dot={<ClockCircleOutlined style={{ fontSize: '26px' }} />}
          position="left"
          key={item.RecordDate}
        >
          {/* <div className={styles.DateLoad}> */}
          <p className={styles.taskDate}>
            <Tag className={styles.dateContent}>{moment(item.RecordDate).format('YYYY-MM-DD')}</Tag>
          </p>
          {/* </div> */}
        </Timeline.Item>,
      );
      {
        /* <p style={{ color: "#f5222d", marginTop: 10 }}>{` ${node.DisplayInfo} `}</p> */
      }
      item.Nodes.map(node => {
        timelineItems.push(
          <Timeline.Item
            dot={
              <LegacyIcon
                type={node.Icon}
                style={{ fontSize: '20px', color: this.getStatusColor(node.TypeID) }}
              />
            }
            position="left"
            // key={node.MainFormID}
          >
            {node.TypeID !== 0 ? (
              <>
                <p>
                  <span style={{ color: '#40a9ff', marginRight: 10 }}>{node.CreateUser}</span>
                  {node.DisplayInfo}
                </p>
                <Tag
                  color="#43b9ff"
                  style={{
                    cursor: 'pointer',
                    marginTop: 10,
                    borderRadius: 13,
                    padding: '0 20px',
                    fontSize: 13,
                  }}
                  onClick={() => {
                     // 新疆兵团只要任务图片 故障小时数记录表不使用图片
                    // if (
                    //   config.XinJiang &&
                    //   node.TypeID != 58 &&
                    //   node.TypeID != 59 &&
                    //   node.TypeID != 60
                    // ) {
                    //   this.getOperationImageList(node);
                    // } else if (
                    //   node.PollutantType !== 2 &&
                    //   node.TypeID != 58 &&
                    //   node.TypeID != 59 &&
                    //   node.TypeID != 60
                    // ) {
                    //   // 查看图片
                    //   this.getOperationImageList(node);
                    // } else {
                    //   router.push(`/operations/log/recordForm/${node.TypeID}/${node.TaskID}`);
                    // }
                    if(node.TypeID==67 || node.TypeID ==10 || node.TypeID == 5 ||  node.TypeID == 75){
                      this.getOperationImageList(node);
                    }else{
                      router.push(`/operations/log/recordForm/${node.TypeID}/${node.TaskID}`);
                    }
                  }}
                >
                  查看详情
                </Tag>
              </>
            ) : (
              <>
                <p>
                  <span style={{ color: '#40a9ff', marginRight: 10 }}>{node.CreateUser}</span>
                  需要对当前排口进行处理
                </p>
              </>
            )}
          </Timeline.Item>,
        );
      });
    });
    return timelineItems;
  };

  // 获取运维日志数据
  getOperationLogList = flag => {
    const { dateValues, DGIMN, currentRecordType } = this.state;
    this.props.dispatch({
      type: 'operations/getOperationLogList',
      payload: {
        pageIndex: this.state.current,
        pageSize: this.state.pageIndex,
        DGIMN,
        // "beginTime": dateValues[0].format('YYYY-MM-DD 00:00:00'),
        // "endTime": dateValues[1].format('YYYY-MM-DD 23:59:59'),
        // "RecordType": flag ? "" : this.props.logForm.RecordType
        RecordType: flag ? '' : this.props.currentRecordType,
      },
    });
  };

  // 获取详情图片
  getOperationImageList = data => {
    this.props.dispatch({
      type: 'common/getOperationImageList',
      payload: {
        FormMainID: data.MainFormID,
        // FormMainID:"c521b4a0-5b67-45a8-9ad1-d6ca67bdadda"
      },
    });
  };

  paginationChange = (current, pageSize) => {
    this.setState(
      {
        current,
      },
      () => {
        this.getOperationLogList();
      },
    );
  };
  onLogSelectChage = value => {
    const { logForm } = this.props;
    this.props.dispatch({
      type: 'operations/updateState',
      payload: {
        logForm: {
          ...logForm,
          RecordType: value,
        },
      },
    });
    this.props.dispatch({
      type: 'operationform/updateState',
      payload: {
        currentRecordType: value,
      },
    });
    this.setState(
      {
        currentRecordType: value,
        current: 1,
      },
      () => {
        this.getOperationLogList();
      },
    );
  };
  onDateChange = date => {
    const { logForm } = this.props;

    // console.log("我是日期哈哈哈" + date)
    this.props.dispatch({
      type: 'operations/updateState',
      payload: {
        logForm: {
          ...logForm,
          dateTime: date,
        },
      },
    });
    this.props.dispatch({
      type: 'operationform/updateState',
      payload: {
        currentDate: date,
      },
    });
    this.setState(
      {
        dateValues: date,
        current: 1,
      },
      () => {
        this.getOperationLogList();
      },
    );
  };
  render() {
    const {
      recordTypeList,
      timeLineList,
      timeLineTotal,
      imageList,
      style,
      logForm,
      loading,
      currentRecordType,
    } = this.props;
    const { dateValues, current, previewVisible, previewImage } = this.state;
    // let defaultValue = logForm.RecordType || undefined;
    // let defaultValue = currentRecordType || undefined;
    // console.log("defaultValue=", defaultValue)
    return (
      <>
        {/* <Card
           style={{ height: "calc(100vh - 192px)", overflowY: "auto" }}
           extra={ */}
        <div>
          {/* <Select
                value={currentRecordType}
                style={{ width: 220, marginRight: 10 }}
                placeholder="请选择记录表"
                allowClear
                onChange={this.onLogSelectChage}
              >
                <Option value={null} key="null">全部</Option>
                {
                  recordTypeList.map(item => <Option value={item.TypeId} key={item.TypeId}>{item.Abbreviation}</Option>)
                }
              </Select> */}

          {/* <RangePicker_
                style={{ width: 350, textAlign: 'left', marginRight: 10 }}
                dateValue={dateValues}
                //format={"YYYY-MM-DD"}
                callback={date => {
                  this.props.dispatch({
                    type: 'operations/updateState',
                    payload: {
                      logForm: {
                        ...logForm,
                        dateTime: date,
                      },
                    },
                  })
                  this.props.dispatch({
                    type: 'operationform/updateState',
                    payload: {
                      currentDate: date,
                    },
                  })
                  this.setState({
                    dateValues: date,
                    current: 1,
                  }, () => {
                    this.getOperationLogList()
                  })
                }}
                allowClear={false}
              /> */}

          {/* <Radio.Group defaultValue="log" buttonStyle="solid" onChange={e => {
                if (e.target.value === 'operationrecord') {
                  router.push('/operations/operationrecord')
                }
              }}>
                <Radio.Button value="log">运维日志</Radio.Button>
                <Radio.Button value="operationrecord">运维记录</Radio.Button>
              </Radio.Group> */}
        </div>
        {/* }>  */}
        {/* <div style={{overflowY: "auto", height: "calc(100vh - 282px)"}}>  */}
        <div className={styles.timelineContent} style={{ ...style }}>
          {loading && (
            <Spin
              style={{
                width: '100%',
                height: 'calc(100vh/2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              size="large"
            />
          )}
          {!loading &&
            (timeLineList.length ? (
              <>
                <div className={styles.timeline}>
                  <Timeline>{this.renderTimeLineItem()}</Timeline>
                </div>
                <div style={{ width: '100%', marginTop: 10 }}>
                  <Pagination
                    style={{ float: 'right' }}
                    showQuickJumper
                    // defaultCurrent={}
                    pageSize={10}
                    current={current}
                    total={timeLineTotal}
                    onChange={this.paginationChange}
                  />
                </div>
              </>
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ))}
          {/* </div> */}
        </div>
        {/* </Card>  */}
        {this.props.imageListVisible && <ViewImagesModal />}
      </>
    );
  }
}

export default LogTimeList;
