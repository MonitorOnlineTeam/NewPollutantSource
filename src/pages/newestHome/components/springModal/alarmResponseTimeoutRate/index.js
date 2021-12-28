/*
 * @Author:jab
 * @Date: 2021.12.28
 * @Last Modified by: 
 * @Last Modified time: 
 * @Description: 报警响应超时弹框
 */
import React, { PureComponent } from 'react';
import { Modal } from "antd"
import { connect } from "dva"

import AbnormalWorkStatistics from '@/pages/IntelligentAnalysis/abnormalWorkStatistics'

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
    this.setState({
      queryCondition: undefined,
      queryConditions:undefined,
      cityLevel:true
    })
  }

  // 关闭弹窗
  onCancel = () => {
    this.props.onCancel()

  }

  render() {
    const { visible,type,time } = this.props
    return (
      <Modal
        title="报警响应超时率"
        width={"90vw"}
        visible={visible}
        footer={false}
        onCancel={this.onCancel}
        destroyOnClose
      >
        <AbnormalWorkStatistics time={time}  pollutantTypes={Number(type)} isResponseModal  hideBreadcrumb/>
      </Modal>
    );
  }
}

export default Index;