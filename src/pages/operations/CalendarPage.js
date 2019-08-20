import React, { Component } from 'react';
import { Card, Select, Timeline, Icon, Tag, Pagination, Empty, Modal, Upload, message } from 'antd'
import { connect } from 'dva';
import moment from 'moment';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import NavigationTree from '@/components/NavigationTree'
import RangePicker_ from '@/components/RangePicker'
import styles from './index.less'

const { Option } = Select;

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

@connect(({ operations, loading }) => ({
  recordTypeList: operations.recordTypeList,
  timeLineList: operations.timeLineList,
  timeLineTotal: operations.timeLineTotal,
  imageList: operations.imageList,
}))
class CalendarPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentRecordType: "",
      dateValues: [moment().subtract(3, 'month').startOf("day"), moment().endOf("day")],
      current: 1,
      pageIndex: 10,
      previewVisible: false,
      previewImage: "",
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
          key={item.RecordDate}
        >
          {/* <div className={styles.DateLoad}> */}
          <p className={styles.taskDate}><Tag className={styles.dateContent}>{moment(item.RecordDate).format("YYYY-MM-DD")}</Tag></p>
          {/* </div> */}
        </Timeline.Item>
      )

      item.Nodes.map(node => {
        timelineItems.push(
          <Timeline.Item
            dot={<Icon type={node.Icon} style={{ fontSize: '20px', color: this.getStatusColor(node.TypeID) }} />}
            position="left"
            // key={node.MainFormID}
          >
            {`${node.CreateUser}${node.DisplayInfo}`}
            <br />
            <Tag
              color="#43b9ff"
              style={{ cursor: 'pointer', marginTop: 10, borderRadius: 13, padding: "0 20px", fontSize: 13 }}
              onClick={() => {
                this.getOperationImageList(node)
              }}
            >
              查看详情
            </Tag>
          </Timeline.Item>
        )
      })
    })
    return timelineItems;
  }

  // 获取运维日志数据
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

  // 获取详情图片
  getOperationImageList = (data) => {
    this.props.dispatch({
      type: "operations/getOperationImageList",
      payload: {
        FormMainID: data.MainFormID
      },
      callback: (res) => {
        if(res.Datas){
          this.setState({
            visible: true
          })
        }else {
          message.warning("暂无数据！")
        }

      }
    })
  }

  paginationChange = (current, pageSize) => {
    this.setState({
      current
    }, () => {
      this.getOperationLogList()
    })
  }

  modalHandleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
      // previewVisible: false,
    });
  };

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    console.log('file=',file)
    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };


  render() {
    const { recordTypeList, timeLineList, timeLineTotal, imageList } = this.props;
    const { dateValues, current, previewVisible, previewImage } = this.state;
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
                        return <Option value={item.TypeId} key={item.TypeId}>{item.CnName}</Option>
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
        <Modal
          title="详情"
          visible={this.state.visible}
          footer=""
          // onOk={this.handleOk}
          onCancel={this.modalHandleCancel}
        >
          <div style={{overflow: "hidden"}}>
            <Upload
              action=""
              listType="picture-card"
              fileList={imageList}
              disabled
              onPreview={this.handlePreview}
            // onChange={this.handleChange}
            >
              {/* {fileList.length >= 8 ? null : uploadButton} */}
            </Upload>
            <Modal visible={previewVisible} width={800} footer={null} onCancel={() => {
              this.setState({
                previewVisible: false
              })
            }}>
              <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
          </div>
        </Modal>
      </>
    );
  }
}

export default CalendarPage;
