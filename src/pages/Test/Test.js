import React, { PureComponent } from 'react';
import _ from 'lodash';
import ReactSeamlessScroll from 'react-seamless-scroll';
import moment from 'moment';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Card } from 'antd';
const { Meta } = Card;
class Test extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
  }


  render() {
    return (
      <div style={{ width: '200px', height: '100px' }}>
        <ReactSeamlessScroll style={{ width: '100%', height: '100%' }}>
          <Card
            style={{
              width: 300,
            }}
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              <SettingOutlined key="setting" />,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Meta
              avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
              title="Card title"
              description="This is the description"
            />
          </Card>
        </ReactSeamlessScroll>
      </div>
    );
  }
}

export default Test;