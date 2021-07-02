import React, { PureComponent } from 'react';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import { connect } from 'dva';
import { Card, Descriptions, Steps, Divider, Row, Col, Badge, Modal, Checkbox } from 'antd';
import { CheckCircleFilled, ClockCircleFilled, LoadingOutlined, SmileOutlined } from '@ant-design/icons';
import styles from '../index.less'
import { router } from 'umi';
import moment from 'moment'
import { ExclamationCircleOutlined } from '@ant-design/icons'


const { Step } = Steps;


@connect(({ loading, emergency }) => ({
  dutyOneData: emergency.dutyOneData,
  stepBarData: emergency.stepBarData,
}))
class index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      overStatus: true
    };
    this._SELF_ = {
      AlarmInfoCode: this.props.history.location.query.code,
    }
  }

  componentDidMount() {
    this._dispatch('emergency/getDutyOne', {
      AlarmInfoCode: this._SELF_.AlarmInfoCode
    })
    this.getStepBar();

  }

  // 获取任务进度
  getStepBar = () => {
    this._dispatch('emergency/getStepBar', {
      AlarmInfoCode: this._SELF_.AlarmInfoCode
    })
  }

  _dispatch = (type, payload, callback) => {
    this.props.dispatch({
      type: type,
      payload: payload,
      callback: (res) => {
        callback && callback(res)
      }
    })
  }

  getStepIcon = (type, index) => {
    if (type === 1) {
      // 已完成
      return <CheckCircleFilled style={{ fontSize: 34 }} />
    } else {
      // 进行中
      if (!this.state.stepCurrent) {
        this.setState({
          stepCurrent: index
        })
      }
      return <ClockCircleFilled style={{ color: "#35be8a", fontSize: 34 }} />
    }
  }

  // 结束
  endRecord = () => {
    this._dispatch('emergency/endRecord', {
      AlarmInfoCode: this._SELF_.AlarmInfoCode,
      Status: this.state.overStatus ? 1 : 0
    }, (res) => {
      this.getStepBar()
    })
  }

  render() {
    const { dutyOneData, stepBarData } = this.props;
    const { stepCurrent } = this.state;

    console.log('stepCurrent=', stepCurrent)
    return (
      <div id="autoHeight">

        <BreadcrumbWrapper>
          <Card title="内容描述" bodyStyle={{ padding: 20 }}>
            <Descriptions bordered>
              <Descriptions.Item label="事件名称">{dutyOneData.Comment}</Descriptions.Item>
              <Descriptions.Item label="事件地点">{dutyOneData.Address}</Descriptions.Item>
              <Descriptions.Item label="事件类型">{dutyOneData.InfoTypeName}</Descriptions.Item>
              <Descriptions.Item label="经度">{dutyOneData.Latitude}</Descriptions.Item>
              <Descriptions.Item label="纬度">{dutyOneData.Longitude}</Descriptions.Item>
              <Descriptions.Item label="甄别人">{dutyOneData.ScreenPerson}</Descriptions.Item>
              <Descriptions.Item label="事件级别">{dutyOneData.InfoLevelName}</Descriptions.Item>
              <Descriptions.Item label="主要污染物" span={2}>{dutyOneData.Pollutant}</Descriptions.Item>
              <Descriptions.Item label="发生时间">{dutyOneData.InTime}</Descriptions.Item>
              <Descriptions.Item label="甄别时间" span={2}>{moment(dutyOneData.ScreenBeginTime).format("YYYY-MM-DD")} - {moment(dutyOneData.ScreenEndTime).format("YYYY-MM-DD")}</Descriptions.Item>
              <Descriptions.Item label="涉事企业" span={3}>{dutyOneData.NarrationEnt}</Descriptions.Item>
            </Descriptions>
          </Card>
          <Card title="处置进度" style={{ marginTop: 10 }} bodyStyle={{ padding: 20, paddingTop: 30, overflow: 'auto' }}>
            {/* <Divider /> */}
            <Steps current={stepCurrent} size={'default'} style={{ minHeight: 70 }} className={styles.mySteps}>
              <Step icon={this.getStepIcon(stepBarData.AlarmStatus, 1)} title="接警" description={
                <div className={styles.descContent}>{stepBarData.AlarmTime}</div>
              }
              />
              <Step icon={this.getStepIcon(stepBarData.ScreenStatus, 2)} title={
                <div className={styles.stepDesc}>
                  <p>甄别</p>
                  <Row gutter={[3, 0]} className={styles.hoverContent}>
                    <Col span={12}>
                      <div className={`${styles.blue} ${styles.block}`} onClick={() => router.push('/emergency/identify?code=' + dutyOneData.AlarmInfoCode)}>地图甄别</div>
                    </Col>
                    <Col span={12}>
                      <div className={`${styles.green} ${styles.block}`} onClick={() => router.push('/emergency/emergencyDuty/details?code=' + dutyOneData.AlarmInfoCode)}>甄别详情</div>
                    </Col>
                  </Row>
                </div>
              } description={
                <div className={styles.descContent}>{stepBarData.ScreenTime}</div>
              } />
              <Step icon={this.getStepIcon(stepBarData.PlanStatus, 3)} title={
                <div className={styles.stepDesc}>
                  <p>启动预案</p>
                  <Row gutter={[3, 0]} className={styles.hoverContent}>
                    <Col span={24}>
                      <div className={`${styles.blue} ${styles.block}`}
                        onClick={() => router.push('/emergency/plan?code=' + dutyOneData.AlarmInfoCode)}
                      >启动预案</div>
                    </Col>
                  </Row>
                </div>
              } description={
                <div className={styles.descContent}>{stepBarData.PlanTime}</div>
              } />
              <Step icon={this.getStepIcon(stepBarData.DispatchStatus, 4)} title={
                <div className={styles.stepDesc}>
                  <p>处置调度</p>
                  <Row gutter={[3, 0]} className={styles.hoverContent}>
                    <Col span={12}>
                      <div className={`${styles.blue} ${styles.block}`}>地图调度</div>
                    </Col>
                    <Col span={12}>
                      <div className={`${styles.green} ${styles.block}`}
                        onClick={() => router.push('/emergency/dispatch?code=' + dutyOneData.AlarmInfoCode)}
                      >调度列表</div>
                    </Col>
                  </Row>
                </div>
              } description={
                <div className={styles.descContent}>{stepBarData.DispatchTime}</div>
              } />
              <Step icon={this.getStepIcon(stepBarData.SurveyStatus, 5)} title={
                <div className={styles.stepDesc}>
                  <p>处置监测</p>
                  <Row gutter={[3, 0]} className={styles.hoverContent}>
                    <Col span={24}>
                      <div className={`${styles.green} ${styles.block}`}
                        onClick={() => router.push('/emergency/monitor?code=' + dutyOneData.AlarmInfoCode)}
                      >环境应急监测</div>
                    </Col>
                  </Row>
                </div>
              } description={
                <div className={styles.descContent}>{stepBarData.SurveyTime}</div>
              } />
              <Step icon={this.getStepIcon(stepBarData.DisposeStatus, 6)} title={
                <div className={styles.stepDesc}>
                  <p>处置报告</p>
                  <Row gutter={[3, 0]} className={styles.hoverContent}>
                    <Col span={24}>
                      <div className={`${styles.blue} ${styles.block}`}
                        onClick={() => router.push('/emergency/disposalReport?code=' + dutyOneData.AlarmInfoCode)}
                      >处置报告</div>
                    </Col>
                  </Row>
                </div>
              } description={
                <div className={styles.descContent}>{stepBarData.DisposeTime}</div>
              } />
              <Step icon={this.getStepIcon(stepBarData.EndStatus, 7)} title={
                <div className={styles.stepDesc} onClick={() => {
                  Modal.confirm({
                    title: '提示',
                    icon: <ExclamationCircleOutlined />,
                    content: <div>
                      <p>确定应急事件处置结束！进入应急事件档案！</p>
                      <p style={{ color: '#666' }}>
                        <Checkbox defaultChecked onChange={(e) => {
                          this.setState({ overStatus: e.target.checked })
                        }}>生成应急案例</Checkbox>
                      </p>
                    </div>,
                    onOk: () => {
                      this.endRecord()
                    },
                    okText: '确认',
                    cancelText: '取消',
                  });
                }}>
                  <p>结束</p>
                </div>
              } description={
                <div className={styles.descContent}>{stepBarData.EndTime}</div>
              } />
            </Steps>
          </Card>
        </BreadcrumbWrapper>
      </div>
    );
  }
}

export default index;