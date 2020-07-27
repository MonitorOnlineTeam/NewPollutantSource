import React, { Component } from 'react'
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Select, Input, Button, Card, Modal, Tabs, Descriptions, Spin, Empty } from 'antd';
import { Map, Markers, InfoWindow, Polygon } from 'react-amap';
import { connect } from 'dva';
import moment from 'moment';
import NavigationTree from '@/components/NavigationTree'
import styles from './index.less'
import { isEqual } from 'lodash';
import Item from 'antd/lib/list/Item';
import { EntIcon, GasIcon, WaterIcon } from '@/utils/icon';
import DataQuery from '../monitoring/dataquery/components/DataQuery'
import AlarmRecord from '../monitoring/alarmrecord//components/AlarmRecord'
import ReactEcharts from 'echarts-for-react';
import RecordEchartTableOver from '@/components/recordEchartTableOver'
import RecordEchartTable from '@/components/recordEchartTable'
const { TabPane } = Tabs;
const entZoom = 11;
const pointZoom = 13;
let _thismap = null;

@Form.create()
@connect(({ loading, test }) => ({
  allEntAndPointList: test.allEntAndPointList,
  defaultMapInfo: test.defaultMapInfo,
  tableList: test.tableList,
  chartData: test.chartData,
  loading: loading.effects["test/getAllEntAndPoint"]
}))
class Test extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      createMap: false,
      displayType: 1,
      currentPointInfo: {},
      // mapCenter: { longitude: 110.520708, latitude: 38.969114 },
      infoWindowVisible: false,
      coordinateSet: [],
      markersList: [],
      currentEntInfo: {}
    }
    // this.markers = randomMarker(10);
    // console.log("markers=", this.markers)
    // this.mapCenter = { longitude: 115, latitude: 40 };
    //地图事件
    this.mapEvents = {
      created: (m) => {
        _thismap = m;
        this.setState({
          createMap: true
        })
      },
      zoomchange: (value) => {
        console.log('value=', value)
        console.log('///=', _thismap.getZoom())
        const zoom = _thismap.getZoom();
        // 地图缩放，显示企业
        if (zoom < entZoom) {
          console.log('allEntAndPointList=', props.allEntAndPointList)
          // const displayType = this.state.displayType === 1
          this.setState({
            infoWindowVisible: this.state.coordinateSet.length ? false : true,
            coordinateSet: [],
            displayType: 0,
          }, () => {
            this.randomMarker(this.props.allEntAndPointList)
          })
        }
      },
      complete: () => {
      }
    };
  }

  componentDidMount() {
    // 获取所有企业及排口信息
    this.props.dispatch({
      type: 'test/getAllEntAndPoint',
    })

    // 获取废水污染物
    this.props.dispatch({
      type: 'test/getPollutantWaterList',
      payload: {
        pollutantTypes: 1
      }
    })
    // 获取废气污染物
    this.props.dispatch({
      type: 'test/getPollutantGasList',
      payload: {
        pollutantTypes: 2
      }
    })
  }

  // 渲染坐标点
  renderMarker = (extData) => {
    // let extData = extData;
    return <div onClick={() => {
      if (extData) {
        _thismap.setCenter([extData.position.longitude, extData.position.latitude])
        // 设置平移
        this.setState({
          mapCenter: extData.position,
          // displayType: extData.position.type,
          infoWindowVisible: true,
          currentKey: extData.position.key,
          currentPointInfo: extData.position,
          // currentEntInfo: extData.position
        }, () => {
          console.log("PollutantType=", extData)
          this.state.displayType !== 0 && this.getPointInfo(extData.position.PollutantType)
        })
      }
    }}>{
        this.state.displayType === 0 ?
          <EntIcon style={{ fontSize: 40 }} /> :
          (extData.position.PollutantType === "2" ?
            <a><GasIcon style={{ fontSize: 24 }} /></a> :
            <a><WaterIcon style={{ fontSize: 24 }} /></a>)

      }</div>
  }



  // 渲染点或企业
  randomMarker = (dataList = this.state.currentEntInfo.children) => {
    // const dataList = type === 0 ? this.props.allEnterpriseList : this.props.ponitList;
    const markersList = dataList.map((itm, idx) => {
      if (itm.Longitude && itm.Latitude) {
        return {
          position: {
            ...itm,
            // type: type,
            longitude: itm.Longitude,
            latitude: itm.Latitude,
          },
          // render: () => {
          //   return <div style={{ width: 40, height: 40, background: "red" }} >{itm.EntName}</div>
          // }
        }
      }
      return {}
    })
    this.setState({
      markersList,
      // displayType: type,
      // infoWindowVisible: false,
    })
  }

  // 点击气泡获取数据
  getPointInfo = (pollutantType) => {
    // 获取table数据
    this.props.dispatch({
      type: 'test/getPointTableData',
      payload: {
        DGIMNs: this.state.currentKey,
        dataType: "HourData",
        isLastest: true,
        type: pollutantType
      }
    })
    // 获取图表数据
    // this.props.dispatch({
    //   type: 'test/getPointChartData',
    //   payload: {
    //     DGIMNs: this.state.currentKey,
    //     endTime: moment(new Date()).format('YYYY-MM-DD HH:00:00'),
    //     beginTime: moment(new Date()).add('hour', -23).format('YYYY-MM-DD HH:00:00'),
    //     dataType: "hour",
    //     isAsc: true
    //   }
    // })
  }


  markersEvents = {
    created: (allMarkers) => {
      console.log('All Markers Instance Are Below');
      console.log(allMarkers);
    },
    clickable: true,
    click: (MapsOption, marker) => {
      const extData = marker.getExtData();
      const index = extData.myIndex;
      // alert(`点击的是第${index}号坐标点`);
      // console.log(extData === _this.markers[index]);
    },
    dragend: (MapsOption, marker) => { /* ... */ },
    // mouseover: (MapsOption, marker) => {
    //   this.setState({
    //     infoWindowVisible: true,
    //   });
    // },
    // mouseout: (MapsOption, marker) => {
    //   this.setState({
    //     infoWindowVisible: false,
    //   });
    // },
  }

  // 绘制厂界
  drawPolygon = () => {
    let res = [];
    if (this.state.coordinateSet) {
      let arr = eval(this.state.coordinateSet);
      for (let i = 0; i < arr.length; i++) {
        res.push(<Polygon
          // events={this.polygonEvents}
          // key={item.entCode+i}
          // extData={item}
          style={{
            strokeColor: '#FF33FF',
            strokeOpacity: 0.2,
            strokeWeight: 3,
            fillColor: '#595959',
            fillOpacity: 0.35,
          }}
          path={arr[i]}
        />);
      }
    }
    return res;
  }

  windowEvents = {
    created: (iw) => { console.log(iw) },
    open: () => { console.log('InfoWindow opened') },
    close: () => {
      this.setState({
        infoWindowVisible: false
      })
    },
    change: () => { console.log('InfoWindow prop changed') },
  }

  componentWillReceiveProps(nextProps) {
    const { defaultMapInfo } = this.props;
    if (defaultMapInfo !== nextProps.defaultMapInfo) {
      setTimeout(() => {
        _thismap.setZoomAndCenter(pointZoom, [nextProps.defaultMapInfo.Longitude, nextProps.defaultMapInfo.Latitude])
        this.setState({
          coordinateSet: nextProps.defaultMapInfo.CoordinateSet,
          currentEntInfo: nextProps.defaultMapInfo
        })
        this.randomMarker(nextProps.defaultMapInfo.children);
      }, 2000)
    }
  }


  render() {
    const { form: { getFieldDecorator }, allEntAndPointList, ponitList, loading, chartData } = this.props;
    const { currentEntInfo, currentKey } = this.state;
    const option = {
      legend: {
        data: [chartData.legend]
      },
      tooltip: {
        trigger: 'axis',
        formatter: function (params, ticket, callback) {
          let res = `${params[0].axisValue}时<br/>`;
          params.map(item => {
            res += `${item.seriesName}:${item.value}<br />`;
          });
          return res;
        }
      },
      toolbox: {
        show: true,
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        name: '时间',
        boundaryGap: false,
        data: chartData.xAxisData
      },
      yAxis: {
        type: 'value',
        name: '浓度(' + 'mg/m³' + ')',
        axisLabel: {
          formatter: '{value}'
        },
      },
      series: [{
        type: 'line',
        name: chartData.legend,
        data: chartData.seriesData,
        // markLine: {
        //   symbol: 'none', // 去掉警戒线最后面的箭头
        //   data: [{
        //     lineStyle: {
        //       type: 'dash',
        //       color: '#54A8FF',
        //     },
        //     // yAxis: polluntinfo.standardValue
        //   }]
        // },
        itemStyle: {
          normal: {
            color: '#54A8FF',
            lineStyle: {
              color: '#54A8FF'
            }
          }
        },
      },
      ]
    };


    const plugins = [
      'MapType',  // 地图模式（卫星）
      'Scale', //
      'OverView',
      "ToolBar",
      // 'ControlBar', // v1.1.0 新增
      // {
      //   name: 'ToolBar',
      //   options: {
      //     visible: true,  // 不设置该属性默认就是 true
      //     onCreated(ins) {
      //       console.log(ins);
      //     },
      //   },
      // }
    ]
    console.log('currentEntInfo=', this.state.currentEntInfo)
    if (loading) {
      return (<Spin
        style={{
          width: '100%',
          height: 'calc(100vh/2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        size="large"
      />);
    }
    return (
      <>
        <NavigationTree choice={false} onItemClick={(val) => {
          if (val[0]) {
            this.setState({
              currentKey: val[0].key
            })
            let entInfo = allEntAndPointList.filter(item => item.key === val[0].key)
            if (entInfo.length) {
              // 点击的企业
              const position = [entInfo[0]["Longitude"], entInfo[0]["Latitude"]];
              this.randomMarker(allEntAndPointList)
              _thismap.setZoomAndCenter(entZoom, position)
              this.setState({
                displayType: 0,
                infoWindowVisible: true,
                mapCenter: position,
                currentEntInfo: entInfo[0],
                coordinateSet: []
              })
            } else {
              console.log('this.state.currentEntInfo=', this.state.currentEntInfo)
              const entInfo = allEntAndPointList.find(item => {
                if (item.children.filter(itm => itm.key === val[0].key).length) {
                  return item;
                }
              })
              console.log('entInfo=', entInfo)
              // 点击的排口
              let pointInfo = entInfo.children.filter(item => item.key === val[0].key)[0];
              console.log('pointInfo=', pointInfo)
              if (entInfo) {
                const position = [pointInfo["Longitude"], pointInfo["Latitude"]];
                _thismap.setZoomAndCenter(pointZoom, position)
                this.randomMarker(entInfo.children)
                this.setState({
                  mapCenter: position,
                  infoWindowVisible: true,
                  displayType: 1,
                  currentEntInfo: entInfo,
                  currentPointInfo: pointInfo,
                  coordinateSet: entInfo.CoordinateSet || this.props.coordinateSet
                }, () => {
                  console.log('pointInfo=', pointInfo)
                  this.getPointInfo(pointInfo.PollutantType)
                })
              }
            }
          }
        }} />
        <div id="contentWrapper" style={{ height: 'calc(100vh - 64px)', marginLeft: "400px" }}>
          <Map
            amapkey={"c5cb4ec7ca3ba4618348693dd449002d"}
            plugins={plugins}
            // center={this.state.mapCenter}
            events={this.mapEvents}
          >
            {this.drawPolygon()}
            <InfoWindow
              position={this.state.mapCenter}
              autoMove={true}
              size={{ width: 430, height: 370 }}
              // closeWhenClickMap={true}
              visible={this.state.infoWindowVisible}
              offset={[10, -25]}
              events={this.windowEvents}
            // isCustom
            >
              {console.log('this.state.displayType=', this.state.displayType)}
              {
                this.state.displayType == 0 ?
                  <div>
                    <span>11111</span>
                    <Button style={{ position: "absolute", right: 10, bottom: 10 }} onClick={() => {
                      // _thismap.setZoomAndCenter(13, [118.520708, 38.969114])
                      this.setState({
                        infoWindowVisible: false
                      })
                      let pointInfo = this.state.currentEntInfo.children;
                      if (pointInfo) {
                        const position = [pointInfo[0]["Longitude"], pointInfo[0]["Latitude"]];
                        _thismap.setZoomAndCenter(pointZoom, position)
                        this.randomMarker()
                        this.setState({
                          mapCenter: position,
                          // infoWindowVisible: true,
                          displayType: 1,
                          // currentEntInfo: entInfo[0],
                          coordinateSet: this.state.currentEntInfo.CoordinateSet || this.props.coordinateSet
                        })
                      }
                    }}>更多</Button>
                  </div> : <div className={styles.pointInfoWindow}>
                    {
                      (!this.props.tableList.length && !this.props.chartData.seriesData.length) ?
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> :
                        <>
                          <Descriptions title={this.state.currentPointInfo.title} size="small" bordered>
                            {
                              this.props.tableList.map(item => {
                                return <Descriptions.Item label={item.label}><div onClick={() => {
                                  this.props.dispatch({
                                    type: "test/updateChartData",
                                    payload: {
                                      key: item.key,
                                      label: item.label
                                    }
                                  })
                                }} className={styles.content}>{item.value}</div></Descriptions.Item>
                              })
                            }
                          </Descriptions>
                          <div style={{ fontSize: 16, textAlign: 'center', padding: '10px 15px 0 15px' }}>{chartData.legend}24小时趋势图</div>
                          <ReactEcharts
                            className={styles.echartdiv}
                            style={{ width: '100%', height: '200px', textAlign: 'center', padding: '0 15px 0 15px' }}
                            option={option}
                            notMerge={true}
                            lazyUpdate={true} />
                          {/* <Button style={{ position: "absolute", right: 10, bottom: 10 }} onClick={() => { */}
                          <Button style={{ float: 'right', fontSize: 13 }} size="small" onClick={() => {
                            this.setState({
                              pointVisible: true
                            })
                          }}>排口详情</Button>
                        </>
                    }

                  </div>
              }
            </InfoWindow>
            <Markers
              markers={this.state.markersList}
              events={this.markersEvents}
              render={this.renderMarker}
              content={<span>111</span>}
            />
          </Map>
          <Modal
            title="排口详情"
            width="80%"
            footer={null}
            style={{ maxHeight: '80vh' }}
            visible={this.state.pointVisible}
            onOk={() => {
              this.setState({
                pointVisible: false,
              });
            }}
            onCancel={() => {
              this.setState({
                pointVisible: false,
              });
            }}
          >
            <Tabs>
              <TabPane tab="历史数据" key="1">
                <div style={{ maxHeight: '60vh', overflowY: "auto" }}>
                  {console.log('currentKey=', currentKey)}
                  <DataQuery DGIMN={currentKey} />
                </div>
              </TabPane>
              <TabPane tab="视频管理" key="2">
                Content of tab 2
              </TabPane>
              <TabPane tab="报警记录" key="3">
                <div style={{ maxHeight: '60vh', overflowY: "auto" }}>
                  <AlarmRecord DGIMN={currentKey} />
                </div>
              </TabPane>
              <TabPane tab="异常记录" key="4">
                <div style={{ maxHeight: '60vh', overflowY: "auto" }}>
                  <RecordEchartTable DGIMN={currentKey} />
                </div>
              </TabPane>
              <TabPane tab="超标记录" key="5">
                <div style={{ maxHeight: '60vh', overflowY: "auto" }}>
                  <RecordEchartTableOver DGIMN={currentKey} />
                </div>
              </TabPane>
            </Tabs>
          </Modal>
        </div>
      </>

    );
  }
}

export default Test
