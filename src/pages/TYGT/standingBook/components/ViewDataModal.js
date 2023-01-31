import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Modal, Select, DatePicker, Space, Button, Radio } from 'antd';
import ReactEcharts from 'echarts-for-react';
import FacilityData from './FacilityData'

const { RangePicker } = DatePicker

@connect(({ loading, standingBook, }) => ({
  viewDataVisible: standingBook.viewDataVisible,
}))
class ViewDataModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  handleCancel = () => {
    this.props.dispatch({
      type: 'standingBook/updateState',
      payload: {
        viewDataVisible: false
      }
    })
  }

  render() {
    const { viewDataVisible, type, facilityCode, paramsList } = this.props;
    return <Modal
      title="查看数据"
      width={'80vw'}
      visible={viewDataVisible}
      footer={false}
      onCancel={this.handleCancel}
    >
      <FacilityData type={type} facilityCode={facilityCode} paramsList={paramsList} />
    </Modal>
  }
}

export default ViewDataModal;