import React, { PureComponent } from 'react';
import styles from './index.less'
import $script from 'scriptjs';
import { message, Drawer, Tooltip, Tree, Button, Modal, Space, Radio, Badge, Divider, Spin, Tag, Input } from 'antd';
import { Map, Marker, Markers, Circle, MouseTool } from 'react-amap';
import { connect } from 'dva'
import config from "@/config";
import CustomIcon from '@/components/CustomIcon';
import { EntIcon } from '@/utils/icon';

let thisMap;
let talkManager;
let MoniterManager;
const { amapKey } = config;
const { Search } = Input;

@connect(({ loading, map }) => ({
  treeLoading: loading.effects['map/getTreeListByConfig']
}))
class MultimediaConference extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      treeData: [],
      markersList: [],
      isModalVisible: false,
      currentPoint: {}
    };

    // 地图
    this.amapEvents = {
      created: (mapInstance) => {
        thisMap = mapInstance;
      },
      click: e => {

      }
    };
  }

  componentDidMount() {
    let that = this;
    let isLoadgps = false;
    $script('https://200.telyes.net/static/jssdk/js/TY.js', function (a) {
      window.TY.login({
        account: 'SCHBJ',
        password: 'JXyz@2019',
        serverUrl: 'https://200.telyes.net'
      }, function (resp) {
        //成功回调
        if (resp.rights) {
          console.log("resp=", resp)

          window.TY.DeviceManager.getDevicesByParams({}, function (resp) {//成功
            console.log(resp)
            if (isLoadgps) {
              return;
            }
            isLoadgps = true;
            var rows = resp.rows
            that.getTreeData(rows)
          }, function (resp) {//失败
            console.log(resp)
          })


        } else {
          message.error('该用户没有权限，无法登入')
        }
      }, function (resp) {
        //失败回调
        message.error('登入失败')
      });
    })
  }

  componentWillUnmount() {
    thisMap = undefined;
    talkManager = undefined;
    MoniterManager = undefined;
  }

  getTreeData = (dataList) => {
    this.props.dispatch({
      type: "map/getTreeListByConfig",
      payload: {
        dataList: dataList
      },
      callback: (res, markersList) => {
        console.log('markersList=', markersList)
        this.setState({
          treeData: res,
          markersList: markersList
        }, () => {
          setTimeout(() => {
            thisMap.setFitView();
          }, 1000)
        })
      }
    })
  }


  renderMarkers = (extData) => {
    const mapStyle = {
      fontSize: 24,
      borderRadius: '50%',
      background: '#fff',
      boxShadow: '0px 0px 3px 2px #fff',
    }
    const style = { fontSize: 24, color: '#34c066', ...mapStyle }
    return <div>
      <Tooltip overlayClassName={styles.tooltip} color={"#fff"}
        title={
          <span style={{ color: "#000" }}>{extData.title}
          </span>
        }
      >
        <div className={''} onClick={() => this.onItemClick(extData)}>
          <CustomIcon type="icon-fangwu" style={style} />
        </div>
      </Tooltip>
    </div >
  }

  onItemClick = (data) => {
    this.setState({
      isModalVisible: true,
      currentPoint: data
    }, () => {
      this.start(data.id)
    })
  }


  // 打开视频
  start = (uid) => {
    //监控盒子ID，用来装置监控视频
    var el = 'monitor';
    //监控人员ID
    var uid = uid;//用户id,通过设备管理类获取部门和设备成员获取设备信息。(TY.DeviceManager.loadDepartentDevice)
    //通过监控管理类向指定人员发起监控
    MoniterManager = window.TY.MoniterManager();
    MoniterManager.startMoniter({
      'el': el,
      'id': uid
    }, function (resp) {
      console.log("监控成功回调", resp);
      message.success("监控成功");
      //如果需要，还可以通过设备管理类获取媒体信息
      window.TY.DeviceManager.getMediaInfo({
        id: [uid]
      }, function (resp) {
        //设置当前媒体连接状态
        MoniterManager.setMediaStatus(uid, resp.data);
      });
    }, function (resp) {
      console.warn("监控失败回调", resp);
      message.error(resp.msg);
    }, function (resp) {
      console.info("监控信息回调", resp);
    });
  };

  // 关闭视频
  closeVideo(uid) {
    var params = { id: uid };
    MoniterManager.stopMoniter(params, function (resp) {
      message.success("操作成功");
    }, function (resp) {
    });
  }

  // 发言 - 添加人员
  addUser = (id) => {
    talkManager = window.TY.TalkManager();
    let users = [id]
    //创建调度
    var params = {
      personnel: users
    };
    talkManager.activeDispatchGroup(params, (resp) => {
      this.setState({
        curGid: resp.id
      })
    }, function (resp) {
    });

    var params = {
      id: talkManager.getCurGid(),
      type: window.TY.GroupManager.TYPE.DISPATCH,
      personnel: users
    };
    window.TY.GroupManager.addUser(params, function (resp) {
      console.log('resp=', resp)
    }, function (resp) {
      console.log('resp2=', resp)
    });
  }

  removeUser = () => {
    let users = [this.state.currentPoint.id]
    if (talkManager) {
      var params = {
        id: talkManager.getCurGid(),
        type: window.TY.GroupManager.TYPE.DISPATCH,
        personnel: users
      };
      window.TY.GroupManager.deleteUser(params, function (resp) {
        console.log('aaa=', resp)
        this.deleteGroup();
      }, function (resp) {
        console.log('aaa2=', resp)
      });
    }
  }

  deleteGroup = () => {
    var params = {
      id: talkManager.getCurGid(),
      type: window.TY.GroupManager.TYPE.DISPATCH,
      personnel: [404]
    };
    talkManager.inactiveDispatchGroup(params, function (resp) {
      console.log('bbb=', resp)

    }, function (resp) {
      console.log('bbb2=', resp)
    });
  }

  // 开启发言
  testApplyForSpeak = () => {
    var id = this.state.curGid;
    if (talkManager) {
      talkManager.startTalk({
        id: id
      }, function (resp) {
        recordResp("result", resp);
      })
    }
  }
  // 结束发言
  testApplyForEndSpeak = () => {
    var id = this.state.curGid;
    if (talkManager) {
      talkManager.stopTalk({
        id: id
      }, function (resp) {
        recordResp("result", resp);
      })
    }
  }


  onSelect = (keys, info) => {
    console.log('keys=', keys)
    if (keys !== '0') {
      this.onItemClick(info.node);
    }
  };

  onExpand = () => {
    console.log('Trigger Expand');
  };

  treeTitleRender = (nodeData) => {
    if (nodeData.key === '0') {
      return <div className={styles.treeTitleBox}>
        <span className={styles.icon}>
          <EntIcon style={{ fontSize: 16 }} />
        </span>
        {nodeData.title}
      </div>
    } else {
      return <div className={styles.treeTitleBox}>
        <span className={styles.icon}>
          <a><CustomIcon type="icon-fangwu" style={{ fontSize: 16 }} /></a>
        </span>
        {/* <a></a> */}
        {nodeData.title}
        <Tag style={{ marginLeft: 14 }} color={'success'}>{'正常'}</Tag>
      </div>

    }
  }

  render() {
    const { treeData, markersList, isModalVisible, currentPoint } = this.state;
    const { treeLoading } = this.props;
    return (
      <div
        className={styles.pageWrapper}
      >
        <Drawer
          // title="排放量分析"
          width={300}
          closable={false}
          placement="left"
          // onClose={this.onClose}
          visible={true}
          bodyStyle={{ paddingBottom: 80 }}
          // getContainer={() => this.div}
          mask={false}
          style={{ marginTop: 64 }}
          className={styles.toggleDrawer}
        >
          <Search placeholder="关键字" style={{ marginBottom: 16 }} />
          {
            treeData.length ?
              <Tree
                defaultExpandAll
                autoExpandParent
                showLine={{ showLeafIcon: false }}
                showIcon={false}
                onSelect={this.onSelect}
                onExpand={this.onExpand}
                treeData={treeData}
                titleRender={(nodeData) => {
                  return this.treeTitleRender(nodeData)
                }}
              />
              : <div className="example">
                <Spin />
              </div>
          }
        </Drawer>
        <Map
          amapkey={amapKey}
          events={this.amapEvents}
          zoom={5}
        >
          <Markers
            markers={markersList}
            // className={this.state.special}
            render={this.renderMarkers}
          />
        </Map>
        <Modal
          title={`${currentPoint.name} - 远程监控`}
          visible={isModalVisible}
          footer={false}
          width={'70vw'}
          onCancel={() => {
            this.removeUser()
            this.setState({ isModalVisible: false })
          }}
          bodyStyle={{
            display: 'flex',
            flexDirection: 'column',
            width: '70vw',
            height: '60vh'
          }}
        >
          <div style={{ flex: 'none', marginBottom: 10 }}>
            <Space style={{ flex: 'none' }}>
              <div>
                视频状态：<Badge status="success" text="打开" />
              </div>
              <Divider type="vertical" />
              <div>
                发言状态：<Badge status="success" text="正在发言" />
              </div>
            </Space>
            <Space style={{ flex: 'none', float: 'right' }}>
              <Radio.Group defaultValue="open" onChange={(e) => {
                if (e.target.value === 'open') {
                  this.start(currentPoint.id);
                } else {
                  this.closeVideo(currentPoint.id)
                }
              }}>
                <Radio.Button value="open">打开视频</Radio.Button>
                <Radio.Button value="close">关闭视频</Radio.Button>
              </Radio.Group>
              <Radio.Group onChange={(e) => {
                if (e.target.value === 'open') {
                  this.addUser(currentPoint.id);
                } else {
                  this.testApplyForEndSpeak()
                }
              }}>
                <Radio.Button value="open">打开发言</Radio.Button>
                <Radio.Button value="close">关闭发言</Radio.Button>
              </Radio.Group>
            </Space>
          </div>
          <div id="monitor" style={{ background: '#000', marginTop: 10, flex: 1 }}></div>
        </Modal>
      </div>
    );
  }
}

export default MultimediaConference;