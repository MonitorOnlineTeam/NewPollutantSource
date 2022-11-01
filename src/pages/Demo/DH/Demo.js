import React, { PureComponent } from 'react'
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import { Card, Row, Col, Input, Button, Form } from 'antd'
import request from "umi-request";
import { getTime, getNonce, getCalcSign } from './utils'
import './imouplayer.js'

class demo extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getToken = () => {
    const time = getTime();
    const nonce = getNonce();
    const appSecret = 'ca4ca8a3b7e042178a1086c55172f6';
    const sign = getCalcSign(time, nonce, appSecret);
    const id = Math.round(Math.random() * 100);
    fetch(`https://openapi.lechange.cn/openapi/accessToken`, {
      method: 'POST', // or 'PUT'
      body: JSON.stringify({
        "system": {
          "ver": "1.0",
          "appId": "lcee7ab678f03c40c5",
          "sign": sign,
          "time": time,
          "nonce": nonce
        },
        "id": id,
        "params": {

        }
      })
    })
      .then(res => res.json())
      .catch(error => console.error('Error:', error))
      .then(response => {
        if (response.result.code === '0') {
          Cookies.set('LCYAccessToken', response.result.data.accessToken, { expires: 2 });
          this.setState({ accessToken: response.data.accessToken });
        }
      });
    // 
  }



  componentDidMount() {
    // this.initVideo();
  }

  playVideo = (kitToken) => {
    let player;
    let playerOption = {
      isEdit: false,
      // isEdit: false,
      url: 'imou://open.lechange.com/7F06590PAG18B31/0/1?streamId=1',
      kitToken: 'Kt_bec38abb52104d87ae2a162cf4e30dd9',
      // 是否自动播放
      autoplay: true,
      // 是否显示控制台
      controls: true,
      // 是否开启静音
      automute: false,
      themeData: [{
        area: 'header',
        fontColor: '#F18D00',
        backgroundColor: '#FFFFFF',
        activeButtonColor: '#0E72FF',
        buttonList: [{
          show: true,
          id: 'deviceName',
          name: '设备名称',
          position: 'left',
        }, {
          show: true,
          id: 'channalId',
          name: '设备通道',
          position: 'left',
        }, {
          show: true,
          id: 'cloudVideo',
          name: '云录像',
          position: 'right',
        }, {
          show: true,
          id: 'localVideo',
          name: '本地录像',
          position: 'right',
        }]
      }, {
        area: 'footer',
        fontColor: '#F18D00',
        backgroundColor: '#FFFFFF',
        activeButtonColor: '#0E72FF',
        buttonList: [{
          show: true,
          id: 'play',
          name: '播放',
          position: 'left',
        }, {
          show: true,
          id: 'mute',
          name: '音量控制',
          position: 'left',
        }, {
          show: true,
          id: 'talk',
          name: '语音对讲',
          position: 'left',
        }, {
          show: true,
          id: 'capture',
          name: '截图',
          position: 'left',
        }, {
          show: true,
          id: 'definition',
          name: '清晰度控制',
          position: 'right',
        }, {
          show: true,
          id: 'PTZ',
          name: '云台控制',
          position: 'right',
        }, {
          show: true,
          id: 'webExpend',
          name: '网页全屏',
          position: 'right',
        }, {
          show: true,
          id: 'extend',
          name: '全屏控制',
          position: 'right',
        }]
      }],
    };

    if (player) {
      player.destroy()
    }
    player = new ImouPlayer('#DHVideo');
    const params = {
      src: [{
        url: 'imou://open.lechange.com/7F06590PAG18B31/0/1?streamId=1',
        kitToken: kitToken,
      }],
      width: 760,
      height: 400,
      autoplay: true,
      controls: true,
      themeData: playerOption.themeData
    };
    player.setup(params);
  }

  onFinish = (values) => {
    console.log('1111=', values);
    // this.playVideo(values.kitToken);
    this.getToken(values.kitToken);
  }

  onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  }

  render() {
    return (
      <BreadcrumbWrapper>
        <Card>
          <Form
            name="basic"
            layout="inline"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
            autoComplete="off"
            initialValues={{
              url: 'imou://open.lechange.com/7F06590PAG18B31/0/1?streamId=1'
            }}
          >

            <Form.Item
              label="url"
              name="url"
              rules={[
                {
                  required: true,
                  message: 'Please input your username!',
                },
              ]}
            >
              <Input style={{ width: 500 }} />
            </Form.Item>
            <Form.Item
              label="kitToken"
              name="kitToken"
              rules={[
                {
                  required: true,
                  message: 'Please input your username!',
                },
              ]}
            >
              <Input style={{ width: 300 }} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">播放</Button>
            </Form.Item>
          </Form>
          <div style={{ marginTop: 20 }} id="DHVideo" ></div>
        </Card>
      </BreadcrumbWrapper>
    );
  }
}

export default demo;