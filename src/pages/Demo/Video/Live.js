import React, { PureComponent } from 'react'
import { Button, Card, Input, Form, Space } from 'antd'
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import '@public/js/video/jessibuca.js'


class Live extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      playUrl: 'http://172.16.12.135:8091/rtp/44010200492000000002_34020000001320000002.live.flv',
    }
  }

  componentDidMount() {
    this.create();
  }

  create() {//创建jessibuca播放器
    // var showOperateBtns = true; // 是否显示按钮
    // var forceNoOffscreen = true; //
    let $container = document.getElementById('container');//容器
    this.jessibuca = new window.Jessibuca({
      container: $container,//播放器容器
      videoBuffer: 0.2, // 缓存时长
      isResize: false, //适应浏览器
      isFlv: true,
      text: "",
      loadingText: "加载中....",
      decoder: "/js/video/decoder.js",//必须与引入jessibuca.js在同一个文件夹
      useMSE: false,
      debug: false,
      hasAudio: false,//是否开启声音，谷歌不支持开启声音，
      useWCS: false,
      //showBandwidth: true, // 显示网速
      operateBtns: {//配置按钮
        fullscreen: true,
        screenshot: true,
        play: true,
        audio: true,
      },
      //forceNoOffscreen: true,//离屏渲染
      isNotMute: false,//是否开启声音
    });

  }

  play = (playUrl) => {
    if (this.jessibuca && playUrl) {
      this.jessibuca.play(playUrl);
      // this.setState({
      //   isPlaying: true
      // })
    }
  }

  pause = () => {
    if (this.jessibuca) {
      this.jessibuca.pause();
      // this.setState({
      //   isPlaying: false
      // })
    }
  }

  destroy = () => {
    if (this.jessibuca) {
      this.jessibuca.destroy();
      // this.setState({
      //   isPlaying: false
      // })
    }
    this.create();
  }

  onFinish = (values) => {
    console.log('1111=', values);
    this.play(values.url);
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
              url: 'http://172.16.12.135:8091/rtp/44010200492000000003_44010200492000000003.live.flv'
            }}
          >

            <Form.Item
              label="url"
              name="url"
              rules={[
                {
                  required: true,
                  message: 'Please input your url!',
                },
              ]}
            >
              <Input style={{ width: 500 }} />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">播放</Button>
                <Button type="primary" onClick={this.pause}>暂停</Button>
                <Button type="primary" onClick={this.destroy}>销毁</Button>
              </Space>
            </Form.Item>
          </Form>
          <div style={{ width: '100%', height: '700px', marginTop: 20 }} id='container'></div>
        </Card>
      </BreadcrumbWrapper>
    );
  }
}

export default Live;