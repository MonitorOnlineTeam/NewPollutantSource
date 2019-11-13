import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Button, Input, Select, InputNumber, Tabs, Form, Row, Col, Divider } from 'antd';
import { connect } from 'dva';
import NavigationTree from '@/components/NavigationTree'
import RemoteControlPage from './RemoteControlPage'


const FormItem = Form.Item;
const Option = Select.Option;
const { TabPane } = Tabs;

@Form.create()
@connect(({ loading, qualityControl }) => ({
  standardGasList: qualityControl.standardGasList,
}))
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      QCAMN: null,
    };
    this._SELF_ = {
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
      },
    }
  }

  render() {

    return (
      <>
        <NavigationTree QCAUse="1" onItemClick={value => {
          if (value.length > 0 && !value[0].IsEnt && value[0].QCAType == "2") {
            console.log("123123=", value[0])
            this.setState({
              QCAMN: value[0].key
            })
          }
        }} />
        <div id="contentWrapper">
          <PageHeaderWrapper>
            {this.state.QCAMN && <RemoteControlPage QCAMN={this.state.QCAMN} />}
          </PageHeaderWrapper>
        </div>
      </>
    );
  }
}

export default index;