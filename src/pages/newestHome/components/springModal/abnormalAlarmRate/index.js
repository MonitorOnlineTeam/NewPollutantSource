/*
 * @Author: Jiaqi 
 * @Date: 2020-11-06 15:29:02 
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2020-11-11 11:02:46
 * @Description: 异常报警响应率弹框
 */
import React, { PureComponent, cloneElement } from 'react';
import { Modal } from "antd"
import { connect } from "dva"
import Ent from "@/pages/monitoring/overView/realtime/Ent"
// import ExceptionrecordNew from "@/pages/monitoring/exceptionrecordNew/index"
// import RegionDetails from "@/pages/monitoring/exceptionrecordNew/RegionDetails"
import AbnormalResRate from "@/pages/IntelligentAnalysis/dataAlarm/abnormalResRate/index"
import RegionDetails from "@/pages/IntelligentAnalysis/dataAlarm/abnormalResRate/RegionDetails"
import CityLevel from "@/pages/IntelligentAnalysis/dataAlarm/abnormalResRate/CityLevel"

@connect(({ loading, newestHome, autoForm }) => ({
}))
class Index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      show: true
    };
  }
  componentDidUpdate(props) {
    if (props.visible !== this.props.visible) {
      this.setState({
        regionCodeOneLevel: undefined,
        queryConditions: undefined,
        show: true,
        cityLevel: false,
      })
    }
  }
  // componentWillUnmount() {
  //   this.setState({
  //     regionCodeOneLevel: undefined,
  //     queryConditions: undefined,
  //   })
  // }

  // 关闭弹窗
  onCancel = () => {
    this.props.onCancel()
  }

  render() {
    const { status, stopStatus, type, time, visible } = this.props
    const { regionCodeOneLevel, queryConditions, show, cityLevel } = this.state;    
    return (
      <Modal
        title="异常报警响应率"
        wrapClassName='spreadOverModal'
        visible={visible}
        footer={false}
        onCancel={this.onCancel}
        destroyOnClose
      >
        {
          type && !time && <Ent
            selectedTags={status !== undefined ? [status] : undefined}
            stopStatus={stopStatus !== undefined ? [stopStatus] : undefined}
            defaultPollutantCode={type}
            hideBreadcrumb
          />
        }
        {
          time && show && <AbnormalResRate defaultPollutantCode={type} time={time} hideBreadcrumb onRegionClick={(regionCode) => {
            this.setState({
              regionCodeOneLevel: regionCode,
              cityLevel: true,
              show: false
            })
          }} />
        }
        {
          cityLevel && <CityLevel hideBreadcrumb
            location={{ query: { regionCode: regionCodeOneLevel } }}
            onRegionClick={(queryCondition) => {
              this.setState({
                queryConditions: queryCondition,
                cityLevel: false,
                show: false
              })
            }}
            onBack={() => {
              this.setState({
                queryCondition: undefined,
                cityLevel: false,
                show: true
              })
            }} />
        }
        {
          queryConditions && !cityLevel && <RegionDetails hideBreadcrumb
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

export default Index;