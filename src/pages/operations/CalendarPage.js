/*
 * @Author: Jiaqi
 * @Date: 2019-10-15 14:35:27
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2019-10-22 10:47:21
 * @desc: 运维日历页面
 */
import React, { PureComponent } from 'react';
import { Calendar, Badge, Card, Divider, Tag, Empty, message, List, Modal, Spin, Popover, Button, } from 'antd';
import { connect } from 'dva';
import { router } from 'umi';
import moment from 'moment';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import SdlTable from '@/components/SdlTable'
import styles from './index.less'
import TaskRecordDetails from '@/pages/EmergencyTodoList/EmergencyDetailInfoLayout'
import EntAbnormalMapModal from '@/pages/IntelligentAnalysis/abnormalWorkStatistics/components/EntAbnormalMapModal'


@connect(({ loading, operations, abnormalWorkStatistics, }) => ({
  calendarList: operations.calendarList,
  abnormalDetailList: operations.abnormalDetailList,
  abnormalForm: operations.abnormalForm,
  futureDetailList: operations.futureDetailList,
  modalTableDataSource: operations.modalTableDataSource,
  modalTableTotal: operations.modalTableTotal,
  loading: loading.effects["operations/getAbnormalDetailList"],
  calendarInfoLoading: loading.effects["operations/getCalendarInfo"],
  queryPar: abnormalWorkStatistics.queryPar,
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
      visible: false,
      columns: [],
      modalTableCurrent: 1,
      currentClickTagParams: {},
      taskRecordDetailVisible: false,
      TaskID: null,
      DGIMN: null,
      // pageInfo: {
      //   pageIndex: 1,
      //   pageSize: 10
      // }
      abnormalTitle: '',
    };
  }

  componentDidMount() {
    this.getCalendarInfo();
    this.abnormalItemClick({ date: moment(), type: 0, text: "运维记录" });
    this.props.dispatch({ type: `abnormalWorkStatistics/updateState`, payload: { entAbnormalNumVisible: false, }, })

  }

  componentWillReceiveProps(nextProps) {
    if (this.props.abnormalDetailList !== nextProps.abnormalDetailList) {
      const listData = nextProps.abnormalDetailList.map(item => {
        return {
          // href: `/operations/calendar/details/${item.TaskID}/${item.TaskID}`,
          title: <div>
            <span style={{ marginRight: 8, cursor: 'pointer', }} onClick={(e) => {
              this.setState({ taskRecordDetailVisible: true, TaskID: item.TaskID, DGIMN: item.TaskID, })
            }}>{item.EnterpriseName}</span>
            {
              item.ExceptionTypeText && item.ExceptionTypeText.split(",").map(itm => {
                // 报警响应异常,打卡异常,工作超时
                let color = itm === "报警响应异常" ? "#f50" : (itm === "打卡异常" ? "#108ee9" : "#2db7f5")
                return <Popover
                  content={<Button type="link" onClick={() => this.exceptionDetail(item)}>详情</Button>}
                  overlayClassName={styles.exceptionTypePopSty}
                  zIndex={99}
                  visible={itm === "打卡异常"}
                  getPopupContainer={trigger => trigger.parentNode}
                >
                  <Tag color={color}>{itm}</Tag>
                </Popover>
              })
            }
          </div>,
          description: <div style={{ color: "#333" }}>
            {item.PointName}
            {
              item.TaskType === 2 && <Tag color="#ff5506" style={{ position: "relative", top: '0px', marginLeft: 4 }} >应急</Tag>
            }

          </div>,
          content:
            <div>
              {item.TaskRecordTypeName && <span style={{ paddingRight: 8, }}> 任务类型：{
                item.TaskRecordTypeName.map(item => <Tag color="processing">{item.TypeName}</Tag>)
              }</span>}
              <span>运维人：{item.OperationName} <Tag color={item.TaskStatus === 3 ? "green" : "volcano"}>{item.TaskStatusText}</Tag></span>
            </div>
        }
      })
      this.setState({
        listData: listData
      })
    }
    // 未来
    if (this.props.futureDetailList !== nextProps.futureDetailList) {
      const futureListData = nextProps.futureDetailList.map(item => {
        return {
          href: "",
          title: <div>
            <span style={{ marginRight: 8 }}>{item.EnterpriseName}</span>
            {item.SparePartCount ? <Tag color="#f50" style={{ cursor: 'pointer' }} onClick={(e) => { this.onTagClick(e, item, 1) }}>需更换备件</Tag> : null}
            {/* {item.SparePartCount}个 */}
            {item.ConsumablesCount ? <Tag color="#2db7f5" style={{ cursor: 'pointer' }} onClick={(e) => { this.onTagClick(e, item, 2) }}>需更换易耗品</Tag> : null}
            {/* {item.ConsumablesCount}个 */}
            {item.StandardGasCount ? <Tag color="#108ee9" style={{ cursor: 'pointer' }} onClick={(e) => { this.onTagClick(e, item, 3) }}>需更换标气</Tag> : null}
            {/* {item.StandardGasCount}个 */}
            {item.MaintainCount ? <Tag color="#87d068" style={{ cursor: 'pointer' }} onClick={(e) => { this.onTagClick(e, item, 4) }}>需保养</Tag> : null}
            {/* {item.MaintainCount}个 */}
            {item.V233 ? <Tag color="#FACD27" style={{ cursor: 'pointer' }} >需日常巡检</Tag> : null}
            {/* {item.V233}个 */}
            {item.V235 ? <Tag color="#FACD27" style={{ cursor: 'pointer' }} >需校准</Tag> : null}
            {/* {item.V235} */}
            {item.V236 ? <Tag color="#FACD27" style={{ cursor: 'pointer' }} >需校验</Tag> : null}
            {/* {item.V236}个 */}
          </div>,
          description: <div style={{ color: "#333" }}>
            {item.PointName}
          </div>,
          content:
            <div>
              <div>运维人：{item.OperationName}</div>
            </div>

        }
      })
      this.setState({
        listData: futureListData
      })
    }
  }
  exceptionDetail = (row) => { //打卡异常详情
    this.props.dispatch({ type: `abnormalWorkStatistics/updateState`, payload: { entAbnormalNumVisible: true, }, })
    this.setState({ abnormalTitle: `${row.EnterpriseName} - ${row.PointName}`})
    setTimeout(() => {

      // 根据统计周期，计算开始及结束时间
      const scope = this.state.mode === "month" ? "day" : "month";
      const date = this.state.currentCellInfo.date;
      const beginTime = moment(date).startOf(scope).format("YYYY-MM-DD HH:mm:ss");
      const endTime = moment(date).endOf(scope).format("YYYY-MM-DD HH:mm:ss");
      this.props.dispatch({ type: `abnormalWorkStatistics/updateState`, payload: { queryPar: { ...this.props.queryPar, beginTime: beginTime, endTime: endTime, } } })
      this.props.dispatch({
        type: `abnormalWorkStatistics/getPointExceptionSignList`,
        payload: {
          beginTime: beginTime,
          endTime: endTime,
          DGIMN: row.DGIMN,
          taskID:row.TaskID,
        },
      }
      )
    })
  }
  // tag点击事件
  onTagClick = (e, item, type) => {
    e.stopPropagation();
    console.log('item=', item)
    // 根据统计周期，计算开始及结束时间
    let scope = this.state.mode === "month" ? "day" : "month";
    let date = this.state.currentCellInfo.date;
    let beginTime = moment(date).startOf(scope).format("YYYY-MM-DD HH:mm:ss");
    let endTime = moment(date).endOf(scope).format("YYYY-MM-DD HH:mm:ss");

    const payload = {
      // TaskID: item.TaskID,
      Type: type,
      beginTime: beginTime,
      endTime: endTime,
      DGIMN: item.DGIMN,
    }

    this.setState({
      currentClickTagParams: payload,
      modalTableCurrent: 1,
    }, () => {
      this.onModalTableData()
    })

    let columns = [];
    switch (type) {
      case 1:
        // 备件更换
        columns = [
          {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            width: 60,
            render: (text, record, index) => {
              return index + 1;
            }
          }, {
            title: '上次更换日期',
            dataIndex: 'ReplaceDate',
            key: 'ReplaceDate',
          }, {
            title: '部件名称',
            dataIndex: 'ConsumablesName',
            key: 'ConsumablesName',
          }, {
            title: '规格型号',
            dataIndex: 'Model',
            key: 'Model',
          }, {
            title: '单位',
            dataIndex: 'Unit',
            key: 'Unit',
          }, {
            title: '数量',
            dataIndex: 'Num',
            key: 'Num',
          }, {
            title: '更换原因',
            dataIndex: 'Remark',
            key: 'Remark',
          },
        ]
        break;
      case 2:
        // 易耗品
        columns = [
          {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            width: 60,
            render: (text, record, index) => {
              return index + 1;
            }
          }, {
            title: '上次更换日期',
            dataIndex: 'ReplaceDate',
            key: 'ReplaceDate',
          }, {
            title: '易耗品名称',
            dataIndex: 'ConsumablesName',
            key: 'ConsumablesName',
          }, {
            title: '规格型号',
            dataIndex: 'Model',
            key: 'Model',
          }, {
            title: '单位',
            dataIndex: 'Unit',
            key: 'Unit',
          }, {
            title: '数量',
            dataIndex: 'Num',
            key: 'Num',
          }, {
            title: '更换原因',
            dataIndex: 'Remark',
            key: 'Remark',
          },
        ]
        break;
      case 3:
        // 标气更换
        columns = [
          {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            width: 60,
            render: (text, record, index) => {
              return index + 1;
            }
          }, {
            title: '上次更换日期',
            dataIndex: 'ReplaceDate',
            key: 'ReplaceDate',
          }, {
            title: '标准物质名称',
            dataIndex: 'StandardGasName',
            key: 'StandardGasName',
          }, {
            title: '气体浓度',
            dataIndex: 'GasStrength',
            key: 'GasStrength',
          }, {
            title: '单位',
            dataIndex: 'Unit',
            key: 'Unit',
          }, {
            title: '数量',
            dataIndex: 'Num',
            key: 'Num',
          }, {
            title: '供应商',
            dataIndex: 'Supplier',
            key: 'Supplier',
          },
        ]
        break;
      case 4:
        // 保养更换
        columns = [
          {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            width: 60,
            render: (text, record, index) => {
              return index + 1;
            }
          }, {
            title: '上次更换日期',
            dataIndex: 'DateOfChange',
            key: 'DateOfChange',
          }, {
            title: '保养内容',
            dataIndex: 'MaintainName',
            key: 'MaintainName',
          }, {
            title: '备注',
            dataIndex: 'Remark',
            key: 'Remark',
          }
        ]
        break;
    }
    this.setState({
      visible: true,
      columns: columns
    })
  }

  onModalTableData = () => {
    // 获取弹窗表格数据
    this.props.dispatch({
      type: "operations/getOperationReplacePageList",
      payload: {
        ...this.state.currentClickTagParams,
        pageIndex: this.state.modalTableCurrent,
        pageSize: 10
      }
    })
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
      // 今天以前
      if (item.ExcetionDate === value) {
        // 异常任务  0全部类型  4异常任务（全部）1 待执行 2 进行中 3 已完成
        if (item.ExceptionTaskNum) {
          listData.push({ color: '#f50', content: `异常任务${item.ExceptionTaskNum}个`, type: 4, date: item.ExcetionDate, text: "异常任务" })
        }
        // 完成任务
        if (item.CompleteTaskNum) {
          listData.push({ color: '#87d068', content: `完成任务${item.CompleteTaskNum}个`, type: 3, date: item.ExcetionDate, text: "完成任务" })
        }
        // 待执行任务
        if (item.ExecutedTaskNum) {
          listData.push({ color: '#108ee9', content: `待执行任务${item.ExecutedTaskNum}个`, type: 1, date: item.ExcetionDate, text: "待执行任务" })
        }
        // 执行中任务
        if (item.HaveInHandTaskNum) {
          listData.push({ color: '#2db7f5', content: `进行中任务${item.HaveInHandTaskNum}个`, type: 2, date: item.ExcetionDate, text: "进行中任务" })
        }
        // 无异常
        if (!item.ExceptionTaskNum && !item.CompleteTaskNum && !item.ExecutedTaskNum && !item.HaveInHandTaskNum) {
          listData.push({ notAbnormal: true, date: item.ExcetionDate, type: 0 })
        }
        // 系统关闭任务
        if (item.HaveInHandTaskNum) {
          listData.push({ color: '#bfbfbf', content: `系统关闭任务${item.ColseTaskNum}个`, type: 10, date: item.ExcetionDate, text: "系统关闭任务" })
        }
      }
      // 未来 0全部  1 备件更换  2 易耗品更换 3标气更换 4 清理点位（保养）
      if (item.FutureDate === value) {
        // 需备件更换个数
        if (item.SparePartTotal) {
          listData.push({ color: '#f50', content: `需备件更换${item.SparePartTotal}个`, type: 1, date: item.FutureDate, text: "需备件更换个数", future: true })
        }
        // 需易耗品更换个数
        if (item.ConsumablesTotal) {
          listData.push({ color: '#2db7f5', content: `需易耗品更换${item.ConsumablesTotal}个`, type: 2, date: item.FutureDate, text: "需易耗品更换个数", future: true })
        }
        // 需标气更换个数
        if (item.StandardGasTotal) {
          listData.push({ color: '#108ee9', content: `需标气更换${item.StandardGasTotal}个`, type: 3, date: item.FutureDate, text: "需标气更换个数", future: true })
        }
        // 需清理个数
        if (item.MaintainTotal) {
          listData.push({ color: '#87d068', content: `需保养${item.MaintainTotal}个`, type: 4, date: item.FutureDate, text: "需保养个数", future: true })
        }


        // 需日常运维提醒个数
        if (item.M233Total) {
          listData.push({ color: '#FACD27', content: `需日常巡检${item.M233Total}个`, type: 5, date: item.FutureDate, text: "需日常巡检监测点个数", future: true })
        }
        // 需校准周期提醒个数
        if (item.M235Total) {
          listData.push({ color: '#FACD27', content: `需校准${item.M235Total}个`, type: 6, date: item.FutureDate, text: "需校准监测点个数", future: true })
        }
        // 需校验周期提醒个数
        if (item.M236Total) {
          listData.push({ color: '#FACD27', content: `需校验${item.M236Total}个`, type: 7, date: item.FutureDate, text: "需校验监测点个数", future: true })
        }

        // 无异常
        if (!item.SparePartTotal && !item.ConsumablesTotal && !item.StandardGasTotal && !item.MaintainTotal && !item.M233Total && !item.M235Total && !item.M236Total) {
          listData.push({ notAbnormal: true, date: item.FutureDate, type: 0, future: true })
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
    if (listData.filter(item => item.notAbnormal).length) {
      return <div style={{ marginTop: -22 }}>
        <Badge status={"success"} />
      </div>
    }
    return (
      <ul className="events" style={{ width: "104%", height: "96%", overflow: "auto" }}>
        {listData.map(item => {
          // if (item.notAbnormal) {  // 无异常
          //   return <li style={{ marginTop: -20 }}><Badge status={"success"} /></li>
          // }
          return <li key={item.content} style={{ marginBottom: 2 }}>
            <Tag color={item.color} style={{ cursor: "pointer", lineHeight: "19px", height: 20 }} onClick={(e) => {
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
    const { type, date, future } = data;
    // 根据统计周期，计算开始及结束时间
    let scope = this.state.mode === "month" ? "day" : "month";
    let beginTime = moment(date).startOf(scope).format("YYYY-MM-DD HH:mm:ss");
    let endTime = moment(date).endOf(scope).format("YYYY-MM-DD HH:mm:ss");
    // 判断传参
    let payload = future ? {
      exceptionType: undefined,
      FutureType: type
    } : {
        exceptionType: type,
        FutureType: undefined
      }


    this.props.dispatch({
      type: "operations/getAbnormalDetailList",
      payload: {
        // exceptionType: type,
        beginTime: beginTime,
        endTime: endTime,
        pageIndex: abnormalForm.current,
        pageSize: abnormalForm.pageSize,
        IsQueryAllUser: true,
        IsPaging: true,
        ...payload
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
    this.updateState({ current, pageSize})
    setTimeout(() => {
      // 获取表格数据
      this.abnormalItemClick(this.state.currentCellInfo, true)
    }, 0);
  }

  onModalTableChange = (current, pageSize) => {
    this.setState({
      modalTableCurrent: current
    }, () => {
      // 获取表格数据
      this.onModalTableData()
    })
    // setTimeout(() => {

    // }, 0);
  }



  render() {
    const { abnormalDetailList, abnormalForm, loading, calendarInfoLoading, modalTableDataSource, modalTableTotal } = this.props;
    const { currentCellInfo, dateFormat, listData, columns, modalTableCurrent, taskRecordDetailVisible, abnormalTitle, } = this.state;
    const cardTitle = `${currentCellInfo.text} - ${moment(currentCellInfo.date).format(dateFormat)}`;
    return (
      <BreadcrumbWrapper title="运维日历">
        <div className={styles.calendarWrapper}>
          <div style={{ display: "flex" }}>
            <div style={{ flex: 5, marginRight: 10 }}>
              <Card className="contentContainer">
                <Spin spinning={calendarInfoLoading} style={{ top: '25%' }}>
                  <Calendar
                    dateCellRender={this.cellRender}
                    monthCellRender={this.cellRender}
                    onSelect={(date) => {
                      const isAfter = moment().isBefore(moment(date));
                      // this.setState({
                      //   currentAbnormalData: {
                      //     ...currentAbnormalData,
                      //     text: '运维记录'
                      //   }
                      // })
                      this.updateState({ current: 1 });
                      setTimeout(() => {
                        this.abnormalItemClick({ date: date, type: 0, text: "运维记录", future: isAfter })
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
                </Spin>
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
                    total: abnormalForm.total,
                    pageSizeOptions:[6,10,20,50,100]
                  }}
                  dataSource={listData}
                  renderItem={item => (
                    <List.Item
                      key={item.title}
                    >
                      <List.Item.Meta
                        title={
                          item.href ?
                            <a onClick={() => { router.push(item.href); }}>{item.title}</a> :
                            <span>{item.title}</span>
                        }
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
          <Modal
            title="详情"
            width={"70%"}
            visible={this.state.visible}
            footer={null}
            onCancel={() => { this.setState({ visible: false }) }}
          >
            <SdlTable
              dataSource={modalTableDataSource}
              columns={columns}
              pagination={{
                // showSizeChanger: true,
                showQuickJumper: true,
                pageSize: 10,
                current: modalTableCurrent,
                onChange: this.onModalTableChange,
                total: modalTableTotal
              }}
            />
          </Modal>
          <Modal
            title="任务详情"
            visible={taskRecordDetailVisible}
            destroyOnClose
            wrapClassName='spreadOverModal'
            footer={null}
            onCancel={() => {
              this.setState({ taskRecordDetailVisible: false })
            }}

          >
            <TaskRecordDetails
              match={{ params: { TaskID: this.state.TaskID, DGIMN: this.state.DGIMN } }}
              isHomeModal
              hideBreadcrumb
            />
          </Modal>
          {/** 打卡异常  监测点 弹框 */}
          <EntAbnormalMapModal  abnormalTitle={abnormalTitle} />
        </div>
      </BreadcrumbWrapper>
    );
  }
}

export default CalendarPage;
