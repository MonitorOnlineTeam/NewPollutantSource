/*
 * @Author:jab
 * @Date: 2021.12.30
 * @Last Modified by: 
 * @Last Modified time: 
 * @Description: 计划巡检完成率弹框 计划校准完成率弹框
 */
import React, { PureComponent } from 'react';
import { Modal } from "antd"
import { connect } from "dva"

import PlanWorkOrderStatistics from '@/pages/IntelligentAnalysis/planWorkOrderStatistics'

@connect(({ loading, newestHome, autoForm }) => ({
}))
class Index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      show: true
    };
  }

  componentWillUnmount() {
  }

  // 关闭弹窗
  onCancel = () => {
    this.props.onCancel()

  }

  render() {
    const { visible,type,time,modalType } = this.props
    return (
      <Modal
        title= {modalType=='planCalibration'?"计划校准完成率":"计划巡检完成率"}
        width={"90vw"}
        visible={visible}
        footer={false}
        onCancel={this.onCancel}
        destroyOnClose
      >
        <PlanWorkOrderStatistics time={time}  pollutantTypes={Number(type)} isPlanCalibrationModal={modalType=='planCalibration'} isPlanInspectionModal={modalType=='planInspection'}  hideBreadcrumb/>
      </Modal>
    );
  }
}

export default Index;