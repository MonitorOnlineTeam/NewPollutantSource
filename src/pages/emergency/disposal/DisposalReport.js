import React, { PureComponent } from 'react';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import { Layout, Menu, Card } from 'antd'
import { connect } from 'dva'

import FieldSurvey from './components/FieldSurvey'
import EmergencyDisposal from './components/EmergencyDisposal'
import Express from './components/Express'

const { Sider, Content } = Layout;
@connect(({ loading, emergency }) => ({
  dictionaryList: emergency.dictionaryList,
}))
class DisposalReport extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentKey: '1'
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'emergency/getDictionaryList',
      payload: {}
    })
  }



  render() {
    const { currentKey } = this.state;
    const AlarmInfoCode = this.props.history.location.query.code;

    return (
      <BreadcrumbWrapper title="处置报告">
        <Layout style={{ padding: '14px 0', background: '#fff' }}>
          <Sider width={220} style={{ background: '#fff' }}>
            <Menu mode="inline" defaultSelectedKeys={['1']}
              onSelect={(item, key, keyPath, selectedKeys, domEvent) => {
                this.setState({ currentKey: item.key })
              }}
            >
              <Menu.Item key="1">
                现场调查
              </Menu.Item>
              <Menu.Item key="2">
                应急处置
              </Menu.Item>
              <Menu.Item key="3">
                应急快报
              </Menu.Item>
            </Menu>
          </Sider>
          <Content
            className="site-layout-background"
            style={{
              marginLeft: 20,
              minHeight: 280,
            }}
          >
            {currentKey === '1' && <FieldSurvey AlarmInfoCode={AlarmInfoCode} />}
            {currentKey === '2' && <EmergencyDisposal AlarmInfoCode={AlarmInfoCode} />}
            {currentKey === '3' && <Express AlarmInfoCode={AlarmInfoCode} />}
          </Content>
        </Layout>
      </BreadcrumbWrapper>
    );
  }
}

export default DisposalReport;