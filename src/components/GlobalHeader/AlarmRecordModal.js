import React, { Component } from 'react';
import moment from 'moment';
import { Row, Col, Modal } from 'antd';
import AlarmRecord from '../../pages/monitoring/alarmrecord/components/AlarmRecord';

class AlarmRecordModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alarmTitle: '报警记录',
      visibleAlarmModal: false,
      DGIMN: null,
      firsttime: null,
      lasttime: null,
    };
  }

  showModal = (firsttime, lasttime, DGIMN, alarmTitle) => {
    debugger;
    this.setState({
      alarmTitle: alarmTitle,
      visibleAlarmModal: true,
      DGIMN: DGIMN,
      firsttime: firsttime,
      lasttime: lasttime,
    });
  };

  componentWillMount = () => {
    const { onRef } = this.props;
    onRef(this);
  };

  render() {
    const { alarmTitle, visibleAlarmModal, firsttime, lasttime, DGIMN } = this.state;
    return (
      <Modal
        title={
          <Row>
            <Col span={10}>{alarmTitle}</Col>
          </Row>
        }
        visible={visibleAlarmModal}
        onOk={this.handleOk}
        onCancel={() => {
          this.setState({ visibleAlarmModal: false });
        }}
        width="70%"
        footer={[]}
      >
        <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          <AlarmRecord
            DGIMN={DGIMN}
            firsttime={moment(firsttime)}
            lasttime={moment(lasttime).add(1, 'second')}
          />
        </div>
      </Modal>
    );
  }
}
export default AlarmRecordModal;
