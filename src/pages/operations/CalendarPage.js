import React, { Component } from 'react';
import { Card, Select, Timeline, Icon, Tag, Pagination, Empty } from 'antd'
import { connect } from 'dva';
import moment from 'moment';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import NavigationTree from '@/components/NavigationTree'
import RangePicker_ from '@/components/RangePicker'
import styles from './index.less'

const { Option } = Select;

@connect(({ operations, loading }) => ({
  recordTypeList: operations.recordTypeList,
  timeLineList: operations.timeLineList,
  timeLineTotal: operations.timeLineTotal
}))
class CalendarPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentRecordType: "",
      dateValues: [moment().subtract(3, 'month').startOf("day"), moment().endOf("day")],
      current: 1,
      pageIndex: 10
      // DGIMN: ""
    };
  }

  componentDidMount() {
    // // 
    // this.props.dispatch({
    //   type: "type/getOperationLogList",
    //   payload: {
    //     "pageIndex": 1,
    //     "pageSize": 2,
    //     "DGIMN": "sample string 3",
    //     "beginTime": "2019-08-16 10:19:38",
    //     "endTime": "2019-08-16 10:19:38",
    //     "RecordType": 1
    //   }
    // })
  }

  getStatusColor = (status) => {
    let color = "";
    switch (status) {
      case 0:
        // 超标
        color = "#ff4544"
        break;
      case 1:
        // 维修
        color = ""
        break;
      case 2:
        // 停机
        color = "red"
        break;
      case 9:
        // 对勾
        color = "#52c41a"
        break;
      case 10:
        // 异常
        color = "#ff995b"
        break;

      default:
        break;
    }
    return color;
  }

  renderTimeLineItem = () => {
    const timelineItems = []
    this.props.timeLineList.map(item => {
      timelineItems.push(
        <Timeline.Item
          dot={<Icon type="clock-circle-o" style={{ fontSize: '26px' }} />}
          position="left"
        >
          {/* <div className={styles.DateLoad}> */}
          <p className={styles.taskDate}><Tag className={styles.dateContent}>{item.RecordDate}</Tag></p>
          {/* </div> */}
        </Timeline.Item>
      )

      item.Nodes.map(node => {
        timelineItems.push(
          <Timeline.Item
            dot={<Icon type={node.Icon} style={{ fontSize: '20px', color: this.getStatusColor(node.TypeID) }} />}
            position="left"
          >
            {`${node.CreateUser}${node.DisplayInfo}`}
            <br />
            <Tag color="#43b9ff" style={{ cursor: 'pointer', marginTop: 10, borderRadius: 13, padding: "0 20px", fontSize: 13 }}>查看详情</Tag>
          </Timeline.Item>
        )
      })
    })
    return timelineItems;
  }

  getOperationLogList = () => {
    const { dateValues, DGIMN, currentRecordType } = this.state;
    this.props.dispatch({
      type: "operations/getOperationLogList",
      payload: {
        "pageIndex": this.state.current,
        "pageSize": this.state.pageIndex,
        "DGIMN": DGIMN,
        "beginTime": dateValues[0].format('YYYY-MM-DD 00:00:00'),
        "endTime": dateValues[1].format('YYYY-MM-DD 23:59:59'),
        "RecordType": currentRecordType
      }
    })
  }

  paginationChange = (current, pageSize) => {
    console.log('pageInfo=', current, pageSize)
    this.setState({
      current
    }, () => {
      this.getOperationLogList()
    })

  }


  render() {
    const { recordTypeList, timeLineList, timeLineTotal } = this.props;
    const { dateValues, current } = this.state;
    return (
      <>
        <NavigationTree choice={false} onItemClick={value => {
          if (this.state.DGIMN !== value[0].key) {
            console.log('value=', value)
            this.setState({
              DGIMN: value[0].key
            }, () => {
              this.getOperationLogList()
            })
          }
        }} />
        <div id="contentWrapper" className={styles.operationLogWrapper}>
          <PageHeaderWrapper title="运维日历">
            <Card
              // style={{ height: "calc(100vh - 192px)", overflowY: "auto" }}
              extra={
                <div>
                  <Select
                    style={{ width: 220 }}
                    placeholder="请选择记录表"
                    allowClear
                    onChange={(value) => {
                      this.setState({
                        currentRecordType: value,
                        current: 1
                      }, () => {
                        this.getOperationLogList()
                      })
                    }}
                  >
                    {
                      recordTypeList.map(item => {
                        return <Option value={item.TypeId}>{item.CnName}</Option>
                      })
                    }
                  </Select>
                  <RangePicker_
                    style={{ width: 350, textAlign: 'left', marginRight: 10 }}
                    dateValue={dateValues}
                    onChange={(date) => {
                      this.setState({
                        dateValues: date,
                        current: 1
                      }, () => {
                        this.getOperationLogList()
                      })
                    }}
                    allowClear={false}
                  />
                </div>
              }>
              {/* <div style={{overflowY: "auto", height: "calc(100vh - 282px)"}}> */}
              {
                timeLineList.length ? <div className={styles.timelineContent}>
                  <div className={styles.timeline}>
                    <Timeline>
                      {this.renderTimeLineItem()}
                    </Timeline>
                  </div>
                  <div style={{ width: "100%", marginTop: 20, marginBottom: -6 }}>
                    <Pagination
                      style={{ float: "right" }}
                      showQuickJumper
                      // defaultCurrent={}
                      pageSize={10}
                      current={current}
                      total={timeLineTotal}
                      onChange={this.paginationChange}
                    />
                  </div>
                </div> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              }
              {/* </div> */}
            </Card>
          </PageHeaderWrapper>
        </div>

      </>
    );
  }
}

export default CalendarPage;