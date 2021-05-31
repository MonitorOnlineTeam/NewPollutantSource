import React, { PureComponent } from 'react';
import styles from '../Home.less';
import CustomIcon from '@/components/CustomIcon'
import Marquee from '@/components/Marquee'

const alarmInfoList = [
  {
    desc: `<ul>
      <li>2020-09-07 14:45:04</li>
      <li>京能集团-脱硫入口1</li>
      <li>质控不合格</li>
    </ul>`,
  },
  {
    desc: `<ul>
      <li>2020-09-07 03:52:01</li>
      <li>京能集团-废水排口</li>
      <li>数据超标</li>
    </ul>`,
  },
  {
    desc: `<ul>
      <li>2020-09-08 03:30:00</li>
      <li>南邵基地-测试样机</li>
      <li>质控不合格</li>
    </ul>`,
  },
  {
    desc: `<ul>
      <li>2020-09-08 13:51:30</li>
      <li>南邵基地-测试样机</li>
      <li>质控不合格</li>
    </ul>`,
  },
  {
    desc: `<ul>
      <li>2020-09-07 14:45:04</li>
      <li>京能集团-废气排放口</li>
      <li>数据异常</li>
    </ul>`,
  },
  {
    desc: `<ul>
      <li>2020-09-08 13:53:05</li>
      <li>南邵基地-测试样机</li>
      <li>质控不合格</li>
    </ul>`,
  },
  {
    desc: `<ul>
      <li>2020-09-07 14:45:04</li>
      <li>南邵基地-报警测试</li>
      <li>数据异常</li>
    </ul>`,
  },
  {
    desc: `<ul>
      <li>2020-09-08 13:53:05</li>
      <li>南邵基地-测试样机</li>
      <li>质控不合格</li>
    </ul>`,
  },
  {
    desc: `<ul>
      <li>2020-09-07 14:45:04</li>
      <li>京能集团-脱硫入口</li>
      <li>质控不合格</li>
    </ul>`,
  },
  {
    desc: `<ul>
      <li>2020-09-07 14:45:04</li>
      <li>京能集团-脱硫入口</li>
      <li>质控不合格</li>
    </ul>`,
  },
  {
    desc: `<ul>
      <li>2020-09-07 14:45:04</li>
      <li>京能集团-废气排放口</li>
      <li>数据异常</li>
    </ul>`,
  },
]

class RealtimeAlarm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className={styles.realtimeAlarmContainer}>
        <ul className={styles.header}>
          <li>报警时间</li>
          <li>排口</li>
          <li>报警类型</li>
        </ul>
        <div style={{ height: "calc(100% - 42px)" }}>
          <Marquee
            data={alarmInfoList}
            speed={50}
            gap={200}
            height={"100%"}
            width={"100%"}
          />
        </div>
        {/* <ul>
          <li>2020-09-07 14:45:04</li>
          <li>京能集团-脱硫入口</li>
          <li>质控不合格</li>
        </ul>
        <ul>
          <li>2020-09-07 14:45:04</li>
          <li>京能集团-脱硫入口</li>
          <li>质控不合格</li>
        </ul>
        <ul>
          <li>2020-09-07 14:45:04</li>
          <li>京能集团-脱硫入口</li>
          <li>质控不合格</li>
        </ul>
        <ul>
          <li>2020-09-07 14:45:04</li>
          <li>京能集团-脱硫入口</li>
          <li>质控不合格</li>
        </ul>
        <ul>
          <li>2020-09-07 14:45:04</li>
          <li>京能集团-脱硫入口</li>
          <li>质控不合格</li>
        </ul>
        <ul>
          <li>2020-09-07 14:45:04</li>
          <li>京能集团-脱硫入口</li>
          <li>质控不合格</li>
        </ul> */}
      </div>
    );
  }
}

export default RealtimeAlarm;