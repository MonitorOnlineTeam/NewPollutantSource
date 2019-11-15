import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
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
          <PageHeaderWrapper>
            {this.state.DGIMN && <ResultContrastPage DGIMN={this.state.DGIMN} />}
          </PageHeaderWrapper>
        </div>
      </>
    );
  }
}

export default index;