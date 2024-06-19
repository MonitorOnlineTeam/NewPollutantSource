import React, { PureComponent } from 'react';
import loader from '@/utils/loader'
import { connect } from 'dva';
import styles from './BackVideoApi.less'
import moment from 'moment';
import { Spin } from 'antd'

const style1 = {
  color: '#fff',
  fontSize: '16px',
  fontWeight: 500,
  textAlign: 'center',
  paddingTop: '20%',
  position: 'absolute',
  top: 0,
  width: '100%',
  textAlign: 'center'
}
let TimeData = null;


@connect(({ video, loading }) => ({
  loading: loading.effects['video/GetPlaybackURL'],
  HKPlaybackVideoUrl: video.HKPlaybackVideoUrl,
  backData: video.backData,
}))
class Playback extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.h5player = null;
  }

  componentDidMount() {
    this.props.onRef(this)
    // this.onStopPlay();
    Promise.all([
      this._loadJSPluginFile(),
    ]).then(() => {
      this.initPlugin();
    })
  }

  componentDidUpdate(prevProps, prevState) {
    // if (this.props.CameraCode !== prevProps.CameraCode) {
    //   this.onStopPlay();
    //   clearInterval(TimeData);
    //   TimeData = null;
    //   $(document).off("mousedown");
    //   $(document).off("mouseup");
    //   $(document).off("mousemove");

    //   // this.props.dispatch({
    //   //   type: 'video/updateState',
    //   //   payload: {
    //   //     HKPlaybackVideoUrl: ''
    //   //   }
    //   // }).then(() => {
    //   Promise.all([
    //     this._loadJSPluginFile(),
    //   ]).then(() => {
    //     this.initPlugin();
    //   })
    //   // })
    // }
  }

  componentWillUnmount() {
    this.setState({ beginTime: undefined, endTime: undefined })
    // this.onStopPlay();
    this.onStopPlay();
    clearInterval(TimeData);
    TimeData = null;
    $(document).off("mousedown");
    $(document).off("mouseup");
    $(document).off("mousemove");
  }

  // 获取监控点预览取流URL
  onPlayClick = (beginTime, endTime) => {
    let _beginTime = moment(beginTime).format("YYYY-MM-DDT00:00:00")
    let _endTime = moment(endTime).format("YYYY-MM-DDT23:59:59")

    this.onStopPlay();
    clearInterval(TimeData);
    TimeData = null;
    $(document).off("mousedown");
    $(document).off("mouseup");
    $(document).off("mousemove");

    const { CameraCode } = this.props;
    this.props.dispatch({
      type: 'video/GetPlaybackURL',
      payload: {
        CameraCode: CameraCode,
        BeginTime: _beginTime,
        EndTime: _endTime
      }
    }).then(() => {
      this.setState({
        beginTime: _beginTime, endTime: _endTime
      }, () => {
        this.handleRule();
        this.handleBackCursor();
        this.onPlay();
      })
    })
  }


  // 初始化
  initPlugin = () => {
    const { id } = this.props;
    if (!this.h5player) {
      this.h5player = new this.JSPlugin({
        szId: id, //需要英文字母开头 必填
        szBasePath: '/js/video/HK/', // 必填,引用H5player.min.js的js相对路径
        iMaxSplit: 1,
        iCurrentSplit: 2,
        oStyle: {
          borderSelect: '#FFCC00',
        }
      })
    }
  }

  onPlay = () => {
    let { beginTime, endTime } = this.state;
    let { HKPlaybackVideoUrl } = this.props;
    if (this.h5player) {
      let index = this.h5player.currentWindowIndex,
        playURL = HKPlaybackVideoUrl, mode = 1;
      beginTime += 'Z'
      endTime += 'Z'
      this.h5player.JS_Play(playURL, { playURL, mode }, index, beginTime, endTime).then(
        () => {
          this.handTimer();
          console.log('realplay success')
        },
        e => {
          console.error(e)
        }
      )
    }
  }

  // 停止播放
  onStopPlay = () => {
    if (this.h5player) {
      this.h5player.JS_Stop().then(
        () => { console.log('stop realplay success') },
        e => { console.error(e) }
      )
    }
  }

  // 文件加载
  _loadJSPluginFile = () => {
    if (window.JSPlugin) {
      if (!this.JSPlugin) this.JSPlugin = window.JSPlugin;
      return Promise.resolve();
    } else {
      return loader('/js/video/HK/h5player.min.js', 'JSPlugin')
        .then(() => {
          this.JSPlugin = window.JSPlugin;
          return Promise.resolve();
        }).catch(error => {
          console.error('Load file fail!');
        });
    }
  }


  /* 定位回放 */
  seekTo(dateTime) {
    let endDate = this.state.endTime;
    if (this.h5player) {
      // if (this.h5player.aWndList.length > 0 && !this.h5player.aWndList[0].bLoad) {
      //   console.log('111111')
      //   this.onPlay();
      // } else {
      console.log('dateTime', dateTime)
      console.log('endDate', endDate)
      let index = this.h5player.currentWindowIndex;
      let beginTime = dateTime += 'Z'
      let endTime = endDate += 'Z'
      debugger
      this.h5player.JS_Seek(index, beginTime, endTime).then(
        () => {
          console.info('JS_Seek success');
          // do you want...
        },
        (err) => {
          console.info('JS_Seek failed', err);
          // do you want...
        }
      );
      // }
    }
  }


  //尺子渲染
  handleRule = () => {
    let _this = this;
    renderTimeMinutes();
    renderTimeTexts();
    TimeUpdate();
    function TimeUpdate() {
      if ($("#time-cursor").position().left >= 1440 + $("#time-day").position().left) {
        $("#time-cursor")[0].style.left = (1440 - 1 + $("#time-day").position().left) + "px";
      }
      var m = moment().hour(0).minute($("#time-cursor").position().left - $("#time-day").position().left);
      $("#time-cursor-text").text(m.format("HH:mm")).data("changed", true);
    }
    function renderTimeTexts() {
      let textStyle = {
        float: 'left',
        width: '4.1666%',
        // width: '60px',
        borderLeft: '1px solid #999',
        borderTop: '1px solid #999',
        userSelect: 'none',
        textAlign: 'center',
        height: '25px',
        lineHeight: '25px',
      }
      $("#time-day #time-text").remove();
      for (var i = 0; i < 24; i++) {
        var $text = $("<div id='time-text'></div>");
        $text.css(textStyle);
        var m = moment().hour(i).minute(0).second(0);
        $text.text(m.format("HH:mm"));
        $text.addClass("time-" + m.format("HH"));
        $("#time-day").append($text);
      }
    }

    function renderTimeMinutes() {
      let minuteStyle = {
        float: 'left',
        width: '0.0695%',
        // width: '1px',
        height: '8px',
        margin: '0',
      }
      $("#time-day #time-minute").remove();
      for (var i = 0; i < 1440; i++) {
        var $minute = $("<div id='time-minute'></div>");
        $minute.css(minuteStyle);
        var m = moment().hour(0).minute(i);
        $minute.addClass("time-" + m.format("HH-mm"));
        if (_this.props.backData && _this.props.backData.length > 0) {
          let YYYYMM = moment(_this.state.beginTime).format("YYYY-MM-DD")
          $minute[0].setAttribute("date", m.format(`${YYYYMM}THH:mm:00`))
        }
        $("#time-day").append($minute);
      }
    }

    $(document).on("mousedown", "#time-cursor-text,#time-day", function (e) {
      $(this).data("pageX", e.pageX);
    }).on("mouseup", function (e) {
      if ($("#time-cursor")) {
        var Hm = moment().hour(0).minute($("#time-cursor").position().left - $("#time-day").position().left);
        if (Hm.format("HH:mm") != _this.state.InitialTime) {
          _this.setState({
            InitialTime: Hm.format("HH:mm")
          })
          let Minutes = (moment(Hm).format('HH') * 60) + (moment(Hm).format('mm') * 1);
          if ($("#time-day")) {
            let beginTime = $("#time-day")[0].children[Minutes].getAttribute("beginTime");
            let endTime = $("#time-day")[0].children[Minutes].getAttribute("endTime");
            let dateTime = $("#time-day")[0].children[Minutes].getAttribute("date");
            if (dateTime) {
              console.log("dateTime=", dateTime)
              _this.seekTo(dateTime);
              _this.handTimer(TimeUpdate);
            }
          }
          TimeUpdate();
        }
      }
      if ($("#time-cursor-text").data("changed")) {
        $("#time-cursor-text").removeData("changed");
      }
      $("#time-cursor-text,#time-day").removeData("pageX");
    }).on("mousemove", function (e) {
      var pageX = $("#time-cursor-text").data("pageX");
      if (pageX != undefined && $("#time-cursor")) {
        $("#time-cursor-text").data("pageX", e.pageX);
        var moveX = e.pageX - pageX;
        var left = $("#time-cursor").position().left + moveX;
        left = left < 0 ? 0 : left;
        left = left > ($("#time-rule").innerWidth() - 1) ? ($("#time-rule").innerWidth() - 1) : left;
        $("#time-cursor")[0].style.left = left + "px";
        TimeUpdate();
      }
      if (left) {
        pageX = $("#time-day").data("pageX");
        var curLeft = $("#time-day").position().left;
      }
      if (pageX != undefined && $("#time-day") && ($(".time-rule").innerWidth() < $("#time-day").outerWidth() || curLeft < 0)) {
        $("#time-day").data("pageX", e.pageX);
        var moveX = e.pageX - pageX;
        var left = $("#time-day").position().left + moveX;
        left = left > 0 ? 0 : left;
        var minLeft = $("#time-rule").innerWidth() - $("#time-day").outerWidth();
        left = left < minLeft ? minLeft : left;
        $("#time-day")[0].style.left = left + "px";
        TimeUpdate();
      }
    }).on("mousedown", "#time-minute", function (e) {
      if ($("#time-day")) {
        var left = $(this).position().left + $("#time-day").position().left;
        $("#time-cursor")[0].style.left = left + "px";
        TimeUpdate();
      }
    })

  }

  //渲染刻度颜色
  handleBackCursor = () => {
    let { backData } = this.props;
    var myElement = document.getElementById("time-minute");
    if (myElement && backData && backData.length > 0) {
      backData.map((item, index) => {
        let startMinutes = (moment(item.beginTime).format('HH') * 60) + (moment(item.beginTime).format('mm') * 1);
        let endMinutes = (moment(item.endTime).format('HH') * 60) + (moment(item.endTime).format('mm') * 1);
        for (startMinutes; startMinutes <= endMinutes; startMinutes++) {
          if (item.Alarm && item.Alarm.IsAlarm) {
            $("#time-day")[0].children[startMinutes].style.background = '#e1270a';
          } else {
            $("#time-day")[0].children[startMinutes].style.background = '#0e62a7';
          }
          $("#time-day")[0].children[startMinutes].setAttribute("beginTime", item.beginTime);
          $("#time-day")[0].children[startMinutes].setAttribute("endTime", item.endTime);
        }
      })
    }
    // this.playbackStart();
  }

  //重置刻度颜色
  handleTimeMinuteColor = () => {
    let { backData } = this.props;
    var timsDay = $("#time-day");
    if (timsDay) {
      for (var i = 0; i < 1440; i++) {
        var m = moment(this.state.rangeDate.format('YYYY-MM-DD')).hour(0).minute(i);
        timsDay[0].children[i].setAttribute("date", m.format('YYYY-MM-DDTHH:mm:ss'));
        timsDay[0].children[i].style.background = '#f5f5f5';
        timsDay[0].children[i].setAttribute("videoId", null)
      }
    }
  }

  //重新加载计时器
  handTimer = (TimeUpdate) => {
    if (TimeData) {
      clearInterval(TimeData);
      TimeData = null;
    }
    this.IntervalGetTime(TimeUpdate);
  }

  // 加载列表数据
  IntervalGetTime = (TimeUpdate) => {
    TimeData = setInterval(() => {
      this.getOSDTime(TimeUpdate);
    }, 5000)
  }

  //视频播放获取时间
  getOSDTime = (TimeUpdate) => {
    let _this = this;
    if (this.h5player) {
      let player = this.h5player,
        index = player.currentWindowIndex
      player.JS_GetOSDTime(index).then(function (time) {
        let Time = moment(time).format('YYYY-MM-DDTHH:mm:ss');
        console.log('Time', Time)
        // if(Time>=_this.state.EndTime){
        //    _this.playbackPause();
        //    clearInterval(TimeData);
        // }else{
        let Minutes = (moment(time).format('HH') * 60) + (moment(time).format('mm') * 1);
        $("#time-cursor")[0].style.left = Minutes + "px";
        if (TimeUpdate) {
          TimeUpdate();
        } else {
          $("#time-cursor-text").text(moment(time).format("HH:mm")).data("changed", true);
        }
        // }
      });
    }
  }

  render() {
    const { CameraCode, id, loading, HKPlaybackVideoUrl } = this.props;
    const { beginTime, endTime } = this.state;
    return <>
      {
        CameraCode ?
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <div className={styles.playbackWrapper} id={id} style={{ height: 'calc(100% - 74px)', backgroundColor: '#000', zIndex: 999 }}>
            </div>
            {
              (!beginTime && !endTime) && <p style={style1}>请选择时间后播放！</p>
            }
            {
              (beginTime && endTime && !HKPlaybackVideoUrl) && <p style={style1}>无信号！</p>
            }
            <div className={styles.timeContent}>
              <div id='time-rule' className={styles.timeRule}>
                <div id='time-day' className={styles.timeDay}>
                </div>
                <div id='time-cursor' className={styles.timeCursor}>
                  <div id='time-cursor-text' className={styles.timeCursorText}>00:00</div>
                </div>
              </div>
            </div>
          </div>
          // <div id={id} style={{ height: '100%', backgroundColor: '#000', zIndex: 999 }}> </div>
          :
          <div className="notData">
            <img src="/nodata1.png" style={{ width: '120px', dispatch: 'block' }} />
            <p style={{ color: "#d5d9e2", fontSize: 16, fontWeight: 500 }}>暂无数据</p>
          </div>
      }

    </>
  }
}

Playback.defaultProps = {
  id: 'play_window'
}

export default Playback;