import React, { PureComponent } from 'react';
import { Calendar, Badge, Card, Divider, Tag, Empty, message } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import EnumOperationExceptionType from '@/utils/enum'
import SdlTable from '@/components/SdlTable'
import styles from './index.less'

// 企业名称、排口名称、运维状态、运维人、任务来源、任务状态、操作（详细）
const columns = [
  {
    title: '企业名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '排口名称',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '运维状态',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: '运维人',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: '任务来源',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: '任务状态',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: '操作',
    render: (text, record) => {
      return <a>详情</a>
    }
  },
];
// 企业名称、排口名称、运维状态、任务来源、任务状态、运维人、操作（详细）
const abnormalColums = [
  {
    title: '企业名称',
    dataIndex: 'EnterpriseName',
    key: 'EnterpriseName',
    width: 240
  },
  {
    title: '排口名称',
    dataIndex: 'PointName',
    key: 'PointName',
  },
  {
    title: '运维状态',
    dataIndex: 'ExceptionTypeText',
    key: 'ExceptionTypeText',
  },
  {
    title: '任务来源',
    dataIndex: 'TaskFromText',
    key: 'TaskFromText',
  },
  {
    title: '任务状态',
    dataIndex: 'TaskStatusText',
    key: 'TaskStatusText',
  },
  {
    title: '运维人',
    dataIndex: 'OperationName',
    key: 'OperationName',
  },
  {
    title: '操作',
    render: (text, record) => {
      return <a>详情</a>
    }
  },
];

@connect(({ loading, operations }) => ({
  calendarList: operations.calendarList,
  abnormalDetailList: operations.abnormalDetailList,
  abnormalForm: operations.abnormalForm,
}))
class Log extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      date: moment(),
      mode: "month",
      dateFormat: "YYYY年MM月DD日",
      currentCellInfo: {}
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
    return (
      <ul className="events">
        {listData.map(item => {
          if (item.notAbnormal) {  // 无异常
            return <li style={{ marginTop: -20 }}><Badge status={"success"} /></li>
          }
          return <li key={item.content} style={{ marginBottom: 2 }}>
            <Tag color={item.color} onClick={(e) => {
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

    // window.scrollTo(0, 400);
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
    const { abnormalDetailList, abnormalForm } = this.props;
    const { currentCellInfo, dateFormat } = this.state;

    const cardTitle = `${currentCellInfo.text} - ${moment(currentCellInfo.date).format(dateFormat)}`;
    return (
      <PageHeaderWrapper>
        {/* <div style={{ display: "flex", height: "calc(100vh - 64px)" }}>
          <div style={{ flex: 3, marginRight: 10 }}>
            <Card>
              <Calendar dateCellRender={this.dateCellRender} monthCellRender={this.monthCellRender}></Calendar>
            </Card>
          </div>
          <div style={{ flex: 4 }}>
            <Card title="运维记录 - 2019年08月13日" bordered={false}>
              <SdlTable dataSource={dataSource} columns={columns} />
            </Card>
          </div>
        </div> */}
        <Card className={styles.calendarWrapper}>
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
              console.log('date=', moment(date).format("YYYY-MM-DD HH:mm:ss"))
              console.log('stateDate=', moment(this.state.date).format("YYYY-MM-DD HH:mm:ss"))
              console.log('mode=', mode);
              console.log('stateMode=', this.state.mode)
              this.setState({
                date, mode
              }, () => {
                this.getCalendarInfo();
                // this.abnormalItemClick({ date: date, type: "", text: "运维记录" });
              })
            }}
          />
          {/* <Divider /> */}
          <Card title={cardTitle} bordered={false}>
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
          </Card>

        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Log;