import React, { PureComponent } from 'react'
import { Modal } from 'antd';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import EntWorkOrderStatistics from './components/EntWorkOrderStatistics';

class EntWorkOrderModal extends PureComponent {
 
  render() {
    const {showModal,onCloseListener,pollutantTypeCode='1'} = this.props; 
    return (
        <Modal
            title={'运维工单统计（企业）'}
            width={'90%'}
            visible={showModal}
            onCancel={onCloseListener}
            footer={null}
        >
            <EntWorkOrderStatistics pollutantTypeCode = {pollutantTypeCode}></EntWorkOrderStatistics>
        </Modal>
    );
  }
}

export default EntWorkOrderModal;
