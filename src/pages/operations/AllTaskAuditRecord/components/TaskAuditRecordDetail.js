/*
 * @desc: 任务单详情
 * @Author: Jiaqi
 * @Date: 2019-04-25 17:10:04
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2019-05-14 13:47:23
 */
import React, { PureComponent } from 'react';
import { Button, Card, Icon, Spin } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import MonitorContent from '../../../../components/MonitorContent/index';
import DescriptionList from '../../../../components/DescriptionList';

const { Description } = DescriptionList;

@connect(({ loading, tasklist }) => ({
  loading: loading.effects['tasklist/getTaskDetails'],
  taskDetails: tasklist.taskDetails,
}))
class TaskAuditRecordDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};

    this.navigation = {
      Name: props.route.name || '任务单审批',
      Url: props.route.back || '/operation/TaskAuditRecordList',
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'tasklist/getTaskDetails',
      payload: {
        ID: this.props.match.params.auditId,
      },
    });
  }

  getGoBack = () => {
    const {
      history,
      goback,
      taskDetails,
      match: { params },
      route,
    } = this.props;
    return (
      <React.Fragment>
        <Button
          style={{ float: 'right', marginRight: 10 }}
          onClick={() => {
            history.goBack(-1);
          }}
        >
          <Icon type="left" />
          返回
        </Button>
        <Button
          style={{ float: 'right', marginRight: 10 }}
          onClick={() => {
            const url = route.name ? 'AllTaskAuditRecordList' : 'TaskAuditRecordList';
            this.props.dispatch(
              routerRedux.push(
                `/TaskDetail/emergencydetailinfolayout/${url}/${taskDetails.TaskID}/${this.props.taskDetails.DGIMN}/${params.auditId}`,
              ),
            );
          }}
        >
          任务单
        </Button>
      </React.Fragment>
    );
  };

  render() {
    const { taskDetails, match } = this.props;

    if (this.props.loading) {
      return (
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
      );
    }
    return (
      <MonitorContent
        {...this.props}
        breadCrumbList={[
          { Name: '智能运维', Url: '' },
          { ...this.navigation },
          { Name: '审批单详情', Url: '' },
        ]}
      >
        <Card
          title="审批单详情"
          extra={
            <div>
              <span style={{ marginRight: 20 }}></span>
              {this.getGoBack()}
            </div>
          }
        >
          <DescriptionList size="large" col="4">
            <Description term="省/市/县区">{taskDetails.ProvinceAndCity}</Description>
            <Description term="企业">{taskDetails.EntName}</Description>
            <Description term="监测点">{taskDetails.PointName}</Description>
            <Description term="审批编号">{taskDetails.ExamNumber}</Description>
          </DescriptionList>
          <DescriptionList style={{ marginTop: 20 }} size="large" col="4">
            <Description term="任务类型">{taskDetails.TaskContenType}</Description>
            <Description term="申请人">{taskDetails.ImpPerson}</Description>
            <Description term="申请时间">{taskDetails.CreateTime}</Description>
            <Description term="执行日期">
              {taskDetails.ImpTime && moment(taskDetails.ImpTime).format('YYYY-MM-DD')}
            </Description>
          </DescriptionList>
          <DescriptionList style={{ marginTop: 20 }} size="large" col="4">
            <Description term="审批状态">{taskDetails.ExamStaus}</Description>
            <Description term="审批意见">{taskDetails.ExamMsg}</Description>
            <Description term="备注">{taskDetails.Msg}</Description>
          </DescriptionList>
        </Card>
      </MonitorContent>
    );
  }
}
export default TaskAuditRecordDetail;
