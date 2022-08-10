import React, { PureComponent } from 'react';
// import $ from 'jquery'
import $script from 'scriptjs';
import { initVideo } from './IEVideoUtils'
import styles from './index.less'

class MyVideo extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    console.log("aaa")
    this.loadScript();
  }

  // 加载视频需要的js
  loadScript = () => {
    // $script('https://code.jquery.com/jquery-3.0.0.min.js', function () {
    // $script('/js/IEVideo/foundation.js', function () {
    //   $script('/js/IEVideo/WebVideoCtrl.js', function () {

    //   })
    // })
    console.log("bbb")
    const loginData = {
      szIP: '223.84.203.240',
      szPort: 8081,
      szUsername: 'dshbjk',
      szPassword: 'admin123456',
      rtspPort: 80,
      protocol: 0,
    }
    initVideo(loginData);
    // })
  }
  render() {
    return (
      <div id="divPlugin" className={styles.Plugin}></div>
    );
  }
}

export default MyVideo;