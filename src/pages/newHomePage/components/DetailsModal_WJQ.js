/*
 * @Author: Jiaqi 
 * @Date: 2020-11-06 15:29:02 
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2020-11-11 11:02:46
 * @Description: 废气废水监测点弹窗
 */
import React, { PureComponent } from 'react';
import { Modal } from "antd"
import { connect } from "dva"
import Ent from "@/pages/monitoring/overView/realtime/Ent"
// import ExceptionrecordNew from "@/pages/monitoring/exceptionrecordNew/index"
// import RegionDetails from "@/pages/monitoring/exceptionrecordNew/RegionDetails"
import AbnormalResRate from "@/pages/IntelligentAnalysis/dataAlarm/abnormalResRate/index"
import RegionDetails from "@/pages/IntelligentAnalysis/dataAlarm/abnormalResRate/RegionDetails"
import CityLevel from "@/pages/IntelligentAnalysis/dataAlarm/abnormalResRate/CityLevel"

@connect(({ loading, home, autoForm }) => ({
  detailsModalVisible_WJQ: home.detailsModalVisible_WJQ,
}))
class DetailsModal_WJQ extends PureComponent {
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
    const { status, stopStatus, defaultPollutantCode, time } = this.props
    const { queryCondition,queryConditions, show,cityLevel } = this.state;
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
          defaultPollutantCode && !time && <Ent
            selectedTags={status !== undefined ? [status] : undefined}
            stopStatus={stopStatus !== undefined ? [stopStatus] : undefined}
            defaultPollutantCode={defaultPollutantCode}
            hideBreadcrumb
          />
        }
        {
          time && show && <AbnormalResRate time={time} hideBreadcrumb onRegionClick={(queryCondition) => {
            this.setState({
              queryCondition: queryCondition,
              cityLevel:true,
              show: false
            })
          }} />
        }
        {
          cityLevel && <CityLevel hideBreadcrumb 
          location={{ query: { queryCondition: queryCondition } }}
          onRegionClick={(queryCondition) => {
            this.setState({
              queryConditions: queryCondition,
              cityLevel:false,
              show: false
            })
          }}
          onBack={() => {
            this.setState({
              queryCondition: undefined,
              cityLevel:false,
              show: true
            })
          }} />
        }
                {
          queryConditions &&  !cityLevel&&<RegionDetails hideBreadcrumb 
          location={{ query: { queryCondition: queryConditions } }}
          onBack={() => {
            this.setState({
              queryConditions: undefined,
              cityLevel: true,
              show: false
            })
          }} />
        }
      </Modal>
    );
  }
}

export default DetailsModal_WJQ;