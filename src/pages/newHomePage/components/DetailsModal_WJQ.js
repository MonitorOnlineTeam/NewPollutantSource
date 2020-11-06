/*
 * @Author: Jiaqi 
 * @Date: 2020-11-06 15:29:02 
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2020-11-06 17:26:03
 * @Description: 废气废水监测点弹窗
 */
import React, { PureComponent } from 'react';
import { Modal } from "antd"
import { connect } from "dva"
import Ent from "@/pages/monitoring/overView/realtime/Ent"
import exceptionrecordNew from "@/pages/monitoring/exceptionrecordNew"

@connect(({ loading, home, autoForm }) => ({
  detailsModalVisible_WJQ: home.detailsModalVisible_WJQ,
}))
class DetailsModal_WJQ extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // 关闭弹窗
  onCancel = () => {
    this.props.onCancel()
  }

  render() {
    const { status, stopStatus, defaultPollutantCode, time } = this.props
    return (
      <Modal
        title="详情"
        width={"90vw"}
        // visible={this.props.detailsModalVisible_WJQ}
        visible={true}
        footer={false}
        onCancel={this.onCancel}
      >
        {
          defaultPollutantCode && <Ent
            selectedTags={status !== undefined ? [status] : undefined}
            stopStatus={stopStatus !== undefined ? [stopStatus] : undefined}
            defaultPollutantCode={defaultPollutantCode}
            hideBreadcrumb
          />
        }
        {
          time && <exceptionrecordNew time={time} />
        }
      </Modal>
    );
  }
}

export default DetailsModal_WJQ;