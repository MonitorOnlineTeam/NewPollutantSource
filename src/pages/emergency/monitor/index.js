import React, { PureComponent } from 'react';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import { Layout, Menu, Card } from 'antd'
import { connect } from 'dva'
import Factor from './components/Factor'
import Point from './components/Point'
import Record from './components/Record'
// import Equipped from './components/Equipped'
// import Vehicle from './components/Vehicle'

const { Sider, Content } = Layout;
@connect(({ loading, emergency }) => ({
  dictionaryList: emergency.dictionaryList,
}))
class MonitorPage extends PureComponent {
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
      <BreadcrumbWrapper title="处置监测">
        <Layout style={{ padding: '14px 0', background: '#fff' }}>
          <Sider width={220} style={{ background: '#fff' }}>
            <Menu mode="inline" defaultSelectedKeys={['1']}
              onSelect={(item, key, keyPath, selectedKeys, domEvent) => {
                this.setState({ currentKey: item.key })
              }}
            >
              <Menu.Item key="1">
                采样因子
              </Menu.Item>
              <Menu.Item key="2">
                监测布点
              </Menu.Item>
              <Menu.Item key="3">
                监测点采样记录
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
            {currentKey === '1' && <Factor AlarmInfoCode={AlarmInfoCode} />}
            {currentKey === '2' && <Point AlarmInfoCode={AlarmInfoCode} />}
            {currentKey === '3' && <Record AlarmInfoCode={AlarmInfoCode} />}
            {/* {currentKey === '4' && <Equipped />} */}
            {/* {currentKey === '5' && <Vehicle />} */}
          </Content>
        </Layout>
      </BreadcrumbWrapper>
    );
  }
}

export default MonitorPage;