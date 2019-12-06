import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Alert, Row, Col, Select, Button } from 'antd'
import { connect } from 'dva'
import moment from 'moment';
import NavigationTree from '@/components/NavigationTree'
import RealTimeContrastPage from './RealTimeContrastPage'

@connect()
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      DGIMN: null
    };
  }

  render() {
    return (
      <>
        <NavigationTree onItemClick={value => {
          if (value.length && !value[0].IsEnt && value[0].key) {
            this.setState({
              DGIMN: value[0].key
            })
            this.props.dispatch({
              type: "qualityControlModel/updateState",
              payload: {
                currentDGIMN: value[0].key,
                DGIMNList: []
              }
            })
            this.props.dispatch({
              type: "qualityControlModel/updateRealtimeData",
              payload: {}
            })
          }
        }} />
        <div id="contentWrapper">
          <PageHeaderWrapper>
            <div className="contentContainer">
              {this.state.DGIMN && <RealTimeContrastPage DGIMN={this.state.DGIMN} flag={true} />}
            </div>
          </PageHeaderWrapper>
        </div>
      </>
    );
  }
}

export default index;