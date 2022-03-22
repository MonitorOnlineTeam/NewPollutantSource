import React, { PureComponent } from 'react';
import { Modal } from 'antd'
import AutoformAdd from '@/pages/AutoFormManager/AutoFormAdd'
import AutoformEdit from '@/pages/AutoFormManager/AutoFormEdit'

class CreateAndEditAlarmModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    const { visible, onCancel, isEdit, keysParams } = this.props;
    let title = isEdit ? "值班接警 - 编辑" : "值班接警 - 添加";
    return (
      <Modal
        title={title}
        width="60vw"
        visible={visible}
        onCancel={() => this.props.onCancel()}
        bodyStyle={{ padding: 0 }}
        footer={false}
      >
        {
          isEdit ?
            <AutoformEdit
              breadcrumb={false}
              configId='DutyAlarm'
              keysParams={keysParams}
              onClickBack={() => this.props.onCancel()}
              successCallback={this.props.onCreateSuccess}
            />
            :
            <AutoformAdd
              breadcrumb={false}
              onClickBack={() => this.props.onCancel()}
              configId='DutyAlarm'
              successCallback={this.props.onCreateSuccess}
            />
        }
      </Modal>
    );
  }
}

export default CreateAndEditAlarmModal;