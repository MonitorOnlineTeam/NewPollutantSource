import React, { Component } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import { Card, Alert, Row, Col, Select, Button } from 'antd'
import { connect } from 'dva'
import moment from 'moment';
import NavigationTree from '@/components/NavigationTree'
import ResultContrastPage from './ResultContrastPage'

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
          console.log("value=", value)
          if (value.length && !value[0].IsEnt && value[0].key) {
            this.setState({
              DGIMN: value[0].key
            })
          }
        }} />
        <div id="contentWrapper">
          <BreadcrumbWrapper>
            {this.state.DGIMN && <ResultContrastPage DGIMN={this.state.DGIMN} flag={true}/>}
          </BreadcrumbWrapper>
        </div>
      </>
    );
  }
}

export default index;