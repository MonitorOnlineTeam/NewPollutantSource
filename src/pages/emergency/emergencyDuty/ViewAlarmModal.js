import React, { PureComponent } from 'react';
import { Modal } from 'antd'
import AutoformView from '@/pages/AutoFormManager/AutoFormView'

class ViewAlarmModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    const { visible, onCancel, keysParams } = this.props;
    let title = "值班接警 - 详情";
    return (
      <Modal
        title={title}
        width="70vw"
        visible={visible}
        onCancel={() => this.props.onCancel()}
        bodyStyle={{ padding: 0 }}
        footer={false}
      >
        <AutoformView
          breadcrumb={false}
          configId='DutyAlarm'
          keysParams={keysParams}
        />
      </Modal>
    );
  }
}

export default ViewAlarmModal;