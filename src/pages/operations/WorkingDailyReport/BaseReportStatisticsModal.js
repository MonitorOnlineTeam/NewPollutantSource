/*
 * 统计弹窗
 * @Author: Jiaqi
 * @Date: 2019-04-23 13:57:13
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2019-04-26 10:56:33
 */

import React, { PureComponent } from 'react';
import { Modal, Button, Row, Col, message } from 'antd';
import { connect } from 'dva';
import moment from 'moment';

@connect()
class BaseReportStatisticsModal extends PureComponent {
  constructor(props) {
    super(props);
    this.cycle = moment().format('DD') > 20 ? 0 : 1;

    this.state = {
      visible: props.visible,
      start: moment()
        .add(this.cycle === 0 ? -1 : -2, 'months')
        .format('YYYY-MM-21 00:00:00'),
      end: moment()
        .add(this.cycle === 0 ? -0 : -1, 'months')
        .format('YYYY-MM-20 23:59:59'),
      // start: `${moment().get('year')}-${moment().get('month') < 10 ? ('0' + moment().get('month') - this.cycle) : moment().get('month') - this.cycle}-21 00:00:00`,
      // end: `${moment().add(-this.cycle, 'month').format('YYYY-MM')}-20 23:59:59`,
    };

    this.handleOk = this.handleOk.bind(this);
  }

  handleOk(e) {
    if (!this.state.start || !this.state.end) {
      message.error('请选择统计时间！');
      return;
    }
    this.props.onOk(this.state.start, this.state.end);
  }

  handleCancel = e => {
    this.props.onCancel();
  };

  render() {
    return (
      <Modal
        title="统计"
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            取消
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={this.props.statisLoading}
            onClick={this.handleOk}
          >
            统计
          </Button>,
        ]}
      >
        <Row>
          <Col span="24" style={{ marginTop: 6, color: '#444' }}>
            <span>
              统计周期为{' '}
              <span style={{ color: '#e62d2de3' }}>
                {this.state.start} - {this.state.end}
              </span>
              ， 确认是否统计？
            </span>
          </Col>
          {/* <Col span="12">
            <MonthPicker onChange={this.changeMonth} placeholder="Select month" />
          </Col> */}
        </Row>
      </Modal>
    );
  }
}

export default BaseReportStatisticsModal;
