import React, { PureComponent } from 'react';
import { Calendar, Badge, Card, Divider, Tag, Empty, message, List } from 'antd';
import { connect } from 'dva';
import { router } from 'umi';
import moment from 'moment';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SdlTable from '@/components/SdlTable'
import styles from './index.less'


@connect(({ loading, operations }) => ({
  calendarList: operations.calendarList,
  abnormalDetailList: operations.abnormalDetailList,
  abnormalForm: operations.abnormalForm,
  loading: loading.effects["operations/getAbnormalDetailList"]
}))
class CalendarPage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      date: moment(),
      mode: "month",
      dateFormat: "YYYY年MM月DD日",
      currentCellInfo: {},
      listData: [],
      // pageInfo: {
      //   pageIndex: 1,
      //   pageSize: 10
      // }
    };
  }

  componentDidMount() {
    this.getCalendarInfo();
    this.abnormalItemClick({ date: moment(), type: "", text: "运维记录" });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.abnormalDetailList !== nextProps.abnormalDetailList) {
      const listData = nextProps.abnormalDetailList.map(item => {
        return {
          href: `/operations/calendar/details/${item.TaskID}/${item.DGIMN}`,
          title: <div>
            <span style={{ marginRight: 8 }}>{item.EnterpriseName}</span>
            {
              item.ExceptionTypeText && item.ExceptionTypeText.split(",").map(itm => {
                // 报警响应异常,打卡异常,工作超时
                let color = itm === "报警响应异常" ? "#f50" : (itm === "打卡异常" ? "#108ee9" : "#2db7f5")
                return <Tag color={color}>{itm}</Tag>
              })
            }
          </div>,
          description: <div style={{ color: "#333" }}>
            {item.PointName}
            {
              item.TaskType === 2 && <Tag color="#ff5506" style={{ position: "relative", top: '-10px', marginLeft: 4 }} >应急</Tag>
            }
          </div>,
          content:
            <div>运维人：{item.OperationName} <Tag color={item.TaskStatus === 3 ? "green" : "volcano"}>{item.TaskStatusText}</Tag></div>
        }
      })
      this.setState({
        listData: listData
      })
    }
  }

  // 获取日历数据
  getCalendarInfo = () => {
    const { mode, date } = this.state;
    this.props.dispatch({
      type: 'operations/getCalendarInfo',
      payload: {
        Mode: mode,
        CalendarDate: date.format('YYYY-MM-01 00:00:00')
      }
    })
  }

  // 处理数据
  getListData = (value) => {
    let listData = [];
    this.props.calendarList.map(item => {
      if (item.ExcetionDate === value) {
        // 报警响应异常
        if (item.AlarmResponseCount) {
          listData.push({ color: '#f50', content: `报警响应异常${item.AlarmResponseCount}次`, type: 2, date: item.ExcetionDate, text: "报警响应异常" })
        }
        // 工作超时
        if (item.OvertimeWorkCount) {
          listData.push({ color: '#2db7f5', content: `工作超时${item.OvertimeWorkCount}次`, type: 3, date: item.ExcetionDate, text: "工作超时" })
        }
        // 打卡异常
        if (item.SignInCount) {
          listData.push({ color: '#108ee9', content: `打卡异常${item.SignInCount}次`, type: 1, date: item.ExcetionDate, text: "打卡异常" })
        }

        // 无异常
        if (!item.AlarmResponseCount && !item.OvertimeWorkCount && !item.SignInCount) {
          listData.push({ notAbnormal: true, date: item.ExcetionDate, type: "" })
        }
      }
    })
    return listData || [];
  }

  // 渲染单元格
  cellRender = (value) => {
    const dateFormat = this.state.mode === "month" ? "YYYY-MM-DD" : "YYYY-MM";
    const listData = this.getListData(value.format(dateFormat));
    // if (true) {
    //   return <Badge status={"success"} />
    // }
    // 无异常显示绿点
    if(listData.filter(item => item.notAbnormal).length){
      return <div style={{ marginTop: -22 }}>
        <Badge status={"success"} />
      </div>
    }
    return (
      <ul className="events" style={{width: "104%", height: "96%", overflow: "auto"}}>
        {listData.map(item => {
          // if (item.notAbnormal) {  // 无异常
          //   return <li style={{ marginTop: -20 }}><Badge status={"success"} /></li>
          // }
          return <li key={item.content} style={{ marginBottom: 2 }}>
            <Tag color={item.color} style={{ cursor: "pointer" }} onClick={(e) => {
              e.stopPropagation()
              this.updateState({ current: 1 });
              setTimeout(() => {
                this.abnormalItemClick(item)
              }, 0)
            }}>{item.content}</Tag>
          </li>
        })}
      </ul>
    );
  }

  // 异常点击事件
  abnormalItemClick = (data) => {
    this.setState({
      currentCellInfo: data,
      dateFormat: this.state.mode === "month" ? "YYYY年MM月DD日" : "YYYY年MM月"
    })
    const { abnormalForm } = this.props;
    const { type, date } = data;
    // 根据统计周期，计算开始及结束时间
    let scope = this.state.mode === "month" ? "day" : "month";
    let beginTime = moment(date).startOf(scope).format("YYYY-MM-DD HH:mm:ss");
    let endTime = moment(date).endOf(scope).format("YYYY-MM-DD HH:mm:ss");

    this.props.dispatch({
      type: "operations/getAbnormalDetailList",
      payload: {
        excptionType: type,
        beginTime: beginTime,
        endTime: endTime,
        pageIndex: abnormalForm.current,
        pageSize: abnormalForm.pageSize,
        IsQueryAllUser: true,
        IsPaging: true
      }
    })

    // this.setState({
    //   currentAbnormalData: data
    // })
  }

  updateState = (params) => {
    this.props.dispatch({
      type: 'operations/updateState',
      payload: {
        abnormalForm: {
          ...this.props.abnormalForm,
          ...params,
        }
      }
    });
  }

  // 分页
  onTableChange = (current, pageSize) => {
    this.updateState({ current })
    setTimeout(() => {
      // 获取表格数据
      this.abnormalItemClick(this.state.currentCellInfo, true)
    }, 0);
  }



  render() {
    const { abnormalDetailList, abnormalForm, loading } = this.props;
    const { currentCellInfo, dateFormat, listData } = this.state;
    const cardTitle = `${currentCellInfo.text} - ${moment(currentCellInfo.date).format(dateFormat)}`;
    return (
      <PageHeaderWrapper title="运维日历">
        <div className={styles.calendarWrapper}>
          <div style={{ display: "flex" }}>
            <div style={{ flex: 5, marginRight: 10 }}>
              <Card className="contentContainer">
                <Calendar
                  dateCellRender={this.cellRender}
                  monthCellRender={this.cellRender}
                  onSelect={(date) => {
                    // this.setState({
                    //   currentAbnormalData: {
                    //     ...currentAbnormalData,
                    //     text: '运维记录'
                    //   }
                    // })
                    this.updateState({ current: 1 });
                    setTimeout(() => {
                      this.abnormalItemClick({ date: date, type: "", text: "运维记录" })
                    }, 0)
                  }}
                  onPanelChange={(date, mode) => {
                    this.setState({
                      date, mode
                    }, () => {
                      this.getCalendarInfo();
                      // this.abnormalItemClick({ date: date, type: "", text: "运维记录" });
                    })
                  }}
                />
              </Card>
            </div>
            <div style={{ flex: 3 }}>
              <Card className="contentContainer" title={cardTitle} bordered={false}>
                <List
                  itemLayout="vertical"
                  size="large"
                  loading={loading}
                  pagination={{
                    size: "small",
                    showQuickJumper: true,
                    pageSize: abnormalForm.pageSize,
                    current: abnormalForm.current,
                    onChange: this.onTableChange,
                    total: abnormalForm.total
                  }}
                  dataSource={listData}
                  renderItem={item => (
                    <List.Item
                      key={item.title}
                    >
                      <List.Item.Meta
                        title={<a onClick={() => {
                          router.push(item.href);
                        }}>{item.title}</a>}
                        description={item.description}
                      />
                      {item.content}
                    </List.Item>
                  )}
                />
              </Card>
            </div>
          </div>
          {/* <Divider /> */}
          {/* <Card title={cardTitle} bordered={false}>
            <SdlTable
              dataSource={abnormalDetailList}
              columns={abnormalColums}
              defaultWidth={120}
              pagination={{
                // showSizeChanger: true,
                showQuickJumper: true,
                pageSize: abnormalForm.pageSize,
                current: abnormalForm.current,
                onChange: this.onTableChange,
                total: abnormalForm.total
              }}
            />
          </Card> */}

        </div>
      </PageHeaderWrapper>
    );
  }
}

export default CalendarPage;