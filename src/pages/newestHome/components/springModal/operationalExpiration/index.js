/*
 * @Author:jab
 * @Date: 2021.12.22
 * @Last Modified by: 
 * @Last Modified time: 
 * @Description: 运营到期点位统计弹框
 */
import React, { PureComponent } from 'react';
import { Modal } from "antd"
import { connect } from "dva"
import Ent from "@/pages/monitoring/overView/realtime/Ent"

import OperationExpirePoint from "@/pages/IntelligentAnalysis/operationExpirePoint"

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
    const { visible,type } = this.props
    return (
      <Modal
        title="运营到期点位统计"
        wrapClassName='spreadOverModal'
        visible={visible}
        footer={false}
        onCancel={this.onCancel}
        destroyOnClose
      >
        <OperationExpirePoint pollutantTypes={type} hideBreadcrumb/>
      </Modal>
    );
  }
}

export default Index;