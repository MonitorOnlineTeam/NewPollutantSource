import React, { PureComponent } from 'react';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import { Layout, Menu, Card } from 'antd'
import { connect } from 'dva'
import Specialist from './components/Specialist'
import RescueTeam from './components/RescueTeam'
import Wuzi from './components/Wuzi'
import Equipped from './components/Equipped'
import Vehicle from './components/Vehicle'

const { Sider, Content } = Layout;

@connect()
class DispatchPage extends PureComponent {
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
    // const AlarmInfoCode = '';

    return (
      <BreadcrumbWrapper title="应急调度管理">
        <Layout style={{ padding: '14px 0', background: '#fff' }}>
          <Sider width={220} style={{ background: '#fff' }}>
            <Menu mode="inline" defaultSelectedKeys={['1']}
              onSelect={(item, key, keyPath, selectedKeys, domEvent) => {
                console.log('item==', item)
                console.log('key==', key)
                this.setState({ currentKey: item.key })
              }}
            >
              <Menu.Item key="1">
                专家调度
              </Menu.Item>
              <Menu.Item key="2">
                应急救援队
              </Menu.Item>
              <Menu.Item key="3">
                物资调度
              </Menu.Item>
              <Menu.Item key="4">
                应急装备
              </Menu.Item>
              <Menu.Item key="5">
                车辆调度
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
            {currentKey === '1' && <Specialist AlarmInfoCode={AlarmInfoCode} />}
            {currentKey === '2' && <RescueTeam AlarmInfoCode={AlarmInfoCode} />}
            {currentKey === '3' && <Wuzi AlarmInfoCode={AlarmInfoCode} />}
            {currentKey === '4' && <Equipped AlarmInfoCode={AlarmInfoCode} />}
            {currentKey === '5' && <Vehicle AlarmInfoCode={AlarmInfoCode} />}
          </Content>
        </Layout>
      </BreadcrumbWrapper>
    );
  }
}

export default DispatchPage;